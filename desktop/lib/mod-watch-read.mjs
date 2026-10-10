const allowedProviders=new Set(["GITHUB","EA_OFFICIAL"]);
const allowedKinds=new Set(["TOOL_RELEASE","TOOL_COMMIT","PATCH_CANDIDATE","EA_NEWS"]);
const safe=(value,n=180)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,n);
export function readOnlyWatchSnapshot(raw){
 if(typeof raw!=="string"||Buffer.byteLength(raw,"utf8")>450000)throw Error("WATCH_SNAPSHOT_SIZE");
 const data=JSON.parse(raw);
 if(data?.schema!=="MOD_WATCH_SNAPSHOT_V1"||
  data.promotion!=="RESEARCH_OBSERVATIONS_ONLY"||!Array.isArray(data.recentItems)||!Array.isArray(data.sourceStatus)||
  !data.counts||!Number.isInteger(data.counts.totalObserved))throw Error("WATCH_SNAPSHOT_SCHEMA");
 const events=data.recentItems.slice(0,75).map(event=>{
  const u=new URL(event.url);
  if(u.protocol!=="https:"||!["github.com","www.ea.com"].includes(u.hostname)||
     !allowedProviders.has(event.provider)||!allowedKinds.has(event.kind))throw Error("WATCH_UNTRUSTED_SOURCE");
  const modId=safe(event.modId??"",90);
  if(modId&&!/^dev-[a-z0-9-]+$/.test(modId))throw Error("WATCH_INVALID_MOD_ID");
  if(!/^((INITIAL_BASELINE)|(NEW_SOURCE_ITEM))$/.test(event.detection))throw Error("WATCH_EVENT_STATUS");
  return {id:safe(event.eventKey,210),sourceId:safe(event.sourceId,80),
   kind:event.kind,provider:event.provider,modId:modId||null,
   title:safe(event.title,250),publishedDate:safe(event.publishedDate,10)||null,
   observedAt:safe(event.discoveredAt,32),detection:event.detection,
   url:u.href,status:safe(event.claimStatus,45),
   summary:safe(event.summary,260)};
 });
 return {schema:"MOD_WATCH_SNAPSHOT_V1",observedAt:safe(data.observedAt,36),
   status:data.counts.failedSources>0?"PARTIAL":"OK",
   counts:{totalObserved:data.counts.totalObserved,newItems:Number(data.counts.newItems)||0,
    failedSources:Number(data.counts.failedSources)||0,
    sourcesSucceeded:Number(data.counts.sourcesSucceeded)||0},
   events,sourceStatus:data.sourceStatus.slice(0,12).map(s=>({
     id:safe(s.sourceId,80),status:s.status==="OK"?"OK":"ERROR",
     errorCode:s.status==="OK"?null:safe(s.errorCode,55)}))};
}
