import { CAPABILITY_REGISTRY, type CapabilityRecord } from "../data/capabilityRegistry.js";
import { parityForSurface, type ParityState } from "../data/madden27Parity.js";

export type Universe = "CFB27" | "MADDEN27";
export interface CapabilityMatch { capability: CapabilityRecord; score: number; parity: ParityState; reasons: string[]; }

const STOP = new Set([
  "the","and","for","with","this","that","from","into","make","want","player","team","game","mod","more","my",
  "cfb27","madden27","save","dynasty","roster","safety","set","file","copied","change","different","resolve"
]);
const tokens = (s:string) => s.toLowerCase().split(/[^a-z0-9+]+/).filter(x => x.length >= 3 && !STOP.has(x));

export function resolveCapabilities(input:string, universe:Universe="CFB27", limit=8): CapabilityMatch[] {
  const q = input.toLowerCase();
  const qt = new Set(tokens(q));
  const animationMechanic = /\b(pile|leap|airborne|root motion|dive|collision|impulse|launch|recovery)\b/.test(q);
  const explicitRatingIntent = /\b(rating|ratings|overall)\b/.test(q) || /\b(speed|acceleration|tackle|tackling|coverage|throw power|catching|strength|jumping)\b\s*(?:to|=|at)?\s*\d{2}\b/.test(q);

  const scored = CAPABILITY_REGISTRY.map(cap => {
    let score = 0;
    const reasons:string[] = [];
    for (const alias of cap.aliases) {
      const a = alias.toLowerCase();
      if (a.includes(" ") && q.includes(a)) { score += 7; reasons.push(`phrase:${alias}`); }
      else if (qt.has(a)) { score += 2; reasons.push(`token:${alias}`); }
    }
    for (const t of tokens(cap.title)) if (qt.has(t)) score += 1;
    if (/jersey|renumber|number/.test(q) && ["PLYR-JERSEY","JERSEY-POS-RULES","JERSEY-LEGALITY"].includes(cap.id)) score += 8;
    if (explicitRatingIntent && cap.id === "PLYR-RATINGS-51") score += 10;
    if (/\b(visor|facemask|mouthpiece|towel|wrist|wristband|gloves|cleats|backplate|equipment|gear)\b/.test(q) && cap.id === "PLYR-GEAR-46") score += 10;
    if (/team builder/.test(q) && cap.id.startsWith("TB-")) score += 9;
    if (animationMechanic && ["FTC-ANIM-TARGET","RUNTIME-INSTRUMENT","PLYR-ANIM-TRIPLE"].includes(cap.id)) score += 11;
    if (/recruit/.test(q) && ["FTC-RECRUIT-GEN","FTC-PROGRESSION","LIVE-RECRUIT-CONTACT","PIPELINE-MODEL"].includes(cap.id)) score += 5;
    if (/\b(progression|xp|skill points|skill costs|development|dev trait|cap breaker)\b/.test(q) && cap.id === "FTC-PROGRESSION") score += 8;
    const parity = universe === "MADDEN27" ? parityForSurface(cap.surface).state : "CONFIRMED_SHARED";
    return { capability:cap, score, parity, reasons };
  }).filter(m => m.score > 0).sort((a,b) => b.score - a.score || a.capability.id.localeCompare(b.capability.id));

  if (!scored.length) return [];
  const floor = Math.max(4, Math.ceil(scored[0].score * 0.30));
  const matches = scored.filter(m => m.score >= floor);
  const out:CapabilityMatch[] = [];
  const seen = new Set<string>();
  for (const m of matches) {
    if (!seen.has(m.capability.id)) { seen.add(m.capability.id); out.push(m); }
    if (out.length >= limit) break;
  }
  return out;
}
