// Utility for generating individual document sections using AI
// POC VERSION: Uses mock content instead of Azure OpenAI

import { DocumentSection } from './sectionParser';
import { getMockSectionContent, simulateAIGeneration } from './mockDocumentContent';

/**
 * Generate a specific section using mock content (POC)
 * Simulates AI generation with a 5-second delay per section
 */
export const generateSection = async (
  sectionTitle: string,
  documentContext: {
    title: string;
    category: string;
    justification: string;
    additionalContext: string;
    language: 'english' | 'arabic' | 'bilingual';
  },
  existingSections: DocumentSection[],
  azureConfig: {
    baseUrl: string;
    apiKey: string;
  }
): Promise<string> => {
  try {
    console.log(`[POC] Generating section: ${sectionTitle}`);
    
    // Simulate AI generation delay (5 seconds per section)
    await simulateAIGeneration(5000);
    
    // Get mock content for this section
    const content = getMockSectionContent(sectionTitle);
    
    console.log(`[POC] Section generated: ${sectionTitle}`);
    return content;
  } catch (error) {
    console.error('Error generating section:', error);
    throw error;
  }
};

/**
 * Batch generate multiple sections (POC version)
 */
export const generateMultipleSections = async (
  sectionTitles: string[],
  documentContext: any,
  existingSections: DocumentSection[],
  azureConfig: any,
  onProgress?: (completed: number, total: number) => void
): Promise<{ [sectionTitle: string]: string }> => {
  const results: { [sectionTitle: string]: string } = {};
  let completed = 0;

  for (const title of sectionTitles) {
    try {
      const content = await generateSection(
        title,
        documentContext,
        existingSections,
        azureConfig
      );
      results[title] = content;
      completed++;
      if (onProgress) {
        onProgress(completed, sectionTitles.length);
      }
    } catch (error) {
      console.error(`Failed to generate section: ${title}`, error);
      results[title] = `## ${title}\n\n*Failed to generate this section. Please try again.*`;
      completed++;
      if (onProgress) {
        onProgress(completed, sectionTitles.length);
      }
    }
  }

  return results;
};
