import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUp, CheckCircle2, HelpCircle, Cpu, FileSearch, FileUp, Layers3, LockKeyhole, Plus, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import { buildModeratorInstructions } from "../lib/aiOrchestrator";
import { compileStudioIntent, createStudioPlan, type StudioSource } from "../lib/maddenStudio";
import type { ModIntentSpec } from "../lib/modIntentCompiler";
import "./MaddenStudioApp.css";

type Message = { id: number; role: "user" | "studio"; text: string; via?: string };
const EXAMPLES = [
  { title: "Player equipment", prompt: "Give my Madden 27 safety a dark smoke visor, white gloves and a custom wristband", detail: "Texture / asset inspection" },
  { title: "Uniform identity", prompt: "Madden 27: create an alternate uniform with dark blue helmets and silver details", detail: "Art and package compatibility" },
  { title: "Franchise ratings", prompt: "Set my Madden 27 franchise QB speed to 95 in a copied save", detail: "Requires verified schema" },
  { title: "Stadium atmosphere", prompt: "Madden 27: change the end zone design and stadium field graphics", detail: "Exact-build resources required" },
];
const GREETING: Message = { id: 1, role: "studio", via: "EVIDENCE COMPILER", text: "Welcome to Madden 27 Mod Studio. Describe what you want changed. I'll identify the modification surface, show what is actually supported, and prepare a governed plan. A plan is not an installed or tested mod." };

function summary(spec: ModIntentSpec): string {
  if (spec.readiness === "BLOCKED") return `Not ready to compile. ${spec.effects.find(e => e.disposition === "BLOCKED")?.reason ?? "Game-specific evidence is insufficient."}`;
  if (spec.readiness === "NEEDS_VERIFICATION") return `The request maps to possible Madden 27 capabilities, but requires a controlled build or in-game experiment. ${spec.missingInputs.length ? `Also required: ${spec.missingInputs.join("; ")}.` : ""}`;
  if (spec.readiness === "NEEDS_INPUT") return `The request is understood. Required material: ${spec.missingInputs.join("; ")}.`;
  return "An execution plan can be prepared. No mod has been compiled, loaded or tested in Madden 27.";
}

const initial = [GREETING];

export default function MaddenStudioApp() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [spec, setSpec] = useState<ModIntentSpec | null>(null);
  const [source, setSource] = useState<StudioSource | null>(null);
  const [inspection, setInspection] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [auth, setAuth] = useState<ChatGPTAuthStatus | null>(null);
  const [model, setModel] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const desktop = typeof window !== "undefined" ? window.moderatorDesktop : undefined;
  const connected = Boolean(auth?.connected && auth?.planEnabled && model);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, spec]);
  useEffect(() => {
    if (!desktop) return;
    desktop.auth.status().then(async status => {
      setAuth(status);
      if (status.planEnabled) {
        const available = await desktop.ai.models();
        setModel(available[0]?.slug ?? "");
      }
    }).catch(() => setAuth(null));
  }, [desktop]);

  const append = (role: Message["role"], text: string, via?: string) =>
    setMessages(m => [...m, { id: nextId.current++, role, text, via }]);

  async function submit(text = draft) {
    const prompt = text.trim();
    if (!prompt || working) return;
    setError("");
    let next: ModIntentSpec;
    try { next = compileStudioIntent(prompt, source); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); return; }
    setDraft("");
    setLastPrompt(prompt);
    setSpec(next);
    append("user", prompt);
    setWorking(true);
    try {
      if (desktop && connected) {
        const reply = await desktop.ai.chat({
          requestId: crypto.randomUUID(),
          model,
          instructions: buildModeratorInstructions(next) + "\nThis application is Madden NFL 27 PC exclusive. Never claim a plan is a built mod.",
          input: [{ role: "user", content: prompt }],
        });
        append("studio", reply.text || summary(next), "CHATGPT REASONING / LOCAL EVIDENCE GATES");
      } else {
        append("studio", summary(next), "DETERMINISTIC LOCAL COMPILER");
      }
    } catch (e) {
      append("studio", summary(next), "LOCAL FALLBACK");
      setError(`Model request failed; evidence compiler remained available. ${e instanceof Error ? e.message : String(e)}`);
    } finally { setWorking(false); }
  }

  async function selectSource() {
    if (!desktop) return;
    try {
      const picked = await desktop.files.pick();
      if (!picked) return;
      const selected = { name: picked.name, extension: picked.extension, size: picked.size, sha256: picked.sha256 };
      setSource(selected);
      if (lastPrompt) setSpec(compileStudioIntent(lastPrompt, selected));
      setError("");
    } catch (e) { setError(String(e)); }
  }

  async function importPlan() {
    if (!desktop) return;
    try {
      const result = await desktop.studio.importPlan();
      if (result) setInspection(`${result.name}: ${result.status} • ${result.sourceState} • ${result.sha256.slice(0, 16)}… No game runtime proof.`);
    } catch (e) { setError(String(e)); }
  }

  async function signIn() {
    if (!desktop) return;
    setWorking(true);
    try {
      const status = await desktop.auth.signIn();
      setAuth(status);
      if (status.planEnabled) {
        const available = await desktop.ai.models();
        setModel(available[0]?.slug ?? "");
      }
    } catch (e) { setError(`Sign-in unavailable: ${String(e)}`); }
    finally { setWorking(false); }
  }

  function exportPlan() {
    if (!spec) return;
    const plan = createStudioPlan(spec, source);
    const payload = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(payload);
    const a = document.createElement("a");
    a.href = href;
    a.download = "moderator-madden27-plan.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 2000);
  }

  function restart() {
    setMessages(initial);
    setDraft("");
    setLastPrompt("");
    setSpec(null);
    setInspection(null);
    setError("");
    promptRef.current?.focus();
  }

  return (
    <div className="m27-shell">
      <aside className="m27-rail" aria-label="Studio navigation">
        <div className="m27-brand"><span className="m27-brand-mark">M<span>27</span></span><div><strong>MODERATOR</strong><small>THE MOD STUDIO</small></div></div>
        <button className="m27-new" onClick={restart}><Plus size={17}/> New design session</button>
        <div className="m27-rail-heading">DESIGN LABS</div>
        {EXAMPLES.map((item, i) => (
          <button className="m27-template" key={item.title} onClick={() => { setDraft(item.prompt); promptRef.current?.focus(); }}>
            <span className="m27-template-index">0{i + 1}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span>
          </button>
        ))}
        <div className="m27-rail-footer"><ShieldCheck size={15}/> Madden NFL 27 • PC / offline<br/><span>Existing MODerator repository</span></div>
      </aside>

      <main className="m27-main">
        <header className="m27-top"><div className="m27-crumb">MOD STUDIO <span>/</span> WORKSPACE <span>/</span> MADDEN 27</div>
          <div className="m27-top-right"><span className="m27-pulse"/> {desktop ? "WINDOWS COMPANION DETECTED" : "BROWSER STUDIO"} <span className="m27-version">PHASE 1</span></div>
        </header>
        <div className="m27-conversation" aria-label="Design conversation">
          <div className="m27-conversation-width">
            <div className="m27-hero"><span className="m27-eyebrow">THE GRIDIRON IS YOURS TO REBUILD</span><h1>Your game.<br/><em>Your rules.</em></h1>
              <p>Describe a Madden 27 modification in plain English. The studio resolves capabilities and missing evidence before promising a build.</p>
              <div className="m27-hero-meta"><span><Layers3 size={14}/> Asset-first workflow</span><span><LockKeyhole size={14}/> Offline testing boundary</span></div>
            </div>
            <div className="m27-thread" role="log" aria-live="polite">
              {messages.map(m => <article className={`m27-message m27-${m.role}`} key={m.id}>
                <div className="m27-avatar">{m.role === "user" ? "YOU" : "M27"}</div>
                <div><div className="m27-msg-label">{m.role === "user" ? "YOUR REQUEST" : m.via || "MODERATOR"}</div><p>{m.text}</p></div>
              </article>)}
              {working && <div className="m27-working" role="status">Processing through Madden 27 evidence gates…</div>}
              <div ref={bottom}/>
            </div>
          </div>
        </div>
        <div className="m27-compose-wrap"><div className="m27-compose">
          <label className="m27-compose-label" htmlFor="m27-prompt"><Sparkles size={15}/> DESCRIBE YOUR MOD</label>
          <textarea id="m27-prompt" ref={promptRef} value={draft} maxLength={4000}
            onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); void submit(); }}}
            placeholder="e.g. Make my safety's visor smoke black and match his gloves to the alternate uniform…" rows={2}/>
          <div className="m27-mobile-tools"><button onClick={() => void selectSource()} disabled={!desktop}>Select local file</button><button onClick={exportPlan} disabled={!spec}>Download plan</button><button onClick={() => void importPlan()} disabled={!desktop}>Import plan</button></div>
          <div className="m27-compose-actions"><span>No game files are changed by a chat request · Ctrl+Enter to submit</span>
            <button className="m27-send" disabled={!draft.trim() || working} onClick={() => void submit()}><ArrowUp size={19}/><span>Analyze request</span></button>
          </div></div>
        </div>
      </main>

      <aside className="m27-inspector" aria-label="Build evidence and Windows companion">
        <div className="m27-inspector-head"><span>THE FILM ROOM</span><strong>BUILD INTELLIGENCE</strong><small>Every request gets an evidence trail.</small></div>
        <div className="m27-viewport" aria-label="Decorative schematic of a football field">
          <div className="m27-field"><div className="m27-yard m27-yard-a">20</div><div className="m27-yard m27-yard-b">30</div><div className="m27-yard m27-yard-c">40</div><div className="m27-formation">▲ <span>●</span> ▲</div></div>
          <div className="m27-field-caption">FIELD OVERVIEW <span>SCHEMATIC • NOT IN-GAME PREVIEW</span></div>
        </div>
        <section className="m27-inspector-section">
          <div className="m27-section-label">01 / BUILD READINESS</div>
          <div className="m27-status"><span className={`m27-status-light ${spec?.readiness === "READY_TO_BUILD" ? "ready" : ""}`}/>
            {spec?.readiness?.replace(/_/g, " ") ?? "AWAITING REQUEST"}</div>
          <p>{spec ? summary(spec) : "Enter a request to see relevant capabilities, evidence and verification requirements."}</p>
          <div className="m27-hard-stop"><AlertTriangle size={16}/> GAME ARTIFACT: NOT BUILT<br/>RUNTIME VERIFICATION: NOT RUN</div>
        </section>
        <section className="m27-inspector-section">
          <div className="m27-section-label">02 / SOURCE & COMPANION</div>
          <button className="m27-secondary" onClick={() => void selectSource()} disabled={!desktop}><FileUp size={16}/>{source ? "Change local source" : "Select local source"}</button>
          {source && <div className="m27-source">{source.name}<br/><small>SHA-256 {source.sha256.slice(0, 20)}… · {Math.ceil(source.size/1024)} KiB</small></div>}
          {!desktop && <p>To select and hash local game files, open this studio in MODerator Desktop. The browser cannot verify your PC game installation.</p>}
          <button className="m27-secondary" onClick={() => void importPlan()} disabled={!desktop}><FileSearch size={16}/> Inspect downloaded plan</button>
          {inspection && <p className="m27-inspection">{inspection}</p>}
          {spec && spec.missingInputs.length > 0 && <ul className="m27-missing">{spec.missingInputs.map(x => <li key={x}><HelpCircle size={13}/>{x}</li>)}</ul>}
        </section>
        <section className="m27-inspector-section">
          <div className="m27-section-label">03 / CAPABILITY BINDINGS</div>
          {spec ? Array.from(new Map(spec.effects.flatMap(e => e.matches.slice(0, 1)).map(m => [m.capability.id, m])).values()).slice(0, 4).map((m, i) =>
            <div className="m27-binding" key={i}><Cpu size={14}/><span><strong>{m.capability.id}</strong><small>{m.capability.evidence} · parity {m.parity}</small></span></div>)
            : <p>Nothing inferred without a request.</p>}
          <button className="m27-primary" onClick={exportPlan} disabled={!spec}><ArrowDownToLine size={16}/> Download evidence plan</button>
          <small className="m27-disclosure">Exports a JSON plan, not a .fbmod, installed asset, or playable modification.</small>
        </section>
        <div className="m27-inspector-bottom">
          <div className="m27-section-label">LOCAL REASONING</div>
          {connected ? <div className="m27-connected"><CheckCircle2 size={15}/> ChatGPT model: {model}</div> :
            desktop ? <button className="m27-secondary" onClick={() => void signIn()} disabled={working}><Sparkles size={16}/> Continue with ChatGPT</button> :
              <p>Deterministic evidence analysis available. Desktop sign-in required for model responses.</p>}
          {error && <p className="m27-error" role="alert">{error}</p>}
        </div>
      </aside>
    </div>
  );
}
