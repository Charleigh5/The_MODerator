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
      <div className="flex items-center gap-4 px-4 py-2.5">
        {/* Block M plaque */}
        <div className="plaque flex items-center gap-3 px-3.5 py-1.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-md border-2 border-maize-400 bg-navy-950 font-display text-[26px] leading-none text-maize-400"
            style={{ textShadow: "0 0 12px rgba(255,203,5,0.5)" }}
          >
            M
          </span>
          <div className="leading-none">
            <div className="font-display text-[19px] tracking-[0.14em] text-maize-400">
              WOLVERINE FORGE
            </div>
            <div className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.28em] text-navy-400">
              The Big House · NCAA '27 MOD Lab
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
                className={`relative flex min-w-[142px] flex-col items-center rounded-md border-2 px-3 py-1 transition-all duration-500 ${
                  active
                    ? "sign-lit border-maize-400/80 bg-navy-800 text-maize-300"
                    : done
                      ? "border-navy-600 bg-navy-900 text-navy-400"
                      : "border-navy-700/70 bg-navy-950/70 text-[#4a637f]"
                }`}
              >
                <span className="font-display text-[13px] tracking-[0.14em]">{s.label}</span>
                <span className={`font-mono text-[8px] uppercase tracking-[0.18em] ${active ? "text-maize-400/70" : "opacity-70"}`}>
                  {done ? "✓ done" : s.sub}
                </span>
                {active && (
                  <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-maize-400 shadow-[0_0_10px_rgba(255,203,5,0.9)]" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="tape hidden rotate-[-1.5deg] px-2.5 py-1 font-type text-[10.5px] text-[#5c4a2a] md:block">
            KB: {kbCount} patterns scouted
          </div>
          
          {/* Mod Library Button */}
          <button
            onClick={onToggleLibrary}
            className="group relative flex items-center gap-2 rounded-md border-2 border-navy-600 bg-navy-900 px-3 py-1.5 transition-all hover:border-maize-400/60 hover:bg-navy-800"
            title="Mod Library"
          >
            <IconFolder className="h-4 w-4 text-maize-400" />
            <span className="font-display text-[11px] tracking-[0.12em] text-maize-400">
              LIBRARY
            </span>
            {modCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-maize-400 font-mono text-[9px] font-bold text-navy-950">
                {modCount}
              </span>
            )}
          </button>

          {/* Vault Browser Button */}
          <button
            onClick={onBrowseVault}
            className="group relative flex items-center gap-2 rounded-md border-2 border-maize-400/60 bg-navy-900 px-3 py-1.5 transition-all hover:border-maize-400 hover:bg-navy-800"
            title="Browse Vault Mods"
          >
            <IconFolder className="h-4 w-4 text-maize-400" />
            <span className="font-display text-[11px] tracking-[0.12em] text-maize-400">
              VAULT
            </span>
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-inkgreen font-mono text-[9px] font-bold text-navy-950">
              9
            </span>
          </button>
          
          {/* Save Mod Button */}
          <button
            onClick={onSaveMod}
            disabled={!canSave}
            className="group relative flex items-center gap-2 rounded-md border-2 border-maize-400 bg-navy-900 px-3 py-1.5 shadow-[0_0_12px_rgba(255,203,5,0.15)] transition-all hover:bg-navy-800 hover:shadow-[0_0_18px_rgba(255,203,5,0.25)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:border-navy-600 disabled:opacity-35"
            title="Save current mod to library"
          >
            <IconSave className="h-4 w-4 text-maize-400" />
            <span className="font-display text-[11px] tracking-[0.12em] text-maize-400">
              SAVE
            </span>
          </button>
          
          <button
            onClick={onNew}
            disabled={!canReset}
            className="relative rounded-md border-[3px] border-maize-400 bg-navy-900 px-4 py-1.5 shadow-[0_0_16px_rgba(255,203,5,0.18),3px_4px_0_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-[0_0_22px_rgba(255,203,5,0.3),4px_6px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="font-display text-[13px] tracking-[0.14em] text-maize-400">NEW BINDER</span>
            <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full border-2 border-maize-400 bg-navy-950" />
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
