# Drag & Drop Upload Guide

## Quick Start

The Coach's Jumbotron now supports **drag-and-drop** file uploads for your requirements documents!

## Two Ways to Upload

### Method 1: Drag & Drop (Recommended) ⭐

1. **Prepare your document** - Create a text file with your mod requirements
2. **Drag the file** - Click and hold the file from your file explorer
3. **Drop in chat** - Drag it over the Coach's Jumbotron chat area
4. **See the overlay** - A "DROP YOUR SPECS" overlay appears with animated icon
5. **Release** - Let go of the mouse button
6. **Auto-process** - Document is automatically parsed and processed

**Visual Feedback:**
- 🎯 Full-screen overlay with "DROP YOUR SPECS" message
- 📤 Animated upload icon
- 💬 Chat message with document summary
- 📊 Status indicator showing document title and feature count

### Method 2: Paperclip Button 📎

1. **Locate the paperclip** - Find the 📎 icon to the left of the "CHALK IT" button
2. **Click it** - Opens file picker dialog
3. **Select file** - Choose your requirements document
4. **Auto-process** - Same automatic processing as drag-and-drop

**Visual Feedback:**
- 📎 Paperclip icon in the input form
- 🔵 Small dot indicator when document is loaded
- 💬 Chat message with document summary
- 📊 Status indicator showing document title and feature count

## What Happens After Upload

### 1. Document Parsing
- System reads the file content
- Detects mod category (recruiting, playbook, weather, etc.)
- Extracts features from numbered lists, bullets, or headers
- Generates structured data

### 2. Chat Integration
```
📄 Uploaded: [Document Title]

[Document Summary]

Found [X] features. Processing...
```

### 3. Status Indicator
A compact status bar appears above the input showing:
- 📄 Document icon
- Document title
- Feature count
- "REPORT" button (when ready)

### 4. Feature Breakdown
For each feature, the system generates:
- ✅ 3 User Stories with acceptance criteria
- ✅ "Not Supposed To" boundaries
- ✅ Required outcomes
- ✅ Test plans
- ✅ Code source recommendations

### 5. Report Generation
Click "REPORT" button to download:
- 📊 Executive summary with stats
- 🔄 Visual creation flow diagram
- 📋 Detailed feature sections
- 🎯 Code recommendations
- 💡 Workflow suggestions

## Supported File Formats

- `.txt` - Plain text files
- `.md` - Markdown files
- `.doc` - Word documents (older format)
- `.docx` - Word documents (newer format)
- `.pdf` - PDF documents (text-based)

## Document Structure Tips

### Best Practices

**Use Clear Headers:**
```markdown
# Mod Title

## Feature 1: Name
Description...

## Feature 2: Name
Description...
```

**Use Numbered Lists:**
```markdown
1. Conference Bias System
   - Add regional preferences
   - SEC schools get boost

2. Portal Surge
   - Spring window 2x rate
```

**Use Bullet Points:**
```markdown
- Dynamic Weather
  - Wind affects passing
  - Rain affects footing

- Lightning Delays
  - Trigger at intensity > 0.8
```

### What Gets Parsed

✅ **Recognized:**
- Numbered lists (1. 2. 3.)
- Bullet points (- * •)
- Headers (# ## ###)
- Clear feature descriptions
- Requirements and specifications

❌ **Not Recognized:**
- Vague paragraphs without structure
- Images or diagrams (text only)
- Complex nested structures
- Non-English content

## Visual Indicators

### During Drag
- 🎯 Full overlay with "DROP YOUR SPECS"
- 📤 Animated upload icon
- 💫 Pulsing animation
- 🌫️ Blurred background

### After Upload
- 📄 Status bar with document info
- 🔵 Dot on paperclip (if used)
- 💬 Chat message with summary
- 📊 "REPORT" button available

### Processing States
1. **Uploading** - File being read
2. **Parsing** - Extracting features
3. **Analyzing** - Generating user stories
4. **Ready** - All processing complete

## Tips & Tricks

### 💡 Pro Tips

1. **Drag from anywhere** - Works with files from:
   - File Explorer (Windows)
   - Finder (Mac)
   - Desktop
   - Downloads folder
   - Any folder

2. **Multiple formats** - Works with any text-based format:
   - Plain text
   - Markdown
   - Rich text (saved as plain)
   - Code files

3. **Quick iteration** - Upload multiple versions:
   - Each upload replaces the previous
   - Status indicator updates
   - Report regenerates

4. **Combine methods** - Use both:
   - Drag-and-drop for quick uploads
   - Paperclip for precise selection

### ⚠️ Common Issues

**File won't drop?**
- Make sure you're dropping in the chat area
- Check file format is supported
- Try the paperclip button instead

**Features not detected?**
- Use clear numbered lists or headers
- Add descriptive text for each feature
- Check document structure

**Report not generating?**
- Wait for processing to complete
- Check status indicator shows "REPORT" button
- Try uploading again

## Keyboard Shortcuts

While the feature is mouse-based, you can:
- `Tab` to navigate to paperclip button
- `Enter` or `Space` to activate paperclip
- `Esc` to cancel file picker

## Accessibility

- ✅ Keyboard accessible via paperclip button
- ✅ Screen reader compatible
- ✅ High contrast visual feedback
- ✅ Clear status indicators
- ✅ ARIA labels on interactive elements

## Examples

### Example Document Structure

```markdown
# NCAA 27 Recruiting Overhaul

## Overview
Complete overhaul of the recruiting system with regional preferences,
portal mechanics, and star rating adjustments.

## Features

### 1. Conference Bias System
Add regional preference for recruits based on conference affiliation.

**Requirements:**
- SEC schools get 1.2x boost with SEC recruits
- Big Ten schools get 1.15x boost with Big Ten recruits
- Configurable via hot-reload variables

**Expected Outcome:**
Recruits show higher interest in schools from their preferred conference.

### 2. Portal Surge Mechanic
Spring portal window has increased entry rate to create mid-season chaos.

**Requirements:**
- Spring window entry rate: 2.4x normal
- CPU coaches also use portal more aggressively
- Creates roster turnover and drama

**Expected Outcome:**
Mid-season roster changes create unpredictable dynasty progression.

### 3. Star Rating Weight
5-star recruits have higher base interest from CPU coaches.

**Requirements:**
- 5-star recruits: 1.5x base interest
- 4-star recruits: 1.2x base interest
- Player can adjust weight in settings

**Expected Outcome:**
CPU coaches prioritize high-star recruits more realistically.
```

**Result:** 3 features detected, each with full breakdown, user stories, test plans, and code recommendations.

## Integration with Workflow

The drag-and-drop upload integrates seamlessly:

1. **Upload** → Drag document into chat
2. **Process** → Automatic parsing and analysis
3. **Review** → Check status indicator and chat summary
4. **Continue** → Use features as context for Q&A
5. **Generate** → Create mod bundle with document insights
6. **Report** → Download comprehensive HTML documentation

## Support

For issues or questions:
- Check file format is supported
- Verify document structure
- Try paperclip button as alternative
- Review DOCUMENT_SYSTEM.md for details

---

**Gridiron Forge** - Drag & Drop Upload
*Maize & Blue · Go Blue! 🏈*
