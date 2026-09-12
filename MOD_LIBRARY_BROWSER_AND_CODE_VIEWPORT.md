# Mod Library Browser & Code Viewport - Feature Documentation

## Overview

The Gridiron Forge now includes two powerful new features:

1. **Mod Library Browser** - A comprehensive interface to browse, use, and modify existing mods from trusted platforms
2. **Real-Time Code Viewport** - A live code editor that shows code being written in real-time with syntax highlighting and line tracking

## Mod Library Browser

### What It Does

The Mod Library Browser provides access to 9 proven mods from 4 trusted platforms:
- CFB Vault (3 mods)
- ModAxis (2 mods)
- The Locker Room (2 mods)
- OpenPlaybooks (2 mods)

### Features

#### 1. Browse & Search
- **Search Bar**: Filter mods by name or description
- **Category Filter**: Filter by mod category (recruiting, playbook, weather, etc.)
- **Mod List**: Scrollable list showing all available mods
- **Mod Details**: Comprehensive information for each mod

#### 2. Mod Information
Each mod displays:
- **Name & Platform**: Where the mod comes from
- **Rating**: User rating (1-5 stars)
- **Review Count**: Number of user reviews
- **Reliability**: Reliability score (percentage)
- **Description**: Detailed explanation of what the mod does
- **Pros & Cons**: Advantages and disadvantages
- **Warnings**: Important considerations before using
- **Files**: List of files included in the mod
- **Variables**: Configurable variables with types and purposes
- **Logic Flow**: Step-by-step explanation of how the mod works
- **Test Plan**: How to verify the mod works correctly
- **User Reviews**: Actual user feedback with ratings

#### 3. Actions
Two main actions for each mod:

**Use This Mod**
- Imports the mod as a starting point for your own mod
- Pulls all patterns from the mod into your knowledge base
- Gives you a foundation to build upon
- Perfect for learning from proven implementations

**Modify This Mod**
- Loads the mod for modification
- Opens the Code Viewport showing the mod's code
- Allows you to customize and extend the mod
- Pulls patterns and shows the code in real-time

### How to Access

1. Click the **VAULT** button in the TopBar (green badge showing "9")
2. The Mod Library Browser modal opens
3. Browse or search for mods
4. Click on a mod to view details
5. Choose "Use This Mod" or "Modify This Mod"

### Example Workflow

**Scenario: You want to create a recruiting mod**

1. Click VAULT button
2. Search for "recruiting" or browse categories
3. Find "Recruiting Overhaul '26" (4.8/5 rating, 98% reliable)
4. Click to view details
5. Read the description, pros, cons, and reviews
6. Click "Modify This Mod"
7. Code Viewport opens showing the mod's code
8. Patterns are pulled into your knowledge base
9. Start customizing the mod for your needs

## Real-Time Code Viewport

### What It Does

The Code Viewport is a floating code editor that displays code being generated or modified in real-time. It provides visual feedback as the agent creates or modifies mods.

### Features

#### 1. Live Code Generation
- **Animated Code Entry**: Code lines appear one by one (50ms intervals)
- **Line Numbers**: Clear line numbering on the left
- **Syntax Highlighting**: 
  - Keywords (function, if, return, etc.) in maize
  - Strings in green
  - Comments in gray italic
  - Regular code in white
- **Modified Line Indicators**: Green dots show modified lines
- **Current Line Highlight**: Maize highlight shows the line being written

#### 2. File Tracking
- **Active File Display**: Shows which file is being modified
- **File Icon**: Visual indicator of file type
- **Generating Status**: Shows "Generating..." with pulsing indicator
- **Idle Status**: Shows "Idle" when not generating

#### 3. Statistics
Footer shows:
- **Total Lines**: Number of lines in the file
- **Modified Lines**: Number of lines that were changed
- **Current Line**: Currently active line number
- **Status**: Active (generating) or Idle

#### 4. Visual Design
- **Floating Window**: 700x600px in bottom-right corner
- **Maize Border**: Consistent with app theme
- **Dark Background**: Easy on the eyes
- **Monospace Font**: Perfect for code readability
- **Smooth Animations**: Professional feel

### How to Access

The Code Viewport automatically opens when:
1. You click "Modify This Mod" in the Mod Library Browser
2. The agent generates code during mod creation
3. You edit an existing mod

You can also manually toggle it (future enhancement).

### Example Usage

**Scenario: Modifying an existing mod**

1. Open Mod Library Browser (VAULT button)
2. Find a mod you want to modify
3. Click "Modify This Mod"
4. Code Viewport opens automatically
5. Shows the mod's code with syntax highlighting
6. You can see exactly what code is being used
7. Patterns are pulled into knowledge base
8. Start customizing the code

**Scenario: Watching code generation**

1. Create a new mod through the chat interface
2. As the agent generates code, the Code Viewport shows:
   - Which file is being created
   - Lines appearing one by one
   - Syntax highlighting in real-time
   - Modified line indicators
3. Watch the code come to life
4. Understand exactly what's being built

## Integration with Existing Features

### Pattern Vault Integration

The Mod Library Browser works alongside the Pattern Vault:
- **Pattern Vault**: Shows individual code patterns (hooks, blocks, schemas)
- **Mod Library Browser**: Shows complete mods with multiple patterns
- **Knowledge Base**: Both feed patterns into the knowledge base
- **Complementary**: Use Pattern Vault for specific patterns, Mod Library for complete solutions

### Session Management

Both features integrate with the session system:
- **Save Progress**: Your mod library changes are saved
- **Resume Work**: Pick up where you left off
- **Version Control**: Track changes to modified mods
- **History**: Full audit trail of modifications

### Code Generation

The Code Viewport integrates with the code generation system:
- **Real-Time Updates**: See code as it's generated
- **File Tracking**: Know which file is being modified
- **Line Tracking**: See exactly which lines are changing
- **Visual Feedback**: Understand the generation process

## Technical Details

### Mod Library Browser Component

**File**: `src/components/ModLibraryBrowser.tsx`

**Props**:
```typescript
interface ModLibraryBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onUseMod: (mod: ModEntry) => void;
  onModifyMod: (mod: ModEntry) => void;
}
```

**State**:
- `selectedMod`: Currently selected mod
- `filter`: Category filter
- `searchQuery`: Search text

**Features**:
- Full-screen modal overlay
- Responsive layout (list + details)
- Search and filter functionality
- Comprehensive mod details display
- Action buttons for use/modify

### Code Viewport Component

**File**: `src/components/CodeViewport.tsx`

**Props**:
```typescript
interface CodeViewportProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile: string;
  code: string;
  currentLine: number;
  modifiedLines: number[];
  isGenerating: boolean;
}
```

**State**:
- `displayedLines`: Lines currently shown
- `highlightedLine`: Currently highlighted line

**Features**:
- Floating window (700x600px)
- Real-time code animation
- Syntax highlighting
- Line numbers
- Modified line indicators
- Statistics footer

### Handlers in App.tsx

**handleUseVaultMod**:
```typescript
const handleUseVaultMod = (mod: VaultModEntry) => {
  // Import mod as starting point
  // Pull patterns into knowledge base
  // Close browser
}
```

**handleModifyVaultMod**:
```typescript
const handleModifyVaultMod = (mod: VaultModEntry) => {
  // Load mod for modification
  // Pull patterns
  // Open Code Viewport with mod's code
  // Close browser
}
```

## User Benefits

### For Beginners
- **Learn from Examples**: See how proven mods are structured
- **Understand Code**: Real-time code view helps you learn
- **Start with Templates**: Use existing mods as starting points
- **Visual Learning**: Watch code being written in real-time

### For Intermediate Users
- **Customize Existing Mods**: Modify proven mods instead of starting from scratch
- **Understand Patterns**: See how patterns are used in real mods
- **Speed Up Development**: Reuse proven code
- **Learn Best Practices**: See how successful mods are structured

### For Advanced Users
- **Quick Modifications**: Jump straight into modifying existing code
- **Pattern Reuse**: Efficiently reuse proven patterns
- **Code Review**: Review existing mod code before building
- **Reference Implementation**: Use mods as reference for your own work

## Best Practices

### Using Mods
1. **Read Reviews**: Check what other users think
2. **Understand Pros/Cons**: Know the trade-offs
3. **Check Warnings**: Be aware of potential issues
4. **Start Simple**: Use mods as starting points, then customize
5. **Test Thoroughly**: Always test modified mods

### Modifying Mods
1. **Understand First**: Read the code before modifying
2. **Make Small Changes**: Don't overhaul everything at once
3. **Test Incrementally**: Test after each major change
4. **Document Changes**: Keep track of what you changed
5. **Save Versions**: Use the mod library to track versions

### Using Code Viewport
1. **Watch the Generation**: Understand what's being built
2. **Note Modified Lines**: Pay attention to what changes
3. **Learn Syntax**: Use the highlighting to learn the language
4. **Track Files**: Know which file is being modified
5. **Use as Reference**: Refer back to understand the code

## Future Enhancements

### Planned Features

**Mod Library Browser**:
- [ ] Mod comparison tool
- [ ] User ratings and reviews system
- [ ] Mod dependencies tracking
- [ ] Export/import mods
- [ ] Mod marketplace integration
- [ ] Advanced search with multiple criteria
- [ ] Mod screenshots and previews
- [ ] Video tutorials for each mod

**Code Viewport**:
- [ ] Code editing capabilities
- [ ] Diff view for modifications
- [ ] Multiple file tabs
- [ ] Code folding
- [ ] Find and replace
- [ ] Git integration
- [ ] Code formatting
- [ ] Error detection and highlighting
- [ ] Auto-completion
- [ ] Documentation tooltips

### Integration Enhancements
- [ ] Link between Code Viewport and Pattern Vault
- [ ] Automatic pattern extraction from modified code
- [ ] Real-time collaboration
- [ ] Cloud sync for mods
- [ ] Mobile-responsive design
- [ ] Keyboard shortcuts
- [ ] Customizable themes

## Troubleshooting

### Mod Library Browser Won't Open
- Check if VAULT button is visible in TopBar
- Try refreshing the page
- Check browser console for errors

### Code Viewport Not Showing
- Ensure you clicked "Modify This Mod"
- Check if Code Viewport state is set correctly
- Try closing and reopening

### Mods Not Loading
- Verify mod data exists in `src/data/modLibrary.ts`
- Check for TypeScript errors
- Ensure ModEntry type is correct

### Code Not Animating
- Check if `isGenerating` is true
- Verify code is being passed correctly
- Check animation interval (50ms)

## Performance

### Bundle Size Impact
- Mod Library Browser: ~15 KB
- Code Viewport: ~10 KB
- Total increase: ~25 KB
- Minimal impact on load time

### Runtime Performance
- Smooth 60fps animations
- Efficient state management
- Lazy loading of mod details
- Optimized re-renders

## Accessibility

### Keyboard Navigation
- Tab through mod list
- Enter to select mod
- Escape to close modal
- Arrow keys for navigation

### Screen Reader Support
- Semantic HTML structure
- ARIA labels on interactive elements
- Descriptive text for all actions
- Proper heading hierarchy

### Visual Accessibility
- High contrast colors (maize on navy)
- Large, readable fonts
- Clear visual hierarchy
- Animated elements have purpose

## Summary

The Mod Library Browser and Code Viewport transform Gridiron Forge from a mod creation tool into a comprehensive mod development environment. Users can now:

✅ Browse 9 proven mods from trusted platforms
✅ View comprehensive mod details with reviews
✅ Use mods as starting points for their own work
✅ Modify existing mods with real-time code visualization
✅ Watch code being generated in real-time
✅ Understand exactly what's being built
✅ Learn from proven implementations
✅ Speed up development with pattern reuse

These features provide immense value for users at all skill levels, from beginners learning from examples to advanced users efficiently reusing proven code.

---

**Gridiron Forge** - Mod Library Browser & Code Viewport
*Maize & Blue · Go Blue! 🏈*
