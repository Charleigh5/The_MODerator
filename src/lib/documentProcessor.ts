import type { CategoryId } from "../types";
import { MODS } from "../data/modLibrary";
import { SOURCES } from "./agentEngine";

export interface Feature {
  id: string;
  name: string;
  description: string;
  userStories: UserStory[];
  notSupposedTo: string[];
  requiredOutcome: string;
  testPlan: string[];
  suggestedSources: ModSource[];
  codeStrategy: "rewrite" | "extend" | "new";
  reasoning: string;
}

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

export interface ModSource {
  modId: string;
  modName: string;
  platform: string;
  patterns: string[];
  reuseType: "rewrite" | "extend" | "reference";
  reasoning: string;
}

export interface ParsedDocument {
  title: string;
  summary: string;
  category: CategoryId;
  features: Feature[];
  overallReasoning: string;
  workflowSuggestions: string[];
}

const FEATURE_KEYWORDS: Record<CategoryId, string[]> = {
  recruiting: ["recruit", "portal", "transfer", "commit", "poach", "offer", "signing", "stars"],
  playbook: ["playbook", "play", "offense", "option", "spread", "formation", "audible", "tempo"],
  weather: ["weather", "rain", "snow", "wind", "storm", "forecast", "elements"],
  atmosphere: ["crowd", "noise", "stadium", "night", "atmosphere", "home field", "band"],
  difficulty: ["difficulty", "cpu", "ai", "hard", "balance", "rubber band", "catch-up"],
  rules: ["clock", "rules", "targeting", "overtime", "penalty", "runoff", "flag"],
};

export function parseDocument(text: string): ParsedDocument {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0]?.replace(/^#+\s*/, "") || "Untitled Mod";
  
  // Detect category from content
  const category = detectCategoryFromText(text);
  
  // Extract features (look for numbered lists, bullet points, or feature headers)
  const features = extractFeatures(text, category);
  
  // Generate reasoning
  const reasoning = generateReasoning(title, category, features);
  
  // Workflow suggestions
  const suggestions = generateWorkflowSuggestions(features);
  
  return {
    title,
    summary: generateSummary(title, category, features),
    category,
    features,
    overallReasoning: reasoning,
    workflowSuggestions: suggestions,
  };
}

function detectCategoryFromText(text: string): CategoryId {
  const t = text.toLowerCase();
  let best: CategoryId = "recruiting";
  let bestScore = 0;
  
  for (const [cat, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    const score = keywords.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = cat as CategoryId;
    }
  }
  
  return best;
}

function extractFeatures(text: string, category: CategoryId): Feature[] {
  const features: Feature[] = [];
  const lines = text.split("\n");
  
  // Look for feature patterns: numbered lists, bullet points, or headers
  let currentFeature = "";
  let featureLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect feature start (numbered list, bullet, or header)
    if (/^\d+[\.\)]\s/.test(trimmed) || /^[-*]\s/.test(trimmed) || /^#{1,3}\s/.test(trimmed)) {
      if (currentFeature && featureLines.length > 0) {
        features.push(buildFeature(currentFeature, featureLines, category));
      }
      currentFeature = trimmed.replace(/^[\d\-\*\#\.]+\s*/, "");
      featureLines = [];
    } else if (currentFeature && trimmed) {
      featureLines.push(trimmed);
    }
  }
  
  // Add last feature
  if (currentFeature && featureLines.length > 0) {
    features.push(buildFeature(currentFeature, featureLines, category));
  }
  
  // If no features found, create one from the whole document
  if (features.length === 0) {
    features.push(buildFeature("Main Feature", lines.slice(1), category));
  }
  
  return features;
}

function buildFeature(name: string, lines: string[], category: CategoryId): Feature {
  const description = lines.join(" ").slice(0, 200);
  
  // Generate 3 user stories
  const userStories = generateUserStories(name, description, category);
  
  // Generate "not supposed to" list
  const notSupposedTo = generateNotSupposedTo(name, category);
  
  // Generate required outcome
  const requiredOutcome = generateRequiredOutcome(name, description, category);
  
  // Generate test plan
  const testPlan = generateTestPlan(name, category);
  
  // Suggest code sources
  const suggestedSources = suggestCodeSources(category, name);
  
  // Determine code strategy
  const codeStrategy = determineCodeStrategy(suggestedSources);
  
  // Generate reasoning
  const reasoning = generateFeatureReasoning(name, description, category, suggestedSources);
  
  return {
    id: `f_${name.toLowerCase().replace(/\s+/g, "_").slice(0, 20)}`,
    name,
    description,
    userStories,
    notSupposedTo,
    requiredOutcome,
    testPlan,
    suggestedSources,
    codeStrategy,
    reasoning,
  };
}

function generateUserStories(featureName: string, description: string, category: CategoryId): UserStory[] {
  const stories: UserStory[] = [];
  
  // Story 1: Player perspective
  stories.push({
    id: `${featureName}_story_1`,
    title: `${featureName} - Player Experience`,
    asA: "player",
    iWant: `to experience ${featureName.toLowerCase()} in a realistic way`,
    soThat: "the game feels authentic and engaging",
    acceptanceCriteria: [
      `Feature activates correctly during gameplay`,
      `Player can observe the effect of ${featureName.toLowerCase()}`,
      `Feature integrates seamlessly with existing game systems`,
    ],
  });
  
  // Story 2: Coach/Manager perspective
  stories.push({
    id: `${featureName}_story_2`,
    title: `${featureName} - Strategic Impact`,
    asA: "coach",
    iWant: `to use ${featureName.toLowerCase()} as part of my strategy`,
    soThat: "I can gain a competitive advantage",
    acceptanceCriteria: [
      `Feature provides meaningful strategic options`,
      `AI opponents respond appropriately to the feature`,
      `Feature creates interesting decision points`,
    ],
  });
  
  // Story 3: Technical/Modder perspective
  stories.push({
    id: `${featureName}_story_3`,
    title: `${featureName} - Technical Implementation`,
    asA: "modder",
    iWant: `to implement ${featureName.toLowerCase()} using clean, maintainable code`,
    soThat: "the mod is stable and easy to extend",
    acceptanceCriteria: [
      `Code follows existing patterns from the vault`,
      `Feature is properly documented`,
      `Feature can be hot-reloaded for testing`,
    ],
  });
  
  return stories;
}

function generateNotSupposedTo(featureName: string, category: CategoryId): string[] {
  const nots: string[] = [];
  
  nots.push(`Should not break existing game mechanics`);
  nots.push(`Should not cause performance degradation`);
  nots.push(`Should not conflict with other ${category} mods`);
  
  if (category === "recruiting") {
    nots.push(`Should not make recruiting impossible to win`);
    nots.push(`Should not remove player agency from decisions`);
  } else if (category === "playbook") {
    nots.push(`Should not make AI play calls predictable`);
    nots.push(`Should not break formation logic`);
  } else if (category === "weather") {
    nots.push(`Should not make weather unplayable`);
    nots.push(`Should not break passing game entirely`);
  } else if (category === "atmosphere") {
    nots.push(`Should not make crowd noise unbearable`);
    nots.push(`Should not break immersion with unrealistic effects`);
  } else if (category === "difficulty") {
    nots.push(`Should not make the game unbeatable`);
    nots.push(`Should not remove all rubber-banding if player wants it`);
  } else if (category === "rules") {
    nots.push(`Should not break clock management`);
    nots.push(`Should not make penalties game-breaking`);
  }
  
  return nots;
}

function generateRequiredOutcome(featureName: string, description: string, category: CategoryId): string {
  return `The ${featureName} feature must integrate cleanly into the NCAA 27 mod framework, use hot-reload variables for easy tuning, follow the ncaa27-mod/3.1 schema, and pass all test cases without conflicts or performance issues.`;
}

function generateTestPlan(featureName: string, category: CategoryId): string[] {
  const tests: string[] = [];
  
  tests.push(`Load into exhibition mode and verify ${featureName} activates correctly`);
  tests.push(`Test edge cases and boundary conditions`);
  tests.push(`Verify hot-reload works for ${featureName} variables`);
  tests.push(`Check for conflicts with other ${category} mods`);
  tests.push(`Performance test - ensure no frame rate degradation`);
  
  if (category === "recruiting") {
    tests.push(`Test with 5-star recruits to verify AI behavior`);
    tests.push(`Verify portal window timing`);
  } else if (category === "playbook") {
    tests.push(`Test all formations and personnel packages`);
    tests.push(`Verify AI call frequency`);
  } else if (category === "weather") {
    tests.push(`Test in different regions and seasons`);
    tests.push(`Verify wind affects passing game`);
  } else if (category === "atmosphere") {
    tests.push(`Test in night games and different stadiums`);
    tests.push(`Verify crowd noise triggers penalties`);
  } else if (category === "difficulty") {
    tests.push(`Test in 4th quarter close games`);
    tests.push(`Verify CPU adjusts to player tendencies`);
  } else if (category === "rules") {
    tests.push(`Test clock runoff scenarios`);
    tests.push(`Verify targeting review booth`);
  }
  
  return tests;
}

function suggestCodeSources(category: CategoryId, featureName: string): ModSource[] {
  const sources: ModSource[] = [];
  const sourceIds = SOURCES[category] || [];
  
  for (const modId of sourceIds.slice(0, 3)) {
    const mod = MODS.find((m) => m.id === modId);
    if (!mod) continue;
    
    const reuseType = determineReuseType(mod, featureName);
    
    sources.push({
      modId: mod.id,
      modName: mod.name,
      platform: mod.platform,
      patterns: mod.patternIds.slice(0, 2),
      reuseType,
      reasoning: generateSourceReasoning(mod, featureName, reuseType),
    });
  }
  
  return sources;
}

function determineReuseType(mod: any, featureName: string): "rewrite" | "extend" | "reference" {
  const fn = featureName.toLowerCase();
  
  if (mod.tags.some((t: string) => fn.includes(t))) {
    return "extend";
  } else if (mod.reliability > 95) {
    return "reference";
  } else {
    return "rewrite";
  }
}

function generateSourceReasoning(mod: any, featureName: string, reuseType: string): string {
  if (reuseType === "extend") {
    return `${mod.name} already has a solid framework for ${featureName.toLowerCase()}. We can extend its hooks and variables to add our custom logic without rewriting the core.`;
  } else if (reuseType === "reference") {
    return `${mod.name} is highly reliable (${mod.reliability}%). We'll reference its patterns and variable structure but write new logic tailored to our specific needs.`;
  } else {
    return `${mod.name} has useful patterns but needs significant rewriting to fit our ${featureName} requirements. We'll adapt its structure but write fresh logic.`;
  }
}

function determineCodeStrategy(sources: ModSource[]): "rewrite" | "extend" | "new" {
  if (sources.length === 0) return "new";
  
  const extendCount = sources.filter((s) => s.reuseType === "extend").length;
  const rewriteCount = sources.filter((s) => s.reuseType === "rewrite").length;
  
  if (extendCount >= 2) return "extend";
  if (rewriteCount >= 2) return "rewrite";
  return "new";
}

function generateFeatureReasoning(
  name: string,
  description: string,
  category: CategoryId,
  sources: ModSource[]
): string {
  const sourceNames = sources.map((s) => s.modName).join(", ");
  return `The ${name} feature will ${sources.length > 0 ? `leverage existing code from ${sourceNames}` : "be built from scratch"} to ensure consistency with the NCAA 27 mod framework. The implementation will use hot-reload variables for easy tuning and follow the established hook patterns from the vault.`;
}

function generateSummary(title: string, category: CategoryId, features: Feature[]): string {
  return `This mod titled "${title}" focuses on ${category} enhancements with ${features.length} key feature${features.length > 1 ? "s" : ""}. The implementation will leverage existing vault patterns and follow the ncaa27-mod/3.1 schema for maximum compatibility and maintainability.`;
}

function generateReasoning(title: string, category: CategoryId, features: Feature[]): string {
  return `The mod "${title}" addresses ${category} gameplay by implementing ${features.length} feature${features.length > 1 ? "s" : ""}. Each feature is designed to enhance realism while maintaining game balance and performance. The code strategy prioritizes reusing proven patterns from the vault to minimize development time and maximize reliability.`;
}

function generateWorkflowSuggestions(features: Feature[]): string[] {
  const suggestions: string[] = [];
  
  suggestions.push("Start with the highest-priority feature and get it working end-to-end before moving to the next");
  suggestions.push("Use hot-reload variables extensively to test different configurations without restarting");
  suggestions.push("Test each feature in isolation before integrating with others");
  suggestions.push("Document all variables and hooks as you build them");
  suggestions.push("Create a test playbook that exercises all features systematically");
  
  if (features.some((f) => f.codeStrategy === "extend")) {
    suggestions.push("When extending existing mods, preserve the original author's naming conventions");
  }
  
  if (features.some((f) => f.codeStrategy === "rewrite")) {
    suggestions.push("When rewriting patterns, keep the original logic as comments for reference");
  }
  
  return suggestions;
}
