import http from "node:http";
import { chooseLoopbackRedirect } from "./lib/siwc-core.mjs";

const CONNECTED_HTML =
  "<!doctype html><title>MODerator connected</title>" +
  "<body style='font-family:system-ui;background:#001b3a;color:#fff;padding:40px'>" +
  "<h1>MODerator connected.</h1><p>You can close this window and return to the app.</p></body>";

export async function createCallbackServer(expectedState) {
  let timer;
  let resolveCallback;
  let rejectCallback;
  const callbackPromise = new Promise((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });

  const server = http.createServer((req, res) => {
    try {
      const u = new URL(req.url ?? "/", "http://127.0.0.1");
      if (u.pathname !== "/auth/callback") {
        res.writeHead(404).end("Not found");
        return;
      }
      if (u.searchParams.get("state") !== expectedState) throw new Error("OAuth state mismatch");
      const error = u.searchParams.get("error");
      if (error) throw new Error(`OpenAI authorization declined: ${error}`);
      const code = u.searchParams.get("code");
      if (!code) throw new Error("OAuth callback missing code");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(CONNECTED_HTML);
      clearTimeout(timer);
      resolveCallback({
        code,
        clientId: u.searchParams.get("client_id"),
        scope: u.searchParams.get("scope") ?? "",
      });
      setTimeout(() => server.close(), 50);
    } catch (err) {
      res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(err?.message ?? err));
      clearTimeout(timer);
      rejectCallback(err);
      setTimeout(() => server.close(), 50);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  timer = setTimeout(() => {
    server.close();
    rejectCallback(new Error("ChatGPT sign-in timed out"));
  }, 5 * 60 * 1000);

  return {
    redirectUri: chooseLoopbackRedirect(server.address().port),
    callbackPromise,
    close: () => server.close(),
  };
}
