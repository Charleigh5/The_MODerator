import { useEffect, useRef, useState } from "react";
import type {
  Phase,
  ChatMsg,
  QAState,
  PatternDef,
  BundleMeta,
  BuildStatus,
  TermLine,
} from "./types";
import { PLATFORMS, MODS, PATTERNS } from "./data/modLibrary";
import {
  starterKb,
  detectCategory,
  generateBundle,
  buildSteps,
  testLines,
  CATEGORIES,
} from "./lib/agentEngine";
import TopBar from "./components/TopBar";
import SourcesPanel from "./components/SourcesPanel";
import AgentChat from "./components/AgentChat";
import Workbench from "./components/Workbench";
import Terminal from "./components/Terminal";

const GREETING =
  "CODEWRIGHT here — head coach of this office. Pull up a chair and tell me, in plain English, what NCAA 27 should do differently. I'll grill you on the details right here on the chalkboard, then stitch together blocks I've scouted off the corkboard into a signed, game-ready bundle. Film-room jockeys: the CLI below takes orders too — type `help`.";

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [qa, setQa] = useState<QAState | null>(null);
  const [kb, setKb] = useState<PatternDef[]>(() => starterKb());
  const [bundle, setBundle] = useState<BundleMeta | null>(null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("unbuilt");
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLog, setBuildLog] = useState<TermLine[]>([]);
  const [testLog, setTestLog] = useState<TermLine[]>([]);
  const [testing, setTesting] = useState(false);
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const [termOpen, setTermOpen] = useState(true);

  const idRef = useRef(1);
  const timers = useRef<number[]>([]);
  const kbRef = useRef<PatternDef[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const qaRef = useRef<QAState | null>(null);
  const bundleRef = useRef<BundleMeta | null>(null);
  phaseRef.current = phase;
  qaRef.current = qa;
  bundleRef.current = bundle;
  kbRef.current = kb;

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  /* ---------- chat / term writers ---------- */
  const pushMsg = (role: ChatMsg["role"], text: string, tag?: string) =>
    setMessages((m) => [...m, { id: idRef.current++, role, text, tag }]);

  const termPush = (kind: TermLine["kind"], text: string) =>
    setTermLines((l) => [...l, { kind, text }]);

  /* ---------- boot ---------- */
  useEffect(() => {
    pushMsg("agent", GREETING);
    pushMsg("sys", "wire connected · 4 platforms · 6 patterns warm");
    termPush("dim", "gridiron-forge v0.9.4 — kernel linked");
    termPush("dim", "mounting pattern vault … 4 sources on the wire");
    termPush("ok", "knowledge base: 6 blocks warm");
    termPush("out", "agent CODEWRIGHT online — type `help`");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- agent flow ---------- */
  const startBrief = (text: string) => {
    if (phaseRef.current === "generating") return;
    const cat = detectCategory(text);
    setPhase("qa");
    pushMsg("user", text);
    after(550, () => pushMsg("agent", cat.opener(text), "scout"));
    after(1250, () => {
      pushMsg("agent", cat.questions[0].ask);
      termPush("out", `brief accepted · route: ${cat.label} · ${cat.questions.length}-question interrogation`);
    });
    setQa({ category: cat.id, index: 0, answers: {}, brief: text });
  };

  const answer = (value: string) => {
    const q = qaRef.current;
    if (!q || phaseRef.current !== "qa") return;
    const cat = CATEGORIES.find((c) => c.id === q.category)!;
    const question = cat.questions[q.index];
    pushMsg("user", value);
    const answers = { ...q.answers, [question.key]: value };
    const next = q.index + 1;
    if (next < cat.questions.length) {
      setQa({ ...q, answers, index: next });
      after(550, () => pushMsg("agent", cat.questions[next].ask));
    } else {
      setQa({ ...q, answers, index: next });
      const summary = Object.entries(answers)
        .map(([k, v]) => `${k} → ${v}`)
        .join(" · ");
      after(500, () =>
        pushMsg("agent", `Locked in: ${summary}.\nThat's the whole picture. Weaving vault blocks into your bundle now — watch the wire.`, "locked")
      );
      compile(cat.id, answers, q.brief);
    }
  };

  const compile = (catId: (typeof CATEGORIES)[number]["id"], answers: Record<string, string>, brief: string) => {
    setPhase("generating");
    const stages = [
      "stage 1/5 · resolving manifest against ncaa27-mod/3.1",
      "stage 2/5 · matching brief against warm patterns in the vault",
      "stage 3/5 · synthesizing schema + hot-reload var table",
      "stage 4/5 · writing logic hooks · conflict scan clean",
      "stage 5/5 · signing bundle",
    ];
    stages.forEach((s, i) => after(1000 + i * 620, () => pushMsg("sys", s, "compiler")));
    after(1000 + stages.length * 620, () => {
      const cat = CATEGORIES.find((c) => c.id === catId)!;
      const b = generateBundle(cat, answers, brief, kbRef.current);
      setBundle(b);
      setPhase("ready");
      pushMsg(
        "agent",
        `Bundle hot: "${b.title}" — ${b.files.length} files, ${b.blocksLinked} blocks linked, sha ${b.hash}.\nOpen the SHIP tab on the right: run BUILD, hit SANDBOX TEST, then export straight into your mods folder. That's a touchdown, coach.`,
        "bundle"
      );
      termPush("ok", `compile complete · ${b.id} · ${b.files.length} files · sha ${b.hash}`);
    });
  };

  const onSend = (text: string) => {
    if (phase === "idle") startBrief(text);
    else if (phase === "qa") answer(text);
    else if (phase === "ready")
      pushMsg(
        "agent",
        "This bundle is sealed and signed — if you want changes, hit NEW MOD up top and re-brief me. I'll take the same route faster now that I know your tendencies."
      );
  };

  /* ---------- vault ---------- */
  const pullMod = (modId: string) => {
    const mod = MODS.find((m) => m.id === modId);
    if (!mod) return;
    const existing = new Set(kb.map((p) => p.id));
    const fresh = PATTERNS.filter((p) => mod.patternIds.includes(p.id) && !existing.has(p.id));
    if (fresh.length === 0) {
      termPush("dim", `${mod.name}: patterns already in knowledge base`);
      return;
    }
    setKb((k) => [...k, ...fresh]);
    pushMsg("sys", `learned ${fresh.length} pattern${fresh.length > 1 ? "s" : ""} from "${mod.name} ${mod.version}"`, "vault");
    termPush("ok", `pull ${mod.id} · +${fresh.length} patterns (${fresh.map((p) => p.name).join(", ")})`);
  };

  /* ---------- build / test / export ---------- */
  const runBuild = () => {
    const b = bundleRef.current;
    if (!b || buildStatus !== "unbuilt") return;
    setBuildStatus("building");
    setBuildLog([]);
    const steps = buildSteps(b);
    steps.forEach((s, i) =>
      after(380 * (i + 1), () => {
        setBuildLog((l) => [...l, { kind: s.kind, text: s.line }]);
        setBuildProgress((i + 1) / steps.length);
        termPush(s.kind, `[build] ${s.line}`);
      })
    );
    after(380 * (steps.length + 1), () => {
      setBuildStatus("built");
      pushMsg("sys", "build passed · bundle signed and sandbox-cleared", "pipeline");
    });
  };

  const runTest = () => {
    const b = bundleRef.current;
    if (!b || buildStatus !== "built" || testing) return;
    setTesting(true);
    setTestLog([]);
    const lines = testLines(b);
    lines.forEach((l, i) =>
      after(480 * (i + 1), () => {
        setTestLog((t) => [...t, { kind: l.kind, text: l.line }]);
        termPush(l.kind, `[test] ${l.line}`);
      })
    );
    after(480 * (lines.length + 1), () => {
      setTesting(false);
      pushMsg("sys", "sandbox verdict: SHIP IT — safe for live saves", "verdict");
    });
  };

  const exportBundle = () => {
    const b = bundleRef.current;
    if (!b || buildStatus !== "built") return;
    const payload = {
      format: "ncaa27-mod-bundle/1.0",
      generated_by: "GridironForge v0.9.4 · agent CODEWRIGHT",
      target: "NCAA Football 27 · build >=1.0.3841",
      id: b.id,
      name: b.title,
      version: b.version,
      signature: b.hash,
      blocks_linked: b.blocksLinked,
      learned_from: b.kbUsed.map((k) => ({ pattern: k.name, kind: k.kind, source: k.source })),
      files: b.files.map((f) => ({ path: f.path, lang: f.lang, bytes: f.bytes, content: f.content })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.slug}.ncaa27mod.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushMsg("sys", `exported ${b.slug}.ncaa27mod.json — drop it in NCAA 27/mods/`, "export");
    termPush("ok", `export · ${b.slug}.ncaa27mod.json written to disk`);
  };

  /* ---------- reset ---------- */
  const resetAll = (silent?: boolean) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase("idle");
    setMessages([]);
    setQa(null);
    setBundle(null);
    setBuildStatus("unbuilt");
    setBuildProgress(0);
    setBuildLog([]);
    setTestLog([]);
    setTesting(false);
    if (!silent) {
      after(60, () => {
        pushMsg("agent", "Fresh slate. Same agent, cleaner whiteboard. What are we breaking — I mean, improving — this time?");
        pushMsg("sys", "session reset · knowledge base retained");
      });
      termPush("dim", "session reset — agent ready for a new brief");
    }
  };

  /* ---------- terminal ---------- */
  const execCommand = (raw: string) => {
    termPush("in", raw);
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ").replace(/^["“”']|["“”']$/g, "");
    const c = cmd.toLowerCase();

    if (c === "help") {
      [
        "help                 — this card",
        "sources              — platforms on the wire",
        "mods                 — indexed mods (with ids)",
        "pull <id|all>        — learn patterns into the KB",
        "kb                   — list warm patterns",
        'brief "<text>"       — hand the agent a mod brief',
        "status               — pipeline phase + bundle",
        "build | test | export — run the ship pipeline",
        "new                  — reset for a fresh mod",
        "version · whoami · clear",
      ].forEach((l) => termPush("out", l));
    } else if (c === "sources") {
      PLATFORMS.forEach((p) => termPush("out", `${p.name.padEnd(18)} ${p.url.padEnd(20)} ${String(p.mods).padStart(5)} mods · ${p.status}`));
    } else if (c === "mods") {
      MODS.forEach((m) => termPush("out", `${m.id.padEnd(11)} ${m.name.padEnd(26)} ${m.version.padEnd(12)} ${m.blocks} blk · ${m.reliability}%`));
    } else if (c === "pull") {
      if (arg === "all") {
        MODS.forEach((m) => pullMod(m.id));
        termPush("ok", "vault swept — every clean pattern learned");
      } else if (MODS.some((m) => m.id === arg)) {
        pullMod(arg);
      } else {
        termPush("err", `unknown mod id "${arg}" — run \`mods\` for the index`);
      }
    } else if (c === "kb") {
      termPush("out", `knowledge base · ${kb.length} patterns warm:`);
      kb.forEach((p) => termPush("out", `  [${p.kind.padEnd(8)}] ${p.name} ← ${p.source}`));
    } else if (c === "brief") {
      if (!arg) {
        termPush("err", 'brief needs text — brief "stop CPU poaching my commits"');
      } else if (phaseRef.current === "generating") {
        termPush("err", "agent busy compiling — wait, or `new` to abort");
      } else {
        if (phaseRef.current === "ready") resetAll(true);
        startBrief(arg);
      }
    } else if (c === "status") {
      termPush("out", `phase    : ${phase}`);
      termPush("out", `kb       : ${kb.length} patterns`);
      termPush("out", `bundle   : ${bundle ? `${bundle.id} (v${bundle.version})` : "none"}`);
      termPush("out", `build    : ${buildStatus}`);
      if (qa) termPush("out", `q&a      : ${CATEGORIES.find((x) => x.id === qa.category)?.label} · Q${Math.min(qa.index + 1, 9)}/${CATEGORIES.find((x) => x.id === qa.category)?.questions.length}`);
    } else if (c === "build") {
      if (!bundle) termPush("err", "nothing to build — brief the agent first");
      else if (buildStatus === "built") termPush("dim", "already built — signature holds");
      else runBuild();
    } else if (c === "test") {
      if (!bundle) termPush("err", "nothing to test — brief the agent first");
      else if (buildStatus !== "built") termPush("err", "run `build` before the sandbox will accept it");
      else runTest();
    } else if (c === "export") {
      if (!bundle || buildStatus !== "built") termPush("err", "export needs a built bundle — `build` first");
      else exportBundle();
    } else if (c === "new") {
      resetAll();
    } else if (c === "clear") {
      setTermLines([]);
    } else if (c === "version") {
      termPush("out", "gridiron-forge v0.9.4 · agent CODEWRIGHT · schema ncaa27-mod/3.1");
    } else if (c === "whoami") {
      termPush("out", "coach — the only human in the building");
    } else {
      termPush("err", `command not found: ${cmd} — try \`help\``);
    }
  };

  /* ---------- render ---------- */
  const motes = [
    { left: "72%", top: "30%", dur: 12, delay: 0 },
    { left: "80%", top: "22%", dur: 15, delay: 2 },
    { left: "88%", top: "38%", dur: 11, delay: 4 },
    { left: "76%", top: "52%", dur: 17, delay: 1 },
    { left: "92%", top: "18%", dur: 13, delay: 6 },
    { left: "68%", top: "16%", dur: 16, delay: 3 },
    { left: "84%", top: "60%", dur: 14, delay: 5 },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden font-body text-chalk">
      {/* desk lamp wash + dust */}
      <div className="lamp-glow pointer-events-none absolute -top-24 right-[-8%] z-0 h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(255,196,110,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_50%,rgba(10,5,2,0.55)_100%)]" />
      {motes.map((m, i) => (
        <span key={i} className="mote z-0" style={{ left: m.left, top: m.top, animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }} />
      ))}
      <div className="chalk-text pointer-events-none absolute -right-6 top-[20%] z-0 hidden select-none font-chalk text-[15rem] font-bold leading-none text-chalk/[0.04] lg:block" style={{ transform: "rotate(-8deg)" }}>
        '27
      </div>

      <TopBar phase={phase} kbCount={kb.length} onNew={() => resetAll()} canReset={messages.length > 2 || phase !== "idle"} />

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 lg:grid-cols-[324px_minmax(0,1fr)_462px] lg:overflow-visible">
        <div className="h-[480px] min-h-0 lg:h-auto">
          <SourcesPanel kb={kb} onPull={pullMod} />
        </div>
        <div className="h-[540px] min-h-0 lg:h-auto">
          <AgentChat
            messages={messages}
            phase={phase}
            qa={qa}
            onSend={onSend}
            onAnswer={answer}
            busy={phase === "generating"}
          />
        </div>
        <div className="h-[580px] min-h-0 lg:h-auto">
          <Workbench
            phase={phase}
            bundle={bundle}
            buildStatus={buildStatus}
            buildProgress={buildProgress}
            buildLog={buildLog}
            testLog={testLog}
            testing={testing}
            onBuild={runBuild}
            onTest={runTest}
            onExport={exportBundle}
          />
        </div>
      </main>

      <div className="relative z-10 shrink-0 px-3 pb-3">
        <Terminal lines={termLines} onCommand={execCommand} open={termOpen} onToggle={() => setTermOpen((o) => !o)} />
      </div>
    </div>
  );
}
