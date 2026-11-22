import { app, BrowserWindow } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import { userPath } from "./credentials.mjs";

const SMOKE_SCRIPT = `(async () => {
  const buttons = () => Array.from(document.querySelectorAll("button"));
  const sample = buttons().find(b => b.textContent?.includes("Player equipment"));
  sample?.click();
  await new Promise(resolve => setTimeout(resolve, 100));
  const promptReady = Boolean(document.querySelector("#m27-prompt")?.value?.includes("visor"));
  buttons().find(b => b.textContent?.includes("Analyze request"))?.click();
  await new Promise(resolve => setTimeout(resolve, 250));
  buttons().find(b => b.textContent?.includes("Mod intelligence library"))?.click();
  await new Promise(resolve => setTimeout(resolve, 220));
  const libraryCards = document.querySelectorAll(".m27-lib-card").length;
  const libraryOpen = Boolean(document.querySelector(".m27-lib[role=dialog]"));
  buttons().find(b => b.textContent?.includes("Community quality audit"))?.click();
  await new Promise(resolve => setTimeout(resolve, 450));
  const liveWatchItems = document.querySelectorAll(".m27-ci-live-items a").length;
  const patchCards = document.querySelectorAll(".m27-ci-patch").length;
  const assessmentRows = document.querySelectorAll(".m27-ci-row").length;
  const communityPanel = Boolean(document.querySelector(".m27-ci"));
  const reviewAdapterReady = Boolean(document.querySelector(".m27-ci-review-inbox button"));
  document.querySelector(".m27-ci-review-inbox")?.scrollIntoView({block:"center"});
  return {
    liveWatchItems,
    patchCards,
    assessmentRows,
    communityPanel,
    reviewAdapterReady,
    libraryOpen,
    libraryCards,
    title: document.title,
    bridge: Boolean(window.moderatorDesktop?.isDesktop),
    studio: Boolean(document.querySelector(".m27-shell")),
    promptReady,
    messageCount: document.querySelectorAll(".m27-message").length,
    planEnabled: Boolean(buttons().find(b => b.textContent?.includes("Download evidence plan") && !b.disabled))
  };
})()`;

async function runDesktopSmoke(win) {
  try {
    const result = await win.webContents.executeJavaScript(SMOKE_SCRIPT);
    console.log("MODERATOR_DESKTOP_SMOKE " + JSON.stringify(result));
    const ok =
      result.bridge &&
      result.studio &&
      result.promptReady &&
      result.messageCount >= 3 &&
      result.planEnabled &&
      result.libraryOpen &&
      result.libraryCards >= 37 &&
      result.communityPanel &&
      result.patchCards === 2 &&
      result.assessmentRows === 37 &&
      (!process.env.MODERATOR_SMOKE_EXPECT_LOCAL_WATCH || result.liveWatchItems >= 1) &&
      result.reviewAdapterReady;
    const code = ok ? 0 : 2;
    const png = (await win.webContents.capturePage()).toPNG();
    await fs.writeFile(userPath("desktop-nexus-review-adapter.png"), png);
    await fs.writeFile(
      userPath("desktop-smoke.json"),
      JSON.stringify({ at: new Date().toISOString(), code, result, packaged: app.isPackaged, version: app.getVersion() }, null, 2),
      "utf8"
    );
    setTimeout(() => app.exit(code), 150);
  } catch (err) {
    console.error("MODERATOR_DESKTOP_SMOKE_ERROR", err);
    await fs
      .writeFile(
        userPath("desktop-smoke.json"),
        JSON.stringify({ at: new Date().toISOString(), code: 2, error: String(err?.message ?? err), packaged: app.isPackaged, version: app.getVersion() }, null, 2),
        "utf8"
      )
      .catch(() => {});
    setTimeout(() => app.exit(2), 150);
  }
}

export function createStudioWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#001b3a",
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:") && !url.startsWith("http://127.0.0.1:3000")) {
      event.preventDefault();
    }
  });
  win.webContents.once("did-finish-load", async () => {
    if (process.env.MODERATOR_SMOKE_TEST === "1") await runDesktopSmoke(win);
  });
  const devUrl = process.env.MODERATOR_DEV_URL;
  if (devUrl) win.loadURL(devUrl);
  else win.loadFile(path.join(import.meta.dirname, "..", "dist", "index.html"));
  return win;
}
