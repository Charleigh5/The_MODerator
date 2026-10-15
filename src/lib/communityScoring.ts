import {communityEvidence,gamePatches,type CommunityEvidence,type GamePatch} from "../data/communityEvidence.js";
import {modIntelligenceCatalog,type ModCatalogEntry} from "../data/modIntelligence.js";

export type PromotionStatus = "INSUFFICIENT_DATA"|"CANDIDATE_REVIEW"|"PROVEN_COMPATIBLE";
export interface ReviewedGameProof {
  modId:string; title:"MADDEN27"; gameBuild:string;
  sourceSha256:string; packageSha256:string; receiptSha256:string;
  testResult:"PASS"|"FAIL"; reviewedBy:"HUMAN_REVIEWED"; testedAt:string;
  evidenceUrl:string;
}
const validProof=(p:ReviewedGameProof,modId:string):boolean =>
  p.modId===modId&&p.title==="MADDEN27"&&p.testResult==="PASS"&&
  p.reviewedBy==="HUMAN_REVIEWED"&&Boolean(p.gameBuild.trim())&&
  [p.sourceSha256,p.packageSha256,p.receiptSha256].every(s=>/^[a-f0-9]{64}$/i.test(s))&&
  /^20\d\d-\d{2}-\d{2}$/.test(p.testedAt)&&p.evidenceUrl.startsWith("https://");
export type PatchSignal = "RETEST_REQUIRED"|"PATCH_RELEVANT_BUILD_UNCONFIRMED"|"NO_DIRECT_PATCH_MATCH";
export type EvaluationCode = "A_TEST"|"B_REVIEW"|"C_RESEARCH"|"D_BLOCK";
export interface IssueCluster {
 id:string; modId:string; issueKey:string; reporterKey:string; scope:string;
 reports:number; firstSeen:string|null; lastSeen:string|null;
 evidenceIds:string[]; sourceUrl:string; distinctReporters:1;
}
export interface ModQualityAssessment {
 id:string; evidenceScore:number; qualityScore:number|null;
 evaluationCode:EvaluationCode; promotionStatus:PromotionStatus;
 patchSignal:PatchSignal; relevantPatchIds:string[];
 uniqueIndependentPlayers:number; rawPlayerPosts:number;
 duplicatePlayerPosts:number; positivePlayers:number; negativePlayers:number;
 authorResponses:number; editorialReports:number;
 sources:string[]; issueClusters:IssueCluster[]; lastEvidenceDate:string|null;
 rationale:string[];
}
function distinct<T>(a:T[]):T[]{return [...new Set(a)];}
const validDate=(x:string|null):string|null=>x && /^\d{4}-\d{2}-\d{2}$/.test(x)?x:null;
function minDate(items:CommunityEvidence[]):string|null{
 return items.map(x=>validDate(x.date)).filter((x):x is string=>x!==null).sort()[0]??null;
}
function maxDate(items:CommunityEvidence[]):string|null{
 const dates=items.map(x=>validDate(x.date)).filter((x):x is string=>x!==null).sort();
 return dates.length?dates[dates.length-1]:null;
}
export function deduplicatePlayerReports(items:CommunityEvidence[]=communityEvidence):IssueCluster[]{
 const groups=new Map<string,CommunityEvidence[]>();
 for(const item of items){
  if(item.role!=="PLAYER_REPORT" || item.stance==="NEUTRAL")continue;
  const key=[item.modId,item.issueKey,item.reporterKey,item.scope].join("|");
  const prior=groups.get(key)??[];prior.push(item);groups.set(key,prior);
 }
 return [...groups.entries()].map(([id,reports])=>({
   id,modId:reports[0].modId,issueKey:reports[0].issueKey,reporterKey:reports[0].reporterKey,
   scope:reports[0].scope,reports:reports.length,firstSeen:minDate(reports),lastSeen:maxDate(reports),
   evidenceIds:reports.map(x=>x.id),sourceUrl:reports[0].sourceUrl,distinctReporters:1 as const,
 })).sort((a,b)=>a.modId.localeCompare(b.modId)||a.issueKey.localeCompare(b.issueKey));
}
const patchDomains:Record<string,string[]>={
 "Roster":["Roster","Franchise"],"Franchise":["Franchise"],"Gameplay":["Gameplay"],"Equipment":["Equipment","Customization"],
 "Customization":["Customization","Equipment"],"Presentation":["Presentation"],"Camera":["Camera","Presentation"],
 "Stadium":["Stadium","Presentation"],"Historical":["Historical","Roster","Franchise"],
 "Audio":["Audio","Presentation"],"User interface":["Presentation"],"Save tools":["Franchise","Roster"],
 "Draft tools":["Franchise","Roster"],
};
export function relevantPatches(mod:ModCatalogEntry,patches:GamePatch[]=gamePatches):GamePatch[]{
 if(mod.kind!=="Community mod")return[];
 const targets=patchDomains[mod.category]??[];
 return patches.filter(p=>targets.some(x=>p.impactedDomains.includes(x)));
}
export function evaluateModQuality(
 mod:ModCatalogEntry,
 evidence:CommunityEvidence[]=communityEvidence,
 patches:GamePatch[]=gamePatches,
 gameProofs:ReviewedGameProof[]=[]
):ModQualityAssessment{
 const items=evidence.filter(e=>e.modId===mod.id);
 const reports=items.filter(e=>e.role==="PLAYER_REPORT"&&e.stance!=="NEUTRAL");
 const clusters=deduplicatePlayerReports(items);
 const reporters=distinct(reports.map(e=>e.reporterKey));
 const positive=distinct(reports.filter(x=>x.stance==="FAVORABLE").map(x=>x.reporterKey));
 const negative=distinct(reports.filter(x=>x.stance==="UNFAVORABLE").map(x=>x.reporterKey));
 const replies=items.filter(x=>x.role==="AUTHOR_RESPONSE").length;
 const editorials=items.filter(x=>x.role==="EDITORIAL_REVIEW").length;
 const sourceUrls=distinct(items.map(x=>x.sourceUrl));
 const relevant=relevantPatches(mod,patches);
 const last=maxDate(items);
 const firstEvidence=mod.publishedEvidenceDate??last;
 const retests=relevant.some(p=>Boolean(firstEvidence&&firstEvidence<p.effectiveDate));
 const patchSignal:PatchSignal=!relevant.length?"NO_DIRECT_PATCH_MATCH":retests?"RETEST_REQUIRED":"PATCH_RELEVANT_BUILD_UNCONFIRMED";
 // Transparent evidence-coverage index, NOT a vote score or satisfaction rating.
 // Zero coverage is zero. Independent players are weighted more than editorial claims.
 let score=0;
 if(mod.evidence==="NEXUS_LISTING")score+=23;
 else if(mod.evidence==="EDITORIAL_REPORT")score+=12;
 else if(mod.evidence==="VIDEO_DEMONSTRATION")score+=17;
 else if(mod.evidence==="SOURCE_INSPECTED")score+=24;
 else if(mod.evidence==="DOCS_INSPECTED")score+=17;
 else if(mod.evidence==="REPOSITORY_DISCOVERED")score+=8;
 if(mod.access==="MANUAL_ACCOUNT")score+=5;
 if(mod.kind==="Code & tools"&&mod.evidence==="SOURCE_INSPECTED")score+=9;
 score+=Math.min(10,editorials*10);
 score+=Math.min(9,replies*3);
 score+=Math.min(20,reporters.length*10);
 score+=items.some(x=>x.role==="HOST_METADATA")?10:0;
 score+=last?5:0;
 // Authentic game proof is not inferred from a title, URL, upload or claimed review.
 const hasGameProof=gameProofs.some(p=>validProof(p,mod.id));
 const retailReports=reports.filter(x=>x.scope==="LEGITIMATE_GAME_CLAIM");
 const retailReporters=distinct(retailReports.map(x=>x.reporterKey));
 const hasIndependentReviewSample=retailReporters.length>=3;
 score=Math.min(hasGameProof?100:65,Math.max(0,score+(hasGameProof?20:0)));
 const retailPositive=distinct(retailReports.filter(x=>x.stance==="FAVORABLE").map(x=>x.reporterKey));
 // A mild prior is used only AFTER same-build human proof and multiple retail reporters.
 const qualityScore=hasGameProof&&hasIndependentReviewSample?
   Math.round(100*(retailPositive.length+2)/(retailReporters.length+4)):null;
 const promotionStatus:PromotionStatus=qualityScore!==null?"PROVEN_COMPATIBLE":reports.length?"CANDIDATE_REVIEW":"INSUFFICIENT_DATA";
 const code:EvaluationCode=mod.reuse==="DO_NOT_RECOMMEND"?"D_BLOCK":score>=45?"B_REVIEW":"C_RESEARCH";
 const rationale=[
  `Evidence coverage ${score}/100; this is not a user satisfaction score.`,
  `${reports.length} raw evaluative user posts represent ${reporters.length} distinct user(s) across ${clusters.length} context-sensitive issue cluster(s).`,
  qualityScore===null?"Community quality rating withheld until at least 3 independent legitimate-build reporters AND a human-reviewed same-build game proof.":"Qualified community signal based on documented firsthand retail reports and reviewed game proof.",
  patchSignal==="RETEST_REQUIRED"?"At least one relevant official patch postdates recorded mod evidence; exact-build retest needed.":
  patchSignal==="PATCH_RELEVANT_BUILD_UNCONFIRMED"?"Official patch touches related game surface, but it does not prove this mod is incompatible.":"No direct domain match among tracked patches.",
 ];
 if(reports.some(x=>x.scope==="UNOFFICIAL_REPACK"))rationale.push("Some reports concern an unofficial repack; do not generalize to retail builds.");
 if(replies)rationale.push("Author responses are recorded as counterevidence, never additional independent user reviews.");
 return {id:mod.id,evidenceScore:score,qualityScore,evaluationCode:code,promotionStatus,patchSignal,
  relevantPatchIds:relevant.map(x=>x.id),uniqueIndependentPlayers:reporters.length,
  rawPlayerPosts:reports.length,duplicatePlayerPosts:Math.max(0,reports.length-clusters.length),
  positivePlayers:positive.length,negativePlayers:negative.length,authorResponses:replies,
  editorialReports:editorials,sources:sourceUrls,issueClusters:clusters,lastEvidenceDate:last,rationale};
}
export const communityAssessments=modIntelligenceCatalog.map(x=>evaluateModQuality(x));
