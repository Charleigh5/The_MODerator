import {createHash} from "node:crypto";
const MAX_BYTES=256*1024;
const MAX_ITEMS=40;
const ISSUE=new Set(["PLAYER_APPEARANCE","ROSTER_RATINGS","INSTALLATION","COMPATIBILITY","PERFORMANCE","FRANCHISE","GAMEPLAY","OTHER"]);
const STANCE=new Set(["FAVORABLE","UNFAVORABLE","MIXED","NEUTRAL"]);
const SCOPE=new Set(["LEGITIMATE_GAME_CLAIM","UNOFFICIAL_REPACK","UNSPECIFIED"]);
const ROLE=new Set(["PLAYER_REPORT","AUTHOR_RESPONSE"]);
const BASIS=new Set(["REVIEWER_DIRECT_SUBMISSION","RIGHTS_HOLDER_WRITTEN_PERMISSION","NEXUS_WRITTEN_EXEMPTION"]);
const key=(v)=>createHash("sha256").update(v).digest("hex");
const day=(s)=>typeof s==="string"&&/^20\d{2}-\d{2}-\d{2}$/.test(s)&&
 !Number.isNaN(Date.parse(s+"T00:00:00Z"))?s:null;
function assertExactKeys(v,allowed,label){
 if(!v||typeof v!=="object"||Array.isArray(v))throw Error("INVALID_"+label);
 for(const k of Object.keys(v))if(!allowed.includes(k))throw Error("UNKNOWN_"+label+"_FIELD");
}
function url(v){
 if(typeof v!=="string"||v.length>350)throw Error("INVALID_SOURCE_URL");
 let parsed;try{parsed=new URL(v)}catch{throw Error("INVALID_SOURCE_URL")}
 if(parsed.protocol!=="https:"||parsed.hostname!=="www.nexusmods.com"||
    !/^\/maddennfl27\/mods\/[1-9][0-9]{0,8}$/.test(parsed.pathname)||
    parsed.username||parsed.password||parsed.port||parsed.hash||
    !["","?tab=posts"].includes(parsed.search))throw Error("INVALID_SOURCE_URL");
 return parsed.href;
}
export function inspectNexusReviewPack(raw){
 if(typeof raw!=="string"||Buffer.byteLength(raw,"utf8")>MAX_BYTES)throw Error("PACK_TOO_LARGE");
 let p;try{p=JSON.parse(raw)}catch{throw Error("INVALID_JSON")}
 assertExactKeys(p,["schema","game","collectionMode","permission","records"],"PACK");
 if(p.schema!=="MODERATOR_NEXUS_REVIEW_PACK_V1"||p.game!=="MADDEN27"||
  p.collectionMode!=="USER_SUPPLIED_ONLY")throw Error("UNSUPPORTED_SOURCE_CONTRACT");
 assertExactKeys(p.permission,["basis","reference","attestation"],"PERMISSION");
 if(!BASIS.has(p.permission.basis)||p.permission.attestation!==true||
  typeof p.permission.reference!=="string"||p.permission.reference.trim().length<12||
  p.permission.reference.length>250)throw Error("PERMISSION_REQUIRED");
 if(!Array.isArray(p.records)||p.records.length===0||p.records.length>MAX_ITEMS)throw Error("INVALID_RECORD_COUNT");
 const seen=new Set();
 const records=p.records.map(r=>{
  assertExactKeys(r,["postId","reviewerId","modId","sourceUrl","postedAt","role","stance","scope","issueKey","gameBuild","summary"],"REVIEW");
  if(typeof r.postId!=="string"||!/^[1-9][0-9]{0,19}$/.test(r.postId)||
     typeof r.reviewerId!=="string"||!/^[1-9][0-9]{0,19}$/.test(r.reviewerId))throw Error("UNSTABLE_SOURCE_ID");
  // Only one Nexus Madden 27 entry is currently evidence-registered in MODerator.
  if(r.modId!=="mod-001")throw Error("MOD_NOT_MAPPED");
  if(!ROLE.has(r.role)||!STANCE.has(r.stance)||!SCOPE.has(r.scope)||
     !ISSUE.has(r.issueKey)||!day(r.postedAt))throw Error("INVALID_REVIEW_FACTS");
  if(r.role==="AUTHOR_RESPONSE"&&r.stance!=="NEUTRAL")throw Error("AUTHOR_NOT_PLAYER_VOTE");
  if(typeof r.summary!=="string"||r.summary.trim().length<15||
     r.summary.length>240||/[<>\u0000-\u001f]/.test(r.summary))throw Error("INVALID_SUMMARY");
  if(r.gameBuild!==null&&(typeof r.gameBuild!=="string"||r.gameBuild.length>80))throw Error("INVALID_BUILD");
  const link=url(r.sourceUrl);
  if(new URL(link).pathname!=="/maddennfl27/mods/1")throw Error("MOD_URL_CONFLICT");
  const id=key("nexus-mods:madden27:"+r.modId+":post:"+r.postId);
  if(seen.has(id))throw Error("DUPLICATE_POST_IN_PACK");
  seen.add(id);
  return {
   id,modId:r.modId,sourceId:id,reviewerKey:key("nexus-mods:reviewer:"+r.reviewerId),
   provider:"NEXUS_MODS",date:r.postedAt,role:r.role,stance:r.stance,
   scope:r.scope,issueKey:r.issueKey,gameBuild:r.gameBuild||null,
   sourceUrl:link,summary:r.summary.trim(),
   provenanceState:"USER_ATTESTED_PENDING_VERIFICATION",
   evidenceRightsState:"PERMISSION_CLAIM_NOT_INDEPENDENTLY_VERIFIED",
   gameRuntimeVerified:false,
   qualityVoteEligible:false
  };
 });
 return {schema:"MODERATOR_NEXUS_REVIEW_INBOX_V1",source:"USER_SUPPLIED_ONLY",
  claimedBasis:p.permission.basis,permissionReferenceHash:key(p.permission.reference.trim()),
  records,permissionIndependentlyVerified:false,automaticScoringEnabled:false};
}
export function mergeNexusInbox(prior,incoming){
 if(!prior||prior.schema!=="MODERATOR_NEXUS_REVIEW_INBOX_V1"||
    !Array.isArray(prior.records))throw Error("INVALID_INBOX");
 if(incoming.schema!==prior.schema)throw Error("INBOX_SCHEMA_MISMATCH");
 const all=new Map(prior.records.map(r=>[r.id,r]));
 let added=0,conflicts=0;
 for(const r of incoming.records){
   const old=all.get(r.id);
   if(!old){all.set(r.id,r);added++;continue}
   // A changed post is never silently overwritten. It needs a reviewer to resolve.
   if(JSON.stringify(old)!==JSON.stringify(r))conflicts++;
 }
 if(all.size>1000)throw Error("INBOX_CAPACITY");
 return {schema:prior.schema,source:"USER_SUPPLIED_ONLY",claimedBasis:"MULTIPLE_USER_ATTESTATIONS",
   permissionReferenceHash:null,records:[...all.values()],permissionIndependentlyVerified:false,
   automaticScoringEnabled:false,added,conflicts};
}
export function emptyNexusInbox(){
 return {schema:"MODERATOR_NEXUS_REVIEW_INBOX_V1",source:"USER_SUPPLIED_ONLY",
  claimedBasis:"NONE",permissionReferenceHash:null,records:[],permissionIndependentlyVerified:false,
  automaticScoringEnabled:false};
}
