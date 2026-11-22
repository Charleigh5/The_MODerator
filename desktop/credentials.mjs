import { app, safeStorage } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const userPath = (name) => path.join(app.getPath("userData"), name);
export const base64url = (buf) => Buffer.from(buf).toString("base64url");

export async function getHostId() {
  const file = userPath("siwc-host.json");
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8"));
    if (typeof parsed.ext_agent_host_id === "string" && parsed.ext_agent_host_id) {
      return parsed.ext_agent_host_id;
    }
  } catch {}
  const ext_agent_host_id = `urn:uuid:${crypto.randomUUID()}`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify({ ext_agent_host_id }, null, 2), "utf8");
  return ext_agent_host_id;
}

export async function readCredentials() {
  const file = userPath("siwc-credentials.bin");
  try {
    const encrypted = await fs.readFile(file);
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error("OS credential encryption unavailable");
    }
    return JSON.parse(safeStorage.decryptString(encrypted));
  } catch (err) {
    if (err?.code === "ENOENT") return null;
    if (String(err?.message ?? err).includes("OS credential encryption unavailable")) throw err;
    return null;
  }
}

export async function writeCredentials(record) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("OS credential encryption unavailable");
  }
  const file = userPath("siwc-credentials.bin");
  await fs.mkdir(path.dirname(file), { recursive: true });
  const encrypted = safeStorage.encryptString(JSON.stringify(record));
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, encrypted);
  await fs.rename(temp, file);
}

export async function clearCredentials() {
  try {
    await fs.unlink(userPath("siwc-credentials.bin"));
  } catch {}
}

export function publicStatus(record) {
  if (!record) return { desktop: true, connected: false, planEnabled: false };
  return {
    desktop: true,
    connected: true,
    planEnabled: Array.isArray(record.scopes) && record.scopes.includes("chatgpt.tokens.use.direct"),
    email: record.email ?? null,
    name: record.name ?? null,
    clientId: record.client_id ?? null,
    expiresAt: record.expires_at ?? null,
  };
}
