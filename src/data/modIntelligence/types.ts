// Source-attributed research catalog types and provenance metadata.
// No third-party mod binaries or proprietary assets are embedded.
// This catalog stores discovery metadata, never a claim that code/game modifications were tested.

export interface ModCatalogEntry {
  id: string;
  title: string;
  author: string;
  kind: "Community mod" | "Code & tools";
  category: string;
  description: string;
  evidence: string;
  url: string;
  compatibility: string;
  distributionUrl?: string;
  access?: string;
  sentiment?: string;
  caveat?: string;
  license?: string;
  platform?: string[];
  target?: string;
  publishedEvidenceDate?: string;
  language?: string;
  paths?: string;
  reuse?: string;
}

export const MOD_INTELLIGENCE_UPDATED = "2026-10-09";

export const MOD_INTELLIGENCE_SOURCES = [
  "https://newsletter.operationsports.com/p/madden-mods-and-tools-showcase",
  "https://www.nexusmods.com/maddennfl27/mods/1",
  "https://www.nexusmods.com/maddennfl27/mods/1?tab=posts",
  "https://www.youtube.com/watch?v=hHmNCKg-TE8",
  "https://github.com/FMTDev/FMT.Madden26Plugin",
  "https://github.com/bep713/madden-franchise",
];
