/** Evidence-labeled 22-player schematic, NOT a game renderer, physics simulator or EA AI binding. */
import type {PositionGroup} from "../data/footballPositionIntelligence.js";
export type TacticalSide="OFFENSE"|"DEFENSE";
export type ScenarioId="PASS_COVER3"|"RUN_OUTSIDE_ZONE";
export type EdgeKind="PASS_PROTECTION"|"ROUTE_COVERAGE_STRESS"|"RUN_BLOCKING"|"RUN_FIT";
export interface TacticalPlayer {
 id:string;label:string;side:TacticalSide;group:PositionGroup;x:number;y:number;
 onLine:boolean;assignment:string;readKey:string;metric:string;
}
export interface TacticalEdge {id:string;from:string;to:string;kind:EdgeKind;readOrConflict:string;proof:"COACHING_HYPOTHESIS_NOT_GAME_PROVEN"}
export interface Football22Scenario {
 version:"GRIDIRON_22_TACTIC_V1";id:ScenarioId;title:string;formation:string;defensiveCall:string;
 focus:string;sourceBasis:string[];offense:TacticalPlayer[];defense:TacticalPlayer[];
 interactions:TacticalEdge[];state:"TACTICAL_CONCEPT_NOT_GAME_RUNTIME";calibration:"NOT_MEASURED";
}
type BasePlayer=Omit<TacticalPlayer,"assignment"|"readKey"|"metric">;
const O:BasePlayer[]=[
 {id:"O_X",label:"X",side:"OFFENSE",group:"WR",x:9,y:56,onLine:true},
 {id:"O_LT",label:"LT",side:"OFFENSE",group:"OL",x:33,y:56,onLine:true},
 {id:"O_LG",label:"LG",side:"OFFENSE",group:"OL",x:41,y:56,onLine:true},
 {id:"O_C",label:"C",side:"OFFENSE",group:"OL",x:49,y:56,onLine:true},
 {id:"O_RG",label:"RG",side:"OFFENSE",group:"OL",x:57,y:56,onLine:true},
 {id:"O_RT",label:"RT",side:"OFFENSE",group:"OL",x:65,y:56,onLine:true},
 {id:"O_Z",label:"Z",side:"OFFENSE",group:"WR",x:91,y:56,onLine:true},
 {id:"O_Y",label:"Y",side:"OFFENSE",group:"TE",x:73,y:68,onLine:false},
 {id:"O_SLOT",label:"SL",side:"OFFENSE",group:"WR",x:84,y:70,onLine:false},
 {id:"O_QB",label:"QB",side:"OFFENSE",group:"QB",x:49,y:78,onLine:false},
 {id:"O_RB",label:"RB",side:"OFFENSE",group:"RB",x:58,y:85,onLine:false}
];
const D:BasePlayer[]=[
 {id:"D_CB_L",label:"CB",side:"DEFENSE",group:"CB",x:9,y:42,onLine:false},
 {id:"D_EDGE_L",label:"E",side:"DEFENSE",group:"EDGE",x:30,y:42,onLine:false},
 {id:"D_DT_L",label:"DT",side:"DEFENSE",group:"DL",x:43,y:42,onLine:false},
 {id:"D_DT_R",label:"DT",side:"DEFENSE",group:"DL",x:56,y:42,onLine:false},
 {id:"D_EDGE_R",label:"E",side:"DEFENSE",group:"EDGE",x:68,y:42,onLine:false},
 {id:"D_CB_R",label:"CB",side:"DEFENSE",group:"CB",x:91,y:42,onLine:false},
 {id:"D_WILL",label:"W",side:"DEFENSE",group:"LB",x:42,y:30,onLine:false},
 {id:"D_MIKE",label:"M",side:"DEFENSE",group:"LB",x:57,y:30,onLine:false},
 {id:"D_NB",label:"NB",side:"DEFENSE",group:"NB",x:82,y:37,onLine:false},
 {id:"D_SS",label:"SS",side:"DEFENSE",group:"SAFETY",x:72,y:22,onLine:false},
 {id:"D_FS",label:"FS",side:"DEFENSE",group:"SAFETY",x:49,y:10,onLine:false}
];
type Roles=Record<string,[string,string,string]>;
const PASS:Roles={
 O_X:["12-yard curl / backside outlet","Read outside corner leverage","route break timing"],
 O_LT:["Protect left edge","Set to edge path and inside counter","pressure escape rate"],
 O_LG:["Inside pass set","Check left tackle twist exchange","stunt pickup"],
 O_C:["Make protection ID and anchor middle","Read interior rush direction","protection identification errors"],
 O_RG:["Inside pass set","Check right tackle twist","rush arrival latency"],
 O_RT:["Protect right edge","Maintain pocket arc","pressure rate"],
 O_Z:["Vertical clear outside third","Read CB deep leverage","separation at depth"],
 O_Y:["Flat release or check protection","Read curl/flat defender","spacing and chip timing"],
 O_SLOT:["Seam bend against middle third","Read safety and hook carry","seam availability"],
 O_QB:["Read flat defender then seam/curl progression","Identify post-snap Cover 3 rotation","decision delay"],
 O_RB:["Scan protection before check release","Identify linebacker pressure then outlet","missed pickup count"],
 D_CB_L:["Deep left third; stay atop vertical","X split, route stem and QB release","deep explosive exposure"],
 D_EDGE_L:["Maintain left rush-lane arc","Left tackle set and QB depth","contain violations"],
 D_DT_L:["Attack interior left rush lane","Center/guard protection slide","displacement"],
 D_DT_R:["Attack interior right rush lane","Guard double-team and QB climb","pocket compression"],
 D_EDGE_R:["Contain and compress from right","Right tackle set and chip","pressure latency"],
 D_CB_R:["Deep right third; stay atop Z","Z vertical and quarterback shoulder","deep third integrity"],
 D_WILL:["Weak hook zone; wall interior release","RB release and backside crosser","hook landmark errors"],
 D_MIKE:["Middle hook wall/carry; check seam","Slot seam and inside route distribution","seam carry errors"],
 D_NB:["Flat/curl on field side; disrupt quick release","Slot and TE distribution","flat coverage errors"],
 D_SS:["Field curl/flat with seam awareness","TE-to-slot route combination","conflict decision latency"],
 D_FS:["Deep middle third; protect post while reading seams","No. 2 vertical, QB eyes and deep thirds","deep-middle spacing errors"]
};
const RUN:Roles={
 O_X:["Stalk boundary defender","Read CB leverage before engaging","perimeter block integrity"],
 O_LT:["Bucket step, cut off backside pursuit","Read backside defensive end","backside pursuit allowed"],
 O_LG:["Reach / combination block","Read defensive tackle slant","combo timing"],
 O_C:["Reach to play-side defensive tackle","Read nose shade and linebackers","line call errors"],
 O_RG:["Combine inside then climb to linebacker","Read DT movement and MIKE scraping","linebacker access"],
 O_RT:["Outside zone reach edge","Read end width and hand placement","edge reach efficiency"],
 O_Z:["Stalk field-side corner","Read corner force technique","edge support release"],
 O_Y:["Arc/reach field-side overhang as designated","Identify assigned force defender","perimeter assignment error"],
 O_SLOT:["Crack/stalk nickel only when legal within rules","Read nickel pursuit angle","support block leverage"],
 O_QB:["Mesh and boot/lookout after exchange","Read backside pursuit and edge","exchange handling"],
 O_RB:["Press play-side landmark, cut when opened","Read first down-lineman outside play-side guard","decision at landmark"],
 D_CB_L:["Boundary support and cutback pursuit","X blocking stem and ball-carrier flow","secondary pursuit error"],
 D_EDGE_L:["Hold backside cutback lane","Backside tackle and boot","cutback gap errors"],
 D_DT_L:["Control backside B/A gap","Offensive combination to LB","gap displacement"],
 D_DT_R:["Penetrate/hold assigned play-side interior gap","RG/C combination and first step","gap integrity"],
 D_EDGE_R:["Keep outside shoulder free as assigned","RT/Y reach or arc","contain/edge violations"],
 D_CB_R:["Field alley support only as called","Z stalk block and runner path","missed support"],
 D_WILL:["Fit backside cutback lane","Backside guard/runner press","wrong gap rate"],
 D_MIKE:["Scrape to play-side interior fit","Play-side guard and RB aiming point","fit arrival error"],
 D_NB:["Alley support; react to crack/replace rule","Slot release and crack intent","replace/force conflict"],
 D_SS:["Primary field-side force in this illustrative 'sky' call","Y/slot block plus runner path","force leverage errors"],
 D_FS:["Deep pursuit and last-line angle","Run flow and cutback once confirmed","pursuit-angle error"]
};
type EdgeSeed=[string,string,EdgeKind,string];
const PASS_LINKS:EdgeSeed[]=[
 ["O_LT","D_EDGE_L","PASS_PROTECTION","Tackle set versus speed/inside counter"],
 ["O_LG","D_DT_L","PASS_PROTECTION","Guard protects interior and handles twist"],
 ["O_C","D_DT_L","PASS_PROTECTION","Center slides toward pressure"],
 ["O_RG","D_DT_R","PASS_PROTECTION","Guard anchors against interior push"],
 ["O_RT","D_EDGE_R","PASS_PROTECTION","Tackle protects rush arc"],
 ["D_CB_L","O_X","ROUTE_COVERAGE_STRESS","Outside deep-third defender versus curl and double move"],
 ["D_CB_R","O_Z","ROUTE_COVERAGE_STRESS","Outside deep third versus vertical"],
 ["D_NB","O_SLOT","ROUTE_COVERAGE_STRESS","Flat/curl defender conflicts with seam threat"],
 ["D_SS","O_Y","ROUTE_COVERAGE_STRESS","Curl/flat safety conflicts with Y flat"],
 ["D_FS","O_SLOT","ROUTE_COVERAGE_STRESS","Middle-third safety must overlap seam"],
 ["D_MIKE","O_SLOT","ROUTE_COVERAGE_STRESS","Hook carry influences seam access"],
 ["D_WILL","O_RB","ROUTE_COVERAGE_STRESS","Check-release RB stresses hook landmark"]
];
const RUN_LINKS:EdgeSeed[]=[
 ["O_LT","D_EDGE_L","RUN_BLOCKING","Backside cutoff versus pursuing edge"],
 ["O_LG","D_DT_L","RUN_BLOCKING","Combo block versus left tackle"],
 ["O_C","D_DT_R","RUN_BLOCKING","Reach/combo changes DT fit"],
 ["O_RG","D_DT_R","RUN_BLOCKING","Play-side combo and climb"],
 ["O_RT","D_EDGE_R","RUN_BLOCKING","Reach against play-side end"],
 ["O_Y","D_SS","RUN_BLOCKING","Y's perimeter path can conflict with force"],
 ["O_SLOT","D_NB","RUN_BLOCKING","Slot stalk versus nickel replace"],
 ["O_Z","D_CB_R","RUN_BLOCKING","Perimeter stalk versus outside support"],
 ["D_MIKE","O_RB","RUN_FIT","Mike scrapes toward runner aiming point"],
 ["D_WILL","O_RB","RUN_FIT","Will checks backside cutback"],
 ["D_EDGE_R","O_RB","RUN_FIT","Edge preserves force/contain if assigned"],
 ["D_SS","O_RB","RUN_FIT","Sky force safety sets outside shoulder"],
 ["D_FS","O_RB","RUN_FIT","FS stays last line and pursues correct angle"]
];
function assignments(base:BasePlayer[],roles:Roles):TacticalPlayer[]{
 return base.map(x=>{const fields=roles[x.id];if(!fields)throw Error("MISSING_ASSIGNMENT_"+x.id);
 return {...x,assignment:fields[0],readKey:fields[1],metric:fields[2]};});
}
function edges(seeds:EdgeSeed[]):TacticalEdge[]{return seeds.map(([from,to,kind,readOrConflict],i)=>({
 id:"T-"+String(i+1).padStart(2,"0"),from,to,kind,readOrConflict,proof:"COACHING_HYPOTHESIS_NOT_GAME_PROVEN"
}));}
export function buildFootball22Scenario(id:ScenarioId):Football22Scenario{
 if(id!=="PASS_COVER3"&&id!=="RUN_OUTSIDE_ZONE")throw Error("UNKNOWN_SCENARIO");
 const passing=id==="PASS_COVER3";
 const s:Football22Scenario={
  version:"GRIDIRON_22_TACTIC_V1",id,title:passing?"11 Personnel · Pass concept versus Cover 3":"11 Personnel · Outside zone versus Sky force",
  formation:"Shotgun 11 personnel, offset RB, three wide receivers, one off-line TE, five OL",
  defensiveCall:passing?"Nickel 4-2-5 · Cover 3 zone (illustrative assignments)":"Nickel 4-2-5 · four down / two LB / five DB · Sky force (illustrative)",
  focus:passing?"Seam-versus-flat/curl conflicts; deep-third integrity and protection":"Edge, cutback and force-fit integrity against outside zone right",
  sourceBasis:["NFL_2026_RULEBOOK","USA_FOOTBALL_COACHING_CONCEPTS"],
  offense:assignments(O,passing?PASS:RUN),defense:assignments(D,passing?PASS:RUN),
  interactions:edges(passing?PASS_LINKS:RUN_LINKS),state:"TACTICAL_CONCEPT_NOT_GAME_RUNTIME",calibration:"NOT_MEASURED"
 };
 const errors=validateFootball22Scenario(s);
 if(errors.length)throw Error("INVALID_22_SCENARIO: "+errors.join("|"));
 return s;
}
export function validateFootball22Scenario(s:Football22Scenario):string[]{
 const problems:string[]=[],nodes=[...s.offense,...s.defense],ids=new Set(nodes.map(p=>p.id));
 if(s.offense.length!==11||s.defense.length!==11)problems.push("REQUIRES_EXACTLY_11_PER_SIDE");
 if(ids.size!==nodes.length)problems.push("DUPLICATED_PLAYER_ID");
 if(s.offense.some(p=>p.side!=="OFFENSE")||s.defense.some(p=>p.side!=="DEFENSE"))problems.push("SIDE_CONFLICT");
 if(s.offense.filter(p=>p.onLine).length!==7)problems.push("OFFENSE_LINE_COUNT_NOT_SEVEN");
 if(s.defense.some(p=>p.onLine))problems.push("DEFENSIVE_ON_LINE_FLAG_NOT_APPLICABLE");
 if(nodes.some(p=>p.x<0||p.x>100||p.y<0||p.y>100))problems.push("FIELD_COORDINATE_OUT_OF_RANGE");
 if(nodes.some(p=>!p.assignment||!p.readKey||!p.metric))problems.push("MISSING_ASSIGNMENT_OR_MEASURE");
 const edgeKeys=new Set<string>();for(const e of s.interactions){
  if(!ids.has(e.from)||!ids.has(e.to)||e.from===e.to)problems.push("INVALID_MATCHUP_ENDPOINT");
  if(e.from[0]===e.to[0])problems.push("SAME_SIDE_CONFLICT_EDGE");
  const k=e.from+":"+e.to+":"+e.kind;if(edgeKeys.has(k))problems.push("DUPLICATED_MATCHUP");edgeKeys.add(k);
 }
 if(s.state!=="TACTICAL_CONCEPT_NOT_GAME_RUNTIME"||s.calibration!=="NOT_MEASURED")problems.push("UNSUPPORTED_RUNTIME_PROMOTION");
 return [...new Set(problems)];
}
export function focusPlayers(s:Football22Scenario,group:PositionGroup|null):string[]{
 if(!group)return[];
 return [...s.offense,...s.defense].filter(p=>p.group===group).map(p=>p.id);
}
