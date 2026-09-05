import { useEffect, useRef, useState } from "react";
import type { TermLine } from "../types";

const KIND_CLS: Record<TermLine["kind"], string> = {
  in: "text-[#d9f5dd]",
  out: "text-crt-400",
  ok: "text-[#b6f29b]",
  err: "text-[#ff9b8a]",
  dim: "text-[#5f8a68]",
};

export default function Terminal({
  lines,
  onCommand,
  open,
  onToggle,
}: {
  lines: TermLine[];
  onCommand: (raw: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const [val, setVal] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const history = useRef<string[]>([]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const submit = () => {
    const raw = val.trim();
    if (!raw) return;
    history.current.push(raw);
    setHistIdx(-1);
    setVal("");
    onCommand(raw);
  };

  return (
    <section
      className={`overflow-hidden rounded-xl border border-black/60 bg-gradient-to-b from-[#3a372f] to-[#23211b] shadow-[0_16px_36px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 animate-rise ${open ? "h-[196px]" : "h-[40px]"}`}
      style={{ animationDelay: "240ms" }}
    >
      {/* bezel bar */}
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-2 text-left">
        <span className={`h-2 w-2 rounded-full ${open ? "bg-[#8ce39b] shadow-[0_0_8px_rgba(140,227,155,0.9)]" : "bg-[#5f8a68]"}`} />
        <span className="font-display text-[11px] tracking-[0.2em] text-[#cfcabb]">FILM ROOM · CLI</span>
        <span className="typewrite hidden text-[9.5px] text-[#8a8474] sm:block">
          the agent obeys the terminal — try `help`
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="typewrite text-[9px] uppercase tracking-[0.2em] text-[#8a8474]">CRT-01</span>
          <svg viewBox="0 0 10 10" className={`h-2.5 w-2.5 text-[#8a8474] transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 3.5 L5 6.5 L8 3.5" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="mx-2.5 mb-2.5 overflow-hidden rounded-lg border-[3px] border-[#171512] shadow-[inset_0_0_24px_rgba(0,0,0,0.7)]">
          <div className="tex-crt relative">
            <div ref={bodyRef} className="h-[104px] overflow-y-auto px-3.5 py-2 font-mono text-[11px] leading-[1.7]">
              {lines.map((l, i) => (
                <div key={i} className={`whitespace-pre-wrap ${KIND_CLS[l.kind]}`} style={{ textShadow: "0 0 6px rgba(140,227,155,0.28)" }}>
                  {l.kind === "in" ? <span className="text-[#f3d470]">❯ </span> : null}
                  {l.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-center gap-2 border-t border-[#1e3320] bg-[#0c160d] px-3.5 py-1.5"
            >
              <span className="font-mono text-[11px] text-[#f3d470]" style={{ textShadow: "0 0 6px rgba(243,212,112,0.4)" }}>
                ❯
              </span>
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const h = history.current;
                    if (h.length) {
                      const ni = histIdx < 0 ? h.length - 1 : Math.max(0, histIdx - 1);
                      setHistIdx(ni);
                      setVal(h[ni]);
                    }
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const h = history.current;
                    if (histIdx >= 0) {
                      const ni = histIdx + 1;
                      if (ni >= h.length) {
                        setHistIdx(-1);
                        setVal("");
                      } else {
                        setHistIdx(ni);
                        setVal(h[ni]);
                      }
                    }
                  }
                }}
                placeholder="help · sessions · new · pull m_cpu · brief “…” · build · test · export"
                className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[#d9f5dd] caret-[#f3d470] placeholder:text-[#4c6e53] focus:outline-none"
                spellCheck={false}
              />
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
