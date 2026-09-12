# Contextual Stretch Ideas System

## Overview

The stretch ideas system has been completely overhauled to provide **contextually relevant suggestions** based on the user's actual MOD brief. Instead of showing generic category-based suggestions, the system now analyzes the user's input and generates stretch ideas that are specifically tailored to what they're trying to build.

## How It Works

### 1. Brief Analysis

When a user submits a brief like:
> "I want to make CPU coaches recruit more realistically with conference preferences"

The system:
1. Detects the category (recruiting)
2. Analyzes keywords in the brief
3. Matches against a pool of 48+ contextual stretch ideas
4. Scores each idea based on relevance
5. Returns the top 3 most relevant suggestions

### 2. Keyword Matching

The system uses a sophisticated scoring algorithm:

```typescript
// Category match: +10 points
if (idea.categories.includes(category)) {
  score += 10;
}

// Direct keyword match: +5 points per keyword
for (const keyword of idea.keywords) {
  if (briefLower.includes(keyword)) {
    score += 5;
  }
}

// Partial word match: +2 points per match
for (const word of words) {
  if (word.length > 3 && keyword.includes(word)) {
    score += 2;
  }
}

// Text similarity: +1 point per matching word
for (const ideaWord of ideaWords) {
  if (ideaWord.length > 4 && briefLower.includes(ideaWord)) {
    score += 1;
  }
}
```

### 3. Contextual Examples

#### Example 1: Recruiting with Conference Focus
**Brief:** "I want CPU coaches to recruit more realistically with conference preferences"

**Generated Stretch Ideas:**
- ✓ "Implement conference loyalty - coaches stay in their conference"
- ✓ "Add regional scouting bias - coaches prefer in-state recruits"
- ✓ "Create portal surge events - mid-season roster chaos"

#### Example 2: Weather with Wind Effects
**Brief:** "Make weather affect the passing game with wind"

**Generated Stretch Ideas:**
- ✓ "Add wind effects - deep passes drift downwind"
- ✓ "Implement lightning delays - stop game for storms"
- ✓ "Create field conditions - puddles slow players down"

#### Example 3: Playbook with Tempo
**Brief:** "I want a hurry-up offense with no-huddle plays"

**Generated Stretch Ideas:**
- ✓ "Implement no-huddle - rapid-fire play calling"
- ✓ "Add tempo control - hurry-up or slow it down"
- ✓ "Create formation variations - multiple looks from same set"

## Stretch Idea Pool

The system maintains a pool of **48+ contextual stretch ideas** organized by category:

### Recruiting (8 ideas)
- Regional scouting bias
- CPU poaching
- Portal surge events
- Star rating weight
- Conference loyalty
- Legacy recruiting
- Academic requirements
- Official visits

### Playbook (8 ideas)
- Audible system
- Tempo control
- Formation variations
- Situational packages
- Play action
- Screen passes
- Max protect
- No-huddle

### Weather (8 ideas)
- Wind effects
- Lightning delays
- Field conditions
- Temperature effects
- Fog visibility
- Snow accumulation
- Heat fatigue
- Humidity stamina

### Atmosphere (8 ideas)
- Crowd noise penalties
- Band celebrations
- Momentum shifts
- Night game multiplier
- Camera shake
- Student sections
- Rivalry intensity
- Fourth-quarter comebacks

### Difficulty (8 ideas)
- CPU tendency adjustment
- Late-game IQ
- Rubber-band removal
- Red zone aggression
- Injury realism
- Coordinator personalities
- Adaptive difficulty
- Scout team preparation

### Rules (8 ideas)
- First-down runoff
- Targeting review
- Overtime formats
- Spike window extension
- Clock management
- Penalty enforcement
- Challenge system
- Two-minute warning

## Fallback System

If the contextual analysis doesn't find enough relevant matches (score < threshold), the system falls back to **category defaults**:

```typescript
function getCategoryDefaults(category: CategoryId): string[] {
  const defaults: Record<CategoryId, string[]> = {
    recruiting: [
      "Add regional scouting bias - coaches prefer in-state recruits",
      "Implement CPU poaching - other teams actively target your commits",
      "Create portal surge events - mid-season roster chaos",
    ],
    // ... other categories
  };
  return defaults[category];
}
```

This ensures users always see relevant suggestions, even with vague briefs.

## Technical Implementation

### File Structure

```
src/lib/stretchIdeas.ts          # Core stretch idea logic
src/App.tsx                      # Integration with startBrief
src/components/AgentChat.tsx     # Display contextual ideas
```

### Key Functions

#### `generateContextualStretchIdeas(brief, category, count)`

Main function that generates contextual stretch ideas:

```typescript
export function generateContextualStretchIdeas(
  brief: string,
  category: CategoryId,
  count: number = 3
): string[]
```

**Parameters:**
- `brief`: User's MOD description
- `category`: Detected category (recruiting, playbook, etc.)
- `count`: Number of ideas to return (default: 3)

**Returns:** Array of 3 contextual stretch idea strings

#### `getCategoryDefaults(category)`

Fallback function for generic suggestions:

```typescript
function getCategoryDefaults(category: CategoryId): string[]
```

**Returns:** Array of 3 default stretch ideas for the category

### Integration Flow

1. **User submits brief** → `startBrief(text)` in App.tsx
2. **Category detected** → `detectCategory(text)`
3. **Contextual ideas generated** → `generateContextualStretchIdeas(text, cat.id, 3)`
4. **Stored in QAState** → `setQa({ ..., expansions: contextualExpansions, ... })`
5. **Displayed in UI** → AgentChat renders `qa.expansions`

## Benefits

### 1. Relevance
- Suggestions match what the user actually wants
- No more generic, unrelated ideas
- Each suggestion enhances the specific MOD being built

### 2. User Experience
- Users see ideas that make sense for their MOD
- Reduces cognitive load
- Helps users think of features they might not have considered

### 3. Quality
- Higher quality suggestions lead to better MODs
- Users are more likely to select stretch ideas
- Creates more complete, feature-rich MODs

### 4. Intelligence
- System learns from keywords and context
- Adapts to different types of briefs
- Provides value beyond simple category matching

## Example Scenarios

### Scenario 1: Specific Brief
**User:** "I want realistic weather that affects passing with wind and rain"

**System Analysis:**
- Category: weather
- Keywords: "weather", "passing", "wind", "rain"
- High matches: wind effects, field conditions, lightning delays

**Result:** Highly relevant suggestions that enhance the weather MOD

### Scenario 2: Vague Brief
**User:** "Make recruiting better"

**System Analysis:**
- Category: recruiting
- Keywords: "recruiting"
- Low specific matches, falls back to defaults

**Result:** Still provides useful recruiting suggestions via fallback

### Scenario 3: Multi-Feature Brief
**User:** "I want CPU to recruit realistically and also make weather affect gameplay"

**System Analysis:**
- Category: recruiting (first detected)
- Keywords: "recruit", "realistic", "weather", "gameplay"
- Mixed matches from both categories

**Result:** Primarily recruiting suggestions with some weather crossover

## Future Enhancements

### Planned Improvements

1. **Machine Learning**
   - Train model on successful MODs
   - Predict which stretch ideas users will select
   - Improve scoring algorithm over time

2. **User Preferences**
   - Track which stretch ideas users select
   - Personalize suggestions based on history
   - Learn user's modding style

3. **Dynamic Pool**
   - Allow users to suggest new stretch ideas
   - Community-voted stretch ideas
   - Expand pool based on popular demand

4. **Advanced NLP**
   - Better natural language understanding
   - Detect intent beyond keywords
   - Understand complex, multi-sentence briefs

5. **Contextual Depth**
   - Analyze previous Q&A answers
   - Adjust stretch ideas based on user preferences
   - Provide more personalized suggestions

## Testing

### Test Cases

1. **Keyword-heavy brief** → Should match many ideas
2. **Vague brief** → Should fall back to defaults
3. **Multi-category brief** → Should prioritize first detected category
4. **Specific feature request** → Should match exact feature ideas
5. **No matches** → Should always provide fallback suggestions

### Validation

- All 48+ stretch ideas have proper keywords
- Scoring algorithm produces relevant results
- Fallback system works correctly
- UI displays ideas correctly
- Integration with QAState works seamlessly

## Summary

The contextual stretch ideas system transforms the MOD creation experience from generic suggestions to **intelligent, personalized recommendations**. By analyzing the user's brief and matching against a comprehensive pool of ideas, the system provides stretch suggestions that genuinely enhance the MOD being built.

This creates a more engaging, intelligent, and valuable user experience that helps users create better MODs while discovering features they might not have considered.
