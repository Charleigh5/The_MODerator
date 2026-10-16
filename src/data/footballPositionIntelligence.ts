/** Football coaching concepts are research hypotheses, never Madden-engine bindings. */
export type PositionGroup="QB"|"RB"|"WR"|"TE"|"OL"|"EDGE"|"DL"|"LB"|"CB"|"NB"|"SAFETY"|"SPECIAL_TEAMS";
export interface PositionProfile {
 group:PositionGroup;label:string;positions:string[];
 recognition:string;execution:string;failure:string;counterplay:string;scenario:string;
 metrics:string[];skillAxes:string[];supportIds:string[];
}
const RULE="NFL_2026_RULEBOOK",COACH="USA_FOOTBALL_COACHING_CONCEPTS";
export const POSITION_PROFILES:Record<PositionGroup,PositionProfile>={
 QB:{group:"QB",label:"Quarterback",positions:["QB"],recognition:"Identify rotation, coverage shells, protection stress and route progression",execution:"Progress through concepts, manage pocket depth, release timing and ball placement",failure:"Late throws, false keys, sacks and missed checkdowns",counterplay:"Simulated pressure, rotation and disguise",scenario:"Shotgun 11 personnel versus nickel Cover 3",metrics:["read time","pressure-to-throw decision","placement error","turnover-worthy decisions"],skillAxes:["pre-snap identification","progression discipline","accuracy under pressure"],supportIds:[RULE,COACH]},
 RB:{group:"RB",label:"Running back / fullback",positions:["HB","RB","FB"],recognition:"Identify front strength, cutback seams, unblocked defenders and protection threats",execution:"Press aiming point, plant and cut, maintain ball security and pick up pressure",failure:"Premature bounce, missed blitz pickup and lost yardage",counterplay:"Late safety rotation and wrong-arm edge",scenario:"Outside-zone right against nickel force and cutback fits",metrics:["aiming-point discipline","cutback decision","pass-protection misses","first-contact yards"],skillAxes:["vision","one-cut technique","pass protection"],supportIds:[RULE,COACH]},
 WR:{group:"WR",label:"Wide receiver",positions:["WR","X","Z","SLOT"],recognition:"Read leverage, cushion and coverage shell relative to concept",execution:"Release, stem, throttle at landmarks, catch and maintain spacing",failure:"Rounded breaks, mistimed stems, separation lost versus bracket",counterplay:"Press technique, cloud corner and post-snap rotation",scenario:"Trips flood/seam versus nickel Cover 3",metrics:["route depth error","separation at break","timing error","contested-catch conversion"],skillAxes:["release technique","route precision","ball tracking"],supportIds:[RULE,COACH]},
 TE:{group:"TE",label:"Tight end",positions:["TE","Y"],recognition:"Identify force defender, defensive front and split safety leverage",execution:"Release or block consistent with concept, settle versus zone and handle edge fits",failure:"Missed chip, route collision, blown edge responsibility",counterplay:"Under/over front and nickel overhang",scenario:"Attached and off-ball TE stress versus nickel",metrics:["edge fit errors","chip timing","zone spacing error","catch conversion"],skillAxes:["blocking leverage","route recognition","catch technique"],supportIds:[RULE,COACH]},
 OL:{group:"OL",label:"Offensive line",positions:["LT","LG","C","RG","RT"],recognition:"Set protection IDs, locate stunts, late mug looks and run-front gaps",execution:"Pass-set angle, hand placement, combination blocks and pass-off communication",failure:"Free runner, overset, failed combo climb, penalty",counterplay:"Tackle/end stunt, simulated pressure and slanting front",scenario:"Five-man protection versus nickel four-man rush",metrics:["pressure allowed","stunt pickup rate","free rushers","block leverage errors"],skillAxes:["protection communication","hand use","anchor and recovery"],supportIds:[RULE,COACH]},
 EDGE:{group:"EDGE",label:"Edge defenders",positions:["LE","RE","EDGE"],recognition:"Read tackle set, option mesh and ball direction",execution:"Set contain, rush with bend and counters, compress run lane",failure:"Lose contain, overrun QB depth, bite on action",counterplay:"Zone read, chip, slide protection and split flow",scenario:"Nickel four-man rush against play-action",metrics:["contain violations","pressure latency","rush-lane integrity","run-stop gap errors"],skillAxes:["key discipline","counter timing","body control"],supportIds:[RULE,COACH]},
 DL:{group:"DL",label:"Interior defensive line",positions:["DT","NT","DL"],recognition:"Recognize double teams, down blocks and protection slides",execution:"Fit gap, strike and shed, execute assigned stunts and keep rush lane",failure:"Washed out of gap, miss stunt exchange and lose rush integrity",counterplay:"Doubles, outside zone and trap concepts",scenario:"Nickel four-down front versus outside zone",metrics:["gap integrity","block defeat time","double-team displacement","pressure containment"],skillAxes:["first step","leverage","block shedding"],supportIds:[RULE,COACH]},
 LB:{group:"LB",label:"Linebackers",positions:["MIKE","WILL","SAM","LB"],recognition:"Key guard/RB flow and pass landmarks without vacating run responsibility",execution:"Fit assigned gap, wall crossers, carry zones, close on controlled angles",failure:"False step, wrong gap, lost crosser and overpursuit",counterplay:"Play-action, zone flow and route combinations",scenario:"Nickel 4-2-5 hook drop versus play-action flood",metrics:["gap-fit accuracy","read delay","landmark depth","pursuit-angle error"],skillAxes:["key progression","fit decision","coverage spatial awareness"],supportIds:[RULE,COACH]},
 CB:{group:"CB",label:"Outside cornerbacks",positions:["CB","LCB","RCB"],recognition:"Read receiver splits, route stem and deep-third threats",execution:"Maintain cushion/leverage, open hips, transition and contest timing",failure:"Eyes trapped in backfield, lost deep responsibility and illegal contact",counterplay:"Double move, stacked receivers and flood",scenario:"Cover 3 deep outside third versus vertical routes",metrics:["leverage errors","deep-ball exposure","break reaction","contested-catch efficiency"],skillAxes:["route recognition","transition footwork","ball skills"],supportIds:[RULE,COACH]},
 NB:{group:"NB",label:"Nickel/slot defensive back",positions:["NB","SLOT_CB"],recognition:"Process slot release, bunch switch and perimeter run/pass clues",execution:"Carry seam, pattern-match as assigned, fit perimeter and trigger on short routes",failure:"Missed switch, wrong flat leverage or run-fit conflict",counterplay:"Option routes, jet motion and bunch releases",scenario:"Nickel flat/curl assignment versus seam-flat stress",metrics:["switch assignment","slot separation allowed","force-fit errors","reaction latency"],skillAxes:["pattern recognition","short-area technique","run/pass conflict"],supportIds:[RULE,COACH]},
 SAFETY:{group:"SAFETY",label:"Free / strong safeties",positions:["FS","SS"],recognition:"Read route distribution, QB intent and run/pass keys while maintaining assignment",execution:"Preserve post/flat responsibilities, leverage, pursuit angle and rally technique",failure:"False step on play-action, lost post, overpursuit and missed coverage rotation",counterplay:"Four verticals, flood, play-action and high-low stress",scenario:"Free safety post versus trips flood / strong safety curl-flat",metrics:["recognition latency","assignment errors","coverage leverage","pursuit angle error","recovery failure rate","explosive plays allowed"],skillAxes:["play recognition","leverage and spacing","pursuit and recovery"],supportIds:[RULE,COACH]},
 SPECIAL_TEAMS:{group:"SPECIAL_TEAMS",label:"Kicking / coverage specialists",positions:["K","P","LS","KR","PR","GUNNER"],recognition:"Identify rush and lane structure, coverage landmarks and return blocking",execution:"Kick placement and timing, hang time, snap consistency and lane integrity",failure:"Mishit, blocked kick, lane violation or containment loss",counterplay:"Rush pressure, return wall and unusual kick angles",scenario:"Kick coverage and return unit (separate 11-on-11 phase)",metrics:["kick placement error","hang time","lane assignment errors","snap time"],skillAxes:["accuracy","coordination","lane discipline"],supportIds:[RULE,COACH]}
};
const hintPatterns:Array<[PositionGroup,RegExp]>=[
 ["SAFETY",/\b(safet(?:y|ies)|free safety|strong safety|FS|SS)\b/i],
 ["SPECIAL_TEAMS",/\b(kicker|punter|long snapper|kick returner|punt returner|special teams|gunner)\b/i],
 ["QB",/\b(QB|quarterback|signal caller)\b/i],
 ["RB",/\b(RB|HB|FB|running back|halfback|fullback|tailback)\b/i],
 ["TE",/\b(TE|tight end)\b/i],
 ["OL",/\b(offensive line|offensive linemen|linemen|LT|LG|RT|RG|center blocking|pass protection|tackle blocking)\b/i],
 ["EDGE",/\b(edge rush|edge defender|EDGE|defensive end|DE|pass rusher)\b/i],
 ["DL",/\b(defensive line|interior line|defensive tackle|nose tackle|DT|NT|D.line)\b/i],
 ["LB",/\b(linebacker|linebackers|MIKE|WILL|SAM|MLB|OLB|ILB)\b/i],
 ["NB",/\b(nickel back|slot corner|nickel corner|NB)\b/i],
 ["CB",/\b(cornerback|cornerbacks|CB|LCB|RCB|outside corner)\b/i],
 ["WR",/\b(wide receiver|receivers|WR|slot receiver|wideout)\b/i]
];
export function inferPositionGroup(prompt:string):PositionGroup|null{
 for(const [group,pattern] of hintPatterns)if(pattern.test(prompt))return group;
 return null;
}
export function getPositionProfile(group:PositionGroup|null):PositionProfile|null{
 return group?POSITION_PROFILES[group]:null;
}
export function positionDecisionChoices(group:PositionGroup,round:"MECHANISM"|"SITUATION"|"SEPARATION",mechanismChoice?:string){
 const p=POSITION_PROFILES[group];
 if(round==="MECHANISM")return [
  {id:"A",title:"Authentic "+p.label.toLowerCase()+" decisions",effect:p.recognition+"; "+p.execution+".",feasibility:"Football hypothesis; game AI binding unverified",recommended:true},
  {id:"B",title:"Bounded ratings / technique",effect:"Locate existing title-verified values affecting "+p.skillAxes.join(", ")+".",feasibility:"Copied-save/asset field proof required"},
  {id:"C",title:"Experimental motion or assignment AI",effect:"Research engine control over "+p.execution.toLowerCase()+".",feasibility:"Runtime binding unknown"},
  {id:"D",title:"Custom "+p.label.toLowerCase()+" behavior",effect:"Describe precise actions, limits, counterexamples and success signals.",feasibility:"Human football review required"}
 ] as const;
 if(round==="SITUATION")return [
  {id:"A",title:"Reproducible matchup",effect:p.scenario+".",feasibility:"Source-backed coaching concept; not game-tested",recommended:true},
  {id:"B",title:"Adversarial counterplay",effect:"Test the position against "+p.counterplay+".",feasibility:"Needs controlled scenario design"},
  {id:"C",title:mechanismChoice==="C"?"Experimental assignment interactions":"Unit-wide assignment interactions",effect:"Model teammates, adjacent gaps and help responsibilities before evaluating individual skills.",feasibility:"22-player tactical prototype only"},
  {id:"D",title:"Custom down and distance",effect:"Specify personnel, formation, play concept, responsibility and opponent.",feasibility:"Source/context review required"}
 ] as const;
 return [
  {id:"A",title:"Skill-tier response with overlap",effect:"Compare strong and average "+p.label.toLowerCase()+" performance in "+p.metrics.slice(0,3).join(", ")+"; keep credible mistakes for both.",feasibility:"Measured thresholds not yet established",recommended:true},
  {id:"B",title:"Conservative disparity",effect:"Small skill gaps with preserved defensive/offensive counterplay.",feasibility:"Proposed thresholds only"},
  {id:"C",title:"Context-adjusted skill disparity",effect:"Include fatigue, pressure, opponent skill, scheme and "+p.failure.toLowerCase()+".",feasibility:"Requires repeated controlled samples"},
  {id:"D",title:"Custom position tier calibration",effect:"Define thresholds, error bands and conditions in which lower-rated opponents succeed.",feasibility:"Calibration evidence needed"}
 ] as const;
}
