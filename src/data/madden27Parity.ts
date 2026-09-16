export type ParityState = "CONFIRMED_SHARED" | "PROBABLE_SHARED" | "CFB27_ONLY" | "UNKNOWN" | "NOT_APPLICABLE";

export interface MaddenParityRule {
  surfacePattern: RegExp;
  state: ParityState;
  reason: string;
}

export const MADDEN27_PROFILE = {
  name: "Madden27", dataVersion: 20260813, assetLoader: "Madden26AssetLoader", assetCompiler: "Madden27AssetCompiler",
  textureImporter: "TextureImporter", sdk: "Madden27SDK", ebxReader: "EbxReaderRiff", ebxWriter: "EbxWriterRiff",
  canImportMeshes: false, canExportMeshes: true, canLaunchMods: false,
  source: "https://github.com/FMTDev/FMT.Madden26Plugin/blob/51ce8ef8abc76c2c31445f27b45f0c0bebd8a186/Madden27Profile.json"
} as const;

export const CFB27_PROFILE = {
  name: "CFB27", dataVersion: 20260709, assetLoader: "Madden26AssetLoader", assetCompiler: "CFB27AssetCompiler",
  textureImporter: "TextureImporter", sdk: "CFB27SDK", ebxReader: "EbxReaderRiff", ebxWriter: "EbxWriterRiff",
  canImportMeshes: true, canExportMeshes: true, canLaunchMods: true,
  source: "https://github.com/FMTDev/FMT.Madden26Plugin/blob/51ce8ef8abc76c2c31445f27b45f0c0bebd8a186/CFB27Profile.json"
} as const;

export const MADDEN_PARITY_RULES: readonly MaddenParityRule[] = [
  { surfacePattern: /TEAM_BUILDER_JSON|DERIVED_TEXTURE_PNG|SAVE_FRTK_CHARACTER|RUNTIME_FRTK|RUNTIME_NATIVE/, state: "CFB27_ONLY", reason: "Current evidence is CFB27-specific; do not infer Madden parity." },
  { surfacePattern: /SAVE_FRTK|ROSTER_CONTAINER|SAVE_SCHEMA/, state: "UNKNOWN", reason: "Madden 27 save/schema bindings require an explicit Madden table/field crosswalk." },
  { surfacePattern: /FROSTBITE_(EBX|RES|CHUNK|TOOLING|TEXTURE)/, state: "PROBABLE_SHARED", reason: "FMT uses shared loader/EBX/texture infrastructure, but target assets and compiler behavior remain title-specific." },
  { surfacePattern: /FROSTBITE_MESH/, state: "PROBABLE_SHARED", reason: "Madden27 profile can export meshes but currently reports CanImportMeshes=false; treat write parity as constrained." },
  { surfacePattern: /FROSTBITE_FTC/, state: "UNKNOWN", reason: "CFB27 FTC table identities and semantics cannot be projected onto Madden 27 without title-specific decoding." },
  { surfacePattern: /FILESYSTEM|HYBRID|EXTERNAL_APP|READ_ONLY_SAVE_MAP/, state: "NOT_APPLICABLE", reason: "Architecture/workspace pattern rather than a title-level game binding." },
];

export function parityForSurface(surface: string): MaddenParityRule {
  return MADDEN_PARITY_RULES.find((r) => r.surfacePattern.test(surface)) ?? { state: "UNKNOWN", reason: "No explicit Madden 27 binding exists for this surface." , surfacePattern: /.*/ };
}
