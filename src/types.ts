export type Phase = "idle" | "qa" | "generating" | "ready";

export type CategoryId =
  | "recruiting"
  | "playbook"
  | "weather"
  | "atmosphere"
  | "difficulty"
  | "rules";

export interface ChatMsg {
  id: number;
  role: "agent" | "user" | "sys";
  text: string;
  tag?: string;
}

export interface QAState {
  category: CategoryId;
  index: number;
  answers: Record<string, string>;
  brief: string;
  expansions: string[];
  expLocked: boolean;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  mods: number;
  status: "online" | "syncing";
  heartbeat: number; // ms since last ping
  latency: number; // ms
}

export interface PatternDef {
  id: string;
  name: string;
  kind: "Hook" | "Block" | "Schema" | "VarTable";
  source: string;
}

export interface ModReview {
  user: string;
  rating: number; // 1-5
  text: string;
  date: string;
  helpful: number;
}

export interface ModEntry {
  id: string;
  name: string;
  short: string;
  platform: string;
  version: string;
  schema: string;
  blocks: number;
  reliability: number;
  downloads: string;
  tags: string[];
  excerpt: string;
  patternIds: string[];
  description: string;
  rating: number; // 1-5
  reviewCount: number;
  reviews: ModReview[];
  pros: string[];
  cons: string[];
  warnings: string[];
  files: { name: string; purpose: string; size: string }[];
  variables: { name: string; type: string; purpose: string }[];
  logic: string[];
  testPlan: string[];
}

export interface GenFile {
  path: string;
  lang: "json" | "lua" | "xml";
  content: string;
  bytes: number;
}

export interface BundleMeta {
  title: string;
  slug: string;
  id: string;
  version: string;
  hash: string;
  category: CategoryId;
  blocksLinked: number;
  kbUsed: PatternDef[];
  files: GenFile[];
}

export type BuildStatus = "unbuilt" | "building" | "built";

export interface TermLine {
  kind: "in" | "out" | "ok" | "err" | "dim";
  text: string;
}

export interface QAQuestion {
  key: string;
  label: string;
  ask: string;
  chips: string[];
}
