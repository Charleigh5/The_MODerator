export interface DemoStep {
  id: string;
  title: string;
  description: string;
  detailedExplanation: string;
  action: 'highlight' | 'click' | 'type' | 'scroll' | 'wait';
  target?: string;
  value?: string;
  duration?: number;
  tooltip?: {
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  agentAction?: string;
  whyItMatters?: string;
}

export interface DemoState {
  active: boolean;
  currentStep: number;
  steps: DemoStep[];
  highlightedSection: string | null;
  cursorPosition: { x: number; y: number } | null;
  showCursor: boolean;
  waitingForUser: boolean;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Gridiron Forge!',
    description: 'Let me show you how to create your first NCAA 27 MOD.',
    detailedExplanation: `Welcome to Gridiron Forge, your personal MOD creation studio for NCAA Football 27! 

I'm CODEWRIGHT, your AI coaching assistant. I'll walk you through creating a complete, game-ready MOD from start to finish.

This demo will show you:
• How to describe what you want in plain English
• How I analyze your request and suggest enhancements
• How I pull proven code patterns from the vault
• How to build, test, and export your MOD

Ready to create your first MOD? Let's get started!`,
    action: 'wait',
    duration: 1000,
    agentAction: 'Initializing demo mode and preparing workspace',
    whyItMatters: 'Understanding the workflow helps you create better MODs faster'
  },
  {
    id: 'upload-doc',
    title: 'Step 1: Upload Your Requirements',
    description: 'You can upload a document with your MOD requirements, or just type them in the chat.',
    detailedExplanation: `The chat interface is where you'll communicate with me (CODEWRIGHT). You have two options:

OPTION 1: Upload a Document
Click the paperclip icon 📎 to upload a requirements document (.txt, .md, .doc, .docx, .pdf). This is great for detailed specifications.

OPTION 2: Type in Chat (Recommended for Demo)
Simply type what you want in plain English. I'll understand it and ask clarifying questions.

For this demo, we'll type a brief directly. This is the fastest way to get started!

The chat supports drag-and-drop too - just drop any file onto the chat area.`,
    action: 'highlight',
    target: 'chat-input',
    tooltip: {
      text: 'This is where you talk to CODEWRIGHT - type or upload your requirements!',
      position: 'top'
    },
    agentAction: 'Highlighting the chat input area',
    whyItMatters: 'Clear communication with the AI leads to better MODs'
  },
  {
    id: 'type-brief',
    title: 'Step 2: Describe Your MOD',
    description: 'Let\'s type a simple brief describing what we want the MOD to do.',
    detailedExplanation: `Now I'll type an example brief to show you how easy it is. Watch as I type:

"I want to make CPU coaches recruit more realistically with conference preferences"

Notice how I'm using plain English? You don't need technical jargon or code knowledge. Just describe:
• What you want to change (CPU recruiting)
• How you want it to work (more realistic)
• Specific features (conference preferences)

The AI will parse this and understand you want:
1. Improved CPU recruiting AI
2. Conference-based recruiting preferences
3. More realistic behavior

You can be as simple or detailed as you want. I'll ask questions to fill in the gaps!`,
    action: 'type',
    target: 'chat-input',
    value: 'I want to make CPU coaches recruit more realistically with conference preferences',
    duration: 3000,
    tooltip: {
      text: 'Watch as CODEWRIGHT types the brief - plain English, no code needed!',
      position: 'top'
    },
    agentAction: 'Typing the example brief into the chat',
    whyItMatters: 'Natural language input makes MOD creation accessible to everyone'
  },
  {
    id: 'send-message',
    title: 'Step 3: Send Your Brief',
    description: 'Now we\'ll send this to CODEWRIGHT to start the analysis.',
    detailedExplanation: `Time to send our brief to CODEWRIGHT! I'll click the "CHALK IT" button.

When you click CHALK IT:
1. Your message is sent to the AI agent
2. The agent analyzes your request
3. It detects the category (recruiting, playbook, weather, etc.)
4. It generates contextual stretch ideas
5. It begins asking clarifying questions

The button is styled in maize and blue (Michigan colors!) and has a satisfying click animation.

After clicking, watch for my response - I'll start by suggesting stretch ideas to enhance your MOD!`,
    action: 'click',
    target: 'chalk-it-button',
    tooltip: {
      text: 'Click "CHALK IT" to send your message and start the magic!',
      position: 'left'
    },
    agentAction: 'Clicking the CHALK IT button to send the brief',
    whyItMatters: 'This triggers the AI analysis and begins the MOD creation process'
  },
  {
    id: 'agent-responds',
    title: 'Step 4: Agent Analyzes Your Request',
    description: 'CODEWRIGHT is now analyzing your request and generating contextual suggestions.',
    detailedExplanation: `Watch as I analyze your brief! Here's what's happening behind the scenes:

1. CATEGORY DETECTION
   I scan your text for keywords and determine this is about "recruiting"

2. CONTEXTUAL STRETCH IDEAS
   Based on "recruiting" + "conference preferences", I generate relevant suggestions:
   • Regional scouting bias
   • CPU poaching mechanics
   • Portal surge events
   • Conference loyalty systems

3. PATTERN MATCHING
   I search the vault for existing recruiting MODs:
   • "Recruiting Overhaul '26" (98% reliable)
   • "Transfer Portal Chaos" (88% reliable)
   • "Redshirt Realism" (95% reliable)

4. QUESTION GENERATION
   I prepare targeted questions to understand your specific needs

This all happens in seconds! The AI is working hard to understand exactly what you want.`,
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'The AI is analyzing your request - this happens automatically!',
      position: 'bottom'
    },
    agentAction: 'Analyzing the brief and generating contextual suggestions',
    whyItMatters: 'Smart analysis means you get relevant suggestions, not generic ones'
  },
  {
    id: 'stretch-ideas',
    title: 'Step 5: Stretch Ideas',
    description: 'I\'ve suggested additional features to make your MOD even better!',
    detailedExplanation: `These are your STRETCH IDEAS - bonus features I think would enhance your recruiting MOD:

Each idea is:
• Contextually relevant to your brief
• Based on proven patterns from the vault
• Implemented as hot-reload extensions (easy to toggle)

Click any idea to select it:
✓ Selected ideas get a maize background
+ Unselected ideas have dashed borders

You can select as many or as few as you want. Each one will be woven into your MOD's code.

These aren't random suggestions - they're specifically chosen because they complement your recruiting focus and conference preferences!`,
    action: 'highlight',
    target: 'stretch-ideas',
    tooltip: {
      text: 'These stretch ideas are tailored to your recruiting MOD - click to select!',
      position: 'top'
    },
    agentAction: 'Highlighting the stretch ideas section',
    whyItMatters: 'Stretch ideas add depth and polish to your MOD with one click'
  },
  {
    id: 'select-stretch',
    title: 'Step 6: Select Stretch Ideas',
    description: 'Let\'s select a couple of these stretch ideas to enhance our MOD.',
    detailedExplanation: `I'll select the first stretch idea to show you how it works.

Watch as I click "+ Regional scouting bias - coaches prefer in-state recruits"

When you click:
1. The button turns solid maize (selected state)
2. The "+" changes to "✓"
3. The idea is added to your MOD's feature list

Let me select one more to show you can pick multiple ideas.

Each selected idea will:
• Be implemented as a hot-reload variable
• Appear in your MOD's manifest
• Be included in the generated code
• Be testable in the sandbox

You're building a more complete MOD with each selection!`,
    action: 'click',
    target: 'stretch-idea-1',
    tooltip: {
      text: 'Click to select this stretch idea - it will be included in your MOD!',
      position: 'bottom'
    },
    agentAction: 'Clicking the first stretch idea to select it',
    whyItMatters: 'Each stretch idea adds valuable functionality to your MOD'
  },
  {
    id: 'lock-ideas',
    title: 'Step 7: Lock In Your Choices',
    description: 'Now we\'ll lock in our selections and move to detailed questions.',
    detailedExplanation: `Time to lock in our stretch ideas! I'll click "LOCK & GRILL ME".

This button:
1. Confirms your selected stretch ideas
2. Locks them into the MOD specification
3. Transitions to the Q&A phase
4. Starts asking detailed questions

After locking, I'll ask specific questions about:
• How realistic should recruiting be? (1-10 scale)
• Conference bias strength? (subtle to extreme)
• CPU poaching behavior? (aggressive to passive)
• And more...

These questions help me fine-tune the MOD to your exact preferences!`,
    action: 'click',
    target: 'lock-button',
    tooltip: {
      text: 'Click "LOCK & GRILL ME" to confirm your choices and continue!',
      position: 'bottom'
    },
    agentAction: 'Clicking the lock button to confirm stretch ideas',
    whyItMatters: 'Locking your choices ensures the MOD is built exactly how you want it'
  },
  {
    id: 'qa-phase',
    title: 'Step 8: Q&A Phase',
    description: 'Now I\'ll ask specific questions to fine-tune your MOD.',
    detailedExplanation: `Welcome to the Q&A phase! This is where we get specific.

I'll ask you targeted questions like:

Q1: "How realistic should CPU recruiting be?"
   Options: 4 (mild), 7 (realistic), 10 (bloodbath)

Q2: "How strong should conference bias be?"
   Options: Subtle (1.1x), Moderate (1.3x), Strong (1.5x)

Q3: "How aggressive should CPU poaching be?"
   Options: No poaching, Soft poach only, Full chaos

You can:
• Click quick-answer chips (fast)
• Type your own answer (custom)
• Skip questions (use defaults)

Your answers directly affect the generated code. For example, choosing "10 (bloodbath)" makes CPU coaches extremely aggressive in recruiting!`,
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'Answer these questions to fine-tune your MOD - be specific!',
      position: 'bottom'
    },
    agentAction: 'Waiting for you to answer the Q&A questions',
    whyItMatters: 'Your answers determine exactly how your MOD behaves in-game'
  },
  {
    id: 'answer-question',
    title: 'Step 9: Answer Questions',
    description: 'Let\'s answer the first question with a quick selection.',
    detailedExplanation: `I'll answer the first question by clicking a quick-answer chip.

Watch as I click "7 - realistic" for the CPU intensity question.

Quick-answer chips:
• Are pre-set to common values
• Save you typing time
• Cover most use cases
• Can be overridden with custom answers

After clicking, the answer is recorded and I move to the next question.

Your answer of "7 - realistic" means:
• CPU coaches will be moderately aggressive
• Not too easy, not impossible
• Balanced challenge for most players
• Realistic but not frustrating

This value will be written into the MOD's configuration!`,
    action: 'click',
    target: 'qa-chip-1',
    tooltip: {
      text: 'Click a quick answer or type your own below!',
      position: 'top'
    },
    agentAction: 'Clicking the "7 - realistic" answer chip',
    whyItMatters: 'Quick answers speed up the process while still giving you control'
  },
  {
    id: 'vault-panel',
    title: 'Step 10: Pattern Vault',
    description: 'While you answer questions, check out the Pattern Vault on the left!',
    detailedExplanation: `The PATTERN VAULT (chalkboard on the left) is where proven MODs live.

What's in the vault:
• 9 battle-tested mods from 4 platforms
• 16 reusable code patterns
• User reviews and reliability scores
• Pros, cons, and warnings
• Full technical documentation

Each mod card shows:
• Name and platform
• Star rating (out of 5)
• Reliability percentage
• Number of reviews

Click any mod to see:
• Detailed description
• User reviews
• Pros and cons
• Warnings
• Code excerpts
• Files and variables
• Logic explanation
• Test plan

I'm pulling patterns from these mods to build yours faster!`,
    action: 'highlight',
    target: 'pattern-vault',
    tooltip: {
      text: 'The Pattern Vault contains 9 proven mods - I\'m pulling patterns from these!',
      position: 'right'
    },
    agentAction: 'Highlighting the Pattern Vault panel',
    whyItMatters: 'Reusing proven patterns means faster development and more reliable MODs'
  },
  {
    id: 'pull-patterns',
    title: 'Step 11: Pull Patterns',
    description: 'I\'m automatically pulling relevant patterns from the vault.',
    detailedExplanation: `As you answer questions, I'm automatically pulling patterns from the vault!

What's happening:
1. I identify which vault mods match your needs
2. I extract reusable code patterns
3. I add them to the knowledge base
4. I'll weave them into your MOD

Look at the bottom of the vault - you'll see pattern tags appearing:
• hook·OnRecruitDecision (from Recruiting Overhaul)
• block·ClampRating (from Recruiting Overhaul)
• vartable·conference_bias (from Recruiting Overhaul)

Each pattern is:
• Tested and proven
• Properly documented
• Ready to reuse
• Hot-reload compatible

This is how I build your MOD so fast - I'm not starting from scratch!`,
    action: 'wait',
    duration: 2000,
    tooltip: {
      text: 'Patterns are being pulled automatically - watch the knowledge base grow!',
      position: 'right'
    },
    agentAction: 'Pulling patterns from the vault into the knowledge base',
    whyItMatters: 'Pattern reuse means your MOD is built on proven, tested code'
  },
  {
    id: 'compiling',
    title: 'Step 12: Compiling Your MOD',
    description: 'Now I\'m compiling all the patterns into your custom MOD!',
    detailedExplanation: `Time to compile! I'm weaving all the patterns together into your custom MOD.

What's being generated:
1. MANIFEST (manifest.json)
   • MOD metadata
   • Dependencies
   • Version info
   • Signature

2. SCHEMA (recruit.schema.json)
   • Variable definitions
   • Type checking
   • Validation rules

3. LOGIC (recruit_engine.lua)
   • Core recruiting AI
   • Conference bias logic
   • Poaching mechanics
   • Your stretch ideas

4. VARIABLES (conference_bias.xml)
   • Hot-reload variables
   • Your Q&A answers
   • Tunable parameters

All files follow the ncaa27-mod/3.1 schema and are ready for the game!

This compilation takes just a few seconds...`,
    action: 'wait',
    duration: 2500,
    tooltip: {
      text: 'Compiling your MOD - this generates 4 files in seconds!',
      position: 'bottom'
    },
    agentAction: 'Compiling the MOD and generating all necessary files',
    whyItMatters: 'Compilation transforms your ideas into game-ready code'
  },
  {
    id: 'workbench',
    title: 'Step 13: Play Sheet',
    description: 'Check out the Play Sheet on the right - your MOD is ready!',
    detailedExplanation: `Your MOD is complete! The PLAY SHEET (right panel) shows your finished work.

The Play Sheet has two tabs:

BLUEPRINT TAB
• View all 4 generated files
• Syntax-highlighted code
• File sizes and metadata
• Copy code to clipboard

SHIP IT TAB (what we'll use next)
• Game-day checklist
• Build pipeline
• Sandbox testing
• Export functionality

Your MOD includes:
✓ 4 files (manifest, schema, logic, variables)
✓ All your Q&A answers
✓ Selected stretch ideas
✓ Patterns from the vault
✓ Hot-reload support
✓ Full documentation

Ready to build and test it?`,
    action: 'highlight',
    target: 'workbench',
    tooltip: {
      text: 'Your MOD is complete! The Play Sheet shows all 4 generated files.',
      position: 'left'
    },
    agentAction: 'Highlighting the Play Sheet panel',
    whyItMatters: 'The Play Sheet is your command center for building, testing, and exporting'
  },
  {
    id: 'build-test',
    title: 'Step 14: Build & Test',
    description: 'Let\'s build and test your MOD to make sure it works perfectly.',
    detailedExplanation: `Time to build and test! I'll click "RUN THE BUILD".

The build pipeline:
1. RESOLVES MANIFEST
   Checks dependencies and metadata

2. SCHEMA CHECK
   Validates variable types and structure

3. LINKS BLOCKS
   Connects all code patterns

4. HOOK-CONFLICT SCAN
   Ensures no conflicts with other mods

5. COMPILES LUA
   Converts to game-ready bytecode

6. SEALS VAR TABLE
   Finalizes hot-reload variables

7. SIGNS BUNDLE
   Creates cryptographic signature

After build passes, we'll run a SANDBOX TEST:
• Simulates 4 quarters
• Tests all hooks fire correctly
• Verifies variables hot-reload
• Checks memory usage
• Confirms no errors

If everything passes, your MOD is ready to ship!`,
    action: 'click',
    target: 'build-button',
    tooltip: {
      text: 'Click "RUN THE BUILD" to compile and verify your MOD!',
      position: 'left'
    },
    agentAction: 'Clicking the build button to start the build pipeline',
    whyItMatters: 'Building and testing ensures your MOD works perfectly in-game'
  },
  {
    id: 'export',
    title: 'Step 15: Export Your MOD',
    description: 'Finally, export your MOD to use it in NCAA 27!',
    detailedExplanation: `Your MOD passed all tests! Time to export.

I'll click "EXPORT" to download your MOD file.

What you get:
• File: recruiting-mod.ncaa27mod.json
• Format: Standard MOD package
• Size: ~20KB
• Contents: All 4 files bundled

How to install:
1. Download the .ncaa27mod.json file
2. Navigate to your NCAA 27 installation
3. Drop the file in the /mods folder
4. Launch the game
5. Your MOD loads automatically!

The MOD is:
✓ Signed and verified
✓ Schema-compliant
✓ Hot-reload ready
✓ Fully documented
✓ Tested and working

Congratulations! You've created your first NCAA 27 MOD!`,
    action: 'click',
    target: 'export-button',
    tooltip: {
      text: 'Click "EXPORT" to download your MOD - then drop it in /mods!',
      position: 'left'
    },
    agentAction: 'Clicking the export button to download the MOD',
    whyItMatters: 'Exporting gives you a file you can install in the game immediately'
  },
  {
    id: 'complete',
    title: 'Demo Complete! 🎉',
    description: 'You\'ve just created your first NCAA 27 MOD from start to finish!',
    detailedExplanation: `CONGRATULATIONS! You've completed the demo!

What you learned:
✓ How to describe MODs in plain English
✓ How the AI analyzes and enhances your ideas
✓ How stretch ideas add depth to your MOD
✓ How Q&A fine-tunes the behavior
✓ How the vault provides proven patterns
✓ How compilation generates game-ready code
✓ How to build, test, and export your MOD

What you can do now:
• Create your own MODs (click "NEW BINDER")
• Save MODs to your library
• Edit and version your MODs
• Browse the vault for inspiration
• Use the terminal for advanced commands

Remember:
• Be specific in your briefs
• Select stretch ideas to enhance your MOD
• Answer Q&A questions carefully
• Always build and test before exporting
• Save to library to track your work

Ready to create your own MOD? Click "NEW BINDER" and start building!

Go Blue! 🏈`,
    action: 'wait',
    duration: 5000,
    tooltip: {
      text: 'Demo complete! You can now create your own MODs. Go Blue!',
      position: 'bottom'
    },
    agentAction: 'Demo complete - ready for you to create your own MODs!',
    whyItMatters: 'You now have the knowledge to create any MOD you can imagine'
  }
];
