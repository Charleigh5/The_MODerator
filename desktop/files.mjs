import { app, dialog } from "electron";
import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { inspectStudioPlan } from "./lib/studio-plan.mjs";
import { readOnlyWatchSnapshot } from "./lib/mod-watch-read.mjs";
import {
  emptyNexusInbox,
  inspectNexusReviewPack,
  mergeNexusInbox,
} from "./lib/nexus-review-offline.mjs";
import { userPath } from "./credentials.mjs";

const TEXT_EXTENSIONS = new Set([".json", ".csv", ".txt", ".md"]);
const reviewInboxPath = () => userPath("nexus-review-inbox.json");

function hashFile(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = createReadStream(file);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

export async function pickLocalFile(getWindow) {
  const result = await dialog.showOpenDialog(getWindow(), {
    title: "Select a MODerator source file",
    properties: ["openFile"],
    filters: [
      {
        name: "Gridiron sources",
        extensions: ["sav", "db", "ftc", "fbmod", "json", "csv", "txt", "md", "zip"],
      },
      { name: "All files", extensions: ["*"] },
    ],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const file = result.filePaths[0];
  const stat = await fs.stat(file);
  const ext = path.extname(file).toLowerCase();
  let preview = null;
  if (TEXT_EXTENSIONS.has(ext) && stat.size <= 2 * 1024 * 1024) {
    preview = (await fs.readFile(file, "utf8")).slice(0, 200000);
  }
  return {
    path: file,
    name: path.basename(file),
    extension: ext,
    size: stat.size,
    sha256: await hashFile(file),
    preview,
  };
}

export async function importStudioPlan(getWindow) {
  const chosen = await dialog.showOpenDialog(getWindow(), {
    title: "Inspect a Madden 27 Studio plan",
    properties: ["openFile"],
    filters: [{ name: "Madden Studio JSON plan", extensions: ["json"] }],
  });
  if (chosen.canceled || !chosen.filePaths[0]) return null;
  const file = chosen.filePaths[0];
  const stat = await fs.stat(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) {
    throw new Error("Plan must be a JSON file under 1 MiB.");
  }
  return { name: path.basename(file), ...inspectStudioPlan(await fs.readFile(file, "utf8")) };
}

export async function reviewInbox() {
  const parse = async (file) => {
    const parsed = JSON.parse(await fs.readFile(file, "utf8"));
    if (
      parsed.schema !== "MODERATOR_NEXUS_REVIEW_INBOX_V1" ||
      !Array.isArray(parsed.records) ||
      parsed.records.length > 1000 ||
      parsed.automaticScoringEnabled !== false
    ) {
      throw Error("INVALID_REVIEW_INBOX");
    }
    // Local JSON edits cannot self-promote a review into trusted scoring evidence.
    return {
      ...parsed,
      records: parsed.records.map((record) => ({
        ...record,
        provenanceState: "USER_ATTESTED_PENDING_VERIFICATION",
        qualityVoteEligible: false,
        gameRuntimeVerified: false,
      })),
    };
  };
  try {
    return await parse(reviewInboxPath());
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    try {
      return await parse(`${reviewInboxPath()}.previous`);
    } catch (backupErr) {
      if (backupErr.code !== "ENOENT") throw backupErr;
      return emptyNexusInbox();
    }
  }
}

export async function importNexusReviewPack(getWindow) {
  const selection = await dialog.showOpenDialog(getWindow(), {
    title: "Import authorized review summary JSON — no Nexus network access",
    properties: ["openFile"],
    filters: [{ name: "Authorized MODerator evidence", extensions: ["json"] }],
  });
  if (selection.canceled || !selection.filePaths[0]) return null;
  const file = selection.filePaths[0];
  const fileInfo = await fs.stat(file);
  if (!fileInfo.isFile() || fileInfo.size > 256 * 1024) throw Error("PACK_TOO_LARGE");
  const verifiedStructure = inspectNexusReviewPack(await fs.readFile(file, "utf8"));
  const merged = mergeNexusInbox(await reviewInbox(), verifiedStructure);
  const temp = `${reviewInboxPath()}.new`;
  const backup = `${reviewInboxPath()}.previous`;
  // Preserve an independent recovery copy; Windows can deny rename-over-existing.
  await fs.writeFile(temp, JSON.stringify(merged, null, 2), "utf8");
  const existing = await fs
    .stat(reviewInboxPath())
    .then(() => true)
    .catch((err) => {
      if (err.code === "ENOENT") return false;
      throw err;
    });
  if (existing) {
    await fs.copyFile(reviewInboxPath(), backup);
    await fs.unlink(reviewInboxPath());
  }
  try {
    await fs.rename(temp, reviewInboxPath());
  } catch (err) {
    if (existing) await fs.copyFile(backup, reviewInboxPath()).catch(() => {});
    throw err;
  } finally {
    await fs.unlink(temp).catch(() => {});
  }
  return {
    added: merged.added,
    conflicts: merged.conflicts,
    recordCount: merged.records.length,
    promotion: "PENDING_PERMISSION_AND_SOURCE_VERIFICATION",
    scoringApplied: false,
    userNotice: "User attestation is not independent permission verification.",
  };
}

export async function readModWatchSnapshot() {
  try {
    const raw = await fs.readFile(path.join(app.getPath("userData"), "mod-watch", "latest.json"), "utf8");
    return readOnlyWatchSnapshot(raw);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}
