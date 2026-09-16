import type { ModIntentSpec } from "./modIntentCompiler.js";
export type ConflictClass="HARD_CONFLICT"|"SOFT_CONFLICT"|"ORDER_DEPENDENT"|"MERGEABLE"|"UNKNOWN";
export interface ConflictFinding{a:string;b:string;classification:ConflictClass;reason:string;}
function family(surface:string){if(/TEAM_BUILDER/.test(surface))return"team-builder";if(/SAVE_FRTK|ROSTER/.test(surface))return"save";if(/FROSTBITE_FTC/.test(surface))return"ftc";if(/FROSTBITE_(EBX|MESH|TEXTURE|RES)/.test(surface))return"asset";if(/RUNTIME/.test(surface))return"runtime";return surface;}
export function analyzeCompatibility(spec:ModIntentSpec):ConflictFinding[]{
  const caps=spec.effects.flatMap(e=>e.matches.slice(0,2).map(m=>m.capability));
  const out:ConflictFinding[]=[];
  for(let i=0;i<caps.length;i++)for(let j=i+1;j<caps.length;j++){
    const a=caps[i],b=caps[j];if(a.id===b.id)continue;
    const fa=family(a.surface),fb=family(b.surface);
    if(fa!==fb){
      out.push({a:a.id,b:b.id,classification:"UNKNOWN",reason:"Different manipulation planes reduce direct binary collision risk, but semantic interaction is not proven. Validate combined behavior before promotion."});
      continue;
    }
    if(fa==="runtime"){
      out.push({a:a.id,b:b.id,classification:"ORDER_DEPENDENT",reason:"Runtime hooks/transactions can interact; exact-build sequencing is required."});
      continue;
    }
    if(fa==="team-builder"){
      out.push({a:a.id,b:b.id,classification:"MERGEABLE",reason:"Controls share the Team Builder payload but target distinct source-backed properties; re-read the merged payload before submission."});
      continue;
    }
    out.push({a:a.id,b:b.id,classification:"UNKNOWN",reason:"Same resource family; exact touched table/asset keys are required before declaring merge safety."});
  }
  return out;
}
