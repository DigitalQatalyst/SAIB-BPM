# Integration Guide: Activating Section-by-Section Document Generation

## Quick Start (5 Minutes)

### Step 1: Update App Routing

Open `src/App.tsx` and replace the DocWriter import:

```typescript
// BEFORE:
import DocWriter from './pages/DocWriter';

// AFTER:
import DocWriter from './pages/DocWriterEnhanced';
```

That's it! The enhanced version is backward compatible and includes all original features plus the new section management.

---

## Alternative Integration Methods

### Method 1: Side-by-Side (Recommended for Testing)

Keep both versions available during testing:

```typescript
// In src/App.tsx
import DocWriter from './pages/DocWriter';
import DocWriterEnhanced from './pages/DocWriterEnhanced';

// In your routes:
<Route path="/docwriter/:requestId" element={<DocWriter />} />
<Route path="/docwriter-enhanced/:requestId" element={<DocWriterEnhanced />} />
```

Then update the button in `PPRequestDetails.tsx`:

```typescript
// Change from:
onClick={() => handleQuickAction('generate')}

// To:
onClick={() => navigate(`/docwriter-enhanced/${requestId}`)}
```

### Method 2: Feature Flag

Add a feature flag for gradual rollout:

```typescript
// In src/config.ts (create if doesn't exist)
export const FEATURES = {
  ENHANCED_DOCWRITER: true, // Set to false to use original
};

// In src/App.tsx
import { FEATURES } from './config';
import DocWriter from './pages/DocWriter';
import DocWriterEnhanced from './pages/DocWriterEnhanced';

// In routes:
<Route 
  path="/docwriter/:requestId" 
  element={FEATURES.ENHANCED_DOCWRITER ? <DocWriterEnhanced /> : <DocWriter />} 
/>
```

---

## Verification Steps

### 1. Check File Structure

Ensure these files exist:
```
src/
├── utils/
│   ├── sectionParser.ts          ✓ NEW
│   └── sectionGenerator.ts       ✓ NEW
├── components/
│   └── docwriter/
│       └── SectionNavigator.tsx  ✓ NEW
└── pages/
    ├── DocWriter.tsx             ✓ EXISTING
    └── DocWriterEnhanced.tsx     ✓ NEW
```

### 2. Test the Flow

1. Navigate to `/manage-requests`
2. Select any request
3. Click "Generate Document in AI DocWriter"
4. Fill out the form
5. Click "Next" → "Generate Document"
6. When prompted, choose "Yes" for section mode
7. Verify Section Navigator appears on the left
8. Click sparkle icon (✨) next to any section
9. Watch AI generate that specific section
10. Try moving sections up/down with arrow buttons

### 3. Verify Features

- [ ] Section Navigator displays on left sidebar
- [ ] Sections show status (generated/not generated)
- [ ] Generate button works for individual sections
- [ ] Regenerate button works for existing sections
- [ ] Move up/down buttons reorder sections
- [ ] "Generate All Missing Sections" button works
- [ ] Manual edits update sections correctly
- [ ] Save draft preserves section structure
- [ ] Download Word includes all sections
- [ ] Send to Approver works as before

---

## Troubleshooting

### Issue: Section Navigator doesn't appear

**Solution:** Make sure you selected "Yes" when prompted for section mode. The prompt appears after clicking "Generate Document" on the Additional Documents step.

### Issue: AI generation fails

**Solution:** Check Azure OpenAI credentials in DocWriterEnhanced.tsx:
```typescript
const azureOpenAIBaseUrl = 'YOUR_AZURE_ENDPOINT';
const azureOpenAIApiKey = 'YOUR_API_KEY';
```

### Issue: Sections not parsing correctly

**Solution:** Ensure document uses standard markdown headers:
```markdown
# Main Title
## Section 1
### Subsection 1.1
## Section 2
```

### Issue: TypeScript errors

**Solution:** Run `npm install` to ensure all dependencies are installed, then restart your development server.

---

## Configuration Options

### Customize Section Types

Edit `src/utils/sectionParser.ts` to modify default sections:

```typescript
export const getPolicySectionTypes = (): string[] => {
  return [
    'Your Custom Section 1',
    'Your Custom Section 2',
    // Add more sections as needed
  ];
};
```

### Adjust AI Generation

Edit `src/utils/sectionGenerator.ts` to customize prompts:

```typescript
const constructSectionPrompt = (
  sectionTitle: string,
  documentContext: any,
  existingContext: string
): string => {
  // Customize your prompt here
  return `Your custom prompt for ${sectionTitle}...`;
};
```

### Modify Section Navigator UI

Edit `src/components/docwriter/SectionNavigator.tsx` to change appearance:

```typescript
// Change colors, icons, layout, etc.
```

---

## Performance Considerations

### API Rate Limits

The section-by-section approach makes multiple API calls. To optimize:

1. **Batch Generation:** Use "Generate All Missing Sections" for bulk operations
2. **Caching:** Consider caching generated sections
3. **Throttling:** Add delays between rapid section generations

### Large Documents

For documents with many sections:

1. **Lazy Loading:** Load sections on demand
2. **Pagination:** Paginate section list in navigator
3. **Virtual Scrolling:** Implement virtual scrolling for large section lists

---

## Rollback Plan

If you need to revert to the original DocWriter:

### Quick Rollback:

```typescript
// In src/App.tsx, change back to:
import DocWriter from './pages/DocWriter';
```

### Keep Enhanced Version for Future:

```typescript
// Rename the import:
import DocWriterOriginal from './pages/DocWriter';
import DocWriterEnhanced from './pages/DocWriterEnhanced';

// Use original:
<Route path="/docwriter/:requestId" element={<DocWriterOriginal />} />
```

---

## Support & Maintenance

### Code Locations:

- **Section Logic:** `src/utils/sectionParser.ts`
- **AI Generation:** `src/utils/sectionGenerator.ts`
- **UI Component:** `src/components/docwriter/SectionNavigator.tsx`
- **Main Page:** `src/pages/DocWriterEnhanced.tsx`

### Common Modifications:

1. **Add new section types:** Edit `getPolicySectionTypes()` in `sectionParser.ts`
2. **Change AI behavior:** Edit `constructSectionPrompt()` in `sectionGenerator.ts`
3. **Modify UI:** Edit `SectionNavigator.tsx`
4. **Add features:** Extend `DocWriterEnhanced.tsx`

---

## Next Steps

1. ✅ Integrate the enhanced DocWriter
2. ✅ Test with sample requests
3. ✅ Train P&P team on new features
4. ✅ Monitor usage and gather feedback
5. ✅ Iterate based on user needs

---

## Questions?

Refer to:
- `FLOW_ANALYSIS.md` - Complete flow documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- Code comments in each file
- TypeScript interfaces for data structures

---

## Success Metrics

Track these metrics to measure success:

- Time saved per document
- Number of sections regenerated (indicates refinement)
- User satisfaction scores
- Document quality improvements
- Reduction in approval cycles

---

**Ready to go! 🚀**

The section-by-section document generation is fully implemented and ready for use. Simply update your routing and start generating documents with unprecedented control and flexibility.
