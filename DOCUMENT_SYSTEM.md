# Gridiron Forge - Document-Driven MOD Creation System

## Overview

Gridiron Forge now includes a comprehensive document-driven mod creation system that allows you to upload requirements documents, automatically parse them into structured features, generate user stories, identify code sources from the vault, and create detailed HTML reports with visual flowcharts.

## New Features

### 1. Document Upload & Processing

**Location**: Coach's Jumbotron (Chat Panel) → Chalk Tray → "UPLOAD SPECS" button

**Supported Formats**: `.txt`, `.md`, `.doc`, `.docx`

**How It Works**:
1. Click "UPLOAD SPECS" to select your requirements document
2. The system parses the document and extracts:
   - Mod title and category
   - Individual features (from numbered lists, bullet points, or headers)
   - Feature descriptions and requirements
3. A summary is posted to the chat showing what was found
4. The parsed document is stored for report generation

**Document Parsing Logic**:
- Detects mod category from keywords (recruiting, playbook, weather, atmosphere, difficulty, rules)
- Extracts features by looking for:
  - Numbered lists (1. Feature Name)
  - Bullet points (- Feature Name, * Feature Name)
  - Headers (# Feature Name, ## Feature Name)
- Generates structured data for each feature

### 2. Feature Breakdown System

For each feature found in the document, the system generates:

#### User Stories (3 per feature)
1. **Player Experience Story**: How the player will experience the feature
2. **Strategic Impact Story**: How coaches/players will use it strategically
3. **Technical Implementation Story**: How modders will implement it

Each story includes:
- As a [role]
- I want [capability]
- So that [benefit]
- Acceptance criteria (3-5 testable conditions)

#### "Not Supposed To" List
Clear boundaries of what the feature should NOT do:
- Prevents scope creep
- Avoids conflicts with existing systems
- Maintains game balance

#### Required Outcome
Specific technical requirements:
- Must integrate with NCAA 27 mod framework
- Must use hot-reload variables
- Must follow ncaa27-mod/3.1 schema
- Must pass all test cases

#### Test Plan
Detailed verification steps:
- Load into exhibition mode
- Test edge cases
- Verify hot-reload functionality
- Check for conflicts
- Performance testing

### 3. Code Source Recommendation Engine

For each feature, the system recommends which existing mods to pull code from:

**Analysis Factors**:
- Category match (recruiting, playbook, weather, etc.)
- Mod reliability score
- Pattern compatibility
- Feature overlap

**Reuse Strategies**:
1. **EXTEND**: Mod already has solid framework, extend its hooks/variables
2. **REWRITE**: Mod has useful patterns but needs significant changes
3. **REFERENCE**: Mod is highly reliable, reference its structure but write new logic

**Recommendations Include**:
- Mod name and platform
- Specific patterns to use
- Reliability score and rating
- Reasoning for the recommendation

### 4. Visual HTML Report Generator

**Location**: Coach's Jumbotron → "DOWNLOAD REPORT" button (appears after document upload)

**Report Contents**:

#### Executive Summary
- Mod title and category
- Feature count
- User story count
- Code source count
- Strategy breakdown

#### Creation Flow Visualization
Visual flowchart showing:
1. Document Analysis
2. Feature Breakdown
3. Code Source Identification
4. Strategy Selection
5. Implementation Plan

#### Detailed Feature Sections
For each feature:
- Feature card with description and strategy badge
- User stories with acceptance criteria
- "Not Supposed To" warnings
- Required outcome
- Test plan
- Code source recommendations with reasoning
- Implementation reasoning

#### Workflow Improvement Suggestions
AI-generated suggestions for:
- Development order
- Testing strategies
- Code organization
- Documentation practices

**Report Styling**:
- Michigan Wolverines theme (maize and blue)
- Responsive design
- Print-friendly
- Visual hierarchy with cards, badges, and flowcharts
- Color-coded strategy badges (extend/rewrite/new)

### 5. Integration with Existing Workflow

The document system integrates seamlessly with the existing mod creation flow:

1. **Upload Document** → System parses and posts summary
2. **Continue Chat** → Use the parsed features as context for Q&A
3. **Generate Bundle** → System uses document insights to inform code generation
4. **Download Report** → Get comprehensive HTML documentation

## Usage Examples

### Example 1: Simple Feature Document

```markdown
# Recruiting Overhaul Mod

1. Conference Bias System
   - Add regional preference for recruits
   - SEC schools get boost with SEC recruits
   - Big Ten schools get boost with Big Ten recruits

2. Portal Surge Mechanic
   - Spring portal window has 2x entry rate
   - Creates mid-season roster chaos
   - CPU coaches also use portal more aggressively

3. Star Rating Weight
   - 5-star recruits have higher base interest
   - CPU coaches prioritize stars more realistically
   - Player can adjust weight in settings
```

**Result**: 3 features parsed, each with 3 user stories, test plans, and code source recommendations from Recruiting Overhaul '26, Transfer Portal Chaos, and Redshirt Realism mods.

### Example 2: Technical Specification

```markdown
# Weather System Enhancement

## Dynamic Wind Model
- Vector-based wind affecting passing game
- Wind direction changes throughout game
- Deep balls drift downwind

## Lightning Delays
- Trigger when storm intensity > 0.8
- Show locker room cutscene
- Pause game clock

## Field Conditions
- Puddles form in low areas
- Players slow in puddle zones
- Affects cutting and breaks
```

**Result**: 3 features parsed with detailed technical requirements, test plans for different weather scenarios, and recommendations from True Weather Systems mod.

## Technical Implementation

### Document Processor (`src/lib/documentProcessor.ts`)
- Parses text documents
- Detects category from keywords
- Extracts features using pattern matching
- Generates user stories, test plans, and recommendations
- Determines code strategy (extend/rewrite/new)

### Report Generator (`src/lib/reportGenerator.ts`)
- Creates styled HTML report
- Visual flowchart of creation process
- Detailed feature breakdowns
- Code source recommendations
- Workflow suggestions
- Michigan theme styling

### Integration Points
- File upload handler in AgentChat component
- Document parsing on file selection
- Report download functionality
- Chat integration for document summaries

## Benefits

1. **Structured Requirements**: Turn vague ideas into detailed specifications
2. **User-Centric Design**: Every feature has clear user stories
3. **Test-Driven Development**: Comprehensive test plans for each feature
4. **Code Reuse**: Intelligent recommendations for vault patterns
5. **Documentation**: Automatic HTML reports for reference
6. **Workflow Optimization**: AI suggestions for development order
7. **Quality Assurance**: Clear boundaries and acceptance criteria

## Future Enhancements

Potential additions:
- Export to PDF format
- Integration with project management tools
- Collaborative document editing
- Version control for requirements
- Automated test generation
- Code scaffolding from requirements
- Real-time collaboration features

## Support

For questions or issues:
- Check the Pattern Vault for existing mods
- Review the HTML report for detailed reasoning
- Use the CLI for advanced commands
- Consult the Coach's Memory for past decisions

---

**Gridiron Forge** - Document-Driven MOD Creation System
*Maize & Blue · Go Blue! 🏈*
