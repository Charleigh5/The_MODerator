import { useEffect, useRef, useState } from "react";
import type { ChatMsg, Phase, QAState } from "../types";
import { CATEGORIES } from "../lib/agentEngine";
import { IconBall, IconBolt, IconChevron, IconUpload, IconFile, IconDownload, IconPaperclip } from "./icons";
import { parseDocument } from "../lib/documentProcessor";
import { downloadReport } from "../lib/reportGenerator";
import type { ParsedDocument } from "../lib/documentProcessor";

const PHASE_STATUS: Record<Phase, string> = {
  idle: "chalk up a brief, coach",
  qa: "interrogation in progress",
  generating: "weaving vault patterns…",
  ready: "ready to ship · GO BLUE",
};

function Doodle() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-3 h-24 w-40 text-chalk/25"
      viewBox="0 0 160 96"
      fill="none"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <circle cx="26" cy="26" r="9" className="chalk-draw" stroke="currentColor" />
      <circle cx="26" cy="66" r="9" className="chalk-draw" stroke="currentColor" style={{ animationDelay: "0.3s" }} />
      <path d="M42 22 q 34 -12 56 6" className="chalk-draw" stroke="#ffcb05" strokeOpacity="0.6" style={{ animationDelay: "0.5s" }} />
      <path d="M98 28 l -8 -4 M98 28 l -9 3" className="chalk-draw" stroke="#ffcb05" strokeOpacity="0.6" style={{ animationDelay: "1.1s" }} />
      <path d="M42 66 q 40 10 74 -8" className="chalk-draw" stroke="currentColor" style={{ animationDelay: "0.8s" }} />
      <path d="M116 58 l -9 -2 M116 58 l -6 7" className="chalk-draw" stroke="currentColor" style={{ animationDelay: "1.4s" }} />
      <path d="M66 44 l 10 0 M71 39 l 0 10" className="chalk-draw" stroke="#ffcb05" strokeOpacity="0.5" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

function Msg({ m }: { m: ChatMsg }) {
  if (m.role === "user") {
    return (
      <div className="animate-rise flex justify-end pl-10">
        <div className="max-w-[88%] text-right">
          <div className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-maize-400/60">you · coach</div>
          <div className="chalk-text chalk-yellow whitespace-pre-wrap text-[22px] font-semibold leading-[1.18]">{m.text}</div>
        </div>
      </div>
    );
  }
  if (m.role === "sys") {
    return (
      <div className="animate-rise flex items-start gap-2 pr-10">
        <span className="mt-1 shrink-0 font-mono text-[10px] text-maize-400/70">▸</span>
        <span className="typewrite whitespace-pre-wrap text-[11px] leading-relaxed text-chalk/70">{m.text}</span>
        {m.tag && m.tag !== "learn" && (
          <span className="typewrite mt-px shrink-0 text-[9px] uppercase tracking-[0.2em] text-maize-400/60">[{m.tag}]</span>
        )}
      </div>
    );
  }
  return (
    <div className="animate-rise flex items-start gap-2.5 pr-8">
      <span className="mt-3 h-2 w-2 shrink-0 rotate-45 bg-maize-400 shadow-[0_0_8px_rgba(255,203,5,0.6)]" />
      <div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-chalk/45">
          CODEWRIGHT {m.tag ? `· ${m.tag}` : ""}
        </div>
        <div className="chalk-text whitespace-pre-wrap text-[21px] leading-[1.22]">{m.text}</div>
      </div>
    </div>
  );
}

export default function AgentChat({
  messages,
  phase,
  qa,
  onSend,
  onAnswer,
  onLock,
  busy,
}: {
  messages: ChatMsg[];
  phase: Phase;
  qa: QAState | null;
  onSend: (t: string) => void;
  onAnswer: (t: string) => void;
  onLock: (selected: string[]) => void;
  busy: boolean;
}) {
  const [val, setVal] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const cat = qa ? CATEGORIES.find((c) => c.id === qa.category) ?? null : null;
  const question = cat && qa && qa.index < cat.questions.length ? cat.questions[qa.index] : null;
  const showExpansions = phase === "qa" && !!qa && !qa.expLocked && !!cat;
  const showChips = phase === "qa" && !!qa && qa.expLocked && !!question;
  const thinking =
    busy || (messages.length > 0 && messages[messages.length - 1].role === "user" && phase === "qa");

  useEffect(() => {
    setSel([]);
  }, [qa?.brief, qa?.expLocked]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, phase, showExpansions, showChips]);

  const submit = () => {
    const t = val.trim();
    if (!t || busy) return;
    setVal("");
    if (showChips && question) onAnswer(t);
    else onSend(t);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    const doc = parseDocument(text);
    setParsedDoc(doc);
    
    // Send document summary to chat
    onSend(`📄 Uploaded: ${doc.title}\n\n${doc.summary}\n\nFound ${doc.features.length} features. Processing...`);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadReport = () => {
    if (parsedDoc) {
      downloadReport(parsedDoc);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const text = await file.text();
      const doc = parseDocument(text);
      setParsedDoc(doc);
      
      // Send document summary to chat
      onSend(`📄 Uploaded: ${doc.title}\n\n${doc.summary}\n\nFound ${doc.features.length} features. Processing...`);
    }
  };

  const status =
    phase === "qa" && qa
      ? qa.expLocked && question
        ? `Q&A · ${Math.min(qa.index + 1, cat!.questions.length)} of ${cat!.questions.length}`
        : "stretch ideas on the board"
      : PHASE_STATUS[phase];

  return (
    <section
      className="relative flex h-full min-h-0 flex-col animate-rise"
      style={{ animationDelay: "120ms" }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* stadium frame */}
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-[3px] border-maize-400/80 shadow-[0_0_0_3px_#00132a,0_0_50px_rgba(255,203,5,0.09),0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-[3px] z-20 pointer-events-none rounded-lg border border-maize-400/25" />
        
        {/* drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-sm animate-rise">
            <div className="text-center">
              <IconUpload className="h-16 w-16 mx-auto mb-4 text-maize-400 animate-pulse" />
              <div className="font-display text-2xl tracking-wider text-maize-400 mb-2">
                DROP YOUR SPECS
              </div>
              <div className="typewrite text-sm text-chalk/60">
                Release to upload requirements document
              </div>
            </div>
          </div>
        )}

        {/* jumbotron header */}
        <div className="flex items-center gap-3 border-b-[3px] border-maize-400/60 bg-navy-900 px-4 py-2.5">
          <span className="flex items-center gap-1.5 rounded-sm border border-maize-400/40 bg-navy-950 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-maize-300">
            <span className="h-1.5 w-1.5 rounded-full bg-maize-400 led-glow shadow-[0_0_8px_rgba(255,203,5,0.9)]" />
            live
          </span>
          <div className="leading-none">
            <div className="font-display text-[19px] tracking-[0.18em] text-maize-400" style={{ textShadow: "0 0 14px rgba(255,203,5,0.35)" }}>
              COACH'S JUMBOTRON
            </div>
            <div className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.26em] text-navy-400">
              agent CODEWRIGHT · Ann Arbor · NCAA '27
            </div>
          </div>
          <div className="chalk-text ml-auto hidden text-[19px] text-maize-200 sm:block">{status}</div>
        </div>

        {/* the blue board */}
        <div className="tex-board relative min-h-0 flex-1">
          <Doodle />
          <div ref={bodyRef} className="relative z-10 h-full space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <Msg key={m.id} m={m} />
            ))}

            {thinking && (
              <div className="flex items-center gap-2 pl-4">
                <span className="h-2 w-2 rotate-45 bg-maize-400/70" />
                <span className="chalk-text text-[20px] text-chalk/80">
                  <span className="typing-dot inline-block">·</span>
                  <span className="typing-dot inline-block" style={{ animationDelay: "0.15s" }}>·</span>
                  <span className="typing-dot inline-block" style={{ animationDelay: "0.3s" }}>·</span>
                </span>
              </div>
            )}

            {/* stretch ideas — expand the coach's idea */}
            {showExpansions && cat && (
              <div className="animate-rise ml-6 max-w-[92%] rounded-lg border-2 border-dashed border-maize-400/60 bg-navy-900/70 p-3.5 backdrop-blur-[1px]">
                <div className="flex items-center gap-2">
                  <IconBolt className="h-4 w-4 text-maize-400" />
                  <span className="font-display text-[13px] tracking-[0.18em] text-maize-300">STRETCH THE IDEA</span>
                  <span className="typewrite ml-auto text-[9px] uppercase tracking-[0.16em] text-chalk/50">pick any · wired as hot-reload extensions</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {cat.expansions.map((e) => {
                    const on = sel.includes(e);
                    return (
                      <button key={e} onClick={() => setSel((s) => (on ? s.filter((x) => x !== e) : [...s, e]))} className={`chalk-pill px-3 py-1 text-[17px] leading-tight ${on ? "chalk-pill-on" : ""}`}>
                        {on ? "✓ " : "+ "}
                        {e}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2.5">
                  <button
                    onClick={() => onLock(sel)}
                    className="stamp-btn bg-maize-400/10 px-4 py-1.5 text-[11px] font-bold text-maize-300"
                  >
                    {sel.length ? `LOCK ${sel.length} EXTRA${sel.length > 1 ? "S" : ""} & GRILL ME` : "GRILL ME"}
                    <IconChevron className="ml-1 inline h-3 w-3" />
                  </button>
                  {sel.length > 0 && (
                    <button onClick={() => onLock([])} className="typewrite text-[10px] uppercase tracking-[0.14em] text-chalk/55 underline decoration-dashed underline-offset-4 hover:text-chalk/85">
                      skip extras
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Q&A quick calls */}
            {showChips && question && (
              <div className="animate-rise ml-6 flex max-w-[92%] flex-wrap items-center gap-1.5">
                {question.chips.map((c) => (
                  <button key={c} onClick={() => onAnswer(c)} className={`chalk-pill px-3 py-1 text-[17px] leading-tight ${question.key === "sources" && c === "scout's choice" ? "border-maize-400/90 bg-maize-400/10" : ""}`}>
                    {c}
                  </button>
                ))}
                <span className="typewrite ml-1 text-[9px] uppercase tracking-[0.16em] text-chalk/45">or chalk your own below</span>
              </div>
            )}

            {phase === "ready" && (
              <div className="animate-rise ml-6 max-w-[92%] rounded-md border border-maize-400/40 bg-navy-900/70 px-3.5 py-2.5">
                <span className="chalk-text text-[19px] text-maize-200">
                  Bundle's on the desk. Build it, scrimmage it in the sandbox, or ship it — the right panel handles the rest.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* chalk tray */}
        <div className="shrink-0 border-t-[3px] border-maize-400/60 bg-wood-800 px-3 pb-2.5 pt-2 shadow-[inset_0_6px_12px_rgba(0,0,0,0.35)]">
          {/* document status indicator */}
          {parsedDoc && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-maize-400/30 bg-navy-900/50 px-3 py-1.5">
              <IconFile className="h-3.5 w-3.5 text-maize-400" />
              <span className="typewrite text-[10px] text-chalk/70">
                {parsedDoc.title}
              </span>
              <span className="typewrite ml-auto text-[9px] uppercase tracking-[0.16em] text-maize-400/60">
                {parsedDoc.features.length} features
              </span>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-1 rounded border border-maize-400/40 bg-navy-800 px-2 py-0.5 font-display text-[9px] tracking-[0.12em] text-maize-300 transition-all hover:border-maize-400/70 hover:bg-navy-700"
                title="Download detailed report"
              >
                <IconDownload className="h-3 w-3" />
                REPORT
              </button>
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 rounded-lg border-2 border-maize-400/40 bg-navy-900 px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-colors focus-within:border-maize-400/80"
          >
            <IconBall className="h-4 w-4 shrink-0 text-maize-400/70" />
            <input
              ref={inputRef}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder={
                showChips
                  ? `answer: ${question?.label.toLowerCase()}…`
                  : phase === "ready"
                    ? "call a new play, or open a fresh binder…"
                    : "tell CODEWRIGHT what NCAA 27 should do differently…"
              }
              className="chalk-text min-w-0 flex-1 bg-transparent text-[20px] text-chalk caret-maize-400 placeholder:text-chalk/35 focus:outline-none"
              spellCheck={false}
            />
            
            {/* paperclip button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <label
              htmlFor="doc-upload"
              className="group relative shrink-0 cursor-pointer"
              title="Attach requirements document"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-maize-400/40 bg-navy-800 text-maize-400/70 transition-all hover:border-maize-400/70 hover:bg-navy-700 hover:text-maize-400">
                <IconPaperclip className="h-4 w-4" />
              </div>
              {parsedDoc && (
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-maize-400 shadow-[0_0_6px_rgba(255,203,5,0.8)]" />
              )}
            </label>
            
            <button
              type="submit"
              disabled={!val.trim() || busy}
              className="shrink-0 rounded-md bg-maize-400 px-3.5 py-1.5 font-display text-[12px] tracking-[0.16em] text-navy-950 shadow-[0_3px_0_#8f7100] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_#8f7100] disabled:cursor-not-allowed disabled:opacity-35"
            >
              CHALK IT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
