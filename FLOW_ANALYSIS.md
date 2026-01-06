# User Flow Analysis & Implementation Status

## Current Flow Overview

### 1. User (Requester) Journey ✅ IMPLEMENTED
- **Landing Page** → User clicks "Get Started" button
- **Service Marketplace** → User browses available services
- **Service Details** → User selects "Revise Procedure Manual/Policy" (or similar policy service)
- **Policy Request Form** → User fills out the form with:
  - Policy name
  - Source of request
  - Qualifying questions (determines Major/Minor)
  - Justification
  - Description
  - File attachments
- **Form Submission** → Request is saved to localStorage
- **Acknowledgment Modal** → User receives confirmation with ticket number
- **Track Requests** → User can track their request status

### 2. P&P Team Member Journey ✅ PARTIALLY IMPLEMENTED

#### Current Implementation:
- **Manage Requests Page** → P&P team views dashboard and request list
- **Request Details (PPRequestDetails)** → Team member can:
  - View request information
  - See approval workflow
  - Update status
  - Add comments
  - **Generate Document** button → Navigates to AI DocWriter

#### AI DocWriter Features ✅ IMPLEMENTED:
- Form with document details (title, category, language, etc.)
- Additional documents upload
- **AI Generation** using Azure OpenAI
- Document editor with markdown support
- **Process Model Integration** ✅ NEW FEATURE
- Save draft functionality
- Download as Word document
- Send to approver
- Version history
- Comment section

---

## Missing Features & Gaps

### ❌ MISSING: Section-by-Section Generation
**Current State:** The AI generates the entire document at once.

**Required Feature:** 
- P&P team member should be able to:
  1. Select specific sections to generate
  2. Generate individual sections on demand
  3. Move/reorder sections
  4. Regenerate specific sections without affecting others

### ❌ MISSING: Section Management UI
**What's Needed:**
- Section selector/navigator in DocWriter
- "Generate Section" button for each section
- "Move Section Up/Down" buttons
- "Regenerate Section" button
- Section outline/table of contents view

### ❌ MISSING: Automatic Section Detection
**What's Needed:**
- Parse document structure to identify sections
- Display sections in a manageable list
- Allow selection of sections for generation

---

## Implementation Plan

### Phase 1: Section Management Infrastructure
1. **Create Section Parser Utility**
   - Parse markdown document into sections
   - Identify section headers (##, ###, etc.)
   - Extract section content

2. **Update Document Context**
   - Add section management functions
   - Store sections separately
   - Track section generation status

### Phase 2: UI Components
1. **Section Navigator Component**
   - Display document outline
   - Show section generation status
   - Allow section selection

2. **Section Generator Component**
   - "Generate This Section" button
   - Section-specific prompts
   - Progress indicators

3. **Section Reordering Component**
   - Drag-and-drop interface
   - Move up/down buttons
   - Visual feedback

### Phase 3: AI Integration
1. **Section-Specific Prompts**
   - Create targeted prompts for each section type
   - Context-aware generation
   - Maintain document consistency

2. **Incremental Generation**
   - Generate one section at a time
   - Preserve existing sections
   - Update document structure

### Phase 4: Enhanced Features
1. **Section Templates**
   - Pre-defined section structures
   - Section-specific guidelines
   - Regulatory compliance checks

2. **Section Collaboration**
   - Comments on specific sections
   - Section-level version history
   - Section approval workflow

---

## Technical Architecture

### Current Files to Modify:
1. **src/pages/DocWriter.tsx** - Add section management UI
2. **src/context/DocumentContext.tsx** - Add section state management
3. **src/utils/** - Create new section utilities

### New Files to Create:
1. **src/components/docwriter/SectionNavigator.tsx**
2. **src/components/docwriter/SectionGenerator.tsx**
3. **src/components/docwriter/SectionReorder.tsx**
4. **src/utils/sectionParser.ts**
5. **src/utils/sectionGenerator.ts**

---

## User Flow with Section Generation (PROPOSED)

### Enhanced P&P Team Flow:
1. P&P team member opens request in Manage Requests
2. Clicks "Generate Document in AI DocWriter"
3. **NEW:** DocWriter shows document outline with sections
4. **NEW:** Team member can:
   - Click "Generate" next to any section
   - Select multiple sections to generate
   - Reorder sections using drag-and-drop
   - Regenerate specific sections
5. AI generates selected sections automatically
6. Team member reviews and edits
7. Sends to approver

---

## Priority Recommendations

### HIGH PRIORITY:
1. ✅ Basic document generation (DONE)
2. ✅ Process model integration (DONE)
3. ❌ **Section-by-section generation** (NEEDED)
4. ❌ **Section navigator UI** (NEEDED)

### MEDIUM PRIORITY:
5. ❌ Section reordering
6. ❌ Section-specific regeneration
7. ✅ Version history (DONE)
8. ✅ Comments (DONE)

### LOW PRIORITY:
9. Section templates
10. Section-level approval
11. Advanced section analytics

---

## Next Steps

1. **Implement Section Parser** - Parse existing documents into sections
2. **Create Section Navigator** - UI to display and manage sections
3. **Add Section Generation** - Generate individual sections on demand
4. **Implement Section Reordering** - Allow moving sections up/down
5. **Test End-to-End Flow** - Verify complete user journey

