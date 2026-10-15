import type { ChatMsg } from "../types";
import type { ModIntentSpec } from "./modIntentCompiler";

export interface ModelInputItem { role:"user"|"assistant"; content:string; }

function capabilitySummary(spec:ModIntentSpec):string {
  return spec.effects.map((effect)=>{
    const top=effect.matches.slice(0,3).map((m)=>
      `${m.capability.id} [${m.capability.evidence}] surface=${m.capability.surface} parity=${m.parity}`
    ).join("; ");
    return `- ${effect.raw}: ${effect.disposition}; ${effect.reason}${top ? `\n  bindings: ${top}` : ""}`;
  }).join("\n");
}

export function buildModeratorInstructions(spec:ModIntentSpec):string {
  const missing=spec.missingInputs.length?spec.missingInputs.join(", "):"none";
  return `You are CODEWRIGHT, the reasoning layer inside MODerator Desktop for CFB27 and Madden 27 PC mod work.
The deterministic MOD_INTENT_V1 compiler below is the source of truth for title parity, capability bindings, evidence status, and build readiness. Use model reasoning to explain, research-plan, compare, troubleshoot, and turn user intent into precise next actions, but do not contradict or silently upgrade these evidence gates.

Rules:
- Never claim a game artifact was built, installed, tested, or runtime-verified unless explicit evidence says so.
- Never promote TARGET, UNKNOWN, CANDIDATE, SCHEMA_DECODED, or NEEDS_VERIFICATION into game-proven behavior by narrative.
- Keep CFB27 and Madden 27 bindings separate.
- Treat original game/save files as immutable; recommend copied inputs, readback verification, rollback, and offline testing.
- Do not provide anti-cheat bypass or online competitive manipulation.
- Ask only for material missing inputs. Prefer one clear question at a time.
- When a request is experimental, decompose it into controlled one-variable tests.
- Distinguish factual source bindings from inference.

Compiler state:
universe=${spec.universe}
readiness=${spec.readiness}
offlineRequired=${spec.offlineRequired}
missingInputs=${missing}
effects:
${capabilitySummary(spec)}

Use the available model intelligence to improve the plan, but preserve those truth boundaries.`;
}

export function buildModeratorInput(messages:ChatMsg[],currentPrompt:string,limit=16):ModelInputItem[] {
  const history=messages
    .filter((m)=>m.role==="user"||m.role==="agent")
    .slice(-Math.max(0,limit))
    .map((m)=>({role:m.role==="user"?"user" as const:"assistant" as const,content:m.text}));
  const last=history[history.length-1];
  if(!last||last.role!=="user"||last.content!==currentPrompt){
    history.push({role:"user",content:currentPrompt});
  }
  return history;
}
