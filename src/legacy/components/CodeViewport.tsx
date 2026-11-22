import { useState, useEffect } from 'react';
import { IconCode, IconFile } from './icons';

interface CodeViewportProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile: string;
  code: string;
  currentLine: number;
  modifiedLines: number[];
  isGenerating: boolean;
}

export default function CodeViewport({
  isOpen,
  onClose,
  activeFile,
  code,
  currentLine,
  modifiedLines,
  isGenerating,
}: CodeViewportProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [highlightedLine, setHighlightedLine] = useState<number>(0);

  useEffect(() => {
    if (!isGenerating) {
      setDisplayedLines(code.split('\n'));
      return;
    }

    // Animate code being written
    const lines = code.split('\n');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < lines.length) {
        setDisplayedLines(prev => [...prev, lines[currentIndex]]);
        setHighlightedLine(currentIndex);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [code, isGenerating]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 flex h-[600px] w-[700px] flex-col overflow-hidden rounded-xl border-2 border-maize-400 bg-navy-950 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-maize-400/30 bg-navy-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <IconCode className="h-5 w-5 text-maize-400" />
          <div>
            <h3 className="font-display text-sm tracking-wider text-maize-400">
              LIVE CODE VIEWPORT
            </h3>
            <div className="flex items-center gap-2 text-xs text-chalk/60">
              <IconFile className="h-3 w-3" />
              <span className="font-mono">{activeFile}</span>
              {isGenerating && (
                <span className="flex items-center gap-1 text-inkgreen">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inkgreen" />
                  Generating...
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-chalk/60 transition-colors hover:bg-chalk/10 hover:text-chalk"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto bg-navy-900/50 font-mono text-sm">
        <div className="min-h-full">
          {displayedLines.map((line, i) => {
            const isModified = modifiedLines.includes(i);
            const isCurrent = i === highlightedLine && isGenerating;
            const lineNumber = i + 1;

            return (
              <div
                key={i}
                className={`flex transition-all duration-300 ${
                  isCurrent ? 'bg-maize-400/20' : isModified ? 'bg-inkgreen/10' : ''
                }`}
              >
                {/* Line Number */}
                <div className="w-12 shrink-0 border-r border-maize-400/20 bg-navy-900/80 px-2 py-0.5 text-right text-xs text-chalk/40">
                  {lineNumber}
                </div>

                {/* Code */}
                <div className="flex-1 px-4 py-0.5">
                  <pre className="whitespace-pre-wrap text-chalk/90">
                    {highlightSyntax(line)}
                  </pre>
                </div>

                {/* Modified Indicator */}
                {isModified && (
                  <div className="flex w-6 items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-inkgreen" />
                  </div>
                )}

                {/* Current Line Indicator */}
                {isCurrent && (
                  <div className="flex w-6 items-center justify-center">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-maize-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between border-t-2 border-maize-400/30 bg-navy-900 px-4 py-2 text-xs text-chalk/60">
        <div className="flex items-center gap-4">
          <span>Lines: {displayedLines.length}</span>
          <span>Modified: {modifiedLines.length}</span>
          {currentLine > 0 && <span>Current: {currentLine}</span>}
        </div>
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <span className="flex items-center gap-1 text-inkgreen">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inkgreen" />
              Active
            </span>
          ) : (
            <span className="text-chalk/40">Idle</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple syntax highlighting
function highlightSyntax(line: string): JSX.Element {
  // Keywords
  const keywords = ['function', 'return', 'if', 'else', 'for', 'while', 'const', 'let', 'var', 'import', 'export'];
  
  // Check for comments
  if (line.trim().startsWith('//')) {
    return <span className="text-chalk/50 italic">{line}</span>;
  }

  // Check for strings
  if (line.includes('"') || line.includes("'")) {
    const parts = line.split(/(["'][^"']*["'])/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('"') || part.startsWith("'")) {
            return <span key={i} className="text-inkgreen">{part}</span>;
          }
          // Check for keywords in non-string parts
          const words = part.split(/(\s+)/);
          return (
            <span key={i}>
              {words.map((word, j) => {
                if (keywords.includes(word)) {
                  return <span key={j} className="text-maize-400">{word}</span>;
                }
                return <span key={j}>{word}</span>;
              })}
            </span>
          );
        })}
      </>
    );
  }

  // Check for keywords
  const words = line.split(/(\s+)/);
  return (
    <>
      {words.map((word, i) => {
        if (keywords.includes(word)) {
          return <span key={i} className="text-maize-400">{word}</span>;
        }
        return <span key={i}>{word}</span>;
      })}
    </>
  );
}
