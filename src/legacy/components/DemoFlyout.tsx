import type { DemoStep } from '../lib/demoEngine';

interface DemoFlyoutProps {
  step: DemoStep;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  canGoBack: boolean;
  isLastStep: boolean;
}

export default function DemoFlyout({
  step,
  stepNumber,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  canGoBack,
  isLastStep,
}: DemoFlyoutProps) {
  return (
    <div className="fixed left-1/2 top-20 z-[9999] -translate-x-1/2 animate-slide-down">
      <div className="w-[600px] rounded-xl border-2 border-maize-400 bg-navy-900/95 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="border-b-2 border-maize-400/30 bg-navy-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maize-400 font-display text-lg font-bold text-navy-950">
                {stepNumber}
              </div>
              <div>
                <h2 className="font-display text-xl tracking-wide text-maize-400">
                  {step.title}
                </h2>
                <p className="text-sm text-chalk/70">{step.description}</p>
              </div>
            </div>
            <div className="font-mono text-xs text-chalk/50">
              {stepNumber} / {totalSteps}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto px-6 py-5">
          {/* Detailed Explanation */}
          <div className="mb-4 rounded-lg border border-maize-400/20 bg-navy-800/30 p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-chalk/90">
              {step.detailedExplanation}
            </div>
          </div>

          {/* Agent Action */}
          {step.agentAction && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-maize-400/20 bg-maize-400/5 p-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-maize-400 text-navy-950">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-maize-400">Agent Action</div>
                <div className="text-sm text-chalk/80">{step.agentAction}</div>
              </div>
            </div>
          )}

          {/* Why It Matters */}
          {step.whyItMatters && (
            <div className="flex items-start gap-2 rounded-lg border border-maize-400/20 bg-maize-400/5 p-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-maize-400 text-navy-950">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.664l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.544.544A3.988 3.988 0 0012 15c-1.165 0-2.218.48-2.828 1.228l-.544-.544z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-maize-400">Why This Matters</div>
                <div className="text-sm text-chalk/80">{step.whyItMatters}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="border-t-2 border-maize-400/30 bg-navy-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={!canGoBack}
              className="flex items-center gap-2 rounded-md border border-chalk/30 bg-chalk/5 px-4 py-2 text-sm font-medium text-chalk transition-all hover:bg-chalk/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onSkip}
                className="rounded-md px-4 py-2 text-sm font-medium text-chalk/60 transition-all hover:text-chalk"
              >
                Skip
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-2 rounded-md bg-maize-400 px-6 py-2 text-sm font-bold text-navy-950 shadow-lg transition-all hover:bg-maize-300"
              >
                {isLastStep ? 'Finish' : 'Next Step'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
