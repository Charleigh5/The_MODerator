const AUTH_ENDPOINT="https://auth.openai.com/api/accounts/authorize";
const TOKEN_RESOURCE="https://api.openai.com/v1";
const DEFAULT_SCOPES="openid profile email offline_access resource.invoke chatgpt.tokens.use.direct";

export function chooseLoopbackRedirect(port){
  if(!Number.isInteger(port)||port<1||port>65535) throw new Error("invalid loopback port");
  return `http://127.0.0.1:${port}/auth/callback`;
}

export function buildAuthorizeUrl({
  clientId,
  agentName,
  hostId,
  redirectUri,
  state,
  nonce,
  codeChallenge,
  idTokenHint,
  loginHint,
}){
  if(!clientId||!hostId||!redirectUri||!state||!nonce||!codeChallenge) throw new Error("missing OAuth parameter");
  const u=new URL(AUTH_ENDPOINT);
  u.searchParams.set("client_id",clientId);
  if(clientId==="dynamic_agent_client"){
    if(!agentName) throw new Error("agentName required for dynamic registration");
    u.searchParams.set("agent_name_hint",agentName);
  }
  u.searchParams.set("ext_agent_host_id",hostId);
  if(idTokenHint) u.searchParams.set("id_token_hint",idTokenHint);
  if(loginHint) u.searchParams.set("login_hint",loginHint);
  u.searchParams.set("response_type","code");
  u.searchParams.set("redirect_uri",redirectUri);
  u.searchParams.set("scope",DEFAULT_SCOPES);
  u.searchParams.set("resource",TOKEN_RESOURCE);
  u.searchParams.set("state",state);
  u.searchParams.set("nonce",nonce);
  u.searchParams.set("code_challenge_method","S256");
  u.searchParams.set("code_challenge",codeChallenge);
  return u.toString();
}

export function buildTokenExchangeBody({clientId,code,codeVerifier,redirectUri}){
  const p=new URLSearchParams();
  p.set("grant_type","authorization_code");
  p.set("client_id",clientId);
  p.set("code",code);
  p.set("code_verifier",codeVerifier);
  p.set("redirect_uri",redirectUri);
  p.set("resource",TOKEN_RESOURCE);
  return p.toString();
}

export function buildRefreshBody({clientId,refreshToken}){
  const p=new URLSearchParams();
  p.set("grant_type","refresh_token");
  p.set("client_id",clientId);
  p.set("refresh_token",refreshToken);
  p.set("resource",TOKEN_RESOURCE);
  return p.toString();
}

export function normalizeModels(payload){
  const list=Array.isArray(payload?.models)?payload.models:Array.isArray(payload?.data)?payload.data:[];
  return list
    .filter(m=>!m?.visibility||m.visibility==="list")
    .map(m=>({
      slug:String(m.slug??m.id??""),
      displayName:String(m.display_name??m.name??m.slug??m.id??""),
    }))
    .filter(m=>m.slug&&m.displayName);
}

export function buildResponsesPayload({model,instructions,input}){
  if(!model) throw new Error("model required");
  return {
    model,
    instructions:instructions||undefined,
    input:Array.isArray(input)?input:[],
    store:false,
    stream:true,
  };
}

export function consumeResponseEvent(acc,event){
  const next={...acc};
  if(event?.type==="response.output_text.delta"&&typeof event.delta==="string") next.text+=event.delta;
  if(event?.type==="response.completed") next.completed=true;
  if(event?.type==="error"||event?.type==="response.failed"){
    next.error=event?.error?.message??event?.message??"response failed";
  }
  return next;
}
