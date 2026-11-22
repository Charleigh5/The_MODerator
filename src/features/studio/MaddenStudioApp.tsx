import ModIntelligenceLibrary from "../../components/ModIntelligenceLibrary";
import { FilmRoomInspector } from "./FilmRoomInspector";
import { StudioConversation } from "./StudioConversation";
import { StudioRail } from "./StudioRail";
import { useStudioSession } from "./useStudioSession";
import "./styles/studio-shell.css";
import "./styles/studio-conversation.css";
import "./styles/studio-composer.css";
import "./styles/studio-field.css";
import "./styles/studio-inspector.css";
import "./styles/studio-drawer.css";
import "./styles/studio-responsive.css";

export default function MaddenStudioApp() {
  const s = useStudioSession();

  const inspectorProps = {
    spec: s.spec,
    source: s.source,
    inspection: s.inspection,
    error: s.error,
    working: s.working,
    desktop: s.desktop,
    connected: s.connected,
    model: s.model,
    onSelectSource: () => void s.selectSource(),
    onImportPlan: () => void s.importPlan(),
    onExportPlan: s.exportPlan,
    onSignIn: () => void s.signIn(),
  };

  return (
    <div className="m27-shell">
      <StudioRail
        onRestart={s.restart}
        onOpenLibrary={() => s.setLibraryOpen(true)}
        onSelectTemplate={s.applyTemplate}
      />

      <StudioConversation
        desktop={s.desktop}
        messages={s.messages}
        draft={s.draft}
        working={s.working}
        spec={s.spec}
        inspectorOpen={s.inspectorOpen}
        bottomRef={s.bottomRef}
        promptRef={s.promptRef}
        onDraftChange={s.setDraft}
        onSubmit={() => void s.submit()}
        onSelectSource={() => void s.selectSource()}
        onExportPlan={s.exportPlan}
        onImportPlan={() => void s.importPlan()}
        onToggleInspector={() => s.setInspectorOpen((open) => !open)}
      />

      <aside className="m27-inspector" aria-label="Build evidence and Windows companion">
        <FilmRoomInspector {...inspectorProps} />
      </aside>

      {s.inspectorOpen && (
        <div
          className="m27-drawer-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) s.setInspectorOpen(false);
          }}
        >
          <aside
            id="m27-film-room-drawer"
            className="m27-inspector m27-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Film Room build intelligence and Design Labs"
          >
            <FilmRoomInspector
              {...inspectorProps}
              inDrawer
              onSelectTemplate={s.applyTemplate}
              onClose={() => s.setInspectorOpen(false)}
            />
          </aside>
        </div>
      )}

      {s.libraryOpen && (
        <ModIntelligenceLibrary
          onClose={() => s.setLibraryOpen(false)}
          onUse={s.applyInspiration}
        />
      )}
    </div>
  );
}
