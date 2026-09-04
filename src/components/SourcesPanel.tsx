import { useState } from "react";
import type { PatternDef } from "../types";
import { MODS, PLATFORMS } from "../data/modLibrary";
import CodeView from "./CodeView";
import { IconVault, IconRadar, IconChevron, IconDownload, IconCheck } from "./icons";

const KIND_COLOR: Record<PatternDef["kind"], string> = {
  Hook: "text-blaze-300 border-blaze-500/40 bg-blaze-500/10",
  Block: "text-turf-300 border-turf-500/40 bg-turf-900/50",
  Schema: "text-ice-300 border-ice-300/30 bg-ice-300/5",
  VarTable: "text-gold-300 border-gold-300/30 bg-gold-300/5",
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
    <aside className="panel flex h-full min-h-0 flex-col overflow-hidden animate-rise" style={{ animationDelay: "60ms" }}>
      <div className="panel-head flex items-center gap-2 px-3 py-2.5">
        <IconVault className="h-4 w-4 text-turf-400" />
        <h2 className="font-display text-[11px] font-bold tracking-[0.22em] text-chalk">
          PATTERN VAULT
        </h2>
        <span className="ml-auto flex items-center gap-1.5 rounded-sm border border-turf-500/40 bg-turf-900/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-turf-300">
          <span className="h-1.5 w-1.5 rounded-full bg-turf-400 led-green" />
          4 sources live
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* platforms */}
        <div className="border-b border-line/70 px-3 py-2.5">
          <div className="mb-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
            <IconRadar className="h-3.5 w-3.5 text-blaze-400" />
            reputable platforms on the wire
          </div>
          <ul className="space-y-1.5">
            {PLATFORMS.map((p) => (
              <li
                key={p.id}
                className="group flex items-center justify-between rounded-md border border-transparent px-2 py-1.5 transition-all hover:border-line hover:bg-pine-800/70"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "online" ? "bg-turf-400 led-green" : "bg-gold-300 led-amber"
                    }`}
                  />
                  <div>
                    <div className="text-[12px] font-semibold text-chalk group-hover:text-turf-200">
                      {p.name}
                    </div>
                    <div className="font-mono text-[9px] text-fog">{p.url}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[9.5px] leading-tight">
                  <div className="text-moss">{p.mods.toLocaleString()} mods</div>
                  <div className={p.status === "online" ? "text-turf-600" : "text-gold-300/80"}>
                    {p.status === "online" ? "OK" : "sync…"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* mods */}
        <div className="border-b border-line/70 px-3 py-2.5">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
            indexed mods · {MODS.length} curated
          </div>
          <ul className="space-y-1">
            {MODS.map((m) => {
              const isOpen = open === m.id;
              const pulled = m.patternIds.every((id) => kbIds.has(id));
              return (
                <li key={m.id} className="overflow-hidden rounded-md border border-line/70 bg-pine-850/60">
                  <button
                    onClick={() => setOpen(isOpen ? null : m.id)}
                    className="group flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-pine-800"
                  >
                    <IconChevron
                      className={`h-3 w-3 shrink-0 text-fog transition-transform duration-300 ${isOpen ? "rotate-90 text-turf-400" : ""}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold text-chalk group-hover:text-turf-200">
                        {m.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] text-fog">
                        <span className="text-moss">{m.platform}</span>
                        <span>·</span>
                        <span>{m.version}</span>
                        <span>·</span>
                        <span>{m.blocks} blk</span>
                        <span className={`ml-auto ${m.reliability >= 95 ? "text-turf-500" : "text-gold-300"}`}>
                          {m.reliability}%
                        </span>
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-line/70 bg-pine-950/50 px-2.5 py-2 animate-rise">
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {m.tags.map((t) => (
                          <span key={t} className="rounded-sm border border-line px-1.5 py-px font-mono text-[8.5px] uppercase tracking-wider text-moss">
                            {t}
                          </span>
                        ))}
                        <span className="ml-auto font-mono text-[8.5px] text-fog">{m.downloads} pulls</span>
                      </div>
                      <div className="rounded-md border border-line/80 bg-pine-900 p-1.5">
                        <CodeView code={m.excerpt} lang="lua" />
                      </div>
                      <button
                        onClick={() => onPull(m.id)}
                        disabled={pulled}
                        className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 font-display text-[10px] font-semibold tracking-[0.16em] transition-all ${
                          pulled
                            ? "cursor-default border-turf-500/40 bg-turf-900/40 text-turf-500"
                            : "border-blaze-500/50 bg-blaze-500/10 text-blaze-300 hover:border-blaze-400 hover:bg-blaze-500/20 active:scale-[0.98]"
                        }`}
                      >
                        {pulled ? (
                          <>
                            <IconCheck className="h-3.5 w-3.5" /> PATTERNS LEARNED
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
        <div className="px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
            knowledge base <span className="text-turf-400">{kb.length} warm</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {kb.map((p) => (
              <span
                key={p.id}
                title={`source: ${p.source}`}
                className={`cursor-default rounded-sm border px-1.5 py-0.5 font-mono text-[9px] transition-transform hover:-translate-y-0.5 ${KIND_COLOR[p.kind]}`}
              >
                {p.kind}·{p.name.replace(/\(.*\)/, "").trim()}
              </span>
            ))}
            {kb.length === 0 && (
              <span className="font-mono text-[10px] text-fog">cold start — pull a mod above</span>
            )}
          </div>
          <p className="mt-2.5 border-l-2 border-turf-600/50 pl-2 font-mono text-[9px] leading-relaxed text-fog">
            Every block the agent writes cites a pattern it learned here. Pull more mods → better weave.
          </p>
        </div>
      </div>
    </aside>
  );
}
