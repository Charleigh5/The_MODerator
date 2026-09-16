export interface TeamBuilderControl {
  id: string; label: string; capabilityId: string; jsonBinding: string; evidence: "GAME_VERIFIED" | "TOOL_CONFIRMED" | "NEEDS_VERIFICATION"; sourceUrl: string; notes: string;
}

const readme = "https://github.com/Jagnole/CFB-27-Team-Builder-Helper-Schema-Editor/blob/91ade58fea4bb98eed7f16c5adf34a3cc138c805/README.md";
export const TEAM_BUILDER_CONTROLS: readonly TeamBuilderControl[] = [
  { id:"number-font", label:"Jersey number font", capabilityId:"TB-NUM-FONT", jsonBinding:"two game-read number-font fields (exact JSON paths remain ZIP_INTERNAL_NEEDS_EXTRACTION)", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L22`, notes:"Repo author states both fields the game reads are written." },
  { id:"helmet-material", label:"Helmet shell/accessory material", capabilityId:"TB-HELMET-MAT", jsonBinding:"helmet shell finish + matching accessory material", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L25`, notes:"Material pair must remain synchronized." },
  { id:"vendor-decal", label:"Vendor decals", capabilityId:"TB-VENDOR", jsonBinding:"jersey/pants/socks vendor-decal material", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L27`, notes:"Known vendor library selection." },
  { id:"decal-tint", label:"Vendor decal tint", capabilityId:"TB-DECAL-TINT", jsonBinding:"jersey/pants/socks tint fields", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L30-L34`, notes:"Uses team/custom palette." },
  { id:"number-color", label:"Number color channels", capabilityId:"TB-NUM-COLOR", jsonBinding:"font-dependent color channels", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L37`, notes:"Channel count varies by font; source reports 193-font reference." },
  { id:"number-spacing", label:"Number spacing / kerning", capabilityId:"TB-NUM-SPACING", jsonBinding:"horizontal digit spacing", evidence:"GAME_VERIFIED", sourceUrl:`${readme}#L40`, notes:"Direct hidden control." },
  { id:"mask-stripe", label:"Mask & Stripe Studio", capabilityId:"TB-MASK-STRIPE", jsonBinding:"derived PNG; manual Team Builder upload", evidence:"TOOL_CONFIRMED", sourceUrl:`${readme}#L42`, notes:"Not a direct JSON mutation." },
];

export const TEAM_BUILDER_SOURCE_BOUNDARY = {
  archive: "team-builder-helper-extension-v0_76.zip",
  expectedInternalFiles: ["background.js","bridge.js","capture.js","editor.js","mask-studio.js"],
  status: "ZIP_PACKAGED_SOURCE_NOT_LINE_EXTRACTED",
  reason: "GitHub exposes the implementation as a binary ZIP; this execution surface could not obtain the archive bytes for internal line indexing. README-backed controls remain usable, but exact JSON paths must stay unresolved rather than invented."
} as const;
