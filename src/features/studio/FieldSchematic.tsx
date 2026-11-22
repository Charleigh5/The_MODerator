export function FieldSchematic() {
  return (
    <div className="m27-viewport" aria-label="Decorative schematic of a football field">
      <div className="m27-field" aria-hidden="true">
        <div className="m27-yard m27-yard-a">20</div>
        <div className="m27-yard m27-yard-b">30</div>
        <div className="m27-yard m27-yard-c">40</div>
        <div className="m27-formation">
          {"▲"} <span>{"●"}</span> {"▲"}
        </div>
      </div>
      <div className="m27-field-caption">
        FIELD OVERVIEW <span>SCHEMATIC {"•"} NOT IN-GAME PREVIEW</span>
      </div>
    </div>
  );
}
