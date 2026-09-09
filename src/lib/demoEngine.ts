export interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: 'highlight' | 'click' | 'type' | 'scroll' | 'wait';
  target?: string;
  value?: string;
  duration?: number;
  tooltip?: {
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}

export interface DemoState {
  active: boolean;
  currentStep: number;
  steps: DemoStep[];
  highlightedSection: string | null;
  cursorPosition: { x: number; y: number } | null;
  showCursor: boolean;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Gridiron Forge!',
    description: 'Let me show you how to create your first NCAA 27 MOD. I\'ll walk you through each step.',
    action: 'wait',
    duration: 3000,
    tooltip: {
      text: 'This is your coaching workspace. The chat is where we\'ll talk!',
      position: 'bottom'
    }
  },
  {
    id: 'upload-doc',
    title: 'Step 1: Upload Your Requirements',
    description: 'First, let\'s upload a simple requirements document. This tells the system what MOD you want to create.',
    action: 'highlight',
    target: 'chat-input',
    tooltip: {
      text: 'Click the paperclip icon to upload a document, or just drag & drop a file here!',
      position: 'top'
    }
  },
  {
    id: 'type-brief',
    title: 'Step 2: Describe Your MOD',
    description: 'Now let\'s type a simple brief. I\'ll show you an example.',
    action: 'type',
    target: 'chat-input',
    value: 'I want to make CPU coaches recruit more realistically with conference preferences',
    duration: 2000,
    tooltip: {
      text: 'Just describe what you want in plain English. The AI will understand!',
      position: 'top'
    }
  },
  {
    id: 'send-message',
    title: 'Step 3: Send Your Brief',
    description: 'Now we\'ll send this to CODEWRIGHT, our AI agent.',
    action: 'click',
    target: 'chalk-it-button',
    tooltip: {
      text: 'Click "CHALK IT" to send your message to the coach!',
      position: 'left'
    }
  },
  {
    id: 'agent-responds',
    title: 'Step 4: Agent Analyzes Your Request',
    description: 'CODEWRIGHT is now analyzing your request and asking clarifying questions.',
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'The agent will ask you questions to understand exactly what you need.',
      position: 'bottom'
    }
  },
  {
    id: 'stretch-ideas',
    title: 'Step 5: Stretch Ideas',
    description: 'The agent suggests additional features to make your MOD even better!',
    action: 'highlight',
    target: 'stretch-ideas',
    tooltip: {
      text: 'These are bonus features the agent thinks would enhance your MOD. Click any to add them!',
      position: 'top'
    }
  },
  {
    id: 'select-stretch',
    title: 'Step 6: Select Stretch Ideas',
    description: 'Let\'s select a couple of these stretch ideas to make our MOD more complete.',
    action: 'click',
    target: 'stretch-idea-1',
    tooltip: {
      text: 'Click to select this stretch idea. It will be included in your MOD!',
      position: 'bottom'
    }
  },
  {
    id: 'lock-ideas',
    title: 'Step 7: Lock In Your Choices',
    description: 'Now we\'ll lock in our selections and move to the Q&A phase.',
    action: 'click',
    target: 'lock-button',
    tooltip: {
      text: 'Click "LOCK & GRILL ME" to confirm your choices!',
      position: 'bottom'
    }
  },
  {
    id: 'qa-phase',
    title: 'Step 8: Q&A Phase',
    description: 'The agent will now ask specific questions about your MOD requirements.',
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'Answer these questions to help the agent understand your needs better.',
      position: 'bottom'
    }
  },
  {
    id: 'answer-question',
    title: 'Step 9: Answer Questions',
    description: 'Let\'s answer the first question with a quick selection.',
    action: 'click',
    target: 'qa-chip-1',
    tooltip: {
      text: 'Click one of these quick answers, or type your own below!',
      position: 'top'
    }
  },
  {
    id: 'vault-panel',
    title: 'Step 10: Pattern Vault',
    description: 'While you answer questions, check out the Pattern Vault on the left!',
    action: 'highlight',
    target: 'pattern-vault',
    tooltip: {
      text: 'This is the Pattern Vault - it shows existing MODs we can learn from. The agent will use these patterns!',
      position: 'right'
    }
  },
  {
    id: 'pull-patterns',
    title: 'Step 11: Pull Patterns',
    description: 'The agent automatically pulls relevant patterns from existing MODs.',
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'The agent is learning from existing code to build your MOD faster!',
      position: 'right'
    }
  },
  {
    id: 'compiling',
    title: 'Step 12: Compiling Your MOD',
    description: 'Now the agent is compiling all the patterns into your custom MOD!',
    action: 'wait',
    duration: 2500,
    tooltip: {
      text: 'The agent is weaving together code patterns to create your MOD...',
      position: 'bottom'
    }
  },
  {
    id: 'workbench',
    title: 'Step 13: Play Sheet',
    description: 'Check out the Play Sheet on the right - your MOD is ready!',
    action: 'highlight',
    target: 'workbench',
    tooltip: {
      text: 'This is your completed MOD! You can view the code, test it, and export it.',
      position: 'left'
    }
  },
  {
    id: 'build-test',
    title: 'Step 14: Build & Test',
    description: 'Let\'s build and test your MOD to make sure it works perfectly.',
    action: 'click',
    target: 'build-button',
    tooltip: {
      text: 'Click "RUN BUILD" to compile and verify your MOD!',
      position: 'left'
    }
  },
  {
    id: 'export',
    title: 'Step 15: Export Your MOD',
    description: 'Finally, export your MOD to use it in NCAA 27!',
    action: 'click',
    target: 'export-button',
    tooltip: {
      text: 'Click "EXPORT" to download your MOD file. Drop it in the game\'s mods folder!',
      position: 'left'
    }
  },
  {
    id: 'complete',
    title: 'Demo Complete! 🎉',
    description: 'Congratulations! You\'ve just created your first NCAA 27 MOD. The agent handled all the complex coding while you focused on what you wanted.',
    action: 'wait',
    duration: 4000,
    tooltip: {
      text: 'You can now create your own MODs! Try it yourself or run the demo again.',
      position: 'bottom'
    }
  }
];
