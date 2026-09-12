import type { CategoryId } from "../types";

interface StretchIdea {
  text: string;
  keywords: string[];
  categories: CategoryId[];
}

const STRETCH_IDEA_POOL: StretchIdea[] = [
  // Recruiting stretch ideas
  {
    text: "Add regional scouting bias - coaches prefer in-state recruits",
    keywords: ["recruit", "recruiting", "regional", "state", "local", "home"],
    categories: ["recruiting"],
  },
  {
    text: "Implement CPU poaching - other teams actively target your commits",
    keywords: ["poach", "steal", "compete", "rival", "cpu"],
    categories: ["recruiting"],
  },
  {
    text: "Create portal surge events - mid-season roster chaos",
    keywords: ["portal", "transfer", "chaos", "mid-season", "surge"],
    categories: ["recruiting"],
  },
  {
    text: "Add star rating weight - 5-star recruits get more attention",
    keywords: ["star", "rating", "5-star", "elite", "premium"],
    categories: ["recruiting"],
  },
  {
    text: "Implement conference loyalty - coaches stay in their conference",
    keywords: ["conference", "loyalty", "preference", "affinity"],
    categories: ["recruiting"],
  },
  {
    text: "Add legacy recruiting - children of alumni get boosts",
    keywords: ["legacy", "alumni", "family", "heritage", "tradition"],
    categories: ["recruiting"],
  },
  {
    text: "Create academic requirements - GPA affects eligibility",
    keywords: ["academic", "gpa", "grades", "school", "education"],
    categories: ["recruiting"],
  },
  {
    text: "Implement official visits - in-person recruiting events",
    keywords: ["visit", "official", "campus", "tour", "recruit"],
    categories: ["recruiting"],
  },

  // Playbook stretch ideas
  {
    text: "Add audible system - change plays at the line",
    keywords: ["audible", "change", "adjust", "audible", "line"],
    categories: ["playbook"],
  },
  {
    text: "Implement tempo control - hurry-up or slow it down",
    keywords: ["tempo", "hurry", "speed", "pace", "clock"],
    categories: ["playbook"],
  },
  {
    text: "Create formation variations - multiple looks from same set",
    keywords: ["formation", "variation", "look", "shift", "motion"],
    categories: ["playbook"],
  },
  {
    text: "Add situational packages - goal-line, 3rd down, 2-minute",
    keywords: ["situational", "goal-line", "third-down", "package", "special"],
    categories: ["playbook"],
  },
  {
    text: "Implement play action - fake handoff, deep pass",
    keywords: ["play-action", "fake", "handoff", "deep", "pass"],
    categories: ["playbook"],
  },
  {
    text: "Create screen passes - quick hits to running backs",
    keywords: ["screen", "quick", "running-back", "short", "pass"],
    categories: ["playbook"],
  },
  {
    text: "Add max protect - keep extra blockers for deep shots",
    keywords: ["protect", "block", "deep", "shot", "sack"],
    categories: ["playbook"],
  },
  {
    text: "Implement no-huddle - rapid-fire play calling",
    keywords: ["no-huddle", "rapid", "fast", "quick", "tempo"],
    categories: ["playbook"],
  },

  // Weather stretch ideas
  {
    text: "Add wind effects - deep passes drift downwind",
    keywords: ["wind", "drift", "deep", "pass", "weather"],
    categories: ["weather"],
  },
  {
    text: "Implement lightning delays - stop game for storms",
    keywords: ["lightning", "storm", "delay", "safety", "weather"],
    categories: ["weather"],
  },
  {
    text: "Create field conditions - puddles slow players down",
    keywords: ["field", "puddle", "wet", "slow", "condition"],
    categories: ["weather"],
  },
  {
    text: "Add temperature effects - cold affects kicking accuracy",
    keywords: ["temperature", "cold", "kick", "accuracy", "freeze"],
    categories: ["weather"],
  },
  {
    text: "Implement fog - reduced visibility for deep balls",
    keywords: ["fog", "visibility", "deep", "view", "obscure"],
    categories: ["weather"],
  },
  {
    text: "Create snow accumulation - field gets worse over time",
    keywords: ["snow", "accumulate", "field", "worse", "build"],
    categories: ["weather"],
  },
  {
    text: "Add heat effects - players fatigue faster in heat",
    keywords: ["heat", "hot", "fatigue", "tire", "temperature"],
    categories: ["weather"],
  },
  {
    text: "Implement humidity - affects player stamina",
    keywords: ["humidity", "stamina", "moisture", "tire", "endurance"],
    categories: ["weather"],
  },

  // Atmosphere stretch ideas
  {
    text: "Add crowd noise penalties - false starts on loud plays",
    keywords: ["crowd", "noise", "penalty", "false-start", "loud"],
    categories: ["atmosphere"],
  },
  {
    text: "Implement band celebrations - fight song on big stops",
    keywords: ["band", "celebration", "fight-song", "stop", "music"],
    categories: ["atmosphere"],
  },
  {
    text: "Create momentum shifts - big plays swing momentum",
    keywords: ["momentum", "shift", "big-play", "swing", "turn"],
    categories: ["atmosphere"],
  },
  {
    text: "Add night game multiplier - home field advantage boost",
    keywords: ["night", "game", "home-field", "advantage", "boost"],
    categories: ["atmosphere"],
  },
  {
    text: "Implement camera shake - goal-line stands shake screen",
    keywords: ["camera", "shake", "goal-line", "stand", "screen"],
    categories: ["atmosphere"],
  },
  {
    text: "Create student sections - coordinated cheers and chants",
    keywords: ["student", "section", "cheer", "chant", "coordinate"],
    categories: ["atmosphere"],
  },
  {
    text: "Add rivalry intensity - bigger games have louder crowds",
    keywords: ["rivalry", "intensity", "big-game", "loud", "important"],
    categories: ["atmosphere"],
  },
  {
    text: "Implement fourth-quarter comebacks - crowds rally late",
    keywords: ["fourth-quarter", "comeback", "rally", "late", "crowd"],
    categories: ["atmosphere"],
  },

  // Difficulty stretch ideas
  {
    text: "Add CPU tendency adjustment - learns your play patterns",
    keywords: ["cpu", "tendency", "learn", "pattern", "adjust"],
    categories: ["difficulty"],
  },
  {
    text: "Implement late-game IQ - CPU plays smarter in 4th quarter",
    keywords: ["late-game", "iq", "smart", "fourth-quarter", "clutch"],
    categories: ["difficulty"],
  },
  {
    text: "Create rubber-band removal - no catch-up scripting",
    keywords: ["rubber-band", "catch-up", "script", "remove", "fair"],
    categories: ["difficulty"],
  },
  {
    text: "Add red zone aggression - CPU scores more inside 20",
    keywords: ["red-zone", "aggression", "score", "inside-20", "touchdown"],
    categories: ["difficulty"],
  },
  {
    text: "Implement injury realism - contact affects severity",
    keywords: ["injury", "realism", "contact", "severity", "medical"],
    categories: ["difficulty"],
  },
  {
    text: "Create coordinator personalities - different CPU styles",
    keywords: ["coordinator", "personality", "style", "cpu", "character"],
    categories: ["difficulty"],
  },
  {
    text: "Add adaptive difficulty - CPU adjusts to your skill",
    keywords: ["adaptive", "difficulty", "adjust", "skill", "dynamic"],
    categories: ["difficulty"],
  },
  {
    text: "Implement scout team - CPU prepares for your tendencies",
    keywords: ["scout", "team", "prepare", "tendency", "game-plan"],
    categories: ["difficulty"],
  },

  // Rules stretch ideas
  {
    text: "Add first-down runoff - clock stops on first downs",
    keywords: ["first-down", "runoff", "clock", "stop", "rule"],
    categories: ["rules"],
  },
  {
    text: "Implement targeting review - instant replay booth",
    keywords: ["targeting", "review", "replay", "booth", "instant"],
    categories: ["rules"],
  },
  {
    text: "Create overtime formats - NCAA 2PT or sudden death",
    keywords: ["overtime", "format", "ncaa", "sudden-death", "extra"],
    categories: ["rules"],
  },
  {
    text: "Add spike window extension - more time to spike ball",
    keywords: ["spike", "window", "extend", "time", "clock"],
    categories: ["rules"],
  },
  {
    text: "Implement clock management - realistic play clock rules",
    keywords: ["clock", "management", "play-clock", "realistic", "rule"],
    categories: ["rules"],
  },
  {
    text: "Create penalty enforcement - realistic yardage rules",
    keywords: ["penalty", "enforcement", "yardage", "realistic", "flag"],
    categories: ["rules"],
  },
  {
    text: "Add challenge system - coach's challenge for reviews",
    keywords: ["challenge", "coach", "review", "flag", "replay"],
    categories: ["rules"],
  },
  {
    text: "Implement two-minute warning - automatic timeout",
    keywords: ["two-minute", "warning", "timeout", "automatic", "clock"],
    categories: ["rules"],
  },
];

export function generateContextualStretchIdeas(
  brief: string,
  category: CategoryId,
  count: number = 3
): string[] {
  const briefLower = brief.toLowerCase();
  const words = briefLower.split(/\s+/);
  
  // Score each stretch idea based on relevance
  const scored = STRETCH_IDEA_POOL.map((idea) => {
    let score = 0;
    
    // Check if category matches
    if (idea.categories.includes(category)) {
      score += 10;
    }
    
    // Check keyword matches
    for (const keyword of idea.keywords) {
      if (briefLower.includes(keyword)) {
        score += 5;
      }
      
      // Check partial word matches
      for (const word of words) {
        if (word.length > 3 && keyword.includes(word)) {
          score += 2;
        }
      }
    }
    
    // Check text similarity
    const ideaWords = idea.text.toLowerCase().split(/\s+/);
    for (const ideaWord of ideaWords) {
      if (ideaWord.length > 4 && briefLower.includes(ideaWord)) {
        score += 1;
      }
    }
    
    return { idea, score };
  });
  
  // Sort by score and take top N
  scored.sort((a, b) => b.score - a.score);
  
  // If no good matches, return default ideas for the category
  const topIdeas = scored
    .filter((s) => s.score > 0)
    .slice(0, count)
    .map((s) => s.idea.text);
  
  // Fallback to category defaults if not enough contextual matches
  if (topIdeas.length < count) {
    const categoryDefaults = getCategoryDefaults(category);
    const remaining = count - topIdeas.length;
    topIdeas.push(...categoryDefaults.slice(0, remaining));
  }
  
  return topIdeas;
}

function getCategoryDefaults(category: CategoryId): string[] {
  const defaults: Record<CategoryId, string[]> = {
    recruiting: [
      "Add regional scouting bias - coaches prefer in-state recruits",
      "Implement CPU poaching - other teams actively target your commits",
      "Create portal surge events - mid-season roster chaos",
    ],
    playbook: [
      "Add audible system - change plays at the line",
      "Implement tempo control - hurry-up or slow it down",
      "Create formation variations - multiple looks from same set",
    ],
    weather: [
      "Add wind effects - deep passes drift downwind",
      "Implement lightning delays - stop game for storms",
      "Create field conditions - puddles slow players down",
    ],
    atmosphere: [
      "Add crowd noise penalties - false starts on loud plays",
      "Implement band celebrations - fight song on big stops",
      "Create momentum shifts - big plays swing momentum",
    ],
    difficulty: [
      "Add CPU tendency adjustment - learns your play patterns",
      "Implement late-game IQ - CPU plays smarter in 4th quarter",
      "Create rubber-band removal - no catch-up scripting",
    ],
    rules: [
      "Add first-down runoff - clock stops on first downs",
      "Implement targeting review - instant replay booth",
      "Create overtime formats - NCAA 2PT or sudden death",
    ],
  };
  
  return defaults[category];
}
