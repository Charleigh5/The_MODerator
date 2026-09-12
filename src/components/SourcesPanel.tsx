import { useState } from "react";
import type { PatternDef } from "../types";
import { MODS, PLATFORMS } from "../data/modLibrary";
import CodeView from "./CodeView";
import { IconVault, IconRadar, IconChevron, IconDownload, IconCheck, IconStar, IconAlert, IconFile, IconCode, IconTest } from "./icons";

const KIND_COLOR: Record<PatternDef["kind"], string> = {
  Hook: "text-[#ff9b8a] border-[#ff9b8a]/40 bg-[#ff9b8a]/10",
  Block: "text-[#8ce39b] border-[#8ce39b]/40 bg-[#8ce39b]/10",
  Schema: "text-[#8fd9ff] border-[#8fd9ff]/30 bg-[#8fd9ff]/10",
  VarTable: "text-[#ffd94f] border-[#ffd94f]/30 bg-[#ffd94f]/10",
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
    <aside 
      data-demo-id="pattern-vault"
      className="flex h-full min-h-0 flex-col overflow-hidden animate-rise rounded-lg border-2 border-[#2a4a3a]"
      style={{ 
        animationDelay: "60ms",
        background: "linear-gradient(135deg, #1a2f23 0%, #0f1f17 100%)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)"
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-2 px-3 py-2.5 border-b-2 border-[#2a4a3a]"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <IconVault className="h-4 w-4 text-[#8ce39b]" />
        <h2 className="text-[11px] font-bold tracking-[0.22em] text-[#f2efe4]" style={{ fontFamily: 'Inter, sans-serif' }}>
          PATTERN VAULT
        </h2>
        <span className="ml-auto flex items-center gap-1.5 rounded-sm border border-[#8ce39b]/40 bg-[#8ce39b]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#8ce39b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8ce39b] shadow-[0_0_6px_rgba(140,227,155,0.8)]" />
          4 sources live
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* platforms */}
        <div className="border-b border-[#2a4a3a]/70 px-3 py-2.5">
          <div className="mb-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#a8b8b0]">
            <IconRadar className="h-3.5 w-3.5 text-[#ffd94f]" />
            live platform connections
          </div>
          <ul className="space-y-1.5">
            {PLATFORMS.map((p) => (
              <li
                key={p.id}
                className="group flex items-center justify-between rounded-md border border-transparent px-2 py-1.5 transition-all hover:border-[#2a4a3a] hover:bg-[#1a2f23]/50"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "online" ? "bg-[#8ce39b] shadow-[0_0_6px_rgba(140,227,155,0.8)]" : "bg-[#ffd94f]"
                    }`}
                  />
                  <div>
                    <div className="text-[12px] font-semibold text-[#f2efe4] group-hover:text-[#8ce39b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {p.name}
                    </div>
                    <div className="font-mono text-[9px] text-[#a8b8b0]">{p.url}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[9.5px] leading-tight">
                  <div className="text-[#c8d8d0]">{p.mods.toLocaleString()} mods</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={p.status === "online" ? "text-[#8ce39b]" : "text-[#ffd94f]/80"}>
                      {p.status === "online" ? "OK" : "sync…"}
                    </span>
                    <span className="text-[#a8b8b0]/60">{p.latency}ms</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* mods */}
        <div className="border-b border-[#2a4a3a]/70 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#a8b8b0]">
            <span>indexed mods · {MODS.length} curated</span>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-sm px-1.5 py-0.5 text-[8px] uppercase tracking-wider transition-colors ${
                  viewMode === "list" ? "bg-[#8ce39b]/20 text-[#8ce39b]" : "text-[#a8b8b0] hover:text-[#c8d8d0]"
                }`}
              >
                list
              </button>
              <button
                onClick={() => setViewMode("detail")}
                className={`rounded-sm px-1.5 py-0.5 text-[8px] uppercase tracking-wider transition-colors ${
                  viewMode === "detail" ? "bg-[#8ce39b]/20 text-[#8ce39b]" : "text-[#a8b8b0] hover:text-[#c8d8d0]"
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
                  <li key={m.id} className="overflow-hidden rounded-md border border-[#2a4a3a]/70 bg-[#0f1f17]/60">
                    <button
                      onClick={() => setOpen(isOpen ? null : m.id)}
                      className="group flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-[#1a2f23]"
                    >
                      <IconChevron
                        className={`h-3 w-3 shrink-0 text-[#a8b8b0] transition-transform duration-300 ${isOpen ? "rotate-90 text-[#8ce39b]" : ""}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[12px] font-semibold text-[#f2efe4] group-hover:text-[#8ce39b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {m.name}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-[#ffd94f]">
                            <IconStar className="h-2.5 w-2.5 fill-current" />
                            {m.rating}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] text-[#a8b8b0]">
                          <span className="text-[#c8d8d0]">{m.platform}</span>
                          <span>·</span>
                          <span>{m.version}</span>
                          <span>·</span>
                          <span>{m.reviewCount} reviews</span>
                          <span className={`ml-auto ${m.reliability >= 95 ? "text-[#8ce39b]" : "text-[#ffd94f]"}`}>
                            {m.reliability}%
                          </span>
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#2a4a3a]/70 bg-[#0a1510]/50 px-2.5 py-2 animate-rise">
                        {/* description */}
                        <div className="mb-2 text-[11px] leading-relaxed text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>{m.description}</div>

                        {/* tags */}
                        <div className="mb-2 flex flex-wrap gap-1">
                          {m.tags.map((t) => (
                            <span key={t} className="rounded-sm border border-[#2a4a3a] px-1.5 py-px font-mono text-[8.5px] uppercase tracking-wider text-[#c8d8d0]">
                              {t}
                            </span>
                          ))}
                          <span className="ml-auto font-mono text-[8.5px] text-[#a8b8b0]">{m.downloads} pulls</span>
                        </div>

                        {/* rating breakdown */}
                        <div className="mb-2 rounded-md border border-[#2a4a3a]/80 bg-[#0f1f17] p-2">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#a8b8b0]">user reviews</span>
                            <span className="flex items-center gap-0.5 text-[10px] text-[#ffd94f]">
                              <IconStar className="h-3 w-3 fill-current" />
                              {m.rating}/5 · {m.reviewCount} reviews
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {m.reviews.slice(0, 2).map((r, i) => (
                              <div key={i} className="rounded-sm border border-[#2a4a3a]/50 bg-[#0f1f17]/80 p-1.5">
                                <div className="mb-0.5 flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-[#f2efe4]" style={{ fontFamily: 'Inter, sans-serif' }}>{r.user}</span>
                                  <span className="flex items-center gap-0.5 text-[9px] text-[#ffd94f]">
                                    <IconStar className="h-2.5 w-2.5 fill-current" />
                                    {r.rating}
                                  </span>
                                </div>
                                <div className="text-[10px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>{r.text}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* pros & cons */}
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <div className="rounded-md border border-[#8ce39b]/30 bg-[#8ce39b]/10 p-1.5">
                            <div className="mb-1 font-mono text-[8.5px] uppercase tracking-wider text-[#8ce39b]">pros</div>
                            <ul className="space-y-0.5">
                              {m.pros.slice(0, 3).map((p, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  ✓ {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-md border border-[#ff9b8a]/30 bg-[#ff9b8a]/5 p-1.5">
                            <div className="mb-1 font-mono text-[8.5px] uppercase tracking-wider text-[#ff9b8a]">cons</div>
                            <ul className="space-y-0.5">
                              {m.cons.slice(0, 3).map((c, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  ✗ {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* warnings */}
                        {m.warnings.length > 0 && (
                          <div className="mb-2 rounded-md border border-[#ffd94f]/30 bg-[#ffd94f]/5 p-1.5">
                            <div className="mb-1 flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-wider text-[#ffd94f]">
                              <IconAlert className="h-3 w-3" />
                              warnings
                            </div>
                            <ul className="space-y-0.5">
                              {m.warnings.slice(0, 2).map((w, i) => (
                                <li key={i} className="text-[9.5px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  ⚠ {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* code excerpt */}
                        <div className="mb-2 rounded-md border border-[#2a4a3a]/80 bg-[#0f1f17] p-1.5">
                          <CodeView code={m.excerpt} lang="lua" />
                        </div>

                        {/* pull button */}
                        <button
                          onClick={() => onPull(m.id)}
                          disabled={pulled}
                          className={`flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-all ${
                            pulled
                              ? "cursor-default border-[#8ce39b]/40 bg-[#8ce39b]/20 text-[#8ce39b]"
                              : "border-[#ff9b8a]/50 bg-[#ff9b8a]/10 text-[#ff9b8a] hover:border-[#ff9b8a] hover:bg-[#ff9b8a]/20 active:scale-[0.98]"
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
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
                  className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#a8b8b0] hover:text-[#c8d8d0]"
                >
                  <IconChevron className="h-3 w-3 rotate-180" />
                  back to list
                </button>

                <div>
                  <h3 className="mb-1 text-[14px] font-bold text-[#f2efe4]" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedMod.name}</h3>
                  <div className="flex items-center gap-2 font-mono text-[9.5px] text-[#a8b8b0]">
                    <span className="text-[#c8d8d0]">{selectedMod.platform}</span>
                    <span>·</span>
                    <span>{selectedMod.version}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-[#ffd94f]">
                      <IconStar className="h-3 w-3 fill-current" />
                      {selectedMod.rating}/5
                    </span>
                  </div>
                </div>

                <div className="text-[11px] leading-relaxed text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedMod.description}</div>

                {/* files */}
                <div className="rounded-md border border-[#2a4a3a]/80 bg-[#0f1f17] p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#a8b8b0]">
                    <IconFile className="h-3 w-3" />
                    files ({selectedMod.files.length})
                  </div>
                  <ul className="space-y-1">
                    {selectedMod.files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-sm border border-[#2a4a3a]/50 bg-[#0f1f17]/80 px-1.5 py-1">
                        <span className="text-[10px] font-semibold text-[#f2efe4]" style={{ fontFamily: 'Inter, sans-serif' }}>{f.name}</span>
                        <span className="font-mono text-[8.5px] text-[#a8b8b0]">{f.size}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1.5 space-y-0.5">
                    {selectedMod.files.map((f, i) => (
                      <div key={i} className="text-[9px] leading-snug text-[#a8b8b0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span className="text-[#c8d8d0]">{f.name}:</span> {f.purpose}
                      </div>
                    ))}
                  </div>
                </div>

                {/* variables */}
                <div className="rounded-md border border-[#2a4a3a]/80 bg-[#0f1f17] p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#a8b8b0]">
                    <IconCode className="h-3 w-3" />
                    variables ({selectedMod.variables.length})
                  </div>
                  <ul className="space-y-1">
                    {selectedMod.variables.map((v, i) => (
                      <li key={i} className="rounded-sm border border-[#2a4a3a]/50 bg-[#0f1f17]/80 px-1.5 py-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#8ce39b]" style={{ fontFamily: 'Inter, sans-serif' }}>{v.name}</span>
                          <span className="font-mono text-[8.5px] text-[#a8b8b0]">{v.type}</span>
                        </div>
                        <div className="text-[9px] leading-snug text-[#a8b8b0]" style={{ fontFamily: 'Inter, sans-serif' }}>{v.purpose}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* logic */}
                <div className="rounded-md border border-[#2a4a3a]/80 bg-[#0f1f17] p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#a8b8b0]">
                    <IconCode className="h-3 w-3" />
                    logic flow
                  </div>
                  <ul className="space-y-0.5">
                    {selectedMod.logic.map((l, i) => (
                      <li key={i} className="text-[9.5px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {i + 1}. {l}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* test plan */}
                <div className="rounded-md border border-[#8ce39b]/30 bg-[#8ce39b]/10 p-2">
                  <div className="mb-1.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#8ce39b]">
                    <IconTest className="h-3 w-3" />
                    test plan
                  </div>
                  <ul className="space-y-0.5">
                    {selectedMod.testPlan.map((t, i) => (
                      <li key={i} className="text-[9.5px] leading-snug text-[#c8d8d0]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        ✓ {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center font-mono text-[10px] text-[#a8b8b0]">
                select a mod to view details
              </div>
            )
          )}
        </div>

        {/* knowledge base */}
        <div className="px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#a8b8b0]">
            knowledge base <span className="text-[#8ce39b]">{kb.length} warm</span>
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
              <span className="font-mono text-[10px] text-[#a8b8b0]">cold start — pull a mod above</span>
            )}
          </div>
          <p className="mt-2.5 border-l-2 border-[#8ce39b]/50 pl-2 font-mono text-[9px] leading-relaxed text-[#a8b8b0]">
            Every block the agent writes cites a pattern it learned here. Pull more mods → better weave.
          </p>
        </div>
      </div>
    </aside>
  );
}
