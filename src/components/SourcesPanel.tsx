import { useState } from "react";
import type { PatternDef } from "../types";
import { MODS, PLATFORMS } from "../data/modLibrary";
import CodeView from "./CodeView";
import { IconVault, IconRadar, IconChevron, IconDownload, IconCheck, IconStar, IconAlert, IconFile, IconCode, IconTest } from "./icons";

const KIND_COLOR: Record<PatternDef["kind"], string> = {
  Hook: "text-blaze-300 border-blaze-500/40 bg-blaze-500/10",
  Block: "text-turf-300 border-turf-500/40 bg-turf-900/50",
  Schema: "text-ice-300 border-ice-300/30 bg-ice-300/5",
  VarTable: "text-gold-300 border-gold-300/30 bg-gold-300/5",
};

type ViewMode = "list" | "detail";

export default function SourcesPanel({
  kb,
  onPull,
}: {
  kb: PatternDef[];
  onPull: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const kbIds = new Set(kb.map((p) => p.id));

  const selectedMod = open ? MODS.find((m) => m.id === open) : null;

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
            live platform connections
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
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={p.status === "online" ? "text-turf-600" : "text-gold-300/80"}>
                      {p.status === "online" ? "OK" : "sync…"}
                    </span>
                    <span className="text-fog/60">{p.latency}ms</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* mods */}
        <div className="border-b border-line/70 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
            <span>indexed mods · {MODS.length} curated</span>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-sm px-1.5 py-0.5 text-[8px] uppercase tracking-wider transition-colors ${
                  viewMode === "list" ? "bg-turf-900/60 text-turf-300" : "text-fog hover:text-moss"
                }`}
              >
                list
              </button>
              <button
                onClick={() => setViewMode("detail")}
                className={`rounded-sm px-1.5 py-0.5 text-[8px] uppercase tracking-wider transition-colors ${
                  viewMode === "detail" ? "bg-turf-900/60 text-turf-300" : "text-fog hover:text-moss"
                }`}
              >
                detail
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
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
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[12px] font-semibold text-chalk group-hover:text-turf-200">
                            {m.name}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-gold-300">
                            <IconStar className="h-2.5 w-2.5 fill-current" />
                            {m.rating}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] text-fog">
                          <span className="text-moss">{m.platform}</span>
                          <span>·</span>
                          <span>{m.version}</span>
                          <span>·</span>
                          <span>{m.reviewCount} reviews</span>
                          <span className={`ml-auto ${m.reliability >= 95 ? "text-turf-500" : "text-gold-300"}`}>
                            {m.reliability}%
                          </span>
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-line/70 bg-pine-950/50 px-2.5 py-2 animate-rise">
                        {/* description */}
                        <div className="mb-2 text-[11px] leading-relaxed text-moss">{m.description}</div>

                        {/* tags */}
                        <div className="mb-2 flex flex-wrap gap-1">
                          {m.tags.map((t) => (
                            <span key={t} className="rounded-sm border border-line px-1.5 py-px font-mono text-[8.5px] uppercase tracking-wider text-moss">
                              {t}
                            </span>
                          ))}
                          <span className="ml-auto font-mono text-[8.5px] text-fog">{m.downloads} pulls</span>
                        </div>

                        {/* rating breakdown */}
                        <div className="mb-2 rounded-md border border-line/80 bg-pine-900 p-2">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-fog">user reviews</span>
                            <span className="flex items-center gap-0.5 text-[10px] text-gold-300">
                              <IconStar className="h-3 w-3 fill-current" />
                              {m.rating}/5 · {m.reviewCount} reviews
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {m.reviews.slice(0, 2).map((r, i) => (
                              <div key={i} className="rounded-sm border border-line/50 bg-pine-850 p-1.5">
                                <div className="mb-0.5 flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-chalk">{r.user}</span>
                                  <span className="flex items-center gap-0.5 text-[9px] text-gold-300">
                                    <IconStar className="h-2.5 w-2.5 fill-current" />
                                    {r.rating}
                                  </span>
                                </div>
                                <div className="text-[10px] leading-snug text-moss">{r.text}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* pros & cons */}
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <div className="rounded-md border border-turf-500/30 bg-turf-900/20 p-1.5">
                            <div className="mb-1 font-mono text-[8.5px] uppercase tracking-wider text-turf-400">pros</div>
                            <ul className="space-y-0.5">
                              {m.pros.slice(0, 3).map((p, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-moss">
                                  ✓ {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-md border border-blood-400/30 bg-blood-400/5 p-1.5">
                            <div className="mb-1 font-mono text-[8.5px] uppercase tracking-wider text-blood-400">cons</div>
                            <ul className="space-y-0.5">
                              {m.cons.slice(0, 3).map((c, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-moss">
                                  ✗ {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* warnings */}
                        {m.warnings.length > 0 && (
                          <div className="mb-2 rounded-md border border-gold-300/30 bg-gold-300/5 p-1.5">
                            <div className="mb-1 flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-wider text-gold-300">
                              <IconAlert className="h-3 w-3" />
                              warnings
                            </div>
                            <ul className="space-y-0.5">
                              {m.warnings.slice(0, 2).map((w, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-moss">
                                  ⚠ {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* code excerpt */}
                        <div className="mb-2 rounded-md border border-line/80 bg-pine-900 p-1.5">
                          <CodeView code={m.excerpt} lang="lua" />
                        </div>

                        {/* pull button */}
                        <button
                          onClick={() => onPull(m.id)}
                          disabled={pulled}
                          className={`flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 font-display text-[10px] font-semibold tracking-[0.16em] transition-all ${
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
          ) : (
            /* detail view */
            selectedMod ? (
              <div className="space-y-3">
                <button
                  onClick={() => setOpen(null)}
                  className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-fog hover:text-moss"
                >
                  <IconChevron className="h-3 w-3 rotate-180" />
                  back to list
                </button>

                <div>
                  <h3 className="mb-1 text-[14px] font-bold text-chalk">{selectedMod.name}</h3>
                  <div className="flex items-center gap-2 font-mono text-[9.5px] text-fog">
                    <span className="text-moss">{selectedMod.platform}</span>
                    <span>·</span>
                    <span>{selectedMod.version}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-gold-300">
                      <IconStar className="h-3 w-3 fill-current" />
                      {selectedMod.rating}/5
                    </span>
                  </div>
                </div>

                <div className="text-[11px] leading-relaxed text-moss">{selectedMod.description}</div>

                {/* files */}
                <div className="rounded-md border border-line/80 bg-pine-900 p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-fog">
                    <IconFile className="h-3 w-3" />
                    files ({selectedMod.files.length})
                  </div>
                  <ul className="space-y-1">
                    {selectedMod.files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-sm border border-line/50 bg-pine-850 px-1.5 py-1">
                        <span className="text-[10px] font-semibold text-chalk">{f.name}</span>
                        <span className="font-mono text-[8.5px] text-fog">{f.size}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1.5 space-y-0.5">
                    {selectedMod.files.map((f, i) => (
                      <div key={i} className="text-[9px] leading-snug text-fog">
                        <span className="text-moss">{f.name}:</span> {f.purpose}
                      </div>
                    ))}
                  </div>
                </div>

                {/* variables */}
                <div className="rounded-md border border-line/80 bg-pine-900 p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-fog">
                    <IconCode className="h-3 w-3" />
                    variables ({selectedMod.variables.length})
                  </div>
                  <ul className="space-y-1">
                    {selectedMod.variables.map((v, i) => (
                      <li key={i} className="rounded-sm border border-line/50 bg-pine-850 px-1.5 py-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-turf-300">{v.name}</span>
                          <span className="font-mono text-[8.5px] text-fog">{v.type}</span>
                        </div>
                        <div className="text-[9px] leading-snug text-fog">{v.purpose}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* logic */}
                <div className="rounded-md border border-line/80 bg-pine-900 p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-fog">
                    <IconCode className="h-3 w-3" />
                    logic flow
                  </div>
                  <ul className="space-y-0.5">
                    {selectedMod.logic.map((l, i) => (
                      <li key={i} className="text-[9.5px] leading-snug text-moss">
                        {i + 1}. {l}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* test plan */}
                <div className="rounded-md border border-turf-500/30 bg-turf-900/20 p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-turf-400">
                    <IconTest className="h-3 w-3" />
                    test plan
                  </div>
                  <ul className="space-y-0.5">
                    {selectedMod.testPlan.map((t, i) => (
                      <li key={i} className="text-[9.5px] leading-snug text-moss">
                        ✓ {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center font-mono text-[10px] text-fog">
                select a mod to view details
              </div>
            )
          )}
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
