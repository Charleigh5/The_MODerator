import type { RefObject } from "react";
import { ArrowUp, Layers3, LockKeyhole, SlidersHorizontal, Sparkles } from "lucide-react";
import Football22Board from "../../components/Football22Board";
import GrillMePanel from "../../components/GrillMePanel";
import type { GridironSpecV2, OptionId, Session } from "../../lib/grillMeFlow";
import type { ModIntentSpec } from "../../lib/modIntentCompiler";
import type { Message } from "./types";

type StudioConversationProps = {
  desktop: ModeratorDesktopBridge | undefined;
  messages: Message[];
  draft: string;
  working: boolean;
  spec: ModIntentSpec | null;
  grill: Session | null;
  gridSpec: GridironSpecV2 | null;
  inspectorOpen: boolean;
  bottomRef: RefObject<HTMLDivElement>;
  promptRef: RefObject<HTMLTextAreaElement>;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  onSelectSource: () => void;
  onExportPlan: () => void;
  onExportModSpecV2: () => void;
  onImportPlan: () => void;
  onChooseDecision: (option: OptionId, detail?: string) => void;
  onBackGrillRound: () => void;
  onConfirmDecisionTree: () => void;
  onToggleInspector: () => void;
};

export function StudioConversation({
  desktop, messages, draft, working, spec, grill, gridSpec, inspectorOpen,
  bottomRef, promptRef, onDraftChange, onSubmit, onSelectSource, onExportPlan,
  onExportModSpecV2, onImportPlan, onChooseDecision, onBackGrillRound,
  onConfirmDecisionTree, onToggleInspector,
}: StudioConversationProps) {
  const ready = spec?.readiness === "READY_TO_BUILD";

  return (
    <main className="m27-main">
      <header className="m27-top">
        <div className="m27-crumb">
          MOD STUDIO <span aria-hidden="true">/</span> WORKSPACE <span aria-hidden="true">/</span> MADDEN 27
        </div>
        <div className="m27-top-right">
          <span className="m27-env-status">
            <span className="m27-pulse" />
            {desktop ? "WINDOWS COMPANION DETECTED" : "BROWSER STUDIO"}
            <span className="m27-version">RESEARCH LAB</span>
          </span>
          <button
            type="button"
            className="m27-drawer-toggle"
            aria-expanded={inspectorOpen}
            aria-controls="m27-film-room-drawer"
            onClick={onToggleInspector}
          >
            <span className={`m27-status-light ${ready ? "ready" : ""}`} aria-hidden="true" />
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Film Room</span>
          </button>
        </div>
      </header>

      <div className="m27-conversation" aria-label="Design conversation">
        <div className="m27-conversation-width">
          <div className="m27-hero">
            <span className="m27-eyebrow">THE GRIDIRON IS YOURS TO REBUILD</span>
            <h1>
              Your game.
              <br />
              <em>Your rules.</em>
            </h1>
            <p>
              Describe a Madden 27 modification in plain English. The studio resolves capabilities and
              missing evidence before promising a build.
            </p>
            <div className="m27-hero-meta">
              <span>
                <Layers3 size={14} /> Asset-first workflow
              </span>
              <span>
                <LockKeyhole size={14} /> Offline testing boundary
              </span>
            </div>
          </div>

          <div className="m27-thread" role="log" aria-live="polite">
            {messages.map((m) => (
              <article className={`m27-message m27-${m.role}`} key={m.id}>
                <div className="m27-avatar">{m.role === "user" ? "YOU" : "M27"}</div>
                <div>
                  <div className="m27-msg-label">{m.role === "user" ? "YOUR REQUEST" : m.via || "MODERATOR"}</div>
                  <p>{m.text}</p>
                </div>
              </article>
            ))}
            {grill && (
              <GrillMePanel
                session={grill}
                brief={gridSpec}
                onChoose={onChooseDecision}
                onBack={onBackGrillRound}
                onConfirm={onConfirmDecisionTree}
              />
            )}
            {grill?.positionGroup && grill.positionGroup !== "SPECIAL_TEAMS" && (
              <Football22Board focusGroup={grill.positionGroup} />
            )}
            {working && (
              <div className="m27-working" role="status">
                Processing through Madden 27 evidence gates{"…"}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="m27-compose-wrap">
        <div className="m27-compose">
          <label className="m27-compose-label" htmlFor="m27-prompt">
            <Sparkles size={15} /> DESCRIBE YOUR MOD
          </label>
          <textarea
            id="m27-prompt"
            ref={promptRef}
            value={draft}
            maxLength={4000}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={"e.g. Make my safety's visor smoke black and match his gloves to the alternate uniform…"}
            rows={2}
          />
          <div className="m27-mobile-tools">
            <button type="button" onClick={onToggleInspector}>
              Film Room &amp; Labs
            </button>
            <button type="button" onClick={onExportPlan} disabled={!spec}>
              Download plan
            </button>
            <button type="button" onClick={onExportModSpecV2} disabled={!gridSpec}>
              Download Mod Spec v2
            </button>
            <button type="button" onClick={onSelectSource} disabled={!desktop}>
              Local source
            </button>
            <button type="button" onClick={onImportPlan} disabled={!desktop}>
              Import plan
            </button>
          </div>
          <div className="m27-compose-actions">
            <span>No game files are changed by a chat request {"·"} Ctrl+Enter to submit</span>
            <button
              type="button"
              className="m27-send"
              disabled={!draft.trim() || working}
              onClick={onSubmit}
            >
              <ArrowUp size={19} />
              <span>Analyze request</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
