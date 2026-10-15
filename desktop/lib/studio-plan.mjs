import { createHash } from "node:crypto";

const MAX_PLAN_BYTES = 1024 * 1024;
const SHA256 = /^[a-f0-9]{64}$/i;
const STATUSES = new Set(["BLOCKED", "NEEDS_INPUT", "NEEDS_VERIFICATION", "READY_TO_BUILD"]);

export function inspectStudioPlan(raw) {
  if (typeof raw !== "string" || Buffer.byteLength(raw, "utf8") > MAX_PLAN_BYTES) {
    throw new Error("Plan exceeds the 1 MiB inspection limit.");
  }
  let plan;
  try { plan = JSON.parse(raw); } catch { throw new Error("Plan must contain valid JSON."); }
  if (!plan || typeof plan !== "object" || Array.isArray(plan) ||
      plan.version !== "MADDEN27_STUDIO_PLAN_V1" || plan.target !== "MADDEN27" ||
      plan.platform !== "PC" || plan.artifactStatus !== "GAME_ARTIFACT_NOT_BUILT" ||
      plan.runtimeStatus !== "NOT_RUN") {
    throw new Error("Unsupported target, protocol, or claimed artifact/runtime status.");
  }
  const intent = plan.intent;
  if (!intent || intent.version !== "MOD_INTENT_V1" || intent.universe !== "MADDEN27" ||
      intent.platform !== "PC" || intent.offlineRequired !== true ||
      typeof intent.originalPrompt !== "string" || intent.originalPrompt.length > 4000 ||
      !STATUSES.has(intent.readiness) || !Array.isArray(intent.effects) ||
      !Array.isArray(intent.missingInputs) || intent.effects.length > 8 ||
      !Array.isArray(plan.recipes) || plan.recipes.length > 100 ||
      !plan.receipt || plan.receipt.runtimeClaim !== "NOT_RUN") {
    throw new Error("Madden 27 intent/receipt contract failed inspection.");
  }
  const source = plan.source;
  if (source !== null && source !== undefined) {
    if (typeof source.name !== "string" || source.name.length > 256 ||
        source.name.includes("/") || source.name.includes("\\") || source.name === ".." ||
        !SHA256.test(source.sha256) || !Number.isSafeInteger(source.size) ||
        source.size <= 0 || typeof source.extension !== "string" ||
        !/^\.[a-z0-9]{1,8}$/i.test(source.extension)) {
      throw new Error("Invalid source declaration.");
    }
  }
  return {
    status: "PLAN_IMPORTED_UNVERIFIED",
    target: "MADDEN27",
    requestedReadiness: intent.readiness,
    sourceState: source ? "HASH_DECLARED_NOT_MATCHED" : "NO_SOURCE",
    localArtifactBuilt: false,
    gameRuntimeTested: false,
    sha256: createHash("sha256").update(raw, "utf8").digest("hex"),
    caveat: "A parsed plan is not a compiled mod. Source hashes, game build, compiler profile, and in-game runtime remain unverified.",
  };
}
