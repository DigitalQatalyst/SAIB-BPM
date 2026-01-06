# Activation Steps - Follow These Exactly

## ✅ Step 1: Verify Files Exist

Run these commands to verify all files are in place:

```bash
# Check if enhanced DocWriter exists
Test-Path src/pages/DocWriterEnhanced.tsx
# Should return: True

# Check if mock content exists
Test-Path src/utils/mockDocumentContent.ts
# Should return: True

# Check if section navigator exists
Test-Path src/components/docwriter/SectionNavigator.tsx
# Should return: True
```

## ✅ Step 2: Verify App.tsx Change

Open `src/App.tsx` and verify line ~40 says:
```typescript
import DocWriter from './pages/DocWriterEnhanced';
```

NOT:
```typescript
import DocWriter from './pages/DocWriter';  // ❌ OLD
```

## ✅ Step 3: Restart Development Server

**IMPORTANT:** You MUST restart your dev server for changes to take effect!

1. **Stop current server:**
   - Press `Ctrl+C` in your terminal
   - Wait for it to fully stop

2. **Start server again:**
   ```bash
   npm run dev
   ```

3. **Wait for compilation:**
   - Watch for "ready" or "compiled successfully" message
   - Check for any errors in red

## ✅ Step 4: Clear Browser Cache

1. Open your browser
2. Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
3. Select "Cached images and files"
4. Click "Clear data"
5. **Or** do a hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R`)

## ✅ Step 5: Test the Flow

### Test 1: Navigate to DocWriter

1. Go to: `http://localhost:5173/manage-requests` (or your dev URL)
2. Click on any request
3. Click "Generate Document in AI DocWriter"
4. You should see the **Document Generation Form**

### Test 2: Check for Enhanced Features

Look for these indicators that you're using the enhanced version:

**✅ You should see:**
- Form with "Document Title", "Category", "Language" fields
- "Next" button (not "Generate Document" immediately)
- Two-step process (Info → Additional Documents)

**❌ You should NOT see:**
- Immediate document editor
- Old single-step form
- Different layout

### Test 3: Generate Document

1. Fill out the form:
   - Title: "Test Policy"
   - Category: "Information Security"
   - Language: "English Only"
   - Justification: "Test"

2. Click "Next"

3. Click "Generate Document"

4. **IMPORTANT:** When prompted "Would you like to generate section by section?"
   - Click "Cancel" for full document (30 seconds)
   - Click "OK" for section mode (new feature)

5. **For Full Document:**
   - You should see a **progress bar**
   - Percentage should update: 0% → 100%
   - Takes exactly 30 seconds
   - Then shows document with SAMA content

6. **For Section Mode:**
   - You should see **Section Navigator** on the left
   - List of sections with ✓ and ○ icons
   - Buttons: ✨ (generate), 🔄 (regenerate), ↑↓ (move)

## 🐛 Troubleshooting

### Issue: Still seeing old DocWriter

**Solution:**
1. Verify `src/App.tsx` has correct import
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors (F12)

### Issue: "Module not found" error

**Solution:**
1. Check file exists: `Test-Path src/pages/DocWriterEnhanced.tsx`
2. If missing, the file wasn't created properly
3. Check for typos in import statement
4. Run `npm install` to ensure dependencies

### Issue: TypeScript errors

**Solution:**
1. Check console output when running `npm run dev`
2. Look for red error messages
3. Common issues:
   - Missing imports
   - Type mismatches
   - Syntax errors

### Issue: Progress bar not showing

**Solution:**
1. Make sure you clicked "Cancel" when prompted (for full document mode)
2. Check browser console (F12) for JavaScript errors
3. Verify `mockDocumentContent.ts` exists

### Issue: Section Navigator not appearing

**Solution:**
1. Make sure you clicked "OK" when prompted (for section mode)
2. Check if `SectionNavigator.tsx` exists
3. Look for console errors

### Issue: "Generating..." button stuck

**Solution:**
1. This means you're still using the OLD DocWriter
2. Double-check `src/App.tsx` import
3. Restart dev server
4. Clear browser cache

## 📸 What You Should See

### Step 1: Form (Info)
```
┌─────────────────────────────────────┐
│ Document Generation Form            │
│                                     │
│ Document Title: [____________]      │
│ Category: [____________]            │
│ Source: [____________]              │
│ Language: [English Only ▼]          │
│ Justification: [____________]       │
│ Additional Context: [____________]  │
│                                     │
│         [Cancel]  [Next →]          │
└─────────────────────────────────────┘
```

### Step 2: Additional Documents
```
┌─────────────────────────────────────┐
│ Additional Documents                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📄 Upload or drag & drop   │   │
│  └─────────────────────────────┘   │
│                                     │
│    [← Back]  [Generate Document]    │
└─────────────────────────────────────┘
```

### Step 3: Generation (Full Document)
```
┌─────────────────────────────────────┐
│ Generating document... 45%          │
│ ████████████░░░░░░░░░░░░░░░░        │
│ AI is analyzing your request and    │
│ generating the document...          │
└─────────────────────────────────────┘
```

### Step 4: Section Mode
```
┌──────────┬────────────────┬──────────┐
│ SECTIONS │    EDITOR      │ SIDEBAR  │
│          │                │          │
│ ✓ Title  │ # Document     │ Comments │
│ ○ Abbrev │                │          │
│ ○ Defs   │ Content here   │ History  │
│ ...      │                │          │
└──────────┴────────────────┴──────────┘
```

## ✅ Success Checklist

- [ ] `src/App.tsx` imports `DocWriterEnhanced`
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Can navigate to form
- [ ] Form has two steps (Info → Additional Docs)
- [ ] "Generate Document" shows progress bar
- [ ] Full document appears after 30 seconds
- [ ] OR section mode shows navigator
- [ ] No errors in browser console
- [ ] No errors in terminal

## 🎉 You're Ready!

Once all checkboxes are ✅, your POC is fully activated and ready to demonstrate!

**Next:** Try generating a document and see the SAMA circular content appear.
