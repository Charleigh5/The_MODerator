import assert from "node:assert/strict";
import {communityEvidence,gamePatches} from "../.gauntlet-build/data/communityEvidence.js";
import {deduplicatePlayerReports,evaluateModQuality,relevantPatches,communityAssessments} from "../.gauntlet-build/lib/communityScoring.js";
import {modIntelligenceCatalog} from "../.gauntlet-build/data/modIntelligence.js";
const roster=modIntelligenceCatalog.find(x=>x.id==="mod-001");
const saba=modIntelligenceCatalog.find(x=>x.id==="mod-002");
const hair=modIntelligenceCatalog.find(x=>x.id==="mod-031");
assert(roster && saba && hair);
assert.equal(gamePatches.length,2);
assert.equal(gamePatches[0].effectiveDate,"2026-08-26");
assert.equal(gamePatches[1].effectiveDate,"2026-09-16");
assert(gamePatches.every(p=>p.official && p.sourceUrl.startsWith("https://www.ea.com/") && p.knownBuildNumber===null));
assert.equal(communityAssessments.length,37);
assert.equal(new Set(communityEvidence.map(x=>x.id)).size,communityEvidence.length);
assert(communityEvidence.every(x=>x.sourceUrl.startsWith("https://")));
const clusters=deduplicatePlayerReports();
const limb=clusters.find(c=>c.modId==="mod-001"&&c.issueKey==="PLAYER_APPEARANCE_MISSING_LIMBS");
assert.equal(limb.reports,4);
assert.equal(limb.distinctReporters,1);
assert.equal(limb.firstSeen,"2026-09-29");
assert.equal(limb.lastSeen,"2026-10-03");
assert.equal(limb.scope,"UNOFFICIAL_REPACK");
const a=evaluateModQuality(roster);
assert.equal(a.rawPlayerPosts,5);
assert.equal(a.uniqueIndependentPlayers,1);
assert.equal(a.duplicatePlayerPosts,3);
assert.equal(a.negativePlayers,1);
assert.equal(a.authorResponses,2);
assert.equal(a.issueClusters.length,2);
assert.equal(a.qualityScore,null,"no benchmarked community quality on one conflicting reporter");
assert(a.rationale.some(x=>x.includes("repack")));
assert.equal(evaluateModQuality(saba).editorialReports,1);
assert.equal(evaluateModQuality(saba).uniqueIndependentPlayers,0);
assert.equal(evaluateModQuality(saba).qualityScore,null);
assert.equal(relevantPatches(hair).length>0,true);
assert.equal(evaluateModQuality(hair).patchSignal,"RETEST_REQUIRED");
assert.equal(evaluateModQuality(saba).patchSignal,"PATCH_RELEVANT_BUILD_UNCONFIRMED");
assert(communityAssessments.every(x=>x.evidenceScore>=0&&x.evidenceScore<=65&&x.qualityScore===null));
assert(communityAssessments.filter(x=>x.qualityScore!==null).length===0);
const bad=communityAssessments.find(x=>x.id===modIntelligenceCatalog.find(x=>x.reuse==="DO_NOT_RECOMMEND")?.id);
assert.equal(bad.evaluationCode,"D_BLOCK");
assert(communityEvidence.filter(x=>x.role==="EDITORIAL_REVIEW").every(x=>x.independenceKey==="os-article-2026-09-25"));
// Synthetic fixtures never enter production; prove numeric ratings cannot be unlocked by repacks or self-reported claims.
const legit=["A","B","C"].map((actor,i)=>({
  id:"synthetic-"+actor,modId:"mod-002",issueKey:"SYNTHETIC_TEST",reporterKey:actor,
  role:"PLAYER_REPORT",date:"2026-10-09",datePrecision:"DAY",
  sourceUrl:"https://example.org/review/"+i,stance:"FAVORABLE",scope:"LEGITIMATE_GAME_CLAIM",
  statement:"SYNTHETIC, NEVER INGEST",sourceStrength:"DIRECT",independenceKey:actor,
  issueOutcome:"NOT_APPLICABLE"
}));
const fakeProof={
 modId:"mod-002",title:"MADDEN27",gameBuild:"TEST-FIXTURE-ONLY",sourceSha256:"a".repeat(64),
 packageSha256:"b".repeat(64),receiptSha256:"c".repeat(64),testResult:"PASS",
 reviewedBy:"HUMAN_REVIEWED",testedAt:"2026-10-09",evidenceUrl:"https://example.org/synthetic-proof"
};
assert.equal(evaluateModQuality(saba,[...communityEvidence,...legit]).qualityScore,null);
assert.equal(evaluateModQuality(saba,[...communityEvidence,...legit],gamePatches,[{...fakeProof,receiptSha256:"invalid"}]).qualityScore,null);
assert.equal(evaluateModQuality(saba,[...communityEvidence,...legit],gamePatches,[fakeProof]).qualityScore,71);
assert.equal(evaluateModQuality(saba,[...communityEvidence,...legit.map(x=>({...x,reporterKey:"ONE"}))],gamePatches,[fakeProof]).qualityScore,null);
assert.equal(evaluateModQuality(saba,[...communityEvidence,...legit.map(x=>({...x,scope:"UNOFFICIAL_REPACK"}))],gamePatches,[fakeProof]).qualityScore,null);
console.log("COMMUNITY_INTELLIGENCE_PASS reports="+communityEvidence.length+" clusters="+clusters.length+" ratings=0");
