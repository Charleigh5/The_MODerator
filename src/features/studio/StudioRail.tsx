import { BookOpen, Plus, ShieldCheck } from "lucide-react";
import { DESIGN_LABS } from "./types";

type StudioRailProps = {
  onRestart: () => void;
  onOpenLibrary: () => void;
  onSelectTemplate: (prompt: string) => void;
};

export function StudioRail({ onRestart, onOpenLibrary, onSelectTemplate }: StudioRailProps) {
  return (
    <aside className="m27-rail" aria-label="Studio navigation">
      <div className="m27-brand">
        <span className="m27-brand-mark">
          M<span>27</span>
        </span>
        <div>
          <strong>MODERATOR</strong>
          <small>THE MOD STUDIO</small>
        </div>
      </div>

      <button className="m27-new" type="button" onClick={onRestart}>
        <Plus size={17} /> New design session
      </button>

      <button className="m27-new m27-library-launch" type="button" onClick={onOpenLibrary}>
        <BookOpen size={17} /> Mod intelligence library
      </button>

      <div className="m27-rail-heading">DESIGN LABS</div>
      {DESIGN_LABS.map((item, i) => (
        <button
          className="m27-template"
          type="button"
          key={item.title}
          onClick={() => onSelectTemplate(item.prompt)}
        >
          <span className="m27-template-index">0{i + 1}</span>
          <span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </span>
        </button>
      ))}

      <div className="m27-rail-footer">
        <ShieldCheck size={15} /> Madden NFL 27 {"•"} PC / offline
        <br />
        <span>Existing MODerator repository</span>
      </div>
    </aside>
  );
}
