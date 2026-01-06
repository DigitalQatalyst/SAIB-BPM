// Utility for parsing markdown documents into manageable sections

export interface DocumentSection {
  id: string;
  title: string;
  level: number; // 1 for #, 2 for ##, etc.
  content: string;
  startLine: number;
  endLine: number;
  generated: boolean;
  order: number;
}

/**
 * Parse a markdown document into sections based on headers
 */
export const parseDocumentSections = (markdown: string): DocumentSection[] => {
  const lines = markdown.split('\n');
  const sections: DocumentSection[] = [];
  let currentSection: Partial<DocumentSection> | null = null;
  let sectionContent: string[] = [];
  let lineNumber = 0;
  let sectionOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: sectionContent.join('\n').trim(),
          endLine: i - 1,
          generated: true,
        } as DocumentSection);
      }

      // Start new section
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      
      currentSection = {
        id: `section-${sectionOrder}`,
        title,
        level,
        startLine: i,
        order: sectionOrder,
      };
      
      sectionContent = [line];
      sectionOrder++;
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: sectionContent.join('\n').trim(),
      endLine: lines.length - 1,
      generated: true,
    } as DocumentSection);
  }

  return sections;
};

/**
 * Reconstruct markdown document from sections
 */
export const reconstructDocument = (sections: DocumentSection[]): string => {
  return sections
    .sort((a, b) => a.order - b.order)
    .map(section => section.content)
    .join('\n\n');
};

/**
 * Get section types for a policy document
 */
export const getPolicySectionTypes = (): string[] => {
  return [
    'Abbreviations',
    'Definitions',
    'Introduction',
    'Policy Definition',
    'Purpose of this Policy',
    'Bank\'s Documents Used in Tandem',
    'Regulatory Reference Documents',
    'Ownership and Updates',
    'Governance & Roles Statement',
    'Department Strategy Statement',
    'Architecture Definition Statement',
    'Transformation Portfolio Statement',
    'Operating Model Statement',
    'Operational Control Statement',
    'Stakeholder Value Statement',
    'Intelligence & Insights Statement',
    'Systems & Tools Statement',
    'Process Flow Diagram',
    'Language Dominance in Discrepancies',
  ];
};

/**
 * Create a placeholder section
 */
export const createPlaceholderSection = (
  title: string,
  level: number,
  order: number
): DocumentSection => {
  const headerPrefix = '#'.repeat(level);
  return {
    id: `section-${order}`,
    title,
    level,
    content: `${headerPrefix} ${title}\n\n*This section has not been generated yet. Click "Generate Section" to create content.*`,
    startLine: 0,
    endLine: 0,
    generated: false,
    order,
  };
};

/**
 * Update a specific section in the document
 */
export const updateSection = (
  sections: DocumentSection[],
  sectionId: string,
  newContent: string
): DocumentSection[] => {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, content: newContent, generated: true }
      : section
  );
};

/**
 * Reorder sections
 */
export const reorderSections = (
  sections: DocumentSection[],
  fromIndex: number,
  toIndex: number
): DocumentSection[] => {
  const result = Array.from(sections);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update order property
  return result.map((section, index) => ({
    ...section,
    order: index,
  }));
};

/**
 * Get section by ID
 */
export const getSectionById = (
  sections: DocumentSection[],
  sectionId: string
): DocumentSection | undefined => {
  return sections.find(section => section.id === sectionId);
};
