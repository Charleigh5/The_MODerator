import { useState } from "react";
import type { PatternDef } from "../types";
import { MODS, PLATFORMS } from "../data/modLibrary";
import CodeView from "./CodeView";

const PIN = ["pin-red", "pin-brass", "pin-green"];

const KIND_INK: Record<PatternDef["kind"], string> = {
  Hook: "text-inkred border-inkred/50",
  Block: "text-inkgreen border-inkgreen/50",
  Schema: "text-inkblue border-inkblue/50",
  VarTable: "text-inkgold border-inkgold/50",
};

export default function SourcesPanel({
  kb,
  onPull,
}: {
  kb: PatternDef[];
  onPull: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const kbIds = new Set(kb.map((p) => p.id));

  return (
    <aside
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-[10px] border-wood-600 shadow-[0_18px_40px_rgba(0,0,0,0.5),inset_0_0_0_2px_rgba(0,0,0,0.35)] animate-rise"
      style={{ animationDelay: "60ms" }}
    >
      <div className="tex-cork flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* header plate */}
        <div className="shrink-0 px-3 pt-3">
          <div className="plaque flex items-center justify-between px-3 py-1.5">
            <span className="font-display text-[12px] tracking-[0.14em]">SCOUTING BOARD</span>
            <span className="font-body text-[9px] font-bold uppercase tracking-[0.2em] opacity-75">
              pattern vault
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {/* platforms on tape */}
          <div className="mb-1 flex items-center gap-2">
            <span className="typewrite text-[10px] uppercase tracking-[0.14em] text-[#4c3620]">
              Platforms on the wire
            </span>
            <span className="h-px flex-1 bg-[#7d5a37]/50" />
          </div>
          <div className="space-y-2">
            {PLATFORMS.map((p, i) => (
              <div
                key={p.id}
                className="tape card-tilt relative flex items-center justify-between px-3 py-1.5"
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1.2}deg)` }}
              >
                <span className="pin pin-brass absolute -top-1.5 left-2.5 scale-75" />
                <div>
                  <div className="text-[13px] font-bold leading-tight text-[#3a2c16]">{p.name}</div>
                  <div className="typewrite text-[9px] text-[#77603a]">{p.url}</div>
                </div>
                <div className="text-right">
                  <div className="typewrite text-[10px] leading-tight text-[#4c3a1e]">
                    {p.mods.toLocaleString()} mods
                  </div>
                  <div
                    className={`typewrite text-[9px] uppercase tracking-wider ${
                      p.status === "online" ? "text-inkgreen" : "text-inkgold"
                    }`}
                  >
                    {p.status === "online" ? "● online" : "◌ syncing"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* mod index cards */}
          <div className="mb-1 mt-4 flex items-center gap-2">
            <span className="typewrite text-[10px] uppercase tracking-[0.14em] text-[#4c3620]">
              Indexed mods · {MODS.length}
            </span>
            <span className="h-px flex-1 bg-[#7d5a37]/50" />
          </div>
          <div className="space-y-2.5 pb-2">
            {MODS.map((m, i) => {
              const isOpen = open === m.id;
              const pulled = m.patternIds.every((id) => kbIds.has(id));
              const rot = [-1.4, 1.1, -0.8, 1.5, -1.2, 0.9, -1.5, 1.3, -0.6][i % 9];
              return (
                <div
                  key={m.id}
                  className={`card-tilt relative rounded-[3px] border border-[#d8cfb6] bg-[#f8f3e2] shadow-[0_6px_12px_rgba(0,0,0,0.35)] ${isOpen ? "" : ""}`}
                  style={{ transform: `rotate(${rot}deg)` }}
                >
                  <span className={`pin ${PIN[i % 3]} absolute -top-2 left-1/2 -translate-x-1/2`} />
                  <div className="h-[3px] rounded-t-[3px] bg-inkred/70" />
                  <button
                    onClick={() => setOpen(isOpen ? null : m.id)}
                    className="block w-full px-3 pb-2 pt-1.5 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13.5px] font-bold leading-snug text-ink">{m.name}</span>
                      <span
                        className={`shrink-0 rounded-sm border px-1 py-px typewrite text-[9px] ${
                          m.reliability >= 95 ? "border-inkgreen/50 text-inkgreen" : "border-inkgold/60 text-inkgold"
                        }`}
                      >
                        {m.reliability}%
                      </span>
                    </div>
                    <div className="typewrite mt-0.5 text-[9.5px] text-[#77603a]">
                      {m.platform} · {m.version} · {m.blocks} blocks · {m.downloads} pulls
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-dashed border-[#c9bd9d] px-3 pb-2.5 pt-2 animate-rise">
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {m.tags.map((t) => (
                          <span
                            key={t}
                            className="tape px-1.5 py-px typewrite text-[8.5px] uppercase tracking-wider text-[#5c4a2a]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="overflow-hidden rounded-sm border border-[#d8cfb6] bg-paper">
                        <CodeView code={m.excerpt} lang="lua" dense />
                      </div>
                      <button
                        onClick={() => onPull(m.id)}
                        disabled={pulled}
                        className={`stamp-btn mt-2 w-full py-1.5 text-[11px] font-bold ${
                          pulled
                            ? "cursor-default border-inkgreen/60 text-inkgreen opacity-80"
                            : "text-inkred hover:bg-inkred/10"
                        }`}
                      >
                        {pulled ? "✓ LEARNED — IN THE PLAYBOOK" : `PULL ${m.patternIds.length} PATTERNS`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* coach's notes — mini chalkboard */}
        <div className="shrink-0 border-t-4 border-wood-600">
          <div className="tex-board px-3 py-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="chalk-text text-[15px] font-bold">coach's notes — knowledge base</span>
              <span className="chalk-text chalk-yellow text-[14px]">{kb.length} warm</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {kb.map((p) => (
                <span
                  key={p.id}
                  title={`scouted from ${p.source}`}
                  className={`cursor-default rounded-full border border-dashed px-2 py-px font-chalk text-[13px] leading-tight transition-transform hover:-translate-y-0.5 hover:border-solid ${KIND_INK[p.kind]}`}
                  style={{ color: "#f2eddc", borderColor: "rgba(242,237,220,0.45)" }}
                >
                  {p.kind.toLowerCase()} · {p.name.replace(/\(.*\)/, "").trim().toLowerCase()}
                </span>
              ))}
              {kb.length === 0 && (
                <span className="chalk-text text-[14px] opacity-60">nothing scouted yet — pin a mod above</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
