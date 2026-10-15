import assert from "node:assert/strict";
import { buildModeratorInstructions, buildModeratorInput } from "../.gauntlet-build/lib/aiOrchestrator.js";

const spec={
  version:"MOD_INTENT_V1",
  originalPrompt:"make my safety leap over a pile",
  universe:"CFB27",
  platform:"PC",
  offlineRequired:true,
  effects:[{
    raw:"make my safety leap over a pile",
    disposition:"EXPERIMENT_REQUIRED",
    reason:"controlled verification required",
    matches:[{
      capability:{id:"FTC-ANIM-TARGET",name:"Animation assets and style enums",evidence:"TARGET",surface:"FROSTBITE_ANIMATION"},
      score:42,parity:"CONFIRMED_SHARED",reasons:["mechanics"]
    }]
  }],
  missingInputs:["exact current game build"],
  quickReplies:[],
  readiness:"NEEDS_VERIFICATION"
};

const instructions=buildModeratorInstructions(spec);
assert.match(instructions,/CODEWRIGHT/);
assert.match(instructions,/NEEDS_VERIFICATION/);
assert.match(instructions,/FTC-ANIM-TARGET/);
assert.match(instructions,/TARGET/);
assert.match(instructions,/(never claim|do not claim)/i);
assert.match(instructions,/offline/i);

const input=buildModeratorInput([
  {id:1,role:"user",text:"first"},
  {id:2,role:"agent",text:"second"},
  {id:3,role:"sys",text:"internal"},
],"new prompt",12);
assert.equal(input.at(-1).role,"user");
assert.equal(input.at(-1).content,"new prompt");
assert.equal(input.some(x=>x.content==="internal"),false);
console.log("AI_ORCHESTRATOR_PASS");
