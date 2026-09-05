import type { BuildStatus, BundleMeta, ChatMsg, Phase, QAState } from "../types";

/* ------------------------------------------------ session binder ---------- */

export interface Session {
  id: string;
  num: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  phase: Phase;
  messages: ChatMsg[];
  qa: QAState | null;
  bundle: BundleMeta | null;
  buildStatus: BuildStatus;
}

export interface SessionSummary {
  id: string;
  num: number;
  name: string;
  updatedAt: number;
  phase: Phase;
  bundled: boolean;
}

/* ------------------------------------------------ coach's brain ----------- */

export interface BuiltRecord {
  slug: string;
  title: string;
  version: string;
  at: number;
}

export interface Memory {
  visits: number;
  kbIds: string[];
  built: BuiltRecord[];
  briefs: string[];
  prefs: string[];
}

const SKEY = "gridiron.sessions.v1";
const MKEY = "gridiron.memory.v1";

export const DEFAULT_MEMORY: Memory = {
  visits: 0,
  kbIds: [],
  built: [],
  briefs: [],
  prefs: [],
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

function readArr<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

/* memory --------------------------------------------------------------- */

export function loadMemory(): Memory {
  return read<Memory>(MKEY, DEFAULT_MEMORY);
}

export function saveMemory(m: Memory) {
  try {
    localStorage.setItem(MKEY, JSON.stringify(m));
  } catch {
    /* cabinet full — keep coaching */
  }
}

/* sessions ------------------------------------------------------------- */

export function loadSessions(): Session[] {
  return readArr<Session>(SKEY).sort((a, b) => b.updatedAt - a.updatedAt);
}

function allSessions(): Session[] {
  return readArr<Session>(SKEY);
}

export function upsertSession(s: Session) {
  const list = allSessions();
  const i = list.findIndex((x) => x.id === s.id);
  if (i >= 0) list[i] = s;
  else list.unshift(s);
  try {
    localStorage.setItem(SKEY, JSON.stringify(list));
  } catch {
    /* cabinet full */
  }
}

export function removeSession(id: string) {
  try {
    localStorage.setItem(SKEY, JSON.stringify(allSessions().filter((s) => s.id !== id)));
  } catch {
    /* noop */
  }
}

export function summarize(list: Session[]): SessionSummary[] {
  return [...list]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((s) => ({
      id: s.id,
      num: s.num,
      name: s.name,
      updatedAt: s.updatedAt,
      phase: s.phase,
      bundled: !!s.bundle,
    }));
}

/* helpers -------------------------------------------------------------- */

export function makeSession(num: number, name = "untitled huddle"): Session {
  const now = Date.now();
  return {
    id: `s${now.toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
    num,
    name,
    createdAt: now,
    updatedAt: now,
    phase: "idle",
    messages: [],
    qa: null,
    bundle: null,
    buildStatus: "unbuilt",
  };
}

export function binderLabel(num: number) {
  return `B-${String(num).padStart(2, "0")}`;
}

export function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  if (d < 45_000) return "just now";
  if (d < 3_600_000) return `${Math.max(1, Math.round(d / 60_000))}m ago`;
  if (d < 86_400_000) return `${Math.round(d / 3_600_000)}h ago`;
  return `${Math.round(d / 86_400_000)}d ago`;
}

export function slugifyName(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 34);
  return s || "untitled huddle";
}

export function nextNum(list: Session[]): number {
  return list.reduce((mx, s) => Math.max(mx, s.num), 0) + 1;
}

export function maxMsgId(list: Session[]): number {
  return list.reduce((mx, s) => {
    const m = s.messages.reduce((a, b) => Math.max(a, b.id), 0);
    return Math.max(mx, m);
  }, 0);
}
