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

function TypingIndicator() {
  return (
    <div className="message-enter flex items-start gap-3 pr-8">
      <span className="mt-4 h-2.5 w-2.5 shrink-0 rotate-45 bg-maize-400/60 shadow-[0_0_10px_rgba(255,203,5,0.5)]" />
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.15em] text-chalk/60 mb-1.5 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
          CODEWRIGHT
        </div>
        <div className="flex items-center gap-2">
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-chalk/60" style={{ animationDelay: '0s' }} />
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-chalk/60" style={{ animationDelay: '0.2s' }} />
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-chalk/60" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}

function Msg({ m, isTyping = false }: { m: ChatMsg; isTyping?: boolean }) {
  if (m.role === "user") {
    return (
      <div className="message-enter flex justify-end pl-10">
        <div className="max-w-[90%] text-right">
          <div className="text-xs uppercase tracking-[0.15em] text-maize-400/70 mb-1 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>you · coach</div>
          <div className="whitespace-pre-wrap text-[22px] font-medium leading-[1.5] text-maize-300" style={{ fontFamily: 'Inter, sans-serif' }}>
            {m.text}
          </div>
        </div>
      </div>
    );
  }
  if (m.role === "sys") {
    return (
      <div className="message-enter flex items-start gap-3 pr-10">
        <span className="mt-1.5 shrink-0 font-mono text-sm text-maize-400/80">▸</span>
        <div className="flex-1">
          <span className="whitespace-pre-wrap text-[15px] leading-[1.6] text-chalk/90" style={{ fontFamily: 'Inter, sans-serif' }}>
            {m.text}
          </span>
          {m.tag && m.tag !== "learn" && (
            <span className="font-mono ml-2 inline-block text-xs uppercase tracking-[0.15em] text-maize-400/70">[{m.tag}]</span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="message-enter flex items-start gap-3 pr-8">
      <span className={`mt-4 h-2.5 w-2.5 shrink-0 rotate-45 shadow-[0_0_10px_rgba(255,203,5,0.7)] transition-all duration-500 ${
                        isTyping ? 'bg-maize-400/60' : 'bg-maize-400'
                      }`} />
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.15em] text-chalk/60 mb-1.5 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
          CODEWRIGHT {m.tag ? `· ${m.tag}` : ""}
        </div>
        <div className={`whitespace-pre-wrap text-[19px] font-medium leading-[1.55] text-chalk transition-all duration-500 ${
                          isTyping ? 'opacity-80' : 'opacity-100'
                        }`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {m.text}
          {isTyping && <span className="typing-cursor inline-block ml-1">▊</span>}
        </div>
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
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);
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

  // Show typing indicator for new agent messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "agent") {
      setTypingMessageId(lastMsg.id);
      
      // Remove typing indicator after a brief delay to simulate natural typing
      const timer = setTimeout(() => {
        setTypingMessageId(null);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

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
              <Msg key={m.id} m={m} isTyping={typingMessageId === m.id} />
            ))}

            {thinking && <TypingIndicator />}

            {/* stretch ideas — expand the coach's idea */}
            {showExpansions && cat && qa && (
              <div data-demo-id="stretch-ideas" className="animate-rise ml-6 max-w-[92%] rounded-lg border-2 border-dashed border-maize-400/60 bg-navy-900/70 p-4 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 mb-3">
                  <IconBolt className="h-5 w-5 text-maize-400" />
                  <span className="font-body text-sm font-semibold tracking-wide text-maize-300">STRETCH THE IDEA</span>
                  <span className="font-body ml-auto text-xs text-chalk/60">pick any · wired as hot-reload extensions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qa.expansions.map((e, idx) => {
                    const on = sel.includes(e);
                    return (
                      <button key={e} data-demo-id={`stretch-idea-${idx + 1}`} onClick={() => setSel((s) => (on ? s.filter((x) => x !== e) : [...s, e]))} className={`chalk-pill ${on ? "chalk-pill-on" : ""}`}>
                        {on ? "✓ " : "+ "}
                        {e}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    data-demo-id="lock-button"
                    onClick={() => onLock(sel)}
                    className="stamp-btn bg-maize-400/10 px-5 py-2 text-sm font-bold text-maize-300"
                  >
                    {sel.length ? `LOCK ${sel.length} EXTRA${sel.length > 1 ? "S" : ""} & GRILL ME` : "GRILL ME"}
                    <IconChevron className="ml-1 inline h-4 w-4" />
                  </button>
                  {sel.length > 0 && (
                    <button onClick={() => onLock([])} className="font-body text-sm text-chalk/60 underline decoration-dashed underline-offset-4 hover:text-chalk/90 transition-colors">
                      skip extras
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Q&A quick calls */}
            {showChips && question && (
              <div className="animate-rise ml-6 flex max-w-[92%] flex-wrap items-center gap-2">
                {question.chips.map((c, idx) => (
                  <button key={c} data-demo-id={`qa-chip-${idx + 1}`} onClick={() => onAnswer(c)} className={`chalk-pill ${question.key === "sources" && c === "scout's choice" ? "border-maize-400/90 bg-maize-400/10" : ""}`}>
                    {c}
                  </button>
                ))}
                <span className="font-body ml-2 text-sm text-chalk/60">or chalk your own below</span>
              </div>
            )}

            {phase === "ready" && (
              <div className="animate-rise ml-6 max-w-[92%] rounded-md border border-maize-400/40 bg-navy-900/70 px-4 py-3">
                <span className="chalk-text text-lg text-maize-200 leading-relaxed">
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
            <div className="mb-2 flex items-center gap-3 rounded-md border border-maize-400/30 bg-navy-900/50 px-3 py-2">
              <IconFile className="h-4 w-4 text-maize-400" />
              <span className="font-body text-sm text-chalk/80 font-medium">
                {parsedDoc.title}
              </span>
              <span className="font-body ml-auto text-xs text-maize-400/70 font-semibold">
                {parsedDoc.features.length} features
              </span>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 rounded border border-maize-400/40 bg-navy-800 px-3 py-1 font-body text-xs font-semibold text-maize-300 transition-all hover:border-maize-400/70 hover:bg-navy-700"
                title="Download detailed report"
              >
                <IconDownload className="h-3.5 w-3.5" />
                REPORT
              </button>
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-3 rounded-lg border-2 border-maize-400/40 bg-navy-900 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-colors focus-within:border-maize-400/80"
          >
            <IconBall className="h-5 w-5 shrink-0 text-maize-400/70" />
            <input
              ref={inputRef}
              data-demo-id="chat-input"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder={
                showChips
                  ? `answer: ${question?.label.toLowerCase()}…`
                  : phase === "ready"
                    ? "call a new play, or open a fresh binder…"
                    : "tell CODEWRIGHT what NCAA 27 should do differently…"
              }
              className="min-w-0 flex-1 bg-transparent text-lg text-chalk caret-maize-400 placeholder:text-chalk/40 focus:outline-none font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-maize-400/40 bg-navy-800 text-maize-400/70 transition-all hover:border-maize-400/70 hover:bg-navy-700 hover:text-maize-400">
                <IconPaperclip className="h-5 w-5" />
              </div>
              {parsedDoc && (
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-maize-400 shadow-[0_0_8px_rgba(255,203,5,0.9)]" />
              )}
            </label>
            
            <button
              type="submit"
              data-demo-id="chalk-it-button"
              disabled={!val.trim() || busy}
              className="shrink-0 rounded-md bg-maize-400 px-5 py-2 font-body text-sm font-bold tracking-wide text-navy-950 shadow-[0_3px_0_#8f7100] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_#8f7100] disabled:cursor-not-allowed disabled:opacity-35"
            >
              CHALK IT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
