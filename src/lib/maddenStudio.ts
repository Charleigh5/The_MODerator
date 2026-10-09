import { compileModIntent, type ModIntentSpec } from "./modIntentCompiler.js";
import { createEvidenceBundle } from "./evidenceBundle.js";
import { createProofReceipt } from "./proofEngine.js";
import { buildRecipes } from "./buildRecipe.js";

export interface StudioSource {
  name: string;
  extension: string;
  size: number;
  sha256: string;
}

export const STUDIO_TARGET = "MADDEN27" as const;
export const STUDIO_STATUS = "GAME_ARTIFACT_NOT_BUILT" as const;

const OFF_TARGET_TITLE = /\b(?:CFB\s*\d{2}|college\s+football(?:\s*\d{2})?|NCAA(?:\s*football)?(?:\s*\d{2})?|Madden(?:\s*NFL)?\s*(?!27\b)\d{2})\b/i;
const SAVE_SURFACE = /SAVE_FRTK|ROSTER_CONTAINER/;
const SAVE_EXT = new Set([".sav", ".db"]);
const TEAM_BUILDER_EXT = new Set([".json", ".zip"]);

function isSelected(source: StudioSource | null | undefined, extensions: Set<string>): boolean {
  return Boolean(source && extensions.has(source.extension.toLowerCase()) &&
    /^[a-f0-9]{64}$/i.test(source.sha256) && Number.isSafeInteger(source.size) && source.size > 0);
}

export function compileStudioIntent(prompt: string, source?: StudioSource | null, build?: string): ModIntentSpec {
  const clean = prompt.trim();
  if (!clean || clean.length > 4000) throw new Error("Enter a mod request between 1 and 4,000 characters.");
  const spec = compileModIntent(clean, build, STUDIO_TARGET);
  if (OFF_TARGET_TITLE.test(clean)) {
    return {
      ...spec,
      effects: [{ raw: clean, matches: [], disposition: "BLOCKED",
        reason: "This studio targets Madden NFL 27 PC only. Other Madden, NCAA, and College Football titles are not supported." }],
      readiness: "BLOCKED",
      missingInputs: [],
      quickReplies: [],
    };
  }

  // Only the primary route is actionable; secondary search hits are candidates, not required inputs.
  const bindings = spec.effects.flatMap(effect => effect.matches.slice(0, 1));
  const requiresSave = /\b(save|roster|franchise|dynasty)\b/i.test(clean) &&
    bindings.some(match => SAVE_SURFACE.test(match.capability.surface));
  const requiresTeamBuilder = bindings.some(match => match.capability.id.startsWith("TB-"));
  const missing = spec.missingInputs.filter(item =>
    item !== "source save/roster file" && item !== "Team Builder project payload");

  if (requiresSave && !isSelected(source, SAVE_EXT)) missing.push("locally selected copied Madden 27 save/roster file");
  if (requiresTeamBuilder && !isSelected(source, TEAM_BUILDER_EXT)) missing.push("locally selected Team Builder project payload");
  const missingInputs = [...new Set(missing)];
  const blocked = spec.effects.some(effect => effect.disposition === "BLOCKED");
  const experimental = spec.effects.some(effect => effect.disposition === "EXPERIMENT_REQUIRED");
  const readiness = blocked ? "BLOCKED" : experimental ? "NEEDS_VERIFICATION" :
    missingInputs.length ? "NEEDS_INPUT" : "READY_TO_BUILD";

  return { ...spec, missingInputs, readiness, quickReplies: missingInputs.slice(0, 3).map(x => `Provide ${x}`) };
}

export interface StudioPlan {
  version: "MADDEN27_STUDIO_PLAN_V1";
  target: typeof STUDIO_TARGET;
  platform: "PC";
  artifactStatus: typeof STUDIO_STATUS;
  runtimeStatus: "NOT_RUN";
  source: StudioSource | null;
  intent: ModIntentSpec;
  receipt: ReturnType<typeof createProofReceipt>;
  recipes: ReturnType<typeof buildRecipes>;
  bundleId: string;
}

export function createStudioPlan(intent: ModIntentSpec, source?: StudioSource | null): StudioPlan {
  if (intent.universe !== STUDIO_TARGET) throw new Error("Madden 27 intent required.");
  const publicSource = source && /^[a-f0-9]{64}$/i.test(source.sha256) ?
    { name: source.name, extension: source.extension, size: source.size, sha256: source.sha256 } : null;
  return {
    version: "MADDEN27_STUDIO_PLAN_V1",
    target: STUDIO_TARGET,
    platform: "PC",
    artifactStatus: STUDIO_STATUS,
    runtimeStatus: "NOT_RUN",
    source: publicSource,
    intent,
    receipt: createProofReceipt(intent),
    recipes: buildRecipes(intent),
    bundleId: createEvidenceBundle(intent).id,
  };
}
