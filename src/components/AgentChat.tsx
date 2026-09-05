import { useEffect, useRef, useState } from "react";
import type { ChatMsg, Phase, QAState } from "../types";
import { CATEGORIES } from "../lib/agentEngine";

function ChalkDoodle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 150 110" className={className} fill="none" stroke="#f2eddc" strokeWidth="2.2" strokeLinecap="round" opacity="0.28">
      <circle cx="26" cy="26" r="13" pathLength={300} className="chalk-draw" />
      <circle cx="70" cy="20" r="13" pathLength={300} className="chalk-draw" style={{ animationDelay: "0.5s" }} />
      <path d="M104 14 l24 24 M128 14 l-24 24" pathLength={300} className="chalk-draw" style={{ animationDelay: "1s" }} />
      <path d="M26 44 C 30 70, 55 82, 92 84" pathLength={300} className="chalk-draw" style={{ animationDelay: "1.4s" }} />
      <path d="M84 76 l10 8 l-12 4" pathLength={300} className="chalk-draw" style={{ animationDelay: "2s" }} />
      <path d="M112 60 q 14 10 8 30" strokeDasharray="5 7" opacity="0.8" />
    </svg>
  );
}

function Msg({ m }: { m: ChatMsg }) {
  if (m.role === "sys") {
    return (
      <div className="typewrite pl-1 text-[11px] leading-relaxed text-chalk/55 animate-rise">
        <span className="text-chalkyellow/70">» </span>
        {m.text}
      </div>
    );
  }
  if (m.role === "user") {
    return (
      <div className="animate-rise pl-4">
        <span className="chalk-text chalk-yellow text-[19px] font-semibold leading-snug" style={{ borderLeft: "3px solid rgba(243,212,112,0.5)", paddingLeft: "10px" }}>
          {m.text}
        </span>
      </div>
    );
  }
  return (
    <div className="animate-rise">
      {m.tag && m.tag !== "compiler" && (
        <div className="chalk-text mb-0.5 text-[13px] uppercase tracking-[0.18em] opacity-70">
          {m.tag === "scout" ? "✱ scout report" : m.tag === "locked" ? "✱ play locked in" : `✱ ${m.tag}`}
        </div>
      )}
      <p className="chalk-text whitespace-pre-wrap text-[19px] font-bold leading-[1.35]">{m.text}</p>
    </div>
  );
}

export default function AgentChat({
  messages,
  phase,
  qa,
  onSend,
  onAnswer,
  busy,
}: {
  messages: ChatMsg[];
  phase: Phase;
  qa: QAState | null;
  onSend: (t: string) => void;
  onAnswer: (t: string) => void;
  busy: boolean;
}) {
  const [val, setVal] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const qaPhase = phase === "qa" && qa;
  const q = qaPhase ? CATEGORIES.find((c) => c.id === qa.category) : null;

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy, phase]);

  const status =
    phase === "idle"
      ? "waiting on a play call"
      : phase === "qa" && qa && q
        ? `Q&A · question ${Math.min(qa.index + 1, q.questions.length)} of ${q.questions.length}`
        : phase === "generating"
          ? "compiling the bundle…"
          : "bundle ready — ship it";

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-[12px] border-wood-600 shadow-[0_18px_40px_rgba(0,0,0,0.55),inset_0_0_0_3px_#3a2818] animate-rise"
      style={{ animationDelay: "120ms" }}
    >
      <div className="tex-board relative flex h-full min-h-0 flex-col">
        <ChalkDoodle className="pointer-events-none absolute left-1/2 top-0 h-20 w-28 -translate-x-1/2" />

        {/* board header */}
        <div className="relative shrink-0 px-5 pb-2 pt-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="chalk-text font-display text-[15px] tracking-[0.16em] text-chalk">
                CODEWRIGHT'S CHALKBOARD
              </h2>
              <svg viewBox="0 0 220 10" className="mt-1 h-2.5 w-52" fill="none" stroke="#f2eddc" strokeWidth="2" strokeLinecap="round" opacity="0.5">
                <path d="M3 6 C 40 2, 90 9, 130 5 S 200 3, 217 6" pathLength={300} className="chalk-draw" />
              </svg>
            </div>
            <div className="chalk-text chalk-yellow shrink-0 pb-1 text-right text-[16px] font-semibold leading-tight">
              {status}
              {phase === "qa" && qa && q && (
                <span className="ml-2 inline-block rounded-full border border-dashed border-chalkyellow/60 px-2 text-[14px]">
                  {q.label.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* messages */}
        <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-3 pt-1">
          {messages.map((m) => (
            <Msg key={m.id} m={m} />
          ))}
          {busy && (
            <div className="flex items-center gap-1.5 pl-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot inline-block h-2 w-2 rounded-full bg-chalk/80"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
              <span className="chalk-text ml-1 text-[15px] opacity-60">coach is thinking…</span>
            </div>
          )}
        </div>

        {/* quick-call chips */}
        {qaPhase && q && qa.index < q.questions.length && !busy && (
          <div className="shrink-0 px-5 pb-3">
            <div className="chalk-text mb-1.5 text-[13px] uppercase tracking-[0.18em] opacity-60">
              quick call, or write your own ↓
            </div>
            <div className="flex flex-wrap gap-2">
              {q.questions[qa.index].chips.map((c) => (
                <button
                  key={c}
                  onClick={() => onAnswer(c)}
                  className="chalk-pill px-3.5 py-1 text-[16px] font-semibold"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* chalk tray input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = val.trim();
            if (!t || busy) return;
            setVal("");
            qaPhase ? onAnswer(t) : onSend(t);
          }}
          className="relative shrink-0 border-t-[6px] border-wood-700 bg-gradient-to-b from-wood-600 to-wood-700 px-5 py-3 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)]"
        >
          {/* chalk sticks */}
          <span className="absolute right-16 top-2 hidden h-[7px] w-11 rotate-[8deg] rounded-full bg-chalk shadow-[0_2px_3px_rgba(0,0,0,0.45)] lg:block" />
          <span className="absolute right-5 top-3.5 hidden h-[7px] w-9 -rotate-[5deg] rounded-full bg-chalkyellow shadow-[0_2px_3px_rgba(0,0,0,0.45)] lg:block" />
          <div className="flex items-center gap-3">
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              disabled={busy}
              placeholder={
                qaPhase
                  ? "answer the coach…"
                  : "draw it up in plain English — “stop CPU poaching my commits”…"
              }
              className="chalk-text min-w-0 flex-1 border-b-2 border-dashed border-chalk/45 bg-transparent pb-1 text-[19px] font-semibold placeholder:text-chalk/35 focus:border-solid focus:border-chalkyellow/80 focus:outline-none disabled:opacity-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy || !val.trim()}
              className="shrink-0 rounded-md border-2 border-chalk/70 bg-chalk/10 px-4 py-1.5 font-display text-[11px] tracking-[0.14em] text-chalk transition-all hover:bg-chalk/20 hover:shadow-[0_0_14px_rgba(242,237,220,0.25)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {qaPhase ? "ANSWER" : "WRITE IT"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
