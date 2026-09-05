import type { Phase } from "../types";
import { TICKER_ITEMS } from "../data/modLibrary";
import { IconBall } from "./icons";

const STEPS: { label: string; sub: string; phase: Phase }[] = [
  { label: "1 · BRIEF", sub: "talk to the coach", phase: "idle" },
  { label: "2 · GRILL", sub: "Q&A on the board", phase: "qa" },
  { label: "3 · COMPILE", sub: "weaving patterns", phase: "generating" },
  { label: "4 · SHIP IT", sub: "test & export", phase: "ready" },
];

export default function TopBar({
  phase,
  kbCount,
  onNew,
  canReset,
}: {
  phase: Phase;
  kbCount: number;
  onNew: () => void;
  canReset: boolean;
}) {
  const activeIdx = STEPS.findIndex((s) => s.phase === phase);
  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <header className="relative z-20 shrink-0">
      <div className="flex items-center gap-4 px-4 py-2.5">
        {/* brass plaque */}
        <div className="plaque flex items-center gap-3 px-3.5 py-2">
          <IconBall className="h-6 w-6 text-[#3a2a10]" />
          <div className="leading-none">
            <div className="font-display text-[16px] tracking-[0.1em]">GRIDIRON FORGE</div>
            <div className="mt-1 font-body text-[9.5px] font-bold uppercase tracking-[0.3em] opacity-80">
              NCAA '27 · Coach's Office
            </div>
          </div>
        </div>

        {/* phase signs */}
        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {STEPS.map((s, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <div
                key={s.label}
                className={`relative flex min-w-[148px] flex-col items-center rounded-md border px-3 py-1.5 transition-all duration-500 ${
                  active
                    ? "sign-lit border-led/70 bg-[#3d2c12] text-led"
                    : done
                      ? "border-brass-400/40 bg-wood-800/80 text-brass-300"
                      : "border-wood-600/60 bg-wood-900/70 text-[#7a6a52]"
                }`}
              >
                <span className="font-display text-[11.5px] tracking-[0.12em]">{s.label}</span>
                <span
                  className={`font-body text-[9px] font-semibold uppercase tracking-[0.14em] ${
                    active ? "text-led/80" : done ? "text-brass-300/60" : "text-[#665844]"
                  }`}
                >
                  {done ? "✓ done" : s.sub}
                </span>
                {active && (
                  <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-led shadow-[0_0_10px_rgba(255,182,72,0.9)]" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="tape hidden rotate-[-1.5deg] px-2.5 py-1 font-type text-[10.5px] text-[#5c4a2a] md:block">
            KB: {kbCount} patterns scouted
          </div>
          <button
            onClick={onNew}
            disabled={!canReset}
            className="group relative rounded-md border-[3px] border-inkred bg-paper px-4 py-1.5 shadow-[3px_4px_0_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_6px_0_rgba(0,0,0,0.35)] active:translate-y-0.5 active:shadow-[1px_2px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="font-display text-[12px] tracking-[0.12em] text-inkred">
              NEW BINDER
            </span>
            <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full border border-inkred bg-paper" />
          </button>
        </div>
      </div>

      {/* stadium LED ribbon */}
      <div className="relative flex h-[26px] items-center overflow-hidden border-y border-black/60 bg-[#140d05] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
        <span className="z-10 ml-3 shrink-0 rounded-sm border border-led/50 bg-[#2a1c08] px-2 py-[2px] font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-led">
          ● wire
        </span>
        <div className="ticker-track flex whitespace-nowrap font-mono text-[10px] tracking-[0.1em]">
          {ticker.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="led-glow px-4">{t}</span>
              <span className="text-[#5c4318]">▮</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
