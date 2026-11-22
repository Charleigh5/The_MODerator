import { useEffect, useRef, useState } from "react";
import { buildModeratorInstructions } from "../../lib/aiOrchestrator";
import { compileStudioIntent, createStudioPlan, type StudioSource } from "../../lib/maddenStudio";
import type { ModIntentSpec } from "../../lib/modIntentCompiler";
import type { ModCatalogEntry } from "../../data/modIntelligence";
import { GREETING, summarizeReadiness, type Message } from "./types";

const INITIAL_MESSAGES: Message[] = [GREETING];

function downloadPlanFile(spec: ModIntentSpec, source: StudioSource | null) {
  const plan = createStudioPlan(spec, source);
  const payload = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
  const href = URL.createObjectURL(payload);
  const link = document.createElement("a");
  link.href = href;
  link.download = "moderator-madden27-plan.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 2000);
}

export function useStudioSession() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [spec, setSpec] = useState<ModIntentSpec | null>(null);
  const [source, setSource] = useState<StudioSource | null>(null);
  const [inspection, setInspection] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [auth, setAuth] = useState<ChatGPTAuthStatus | null>(null);
  const [model, setModel] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const desktop = typeof window !== "undefined" ? window.moderatorDesktop : undefined;
  const connected = Boolean(auth?.connected && auth?.planEnabled && model);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, spec]);

  useEffect(() => {
    if (!desktop) return;
    desktop.auth
      .status()
      .then(async (status) => {
        setAuth(status);
        if (status.planEnabled) {
          const available = await desktop.ai.models();
          setModel(available[0]?.slug ?? "");
        }
      })
      .catch(() => setAuth(null));
  }, [desktop]);

  useEffect(() => {
    if (!inspectorOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectorOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [inspectorOpen]);

  const append = (role: Message["role"], text: string, via?: string) =>
    setMessages((prev) => [...prev, { id: nextId.current++, role, text, via }]);

  async function submit(text = draft) {
    const prompt = text.trim();
    if (!prompt || working) return;
    setError("");
    let next: ModIntentSpec;
    try {
      next = compileStudioIntent(prompt, source);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }
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
          instructions:
            buildModeratorInstructions(next) +
            "\nThis application is Madden NFL 27 PC exclusive. Never claim a plan is a built mod.",
          input: [{ role: "user", content: prompt }],
        });
        append("studio", reply.text || summarizeReadiness(next), "CHATGPT REASONING / LOCAL EVIDENCE GATES");
      } else {
        append("studio", summarizeReadiness(next), "DETERMINISTIC LOCAL COMPILER");
      }
    } catch (e) {
      append("studio", summarizeReadiness(next), "LOCAL FALLBACK");
      setError(`Model request failed; evidence compiler remained available. ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setWorking(false);
    }
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
    } catch (e) {
      setError(String(e));
    }
  }

  async function importPlan() {
    if (!desktop) return;
    try {
      const result = await desktop.studio.importPlan();
      if (result) {
        setInspection(`${result.name}: ${result.status} • ${result.sourceState} • ${result.sha256.slice(0, 16)}… No game runtime proof.`);
      }
    } catch (e) {
      setError(String(e));
    }
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
    } catch (e) {
      setError(`Sign-in unavailable: ${String(e)}`);
    } finally {
      setWorking(false);
    }
  }

  const exportPlan = () => {
    if (spec) downloadPlanFile(spec, source);
  };

  function applyTemplate(prompt: string) {
    setDraft(prompt);
    setInspectorOpen(false);
    promptRef.current?.focus();
  }

  function applyInspiration(item: ModCatalogEntry) {
    setDraft(
      `Madden 27: I want to design an original modification inspired by ${item.category.toLowerCase()} functionality: ${item.description} Do not assume the reference mod is licensed, compatible, or reusable.`
    );
    setLibraryOpen(false);
    promptRef.current?.focus();
  }

  function restart() {
    setMessages(INITIAL_MESSAGES);
    setDraft("");
    setLastPrompt("");
    setSpec(null);
    setInspection(null);
    setError("");
    setInspectorOpen(false);
    promptRef.current?.focus();
  }

  return {
    messages, draft, setDraft, libraryOpen, setLibraryOpen, inspectorOpen, setInspectorOpen,
    spec, source, inspection, error, working, desktop, connected, model, bottomRef, promptRef,
    submit, selectSource, importPlan, signIn, exportPlan, applyTemplate, applyInspiration, restart,
  };
}
