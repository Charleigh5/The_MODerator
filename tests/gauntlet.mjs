import assert from "node:assert/strict";
import { compileModIntent } from "../.gauntlet-build/lib/modIntentCompiler.js";
import { createProofReceipt } from "../.gauntlet-build/lib/proofEngine.js";
import { buildRecipes } from "../.gauntlet-build/lib/buildRecipe.js";
import { buildGameOntology } from "../.gauntlet-build/data/gameOntology.js";
import { MADDEN27_PROFILE, CFB27_PROFILE } from "../.gauntlet-build/data/madden27Parity.js";
import { TEAM_BUILDER_SOURCE_BOUNDARY } from "../.gauntlet-build/data/teamBuilderSchema.js";
import { createEvidenceBundle } from "../.gauntlet-build/lib/evidenceBundle.js";
import { analyzeCompatibility } from "../.gauntlet-build/lib/compatibilityEngine.js";
const ids=s=>new Set(s.effects.flatMap(e=>e.matches.map(m=>m.capability.id)));
const cases=[
 ["rating","CFB27: in a copied dynasty save set my Michigan safety speed to 95 and tackle to 90",["PLYR-RATINGS-51"],null],
 ["jersey","CFB27 copied roster file: renumber the roster realistically by position and resolve duplicate jersey numbers",["JERSEY-POS-RULES","PLYR-JERSEY"],null],
 ["gear","CFB27 copied dynasty save: give my safety a dark visor, towel, wrist gear and different facemask",["PLYR-GEAR-46"],null],
 ["team-builder","CFB27 Team Builder: matte helmet, chrome facemask, change jersey number font and make number spacing tighter",["TB-HELMET-MAT","TB-NUM-FONT","TB-NUM-SPACING"],"NEEDS_INPUT"],
 ["recruit-ftc","CFB27: retune recruit generation star distribution and player progression XP/skill costs",["FTC-RECRUIT-GEN","FTC-PROGRESSION"],null],
 ["pile-leap","CFB27: make my safety leap over a blocker pile for a tackle with more airborne reach and root motion",["FTC-ANIM-TARGET","RUNTIME-INSTRUMENT"],"NEEDS_VERIFICATION"],
];
for(const [name,prompt,expected,ready] of cases){const s=compileModIntent(prompt,"test-build");const got=ids(s);for(const id of expected)assert(got.has(id),`${name}: missing ${id}`);if(ready)assert.equal(s.readiness,ready,`${name}: readiness`);const receipt=createProofReceipt(s);assert(receipt.runtimeClaim==="NOT_RUN");assert(buildRecipes(s).length>0);const bundle=createEvidenceBundle(s);assert(bundle.id.startsWith("moderator.plan."));assert(bundle.files.every(f=>f.lang==="json"));assert(bundle.files.some(f=>f.path.endsWith("proof-receipt.json")&&f.content.includes("NOT_RUN")));console.log(`PASS ${name}: ${s.readiness} -> ${[...got].slice(0,6).join(",")}`);}
const tb=compileModIntent("CFB27 Team Builder: matte helmet, chrome facemask, change jersey number font and make number spacing tighter");
assert(!tb.missingInputs.includes("source save/roster file"),"Team Builder intent must not leak into save-file requirements");
assert(tb.missingInputs.includes("Team Builder project payload"),"Team Builder build requires a material project payload");
assert.equal(tb.effects.find(e=>/facemask/i.test(e.raw))?.matches[0]?.capability.id,"TB-HELMET-MAT");
assert.equal(tb.effects.find(e=>/number font/i.test(e.raw))?.matches[0]?.capability.id,"TB-NUM-FONT");
assert.equal(tb.effects.find(e=>/number spacing/i.test(e.raw))?.matches[0]?.capability.id,"TB-NUM-SPACING");
console.log("PASS team-builder-context: split fragments preserve Team Builder routing and request the correct material input");

const mixed=compileModIntent("CFB27: combine a Team Builder matte helmet and number font with a copied roster file jersey number change");
const mixedIds=ids(mixed);
assert(mixedIds.has("TB-HELMET-MAT")&&mixedIds.has("TB-NUM-FONT")&&mixedIds.has("PLYR-JERSEY"),"mixed route must preserve Team Builder and save capabilities");
assert(!mixed.missingInputs.includes("source save/roster file"),"explicit copied roster file satisfies save material input");
assert(mixed.missingInputs.includes("Team Builder project payload"),"mixed route still requires Team Builder payload");
const mixedConflicts=analyzeCompatibility(mixed);
const cross=mixedConflicts.find(f=>(f.a.startsWith("TB-")&&f.b==="PLYR-JERSEY")||(f.b.startsWith("TB-")&&f.a==="PLYR-JERSEY"));
assert(cross,"mixed route must produce a cross-plane compatibility finding");
assert.equal(cross.classification,"UNKNOWN","different planes must not be assumed mergeable");
console.log("PASS mixed-route-compatibility: cross-plane interaction remains UNKNOWN until combined behavior is verified");

const m=compileModIntent("Madden 27: in my franchise save set my QB speed to 95");assert.equal(m.readiness,"BLOCKED");console.log("PASS madden-parity: save-field request blocks without explicit M27 field crosswalk");
const ont=buildGameOntology();assert.equal(ont.capabilityCount,58);assert(ont.domainCount>=14);console.log(`PASS ontology: ${ont.capabilityCount} capabilities / ${ont.domainCount} domains`);
assert.equal(MADDEN27_PROFILE.assetLoader,CFB27_PROFILE.assetLoader);assert.equal(MADDEN27_PROFILE.canImportMeshes,false);assert.equal(CFB27_PROFILE.canImportMeshes,true);console.log("PASS profile parity: shared loader + explicit mesh/launch differences retained");
assert.equal(TEAM_BUILDER_SOURCE_BOUNDARY.status,"ZIP_PACKAGED_SOURCE_NOT_LINE_EXTRACTED");console.log("PASS Team Builder truth boundary: ZIP internals not fabricated");
console.log("GAUNTLET_PASS");
