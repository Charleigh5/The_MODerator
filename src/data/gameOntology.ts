import { CAPABILITY_REGISTRY } from "./capabilityRegistry.js";

export const GAME_DOMAINS = [
  "Roster & player","Appearance","Gameplay style","Gameplay","Health","Player abilities","Progression","Dynasty","Uniforms","Frostbite","Packaging","Runtime research","Roster automation","Coaches","Discovery","Architecture"
] as const;

export interface OntologyNode { id: string; kind: "domain" | "capability" | "surface" | "evidence"; label: string; }
export interface OntologyEdge { from: string; to: string; relation: "CONTAINS" | "USES_SURFACE" | "HAS_EVIDENCE"; }

export function buildGameOntology() {
  const nodes: OntologyNode[] = []; const edges: OntologyEdge[] = []; const seen = new Set<string>();
  const add=(n:OntologyNode)=>{ if(!seen.has(n.id)){seen.add(n.id);nodes.push(n);} };
  for (const c of CAPABILITY_REGISTRY) {
    const domain=`domain:${c.category}`, cap=`cap:${c.id}`, surface=`surface:${c.surface}`, ev=`evidence:${c.evidence}`;
    add({id:domain,kind:"domain",label:c.category}); add({id:cap,kind:"capability",label:c.title}); add({id:surface,kind:"surface",label:c.surface}); add({id:ev,kind:"evidence",label:c.evidence});
    edges.push({from:domain,to:cap,relation:"CONTAINS"},{from:cap,to:surface,relation:"USES_SURFACE"},{from:cap,to:ev,relation:"HAS_EVIDENCE"});
  }
  return { nodes, edges, capabilityCount: CAPABILITY_REGISTRY.length, domainCount: new Set(CAPABILITY_REGISTRY.map(c=>c.category)).size };
}
