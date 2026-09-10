import type { CategoryId, ChatMsg, QAState } from "../types";
import { CATEGORIES, detectCategory } from "./agentEngine";

export interface ConversationContext {
  modIdea: string;
  category: CategoryId | null;
  keyFeatures: string[];
  decisions: Record<string, string>;
  refinements: string[];
  currentFocus: string | null;
}

export interface ConversationState {
  context: ConversationContext;
  conversationPhase: "exploring" | "refining" | "ready";
  lastTopic: string | null;
}

export function createInitialContext(): ConversationContext {
  return {
    modIdea: "",
    category: null,
    keyFeatures: [],
    decisions: {},
    refinements: [],
    currentFocus: null,
  };
}

export function updateContext(
  context: ConversationContext,
  userInput: string,
  agentResponse?: string
): ConversationContext {
  const updated = { ...context };
  const lowerInput = userInput.toLowerCase();

  // Detect category if not set
  if (!updated.category) {
    const detected = detectCategory(userInput);
    updated.category = detected.id;
  }

  // Extract key features from user input
  const featureKeywords = [
    "recruit", "portal", "transfer", "commit", "poach",
    "playbook", "formation", "play", "offense", "defense",
    "weather", "wind", "rain", "snow", "storm",
    "crowd", "noise", "stadium", "atmosphere", "band",
    "cpu", "ai", "difficulty", "balance", "rubber",
    "clock", "rules", "targeting", "penalty", "overtime"
  ];

  featureKeywords.forEach(keyword => {
    if (lowerInput.includes(keyword) && !updated.keyFeatures.includes(keyword)) {
      updated.keyFeatures.push(keyword);
    }
  });

  // Track decisions
  if (lowerInput.includes("yes") || lowerInput.includes("yeah") || lowerInput.includes("sure")) {
    if (updated.currentFocus) {
      updated.decisions[updated.currentFocus] = "approved";
    }
  } else if (lowerInput.includes("no") || lowerInput.includes("nah") || lowerInput.includes("skip")) {
    if (updated.currentFocus) {
      updated.decisions[updated.currentFocus] = "rejected";
    }
  }

  // Track refinements
  if (lowerInput.includes("change") || lowerInput.includes("modify") || lowerInput.includes("adjust") || lowerInput.includes("tweak")) {
    updated.refinements.push(userInput);
  }

  // Update mod idea if this is the first substantial input
  if (!updated.modIdea && userInput.length > 20) {
    updated.modIdea = userInput;
  }

  return updated;
}

export function generateConversationalResponse(
  context: ConversationContext,
  userInput: string,
  phase: "exploring" | "refining" | "ready"
): string {
  const lowerInput = userInput.toLowerCase();
  
  // Exploring phase - help user articulate their idea
  if (phase === "exploring") {
    if (!context.modIdea || context.modIdea.length < 30) {
      return "I'd love to help you build this mod! Can you tell me more about what you're envisioning? What should it do differently in the game?";
    }

    if (context.keyFeatures.length === 0) {
      return "That's a great start! What specific features are you thinking about? For example, should it affect recruiting, gameplay, weather, or something else?";
    }

    if (context.keyFeatures.length === 1) {
      const feature = context.keyFeatures[0];
      return `I see you're focused on ${feature}. That's a solid foundation! What else would you like this mod to include? We can add complementary features to make it more complete.`;
    }

    if (context.keyFeatures.length >= 2 && context.refinements.length === 0) {
      return `Excellent! You've got ${context.keyFeatures.length} key features in mind. Let's make sure we have the details right. How realistic should this be? Should it be subtle or more pronounced?`;
    }
  }

  // Refining phase - help user fine-tune details
  if (phase === "refining") {
    if (lowerInput.includes("realistic") || lowerInput.includes("realism")) {
      return "Great choice on realism! How far should we push it? We can go for subtle tweaks that most players won't notice, or we can make it very pronounced for a completely different experience.";
    }

    if (lowerInput.includes("subtle") || lowerInput.includes("minor")) {
      return "Perfect for a subtle approach. I'll make sure the changes feel natural and don't overwhelm the base game. What about the intensity level - should it be mild, moderate, or noticeable?";
    }

    if (lowerInput.includes("pronounced") || lowerInput.includes("dramatic") || lowerInput.includes("major")) {
      return "Love the bold approach! We'll make these changes really stand out. Should we also add some visual or audio feedback so players can really feel the difference?";
    }

    if (context.refinements.length > 0 && context.refinements.length < 3) {
      return "Good refinement! Let's keep going. Are there any edge cases we should consider? For example, what should happen in specific game situations or with certain settings?";
    }

    if (context.refinements.length >= 3) {
      return "This is shaping up nicely! I think we have enough detail to start building. Should we add any stretch goals to make it even better, or are you ready to compile what we have?";
    }
  }

  // Ready phase - confirm and prepare to build
  if (phase === "ready") {
    if (lowerInput.includes("ready") || lowerInput.includes("go") || lowerInput.includes("build") || lowerInput.includes("compile")) {
      return "Perfect! I've got a clear picture of what you want. Let me pull some proven patterns from the vault and start weaving this together. This is going to be a great mod!";
    }

    if (lowerInput.includes("wait") || lowerInput.includes("not yet") || lowerInput.includes("more")) {
      return "No problem! What else would you like to refine or add? We can keep discussing until you're completely satisfied.";
    }
  }

  // Default conversational responses
  if (lowerInput.includes("help") || lowerInput.includes("what")) {
    return "I'm here to help you build the perfect mod! Just tell me what you want to change in NCAA 27, and we'll work through the details together. What aspect are you most excited about?";
  }

  if (lowerInput.includes("example") || lowerInput.includes("show me")) {
    return "Sure! Here's an example: 'I want CPU coaches to recruit more realistically with conference preferences and less rubber-banding in close games.' What's your vision?";
  }

  if (lowerInput.includes("thanks") || lowerInput.includes("awesome") || lowerInput.includes("great")) {
    return "You're welcome! I'm excited to help bring this to life. What would you like to work on next?";
  }

  // Context-aware responses
  if (context.category && context.keyFeatures.length > 0) {
    const category = CATEGORIES.find(c => c.id === context.category);
    if (category) {
      return `Based on what you've shared about ${context.keyFeatures.join(", ")}, I'm thinking we should focus on making this feel authentic to ${category.label.toLowerCase()}. What's most important to you - realism, fun, or competitive balance?`;
    }
  }

  return "Tell me more about what you're envisioning! The more details you share, the better I can help craft the perfect mod.";
}

export function shouldTransitionToRefining(context: ConversationContext): boolean {
  return context.keyFeatures.length >= 2 && context.refinements.length === 0;
}

export function shouldTransitionToReady(context: ConversationContext): boolean {
  return context.refinements.length >= 3;
}

export function suggestNextStep(context: ConversationContext): string | null {
  if (context.keyFeatures.length === 0) {
    return "Let's identify the key features you want in this mod";
  }

  if (context.keyFeatures.length === 1) {
    return "What other features would complement this?";
  }

  if (context.refinements.length === 0) {
    return "Let's refine the details - how realistic should this be?";
  }

  if (context.refinements.length < 3) {
    return "Any edge cases or specific situations we should consider?";
  }

  return null;
}
