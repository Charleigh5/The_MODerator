interface DemoTooltipProps {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  visible: boolean;
  targetRect?: DOMRect;
}

export default function DemoTooltip({ text, position, visible, targetRect }: DemoTooltipProps) {
  if (!visible || !targetRect) return null;

  const getTooltipStyle = () => {
    const offset = 16;
    let style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9997,
      maxWidth: '300px',
    };

    switch (position) {
      case 'top':
        style = {
          ...style,
          left: `${targetRect.left + targetRect.width / 2}px`,
          top: `${targetRect.top - offset}px`,
          transform: 'translate(-50%, -100%)',
        };
        break;
      case 'bottom':
        style = {
          ...style,
          left: `${targetRect.left + targetRect.width / 2}px`,
          top: `${targetRect.bottom + offset}px`,
          transform: 'translateX(-50%)',
        };
        break;
      case 'left':
        style = {
          ...style,
          left: `${targetRect.left - offset}px`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: 'translate(-100%, -50%)',
        };
        break;
      case 'right':
        style = {
          ...style,
          left: `${targetRect.right + offset}px`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: 'translateY(-50%)',
        };
        break;
    }

    return style;
  };

  const getArrowStyle = () => {
    const arrowSize = 8;
    let style: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
    };

    switch (position) {
      case 'top':
        style = {
          ...style,
          bottom: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid #FFCB05`,
        };
        break;
      case 'bottom':
        style = {
          ...style,
          top: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid #FFCB05`,
        };
        break;
      case 'left':
        style = {
          ...style,
          right: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid #FFCB05`,
        };
        break;
      case 'right':
        style = {
          ...style,
          left: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid #FFCB05`,
        };
        break;
    }

    return style;
  };

  return (
    <div style={getTooltipStyle()} className="animate-fade-in">
      <div className="relative rounded-lg bg-maize-400 px-4 py-3 shadow-lg">
        <div className="text-sm font-medium text-navy-950">
          {text}
        </div>
        <div style={getArrowStyle()} />
      </div>
    </div>
  );
}
