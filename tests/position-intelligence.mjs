import assert from "node:assert/strict";
import {inferPositionGroup,POSITION_PROFILES,positionDecisionChoices} from "../.gauntlet-build/data/footballPositionIntelligence.js";
import {startGrillSession,currentGrillQuestion,chooseGrillOption,confirmGrillBrief,createGridironModSpecV2} from "../.gauntlet-build/lib/grillMeFlow.js";
const samples={QB:"Make QB reads against rotated shells smarter",RB:"Improve running back vision and blocking",WR:"Better wide receiver release and routes",TE:"Make tight end block smarter",OL:"Fix offensive line protection",EDGE:"Improve edge rush contain",DL:"Make defensive tackle shed blocks",LB:"Fix linebacker run fits",CB:"Improve cornerback coverage",NB:"Fix nickel corner coverage",SAFETY:"Improve safety play recognition",SPECIAL_TEAMS:"Improve kicker placement and coverage"};
assert.equal(Object.keys(POSITION_PROFILES).length,12);
for(const [group,request] of Object.entries(samples)){
 assert.equal(inferPositionGroup(request),group);
 let s=startGrillSession(request);
 assert.equal(s.positionGroup,group);
 assert.equal(currentGrillQuestion(s).options.length,4);
 s=chooseGrillOption(s,"A");
 assert.equal(currentGrillQuestion(s).options.length,4);
 assert(!currentGrillQuestion(s).options[0].effect.includes("Madden game-verified"));
 s=chooseGrillOption(s,"A");s=chooseGrillOption(s,"A");s=confirmGrillBrief(s);
 const spec=createGridironModSpecV2(s,{readiness:"BLOCKED",effects:[]});
 assert.equal(spec.positionGroup,group);
 assert.deepEqual(spec.requestedPositions,POSITION_PROFILES[group].positions);
 assert.deepEqual(spec.testPlan.metrics,POSITION_PROFILES[group].metrics);
 assert.equal(spec.positionIntelligence.evidenceStatus,"FOOTBALL_CONCEPT_NOT_GAME_VERIFIED");
 assert.equal(spec.gameArtifactStatus,"GAME_ARTIFACT_NOT_BUILT");
 assert.equal(spec.runtimeStatus,"NOT_RUN");
}
assert.equal(startGrillSession("Give the safety a dark smoke visor").positionGroup,null,"Cosmetic request must not trigger tactical safety tree.");
assert.equal(startGrillSession("Change stadium lights").positionGroup,null);
assert.equal(startGrillSession("Madden 27: a 95-rated safety should recognize coverage concepts").archetype,"SAFETY_RECOGNITION");
assert.equal(positionDecisionChoices("OL","MECHANISM")[0].recommended,true);
assert.match(positionDecisionChoices("EDGE","SITUATION","C")[2].title,/Experimental/);
console.log("POSITION_INTELLIGENCE_PASS profiles=12 safety_legacy=1 coaching_only=1");
