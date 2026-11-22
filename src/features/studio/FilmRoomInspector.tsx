import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  Cpu,
  FileSearch,
  FileUp,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import type { GridironSpecV2 } from "../../lib/grillMeFlow";
import type { StudioSource } from "../../lib/maddenStudio";
import type { ModIntentSpec } from "../../lib/modIntentCompiler";
import { FieldSchematic } from "./FieldSchematic";
import { DESIGN_LABS, summarizeReadiness } from "./types";

type FilmRoomInspectorProps = {
  spec: ModIntentSpec | null;
  gridSpec: GridironSpecV2 | null;
  source: StudioSource | null;
  inspection: string | null;
  error: string;
  working: boolean;
  desktop: ModeratorDesktopBridge | undefined;
  connected: boolean;
  model: string;
  inDrawer?: boolean;
  onSelectSource: () => void;
  onImportPlan: () => void;
  onExportPlan: () => void;
  onExportModSpecV2: () => void;
  onSignIn: () => void;
  onSelectTemplate?: (prompt: string) => void;
  onClose?: () => void;
};

export function FilmRoomInspector({
  spec, gridSpec, source, inspection, error, working, desktop, connected, model,
  inDrawer = false, onSelectSource, onImportPlan, onExportPlan, onExportModSpecV2,
  onSignIn, onSelectTemplate, onClose,
}: FilmRoomInspectorProps) {
  const bindings = spec
    ? Array.from(
        new Map(spec.effects.flatMap((e) => e.matches.slice(0, 1)).map((m) => [m.capability.id, m])).values()
      ).slice(0, 4)
    : [];

  return (
    <>
      <div className="m27-inspector-head">
        <div>
          <span>THE FILM ROOM</span>
          <strong>BUILD INTELLIGENCE</strong>
          <small>Every request gets an evidence trail.</small>
        </div>
        {inDrawer && onClose && (
          <button type="button" className="m27-drawer-close" onClick={onClose} aria-label="Close Film Room drawer">
            <X size={18} />
          </button>
        )}
      </div>

      {inDrawer && onSelectTemplate && (
        <section className="m27-inspector-section m27-drawer-labs">
          <div className="m27-section-label">00 / DESIGN LABS</div>
          <div className="m27-drawer-lab-list">
            {DESIGN_LABS.map((item, i) => (
              <button type="button" className="m27-template" key={item.title} onClick={() => onSelectTemplate(item.prompt)}>
                <span className="m27-template-index">0{i + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <FieldSchematic />

      <section className="m27-inspector-section">
        <div className="m27-section-label">01 / BUILD READINESS</div>
        <div className="m27-status">
          <span className={`m27-status-light ${spec?.readiness === "READY_TO_BUILD" ? "ready" : ""}`} />
          {spec?.readiness?.replace(/_/g, " ") ?? "AWAITING REQUEST"}
        </div>
        <p>{spec ? summarizeReadiness(spec) : "Enter a request to see relevant capabilities, evidence and verification requirements."}</p>
        <div className="m27-hard-stop">
          <AlertTriangle size={16} /> GAME ARTIFACT: NOT BUILT
          <br />
          RUNTIME VERIFICATION: NOT RUN
        </div>
      </section>

      <section className="m27-inspector-section">
        <div className="m27-section-label">02 / SOURCE &amp; COMPANION</div>
        <button type="button" className="m27-secondary" onClick={onSelectSource} disabled={!desktop}>
          <FileUp size={16} />
          {source ? "Change local source" : "Select local source"}
        </button>
        {source && (
          <div className="m27-source">
            {source.name}
            <br />
            <small>SHA-256 {source.sha256.slice(0, 20)}{"… · "}{Math.ceil(source.size / 1024)} KiB</small>
          </div>
        )}
        {!desktop && (
          <p>To select and hash local game files, open this studio in MODerator Desktop. The browser cannot verify your PC game installation.</p>
        )}
        <button type="button" className="m27-secondary" onClick={onImportPlan} disabled={!desktop}>
          <FileSearch size={16} /> Inspect downloaded plan
        </button>
        {inspection && <p className="m27-inspection">{inspection}</p>}
        {spec && spec.missingInputs.length > 0 && (
          <ul className="m27-missing">
            {spec.missingInputs.map((item) => (
              <li key={item}>
                <HelpCircle size={13} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="m27-inspector-section">
        <div className="m27-section-label">03 / CAPABILITY BINDINGS</div>
        {spec ? (
          bindings.map((m) => (
            <div className="m27-binding" key={m.capability.id}>
              <Cpu size={14} />
              <span>
                <strong>{m.capability.id}</strong>
                <small>{m.capability.evidence} {"·"} parity {m.parity}</small>
              </span>
            </div>
          ))
        ) : (
          <p>Nothing inferred without a request.</p>
        )}
        <button type="button" className="m27-primary" onClick={onExportPlan} disabled={!spec}>
          <ArrowDownToLine size={16} /> Download evidence plan
        </button>
        <button type="button" className="m27-secondary" onClick={onExportModSpecV2} disabled={!gridSpec}>
          <ArrowDownToLine size={16} /> Download Mod Spec v2
        </button>
        {gridSpec && <p className="m27-inspection">{gridSpec.id} {"·"} USER-CONFIRMED INTENT ONLY</p>}
        <small className="m27-disclosure">Exports a JSON plan, not a .fbmod, installed asset, or playable modification.</small>
      </section>

      <div className="m27-inspector-bottom">
        <div className="m27-section-label">LOCAL REASONING</div>
        {connected ? (
          <div className="m27-connected">
            <CheckCircle2 size={15} /> ChatGPT model: {model}
          </div>
        ) : desktop ? (
          <button type="button" className="m27-secondary" onClick={onSignIn} disabled={working}>
            <Sparkles size={16} /> Continue with ChatGPT
          </button>
        ) : (
          <p>Deterministic evidence analysis available. Desktop sign-in required for model responses.</p>
        )}
        {error && <p className="m27-error" role="alert">{error}</p>}
      </div>
    </>
  );
}
