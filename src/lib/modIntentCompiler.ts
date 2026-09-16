import { resolveCapabilities, type Universe, type CapabilityMatch, type RouteHint } from "./capabilityResolver.js";

export type BuildDisposition = "BUILDABLE" | "EXPERIMENT_REQUIRED" | "BLOCKED";
export interface ModEffect { raw: string; matches: CapabilityMatch[]; disposition: BuildDisposition; reason: string; }
export interface ModIntentSpec {
  version:"MOD_INTENT_V1";
  originalPrompt:string;
  universe:Universe;
  platform:"PC";
  offlineRequired:boolean;
  build?:string;
  target?:string;
  effects:ModEffect[];
  missingInputs:string[];
  quickReplies:string[];
  readiness:"READY_TO_BUILD"|"NEEDS_INPUT"|"NEEDS_VERIFICATION"|"BLOCKED";
}

const strong=new Set(["GAME_VERIFIED","ROUNDTRIP_GAME_VERIFIED","CONFIRMED","NAME_LIKENESS_GAME_VALIDATED","DIRECT_VERIFIED_RUNTIME_API"]);
const experimental=new Set(["SCHEMA_DECODED","DECODED","DECODED_WITH_CONCRETE_EDIT_RECIPE","TARGET","CANDIDATE","DEVELOPER_PREVIEW","CONFIRMED_DEVELOPER_PREVIEW","PARTIAL","WRITE_IMPLEMENTED_RUNTIME_NOT_FULLY_VALIDATED"]);

function splitEffects(prompt:string):string[]{
  const mixedTeamBuilderSave=/team builder/i.test(prompt)&&/\b(save|roster|dynasty|franchise)\b/i.test(prompt);
  const splitter=mixedTeamBuilderSave?/(?:,|;|\band\b|\bplus\b|\bwith\b)/i:/(?:,|;|\band\b|\bplus\b)/i;
  return prompt.split(splitter).map(s=>s.trim()).filter(s=>s.length>2);
}
function disposition(matches:CapabilityMatch[], universe:Universe):{d:BuildDisposition;r:string}{
  if(!matches.length)return{d:"BLOCKED",r:"No source-backed capability binding found."};
  const primary=matches[0];
  if(universe==="MADDEN27"&&(primary.parity==="UNKNOWN"||primary.parity==="CFB27_ONLY"))return{d:"BLOCKED",r:`Primary binding ${primary.capability.id} lacks proven Madden 27 parity (${primary.parity}).`};
  if(experimental.has(primary.capability.evidence))return{d:"EXPERIMENT_REQUIRED",r:`Primary binding ${primary.capability.id} is ${primary.capability.evidence}; controlled verification is required.`};
  if(strong.has(primary.capability.evidence))return{d:"BUILDABLE",r:`Primary binding ${primary.capability.id} has strong source/runtime evidence.`};
  if(matches.some(m=>experimental.has(m.capability.evidence)))return{d:"EXPERIMENT_REQUIRED",r:"Bindings exist, but runtime/game behavior still needs controlled verification."};
  if(matches.some(m=>strong.has(m.capability.evidence)))return{d:"BUILDABLE",r:"A matching capability has strong source/runtime evidence."};
  return{d:"EXPERIMENT_REQUIRED",r:"Capability exists but evidence is not strong enough for one-pass ready-to-use output."};
}
function inferUniverse(prompt:string):Universe{return /madden\s*(?:nfl\s*)?27/i.test(prompt)?"MADDEN27":"CFB27";}
function inferRouteHint(prompt:string,fragment:string):RouteHint|undefined{
  if(/\b(save|roster|dynasty|franchise|renumber|duplicate jersey)\b/i.test(fragment))return"SAVE";
  if(/team builder/i.test(fragment))return"TEAM_BUILDER";
  if(/team builder/i.test(prompt))return"TEAM_BUILDER";
  return undefined;
}
function inferMissing(prompt:string,effects:ModEffect[]):string[]{
 const q=prompt.toLowerCase(),miss:string[]=[];
 const hasSave=effects.some(e=>e.matches.some(m=>/SAVE_FRTK|ROSTER_CONTAINER/.test(m.capability.surface)));
 const hasTeamBuilder=effects.some(e=>e.matches.some(m=>m.capability.id.startsWith("TB-")));
 if(hasSave&&!/save|dynasty file|roster file|franchise file/.test(q))miss.push("source save/roster file");
 if(effects.some(e=>e.matches.some(m=>m.capability.id.startsWith("PLYR-")))&&!/(#\d+|qb|rb|hb|wr|te|cb|fs|ss|lb|dt|de|player|safety|quarterback|running back|receiver)/.test(q))miss.push("target player identity");
 if(effects.some(e=>e.matches.some(m=>m.capability.id==="PLYR-RATINGS-51"))&&!/\b\d{2}\b/.test(q))miss.push("desired rating value(s)");
 if(hasTeamBuilder&&!/(payload attached|project attached|json attached|export attached|team builder payload|team builder project file)/.test(q))miss.push("Team Builder project payload");
 return[...new Set(miss)];
}
function replies(missing:string[]):string[]{const r:string[]=[];for(const x of missing){if(x.includes("save"))r.push("Attach copied dynasty save","Attach roster file");else if(x.includes("player"))r.push("Select player by team + position + name/#");else if(x.includes("rating"))r.push("Set exact values","Use realistic position preset");else if(x.includes("Team Builder"))r.push("Attach/export Team Builder payload","Show Team Builder capture steps");}return[...new Set(r)].slice(0,6);}
export function compileModIntent(prompt:string,build?:string):ModIntentSpec{
 const universe=inferUniverse(prompt);let parts=splitEffects(prompt);if(parts.length>8)parts=[prompt];
 const effects=parts.map(raw=>{const hint=inferRouteHint(prompt,raw);const matches=resolveCapabilities(raw,universe,6,hint);const x=disposition(matches,universe);return{raw,matches,disposition:x.d,reason:x.r};});
 if(effects.every(e=>e.matches.length===0)){const matches=resolveCapabilities(prompt,universe,8,inferRouteHint(prompt,prompt));const x=disposition(matches,universe);effects.splice(0,effects.length,{raw:prompt,matches,disposition:x.d,reason:x.r});}
 const missingInputs=inferMissing(prompt,effects);const hasBlocked=effects.some(e=>e.disposition==="BLOCKED"),hasExperiment=effects.some(e=>e.disposition==="EXPERIMENT_REQUIRED");
 const readiness=hasBlocked?"BLOCKED":hasExperiment?"NEEDS_VERIFICATION":missingInputs.length?"NEEDS_INPUT":"READY_TO_BUILD";
 return{version:"MOD_INTENT_V1",originalPrompt:prompt,universe,platform:"PC",offlineRequired:true,build,effects,missingInputs,quickReplies:replies(missingInputs),readiness};
}
