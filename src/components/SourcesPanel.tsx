import { useRef, useState } from "react";
import type { PatternDef } from "../types";
import type { Memory, SessionSummary } from "../lib/storage";
import { MODS, PLATFORMS } from "../data/modLibrary";
import { binderLabel, timeAgo } from "../lib/storage";
import CodeView from "./CodeView";
import {
  IconVault,
  IconRadar,
  IconChevron,
  IconDownload,
  IconCheck,
  IconFolder,
  IconPlus,
  IconX,
  IconBrain,
} from "./icons";

const KIND_COLOR: Record<PatternDef["kind"], string> = {
  Hook: "text-inkred border-inkred/40 bg-inkred/10",
  Block: "text-inkgreen border-inkgreen/40 bg-inkgreen/10",
  Schema: "text-inkblue border-inkblue/40 bg-inkblue/10",
  VarTable: "text-inkgold border-inkgold/40 bg-inkgold/10",
};

const PHASE: Record<SessionSummary["phase"], { bar: string; word: string; text: string }> = {
  idle: { bar: "bg-wood-400", word: "on the shelf", text: "text-[#a08a63]" },
  qa: { bar: "bg-chalkyellow", word: "grilling in progress", text: "text-chalkyellow" },
  generating: { bar: "bg-led", word: "compiling…", text: "text-led" },
  ready: { bar: "bg-[#7fb98a]", word: "bundle ready", text: "text-[#9fd0aa]" },
};

export default function SourcesPanel({
  kb,
  onPull,
  sessions,
  activeId,
  memory,
  onNew,
  onSwitch,
  onDelete,
}: {
  kb: PatternDef[];
  onPull: (id: string) => void;
  sessions: SessionSummary[];
  activeId: string | null;
  memory: Memory;
  onNew: () => void;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmTimer = useRef<number>(0);
  const kbIds = new Set(kb.map((p) => p.id));

  const askDelete = (id: string) => {
    if (confirmId === id) {
      window.clearTimeout(confirmTimer.current);
      setConfirmId(null);
      onDelete(id);
      return;
    }
    setConfirmId(id);
    window.clearTimeout(confirmTimer.current);
    confirmTimer.current = window.setTimeout(() => setConfirmId(null), 1800);
  };

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border-2 border-wood-600/70 shadow-[0_16px_36px_rgba(0,0,0,0.5)] animate-rise" style={{ animationDelay: "60ms" }}>
      {/* ============ binder shelf ============ */}
      <div className="tex-shelf shrink-0 border-b-2 border-wood-600/70 px-3 pb-2.5 pt-2.5">
        <div className="mb-2 flex items-center gap-2">
          <IconFolder className="h-4 w-4 text-brass-300" />
          <h2 className="font-display text-[11px] tracking-[0.22em] text-chalk">BINDER SHELF</h2>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-[#a08a63]">
            {sessions.length} saved
          </span>
        </div>

        <div className="max-h-[172px] space-y-1.5 overflow-y-auto pr-0.5">
          {sessions.map((s) => {
            const active = s.id === activeId;
            const ph = PHASE[s.phase];
            return (
              <div
                key={s.id}
                onClick={() => onSwitch(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSwitch(s.id)}
                className={`group relative flex w-full cursor-pointer items-stretch overflow-hidden rounded-md border text-left transition-all duration-200 ${
                  active
                    ? "translate-x-1.5 border-brass-400/80 bg-[#3d2c12] shadow-[0_5px_14px_rgba(0,0,0,0.45)]"
                    : "border-wood-600/50 bg-wood-850/80 hover:translate-x-1 hover:border-wood-500/70 hover:bg-wood-800"
                }`}
              >
                <span className={`w-[7px] shrink-0 ${ph.bar} ${s.phase === "generating" ? "animate-pulse" : ""}`} />
                <div className="min-w-0 flex-1 px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8.5px] font-semibold uppercase tracking-wider text-[#a08a63]">
                      {binderLabel(s.num)}
                    </span>
                    {s.bundled && (
                      <span className="rounded-sm border border-inkgreen/50 bg-inkgreen/15 px-1 font-mono text-[7.5px] uppercase tracking-wider text-[#9fd0aa]">
                        shipped
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[8.5px] text-[#7d6a4a]">{timeAgo(s.updatedAt)}</span>
                  </div>
                  <div className={`truncate text-[13px] font-bold ${active ? "text-brass-300" : "text-chalk"}`}>
                    {s.name}
                  </div>
                  <div className={`font-body text-[8.5px] font-semibold uppercase tracking-[0.16em] ${ph.text}`}>
                    {ph.word}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    askDelete(s.id);
                  }}
                  className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-sm transition-all ${
                    confirmId === s.id
                      ? "bg-inkred text-paper opacity-100"
                      : "text-[#7d6a4a] opacity-0 hover:bg-wood-700 hover:text-chalk group-hover:opacity-100"
                  }`}
                  title={confirmId === s.id ? "click again to shred" : "shred binder"}
                >
                  {confirmId === s.id ? (
                    <span className="font-mono text-[7px] font-bold tracking-tight">sure?</span>
                  ) : (
                    <IconX className="h-3 w-3" />
                  )}
                </button>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <div className="rounded-md border border-dashed border-wood-500/50 px-3 py-2.5 text-center font-body text-[11px] text-[#a08a63]">
              nothing on the shelf yet
            </div>
          )}
        </div>

        <button
          onClick={onNew}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-brass-400/50 py-1.5 font-display text-[10px] tracking-[0.2em] text-brass-300 transition-all hover:border-brass-300 hover:bg-brass-400/10 hover:text-brass-300 active:scale-[0.98]"
        >
          <IconPlus className="h-3.5 w-3.5" />
          NEW BINDER
        </button>
      </div>

      {/* ============ corkboard ============ */}
      <div className="tex-cork relative min-h-0 flex-1 overflow-y-auto">
        <div className="absolute inset-0 shadow-[inset_0_10px_24px_rgba(0,0,0,0.35),inset_0_-10px_24px_rgba(0,0,0,0.3)]" />

        {/* platforms */}
        <div className="relative border-b-2 border-dashed border-[#7d5a37]/60 px-3 py-2.5">
          <div className="mb-2 flex items-center gap-1.5 font-type text-[9.5px] uppercase tracking-[0.14em] text-[#4a3520]">
            <IconRadar className="h-3.5 w-3.5" />
            platforms on the wire
          </div>
          <ul className="space-y-1.5">
            {PLATFORMS.map((p) => (
              <li
                key={p.id}
                className="group flex items-center justify-between rounded-sm bg-[#f6efdd]/90 px-2.5 py-1.5 shadow-[2px_3px_6px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      p.status === "online" ? "bg-inkgreen shadow-[0_0_6px_rgba(63,125,78,0.9)]" : "bg-inkgold"
                    }`}
                  />
                  <div>
                    <div className="text-[12.5px] font-bold leading-tight text-ink">{p.name}</div>
                    <div className="font-mono text-[8.5px] text-[#8a7a5c]">{p.url}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[9px] leading-tight text-[#6b5a3e]">
                  <div className="font-bold text-inkblue">{p.mods.toLocaleString()}</div>
                  <div className={p.status === "online" ? "text-inkgreen" : "text-inkgold"}>
                    {p.status === "online" ? "live" : "sync…"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* mods */}
        <div className="relative border-b-2 border-dashed border-[#7d5a37]/60 px-3 py-2.5">
          <div className="mb-2 font-type text-[9.5px] uppercase tracking-[0.14em] text-[#4a3520]">
            indexed mods · {MODS.length} curated
          </div>
          <ul className="space-y-2">
            {MODS.map((m, i) => {
              const isOpen = open === m.id;
              const pulled = m.patternIds.every((id) => kbIds.has(id));
              const pin = i % 3 === 0 ? "pin-red" : i % 3 === 1 ? "pin-brass" : "pin-green";
              return (
                <li
                  key={m.id}
                  className={`card-tilt relative rounded-sm bg-[#f6efdd] shadow-[3px_5px_10px_rgba(0,0,0,0.4)] ${isOpen ? "" : ""}`}
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.8 : 0.9}deg)` }}
                >
                  <span className={`pin ${pin} absolute -top-1.5 left-1/2 z-10 -translate-x-1/2`} />
                  <button
                    onClick={() => setOpen(isOpen ? null : m.id)}
                    className="w-full px-3 pb-2 pt-2.5 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-extrabold leading-tight text-ink">
                          {m.name}
                        </div>
                        <div className="mt-0.5 font-mono text-[8.5px] text-[#8a7a5c]">
                          {m.platform} · {m.version} · {m.blocks} blocks
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-display text-[14px] ${m.reliability >= 95 ? "text-inkgreen" : "text-inkgold"}`}>
                          {m.reliability}%
                        </div>
                        <div className="font-mono text-[7.5px] uppercase tracking-wider text-[#8a7a5c]">trust</div>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {m.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-sm border border-[#c9b98f] bg-[#efe4c6] px-1 py-px font-mono text-[7.5px] uppercase tracking-wider text-[#6b5a3e]">
                          {t}
                        </span>
                      ))}
                      <IconChevron
                        className={`ml-auto h-3.5 w-3.5 text-[#8a7a5c] transition-transform duration-300 ${isOpen ? "rotate-90 text-inkred" : ""}`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t-2 border-dashed border-[#d8c89e] px-3 py-2 animate-rise">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[8.5px] text-[#6b5a3e]">
                        {m.tags.map((t) => (
                          <span key={t} className="rounded-sm bg-[#e7dab4] px-1 py-px uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                        <span className="ml-auto">{m.downloads} pulls</span>
                      </div>
                      <div className="rounded-sm border border-[#d8c89e] bg-[#fbf6e7] p-1.5">
                        <CodeView code={m.excerpt} lang="lua" />
                      </div>
                      <button
                        onClick={() => onPull(m.id)}
                        disabled={pulled}
                        className={`stamp-btn mt-2 flex w-full items-center justify-center gap-1.5 px-2 py-1.5 text-[10.5px] font-bold ${
                          pulled
                            ? "cursor-default border-inkgreen text-inkgreen"
                            : "border-inkred text-inkred hover:bg-inkred/10"
                        }`}
                        style={pulled ? { transform: "rotate(-1.5deg)" } : undefined}
                      >
                        {pulled ? (
                          <>
                            <IconCheck className="h-3.5 w-3.5" /> LEARNED
                          </>
                        ) : (
                          <>
                            <IconDownload className="h-3.5 w-3.5" /> PULL {m.patternIds.length} PATTERNS
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* knowledge base */}
        <div className="relative px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between font-type text-[9.5px] uppercase tracking-[0.14em] text-[#4a3520]">
            <span className="flex items-center gap-1.5">
              <IconVault className="h-3.5 w-3.5" /> knowledge base
            </span>
            <span className="rounded-sm bg-[#4a3520] px-1.5 py-px font-mono text-[9px] text-[#f6efdd]">
              {kb.length} warm
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {kb.map((p) => (
              <span
                key={p.id}
                title={`source: ${p.source}`}
                className={`cursor-default rounded-sm border bg-[#f6efdd]/95 px-1.5 py-0.5 font-mono text-[9px] shadow-[1px_2px_4px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-0.5 ${KIND_COLOR[p.kind]}`}
              >
                {p.kind}·{p.name.replace(/\(.*\)/, "").trim()}
              </span>
            ))}
            {kb.length === 0 && (
              <span className="font-type text-[10px] text-[#4a3520]">cold start — pull a card above</span>
            )}
          </div>

          {/* coach's memory memo */}
          <div className="tex-paper relative mt-3 rounded-sm p-2.5 shadow-[3px_5px_12px_rgba(0,0,0,0.45)]" style={{ transform: "rotate(-0.7deg)" }}>
            <span className="tape absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-[2deg] rounded-[1px]" />
            <div className="flex items-center gap-1.5 font-display text-[9.5px] tracking-[0.18em] text-inkred">
              <IconBrain className="h-3.5 w-3.5" /> COACH'S MEMORY
            </div>
            <div className="mt-0.5 font-type text-[8.5px] uppercase tracking-wider text-[#8a7a5c]">
              carries across every binder · visit #{memory.visits}
            </div>
            <ul className="mt-1.5 space-y-1">
              {memory.built.length > 0 && (
                <li className="typewrite text-[10px] leading-snug text-ink">
                  <span className="font-bold text-inkgreen">shipped:</span>{" "}
                  {memory.built.slice(-3).map((b) => `${b.slug} v${b.version}`).join(" · ")}
                </li>
              )}
              {memory.prefs.length > 0 && (
                <li className="typewrite text-[10px] leading-snug text-ink">
                  <span className="font-bold text-inkblue">notes:</span> coach tends to {memory.prefs.slice(0, 2).join("; ")}
                </li>
              )}
              <li className="typewrite text-[10px] leading-snug text-ink">
                <span className="font-bold text-inkred">brain:</span> {memory.kbIds.length} patterns ·{" "}
                {memory.briefs.length} briefs on record
              </li>
              {memory.built.length === 0 && memory.prefs.length === 0 && (
                <li className="typewrite text-[10px] italic leading-snug text-[#8a7a5c]">
                  nothing remembered yet — ship a mod and I'll start keeping notes.
                </li>
              )}
            </ul>
          </div>

          <p className="mt-2.5 border-l-2 border-[#4a3520]/60 pl-2 font-type text-[9px] leading-relaxed text-[#3d2b18]">
            Every block the agent writes cites a pattern it learned here. Save huddles on the shelf — the brain persists.
          </p>
        </div>
      </div>
    </aside>
  );
}
