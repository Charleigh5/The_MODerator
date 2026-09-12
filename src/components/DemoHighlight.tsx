interface DemoHighlightProps {
  targetRect: DOMRect | null;
  visible: boolean;
}

export default function DemoHighlight({ targetRect, visible }: DemoHighlightProps) {
  if (!visible || !targetRect) return null;

  return (
    <>
      {/* Dark overlay with cutout */}
      <div className="pointer-events-none fixed inset-0 z-[9995]">
        <svg className="h-full w-full">
          <defs>
            <mask id="highlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.6)"
            mask="url(#highlight-mask)"
          />
        </svg>
      </div>

      {/* Highlight border with glow */}
      <div
        className="pointer-events-none fixed z-[9996] animate-pulse"
        style={{
          left: `${targetRect.left - 8}px`,
          top: `${targetRect.top - 8}px`,
          width: `${targetRect.width + 16}px`,
          height: `${targetRect.height + 16}px`,
        }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-xl bg-maize-400/30 blur-lg" />
        {/* Border */}
        <div className="absolute inset-0 rounded-xl border-4 border-maize-400 shadow-[0_0_20px_rgba(255,203,5,0.6)]" />
      </div>
    </>
  );
}
