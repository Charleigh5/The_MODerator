import { useEffect, useState, type ReactNode } from "react";
import type { BundleMeta, BuildStatus, Phase, TermLine } from "../types";
import CodeView from "./CodeView";
import {
  IconCode,
  IconBox,
  IconCopy,
  IconCheck,
  IconDownload,
  IconFlask,
  IconBolt,
  IconFile,
  IconShield,
  IconTree,
} from "./icons";

function bytesFmt(n: number): string {
  return n > 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`;
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
  const [tab, setTab] = useState<"blueprint" | "ship">("blueprint");
  const [fileIdx, setFileIdx] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (phase === "ready") setTab("ship");
  }, [phase]);
  useEffect(() => setFileIdx(0), [bundle?.slug]);

  const file = bundle?.files[fileIdx];

  const copy = async (path: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(path);
    window.setTimeout(() => setCopied((c) => (c === path ? null : c)), 1400);
  };

  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden animate-rise" style={{ animationDelay: "160ms" }}>
      {/* head + tabs */}
      <div className="panel-head flex items-center px-2 py-1.5">
        {(
          [
            { id: "blueprint", label: "BLUEPRINT", icon: <IconCode className="h-3.5 w-3.5" />, ready: !!bundle },
            { id: "ship", label: "SHIP", icon: <IconBox className="h-3.5 w-3.5" />, ready: !!bundle },
          ] as const
        ).map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              disabled={!t.ready}
              className={`relative flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-[10.5px] font-bold tracking-[0.18em] transition-colors ${
                active ? "text-turf-300" : "text-fog hover:text-moss"
              } ${!t.ready ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {t.icon}
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-[7px] h-[2px] rounded-full bg-turf-400" />}
            </button>
          );
        })}
        <span className="ml-auto mr-2 font-mono text-[9px] uppercase tracking-widest text-fog">
          {bundle ? bundle.id : "no bundle yet"}
        </span>
      </div>

      {/* ---------------- blueprint ---------------- */}
      {tab === "blueprint" && (
        <div className="flex min-h-0 flex-1 flex-col">
          {!bundle ? (
            <EmptyState
              icon={<IconCode className="h-8 w-8" />}
              title="Blueprint appears after compile"
              sub="Brief the agent on the left — generated manifest, schema, logic and var tables land here as game-ready files."
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-1 border-b border-line/70 bg-pine-950/40 px-2 py-1.5">
                {bundle.files.map((f, i) => (
                  <button
                    key={f.path}
                    onClick={() => setFileIdx(i)}
                    className={`rounded-md border px-2.5 py-1 font-mono text-[9.5px] transition-all ${
                      i === fileIdx
                        ? "border-turf-500/60 bg-turf-900/60 text-turf-300"
                        : "border-line/70 text-fog hover:border-line-bright hover:text-moss"
                    }`}
                  >
                    {f.path.split("/").pop()}
                  </button>
                ))}
                {file && (
                  <span className="ml-auto flex items-center gap-2 pr-1 font-mono text-[9px] text-fog">
                    {bytesFmt(file.bytes)}
                    <button
                      onClick={() => copy(file.path, file.content)}
                      className={`flex items-center gap-1 rounded-sm border px-1.5 py-0.5 transition-colors ${
                        copied === file.path
                          ? "border-turf-500/60 text-turf-300"
                          : "border-line text-moss hover:border-line-bright hover:text-chalk"
                      }`}
                    >
                      {copied === file.path ? <IconCheck className="h-3 w-3" /> : <IconCopy className="h-3 w-3" />}
                      {copied === file.path ? "copied" : "copy"}
                    </button>
                  </span>
                )}
              </div>
              {file && (
                <div className="min-h-0 flex-1 overflow-auto bg-pine-950/50 px-1 py-2">
                  <CodeView code={file.content} lang={file.lang} />
                </div>
              )}
              <div className="flex items-center gap-3 border-t border-line/70 bg-pine-900/60 px-3 py-1.5 font-mono text-[9px] text-fog">
                <span className="flex items-center gap-1 text-turf-500">
                  <IconShield className="h-3 w-3" /> schema ncaa27-mod/3.1
                </span>
                <span>{bundle.files.length} files</span>
                <span>{bundle.blocksLinked} blocks linked</span>
                <span className="ml-auto">sha {bundle.hash}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------- ship ---------------- */}
      {tab === "ship" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!bundle ? (
            <EmptyState
              icon={<IconBox className="h-8 w-8" />}
              title="Nothing to ship yet"
              sub="Once CODEWRIGHT compiles your brief, the testable bundle, pipeline and export live here."
            />
          ) : (
            <div className="space-y-3 px-3.5 py-3.5">
              {/* summary */}
              <div className="rounded-lg border border-line bg-pine-850/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-[15px] font-bold tracking-wide text-chalk">{bundle.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[9px] text-fog">
                      <span className="rounded-sm border border-blaze-500/40 bg-blaze-500/10 px-1.5 py-px text-blaze-300">
                        {bundle.category.toUpperCase()}
                      </span>
                      <span>{bundle.id}</span>
                      <span>· v{bundle.version}</span>
                      <span>· sha {bundle.hash}</span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 font-display text-[9px] font-bold tracking-[0.16em] ${
                      buildStatus === "built"
                        ? "border-turf-500/50 bg-turf-900/60 text-turf-300"
                        : buildStatus === "building"
                          ? "border-gold-300/40 bg-gold-300/10 text-gold-300"
                          : "border-line text-fog"
                    }`}
                  >
                    {buildStatus === "built" ? "✓ BUILT" : buildStatus === "building" ? "BUILDING" : "UNBUILT"}
                  </span>
                </div>

                {/* file tree */}
                <div className="mt-3 rounded-md border border-line/70 bg-pine-950/60 p-2.5 font-mono text-[10px] leading-relaxed text-moss">
                  <div className="mb-1 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-fog">
                    <IconTree className="h-3.5 w-3.5 text-turf-500" /> drops into /mods — testable as-is
                  </div>
                  <div className="text-chalk">▸ {bundle.slug}.ncaa27mod/</div>
                  {bundle.files.map((f) => (
                    <div key={f.path} className="group flex items-center gap-1.5 pl-4 transition-colors hover:text-turf-300">
                      <span className="text-turf-600">└</span>
                      <IconFile className="h-3 w-3 text-fog group-hover:text-turf-500" />
                      {f.path.split("/").slice(1).join("/") || f.path}
                      <span className="ml-auto text-fog/70">{bytesFmt(f.bytes)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {bundle.kbUsed.map((k) => (
                    <span key={k.id} className="rounded-sm border border-line px-1.5 py-px font-mono text-[8.5px] text-moss">
                      ← {k.source}
                    </span>
                  ))}
                </div>
              </div>

              {/* build pipeline */}
              <div className="rounded-lg border border-line bg-pine-850/70 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
                    <IconBolt className="h-3.5 w-3.5 text-blaze-400" /> build pipeline
                  </div>
                  <button
                    onClick={onBuild}
                    disabled={buildStatus !== "unbuilt"}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-display text-[10px] font-semibold tracking-[0.16em] transition-all ${
                      buildStatus === "unbuilt"
                        ? "glow-ready border-turf-500/60 bg-turf-900/70 text-turf-300 hover:border-turf-400 active:scale-95"
                        : "cursor-default border-line text-fog"
                    }`}
                  >
                    <IconBolt className="h-3.5 w-3.5" />
                    {buildStatus === "unbuilt" ? "RUN BUILD" : buildStatus === "building" ? "COMPILING…" : "BUILD PASSED"}
                  </button>
                </div>
                {buildStatus !== "unbuilt" && (
                  <div className="mt-2.5">
                    <div className="h-2 overflow-hidden rounded-full border border-line bg-pine-950">
                      <div
                        className={`h-full rounded-full bg-turf-500 transition-all duration-500 ${buildStatus === "building" ? "bar-stripes" : ""}`}
                        style={{ width: `${Math.round(buildProgress * 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 max-h-28 space-y-0.5 overflow-y-auto rounded-md border border-line/70 bg-pine-950/60 p-2 font-mono text-[9.5px] leading-relaxed">
                      {buildLog.map((l, i) => (
                        <div key={i} className={l.kind === "ok" ? "text-turf-400" : "text-moss"}>
                          <span className="text-fog">›</span> {l.text}
                        </div>
                      ))}
                      {buildStatus === "building" && <div className="caret text-moss">working</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* sandbox test */}
              <div className="rounded-lg border border-line bg-pine-850/70 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
                    <IconFlask className="h-3.5 w-3.5 text-ice-300" /> in-game sandbox test
                  </div>
                  <button
                    onClick={onTest}
                    disabled={buildStatus !== "built" || testing}
                    className="flex items-center gap-1.5 rounded-md border border-ice-300/40 bg-ice-300/5 px-3 py-1.5 font-display text-[10px] font-semibold tracking-[0.16em] text-ice-300 transition-all hover:border-ice-300/70 hover:bg-ice-300/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {testing ? <span className="spin inline-block h-3 w-3 rounded-full border border-ice-300/40 border-t-ice-300" /> : <IconFlask className="h-3.5 w-3.5" />}
                    {testing ? "SIM RUNNING" : "SANDBOX TEST"}
                  </button>
                </div>
                {buildStatus !== "built" && (
                  <p className="mt-2 font-mono text-[9.5px] text-fog">run the build first — the sandbox only accepts signed bundles.</p>
                )}
                {testLog.length > 0 && (
                  <div className="mt-2 max-h-32 space-y-0.5 overflow-y-auto rounded-md border border-line/70 bg-pine-950/60 p-2 font-mono text-[9.5px] leading-relaxed">
                    {testLog.map((l, i) => (
                      <div key={i} className={l.kind === "ok" ? "text-turf-400" : "text-moss"}>
                        <span className="text-fog">›</span> {l.text}
                      </div>
                    ))}
                    {testing && <div className="caret text-moss">simulating</div>}
                  </div>
                )}
              </div>

              {/* export */}
              <button
                onClick={onExport}
                disabled={buildStatus !== "built"}
                className="group flex w-full items-center justify-center gap-2 rounded-lg border border-turf-500/60 bg-turf-900/60 px-3 py-3 font-display text-[12px] font-bold tracking-[0.2em] text-turf-300 transition-all hover:border-turf-400 hover:bg-turf-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-fog"
              >
                <IconDownload className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                EXPORT {bundle.slug}.ncaa27mod
              </button>
              <p className="pb-1 text-center font-mono text-[9px] leading-relaxed text-fog">
                one signed package · drop it in <span className="text-moss">NCAA 27/mods/</span> and it loads on next boot
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function EmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-line-bright text-fog">{icon}</div>
      <div className="font-display text-[13px] font-semibold tracking-[0.1em] text-moss">{title}</div>
      <p className="max-w-[260px] text-[11px] leading-relaxed text-fog">{sub}</p>
    </div>
  );
}
