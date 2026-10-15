import assert from "node:assert/strict";
import {
  buildAuthorizeUrl,
  buildTokenExchangeBody,
  buildRefreshBody,
  normalizeModels,
  buildResponsesPayload,
  consumeResponseEvent,
  chooseLoopbackRedirect,
} from "../desktop/lib/siwc-core.mjs";

const auth = new URL(buildAuthorizeUrl({
  clientId:"dynamic_agent_client",
  agentName:"MODerator Desktop",
  hostId:"urn:uuid:11111111-1111-4111-8111-111111111111",
  redirectUri:"http://127.0.0.1:1455/auth/callback",
  state:"state-1",
  nonce:"nonce-1",
  codeChallenge:"challenge-1",
}));
assert.equal(auth.origin,"https://auth.openai.com");
assert.equal(auth.pathname,"/api/accounts/authorize");
assert.equal(auth.searchParams.get("client_id"),"dynamic_agent_client");
assert.equal(auth.searchParams.get("agent_name_hint"),"MODerator Desktop");
assert.equal(auth.searchParams.get("resource"),"https://api.openai.com/v1");
assert.match(auth.searchParams.get("scope")??"",/chatgpt\.tokens\.use\.direct/);
assert.equal(auth.searchParams.get("code_challenge_method"),"S256");

const returning = new URL(buildAuthorizeUrl({
  clientId:"oaiapp_saved",
  hostId:"urn:uuid:11111111-1111-4111-8111-111111111111",
  redirectUri:"http://127.0.0.1:43111/auth/callback",
  state:"s",
  nonce:"n",
  codeChallenge:"c",
  idTokenHint:"id-token",
  loginHint:"coach@example.com",
}));
assert.equal(returning.searchParams.has("agent_name_hint"),false);
assert.equal(returning.searchParams.get("id_token_hint"),"id-token");

const exchange = new URLSearchParams(buildTokenExchangeBody({
  clientId:"oaiapp_123",code:"code",codeVerifier:"verifier",
  redirectUri:"http://127.0.0.1:1455/auth/callback"
}));
assert.equal(exchange.get("grant_type"),"authorization_code");
assert.equal(exchange.get("resource"),"https://api.openai.com/v1");
assert.equal(exchange.has("client_secret"),false);

const refresh = new URLSearchParams(buildRefreshBody({clientId:"oaiapp_123",refreshToken:"refresh"}));
assert.equal(refresh.get("grant_type"),"refresh_token");
assert.equal(refresh.has("scope"),false);

assert.deepEqual(normalizeModels({models:[
  {slug:"gpt-a",display_name:"GPT A",visibility:"list"},
  {slug:"hidden",display_name:"Hidden",visibility:"hidden"}
]}),[{slug:"gpt-a",displayName:"GPT A"}]);
assert.deepEqual(normalizeModels({data:[
  {id:"gpt-b",name:"GPT B",visibility:"list"}
]}),[{slug:"gpt-b",displayName:"GPT B"}]);

const payload=buildResponsesPayload({
  model:"gpt-a",
  instructions:"Use evidence.",
  input:[{role:"user",content:"hello"}],
});
assert.equal(payload.store,false);
assert.equal(payload.stream,true);
assert.equal(payload.model,"gpt-a");
assert.equal("previous_response_id" in payload,false);
assert.equal("temperature" in payload,false);

let acc={text:"",completed:false,error:null};
acc=consumeResponseEvent(acc,{type:"response.output_text.delta",delta:"Hello"});
acc=consumeResponseEvent(acc,{type:"response.output_text.delta",delta:" world"});
acc=consumeResponseEvent(acc,{type:"response.completed"});
assert.equal(acc.text,"Hello world");
assert.equal(acc.completed,true);

assert.equal(chooseLoopbackRedirect(43111),"http://127.0.0.1:43111/auth/callback");
console.log("SIWC_CORE_PASS");
