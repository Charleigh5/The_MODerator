import { useState } from "react";
import type { BuildStatus, BundleMeta, Phase, TermLine } from "../types";
import CodeView from "./CodeView";

type Tab = "blueprint" | "ship";

const KB = (b: number) => (b / 1024).toFixed(1) + " KB";

const KIND_CLS: Record<TermLine["kind"], string> = {
  in: "text-ink",
  out: "text-[#5a5240]",
  ok: "text-inkgreen",
  err: "text-inkred",
  dim: "text-[#8b8578]",
};

function Check({ on }: { on: boolean }) {
  return (
    <span className={`grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[3px] border-2 ${on ? "border-inkgreen bg-inkgreen/10" : "border-[#a49a82]"}`}>
      {on && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-inkgreen" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6.5 L5 9.5 L10 3" />
        </svg>
      )}
    </span>
  );
}

function EmptyDesk({ phase }: { phase: Phase }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="tape relative rotate-[-2deg] bg-[#f8f3e2] px-6 py-5 shadow-[0_10px_22px_rgba(0,0,0,0.25)]">
        <span className="tape absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 rotate-[3deg]" />
        <div className="typewrite text-[13px] leading-relaxed text-[#5c4a2a]">
          {phase === "generating" ? (
            <>
              COACH IS AT THE BOARD —<br />
              <span className="text-inkred">compiling your play call…</span>
            </>
          ) : (
            <>
              NO PLAY CALL ON THE DESK YET.<br />
              Feed the coach a brief on the chalkboard
              <span className="text-inkred"> →</span> he'll handle the rest.
            </>
          )}
        </div>
      </div>
      <div className="typewrite mt-6 text-[10px] uppercase tracking-[0.2em] text-[#8b7f62]">
        this desk prints · manifest — schema — logic — var table
      </div>
    </div>
  );
}

export default function Workbench({
  phase,
  bundle,
  buildStatus,
  buildProgress,
  buildLog,
  testLog,
  testing,
  onBuild,
  onTest,
  onExport,
}: {
  phase: Phase;
  bundle: BundleMeta | null;
  buildStatus: BuildStatus;
  buildProgress: number;
  buildLog: TermLine[];
  testLog: TermLine[];
  testing: boolean;
  onBuild: () => void;
  onTest: () => void;
  onExport: () => void;
}) {
  const [tab, setTab] = useState<Tab>("blueprint");
  const [fileIdx, setFileIdx] = useState(0);

  const file = bundle?.files[Math.min(fileIdx, (bundle?.files.length ?? 1) - 1)];

  return (
    <section
      data-demo-id="workbench"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-[10px] border-wood-700 shadow-[0_18px_40px_rgba(0,0,0,0.5)] animate-rise"
      style={{ animationDelay: "180ms" }}
    >
      {/* desk header */}
      <div className="flex shrink-0 items-center gap-2 bg-gradient-to-b from-wood-800 to-wood-850 px-3 pb-0 pt-2.5">
        <div className="plaque mr-1 px-2.5 py-1 font-display text-[11px] tracking-[0.14em]">PLAY SHEET</div>
        {(["blueprint", "ship"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`folder-tab relative px-5 pb-1.5 pt-2.5 font-display text-[11px] tracking-[0.12em] transition-all ${
                active
                  ? "z-10 -mb-px bg-paper text-ink shadow-[0_-4px_10px_rgba(0,0,0,0.25)]"
                  : "bg-manila-2 text-[#6b5a36] hover:bg-manila"
              }`}
            >
              {t === "blueprint" ? "BLUEPRINT" : "SHIP IT"}
              {t === "ship" && bundle && buildStatus === "built" && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-inkgreen bg-[#cfe8d4]" />
              )}
            </button>
          );
        })}
        <span className="typewrite ml-auto pb-1.5 text-[9px] uppercase tracking-[0.16em] text-[#8a7350]">
          ncaa27-mod / 3.1
        </span>
      </div>

      {/* paper surface */}
      <div className="tex-paper min-h-0 flex-1 overflow-hidden">
        {!bundle ? (
          <EmptyDesk phase={phase} />
        ) : tab === "blueprint" ? (
          <div className="flex h-full flex-col">
            {/* meta */}
            <div className="shrink-0 border-b border-dashed border-[#c9bd9d] px-4 pb-2 pt-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[17px] leading-tight text-ink">{bundle.title}</h3>
                  <div className="typewrite mt-0.5 text-[10px] text-[#77603a]">
                    {bundle.id} · {bundle.version} · sha {bundle.hash}
                  </div>
                </div>
                <span className="stamp-btn shrink-0 border-inkgreen px-2 py-0.5 text-[9.5px] font-bold text-inkgreen opacity-90">
                  SIGNED
                </span>
              </div>
              <div className="typewrite mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9.5px] text-[#5c4a2a]">
                <span>▸ {bundle.blocksLinked} blocks linked</span>
                <span>▸ patterns: {bundle.kbUsed.slice(0, 2).map((p) => p.name.replace(/\(.*\)/, "").trim()).join(", ")}…</span>
                <span className="ml-auto">{bundle.files.length} files</span>
              </div>
            </div>

            {/* file slips */}
            <div className="flex shrink-0 gap-1.5 overflow-x-auto px-4 py-2">
              {bundle.files.map((f, i) => (
                <button
                  key={f.path}
                  onClick={() => setFileIdx(i)}
                  className={`relative shrink-0 rounded-sm border px-2.5 py-1 typewrite text-[10px] transition-all ${
                    i === fileIdx
                      ? "border-inkred/60 bg-[#f8f3e2] font-bold text-inkred shadow-[2px_2px_0_rgba(0,0,0,0.12)]"
                      : "border-[#d8cfb6] bg-paper-2/60 text-[#6b5a36] hover:bg-paper-2"
                  }`}
                >
                  {f.path.split("/").pop()}
                  <span className="ml-1.5 opacity-60">{KB(f.bytes)}</span>
                </button>
              ))}
            </div>

            {/* sheet with punch holes */}
            {file && (
              <div className="relative mx-4 mb-4 min-h-0 flex-1 overflow-hidden rounded-sm border border-[#d8cfb6] bg-[#faf5e6] shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
                <div className="absolute bottom-0 left-0 top-0 w-7 border-r border-[#e8b4a8]/60 bg-[#f6efe0]">
                  {[18, 50, 82].map((t) => (
                    <span key={t} className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-[#d8cfb6] bg-wood-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" style={{ top: `${t}%` }} />
                  ))}
                </div>
                <div className="h-full overflow-auto pl-9 pr-2 py-2">
                  <CodeView code={file.content} lang={file.lang} />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ---------------- SHIP tab — clipboard ---------------- */
          <div className="h-full overflow-y-auto px-4 py-3">
            <div className="relative rounded-md border-2 border-[#8a6544] bg-[#f8f3e2] px-4 pb-4 pt-6 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              {/* metal clip */}
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-md border border-[#7c7c74] bg-gradient-to-b from-[#d8d8d0] to-[#9a9a92] shadow-[0_3px_5px_rgba(0,0,0,0.35)]">
                <span className="absolute left-1/2 top-1.5 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[#6e6e66]" />
              </span>

              <h4 className="typewrite text-center text-[12px] uppercase tracking-[0.2em] text-[#5c4a2a]">
                — game-day checklist —
              </h4>

              {/* build */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <Check on={buildStatus === "built"} />
                  <span className="text-[13px] font-bold text-ink">1 · Bundle the play sheet</span>
                  {buildStatus === "building" && (
                    <span className="typewrite ml-auto text-[10px] text-inkgold">{buildProgress}%</span>
                  )}
                </div>
                {buildStatus !== "unbuilt" && (
                  <div className="ml-6 mt-1.5">
                    <div className="h-2.5 overflow-hidden rounded-full border border-[#c9bd9d] bg-paper-2">
                      <div
                        className={`h-full rounded-full bg-inkgreen/80 transition-all duration-300 ${buildStatus === "building" ? "bar-stripes" : ""}`}
                        style={{ width: `${buildProgress}%` }}
                      />
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      {buildLog.map((l, i) => (
                        <div key={i} className={`typewrite text-[10px] ${KIND_CLS[l.kind]}`}>
                          {l.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {buildStatus === "unbuilt" && (
                  <button data-demo-id="build-button" onClick={onBuild} className="stamp-btn ml-6 mt-2 bg-inkred/5 px-4 py-1.5 text-[11.5px] font-bold text-inkred hover:bg-inkred/15">
                    RUN THE BUILD ▸
                  </button>
                )}
              </div>

              {/* test */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Check on={testLog.some((l) => l.kind === "ok" && l.text.includes("ALL CLEAR"))} />
                  <span className="text-[13px] font-bold text-ink">2 · Sandbox scrimmage (4 quarters)</span>
                  {testing && <span className="typewrite ml-auto text-[10px] text-inkgold">running…</span>}
                </div>
                {testLog.length === 0 ? (
                  <button
                    onClick={onTest}
                    disabled={buildStatus !== "built" || testing}
                    className="stamp-btn ml-6 mt-2 bg-inkblue/5 px-4 py-1.5 text-[11.5px] font-bold text-inkblue hover:bg-inkblue/15 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {buildStatus !== "built" ? "BUILD FIRST" : "KICK OFF ▸"}
                  </button>
                ) : (
                  <div className="ml-6 mt-1.5 space-y-0.5">
                    {testLog.map((l, i) => (
                      <div key={i} className={`typewrite text-[10.5px] ${KIND_CLS[l.kind]}`}>
                        {l.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* export */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Check on={false} />
                  <span className="text-[13px] font-bold text-ink">3 · Slip it to the equipment manager</span>
                </div>
                <p className="typewrite ml-6 mt-1 text-[10px] leading-relaxed text-[#77603a]">
                  Drop the file into <span className="font-bold text-ink">/mods</span> and boot NCAA 27 — it hot-loads.
                </p>
                <button
                  data-demo-id="export-button"
                  onClick={onExport}
                  className="stamp-btn ml-6 mt-2 bg-inkgreen/5 px-5 py-2 text-[12.5px] font-bold text-inkgreen hover:bg-inkgreen/15"
                >
                  ⬇ EXPORT {bundle.slug}.ncaa27mod.json
                </button>
              </div>
            </div>

            <div className="typewrite px-1 pb-2 pt-3 text-center text-[9px] uppercase tracking-[0.18em] text-[#a49a82]">
              forged in the office · {bundle.files.length} files · {bundle.hash}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
