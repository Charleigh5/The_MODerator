import { useEffect, useState } from 'react';

interface DemoCursorProps {
  active: boolean;
  position: { x: number; y: number } | null;
}

export default function DemoCursor({ active, position }: DemoCursorProps) {
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (position && active) {
      // Smooth animation to target position
      const animate = () => {
        setCurrentPos(prev => {
          const dx = position.x - prev.x;
          const dy = position.y - prev.y;
          const speed = 0.15;
          
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            return position;
          }
          
          return {
            x: prev.x + dx * speed,
            y: prev.y + dy * speed
          };
        });
      };
      
      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [position, active]);

  if (!active || !position) return null;

  return (
    <>
      {/* Custom cursor with glow */}
      <div
        className="pointer-events-none fixed z-[9999] transition-transform duration-100"
        style={{
          left: `${currentPos.x}px`,
          top: `${currentPos.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 -m-4 rounded-full bg-maize-400/30 blur-xl animate-pulse" />
        <div className="absolute inset-0 -m-2 rounded-full bg-maize-400/50 blur-md" />
        
        {/* Cursor icon */}
        <div className="relative">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 3L19 12L12 13L9 20L5 3Z" 
              fill="#FFCB05" 
              stroke="#001830" 
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Click ripple effect */}
      {position && (
        <div
          className="pointer-events-none fixed z-[9998]"
          style={{
            left: `${currentPos.x}px`,
            top: `${currentPos.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="h-8 w-8 rounded-full border-2 border-maize-400/60 animate-ping" />
        </div>
      )}
    </>
  );
}
