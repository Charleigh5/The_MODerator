import type { Phase } from "../types";
import { TICKER_ITEMS } from "../data/modLibrary";
import { IconBall, IconReset, IconChip } from "./icons";

const STEPS: { label: string; phase: Phase }[] = [
  { label: "BRIEF", phase: "idle" },
  { label: "INTERROGATE", phase: "qa" },
  { label: "COMPILE", phase: "generating" },
  { label: "SHIP", phase: "ready" },
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
    <header className="relative z-20 shrink-0 border-b border-line bg-pine-900/80 backdrop-blur-sm">
      <div className="flex h-[54px] items-center gap-4 px-3.5">
        {/* mark */}
        <div className="flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-lg border border-line-bright bg-pine-800 text-turf-400 shadow-[0_0_18px_rgba(43,213,116,0.15)]">
            <IconBall className="h-5.5 w-5.5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-turf-400 led-green" />
          </div>
          <div className="leading-none">
            <div className="font-display text-[15px] font-bold tracking-[0.14em] text-chalk">
              GRIDIRON<span className="text-turf-400">FORGE</span>
            </div>
            <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-fog">
              NCAA '27 · smart mod studio
            </div>
          </div>
        </div>

        {/* stepper */}
        <nav className="ml-2 hidden items-center md:flex">
          {STEPS.map((s, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <div key={s.label} className="flex items-center">
                <div
                  className={`flex items-center gap-2 border px-2.5 py-1.5 font-display text-[10px] font-semibold tracking-[0.18em] transition-colors duration-300 ${
                    active
                      ? "border-turf-500/60 bg-turf-900/60 text-turf-300"
                      : done
                        ? "border-line-bright text-turf-600"
                        : "border-line text-fog"
                  } ${i === 0 ? "rounded-l-md" : ""} ${i === STEPS.length - 1 ? "rounded-r-md" : ""}`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] ${
                      active
                        ? "border-turf-400 text-turf-300"
                        : done
                          ? "border-turf-600 bg-turf-900 text-turf-400"
                          : "border-fog/50"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <span className={`h-px w-3 ${i < activeIdx ? "bg-turf-600" : "bg-line"}`} />
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden items-center gap-1.5 rounded-md border border-line bg-pine-850 px-2.5 py-1.5 font-mono text-[10px] text-moss lg:flex">
            <IconChip className="h-3.5 w-3.5 text-blaze-400" />
            KB <span className="font-semibold text-chalk">{kbCount}</span> patterns
          </div>
          <div className="hidden rounded-md border border-line bg-pine-850 px-2.5 py-1.5 font-mono text-[10px] text-moss sm:block">
            agent <span className="text-turf-400">online</span> · v0.9.4
          </div>
          <button
            onClick={onNew}
            disabled={!canReset}
            className="group flex items-center gap-1.5 rounded-md border border-blaze-500/50 bg-blaze-500/10 px-3 py-1.5 font-display text-[10.5px] font-semibold tracking-[0.14em] text-blaze-300 transition-all hover:border-blaze-400 hover:bg-blaze-500/20 hover:text-blaze-300 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconReset className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            NEW MOD
          </button>
        </div>
      </div>

      {/* wire ticker */}
      <div className="relative flex h-6 items-center overflow-hidden border-t border-line/70 bg-pine-950/70">
        <span className="z-10 ml-3 shrink-0 rounded-sm bg-turf-900/80 px-1.5 py-[1px] font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-turf-300">
          wire
        </span>
        <div className="ticker-track flex whitespace-nowrap font-mono text-[9.5px] tracking-[0.08em] text-fog">
          {ticker.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="px-4 hover:text-moss">{t}</span>
              <span className="text-turf-600">///</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
