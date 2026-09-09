import { useState, useEffect, useCallback } from 'react';
import { DEMO_STEPS, type DemoState } from '../lib/demoEngine';
import DemoCursor from './DemoCursor';
import DemoTooltip from './DemoTooltip';
import DemoHighlight from './DemoHighlight';

interface DemoControllerProps {
  active: boolean;
  onComplete: () => void;
  onStepChange: (step: number) => void;
}

export default function DemoController({ active, onComplete, onStepChange }: DemoControllerProps) {
  const [state, setState] = useState<DemoState>({
    active: false,
    currentStep: 0,
    steps: DEMO_STEPS,
    highlightedSection: null,
    cursorPosition: null,
    showCursor: false,
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = useCallback((targetId: string) => {
    const element = document.querySelector(`[data-demo-id="${targetId}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      return rect;
    }
    return null;
  }, []);

  const executeStep = useCallback(async (stepIndex: number) => {
    if (stepIndex >= DEMO_STEPS.length) {
      onComplete();
      return;
    }

    const step = DEMO_STEPS[stepIndex];
    onStepChange(stepIndex);

    // Update target rect if needed
    if (step.target) {
      const rect = updateTargetRect(step.target);
      if (rect) {
        setState(prev => ({
          ...prev,
          highlightedSection: step.target!,
          cursorPosition: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
          showCursor: step.action === 'click' || step.action === 'type',
        }));
      }
    }

    // Execute action
    switch (step.action) {
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, step.duration || 2000));
        break;

      case 'highlight':
        await new Promise(resolve => setTimeout(resolve, 3000));
        break;

      case 'click':
        // Simulate click animation
        await new Promise(resolve => setTimeout(resolve, 500));
        const clickElement = document.querySelector(`[data-demo-id="${step.target}"]`);
        if (clickElement && clickElement instanceof HTMLElement) {
          clickElement.click();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;

      case 'type':
        // Simulate typing
        const inputElement = document.querySelector(`[data-demo-id="${step.target}"]`);
        if (inputElement && inputElement instanceof HTMLInputElement) {
          inputElement.value = '';
          inputElement.focus();
          
          const text = step.value || '';
          for (let i = 0; i < text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            inputElement.value = text.slice(0, i + 1);
            // Trigger React's onChange
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;

      case 'scroll':
        const scrollElement = document.querySelector(`[data-demo-id="${step.target}"]`);
        if (scrollElement) {
          scrollElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
    }

    // Move to next step
    setState(prev => ({ ...prev, currentStep: stepIndex + 1 }));
    executeStep(stepIndex + 1);
  }, [onComplete, onStepChange, updateTargetRect]);

  useEffect(() => {
    if (active && !state.active) {
      setState(prev => ({ ...prev, active: true }));
      executeStep(0);
    } else if (!active && state.active) {
      setState(prev => ({
        ...prev,
        active: false,
        currentStep: 0,
        highlightedSection: null,
        cursorPosition: null,
        showCursor: false,
      }));
      setTargetRect(null);
    }
  }, [active, state.active, executeStep]);

  const currentStep = DEMO_STEPS[state.currentStep];

  return (
    <>
      <DemoCursor
        active={state.showCursor}
        position={state.cursorPosition}
      />
      
      <DemoHighlight
        targetRect={targetRect}
        visible={!!state.highlightedSection}
      />

      {currentStep?.tooltip && (
        <DemoTooltip
          text={currentStep.tooltip.text}
          position={currentStep.tooltip.position}
          visible={!!targetRect}
          targetRect={targetRect || undefined}
        />
      )}
    </>
  );
}
