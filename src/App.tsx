import { useEffect, useMemo, useRef, useState } from "react";
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
  SOURCES,
} from "./lib/agentEngine";
import { generateContextualStretchIdeas } from "./lib/stretchIdeas";
import {
  createInitialContext,
  updateContext,
  generateConversationalResponse,
  shouldTransitionToRefining,
  shouldTransitionToReady,
  suggestNextStep,
  type ConversationContext,
} from "./lib/conversationEngine";
import {
  type Memory,
  type Session,
  type SessionSummary,
  loadMemory,
  saveMemory,
  loadSessions,
  upsertSession,
  removeSession,
  summarize,
  makeSession,
  binderLabel,
  slugifyName,
  nextNum,
  maxMsgId,
} from "./lib/storage";
import TopBar from "./components/TopBar";
import SourcesPanel from "./components/SourcesPanel";
import AgentChat from "./components/AgentChat";
import Workbench from "./components/Workbench";
import Terminal from "./components/Terminal";
import DemoController from "./components/DemoController";
import ModLibraryPanel from "./components/ModLibraryPanel";
import ModLibraryBrowser from "./components/ModLibraryBrowser";
import CodeViewport from "./components/CodeViewport";
import FeatureRoadmap from "./components/FeatureRoadmap";
import {
  loadModLibrary,
  addModToLibrary,
  type ModEntry,
} from "./lib/modStore";
import type { ModEntry as VaultModEntry } from "./types";

const GREETING_BASE =
  "CODEWRIGHT here — forged in Ann Arbor, bleeds maize and blue. Chalk up what NCAA 27 should do differently in plain English. I'll pin some stretch ideas to the board first, grill you on the details — including which proven vault mods to borrow code from — then weave it all into a signed, game-ready bundle. Go Blue. Prefer the terminal? I obey the CLI too — type `help` below.";

function memoryFacts(m: Memory): string {
  const parts: string[] = [];
  if (m.kbIds.length) parts.push(`${m.kbIds.length} patterns warm`);
  if (m.built.length)
    parts.push(
      `${m.built.length} mod${m.built.length > 1 ? "s" : ""} shipped (${m.built
        .slice(-2)
        .map((b) => b.slug)
        .join(", ")})`
    );
  if (m.prefs.length) parts.push(`notes say you ${m.prefs[0]}`);
  return parts.join(" · ");
}

export default function App() {
  /* ---------- boot: cabinet + brain ---------------------------------- */
  const boot = useMemo(() => {
    const mem = loadMemory();
    mem.visits += 1;
    saveMemory(mem);
    const sessions = loadSessions();
    return { mem, sessions, resumed: sessions.length > 0, maxId: maxMsgId(sessions) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active0 = boot.sessions[0] ?? null;

  const [phase, setPhase] = useState<Phase>(active0?.phase ?? "idle");
  const [messages, setMessages] = useState<ChatMsg[]>(active0?.messages ?? []);
  const [qa, setQa] = useState<QAState | null>(active0?.qa ?? null);
  const [bundle, setBundle] = useState<BundleMeta | null>(active0?.bundle ?? null);
  const [buildStatus, setBuildStatus] = useState<BuildStatus>(active0?.buildStatus ?? "unbuilt");
  const [kb, setKb] = useState<PatternDef[]>(() =>
    boot.mem.kbIds.length ? PATTERNS.filter((p) => boot.mem.kbIds.includes(p.id)) : starterKb()
  );
  const [mem, setMem] = useState<Memory>(boot.mem);
  const [sessions, setSessions] = useState<SessionSummary[]>(() => summarize(boot.sessions));
  const [activeId, setActiveId] = useState<string | null>(active0?.id ?? null);

  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLog, setBuildLog] = useState<TermLine[]>([]);
  const [testLog, setTestLog] = useState<TermLine[]>([]);
  const [testing, setTesting] = useState(false);
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const [termOpen, setTermOpen] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showModLibrary, setShowModLibrary] = useState(false);
  const [showModLibraryBrowser, setShowModLibraryBrowser] = useState(false);
  const [showCodeViewport, setShowCodeViewport] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [codeViewportState, setCodeViewportState] = useState({
    activeFile: '',
    code: '',
    currentLine: 0,
    modifiedLines: [] as number[],
    isGenerating: false,
  });
  const [modLibrary, setModLibrary] = useState(() => loadModLibrary());
  const [conversationContext, setConversationContext] = useState<ConversationContext>(createInitialContext());
  const [conversationPhase, setConversationPhase] = useState<"exploring" | "refining" | "ready">("exploring");

  const idRef = useRef(boot.maxId + 1);
  const timers = useRef<number[]>([]);
  const kbRef = useRef(kb);
  const memRef = useRef(mem);
  const metaRef = useRef(
    active0
      ? { id: active0.id, num: active0.num, name: active0.name, createdAt: active0.createdAt }
      : { id: "", num: 0, name: "", createdAt: Date.now() }
  );
  const phaseRef = useRef(phase);
  const qaRef = useRef(qa);
  const bundleRef = useRef(bundle);
  phaseRef.current = phase;
  qaRef.current = qa;
  bundleRef.current = bundle;
  kbRef.current = kb;
  memRef.current = mem;

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  /* ---------- writers ------------------------------------------------- */
  const pushMsg = (role: ChatMsg["role"], text: string, tag?: string) =>
    setMessages((m) => [...m, { id: idRef.current++, role, text, tag }]);
  const termPush = (kind: TermLine["kind"], text: string) =>
    setTermLines((l) => [...l, { kind, text }]);

  const mutateMem = (fn: (m: Memory) => Memory) => {
    const n = fn(memRef.current);
    memRef.current = n;
    saveMemory(n);
    setMem(n);
  };

  /* ---------- boot effect --------------------------------------------- */
  useEffect(() => {
    const m = boot.mem;
    termPush("dim", "gridiron-forge v0.9.4 — kernel linked");
    termPush("dim", "mounting pattern vault … 4 sources on the wire");
    termPush("ok", `knowledge base: ${kbRef.current.length} blocks warm`);
    if (boot.resumed && boot.sessions[0]) {
      const s = boot.sessions[0];
      termPush("out", `resumed binder ${binderLabel(s.num)} · memory: ${m.kbIds.length} patterns / ${m.built.length} shipped`);
      pushMsg("sys", `binder ${binderLabel(s.num)} opened — full context restored from the shelf`);
      const facts = memoryFacts(m);
      pushMsg(
        "agent",
        `Back in "${s.name}", coach. I kept the film rolling while you were out${facts ? ` — ${facts}` : ""}. Pick up where we left off, or pull a fresh binder off the shelf.`
      );
    } else {
      const s = makeSession(1);
      metaRef.current = { id: s.id, num: s.num, name: s.name, createdAt: s.createdAt };
      setActiveId(s.id);
      upsertSession(s);
      pushMsg("agent", GREETING_BASE);
      pushMsg("sys", "wire connected · 4 platforms · patterns warm");
      termPush("out", `binder ${binderLabel(1)} opened · agent CODEWRIGHT online — type \`help\``);
    }
    setSessions(summarize(loadSessions()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- autosave the active binder ------------------------------- */
  useEffect(() => {
    if (!activeId || metaRef.current.id !== activeId) return;
    const t = window.setTimeout(() => {
      const snap: Session = {
        id: activeId,
        num: metaRef.current.num,
        name: metaRef.current.name,
        createdAt: metaRef.current.createdAt,
        updatedAt: Date.now(),
        phase,
        messages: messages.slice(-200),
        qa,
        bundle,
        buildStatus,
      };
      upsertSession(snap);
      setSessions(summarize(loadSessions()));
    }, 400);
    return () => window.clearTimeout(t);
  }, [activeId, phase, messages, qa, bundle, buildStatus]);

  const snapshot = (): Session | null => {
    if (!metaRef.current.id) return null;
    return {
      id: metaRef.current.id,
      num: metaRef.current.num,
      name: metaRef.current.name,
      createdAt: metaRef.current.createdAt,
      updatedAt: Date.now(),
      phase: phaseRef.current,
      messages,
      qa: qaRef.current,
      bundle: bundleRef.current,
      buildStatus,
    };
  };

  /* ---------- binder management ---------------------------------------- */
  const hydrate = (s: Session) => {
    metaRef.current = { id: s.id, num: s.num, name: s.name, createdAt: s.createdAt };
    setActiveId(s.id);
    setPhase(s.phase);
    setMessages(s.messages);
    setQa(s.qa);
    setBundle(s.bundle);
    setBuildStatus(s.buildStatus);
    setBuildProgress(0);
    setBuildLog([]);
    setTestLog([]);
    setTesting(false);
  };

  const createSession = () => {
    if (phaseRef.current === "generating") return;
    const snap = snapshot();
    if (snap) upsertSession(snap);
    const s = makeSession(nextNum(loadSessions()));
    upsertSession(s);
    hydrate(s);
    setMessages([]);
    const facts = memoryFacts(memRef.current);
    pushMsg(
      "agent",
      `Fresh binder on the desk.${facts ? ` Brain intact from the shelf: ${facts}.` : ""} What's the play this time, coach?`
    );
    termPush("out", `new binder ${binderLabel(s.num)} created · memory carried over`);
    setSessions(summarize(loadSessions()));
  };

  const switchSession = (id: string) => {
    if (id === activeId) return;
    const snap = snapshot();
    if (snap) upsertSession(snap);
    const target = loadSessions().find((s) => s.id === id);
    if (!target) return;
    hydrate(target);
    pushMsg("sys", `binder ${binderLabel(target.num)} pulled from the shelf — context restored`);
    termPush("out", `opened binder ${binderLabel(target.num)} · "${target.name}"`);
    setSessions(summarize(loadSessions()));
  };

  const deleteSession = (id: string) => {
    removeSession(id);
    if (id === activeId) {
      const rest = loadSessions();
      if (rest.length > 0) {
        hydrate(rest[0]);
        pushMsg("sys", `binder ${binderLabel(rest[0].num)} pulled from the shelf — resuming`);
      } else {
        const s = makeSession(1);
        upsertSession(s);
        hydrate(s);
        setMessages([]);
        pushMsg("agent", `Cabinet's empty — fresh binder, fresh page. ${GREETING_BASE}`);
      }
    }
    termPush("out", `binder removed · ${loadSessions().length} left on the shelf`);
    setSessions(summarize(loadSessions()));
  };

  /* ---------- knowledge base ------------------------------------------- */
  const learnMod = (modId: string): number => {
    const mod = MODS.find((m) => m.id === modId);
    if (!mod) return 0;
    const pats = PATTERNS.filter((p) => mod.patternIds.includes(p.id));
    setKb((old) => {
      const have = new Set(old.map((p) => p.id));
      return [...old, ...pats.filter((p) => !have.has(p.id))];
    });
    mutateMem((m) => ({ ...m, kbIds: [...new Set([...m.kbIds, ...mod.patternIds])] }));
    return pats.length;
  };

  const pullMod = (modId: string) => {
    const mod = MODS.find((m) => m.id === modId);
    if (!mod) return;
    const n = learnMod(modId);
    termPush("out", `pull ${mod.id} · ${mod.name} · ${n} patterns learned`);
    pushMsg(
      "sys",
      `learned ${n} patterns from ${mod.platform} → "${mod.name}" (blocks join the knowledge base)`,
      "learn"
    );
  };

  /* ---------- agent flow ----------------------------------------------- */
  const startBrief = (text: string) => {
    if (phaseRef.current === "generating") return;
    
    // Initialize conversation context with the brief
    const initialContext = updateContext(createInitialContext(), text);
    setConversationContext(initialContext);
    setConversationPhase("exploring");
    
    const name = slugifyName(text);
    metaRef.current = { ...metaRef.current, name };
    mutateMem((m) => ({ ...m, briefs: [...m.briefs, text].slice(-6) }));
    
    pushMsg("user", text);
    
    // Start with a conversational response
    after(600, () => {
      const response = generateConversationalResponse(initialContext, text, "exploring");
      pushMsg("agent", response);
    });
    
    termPush("out", `conversation started · let's build this mod together`);
  };
  
  // Transition to QA phase when ready to compile
  const transitionToQA = () => {
    if (phaseRef.current === "generating") return;
    
    const context = conversationContext;
    if (!context.category || context.keyFeatures.length === 0) {
      pushMsg("agent", "I need a bit more detail before we can start building. What specific features would you like this mod to include?");
      return;
    }
    
    const cat = CATEGORIES.find(c => c.id === context.category)!;
    const contextualExpansions = generateContextualStretchIdeas(context.modIdea, cat.id, 3);
    
    setPhase("qa");
    after(500, () => {
      pushMsg("agent", `Alright, I've got a solid understanding of what you want! Let me pin some stretch ideas to the board — these are bonus features that would make your mod even better.`, "scout");
    });
    after(1200, () => {
      pushMsg("sys", "stretch ideas pinned to the board — pick any, then we drill", "compiler");
    });
    termPush("out", `route: ${cat.label} · scout report ready`);
    setQa({ category: cat.id, index: 0, answers: {}, brief: context.modIdea, expansions: contextualExpansions, expLocked: false });
  };

  const lockExpansions = (selected: string[]) => {
    const q = qaRef.current;
    if (!q || q.expLocked) return;
    setQa({ ...q, expansions: selected, expLocked: true });
    if (selected.length) {
      pushMsg("user", selected.map((s) => `+ ${s}`).join("\n"));
      after(450, () =>
        pushMsg(
          "agent",
          `Stretch goals locked: ${selected.join(" · ")}. I'll wire each one as a hot-reload extension in the bundle.`
        )
      );
      mutateMem((m) => ({
        ...m,
        prefs: [...new Set([...m.prefs, "wants stretch-goal extensions in bundles"])].slice(0, 4),
      }));
    } else {
      pushMsg("user", "no extras — keep it lean");
      after(450, () => pushMsg("agent", "Lean it is. Core mod only, no extensions — still signed, still game-ready."));
    }
    const cat = CATEGORIES.find((c) => c.id === q.category)!;
    after(1000, () => pushMsg("agent", cat.questions[0].ask));
    termPush("out", `extensions: ${selected.length || "none"} · interrogation begins`);
  };

  const answer = (value: string) => {
    const q = qaRef.current;
    if (!q || phaseRef.current !== "qa") return;
    const cat = CATEGORIES.find((c) => c.id === q.category)!;
    const question = cat.questions[q.index];
    pushMsg("user", value);

    const hits: string[] = [];
    if (/realistic/i.test(value)) hits.push("want realistic tuning, not arcade");
    if (/hard|brutal|punish|sweat/i.test(value)) hits.push("like a punishing challenge");
    if (/chaos|wild|fun|crazy/i.test(value)) hits.push("here for chaos and fun");
    if (q.category === "recruiting") hits.push("go hard on recruiting mods");
    if (hits.length)
      mutateMem((m) => ({ ...m, prefs: [...new Set([...m.prefs, ...hits])].slice(0, 4) }));

    const answers = { ...q.answers, [question.key]: value };

    /* sourcing question → actually pull the chosen vault mods */
    if (question.key === "sources") {
      const picks =
        value.toLowerCase().includes("scout")
          ? SOURCES[q.category] ?? []
          : (value.split(",").map((s) => MODS.find((m) => m.short.toLowerCase() === s.trim().toLowerCase())?.id).filter(Boolean) as string[]);
      const unique = [...new Set(picks)];
      let total = 0;
      const parts = unique.map((id) => {
        const n = learnMod(id);
        total += n;
        return `${id} (+${n})`;
      });
      after(500, () =>
        pushMsg(
          "agent",
          `${total ? `Pulled ${total} fresh blocks from ${unique.length} vault mod${unique.length > 1 ? "s" : ""} (${parts.join(" · ")}).` : "Those were already warm in the vault."} Weaving everything now.`,
          "compiler"
        )
      );
      termPush("ok", `pattern pull · ${parts.join(" · ") || "kb already warm"}`);
    }

    const next = q.index + 1;
    if (next < cat.questions.length) {
      setQa({ ...q, answers, index: next });
      after(500, () => pushMsg("agent", cat.questions[next].ask));
    } else {
      setQa({ ...q, answers, index: next });
      const summary = Object.entries(answers)
        .map(([k, v]) => `${k} → ${v}`)
        .join(" · ");
      after(1100, () =>
        pushMsg("agent", `Locked in: ${summary}.\nThat's the whole picture. Weaving vault blocks into your bundle now — watch the wire.`, "locked")
      );
      compile(cat.id, answers, q.brief, q.expansions);
    }
  };

  const compile = (
    catId: (typeof CATEGORIES)[number]["id"],
    answers: Record<string, string>,
    brief: string,
    expansions: string[]
  ) => {
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
      const b = generateBundle(cat, answers, brief, kbRef.current, expansions);
      setBundle(b);
      mutateMem((m) => ({
        ...m,
        built: [
          ...m.built,
          { slug: b.slug, title: b.title, version: b.version, at: Date.now() },
        ].slice(-8),
      }));
      setPhase("ready");
      const n = memRef.current.built.length;
      pushMsg(
        "agent",
        `Bundle's on your desk — "${b.title}" v${b.version}, ${b.files.length} files, ${b.kbUsed.length} vault patterns woven in. Blueprints in the right panel.\nThat's mod #${n} on your record, coach — I'll remember it in every binder from here on.`
      );
      termPush("ok", `bundle signed · ${b.id} · ${b.files.length} files · ${b.hash}`);
    });
  };

  /* ---------- ship pipeline -------------------------------------------- */
  const runBuild = () => {
    const b = bundleRef.current;
    if (!b || buildStatus === "building") return;
    setBuildStatus("building");
    setBuildProgress(0);
    setBuildLog([]);
    const steps = buildSteps(b);
    steps.forEach((step, i) => {
      after(i * 520, () => setBuildLog((l) => [...l, { kind: step.kind, text: step.line }]));
      after(i * 520 + 150, () => setBuildProgress(Math.round(((i + 1) / steps.length) * 100)));
    });
    after(steps.length * 520 + 200, () => {
      setBuildStatus("built");
      termPush("ok", `build clean · ${b.files.reduce((a, f) => a + f.bytes, 0)} bytes · 0 conflicts`);
    });
  };

  const runTest = () => {
    const b = bundleRef.current;
    if (!b || testing) return;
    setTesting(true);
    setTestLog([]);
    const lines = testLines(b);
    lines.forEach((line, i) =>
      after(i * 430, () => setTestLog((l) => [...l, { kind: line.kind, text: line.line }]))
    );
    after(lines.length * 430 + 200, () => {
      setTesting(false);
      termPush("ok", "scrimmage complete · 4 quarters · 0 errors");
    });
  };

  const exportBundle = () => {
    const b = bundleRef.current;
    if (!b) return;
    const payload = {
      id: b.id,
      title: b.title,
      slug: b.slug,
      version: b.version,
      format: "ncaa27-mod/3.1",
      hash: b.hash,
      installed: b.kbUsed.map((p) => ({ id: p.id, name: p.name, source: p.source })),
      files: b.files.map((f) => ({ path: f.path, lang: f.lang, bytes: f.bytes, content: f.content })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.slug}.ncaa27mod.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushMsg("sys", `exported ${b.slug}.ncaa27mod.json — drop it in /mods and fire up the game`, "export");
    termPush("ok", `exported → ${b.slug}.ncaa27mod.json`);
  };

  /* ---------- agent / cli input ---------------------------------------- */
  const onSend = (text: string) => {
    const t = text.trim();
    if (!t) return;
    
    // If we're in QA phase, use the existing answer logic
    if (phaseRef.current === "qa") {
      answer(t);
      return;
    }
    
    // Check if user wants to compile/build
    const lowerText = t.toLowerCase();
    if (conversationPhase === "ready" && (lowerText.includes("ready") || lowerText.includes("build") || lowerText.includes("compile") || lowerText.includes("go"))) {
      transitionToQA();
      return;
    }
    
    // Update conversation context
    const updatedContext = updateContext(conversationContext, t);
    setConversationContext(updatedContext);
    
    // Add user message
    pushMsg("user", t);
    
    // Check for phase transitions
    if (conversationPhase === "exploring" && shouldTransitionToRefining(updatedContext)) {
      setConversationPhase("refining");
      after(500, () => {
        pushMsg("agent", "Great! I'm getting a clear picture. Let's refine some details to make sure this mod is exactly what you want.", "refining");
      });
      return;
    }
    
    if (conversationPhase === "refining" && shouldTransitionToReady(updatedContext)) {
      setConversationPhase("ready");
      after(500, () => {
        pushMsg("agent", "Perfect! I think we have enough detail to start building. Are you ready to compile this mod, or would you like to add anything else?", "ready");
      });
      return;
    }
    
    // Generate conversational response
    after(800, () => {
      const response = generateConversationalResponse(updatedContext, t, conversationPhase);
      pushMsg("agent", response);
      
      // Suggest next step if available
      const suggestion = suggestNextStep(updatedContext);
      if (suggestion && Math.random() > 0.5) {
        after(1500, () => {
          pushMsg("sys", `💡 Suggestion: ${suggestion}`);
        });
      }
    });
  };

  const resetAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([]);
    setQa(null);
    setBundle(null);
    setPhase("idle");
    setBuildStatus("unbuilt");
    setBuildProgress(0);
    setBuildLog([]);
    setTestLog([]);
    setTesting(false);
    setConversationContext(createInitialContext());
    setConversationPhase("exploring");
  };

  const execCommand = (raw: string) => {
    termPush("in", raw);
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = raw.slice(cmd.length).trim().replace(/^["']|["']$/g, "");
    const c = cmd.toLowerCase();

    if (c === "help") {
      termPush("out", "commands:");
      termPush("out", "  help                  this card");
      termPush("out", "  sources               platforms on the wire");
      termPush("out", "  mods                  indexed mods");
      termPush("out", "  pull <id|all>         learn patterns from a mod");
      termPush("out", "  kb                    patterns currently warm");
      termPush("out", "  sessions              binders on the shelf");
      termPush("out", "  brief \"<text>\"        hand the agent a brief");
      termPush("out", "  build · test · export run the ship pipeline");
      termPush("out", "  new                   grab a fresh binder");
      termPush("out", "  status                where are we");
    } else if (c === "sources") {
      PLATFORMS.forEach((p) =>
        termPush("out", `  ${p.name.padEnd(18)} ${p.mods.toLocaleString().padStart(8)} mods   ${p.url}   [${p.status}]`)
      );
    } else if (c === "mods") {
      MODS.forEach((m) => termPush("out", `  ${m.id.padEnd(12)} ${m.name.padEnd(34)} ${m.platform}`));
    } else if (c === "kb") {
      if (kbRef.current.length === 0) termPush("out", "knowledge base is cold — pull a mod");
      kbRef.current.forEach((p) => termPush("out", `  ${p.kind.padEnd(9)} ${p.name}   ← ${p.source}`));
    } else if (c === "pull") {
      const target = arg.toLowerCase();
      if (target === "all") {
        MODS.forEach((m) => pullMod(m.id));
        termPush("ok", `learned every curated mod — ${kbRef.current.length + MODS.reduce((a, m) => a + m.patternIds.length, 0)}+ patterns`);
      } else if (MODS.some((m) => m.id === target)) {
        pullMod(target);
      } else {
        termPush("err", `no mod "${arg}" — run \`mods\``);
      }
    } else if (c === "sessions") {
      const list = loadSessions();
      if (!list.length) termPush("out", "shelf is empty");
      list.forEach((s) =>
        termPush("out", `  ${s.id === activeId ? "▶" : " "} ${binderLabel(s.num)} · ${s.name.padEnd(26)} · ${s.phase.padEnd(10)} · ${s.bundle ? "bundled" : "—"}`)
      );
    } else if (c === "brief") {
      if (!arg) {
        termPush("err", "usage: brief \"your idea in plain english\"");
        return;
      }
      if (phaseRef.current === "ready") {
        resetAll();
        pushMsg("sys", "new huddle — fresh brief on the same binder", "note");
      }
      startBrief(arg);
    } else if (c === "build") {
      if (!bundleRef.current) termPush("err", "no bundle yet — brief the agent first");
      else {
        runBuild();
        termPush("out", "build pipeline running …");
      }
    } else if (c === "test") {
      if (!bundleRef.current) termPush("err", "no bundle to scrimmage");
      else {
        runTest();
        termPush("out", "loading scrimmage …");
      }
    } else if (c === "export") {
      if (!bundleRef.current) termPush("err", "nothing to export");
      else exportBundle();
    } else if (c === "new") {
      createSession();
    } else if (c === "status") {
      const ph = phaseRef.current;
      termPush("out", `phase: ${ph} · binder: ${binderLabel(metaRef.current.num)} "${metaRef.current.name}"`);
      termPush("out", `brain: ${kbRef.current.length} patterns · ${memRef.current.built.length} mods shipped across all binders`);
      if (bundleRef.current) termPush("out", `bundle: ${bundleRef.current.title} v${bundleRef.current.version}`);
    } else if (c === "clear") {
      setTermLines([]);
    } else if (c === "whoami") {
      termPush("out", `coach — ${memRef.current.built.length} mods on record, ${memRef.current.visits} office visits`);
    } else {
      termPush("err", `command not found: ${cmd} — try \`help\``);
    }
  };

  /* ---------- mod library handlers --------------------------------------- */
  const handleResumeMod = (mod: ModEntry) => {
    // Load the mod's session
    const session = loadSessions().find((s) => s.id === mod.sessionId);
    if (session) {
      hydrate(session);
      pushMsg("sys", `resumed mod "${mod.name}" from library`);
      termPush("out", `resumed mod: ${mod.name} (v${mod.currentVersion})`);
    }
    setShowModLibrary(false);
  };

  const handleEditMod = (mod: ModEntry) => {
    // Load the mod's session for editing
    const session = loadSessions().find((s) => s.id === mod.sessionId);
    if (session) {
      hydrate(session);
      pushMsg("sys", `editing mod "${mod.name}" - make your changes and save`);
      termPush("out", `editing mod: ${mod.name}`);
    }
    setShowModLibrary(false);
  };

  const handleSaveModToLibrary = () => {
    if (!bundle || !activeId) {
      termPush("err", "no mod to save - create a bundle first");
      return;
    }

    const category = qa?.category || "unknown";
    const mod = addModToLibrary(
      modLibrary,
      {
        name: metaRef.current.name || "Untitled Mod",
        description: `Mod created on ${new Date().toLocaleDateString()}`,
        category,
        sessionId: activeId,
        tags: [],
        status: "active",
      },
      bundle
    );

    setModLibrary({ ...modLibrary });
    pushMsg("sys", `saved "${mod.name}" to mod library (v${mod.currentVersion})`);
    termPush("ok", `mod saved: ${mod.name} → library`);
  };

  const handleUseVaultMod = (mod: VaultModEntry) => {
    // Import the mod as a starting point
    pushMsg("sys", `imported vault mod "${mod.name}" as starting point`);
    termPush("out", `imported mod: ${mod.name} from ${mod.platform}`);
    
    // Pull patterns from this mod
    const pats = PATTERNS.filter((p) => mod.patternIds.includes(p.id));
    setKb((old) => {
      const have = new Set(old.map((p) => p.id));
      return [...old, ...pats.filter((p) => !have.has(p.id))];
    });
    
    termPush("ok", `pulled ${pats.length} patterns from ${mod.name}`);
    setShowModLibraryBrowser(false);
  };

  const handleModifyVaultMod = (mod: VaultModEntry) => {
    // Load the mod for modification
    pushMsg("sys", `loading vault mod "${mod.name}" for modification`);
    termPush("out", `modifying mod: ${mod.name} from ${mod.platform}`);
    
    // Pull patterns and show code viewport
    const pats = PATTERNS.filter((p) => mod.patternIds.includes(p.id));
    setKb((old) => {
      const have = new Set(old.map((p) => p.id));
      return [...old, ...pats.filter((p) => !have.has(p.id))];
    });
    
    // Show code viewport with the mod's excerpt
    setCodeViewportState({
      activeFile: mod.files[0]?.name || 'main.lua',
      code: mod.excerpt,
      currentLine: 0,
      modifiedLines: [],
      isGenerating: false,
    });
    setShowCodeViewport(true);
    setShowModLibraryBrowser(false);
  };

  /* ---------- render ---------------------------------------------------- */
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
      <div className="lamp-glow pointer-events-none absolute -top-28 left-1/2 z-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,203,5,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_52%,rgba(0,6,15,0.6)_100%)]" />
      {motes.map((m, i) => (
        <span key={i} className="mote z-0" style={{ left: m.left, top: m.top, animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }} />
      ))}
      <div className="pointer-events-none absolute -left-10 top-1/2 z-0 hidden -translate-y-1/2 select-none font-display text-[34rem] leading-none text-maize-400/[0.045] lg:block" style={{ WebkitTextStroke: "2px rgba(255,203,5,0.08)" }}>
        M
      </div>

      <TopBar
        phase={phase}
        kbCount={kb.length}
        onNew={createSession}
        canReset={phase !== "generating"}
        modCount={modLibrary.mods.length}
        onToggleLibrary={() => setShowModLibrary(!showModLibrary)}
        onBrowseVault={() => setShowModLibraryBrowser(true)}
        onSaveMod={handleSaveModToLibrary}
        canSave={!!bundle && !!activeId}
        onShowRoadmap={() => setShowRoadmap(true)}
      />

      {/* Demo Controller */}
      <DemoController
        active={demoActive}
        onComplete={() => {
          setDemoActive(false);
          setDemoStep(0);
        }}
        onStepChange={setDemoStep}
      />

      {/* Demo Start Button */}
      {!demoActive && (
        <button
          onClick={() => {
            resetAll();
            setDemoActive(true);
            setDemoStep(0);
          }}
          className="fixed bottom-20 right-4 z-50 rounded-lg bg-maize-400 px-4 py-2 font-body text-sm font-bold text-navy-950 shadow-lg transition-all hover:scale-105 hover:bg-maize-300"
        >
          🎬 Start Demo
        </button>
      )}

      {/* Demo Progress Indicator */}
      {demoActive && (
        <div className="fixed bottom-20 right-4 z-50 rounded-lg bg-navy-900/90 px-4 py-2 font-body text-xs text-chalk shadow-lg backdrop-blur-sm">
          <div className="font-bold text-maize-400">Demo in Progress</div>
          <div className="mt-1 text-chalk/70">Step {demoStep + 1} of 17</div>
          <button
            onClick={() => {
              setDemoActive(false);
              setDemoStep(0);
            }}
            className="mt-2 rounded bg-inkred/20 px-2 py-1 text-xs text-inkred hover:bg-inkred/30"
          >
            Exit Demo
          </button>
        </div>
      )}

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-y-auto p-2 lg:grid-cols-[180px_minmax(0,1fr)_260px] lg:overflow-visible">
        <div className="h-[520px] min-h-0 lg:h-auto">
          <SourcesPanel kb={kb} onPull={pullMod} />
        </div>
        <div className="h-[640px] min-h-0 lg:h-auto">
          <AgentChat
            messages={messages}
            phase={phase}
            qa={qa}
            onSend={onSend}
            onAnswer={answer}
            onLock={lockExpansions}
            busy={phase === "generating"}
          />
        </div>
        <div className="h-[520px] min-h-0 lg:h-auto">
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

      {/* Mod Library Panel */}
      {showModLibrary && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModLibrary(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-96 shadow-2xl">
            <ModLibraryPanel
              onResumeMod={handleResumeMod}
              onEditMod={handleEditMod}
            />
          </div>
        </>
      )}

      {/* Mod Library Browser */}
      <ModLibraryBrowser
        isOpen={showModLibraryBrowser}
        onClose={() => setShowModLibraryBrowser(false)}
        onUseMod={handleUseVaultMod}
        onModifyMod={handleModifyVaultMod}
      />

      {/* Code Viewport */}
      <CodeViewport
        isOpen={showCodeViewport}
        onClose={() => setShowCodeViewport(false)}
        activeFile={codeViewportState.activeFile}
        code={codeViewportState.code}
        currentLine={codeViewportState.currentLine}
        modifiedLines={codeViewportState.modifiedLines}
        isGenerating={codeViewportState.isGenerating}
      />

      {/* Feature Roadmap Modal */}
      {showRoadmap && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowRoadmap(false)}
          />
          <div className="fixed inset-4 z-50 overflow-hidden rounded-xl border-2 border-maize-400 bg-navy-950 shadow-2xl">
            <FeatureRoadmap />
          </div>
        </>
      )}
    </div>
  );
}
