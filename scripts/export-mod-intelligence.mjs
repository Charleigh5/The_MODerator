// Deterministic export of the source-governed research catalog; does not download mods.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { modIntelligenceCatalog, MOD_INTELLIGENCE_UPDATED, MOD_INTELLIGENCE_SOURCES } from "../.gauntlet-build/data/modIntelligence.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "docs/mod-intelligence/MOD_CATALOG_V1.json");
const blob = {
  schema: "MOD_INTELLIGENCE_CATALOG_V1",
  snapshotDate: MOD_INTELLIGENCE_UPDATED,
  game: "MADDEN27",
  sourceCategory: "RESEARCH_DERIVED_NOT_GAME_VERIFIED",
  counts: {
    total: modIntelligenceCatalog.length,
    communityMods: modIntelligenceCatalog.filter(m => m.kind === "Community mod").length,
    developerReferences: modIntelligenceCatalog.filter(m => m.kind === "Code & tools").length,
    gameTested: 0,
  },
  sources: MOD_INTELLIGENCE_SOURCES,
  rights: "Discovery metadata only. No third-party files bundled; obey original creator download, modification and redistribution permissions.",
  records: modIntelligenceCatalog,
};
if (blob.counts.total !== 37 || blob.counts.gameTested !== 0) throw new Error("Catalog count/status invariant failed");
const json = JSON.stringify(blob, null, 2) + "\n";
await mkdir(dirname(out), { recursive: true });
await writeFile(out, json, "utf8");
console.log("MOD_CATALOG_EXPORT_PASS records=" + blob.records.length + " sha256=" + createHash("sha256").update(json).digest("hex"));
