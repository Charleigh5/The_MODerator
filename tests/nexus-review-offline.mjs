import assert from "node:assert/strict";
import {inspectNexusReviewPack,mergeNexusInbox,emptyNexusInbox} from "../desktop/lib/nexus-review-offline.mjs";
const record={postId:"9482311",reviewerId:"82711",modId:"mod-001",postedAt:"2026-10-11",
 role:"PLAYER_REPORT",stance:"UNFAVORABLE",scope:"UNOFFICIAL_REPACK",
 issueKey:"PLAYER_APPEARANCE",gameBuild:null,
 sourceUrl:"https://www.nexusmods.com/maddennfl27/mods/1?tab=posts",
 summary:"User-provided description of absent limbs; game installation is not verified."};
const base={schema:"MODERATOR_NEXUS_REVIEW_PACK_V1",game:"MADDEN27",
 collectionMode:"USER_SUPPLIED_ONLY",
 permission:{basis:"RIGHTS_HOLDER_WRITTEN_PERMISSION",reference:"Synthetic rights permission test: fixture-001",attestation:true},
 records:[record]};
const p=(x)=>JSON.stringify(x);
const inspected=inspectNexusReviewPack(p(base));
assert.equal(inspected.records.length,1);
assert.equal(inspected.records[0].qualityVoteEligible,false);
assert.equal(inspected.records[0].gameRuntimeVerified,false);
assert.equal(inspected.permissionIndependentlyVerified,false);
assert(!p(inspected).includes("82711"),"raw reviewer identity excluded");
assert(!p(inspected).includes("9482311"),"raw post identity excluded");
assert(!p(inspected).includes("Synthetic rights permission test"),"raw permission reference excluded");
let merged=mergeNexusInbox(emptyNexusInbox(),inspected);
assert.equal(merged.added,1);
const repeat=mergeNexusInbox(merged,inspected);
assert.equal(repeat.added,0);
assert.equal(repeat.conflicts,0);
const changed=inspectNexusReviewPack(p({...base,records:[{...record,summary:"A different user-attested narrative for the same source post."}]}));
assert.equal(mergeNexusInbox(merged,changed).conflicts,1);
assert.throws(()=>inspectNexusReviewPack(p({...base,collectionMode:"WEBSITE_SCRAPER"})),/UNSUPPORTED_SOURCE_CONTRACT/);
assert.throws(()=>inspectNexusReviewPack(p({...base,permission:{...base.permission,attestation:false}})),/PERMISSION_REQUIRED/);
assert.throws(()=>inspectNexusReviewPack(p({...base,records:[{...record,sourceUrl:"https://evil.example/mods/1"}]})),/INVALID_SOURCE_URL/);
assert.throws(()=>inspectNexusReviewPack(p({...base,records:[{...record,modId:"mod-003"}]})),/MOD_NOT_MAPPED/);
assert.throws(()=>inspectNexusReviewPack(p({...base,records:[{...record,role:"AUTHOR_RESPONSE"}]})),/AUTHOR_NOT_PLAYER_VOTE/);
assert.throws(()=>inspectNexusReviewPack(p({...base,records:[record,record]})),/DUPLICATE_POST_IN_PACK/);
assert.throws(()=>inspectNexusReviewPack(p({...base,records:[{...record,body:"unlicensed quote"}]})),/UNKNOWN_REVIEW_FIELD/);
assert.throws(()=>inspectNexusReviewPack("a".repeat(256*1024+1)),/PACK_TOO_LARGE/);
console.log("NEXUS_REVIEW_OFFLINE_PASS dedup=1 conflict=1 zero_votes=1 guarded=1");
