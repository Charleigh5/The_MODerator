import { useMemo, type ReactNode } from "react";

type Lang = "json" | "lua" | "xml";

const PAPER = {
  key: "text-inkblue",
  str: "text-inkgreen",
  num: "text-inkgold",
  kw: "text-inkred",
  com: "text-[#8b8578] italic",
  tag: "text-inkred",
  attr: "text-inkblue",
  plain: "text-[#3a362c]",
};

const RX: Record<Lang, RegExp> = {
  json: /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g,
  lua: /(--[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(local|function|end|if|then|else|elseif|return|for|in|do|while|not|and|or|nil|true|false|break|require)\b|(\b\d+(?:\.\d+)?\b)/g,
  xml: /(<!--[\s\S]*?-->)|(<!--)|(<\/?[?A-Za-z][\w:.-]*)|([A-Za-z_][\w:.-]*)(?==)|("[^"]*")|(\/?>|<\?xml)/g,
};

function renderLine(line: string, lang: Lang): ReactNode[] {
  const rx = new RegExp(RX[lang].source, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(line)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{line.slice(last, m.index)}</span>);
    let cls = PAPER.plain;
    if (lang === "json") {
      if (m[1]) cls = PAPER.com;
      else if (m[2] && m[3]) cls = PAPER.key;
      else if (m[2]) cls = PAPER.str;
      else if (m[4]) cls = PAPER.kw;
      else if (m[5]) cls = PAPER.num;
    } else if (lang === "lua") {
      if (m[1]) cls = PAPER.com;
      else if (m[2]) cls = PAPER.str;
      else if (m[3]) cls = PAPER.kw;
      else if (m[4]) cls = PAPER.num;
    } else {
      if (m[1] || m[2]) cls = PAPER.com;
      else if (m[3]) cls = PAPER.tag;
      else if (m[4]) cls = PAPER.attr;
      else if (m[5]) cls = PAPER.str;
      else if (m[6]) cls = PAPER.tag;
    }
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
    if (m[0].length === 0) rx.lastIndex++;
  }
  if (last < line.length) out.push(<span key={k++}>{line.slice(last)}</span>);
  return out;
}

export default function CodeView({
  code,
  lang,
  className = "",
  startAt = 1,
  dense = false,
}: {
  code: string;
  lang: Lang;
  className?: string;
  startAt?: number;
  dense?: boolean;
}) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <pre
      className={`font-mono ${dense ? "text-[10px] leading-[1.55]" : "text-[11.5px] leading-[1.62]"} overflow-x-auto whitespace-pre ${className}`}
    >
      {lines.map((ln, i) => (
        <div key={i} className="flex min-w-max rounded-sm hover:bg-[rgba(90,70,30,0.07)]">
          <span className="w-8 shrink-0 select-none pr-2.5 text-right text-[#a49a82]">
            {i + startAt}
          </span>
          <span className="pr-6">{renderLine(ln, lang)}</span>
        </div>
      ))}
    </pre>
  );
}
