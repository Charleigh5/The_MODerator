/* GrillMe: user intent architecture, not Frostbite runtime proof. */
import { inferPositionGroup, getPositionProfile, positionDecisionChoices, type PositionGroup } from "../data/footballPositionIntelligence.js";
import {buildFootball22Scenario,type Football22Scenario} from "./football22Model.js";
export type OptionId = "A"|"B"|"C"|"D";
export type Round = "MECHANISM"|"SITUATION"|"SEPARATION"|"CONFIRM";
type DecisionRound = Exclude<Round,"CONFIRM">;
export interface Option {id:OptionId;title:string;effect:string;feasibility:string;recommended?:boolean}
export interface Answer {id:OptionId;title:string;effect:string;customText:string|null}
export interface Session {version:"GRILL_ME_DECISION_TREE_V1";originalPrompt:string;archetype:"SAFETY_RECOGNITION"|"GENERAL_MOD";positionGroup:PositionGroup|null;step:0|1|2|3;answers:Partial<Record<DecisionRound,Answer>>;confirmed:boolean}
export interface Question {round:Round;label:string;question:string;why:string;options:Option[]}
export interface CompiledIntent {readiness:"BLOCKED"|"NEEDS_INPUT"|"NEEDS_VERIFICATION"|"READY_TO_BUILD";missingInputs?:string[];effects:{matches:{capability:{id:string;surface:string;evidence:string};parity:string}[]}[]}
export interface GridironSpecV2 {
 version:"GRIDIRON_MOD_SPEC_V2";id:string;universe:"MADDEN27";platform:"PC_OFFLINE";titleBuild:null;originalPrompt:string;
 archetype:Session["archetype"];positionGroup:PositionGroup|null;requestedPositions:string[];desiredOnFieldOutcome:string;decisions:Record<DecisionRound,Answer>;
 positionIntelligence:null|{roleLabel:string;recognition:string;execution:string;failure:string;counterplay:string;coachingScenario:string;skillAxes:string[];measurementCandidates:string[];evidenceStatus:"FOOTBALL_CONCEPT_NOT_GAME_VERIFIED";referenceIds:string[]};
 tacticalScenarios:Football22Scenario[];
 behaviorModel:{layers:string[];designHypotheses:string[];footballConstraints:string[]};
 bindingEvidence:{id:string;surface:string;status:string;parity:string}[];
 readiness:CompiledIntent["readiness"];unresolvedInputs:string[];
 testPlan:{baseline:string;changed:string;metrics:string[];controls:string[];metricTargets:{status:"PROPOSED_NOT_MEASURED"}};
 provenance:{localSourceSha256:string|null;sourceStatus:"NO_GAME_SOURCE_VERIFIED";rights:"NEEDS_REVIEW"};
 gameArtifactStatus:"GAME_ARTIFACT_NOT_BUILT";runtimeStatus:"NOT_RUN";confirmationStatus:"APPROVED_INTENT_ONLY";confirmedByUser:true
}
const rounds=["MECHANISM","SITUATION","SEPARATION"] as const;
const opt=(id:OptionId,title:string,effect:string,feasibility:string,recommended=false):Option=>({id,title,effect,feasibility,recommended});
export function startGrillSession(prompt:string):Session {
 const p=prompt.trim();
 if(!p||p.length>4000)throw Error("Enter a mod request between 1 and 4,000 characters.");
 const safety=/\b(safety|safeties|FS|SS|free safety|strong safety)\b/i.test(p)&&/read|recogn|cover|pursu|anticipat|intelligen|awareness|route|reaction/i.test(p);
 const footballIntent=/\b(recogn|read|pursu|block|cover|route|react|decision|awareness|speed|accel|physics|tackl|pass rush|throw|catch|skill|AI|gap fit|pocket|technique|separat|defend|run fit)/i.test(p);
 const positionGroup=safety?"SAFETY":footballIntent?inferPositionGroup(p):null;
 return {version:"GRILL_ME_DECISION_TREE_V1",originalPrompt:p,archetype:safety?"SAFETY_RECOGNITION":"GENERAL_MOD",positionGroup,step:0,answers:{},confirmed:false};
}
function options(s:Session,r:DecisionRound):Option[]{
 const safety=s.archetype==="SAFETY_RECOGNITION";
 if(s.positionGroup&&!safety)return positionDecisionChoices(s.positionGroup,r,s.answers.MECHANISM?.id).map(x=>({...x, recommended:"recommended" in x?Boolean(x.recommended):undefined}));
 if(r==="MECHANISM")return safety?[
 opt("A","Authentic reads and pursuit","Improve key progression, leverage, route recognition and pursuit choices, preserving credible misreads.","Gameplay binding unknown; football design only",true),
 opt("B","Ratings-only calibration","Investigate verified awareness, play recognition and pursuit fields for bounded copied-save changes.","Madden 27 writable fields require proof"),
 opt("C","Advanced pattern-match AI","Research coverage handoffs, disguise, recognition delay and response to route combinations.","Experimental; engine hooks unknown"),
 opt("D","Custom safety behavior","Define specific on-field actions, exceptions and outcomes.","Requires football review and parity evidence")
 ]:[
 opt("A","Authentic targeted outcome","Prioritize realistic football results and minimum source-backed changes.","Recommended; exact binding required",true),
 opt("B","Conservative reversible edit","Start from a verified visual, roster or data field.","Exact title-specific parity required"),
 opt("C","Experimental mechanic","Investigate deeper AI, motion or contact behavior.","Engine support unknown"),
 opt("D","Custom mechanism","Describe the exact desired on-field or visual effect.","Needs investigation")];
 if(r==="SITUATION"){
  if(safety&&s.answers.MECHANISM?.id==="C")return [
   opt("A","Route-combination handoffs","Test bunch, switch and crossing routes versus zone and match coverages.","No Madden AI editability proven",true),
   opt("B","Play-action and motion","Measure false steps from credible run-pass keys and late movement.","Likely multiple logic surfaces"),
   opt("C","Adaptation to repeated concepts","Prototype route anticipation before searching engine bindings.","Simulation only until verified"),
   opt("D","Custom coverage assignment","Provide formation, coverage, eligible receivers and expected reaction.","Needs film-specific context")];
  return safety?[
   opt("A","Coverage reads and angles","Compare reads, leverage and pursuit from identical coverages.","Best reproducible starting point",true),
   opt("B","Run fits and play-action","Study alley fits, disguise and run-pass conflicts.","Position context required"),
   opt("C","Open-field approach","Isolate closing angles, braking, body control and tackle decisions.","Physics/animation bindings unknown"),
   opt("D","Specific matchup","Supply offensive formation, defensive call and expected responsibility.","Needs precise scenario")]:[
   opt("A","Single reproducible play","Choose one play and matchup for controlled A/B comparison.","Smallest useful experiment",true),
   opt("B","Position-wide change","Apply across one unit with regression limits.","Broader test coverage"),
   opt("C","Whole-system experiment","Test all interacting positions and game states.","Higher complexity"),
   opt("D","Custom scenario","Describe exact situation, targets and exceptions.","Requires evidence")];
 }
 return safety?[
 opt("A","Tiered reads and recovery","Contrast 95 and 72 skill tiers in recognition, mistakes, angles and recovery—with outcomes overlapping.","Proposed measurement targets",true),
 opt("B","Modest skill separation","Use small differences while preserving success and failure for both tiers.","Conservative hypothesis"),
 opt("C","Situation-dependent disparity","Include deception, opponent talent, fatigue, pressure and play complexity.","Larger controlled sample"),
 opt("D","Custom distribution","Set target behavior ranges, caps and when lower-rated players can win.","Needs empirical calibration")]:[
 opt("A","Realistic incremental impact","Use bounded, context-aware improvements with failure probability.","Recommended hypothesis",true),
 opt("B","Minimal difference","Favor reversibility and small effects.","Low-risk proposal"),
 opt("C","High contrast","Explore larger effects in offline A/B with regression checks.","Experimental"),
 opt("D","Custom strength","Specify desired impact, constraints and counterexamples.","Calibration required")];
}
export function currentGrillQuestion(s:Session):Question {
 if(s.step===3)return {round:"CONFIRM",label:"FINAL / CONFIRM INTENT",question:"Does this Mod Brief describe your desired on-field result?",why:"Approval confirms a design brief, not game modification or verified runtime.",options:[]};
 const r=rounds[s.step],safety=s.archetype==="SAFETY_RECOGNITION",profile=getPositionProfile(s.positionGroup);
 return {round:r,label:s.step===0?"01 / DESIRED MECHANIC":s.step===1?"02 / FOOTBALL CONTEXT":"03 / SKILL DISPARITY",
 question:s.step===0?(safety?"How should elite safety intelligence become visible on the field?":profile?`Which ${profile.label.toLowerCase()} decision or mechanic should change?`:"Which game behavior or asset should change?"):
 s.step===1?(safety?(s.answers.MECHANISM?.id==="C"?"Which defensive decision should advanced AI isolate?":"Which safety responsibility and offensive counter should we test?"):profile?`Which matchup tests ${profile.label.toLowerCase()} responsibilities and counterplay?`:"Where should this mod first demonstrate its effect?"):
 safety?"How should a 95-rated safety differ from a 72-rated safety without guaranteed wins?":profile?`How should elite and average ${profile.label.toLowerCase()} players differ without guaranteed outcomes?`:"How strongly should the mod change gameplay?",
 why:s.step===0?"The chosen mechanism determines which game bindings require research.":s.step===1?"Use identical context for controlled before/after tests.":"Measure overlapping outcome distributions; never guarantee a star player wins.",
 options:options(s,r)};
}
export function chooseGrillOption(s:Session,id:OptionId,customText?:string):Session{
 if(s.confirmed||s.step===3)throw Error("Return to the decision tree before choosing.");
 const selected=currentGrillQuestion(s).options.find(o=>o.id===id);
 if(!selected)throw Error("Invalid A-D option.");
 const detail=id==="D"?(customText??"").trim():null;
 if(id==="D"&&(!detail||detail.length<8))throw Error("Option D needs a custom detail of at least 8 characters.");
 if(detail&&(detail.length>360||/[<>\u0000-\u001f]/.test(detail)))throw Error("Custom detail contains invalid characters.");
 return {...s,step:(s.step+1) as Session["step"],confirmed:false,answers:{...s.answers,
 [rounds[s.step]]:{id,title:selected.title,effect:selected.effect,customText:detail}}};
}
export function previousGrillRound(s:Session):Session{
 if(s.step===0)return s;
 const step=(s.step-1) as Session["step"],answers={...s.answers};
 for(let i=step;i<3;i++){const r=rounds[i as 0|1|2];if(r)delete answers[r];}
 return {...s,step,answers,confirmed:false};
}
export function confirmGrillBrief(s:Session):Session{
 if(s.step!==3||rounds.some(r=>!s.answers[r]))throw Error("Complete all rounds before confirmation.");
 return {...s,confirmed:true};
}
function stableId(v:string){let h=2166136261;for(const c of v)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return "GMS2-"+h.toString(16).toUpperCase().padStart(8,"0");}
export function createGridironModSpecV2(s:Session,intent:CompiledIntent,source?:{sha256?:string}|null):GridironSpecV2{
 if(!s.confirmed||s.step!==3)throw Error("Confirm the GrillMe Mod Brief before export.");
 if(rounds.some(r=>!s.answers[r]))throw Error("Missing decisions.");
 const decisions={MECHANISM:s.answers.MECHANISM!,SITUATION:s.answers.SITUATION!,SEPARATION:s.answers.SEPARATION!};
 const bindings=new Map<string,GridironSpecV2["bindingEvidence"][number]>();
 for(const e of intent.effects)for(const m of e.matches.slice(0,2)){
  const c=m.capability;bindings.set(c.id,{id:c.id,surface:c.surface,status:c.evidence,parity:m.parity});
 }
 const safety=s.archetype==="SAFETY_RECOGNITION";
 const profile=getPositionProfile(s.positionGroup);
 return {version:"GRIDIRON_MOD_SPEC_V2",id:stableId(JSON.stringify({prompt:s.originalPrompt,decisions})),universe:"MADDEN27",platform:"PC_OFFLINE",
  titleBuild:null,originalPrompt:s.originalPrompt,archetype:s.archetype,positionGroup:s.positionGroup,
  requestedPositions:profile?.positions??[],
  desiredOnFieldOutcome:safety?"Context-dependent safety decisions, leverage and pursuit with realistic elite-versus-average overlap.":s.originalPrompt,
  decisions,
  tacticalScenarios:profile&&profile.group!=="SPECIAL_TEAMS"?[buildFootball22Scenario("PASS_COVER3"),buildFootball22Scenario("RUN_OUTSIDE_ZONE")]:[],
  positionIntelligence:profile?{roleLabel:profile.label,recognition:profile.recognition,execution:profile.execution,
   failure:profile.failure,counterplay:profile.counterplay,coachingScenario:profile.scenario,
   skillAxes:profile.skillAxes,measurementCandidates:profile.metrics,
   evidenceStatus:"FOOTBALL_CONCEPT_NOT_GAME_VERIFIED" as const,referenceIds:profile.supportIds}:null,
  behaviorModel:{layers:safety?["FOOTBALL_DECISION_AI","ASSIGNMENT_AND_LEVERAGE","LOCOMOTION_AND_CONTACT_CONTEXT"]:["GAME_DESIGN_INTENT","TITLE_CAPABILITY_INSPECTION"],
   designHypotheses:Object.values(decisions).map(a=>a.customText||a.effect),
   footballConstraints:safety?["No guaranteed elite wins","Legitimate offensive deception can still fool stars","Tackle animations are not dynamic physics","Control for coverage and fatigue"]:["No engine change inferred from a design proposal"]},
  bindingEvidence:[...bindings.values()],readiness:intent.readiness,
  unresolvedInputs:[...new Set([...(intent.missingInputs??[]),"Exact Madden 27 build and game patch","Writable title-specific AI or rating binding and license","Controlled offline before/after game evidence"])],
  testPlan:{baseline:"Unmodified copied-game trial with exact settings",changed:"Matched trial with one verified change and rollback",
   metrics:profile?profile.metrics:["target outcomes","side effects","repeatability"],
   controls:["matched personnel and formations","same difficulty and fatigue","multiple trials when supported","opponent quality","offline only"],metricTargets:{status:"PROPOSED_NOT_MEASURED"}},
  provenance:{localSourceSha256:source?.sha256&&/^[a-f0-9]{64}$/i.test(source.sha256)?source.sha256:null,sourceStatus:"NO_GAME_SOURCE_VERIFIED",rights:"NEEDS_REVIEW"},
  gameArtifactStatus:"GAME_ARTIFACT_NOT_BUILT",runtimeStatus:"NOT_RUN",confirmationStatus:"APPROVED_INTENT_ONLY",confirmedByUser:true};
}
