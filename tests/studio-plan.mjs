import assert from "node:assert/strict";
import { inspectStudioPlan } from "../desktop/lib/studio-plan.mjs";
import { compileStudioIntent, createStudioPlan } from "../.gauntlet-build/lib/maddenStudio.js";

const original = createStudioPlan(compileStudioIntent("Give Madden 27 an alternate dark blue helmet"));
const raw = JSON.stringify(original);
const result = inspectStudioPlan(raw);
assert.equal(result.status, "PLAN_IMPORTED_UNVERIFIED");
assert.equal(result.sourceState, "NO_SOURCE");
assert.equal(result.localArtifactBuilt, false);
assert.equal(result.gameRuntimeTested, false);
assert.match(result.sha256, /^[a-f0-9]{64}$/);

const modified = JSON.parse(raw);
modified.target = "CFB27";
assert.throws(() => inspectStudioPlan(JSON.stringify(modified)), /Unsupported target/);
modified.target = "MADDEN27";
modified.runtimeStatus = "VERIFIED";
assert.throws(() => inspectStudioPlan(JSON.stringify(modified)), /Unsupported target/);
modified.runtimeStatus = "NOT_RUN";
modified.source = { name: "../secret.sav", extension: ".sav", sha256: "x", size: 1 };
assert.throws(() => inspectStudioPlan(JSON.stringify(modified)), /Invalid source/);
assert.throws(() => inspectStudioPlan("x".repeat(1024*1024+1)), /1 MiB/);
assert.throws(() => inspectStudioPlan("{ broken json"), /valid JSON/);
const unverifiedSource = { name:"copy.sav", extension:".sav", sha256:"a".repeat(64), size:4096 };
modified.source = unverifiedSource;
assert.equal(inspectStudioPlan(JSON.stringify(modified)).sourceState, "HASH_DECLARED_NOT_MATCHED");
console.log("STUDIO_PLAN_IMPORT_PASS");
