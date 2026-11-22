import type { ModIntentSpec } from "../../lib/modIntentCompiler";

export type Message = {
  id: number;
  role: "user" | "studio";
  text: string;
  via?: string;
};

export type DesignLab = {
  title: string;
  prompt: string;
  detail: string;
};

export const DESIGN_LABS: DesignLab[] = [
  {
    title: "Player equipment",
    prompt: "Give my Madden 27 safety a dark smoke visor, white gloves and a custom wristband",
    detail: "Texture / asset inspection",
  },
  {
    title: "Uniform identity",
    prompt: "Madden 27: create an alternate uniform with dark blue helmets and silver details",
    detail: "Art and package compatibility",
  },
  {
    title: "Franchise ratings",
    prompt: "Set my Madden 27 franchise QB speed to 95 in a copied save",
    detail: "Requires verified schema",
  },
  {
    title: "Stadium atmosphere",
    prompt: "Madden 27: change the end zone design and stadium field graphics",
    detail: "Exact-build resources required",
  },
  {
    title: "Elite safety IQ",
    prompt: "Madden 27: a 95-rated safety should recognize coverage concepts and pursue better than a 72-rated safety without being superhuman",
    detail: "GrillMe • behavior vs ratings vs physics",
  },
];

export const GREETING: Message = {
  id: 1,
  role: "studio",
  via: "EVIDENCE COMPILER",
  text: "Welcome to Madden 27 Mod Studio. Describe what you want changed. I'll identify the modification surface, show what is actually supported, and prepare a governed plan. A plan is not an installed or tested mod.",
};

export function summarizeReadiness(spec: ModIntentSpec): string {
  if (spec.readiness === "BLOCKED") {
    return `Not ready to compile. ${spec.effects.find((e) => e.disposition === "BLOCKED")?.reason ?? "Game-specific evidence is insufficient."}`;
  }
  if (spec.readiness === "NEEDS_VERIFICATION") {
    const suffix = spec.missingInputs.length ? `Also required: ${spec.missingInputs.join("; ")}.` : "";
    return `The request maps to possible Madden 27 capabilities, but requires a controlled build or in-game experiment. ${suffix}`;
  }
  if (spec.readiness === "NEEDS_INPUT") {
    return `The request is understood. Required material: ${spec.missingInputs.join("; ")}.`;
  }
  return "An execution plan can be prepared. No mod has been compiled, loaded or tested in Madden 27.";
}
