import { useMemo, type ReactNode } from "react";

type Lang = "json" | "lua" | "xml";

const CLS = {
  key: "text-ice-300",
  str: "text-turf-300",
  num: "text-gold-300",
  kw: "text-blaze-400",
  com: "text-fog italic",
  tag: "text-blaze-400",
  attr: "text-ice-300",
  plain: "text-[#cfe3d6]",
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
    let cls = CLS.plain;
    if (lang === "json") {
      if (m[1]) cls = CLS.com;
      else if (m[2] && m[3]) cls = CLS.key;
      else if (m[2]) cls = CLS.str;
      else if (m[4]) cls = CLS.kw;
      else if (m[5]) cls = CLS.num;
    } else if (lang === "lua") {
      if (m[1]) cls = CLS.com;
      else if (m[2]) cls = CLS.str;
      else if (m[3]) cls = CLS.kw;
      else if (m[4]) cls = CLS.num;
    } else {
      if (m[1] || m[2]) cls = CLS.com;
      else if (m[3]) cls = CLS.tag;
      else if (m[4]) cls = CLS.attr;
      else if (m[5]) cls = CLS.str;
      else if (m[6]) cls = CLS.tag;
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
}: {
  code: string;
  lang: Lang;
  className?: string;
  startAt?: number;
}) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <pre
      className={`font-mono text-[11.5px] leading-[1.62] overflow-x-auto whitespace-pre ${className}`}
    >
      {lines.map((ln, i) => (
        <div key={i} className="flex min-w-max hover:bg-pine-800/60">
          <span className="w-9 shrink-0 select-none pr-3 text-right text-fog/70">
            {i + startAt}
          </span>
          <span className="pr-6">{renderLine(ln, lang)}</span>
        </div>
      ))}
    </pre>
  );
}
