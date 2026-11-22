import { shell } from "electron";
import crypto from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  buildAuthorizeUrl,
  buildRefreshBody,
  buildTokenExchangeBody,
} from "./lib/siwc-core.mjs";
import {
  base64url,
  getHostId,
  publicStatus,
  readCredentials,
  writeCredentials,
} from "./credentials.mjs";
import { createCallbackServer } from "./oauth-callback.mjs";

const APP_NAME = "MODerator Desktop";
const TOKEN_ENDPOINT = "https://auth.openai.com/api/accounts/oauth/token";
const JWKS = createRemoteJWKSet(new URL("https://auth.openai.com/.well-known/jwks.json"));
const ISSUER = "https://auth.openai.com";

async function postForm(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OpenAI auth failed (${res.status}): ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

async function validateIdToken(idToken, clientId, nonce) {
  const { payload } = await jwtVerify(idToken, JWKS, { issuer: ISSUER, audience: clientId });
  if (payload.nonce !== nonce) throw new Error("OpenAI ID token nonce mismatch");
  if (!payload.sub) throw new Error("OpenAI ID token missing subject");
  return payload;
}

export async function signIn() {
  const existing = await readCredentials();
  const hostId = await getHostId();
  const state = base64url(crypto.randomBytes(24));
  const nonce = base64url(crypto.randomBytes(24));
  const verifier = base64url(crypto.randomBytes(48));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const listener = await createCallbackServer(state);
  const clientId = existing?.client_id ?? "dynamic_agent_client";

  const authUrl = buildAuthorizeUrl({
    clientId,
    agentName: APP_NAME,
    hostId,
    redirectUri: listener.redirectUri,
    state,
    nonce,
    codeChallenge: challenge,
    idTokenHint: existing?.id_token,
    loginHint: existing?.email,
  });
  await shell.openExternal(authUrl);
  const cb = await listener.callbackPromise;

  const issuedClientId = clientId === "dynamic_agent_client" ? cb.clientId : clientId;
  if (!issuedClientId) throw new Error("OpenAI did not return an issued client ID");
  if (clientId !== "dynamic_agent_client" && cb.clientId && cb.clientId !== clientId) {
    throw new Error("OpenAI returned an unexpected client ID");
  }

  const token = await postForm(
    TOKEN_ENDPOINT,
    buildTokenExchangeBody({
      clientId: issuedClientId,
      code: cb.code,
      codeVerifier: verifier,
      redirectUri: listener.redirectUri,
    })
  );
  const identity = await validateIdToken(token.id_token, issuedClientId, nonce);
  if (existing?.subject && existing.subject !== identity.sub) {
    throw new Error("Signed-in ChatGPT account does not match the selected saved account");
  }

  const scopes = String(token.scope ?? cb.scope ?? "").split(/\s+/).filter(Boolean);
  const now = Date.now();
  const expiresIn = Number(token.expires_in ?? 3600);
  const record = {
    email: identity.email ?? null,
    name: identity.name ?? identity.preferred_username ?? null,
    issuer: identity.iss,
    subject: identity.sub,
    client_id: issuedClientId,
    ext_agent_host_id: hostId,
    id_token: token.id_token,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    token_type: token.token_type ?? "Bearer",
    expires_in: expiresIn,
    expires_at: now + expiresIn * 1000,
    earliest_refresh_at: token.earliest_refresh_at ?? null,
    scopes,
    saved_at: new Date(now).toISOString(),
  };
  await writeCredentials(record);
  return publicStatus(record);
}

export async function refreshCredentials(record) {
  if (!record?.refresh_token || !record?.client_id) {
    throw new Error("ChatGPT session needs sign-in");
  }
  const token = await postForm(
    TOKEN_ENDPOINT,
    buildRefreshBody({ clientId: record.client_id, refreshToken: record.refresh_token })
  );
  const scopes = String(token.scope ?? record.scopes?.join(" ") ?? "").split(/\s+/).filter(Boolean);
  const now = Date.now();
  const expiresIn = Number(token.expires_in ?? 3600);
  const next = {
    ...record,
    access_token: token.access_token,
    refresh_token: token.refresh_token ?? record.refresh_token,
    id_token: token.id_token ?? record.id_token,
    token_type: token.token_type ?? record.token_type ?? "Bearer",
    expires_in: expiresIn,
    expires_at: now + expiresIn * 1000,
    earliest_refresh_at: token.earliest_refresh_at ?? record.earliest_refresh_at ?? null,
    scopes,
    saved_at: new Date(now).toISOString(),
  };
  await writeCredentials(next);
  return next;
}

export async function ensureAccessToken() {
  let record = await readCredentials();
  if (!record) throw new Error("Continue with ChatGPT first");
  if (!record.scopes?.includes("chatgpt.tokens.use.direct")) {
    throw new Error("ChatGPT plan usage was not authorized for this app");
  }
  if (!record.expires_at || record.expires_at - Date.now() < 120000) {
    record = await refreshCredentials(record);
  }
  return record;
}

export async function openAiFetch(url, options = {}, retry = true) {
  const record = await ensureAccessToken();
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers ?? {}), Authorization: `Bearer ${record.access_token}` },
  });
  if (res.status === 401 && retry) {
    await refreshCredentials(record);
    return openAiFetch(url, options, false);
  }
  return res;
}
