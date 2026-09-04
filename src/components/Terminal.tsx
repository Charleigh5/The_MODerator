import { useEffect, useRef, useState } from "react";
import type { TermLine } from "../types";
import { IconTerminal, IconChevron } from "./icons";

const KIND_CLS: Record<TermLine["kind"], string> = {
  in: "text-chalk",
  out: "text-moss",
  ok: "text-turf-400",
  err: "text-blood-400",
  dim: "text-fog",
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
  const inputRef = useRef<HTMLInputElement>(null);
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
      className={`panel flex shrink-0 flex-col overflow-hidden transition-all duration-300 animate-rise ${open ? "h-[190px]" : "h-[36px]"}`}
      style={{ animationDelay: "200ms" }}
    >
      <button
        onClick={onToggle}
        className="panel-head flex w-full items-center gap-2.5 px-3.5 py-2 text-left"
      >
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blood-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-turf-400/80" />
        </span>
        <IconTerminal className="h-4 w-4 text-turf-400" />
        <span className="font-display text-[10.5px] font-bold tracking-[0.22em] text-chalk">
          CLI — GRIDIRON-FORGE
        </span>
        <span className="ml-1 hidden font-mono text-[9px] uppercase tracking-widest text-fog sm:block">
          type `help` · the agent obeys the terminal too
        </span>
        <IconChevron
          className={`ml-auto h-3.5 w-3.5 text-fog transition-transform duration-300 ${open ? "rotate-90" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <>
          <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-3.5 py-2 font-mono text-[11px] leading-[1.7]">
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap ${KIND_CLS[l.kind]}`}>
                {l.kind === "in" ? <span className="text-turf-500">❯ </span> : null}
                {l.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 border-t border-line bg-pine-950/70 px-3.5 py-2"
          >
            <span className="font-mono text-[11px] text-turf-500">❯</span>
            <input
              ref={inputRef}
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
              placeholder="help · sources · mods · pull m_cpu · brief “…” · build · test · export"
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-chalk caret-turf-400 placeholder:text-fog/70 focus:outline-none"
              spellCheck={false}
            />
          </form>
        </>
      )}
    </section>
  );
}
