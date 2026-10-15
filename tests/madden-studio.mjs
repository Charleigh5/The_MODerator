import assert from "node:assert/strict";
import { compileStudioIntent, createStudioPlan } from "../.gauntlet-build/lib/maddenStudio.js";
import { compileModIntent } from "../.gauntlet-build/lib/modIntentCompiler.js";

const hash = "a".repeat(64);
const save = { name: "COPIED_FRANCHISE.sav", extension: ".sav", size: 4096, sha256: hash };

const unqualified = compileStudioIntent("Give my safety a dark visor");
assert.equal(unqualified.universe, "MADDEN27", "Madden-only studio must not silently select CFB27");
assert.equal(unqualified.originalPrompt, "Give my safety a dark visor");
assert(!unqualified.missingInputs.includes("locally selected copied Madden 27 save/roster file"),
  "cosmetic-only request must not demand a franchise save without an explicit save target");
assert.equal(compileStudioIntent("Madden 26 alternate helmet").readiness, "BLOCKED",
  "other Madden years must not be reinterpreted as Madden 27");

const cfb = compileStudioIntent("CFB27 give my safety a visor");
assert.equal(cfb.universe, "MADDEN27");
assert.equal(cfb.readiness, "BLOCKED");
assert.equal(cfb.effects[0].matches.length, 0);
assert.match(cfb.effects[0].reason, /Madden NFL 27 PC only/);

const missing = compileStudioIntent("Madden 27: in my franchise save set my QB speed to 95");
assert(missing.missingInputs.includes("locally selected copied Madden 27 save/roster file"),
  "stating save in text is not proof of an actual attached local file");
const provided = compileStudioIntent("Madden 27: in my franchise save set my QB speed to 95", save);
assert(!provided.missingInputs.includes("locally selected copied Madden 27 save/roster file"));
assert.equal(provided.readiness, "BLOCKED", "providing a file must not bypass unknown Madden schema parity");

const fake = compileStudioIntent("Madden 27: in my franchise save set my QB speed to 95",
  { ...save, sha256: "not-a-hash" });
assert(fake.missingInputs.includes("locally selected copied Madden 27 save/roster file"));

const teamBuilder = compileStudioIntent("Madden 27 Team Builder: matte helmet payload attached");
assert(teamBuilder.missingInputs.includes("locally selected Team Builder project payload"),
  "claims in prompt cannot substitute for actual source selection");

const plan = createStudioPlan(provided, { ...save, path: "C:\\secret\\private" });
assert.equal(plan.target, "MADDEN27");
assert.equal(plan.artifactStatus, "GAME_ARTIFACT_NOT_BUILT");
assert.equal(plan.runtimeStatus, "NOT_RUN");
assert.equal(plan.source.sha256, hash);
assert(!JSON.stringify(plan).includes("private"), "plan must not export absolute local paths");
assert.equal(plan.intent.universe, "MADDEN27");
assert.throws(() => createStudioPlan(compileModIntent("CFB27: QB speed 95")), /Madden 27/);
assert.throws(() => compileStudioIntent("x".repeat(4001)), /4,000/);
console.log("MADDEN_STUDIO_PASS");
