import { useState, useEffect, useCallback } from 'react';
import { DEMO_STEPS, type DemoState } from '../lib/demoEngine';
import DemoCursor from './DemoCursor';
import DemoTooltip from './DemoTooltip';
import DemoHighlight from './DemoHighlight';
import DemoFlyout from './DemoFlyout';

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
    waitingForUser: false,
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showFlyout, setShowFlyout] = useState(false);

  const updateTargetRect = useCallback((targetId: string) => {
    const element = document.querySelector(`[data-demo-id="${targetId}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      return rect;
    }
    return null;
  }, []);

  const moveToStep = useCallback(async (stepIndex: number) => {
    if (stepIndex >= DEMO_STEPS.length) {
      onComplete();
      return;
    }

    const step = DEMO_STEPS[stepIndex];
    onStepChange(stepIndex);
    setShowFlyout(true);

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
          waitingForUser: true,
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        highlightedSection: null,
        cursorPosition: null,
        showCursor: false,
        waitingForUser: true,
      }));
    }
  }, [onComplete, onStepChange, updateTargetRect]);

  const executeAction = useCallback(async () => {
    const step = DEMO_STEPS[state.currentStep];
    if (!step) return;

    setState(prev => ({ ...prev, waitingForUser: false }));

    // Execute action
    switch (step.action) {
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, step.duration || 1000));
        break;

      case 'highlight':
        await new Promise(resolve => setTimeout(resolve, 1000));
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

    // Move to next step after action completes
    moveToStep(state.currentStep + 1);
  }, [state.currentStep, moveToStep]);

  const handleNext = () => {
    executeAction();
  };

  const handlePrevious = () => {
    if (state.currentStep > 0) {
      moveToStep(state.currentStep - 1);
    }
  };

  const handleSkip = () => {
    moveToStep(state.currentStep + 1);
  };

  useEffect(() => {
    if (active && !state.active) {
      setState(prev => ({ ...prev, active: true }));
      moveToStep(0);
    } else if (!active && state.active) {
      setState(prev => ({
        ...prev,
        active: false,
        currentStep: 0,
        highlightedSection: null,
        cursorPosition: null,
        showCursor: false,
        waitingForUser: false,
      }));
      setTargetRect(null);
      setShowFlyout(false);
    }
  }, [active, state.active, moveToStep]);

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

      {showFlyout && currentStep && (
        <DemoFlyout
          step={currentStep}
          stepNumber={state.currentStep + 1}
          totalSteps={DEMO_STEPS.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          canGoBack={state.currentStep > 0}
          isLastStep={state.currentStep === DEMO_STEPS.length - 1}
        />
      )}
    </>
  );
}
