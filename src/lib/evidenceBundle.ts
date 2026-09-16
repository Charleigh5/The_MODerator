import type { BundleMeta, GenFile, CategoryId } from "../types.js";
import type { ModIntentSpec } from "./modIntentCompiler.js";
import { buildRecipes } from "./buildRecipe.js";
import { createProofReceipt } from "./proofEngine.js";
import { analyzeCompatibility } from "./compatibilityEngine.js";
function hashStr(input:string):string{let h=0x811c9dc5;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,0x01000193);}return(h>>>0).toString(16).padStart(8,"0");}
function asJson(path:string,value:unknown):GenFile{const content=JSON.stringify(value,null,2);return{path,lang:"json",content,bytes:new TextEncoder().encode(content).length};}
function bindings(intent:ModIntentSpec){return intent.effects.flatMap(effect=>effect.matches.map(match=>({effect:effect.raw,capabilityId:match.capability.id,title:match.capability.title,surface:match.capability.surface,evidence:match.capability.evidence,parity:match.parity,source:match.capability.source,score:match.score,reasons:match.reasons})));}
export function createEvidenceBundle(intent:ModIntentSpec):BundleMeta{const receipt=createProofReceipt(intent),recipes=buildRecipes(intent),compatibility=analyzeCompatibility(intent);const id=`moderator.plan.${hashStr(intent.originalPrompt+intent.universe+JSON.stringify(bindings(intent)))}`;const files:GenFile[]=[asJson("moderator-plan/intent.json",intent),asJson("moderator-plan/source-bindings.json",bindings(intent)),asJson("moderator-plan/build-recipes.json",recipes),asJson("moderator-plan/compatibility.json",compatibility),asJson("moderator-plan/proof-receipt.json",receipt)];return{title:"Evidence-Gated Mod Execution Package",slug:id.replace(/[^a-z0-9.-]+/gi,"-").toLowerCase(),id,version:"1.0.0",hash:hashStr(files.map(f=>f.content).join("\n")),category:"rules" as CategoryId,blocksLinked:bindings(intent).length,kbUsed:[],files};}
export function isEvidenceBundle(bundle:BundleMeta|null|undefined):boolean{return Boolean(bundle?.id.startsWith("moderator.plan."));}
