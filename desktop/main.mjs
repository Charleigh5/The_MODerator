import { app, BrowserWindow, dialog, ipcMain, safeStorage, shell } from "electron";
import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  buildAuthorizeUrl,
  buildRefreshBody,
  buildResponsesPayload,
  buildTokenExchangeBody,
  chooseLoopbackRedirect,
  consumeResponseEvent,
  normalizeModels,
} from "./lib/siwc-core.mjs";
import { inspectStudioPlan } from "./lib/studio-plan.mjs";

const APP_NAME="MODerator Desktop";
const TOKEN_ENDPOINT="https://auth.openai.com/api/accounts/oauth/token";
const JWKS=createRemoteJWKSet(new URL("https://auth.openai.com/.well-known/jwks.json"));
const ISSUER="https://auth.openai.com";
const RESOURCE="https://api.openai.com/v1";
let mainWindow=null;

const userPath=(name)=>path.join(app.getPath("userData"),name);
const base64url=(buf)=>Buffer.from(buf).toString("base64url");

async function getHostId(){
  const file=userPath("siwc-host.json");
  try {
    const parsed=JSON.parse(await fs.readFile(file,"utf8"));
    if(typeof parsed.ext_agent_host_id==="string"&&parsed.ext_agent_host_id) return parsed.ext_agent_host_id;
  } catch {}
  const ext_agent_host_id=`urn:uuid:${crypto.randomUUID()}`;
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,JSON.stringify({ext_agent_host_id},null,2),"utf8");
  return ext_agent_host_id;
}

async function readCredentials(){
  const file=userPath("siwc-credentials.bin");
  try {
    const encrypted=await fs.readFile(file);
    if(!safeStorage.isEncryptionAvailable()) throw new Error("OS credential encryption unavailable");
    return JSON.parse(safeStorage.decryptString(encrypted));
  } catch (err) {
    if(err?.code==="ENOENT") return null;
    if(String(err?.message??err).includes("OS credential encryption unavailable")) throw err;
    return null;
  }
}

async function writeCredentials(record){
  if(!safeStorage.isEncryptionAvailable()) throw new Error("OS credential encryption unavailable");
  const file=userPath("siwc-credentials.bin");
  await fs.mkdir(path.dirname(file),{recursive:true});
  const encrypted=safeStorage.encryptString(JSON.stringify(record));
  const temp=`${file}.tmp`;
  await fs.writeFile(temp,encrypted);
  await fs.rename(temp,file);
}

async function clearCredentials(){
  try { await fs.unlink(userPath("siwc-credentials.bin")); } catch {}
}

function publicStatus(record){
  if(!record) return {desktop:true,connected:false,planEnabled:false};
  return {
    desktop:true,
    connected:true,
    planEnabled:Array.isArray(record.scopes)&&record.scopes.includes("chatgpt.tokens.use.direct"),
    email:record.email??null,
    name:record.name??null,
    clientId:record.client_id??null,
    expiresAt:record.expires_at??null,
  };
}

async function postForm(url,body){
  const res=await fetch(url,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
  const text=await res.text();
  if(!res.ok) throw new Error(`OpenAI auth failed (${res.status}): ${text.slice(0,400)}`);
  return JSON.parse(text);
}

async function validateIdToken(idToken,clientId,nonce){
  const {payload}=await jwtVerify(idToken,JWKS,{issuer:ISSUER,audience:clientId});
  if(payload.nonce!==nonce) throw new Error("OpenAI ID token nonce mismatch");
  if(!payload.sub) throw new Error("OpenAI ID token missing subject");
  return payload;
}

async function createCallbackServer(expectedState){
  let timer;
  let resolveCallback;
  let rejectCallback;
  const callbackPromise=new Promise((resolve,reject)=>{resolveCallback=resolve;rejectCallback=reject;});
  const server=http.createServer((req,res)=>{
    try {
      const u=new URL(req.url??"/","http://127.0.0.1");
      if(u.pathname!=="/auth/callback"){res.writeHead(404).end("Not found");return;}
      const state=u.searchParams.get("state");
      if(state!==expectedState) throw new Error("OAuth state mismatch");
      const error=u.searchParams.get("error");
      if(error) throw new Error(`OpenAI authorization declined: ${error}`);
      const code=u.searchParams.get("code");
      if(!code) throw new Error("OAuth callback missing code");
      res.writeHead(200,{"content-type":"text/html; charset=utf-8"});
      res.end("<!doctype html><title>MODerator connected</title><body style='font-family:system-ui;background:#001b3a;color:#fff;padding:40px'><h1>MODerator connected.</h1><p>You can close this window and return to the app.</p></body>");
      clearTimeout(timer);
      resolveCallback({
        code,
        clientId:u.searchParams.get("client_id"),
        scope:u.searchParams.get("scope")??"",
      });
      setTimeout(()=>server.close(),50);
    } catch(err) {
      res.writeHead(400,{"content-type":"text/plain; charset=utf-8"});
      res.end(String(err?.message??err));
      clearTimeout(timer);
      rejectCallback(err);
      setTimeout(()=>server.close(),50);
    }
  });
  await new Promise((resolve,reject)=>{
    server.once("error",reject);
    server.listen(0,"127.0.0.1",resolve);
  });
  timer=setTimeout(()=>{server.close();rejectCallback(new Error("ChatGPT sign-in timed out"));},5*60*1000);
  const addr=server.address();
  return {redirectUri:chooseLoopbackRedirect(addr.port),callbackPromise,close:()=>server.close()};
}

async function signIn(){
  const existing=await readCredentials();
  const hostId=await getHostId();
  const state=base64url(crypto.randomBytes(24));
  const nonce=base64url(crypto.randomBytes(24));
  const verifier=base64url(crypto.randomBytes(48));
  const challenge=base64url(crypto.createHash("sha256").update(verifier).digest());
  const listener=await createCallbackServer(state);
  const clientId=existing?.client_id??"dynamic_agent_client";
  const authUrl=buildAuthorizeUrl({
    clientId,
    agentName:APP_NAME,
    hostId,
    redirectUri:listener.redirectUri,
    state,
    nonce,
    codeChallenge:challenge,
    idTokenHint:existing?.id_token,
    loginHint:existing?.email,
  });
  await shell.openExternal(authUrl);
  const cb=await listener.callbackPromise;
  const issuedClientId=clientId==="dynamic_agent_client"?cb.clientId:clientId;
  if(!issuedClientId) throw new Error("OpenAI did not return an issued client ID");
  if(clientId!=="dynamic_agent_client"&&cb.clientId&&cb.clientId!==clientId) throw new Error("OpenAI returned an unexpected client ID");
  const token=await postForm(TOKEN_ENDPOINT,buildTokenExchangeBody({
    clientId:issuedClientId,
    code:cb.code,
    codeVerifier:verifier,
    redirectUri:listener.redirectUri,
  }));
  const identity=await validateIdToken(token.id_token,issuedClientId,nonce);
  if(existing?.subject&&existing.subject!==identity.sub) throw new Error("Signed-in ChatGPT account does not match the selected saved account");
  const scopes=String(token.scope??cb.scope??"").split(/\s+/).filter(Boolean);
  const now=Date.now();
  const record={
    email:identity.email??null,
    name:identity.name??identity.preferred_username??null,
    issuer:identity.iss,
    subject:identity.sub,
    client_id:issuedClientId,
    ext_agent_host_id:hostId,
    id_token:token.id_token,
    access_token:token.access_token,
    refresh_token:token.refresh_token,
    token_type:token.token_type??"Bearer",
    expires_in:Number(token.expires_in??3600),
    expires_at:now+Number(token.expires_in??3600)*1000,
    earliest_refresh_at:token.earliest_refresh_at??null,
    scopes,
    saved_at:new Date(now).toISOString(),
  };
  await writeCredentials(record);
  return publicStatus(record);
}

async function refreshCredentials(record){
  if(!record?.refresh_token||!record?.client_id) throw new Error("ChatGPT session needs sign-in");
  const token=await postForm(TOKEN_ENDPOINT,buildRefreshBody({clientId:record.client_id,refreshToken:record.refresh_token}));
  const scopes=String(token.scope??record.scopes?.join(" ")??"").split(/\s+/).filter(Boolean);
  const now=Date.now();
  const next={
    ...record,
    access_token:token.access_token,
    refresh_token:token.refresh_token??record.refresh_token,
    id_token:token.id_token??record.id_token,
    token_type:token.token_type??record.token_type??"Bearer",
    expires_in:Number(token.expires_in??3600),
    expires_at:now+Number(token.expires_in??3600)*1000,
    earliest_refresh_at:token.earliest_refresh_at??record.earliest_refresh_at??null,
    scopes,
    saved_at:new Date(now).toISOString(),
  };
  await writeCredentials(next);
  return next;
}

async function ensureAccessToken(){
  let record=await readCredentials();
  if(!record) throw new Error("Continue with ChatGPT first");
  if(!record.scopes?.includes("chatgpt.tokens.use.direct")) throw new Error("ChatGPT plan usage was not authorized for this app");
  if(!record.expires_at||record.expires_at-Date.now()<120000) record=await refreshCredentials(record);
  return record;
}

async function openAiFetch(url,options={},retry=true){
  const record=await ensureAccessToken();
  const res=await fetch(url,{...options,headers:{...(options.headers??{}),Authorization:`Bearer ${record.access_token}`}});
  if(res.status===401&&retry){
    await refreshCredentials(record);
    return openAiFetch(url,options,false);
  }
  return res;
}

async function listModels(){
  const res=await openAiFetch(`${RESOURCE}/models`);
  const text=await res.text();
  if(!res.ok) throw new Error(`Model catalog failed (${res.status}): ${text.slice(0,300)}`);
  return normalizeModels(JSON.parse(text));
}

async function runResponse(event,request){
  const payload=buildResponsesPayload(request);
  const res=await openAiFetch(`${RESOURCE}/responses`,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(payload),
  });
  if(!res.ok){
    const text=await res.text();
    throw new Error(`Model request failed (${res.status}): ${text.slice(0,500)}`);
  }
  if(!res.body) throw new Error("Model response stream missing");
  const decoder=new TextDecoder();
  let buffer="";
  let acc={text:"",completed:false,error:null};
  for await (const chunk of res.body){
    buffer+=decoder.decode(chunk,{stream:true});
    const lines=buffer.split(/\r?\n/);
    buffer=lines.pop()??"";
    for(const line of lines){
      if(!line.startsWith("data:")) continue;
      const data=line.slice(5).trim();
      if(!data||data==="[DONE]") continue;
      let parsed;
      try { parsed=JSON.parse(data); } catch { continue; }
      const before=acc.text;
      acc=consumeResponseEvent(acc,parsed);
      if(acc.text.length>before.length&&event?.sender&&!event.sender.isDestroyed()){
        event.sender.send("moderator:ai-delta",{requestId:request.requestId,delta:acc.text.slice(before.length)});
      }
      if(acc.error) throw new Error(acc.error);
    }
  }
  if(!acc.completed&&!acc.text) throw new Error("Model stream completed without text");
  return {requestId:request.requestId,text:acc.text,model:request.model,completed:acc.completed};
}

async function hashFile(file){
  return new Promise((resolve,reject)=>{
    const h=crypto.createHash("sha256");
    const s=createReadStream(file);
    s.on("data",d=>h.update(d));s.on("error",reject);s.on("end",()=>resolve(h.digest("hex")));
  });
}

async function pickLocalFile(){
  const result=await dialog.showOpenDialog(mainWindow,{
    title:"Select a MODerator source file",
    properties:["openFile"],
    filters:[
      {name:"Gridiron sources",extensions:["sav","db","ftc","fbmod","json","csv","txt","md","zip"]},
      {name:"All files",extensions:["*"]},
    ],
  });
  if(result.canceled||!result.filePaths[0]) return null;
  const file=result.filePaths[0];
  const stat=await fs.stat(file);
  const ext=path.extname(file).toLowerCase();
  const textExt=new Set([".json",".csv",".txt",".md"]);
  let preview=null;
  if(textExt.has(ext)&&stat.size<=2*1024*1024) preview=(await fs.readFile(file,"utf8")).slice(0,200000);
  return {path:file,name:path.basename(file),extension:ext,size:stat.size,sha256:await hashFile(file),preview};
}

async function importStudioPlan() {
  const chosen = await dialog.showOpenDialog(mainWindow, {
    title: "Inspect a Madden 27 Studio plan",
    properties: ["openFile"],
    filters: [{ name: "Madden Studio JSON plan", extensions: ["json"] }],
  });
  if (chosen.canceled || !chosen.filePaths[0]) return null;
  const file = chosen.filePaths[0];
  const stat = await fs.stat(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error("Plan must be a JSON file under 1 MiB.");
  return { name: path.basename(file), ...inspectStudioPlan(await fs.readFile(file, "utf8")) };
}

function createWindow(){
  mainWindow=new BrowserWindow({
    width:1440,height:960,minWidth:1100,minHeight:720,
    backgroundColor:"#001b3a",
    webPreferences:{
      preload:path.join(import.meta.dirname,"preload.cjs"),
      contextIsolation:true,
      nodeIntegration:false,
      sandbox:true,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(()=>({action:"deny"}));
  mainWindow.webContents.on("will-navigate",(event,url)=>{
    if(!url.startsWith("file:")&&!url.startsWith("http://127.0.0.1:3000")) event.preventDefault();
  });
  mainWindow.webContents.once("did-finish-load",async()=>{
    if(process.env.MODERATOR_SMOKE_TEST!=="1") return;
    try {
      const result=await mainWindow.webContents.executeJavaScript(`(async () => {
        const buttons = () => Array.from(document.querySelectorAll("button"));
        const sample = buttons().find(b => b.textContent?.includes("Player equipment"));
        sample?.click();
        await new Promise(resolve => setTimeout(resolve, 100));
        const promptReady = Boolean(document.querySelector("#m27-prompt")?.value?.includes("visor"));
        buttons().find(b => b.textContent?.includes("Analyze request"))?.click();
        await new Promise(resolve => setTimeout(resolve, 250));
        return {
          title: document.title,
          bridge: Boolean(window.moderatorDesktop?.isDesktop),
          studio: Boolean(document.querySelector(".m27-shell")),
          promptReady,
          messageCount: document.querySelectorAll(".m27-message").length,
          planEnabled: Boolean(buttons().find(b => b.textContent?.includes("Download evidence plan") && !b.disabled))
        };
      })()`);
      console.log("MODERATOR_DESKTOP_SMOKE "+JSON.stringify(result));
      const code=result.bridge&&result.studio&&result.promptReady&&result.messageCount>=3&&result.planEnabled?0:2;
      await fs.writeFile(userPath("desktop-studio.png"),(await mainWindow.webContents.capturePage()).toPNG());
      await fs.writeFile(userPath("desktop-smoke.json"),JSON.stringify({
        at:new Date().toISOString(),
        code,
        result,
        packaged:app.isPackaged,
        version:app.getVersion()
      },null,2),"utf8");
      setTimeout(()=>app.exit(code),150);
    } catch(err) {
      console.error("MODERATOR_DESKTOP_SMOKE_ERROR",err);
      await fs.writeFile(userPath("desktop-smoke.json"),JSON.stringify({
        at:new Date().toISOString(),
        code:2,
        error:String(err?.message??err),
        packaged:app.isPackaged,
        version:app.getVersion()
      },null,2),"utf8").catch(()=>{});
      setTimeout(()=>app.exit(2),150);
    }
  });
  const dev=process.env.MODERATOR_DEV_URL;
  if(dev) mainWindow.loadURL(dev);
  else mainWindow.loadFile(path.join(import.meta.dirname,"..","dist","index.html"));
}

app.whenReady().then(()=>{
  ipcMain.handle("moderator:auth-status",async()=>publicStatus(await readCredentials()));
  ipcMain.handle("moderator:auth-sign-in",signIn);
  ipcMain.handle("moderator:auth-disconnect",async()=>{await clearCredentials();return publicStatus(null);});
  ipcMain.handle("moderator:list-models",listModels);
  ipcMain.handle("moderator:chat",runResponse);
  ipcMain.handle("moderator:pick-file",pickLocalFile);
  ipcMain.handle("moderator:import-studio-plan",importStudioPlan);
  createWindow();
  app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
