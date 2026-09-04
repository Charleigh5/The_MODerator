import { useEffect, useRef, useState } from "react";
import type { ChatMsg, Phase, QAState } from "../types";
import { CATEGORIES } from "../lib/agentEngine";
import { IconBolt, IconSend, IconBall } from "./icons";

const QUICK_BRIEFS = [
  "Stop CPU coaches from poaching my commits and make recruiting feel real",
  "Dynamic weather that actually bends deep passes",
  "Night games should be brutal for visiting teams",
  "Make the CPU dangerous in the 4th quarter and kill rubber-banding",
];

export default function AgentChat({
  messages,
  phase,
  qa,
  onSend,
  onChip,
}: {
  messages: ChatMsg[];
  phase: Phase;
  qa: QAState | null;
  onSend: (text: string) => void;
  onChip: (chip: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  const cat = qa ? CATEGORIES.find((c) => c.id === qa.category) : null;
  const question = cat && qa ? cat.questions[qa.index] : null;
  const inputPlaceholder =
    phase === "idle"
      ? "Tell CODEWRIGHT what the game should do differently…"
      : phase === "qa" && question
        ? `Answer ${question.label.toLowerCase()} — or tap a quick call`
        : phase === "generating"
          ? "Agent is compiling…"
          : "Bundle ready — ask for tweaks, or start a NEW MOD";

  const busy = phase === "generating";

  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden animate-rise" style={{ animationDelay: "120ms" }}>
      {/* head */}
      <div className="panel-head flex items-center gap-2.5 px-3.5 py-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-md border border-turf-500/50 bg-turf-900/70 text-turf-300">
          <IconBolt className="h-4 w-4" />
        </div>
        <div className="leading-none">
          <div className="font-display text-[11px] font-bold tracking-[0.22em] text-chalk">
            AGENT // CODEWRIGHT
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-fog">
            {phase === "idle" && "waiting on your brief"}
            {phase === "qa" && `interrogation · ${cat?.label ?? ""}`}
            {phase === "generating" && "weaving blocks · do not unplug"}
            {phase === "ready" && "bundle hot · standing by"}
          </div>
        </div>
        <span
          className={`ml-auto flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-widest ${
            busy
              ? "border-gold-300/40 bg-gold-300/10 text-gold-300"
              : "border-turf-500/40 bg-turf-900/60 text-turf-300"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${busy ? "bg-gold-300 led-amber" : "bg-turf-400 led-green"}`} />
          {busy ? "compiling" : "online"}
        </span>
      </div>

      {/* stream */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
        {messages.map((m) =>
          m.role === "sys" ? (
            <div key={m.id} className="flex justify-center animate-rise">
              <span className="rounded-md border border-line/70 bg-pine-950/70 px-2.5 py-1 font-mono text-[9.5px] tracking-wide text-moss">
                {m.tag ? <span className="text-blaze-400">[{m.tag}]</span> : null} {m.text}
              </span>
            </div>
          ) : m.role === "user" ? (
            <div key={m.id} className="flex justify-end animate-rise">
              <div className="max-w-[85%] rounded-lg rounded-tr-sm border border-turf-500/35 bg-turf-900/45 px-3 py-2">
                <div className="mb-0.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-turf-600">you · coach</div>
                <p className="text-[12.5px] leading-relaxed text-turf-200">{m.text}</p>
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2.5 animate-rise">
              <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line-bright bg-pine-800 text-turf-400">
                <IconBall className="h-4 w-4" />
              </div>
              <div className="max-w-[88%] rounded-lg rounded-tl-sm border border-line bg-pine-800/80 px-3 py-2">
                <div className="mb-0.5 flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.2em] text-fog">
                  codewright
                  {m.tag && <span className="rounded-sm border border-blaze-500/40 px-1 text-[8px] text-blaze-300">{m.tag}</span>}
                </div>
                <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-[#d7e8dc]">{m.text}</p>
              </div>
            </div>
          )
        )}

        {busy && (
          <div className="flex gap-2.5 animate-rise">
            <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line-bright bg-pine-800 text-turf-400">
              <IconBall className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-lg rounded-tl-sm border border-line bg-pine-800/80 px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-turf-400" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          </div>
        )}

        {phase === "idle" && messages.length <= 2 && (
          <div className="animate-rise pt-1">
            <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
              sample briefs — steal one
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {QUICK_BRIEFS.map((b) => (
                <button
                  key={b}
                  onClick={() => onSend(b)}
                  className="group rounded-md border border-line bg-pine-850/70 px-3 py-2 text-left text-[11.5px] text-moss transition-all hover:-translate-y-0.5 hover:border-turf-500/50 hover:bg-turf-900/40 hover:text-turf-200"
                >
                  <span className="mr-1.5 text-turf-500 transition-transform group-hover:translate-x-0.5">▸</span>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* quick calls */}
      {phase === "qa" && question && (
        <div className="border-t border-line/70 bg-pine-950/50 px-3.5 py-2.5 animate-rise">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
            quick calls <span className="text-blaze-400">{question.label}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {question.chips.map((c) => (
              <button
                key={c}
                onClick={() => onChip(c)}
                className="rounded-md border border-blaze-500/40 bg-blaze-500/8 px-2.5 py-1.5 font-mono text-[10.5px] text-blaze-300 transition-all hover:-translate-y-0.5 hover:border-blaze-400 hover:bg-blaze-500/20 active:translate-y-0 active:scale-[0.97]"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = draft.trim();
          if (!t || busy) return;
          setDraft("");
          onSend(t);
        }}
        className="flex items-center gap-2 border-t border-line bg-pine-900/70 px-3.5 py-2.5"
      >
        <span className="font-mono text-[12px] text-turf-500">❯</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={inputPlaceholder}
          disabled={busy}
          className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-chalk placeholder:text-fog/80 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="flex items-center gap-1.5 rounded-md border border-turf-500/50 bg-turf-900/60 px-3 py-1.5 font-display text-[10px] font-semibold tracking-[0.16em] text-turf-300 transition-all hover:border-turf-400 hover:bg-turf-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <IconSend className="h-3.5 w-3.5" />
          {phase === "idle" ? "BRIEF" : "SEND"}
        </button>
      </form>
    </section>
  );
}
