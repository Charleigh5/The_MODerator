# Mod Library System

## Overview

The Mod Library system provides comprehensive session and mod management capabilities, allowing users to save, organize, edit, and track the history of their NCAA 27 mods.

## Features

### 1. Session Management
- **Start New Sessions**: Create fresh mod creation sessions
- **Save Current Session**: Automatically saves progress to localStorage
- **Resume Sessions**: Pick up where you left off with any saved session
- **Rename Sessions**: Give meaningful names to your sessions
- **Delete Sessions**: Clean up old or unwanted sessions

### 2. Mod Library
- **Browse All Mods**: View all saved mods in a searchable list
- **Search & Filter**: Find mods by name, description, category, or tags
- **Mod Details**: View comprehensive information about each mod
- **Version History**: Track all changes made to each mod
- **Status Management**: Mark mods as draft, active, or archived

### 3. Mod Editing
- **Edit Mod Metadata**: Update name, description, and tags
- **Resume Editing**: Load a mod back into the workspace
- **Version Tracking**: Automatic version control with change notes
- **Full History**: Complete audit trail of all modifications

### 4. Data Persistence
- **localStorage**: All data persisted in browser storage
- **Automatic Saves**: Sessions auto-save as you work
- **Manual Saves**: Save mods to library when ready
- **No Data Loss**: Everything persists across browser sessions

## Data Structure

### ModEntry
```typescript
interface ModEntry {
  id: string;                    // Unique identifier
  name: string;                  // Mod name
  description: string;           // Detailed description
  category: string;              // Category (recruiting, playbook, etc.)
  createdAt: number;             // Creation timestamp
  modifiedAt: number;            // Last modification timestamp
  sessionId: string;             // Associated session ID
  versions: ModVersion[];        // Version history
  currentVersion: number;        // Current version number
  tags: string[];                // Searchable tags
  status: "draft" | "active" | "archived";  // Mod status
}
```

### ModVersion
```typescript
interface ModVersion {
  version: number;               // Version number
  timestamp: number;             // When this version was created
  changes: string[];             // List of changes made
  bundle?: any;                  // Bundle data for this version
}
```

## User Interface

### Top Bar Controls
- **LIBRARY Button**: Opens the mod library panel
  - Shows badge with mod count
  - Slide-in panel from right
  - Click outside to close

- **SAVE Button**: Saves current mod to library
  - Only enabled when bundle exists
  - Creates new version with change notes
  - Updates mod metadata

- **NEW BINDER Button**: Creates new session
  - Clears current workspace
  - Starts fresh mod creation

### Mod Library Panel
- **Search Bar**: Filter mods by keyword
- **Mod List**: Sorted by last modified
- **Mod Details**: Expanded view with full information
- **Action Buttons**: Edit, delete, resume, view details
- **Version History**: Collapsible timeline of changes
- **Edit Modal**: Update mod name and description

## Workflow

### Creating a New Mod
1. Click "NEW BINDER" to start fresh session
2. Chat with CODEWRIGHT to define mod
3. Answer questions and select stretch ideas
4. Build and test the mod
5. Click "SAVE" to add to library
6. Mod is saved with version 1

### Editing an Existing Mod
1. Click "LIBRARY" to open mod library
2. Search or browse for your mod
3. Click on mod to view details
4. Click "Resume Editing" to load mod
5. Make changes in the workspace
6. Click "SAVE" to create new version
7. Change notes are automatically recorded

### Managing Mod Library
1. Open library panel
2. Search for mods by keyword
3. Click mod to view details
4. Edit metadata (name, description)
5. View version history
6. Delete unwanted mods (with confirmation)
7. Filter by status (draft/active/archived)

## API Reference

### Storage Functions

```typescript
// Load mod library from localStorage
loadModLibrary(): ModLibrary

// Save mod library to localStorage
saveModLibrary(library: ModLibrary): void

// Add new mod to library
addModToLibrary(
  library: ModLibrary,
  mod: Omit<ModEntry, "id" | "createdAt" | "modifiedAt" | "versions" | "currentVersion">,
  bundle?: any
): ModEntry

// Update existing mod
updateModInLibrary(
  library: ModLibrary,
  modId: string,
  updates: Partial<Pick<ModEntry, "name" | "description" | "tags" | "status">>,
  bundle?: any,
  changeNotes?: string[]
): ModEntry | null

// Rename mod
renameModInLibrary(
  library: ModLibrary,
  modId: string,
  newName: string
): ModEntry | null

// Delete mod
deleteModFromLibrary(library: ModLibrary, modId: string): boolean

// Get mod by ID
getModFromLibrary(library: ModLibrary, modId: string): ModEntry | null

// Get specific version
getModVersion(mod: ModEntry, version: number): ModVersion | null

// Search mods
searchMods(library: ModLibrary, query: string): ModEntry[]

// Get mods by category
getModsByCategory(library: ModLibrary, category: string): ModEntry[]

// Get recent mods
getRecentMods(library: ModLibrary, limit?: number): ModEntry[]

// Format version history
formatModHistory(mod: ModEntry): string[]
```

## Components

### ModLibraryPanel
Main panel component for browsing and managing mods.

**Props:**
- `onResumeMod: (mod: ModEntry) => void` - Callback to resume editing
- `onEditMod: (mod: ModEntry) => void` - Callback to view details

**Features:**
- Search functionality
- Mod list with sorting
- Detail view with metadata
- Version history display
- Edit modal for metadata
- Delete with confirmation

### TopBar
Updated to include library and save controls.

**New Props:**
- `modCount: number` - Number of mods in library
- `onToggleLibrary: () => void` - Toggle library panel
- `onSaveMod: () => void` - Save current mod
- `canSave: boolean` - Whether save is available

## Storage Keys

- `gridiron.modLibrary.v1` - Mod library data
- `gridiron.sessions.v1` - Session binders
- `gridiron.memory.v1` - Agent memory

## Best Practices

### Naming Conventions
- Use descriptive mod names
- Include category in name if helpful
- Keep names concise but clear

### Descriptions
- Write clear, detailed descriptions
- Explain what the mod does
- Note any special features or requirements

### Tags
- Use consistent tag naming
- Include category tags
- Add feature-specific tags
- Keep tags lowercase

### Version Control
- Save frequently to create versions
- Add meaningful change notes
- Review history before major changes
- Keep old versions for reference

### Status Management
- **Draft**: Work in progress
- **Active**: Ready to use
- **Archived**: No longer maintained

## Tips & Tricks

### Efficient Workflow
1. Create new binder for each mod
2. Save to library when bundle is ready
3. Use descriptive names and descriptions
4. Add relevant tags for easy searching
5. Review version history before editing

### Search Tips
- Search by mod name
- Search by description keywords
- Search by category
- Search by tags
- Combine multiple keywords

### Organization
- Use consistent naming patterns
- Categorize mods properly
- Tag mods consistently
- Archive old mods instead of deleting
- Keep descriptions up to date

## Troubleshooting

### Mod Not Saving
- Ensure bundle is built first
- Check localStorage is not full
- Verify active session exists

### Can't Find Mod
- Check search spelling
- Try different keywords
- Check if mod was deleted
- Verify mod was saved to library

### Version History Missing
- Ensure mod was saved multiple times
- Check if localStorage was cleared
- Verify mod wasn't deleted and recreated

## Future Enhancements

### Planned Features
- **Export/Import**: Share mods between users
- **Cloud Sync**: Sync across devices
- **Mod Marketplace**: Share mods with community
- **Collaboration**: Multi-user editing
- **Advanced Search**: Filter by multiple criteria
- **Mod Templates**: Start from templates
- **Dependency Management**: Track mod dependencies
- **Automated Testing**: Test mods before saving

### Potential Improvements
- **Diff Viewer**: Compare versions
- **Rollback**: Restore previous versions
- **Branching**: Create mod variants
- **Merge**: Combine mod changes
- **Annotations**: Add notes to versions
- **Attachments**: Include files with mods
- **Previews**: Preview mod effects
- **Analytics**: Track mod usage

## Technical Details

### Storage Limits
- localStorage typically limited to 5-10MB
- Large bundles may consume significant space
- Consider archiving old mods to free space

### Performance
- Mod library loads on demand
- Search is client-side and fast
- Version history loads with mod details
- Large libraries may slow initial load

### Browser Compatibility
- Requires localStorage support
- Works in all modern browsers
- No external dependencies
- Offline-capable

## Security Considerations

### Data Privacy
- All data stored locally
- No server communication
- No third-party tracking
- User controls all data

### Data Integrity
- Validate data on load
- Handle corrupted data gracefully
- Provide recovery options
- Backup recommendations

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Clear browser cache if needed
- Contact support with details

---

**Gridiron Forge** - Mod Library System
*Maize & Blue · Go Blue! 🏈*
