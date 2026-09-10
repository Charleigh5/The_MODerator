import type { Phase } from "../types";
import { TICKER_ITEMS } from "../data/modLibrary";
import { IconFolder, IconSave } from "./icons";

const STEPS: { label: string; sub: string; phase: Phase }[] = [
  { label: "1 · BRIEF", sub: "talk to the coach", phase: "idle" },
  { label: "2 · GRILL", sub: "stretch + Q&A", phase: "qa" },
  { label: "3 · COMPILE", sub: "weaving patterns", phase: "generating" },
  { label: "4 · SHIP IT", sub: "test & export", phase: "ready" },
];

export default function TopBar({
  phase,
  kbCount,
  onNew,
  canReset,
  modCount,
  onToggleLibrary,
  onBrowseVault,
  onSaveMod,
  canSave,
}: {
  phase: Phase;
  kbCount: number;
  onNew: () => void;
  canReset: boolean;
  modCount: number;
  onToggleLibrary: () => void;
  onBrowseVault: () => void;
  onSaveMod: () => void;
  canSave: boolean;
}) {
  const activeIdx = STEPS.findIndex((s) => s.phase === phase);
  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <header className="relative z-20 shrink-0">
      <div className="flex items-center gap-3 px-3 py-2">
        {/* Block M plaque - compact */}
        <div className="plaque flex items-center gap-2 px-2.5 py-1">
          <span
            className="grid h-8 w-8 place-items-center rounded-md border-2 border-maize-400 bg-navy-950 font-display text-[22px] leading-none text-maize-400"
            style={{ textShadow: "0 0 12px rgba(255,203,5,0.5)" }}
          >
            M
          </span>
          <div className="hidden leading-none sm:block">
            <div className="font-display text-[15px] tracking-[0.12em] text-maize-400">
              WOLVERINE FORGE
            </div>
            <div className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.24em] text-navy-400">
              NCAA '27 MOD Lab
            </div>
          </div>
        </div>

        {/* phase signs - responsive */}
        <nav className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
          {STEPS.map((s, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <div
                key={s.label}
                className={`relative flex min-w-[110px] flex-col items-center rounded-md border-2 px-2 py-0.5 transition-all duration-500 ${
                  active
                    ? "sign-lit border-maize-400/80 bg-navy-800 text-maize-300"
                    : done
                      ? "border-navy-600 bg-navy-900 text-navy-400"
                      : "border-navy-700/70 bg-navy-950/70 text-[#4a637f]"
                }`}
              >
                <span className="font-display text-[11px] tracking-[0.12em]">{s.label}</span>
                <span className={`hidden font-mono text-[7px] uppercase tracking-[0.16em] md:block ${active ? "text-maize-400/70" : "opacity-70"}`}>
                  {done ? "✓ done" : s.sub}
                </span>
                {active && (
                  <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-maize-400 shadow-[0_0_8px_rgba(255,203,5,0.9)]" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* KB indicator - icon only on mobile */}
          <div className="tape hidden rotate-[-1.5deg] px-2 py-0.5 font-type text-[9px] text-[#5c4a2a] md:block">
            KB: {kbCount}
          </div>
          
          {/* Mod Library Button - compact */}
          <button
            onClick={onToggleLibrary}
            className="group relative flex items-center gap-1.5 rounded-md border-2 border-navy-600 bg-navy-900 px-2 py-1 transition-all hover:border-maize-400/60 hover:bg-navy-800"
            title="Mod Library"
          >
            <IconFolder className="h-3.5 w-3.5 text-maize-400" />
            <span className="hidden font-display text-[10px] tracking-[0.1em] text-maize-400 sm:inline">
              LIBRARY
            </span>
            {modCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-maize-400 font-mono text-[8px] font-bold text-navy-950">
                {modCount}
              </span>
            )}
          </button>

          {/* Vault Browser Button - compact */}
          <button
            onClick={onBrowseVault}
            className="group relative flex items-center gap-1.5 rounded-md border-2 border-maize-400/60 bg-navy-900 px-2 py-1 transition-all hover:border-maize-400 hover:bg-navy-800"
            title="Browse Vault Mods"
          >
            <IconFolder className="h-3.5 w-3.5 text-maize-400" />
            <span className="hidden font-display text-[10px] tracking-[0.1em] text-maize-400 sm:inline">
              VAULT
            </span>
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-inkgreen font-mono text-[8px] font-bold text-navy-950">
              9
            </span>
          </button>
          
          {/* Save Mod Button - compact */}
          <button
            onClick={onSaveMod}
            disabled={!canSave}
            className="group relative flex items-center gap-1.5 rounded-md border-2 border-maize-400 bg-navy-900 px-2 py-1 shadow-[0_0_10px_rgba(255,203,5,0.12)] transition-all hover:bg-navy-800 hover:shadow-[0_0_14px_rgba(255,203,5,0.2)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-navy-600 disabled:opacity-35"
            title="Save current mod to library"
          >
            <IconSave className="h-3.5 w-3.5 text-maize-400" />
            <span className="hidden font-display text-[10px] tracking-[0.1em] text-maize-400 sm:inline">
              SAVE
            </span>
          </button>
          
          {/* New Binder Button - compact */}
          <button
            onClick={onNew}
            disabled={!canReset}
            className="relative rounded-md border-[2.5px] border-maize-400 bg-navy-900 px-2.5 py-1 shadow-[0_0_12px_rgba(255,203,5,0.15),2px_3px_0_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-[0_0_16px_rgba(255,203,5,0.25),3px_4px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="font-display text-[11px] tracking-[0.12em] text-maize-400">NEW</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-maize-400 bg-navy-950" />
          </button>
        </div>
      </div>

      {/* stadium LED ribbon */}
      <div className="relative flex h-[26px] items-center overflow-hidden border-y-2 border-maize-400/40 bg-navy-950 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
        <span className="z-10 ml-3 shrink-0 rounded-sm border border-maize-400/60 bg-navy-900 px-2 py-[2px] font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-maize-300">
          ● wire
        </span>
        <div className="ticker-track flex whitespace-nowrap font-mono text-[10px] tracking-[0.1em]">
          {ticker.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="led-glow px-4">{t}</span>
              <span className="text-navy-600">▮</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
