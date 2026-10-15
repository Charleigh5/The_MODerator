import { createHash, randomUUID } from "node:crypto";
import { open, readFile, writeFile, mkdir, rename, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const EA="https://www.ea.com/games/madden-nfl/madden-nfl-27/news";
export const MONITOR_SOURCES=Object.freeze([
 {id:"ea-madden27-news",kind:"EA_NEWS",url:EA,modId:null},
 ...[
  ["fmt","FMTDev","FMT.Madden26Plugin","dev-fmt-madden-27-profile-compiler"],
  ["mmc","bphit4","MMC-Frosty-Modding-Tools","dev-mmc-frosty-modding-tools"],
  ["franchise","bep713","madden-franchise","dev-madden-franchise-parser"]
 ].flatMap(([short,owner,repo,modId])=>[
  {id:short+"-releases",kind:"GITHUB_RELEASES",url:`https://api.github.com/repos/${owner}/${repo}/releases?per_page=5`,modId},
  {id:short+"-commits",kind:"GITHUB_COMMITS",url:`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,modId}
 ])
]);
const sha=(text)=>createHash("sha256").update(text).digest("hex");
const MAX_BYTES=700_000;
const allowedHost=new Set(["api.github.com","www.ea.com"]);
const clean=(v,max=300)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
const toDay=(s)=>/^20\d\d-\d\d-\d\d/.test(String(s??""))?String(s).slice(0,10):null;
export function validateSource(source){
 const u=new URL(source.url);
 if(u.protocol!=="https:"||!allowedHost.has(u.hostname)||u.username||u.password||u.port)throw Error("DISALLOWED_SOURCE");
 if(u.hostname==="www.ea.com"&&u.pathname!=="/games/madden-nfl/madden-nfl-27/news")throw Error("DISALLOWED_EA_PATH");
 if(u.hostname==="api.github.com"&&!/^\/repos\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/(?:releases|commits)$/.test(u.pathname))throw Error("DISALLOWED_GITHUB_PATH");
 return u;
}
async function fetchText(source,fetchFn){
 validateSource(source);
 const res=await fetchFn(source.url,{redirect:"manual",signal:AbortSignal.timeout(12000),headers:{
   "accept":source.kind==="EA_NEWS"?"text/html":"application/vnd.github+json",
   "user-agent":"MODerator-readonly-watch/0.1",
   "x-github-api-version":"2022-11-28"
 }});
 if(res.status!==200)throw Error("HTTP_"+res.status);
 const mime=res.headers.get("content-type")??"";
 if(!mime.includes(source.kind==="EA_NEWS"?"text/html":"json"))throw Error("CONTENT_TYPE");
 const len=Number(res.headers.get("content-length")??0);
 if(len>MAX_BYTES)throw Error("RESPONSE_TOO_LARGE");
 const reader=res.body?.getReader();
 if(!reader)throw Error("EMPTY_BODY");
 let size=0;const chunks=[];
 try {
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   size+=value.length;
   if(size>MAX_BYTES)throw Error("RESPONSE_TOO_LARGE");
   chunks.push(value);
  }
 }finally{await reader.cancel().catch(()=>{});}
 return Buffer.concat(chunks).toString("utf8");
}
const EA_PATTERN=/\/games\/madden-nfl\/madden-nfl-27\/news\/([a-z0-9-]{4,100})/gi;
export function extractEvents(source,body){
 let entries=[];
 if(source.kind==="EA_NEWS"){
  const slugs=new Set();
  for(const m of body.matchAll(EA_PATTERN))slugs.add(m[1].toLowerCase());
  if(!slugs.size)throw Error("EA_PARSER_NO_LINKS");
  entries=[...slugs].slice(0,100).map(slug=>({
   sourceId:source.id,provider:"EA_OFFICIAL",eventKey:"ea-news:"+slug,
   modId:null,kind:slug.includes("title-update")?"PATCH_CANDIDATE":"EA_NEWS",
   title:clean(slug.replace(/-/g," "),180),publishedDate:null,
   url:EA+"/"+slug,claimStatus:"REVIEW_REQUIRED",summary:"EA news-link observed; category and effective date require verification."
  }));
 }else{
  const list=JSON.parse(body);
  if(!Array.isArray(list))throw Error("INVALID_GITHUB_PAYLOAD");
  entries=list.slice(0,12).map(record=>{
   if(source.kind==="GITHUB_RELEASES"){
    if(!Number.isSafeInteger(record?.id)||typeof record.tag_name!=="string"||
      typeof record.html_url!=="string"||!record.html_url.startsWith("https://github.com/"))throw Error("INVALID_RELEASE");
    return {sourceId:source.id,provider:"GITHUB",eventKey:"github-release:"+source.id+":"+record.id,
      modId:source.modId,kind:"TOOL_RELEASE",title:clean(record.name||record.tag_name),
      publishedDate:toDay(record.published_at),url:record.html_url,
      claimStatus:"PRIMARY_HOST_METADATA",summary:clean("Tag: "+record.tag_name+"; immutable provider release ID: "+record.id)};
   }
   if(!/^[0-9a-f]{40}$/i.test(record?.sha??"")||
     typeof record?.html_url!=="string"||!record.html_url.startsWith("https://github.com/"))throw Error("INVALID_COMMIT");
   return {sourceId:source.id,provider:"GITHUB",eventKey:"github-commit:"+source.id+":"+record.sha,
    modId:source.modId,kind:"TOOL_COMMIT",title:clean(record.commit?.message?.split("\n")[0]??"Commit"),
    publishedDate:toDay(record.commit?.committer?.date),url:record.html_url,
    claimStatus:"PRIMARY_HOST_METADATA",summary:"Public source commit; no game compatibility inferred."};
  });
 }
 if(entries.length>120)throw Error("EVENT_LIMIT");
 return entries;
}
const empty=()=>({schema:"MOD_WATCH_STATE_V1",events:[],knownKeys:[],firstRun:null});
async function atomicJson(file,value){
 const tmp=file+"."+process.pid+"."+randomUUID()+".tmp";
 const backup=file+".previous";
 let displaced=false;
 try{
  await writeFile(tmp,JSON.stringify(value,null,2)+"\n",{encoding:"utf8",flag:"wx"});
  // Windows anti-malware and brief readers can hold existing files open.
  for(let attempt=0;attempt<5;attempt++){
   try{await rename(tmp,file);return;}
   catch(e){if(!["EPERM","EEXIST","EACCES"].includes(e.code))throw e;}
   await new Promise(resolve=>setTimeout(resolve,150*(attempt+1)));
  }
  // Retain a recovery copy until the new snapshot is in place.
  const exists=await stat(file).then(()=>true).catch(e=>e.code==="ENOENT"?false:Promise.reject(e));
  if(!exists)throw Error("RENAME_RETRY_EXHAUSTED");
  await unlink(backup).catch(e=>{if(e.code!=="ENOENT")throw e;});
  await rename(file,backup);displaced=true;
  await rename(tmp,file);displaced=false;
  await unlink(backup).catch(()=>{});
 }catch(error){
  if(displaced)await rename(backup,file).catch(()=>{});
  throw error;
 }finally{await unlink(tmp).catch(()=>{});}
}
async function withLock(folder,fn){
 await mkdir(folder,{recursive:true});
 const lock=join(folder,"collector.lock");let fd;
 try{fd=await open(lock,"wx");}
 catch(e){
  if(e.code!=="EEXIST")throw e;
  const info=await stat(lock).catch(()=>null);
  if(info && Date.now()-info.mtimeMs>30*60*1000){await unlink(lock).catch(()=>{});fd=await open(lock,"wx");}
  else throw Error("RUN_ALREADY_ACTIVE");
 }
 try{return await fn();}finally{await fd.close();await unlink(lock).catch(()=>{});}
}
export async function runCollector({folder,fetchFn=fetch,sources=MONITOR_SOURCES,now=new Date()}){
 if(!folder||typeof folder!=="string")throw Error("STORAGE_FOLDER_REQUIRED");
 const runId=randomUUID();
 return withLock(folder,async()=>{
  const statePath=join(folder,"state.json");
  const previous=await readFile(statePath,"utf8").then(JSON.parse).catch(async e=>{
    if(e.code!=="ENOENT")throw e;
    // A previous task interrupted during replacement must not erase its ledger.
    return readFile(statePath+".previous","utf8").then(JSON.parse).catch(err=>{
      if(err.code==="ENOENT")return empty();
      throw err;
    });
  });
  if(previous.schema!=="MOD_WATCH_STATE_V1"||!Array.isArray(previous.events)||!Array.isArray(previous.knownKeys))throw Error("INVALID_PRIOR_STATE");
  const prior=new Set(previous.knownKeys);
  const startBaseline=previous.firstRun===null;
  const statuses=[];const newEvents=[];
  for(const source of sources){
   try{
    const body=await fetchText(source,fetchFn);
    const events=extractEvents(source,body);
    for(const e of events){
      if(prior.has(e.eventKey))continue;
      prior.add(e.eventKey);
      newEvents.push({...e,discoveredAt:now.toISOString(),firstObservedRunId:runId,
        detection:startBaseline?"INITIAL_BASELINE":"NEW_SOURCE_ITEM",
        evidenceQuality:e.provider==="GITHUB"?"DIRECT_HOST_METADATA":"UNREVIEWED_OFFICIAL_INDEX",
        userSatisfactionRating:null,gameRuntimeVerified:false});
    }
    statuses.push({sourceId:source.id,status:"OK",itemsSeen:events.length,added:events.filter(e=>newEvents.some(x=>x.eventKey===e.eventKey)).length});
   }catch(err){statuses.push({sourceId:source.id,status:"ERROR",errorCode:clean(err?.message??"FETCH_FAILED",60),itemsSeen:0,added:0});}
  }
  if(!statuses.some(x=>x.status==="OK")){
   const failure={schema:"MOD_WATCH_RUN_V1",runId,at:now.toISOString(),status:"FAILED_ALL_SOURCES",statuses,added:0};
   await atomicJson(join(folder,"last-run.json"),failure);
   return failure;
  }
  const all=[...previous.events,...newEvents].slice(-10000);
  const updated={schema:"MOD_WATCH_STATE_V1",firstRun:previous.firstRun??now.toISOString(),
     knownKeys:[...prior].slice(-15000),events:all};
  const latest={schema:"MOD_WATCH_SNAPSHOT_V1",observedAt:now.toISOString(),runId,
    promotion:"RESEARCH_OBSERVATIONS_ONLY",sourceStatus:statuses,
    newItems:newEvents.slice(-50),recentItems:all.slice(-100).reverse(),
    counts:{totalObserved:all.length,newItems:newEvents.length,failedSources:statuses.filter(x=>x.status==="ERROR").length,
      sourcesSucceeded:statuses.filter(x=>x.status==="OK").length,
      communityQualityRatingsCreated:0,modGameVerified:0}};
  await atomicJson(statePath,updated);
  await atomicJson(join(folder,"latest.json"),latest);
  const receipt={schema:"MOD_WATCH_RUN_V1",runId,at:now.toISOString(),
    status:statuses.some(x=>x.status==="ERROR")?"PARTIAL":"OK",
    statuses,added:newEvents.length,baseline:startBaseline};
  await atomicJson(join(folder,"last-run.json"),receipt);
  return receipt;
 });
}
