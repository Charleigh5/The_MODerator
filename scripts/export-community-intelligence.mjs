import {mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {communityEvidence,gamePatches} from "../.gauntlet-build/data/communityEvidence.js";
import {communityAssessments,deduplicatePlayerReports} from "../.gauntlet-build/lib/communityScoring.js";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const file=resolve(root,"docs/mod-intelligence/COMMUNITY_INTELLIGENCE_V1.json");
const payload={
  schema:"COMMUNITY_INTELLIGENCE_V1",
  researchedThrough:"2026-10-09",
  target:"MADDEN27_PC",
  sourceAuthority:"EA_PATCHES > HOST_METADATA_AND_DIRECT_POSTS > NAMED_EDITORIAL > INFERENCE",
  status:"RESEARCH_NOT_MOD_TESTING",
  interpretation:{
    evidenceScore:"0-100 source coverage / explainable evidence sufficiency, NOT community satisfaction. Capped at 65 absent game runtime proof.",
    qualityScore:"null until >=3 independent firsthand reports and verified exact-build game test.",
    deduplication:"same mod + issue + reporter + game-install context = one cluster; raw post count preserved.",
    patch:"surface-overlap is a retest suggestion, never proof of incompatibility.",
    limitations:"Selected sources, not exhaustive Discord access or statistically representative community sampling."
  },
  officialPatches:gamePatches,
  evidenceRecords:communityEvidence,
  playerReportClusters:deduplicatePlayerReports(),
  modAssessments:communityAssessments,
  counters:{
    modAssessments:communityAssessments.length,
    evidenceRecords:communityEvidence.length,
    playerReportClusters:deduplicatePlayerReports().length,
    qualifiedCommunityRatings:communityAssessments.filter(x=>x.qualityScore!==null).length,
    officialPatches:gamePatches.length,
  }
};
if(payload.counters.modAssessments!==37||payload.counters.qualifiedCommunityRatings!==0||payload.counters.officialPatches!==2)throw Error("Governance invariant failed");
const json=JSON.stringify(payload,null,2)+"\n";
await mkdir(dirname(file),{recursive:true});await writeFile(file,json);
console.log("COMMUNITY_INTELLIGENCE_EXPORT_PASS sha256="+createHash("sha256").update(json).digest("hex")+" records="+payload.counters.evidenceRecords);
