# Quick Activation: 2-Minute Setup

## What You Need to Do

### Single Change Required:

Open `src/App.tsx` and change **ONE LINE**:

```typescript
// Line ~30 (approximately)
// CHANGE THIS:
import DocWriter from './pages/DocWriter';

// TO THIS:
import DocWriter from './pages/DocWriterEnhanced';
```

**That's it!** 🎉

---

## What This Gives You

✅ **All original features** - Everything works exactly as before
✅ **Plus section-by-section generation** - New powerful feature
✅ **Backward compatible** - No breaking changes
✅ **Same user interface** - Familiar workflow with enhancements

---

## How Users Will Experience It

### Before (Original):
1. Fill form → Generate → Get full document → Edit → Send

### After (Enhanced):
1. Fill form → Generate → **Choose mode:**
   - **Full document** (same as before) ✅
   - **Section-by-section** (NEW!) ✨
2. If section mode:
   - See document outline
   - Generate sections individually
   - Reorder sections
   - Regenerate specific sections
3. Edit → Send

---

## Files Created (Already Done)

✅ `src/utils/sectionParser.ts` - Section management logic
✅ `src/utils/sectionGenerator.ts` - AI section generation
✅ `src/components/docwriter/SectionNavigator.tsx` - Section UI
✅ `src/pages/DocWriterEnhanced.tsx` - Enhanced page

---

## Test It

1. Start your dev server: `npm run dev`
2. Go to: `/manage-requests`
3. Select a request
4. Click "Generate Document in AI DocWriter"
5. Fill the form
6. Click "Next" → "Generate Document"
7. When prompted: "Would you like to generate section by section?"
   - Click **OK** for section mode (NEW)
   - Click **Cancel** for full document (ORIGINAL)

---

## Visual Guide

### Section Mode Interface:

```
┌─────────────────────────────────────────────────────────────┐
│  AI DocWriter - Section Mode                                │
├─────────────┬───────────────────────────────┬───────────────┤
│             │                               │               │
│  SECTIONS   │    DOCUMENT EDITOR            │   COMMENTS    │
│             │                               │               │
│  ✓ Intro    │  # Document Title             │   💬 Latest   │
│  ○ Defs     │                               │   comments    │
│  ○ Purpose  │  ## Introduction              │               │
│  ✓ Policy   │  Content here...              │   📜 Version  │
│             │                               │   history     │
│  [Generate  │                               │               │
│   All]      │                               │               │
│             │                               │               │
└─────────────┴───────────────────────────────┴───────────────┘
```

### Section Navigator Features:

- ✓ = Generated section (green checkmark)
- ○ = Not generated (gray circle)
- ✨ = Generate button
- 🔄 = Regenerate button
- ↑↓ = Move up/down buttons

---

## Rollback (If Needed)

Change the same line back:

```typescript
// Revert to:
import DocWriter from './pages/DocWriter';
```

---

## That's All!

You now have a powerful section-by-section document generation system integrated into your platform. The P&P team can generate documents with fine-grained control over each section.

**Questions?** Check:
- `INTEGRATION_GUIDE.md` - Detailed setup
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `FLOW_ANALYSIS.md` - Complete flow documentation
