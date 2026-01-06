# Complete User Flow Diagram

## 🎯 End-to-End User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER (REQUESTER)                            │
└─────────────────────────────────────────────────────────────────────┘

    1. Landing Page
       │
       ├─→ Click "Get Started"
       │
    2. Service Marketplace
       │
       ├─→ Browse services
       ├─→ Search/Filter
       │
    3. Service Details
       │
       ├─→ View "Revise Procedure Manual/Policy"
       ├─→ Click "Request This Service"
       │
    4. Policy Request Form
       │
       ├─→ Fill policy name
       ├─→ Select source of request
       ├─→ Answer qualifying questions (Major/Minor)
       ├─→ Enter justification
       ├─→ Add description
       ├─→ Upload attachments
       ├─→ Click "Submit Request"
       │
    5. Acknowledgment Modal
       │
       ├─→ Receive ticket number (e.g., REQ-2024-001)
       ├─→ Click "Track Requests"
       │
    6. Track Requests Page
       │
       └─→ Monitor request status
           - Pending
           - In Review
           - Needs Revision
           - Approved
           - Completed

┌─────────────────────────────────────────────────────────────────────┐
│                      P&P TEAM MEMBER                                │
└─────────────────────────────────────────────────────────────────────┘

    1. Manage Requests Page
       │
       ├─→ View Dashboard
       │   - Pending requests
       │   - In review
       │   - Statistics
       │
       ├─→ View Request List
       │   - Filter by status
       │   - Search requests
       │
    2. Select Request (REQ-2024-001)
       │
       ├─→ View Request Details
       │   - Requester info
       │   - Request description
       │   - Priority
       │   - SLA dates
       │
       ├─→ Quick Actions:
       │   - Assign Request
       │   - Approve Request
       │   - Reject Request
       │   - ✨ Generate Document in AI DocWriter ✨
       │
    3. Click "Generate Document in AI DocWriter"
       │
       └─→ Navigate to DocWriter

┌─────────────────────────────────────────────────────────────────────┐
│                    AI DOCWRITER (ENHANCED)                          │
└─────────────────────────────────────────────────────────────────────┘

    STEP 1: Document Information Form
    ┌─────────────────────────────────────┐
    │ Document Title: [____________]      │
    │ Category: [____________]            │
    │ Source: [____________]              │
    │ Language: [English ▼]               │
    │   - English Only                    │
    │   - Arabic Only                     │
    │   - Bilingual                       │
    │ Justification: [____________]       │
    │ Additional Context: [____________]  │
    │                                     │
    │         [Cancel]  [Next →]          │
    └─────────────────────────────────────┘
           │
           ├─→ Click "Next"
           │
    STEP 2: Additional Documents
    ┌─────────────────────────────────────┐
    │ Upload Additional Documents         │
    │                                     │
    │  ┌─────────────────────────────┐   │
    │  │  📄 Drag & Drop or Browse   │   │
    │  │  DOC, PDF, TXT, MD, XML     │   │
    │  └─────────────────────────────┘   │
    │                                     │
    │  Selected: policy_draft.docx        │
    │                                     │
    │    [← Back]  [Generate Document]    │
    └─────────────────────────────────────┘
           │
           ├─→ Click "Generate Document"
           │
    STEP 3: Choose Generation Mode
    ┌─────────────────────────────────────┐
    │  Would you like to generate the     │
    │  document section by section?       │
    │                                     │
    │  This gives you more control over   │
    │  each part of the document.         │
    │                                     │
    │         [No]  [Yes]                 │
    └─────────────────────────────────────┘
           │
           ├─────────────┬─────────────────┐
           │             │                 │
        [No]          [Yes]                │
           │             │                 │
           │             │                 │
    ┌──────▼──────┐  ┌──▼──────────────┐  │
    │   FULL      │  │   SECTION       │  │
    │  DOCUMENT   │  │   MODE          │  │
    │   MODE      │  │   (NEW!)        │  │
    └─────────────┘  └─────────────────┘  │
           │                 │             │
           │                 │             │
    Generate entire    Initialize with     │
    document at once   placeholder sections│
           │                 │             │
           │                 │             │
           └─────────────────┴─────────────┘
                         │
                         │
    STEP 4: Document Editor
    ┌─────────────────────────────────────────────────────────────┐
    │  AI DocWriter - Section Mode                                │
    ├─────────────┬───────────────────────────────┬───────────────┤
    │             │                               │               │
    │  📋 SECTION │    📝 DOCUMENT EDITOR         │  💬 SIDEBAR   │
    │  NAVIGATOR  │                               │               │
    │             │  ┌─────────────────────────┐  │  Comments     │
    │  Document   │  │ # Policy Title          │  │  ┌─────────┐ │
    │  Sections   │  │                         │  │  │ User A  │ │
    │  (12/18)    │  │ ## Abbreviations        │  │  │ "Good!" │ │
    │             │  │ | Term | Full Form |    │  │  └─────────┘ │
    │  ✓ Title    │  │ |------|-----------|    │  │              │
    │  ✓ Abbrev   │  │ | SAIB | Saudi...  |    │  │  Version     │
    │  ✓ Defs     │  │                         │  │  History     │
    │  ○ Intro    │  │ ## Definitions          │  │  ┌─────────┐ │
    │  ○ Purpose  │  │ | Term | Definition |   │  │  │ v1.0    │ │
    │  ✓ Policy   │  │ |------|-----------|    │  │  │ v1.1    │ │
    │  ○ Refs     │  │ | Bank | SAIB...    |   │  │  └─────────┘ │
    │  ...        │  │                         │  │              │
    │             │  │ ## Introduction         │  │              │
    │  [Generate  │  │ *Not generated yet*     │  │              │
    │   All       │  │                         │  │              │
    │   Missing]  │  └─────────────────────────┘  │              │
    │             │                               │              │
    │  Each       │  [Process Model] [Save]       │              │
    │  section:   │  [Download Word] [Send →]     │              │
    │  ✨ Generate│                               │              │
    │  🔄 Regen   │                               │              │
    │  ↑↓ Move    │                               │              │
    │             │                               │              │
    └─────────────┴───────────────────────────────┴───────────────┘

    SECTION ACTIONS:
    
    A. Generate Individual Section
       │
       ├─→ Click ✨ next to "Introduction"
       │
       ├─→ AI generates section content
       │   - Uses section-specific prompt
       │   - Considers existing sections
       │   - Maintains document consistency
       │
       └─→ Section updates in real-time
           ○ Introduction → ✓ Introduction

    B. Regenerate Section
       │
       ├─→ Click 🔄 next to "Policy"
       │
       ├─→ AI regenerates with new content
       │
       └─→ Section replaced with new version

    C. Move Section
       │
       ├─→ Click ↑ or ↓ next to section
       │
       ├─→ Section reorders in document
       │
       └─→ Document structure updates

    D. Generate All Missing
       │
       ├─→ Click "Generate All Missing Sections"
       │
       ├─→ AI generates all ○ sections
       │   - Processes in sequence
       │   - Shows progress
       │
       └─→ All sections marked ✓

    E. Manual Edit
       │
       ├─→ Edit content in textarea
       │
       ├─→ Sections auto-parse
       │
       └─→ Navigator updates

    STEP 5: Finalize & Submit
    ┌─────────────────────────────────────┐
    │  Document Actions:                  │
    │                                     │
    │  [🔗 Create Process Model]          │
    │  - Link visual process diagram      │
    │  - Auto-embeds in document          │
    │                                     │
    │  [💾 Save Draft]                    │
    │  - Save current state               │
    │  - Continue later                   │
    │                                     │
    │  [📥 Download as Word]              │
    │  - Formatted DOCX                   │
    │  - SAIB branding                    │
    │  - Process model embedded           │
    │                                     │
    │  [📤 Send to Approver]              │
    │  - Submit for approval              │
    │  - Enters workflow                  │
    │                                     │
    └─────────────────────────────────────┘
           │
           ├─→ Click "Send to Approver"
           │
    STEP 6: Approval Workflow
    ┌─────────────────────────────────────┐
    │  Approval Status: In Review         │
    │                                     │
    │  Approvers:                         │
    │  ✓ Mohammed Al-Qahtani (Approved)  │
    │  ⏳ Khalid Al-Otaibi (Pending)     │
    │  ⏳ Fatima Al-Harbi (Pending)      │
    │                                     │
    │  Timeline:                          │
    │  • Request submitted                │
    │  • Document generated               │
    │  • Sent to approvers                │
    │  • Approval 1 received              │
    │  • Awaiting approval 2              │
    │                                     │
    └─────────────────────────────────────┘
           │
           ├─→ All approvers approve
           │
    STEP 7: Publication
    ┌─────────────────────────────────────┐
    │  Status: Approved ✓                 │
    │                                     │
    │  [Publish Document]                 │
    │  - Publish to marketplace           │
    │  - Make available to users          │
    │  - Complete request                 │
    │                                     │
    └─────────────────────────────────────┘
           │
           ├─→ Click "Publish Document"
           │
    STEP 8: Completion
    ┌─────────────────────────────────────┐
    │  Status: Completed ✓                │
    │                                     │
    │  Document published to:             │
    │  📚 Policy & Procedure Marketplace  │
    │                                     │
    │  Request REQ-2024-001 closed        │
    │                                     │
    │  [View Published Document]          │
    │                                     │
    └─────────────────────────────────────┘

```

## 🔄 Status Flow

```
Request Status Flow:
Pending → In Review → Needs Revision → Approved → Completed
                ↓                ↑
                └────────────────┘
                (Revision cycle)

Document Status Flow:
Draft → In Review → Changes Requested → Approved → Published
           ↓              ↑
           └──────────────┘
           (Revision cycle)
```

## 🎨 Section Generation Flow

```
Section Generation Process:

1. User clicks "Generate Section"
   │
2. System prepares context
   ├─→ Section title
   ├─→ Document metadata
   ├─→ Existing sections
   └─→ Language preference
   │
3. Construct AI prompt
   ├─→ Section-specific instructions
   ├─→ Context from other sections
   ├─→ Regulatory requirements
   └─→ Language formatting
   │
4. Call Azure OpenAI API
   ├─→ Send prompt
   ├─→ Wait for response
   └─→ Receive generated content
   │
5. Update document
   ├─→ Replace section content
   ├─→ Mark section as generated
   ├─→ Reconstruct full document
   └─→ Update UI
   │
6. User sees result
   ├─→ Section appears in editor
   ├─→ Navigator shows ✓
   └─→ Can edit or regenerate
```

## 📊 Data Flow

```
Data Flow Architecture:

User Input
    │
    ├─→ Form State
    │   ├─→ title
    │   ├─→ category
    │   ├─→ language
    │   └─→ context
    │
    ├─→ Section State
    │   ├─→ sections[]
    │   │   ├─→ id
    │   │   ├─→ title
    │   │   ├─→ content
    │   │   ├─→ generated
    │   │   └─→ order
    │   │
    │   └─→ selectedSectionId
    │
    ├─→ Document State
    │   ├─→ id
    │   ├─→ content (full markdown)
    │   └─→ status
    │
    └─→ Storage
        ├─→ localStorage (requests)
        ├─→ DocumentContext (documents)
        └─→ Azure OpenAI (generation)
```

## 🎯 Key Decision Points

```
Decision Tree:

Start
  │
  ├─→ Has existing document?
  │   ├─→ Yes: Load document
  │   └─→ No: Create new
  │
  ├─→ Generation mode?
  │   ├─→ Full: Generate entire document
  │   └─→ Section: Initialize sections
  │
  ├─→ Section action?
  │   ├─→ Generate: Create new content
  │   ├─→ Regenerate: Replace content
  │   ├─→ Move: Reorder sections
  │   └─→ Edit: Manual changes
  │
  └─→ Finalize?
      ├─→ Save: Store draft
      ├─→ Download: Export Word
      └─→ Submit: Send to approval
```

---

This diagram shows the complete end-to-end flow from user request submission through P&P team document generation (with the new section-by-section feature) to final publication.
