// SAIB brand colors
const SAIB_COLORS = {
  primary: '#FECC0E',
  // SAIB Gold
  secondary: '#9E800D',
  // SAIB Dark Gold
  headerBg: '#8B5A00',
  // Brown/gold color for table headers
  darkBg: '#333333',
  lightBg: '#FFFFFF',
  text: '#333333',
  lightText: '#FFFFFF'
};
// SAIB Logo URL - Using base64 data URI to ensure the logo always appears
const SAIB_LOGO_URL = 'data:image/png;base64,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';
/**
 * Converts markdown content to a Word document with SAIB branding
 * @param content Markdown content to convert
 * @param title Document title
 * @param language Document language ('english', 'arabic', or 'bilingual')
 * @param processModelImage Optional base64 image data URL for process model diagram
 * @returns Blob of the Word document
 */
export const generateWordDocument = async (
  content: string,
  title: string,
  language: string,
  processModelImage?: string
): Promise<void> => {
  try {
    // Determine if the document is RTL, bilingual, or LTR
    const isRTL = language === 'arabic';
    const isBilingual = language === 'bilingual';
    // Process the content to identify sections, tables, etc.
    const processedContent = processMarkdownContent(content, isBilingual);

    // Process model section HTML (if image provided)
    const processModelSection = processModelImage ? `
      <div class="page-break"></div>
      <div class="document-header">
        <div class="document-title-container">
          <img src="${SAIB_LOGO_URL}" alt="SAIB Logo" class="document-logo" />
          <div class="gold-bar"></div>
          <div>
            <div class="document-title">${title}</div>
            <div class="document-title-arabic">اسم السياسة</div>
          </div>
        </div>
      </div>
      <div style="margin: 20px;">
        <h2>Process Flow Diagram</h2>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${processModelImage}" alt="Process Model" style="max-width: 100%; height: auto;" />
        </div>
      </div>
    ` : '';

    // Create the HTML document structure with improved styling
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            color: ${SAIB_COLORS.text};
            margin: 0;
            padding: 0;
            background-color: ${SAIB_COLORS.lightBg};
            line-height: 1.5;
          }
          /* Document Header */
          .document-header {
            position: relative;
            background-color: ${SAIB_COLORS.darkBg};
            color: ${SAIB_COLORS.lightBg};
            padding: 20px;
            margin-bottom: 0;
          }
          .document-title-container {
            display: flex;
            align-items: center;
          }
          .document-logo {
            height: 50px;
            margin-right: 15px;
          }
          .gold-bar {
            width: 10px;
            height: 50px;
            background-color: ${SAIB_COLORS.primary};
            margin-right: 15px;
          }
          .document-title {
            font-size: 20px;
            font-weight: bold;
          }
          .document-title-arabic {
            font-size: 18px;
            margin-top: 5px;
            text-align: right;
          }
          /* Table of Contents */
          .toc {
            margin: 20px 0;
            padding: 0 20px;
            background-color: transparent !important;
            color: #000000 !important;
            border: none !important;
          }
          .toc-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #000000;
            border-bottom: 2px solid ${SAIB_COLORS.primary};
            padding-bottom: 5px;
          }
          .toc-section-item, .toc-subsection-item {
            display: flex;
            margin-bottom: 8px;
            position: relative;
            background-color: transparent !important;
            color: #000000 !important;
          }
          .toc-section-item {
            font-weight: bold;
            margin-left: 0;
          }
          .toc-subsection-item {
            padding-left: 20px;
            font-weight: normal;
          }
          .toc-section-content, .toc-subsection-content {
            display: flex;
            align-items: flex-start;
            color: #000000 !important;
          }
          .toc-section-number, .toc-subsection-number {
            margin-right: 8px;
            color: #000000 !important;
          }
          .toc-section-title, .toc-subsection-title {
            flex: 1;
            color: #000000 !important;
          }
          .toc-page-number {
            font-weight: normal;
          }
          .toc-section-item:after, .toc-subsection-item:after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 4px;
            border-bottom: 1px dotted #ccc;
            z-index: -1;
          }
          /* Tables */
          .content-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          th {
            background-color: ${SAIB_COLORS.headerBg};
            color: ${SAIB_COLORS.lightBg};
            padding: 8px;
            text-align: ${isRTL ? 'right' : 'left'};
            font-weight: bold;
          }
          td {
            padding: 8px;
            text-align: ${isRTL ? 'right' : 'left'};
            border: 1px solid #ddd;
            vertical-align: top;
          }
          /* Section Formatting - Updated to match the image */
          .section-header {
            background-color: #D9B67A;
            color: #333333;
            padding: 8px 10px;
            margin-top: 0;
            margin-bottom: 20px;
            border-radius: 0;
          }
          .section-number-title {
            font-weight: bold;
            font-size: 16px;
          }
          .section-arabic-title {
            margin-top: 5px;
            text-align: right;
            direction: rtl;
          }
          .section-content {
            padding: 0 15px 15px 15px;
            margin-bottom: 20px;
          }
          .subsection-header {
            margin: 15px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
          }
          .subsection-number-title {
            font-weight: bold;
          }
          .subsection-arabic-title {
            margin-top: 5px;
            text-align: right;
            direction: rtl;
          }
          /* RTL Support */
          .rtl {
            direction: rtl;
            text-align: right;
          }
          .ltr {
            direction: ltr;
            text-align: left;
          }
          /* Page Breaks */
          .page-break {
            page-break-before: always;
          }
          /* Footer */
          .footer {
            margin-top: 30px;
            border-top: 2px solid ${SAIB_COLORS.primary};
            padding-top: 10px;
            font-size: 12px;
            color: ${SAIB_COLORS.secondary};
            text-align: center;
          }
          /* Approval Table */
          .approval-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .approval-table th {
            text-align: center;
            background-color: ${SAIB_COLORS.headerBg};
            color: ${SAIB_COLORS.lightBg};
            padding: 8px;
          }
          .approval-table td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .document-info {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
          }
          .document-info td:first-child {
            background-color: ${SAIB_COLORS.headerBg};
            color: ${SAIB_COLORS.lightBg};
            font-weight: bold;
            width: 30%;
            padding: 8px;
            border: 1px solid #ddd;
          }
          .document-info td:last-child {
            padding: 8px;
            border: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="document-header">
          <div class="document-title-container">
            <img src="${SAIB_LOGO_URL}" alt="SAIB Logo" class="document-logo" />
            <div class="gold-bar"></div>
            <div>
              <div class="document-title">${title}</div>
              <div class="document-title-arabic">اسم السياسة</div>
            </div>
          </div>
        </div>
        <!-- Table of Contents -->
        <div class="page-break"></div>
        <div class="document-header">
          <div class="document-title-container">
            <img src="${SAIB_LOGO_URL}" alt="SAIB Logo" class="document-logo" />
            <div class="gold-bar"></div>
            <div>
              <div class="document-title">${title}</div>
              <div class="document-title-arabic">اسم السياسة</div>
            </div>
          </div>
        </div>
        ${generateTableOfContents(processedContent)}
        <!-- Document Content -->
        <div class="page-break"></div>
        ${processedContent.html}
        ${processModelSection}
        <!-- Approval Section -->
        <div class="page-break"></div>
        <div class="document-header">
          <div class="document-title-container">
            <img src="${SAIB_LOGO_URL}" alt="SAIB Logo" class="document-logo" />
            <div class="gold-bar"></div>
            <div>
              <div class="document-title">${title}</div>
              <div class="document-title-arabic">اسم السياسة</div>
            </div>
          </div>
        </div>
        <div style="margin: 20px;">
          <h2>Document Approval</h2>
          <table class="approval-table">
            <tr>
              <th colspan="2">Approval Version Control</th>
            </tr>
            <tr>
              <th>Version</th>
              <th>Date</th>
            </tr>
            <tr>
              <td>1.0</td>
              <td>March 2024</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </table>
          <table class="document-info">
            <tr>
              <td>Document Owner:</td>
              <td>Business Processes & Procedures Department</td>
            </tr>
            <tr>
              <td>Custodian:</td>
              <td>Business Processes & Procedures Department</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>Saudi Investment Bank - Confidential</p>
        </div>
      </body>
      </html>
    `;
    // Convert HTML to Blob and download
    const blob = new Blob([html], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.doc`;
    document.body.appendChild(a);
    a.click();
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw new Error('Failed to generate Word document');
  }
};
/**
 * Process markdown content to identify sections, tables, etc.
 * @param content Markdown content
 * @param isBilingual Whether the document is bilingual
 * @returns Processed content object with HTML and sections
 */
function processMarkdownContent(content: string, isBilingual: boolean) {
  // Extract sections and subsections from markdown
  const sections: any[] = [];
  let currentSection = null;
  let currentSubsection = null;
  let sectionCount = 0;
  let subsectionCount = 0;
  // Split content into lines
  const lines = content.split('\n');
  let processedHTML = '';
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Section headers (## in markdown)
    if (line.startsWith('## ')) {
      // Close previous section content div if exists
      if (sectionCount > 0) {
        processedHTML += '</div>';
      }
      // Add page break before each section (except the first one)
      if (sectionCount > 0) {
        processedHTML += '<div class="page-break"></div>';
      }
      sectionCount++;
      subsectionCount = 0;
      const title = line.substring(3).trim();
      // Remove any existing numbering from the title
      const cleanTitle = title.replace(/^\d+(\.\d+)*\s+/, '');
      // Check if next line is Arabic section title (in div with rtl)
      let arabicTitle = '';
      if (i + 1 < lines.length && lines[i + 1].includes('<div dir="rtl">') && lines[i + 2].startsWith('## ')) {
        arabicTitle = lines[i + 2].substring(3).trim();
        // Clean Arabic title numbering as well
        arabicTitle = arabicTitle.replace(/^\d+(\.\d+)*\s+/, '');
        i += 3; // Skip the rtl div lines
      }
      currentSection = {
        number: sectionCount,
        title: cleanTitle,
        arabicTitle: arabicTitle,
        subsections: []
      };
      sections.push(currentSection);
      // Add section header to HTML with improved formatting to match the image
      processedHTML += `
        <div class="section-header">
          <div class="section-number-title">${sectionCount}. ${formatMarkdown(cleanTitle)}</div>
          ${arabicTitle ? `<div class="section-arabic-title">${arabicTitle}</div>` : ''}
        </div>
        <div class="section-content">
      `;
    }
    // Subsection headers (### in markdown)
    else if (line.startsWith('### ')) {
      subsectionCount++;
      const title = line.substring(4).trim();
      // Remove any existing numbering from the title
      const cleanTitle = title.replace(/^\d+(\.\d+)*\s+/, '');
      // Check if next line is Arabic subsection title
      let arabicTitle = '';
      if (i + 1 < lines.length && lines[i + 1].includes('<div dir="rtl">') && lines[i + 2].startsWith('### ')) {
        arabicTitle = lines[i + 2].substring(4).trim();
        // Clean Arabic title numbering as well
        arabicTitle = arabicTitle.replace(/^\d+(\.\d+)*\s+/, '');
        i += 3; // Skip the rtl div lines
      }
      if (currentSection) {
        currentSubsection = {
          number: `${currentSection.number}.${subsectionCount}`,
          title: cleanTitle,
          arabicTitle: arabicTitle
        };
        currentSection.subsections.push(currentSubsection);
        // Add subsection to HTML with improved formatting
        processedHTML += `
          <div class="subsection-header">
            <div class="subsection-number-title">${currentSection.number}.${subsectionCount} ${formatMarkdown(cleanTitle)}</div>
            ${arabicTitle ? `<div class="subsection-arabic-title">${arabicTitle}</div>` : ''}
          </div>
        `;
      }
    }
    // Table handling
    else if (line.includes('|') && line.trim().startsWith('|')) {
      // Start of table
      if (!line.includes('---')) {
        const isHeaderRow = i + 1 < lines.length && lines[i + 1].includes('---');
        // For bilingual tables, create a special structure
        if (isBilingual && line.includes('Term') && line.includes('Full Form')) {
          // Find the matching Arabic table
          let arabicTableStart = -1;
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes('<div dir="rtl">')) {
              arabicTableStart = j;
              break;
            }
          }
          if (arabicTableStart > 0) {
            // Extract English table
            const englishTable = [];
            let j = i;
            while (j < arabicTableStart && j < lines.length) {
              if (lines[j].includes('|')) {
                englishTable.push(lines[j]);
              }
              j++;
            }
            // Extract Arabic table
            const arabicTable = [];
            j = arabicTableStart + 1; // Skip the rtl div
            while (j < lines.length && !lines[j].includes('</div>')) {
              if (lines[j].includes('|')) {
                arabicTable.push(lines[j]);
              }
              j++;
            }
            // Create bilingual table HTML
            processedHTML += createBilingualTable(englishTable, arabicTable);
            // Skip to after the Arabic table
            i = j;
            continue;
          }
        }
        // Regular table processing
        processedHTML += '<table class="content-table">';
        let tableHtml = '';
        // Process table rows
        while (i < lines.length && lines[i].includes('|')) {
          const cells = lines[i].split('|').filter(cell => cell.trim() !== '');
          const isHeader = tableHtml === '' || lines[i - 1]?.includes('---');
          tableHtml += '<tr>';
          cells.forEach(cell => {
            const formattedCell = formatMarkdown(cell.trim());
            tableHtml += isHeader ? `<th>${formattedCell}</th>` : `<td>${formattedCell}</td>`;
          });
          tableHtml += '</tr>';
          i++;
        }
        processedHTML += tableHtml + '</table>';
        i--; // Adjust for the increment in the main loop
      }
    }
    // Regular content
    else if (line.trim() !== '') {
      // Handle RTL content
      if (line.includes('<div dir="rtl">')) {
        let rtlContent = '<div class="rtl">';
        i++;
        while (i < lines.length && !lines[i].includes('</div>')) {
          rtlContent += formatMarkdown(lines[i]) + '<br>';
          i++;
        }
        rtlContent += '</div>';
        processedHTML += rtlContent;
      }
      // Regular paragraph
      else {
        processedHTML += `<p>${formatMarkdown(line)}</p>`;
      }
    }
    // Close section div if next section starts
    if (i + 1 < lines.length && lines[i + 1].startsWith('## ')) {
      processedHTML += '</div>';
    }
  }
  // Close any open section
  if (processedHTML.lastIndexOf('<div class="section-content">') > processedHTML.lastIndexOf('</div>')) {
    processedHTML += '</div>';
  }
  return {
    html: processedHTML,
    sections: sections
  };
}
/**
 * Format markdown syntax to HTML
 * @param text Text with markdown syntax
 * @returns HTML formatted text
 */
function formatMarkdown(text: string): string {
  // Handle bold text with double asterisks
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Handle italic text with single asterisks
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Handle underline with underscores
  formattedText = formattedText.replace(/__(.*?)__/g, '<u>$1</u>');
  // Handle strikethrough with tildes
  formattedText = formattedText.replace(/~~(.*?)~~/g, '<strike>$1</strike>');
  // Handle inline code with backticks
  formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
  return formattedText;
}
/**
 * Create a bilingual table with English on left and Arabic on right
 * @param englishTable Array of English table rows
 * @param arabicTable Array of Arabic table rows
 * @returns HTML for bilingual table
 */
function createBilingualTable(englishTable: string[], arabicTable: string[]) {
  // Extract headers
  const englishHeaders = englishTable[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
  const arabicHeaders = arabicTable[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
  // Start table HTML
  let tableHtml = `
    <table>
      <tr>
        <th>${formatMarkdown(englishHeaders[0])}</th>
        <th>${formatMarkdown(englishHeaders[1])}</th>
        <th>${formatMarkdown(arabicHeaders[1])}</th>
        <th>${formatMarkdown(arabicHeaders[0])}</th>
      </tr>
  `;
  // Skip header row and separator row
  for (let i = 2; i < englishTable.length; i++) {
    const englishCells = englishTable[i].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    const arabicCells = i < arabicTable.length ? arabicTable[i].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim()) : ['', ''];
    tableHtml += `
      <tr>
        <td>${formatMarkdown(englishCells[0] || '')}</td>
        <td>${formatMarkdown(englishCells[1] || '')}</td>
        <td class="rtl">${formatMarkdown(arabicCells[1] || '')}</td>
        <td class="rtl">${formatMarkdown(arabicCells[0] || '')}</td>
      </tr>
    `;
  }
  tableHtml += '</table>';
  return tableHtml;
}
/**
 * Generate table of contents based on extracted sections
 * @param processedContent Processed content with sections
 * @returns HTML for table of contents
 */
function generateTableOfContents(processedContent: any) {
  let tocHtml = '<div class="toc">';
  // Add TOC header
  tocHtml += '<h2 class="toc-header">Table of Contents</h2>';
  // Process sections and subsections
  processedContent.sections.forEach((section: any) => {
    // Add section to TOC with consistent formatting - number with period
    tocHtml += `
      <div class="toc-section-item">
        <div class="toc-section-content">
          <span class="toc-section-number">${section.number}.</span>
          <span class="toc-section-title">${formatMarkdown(section.title)}</span>
        </div>
      </div>
    `;
    // Add subsections to TOC with consistent formatting and proper indentation
    section.subsections.forEach((subsection: any) => {
      tocHtml += `
        <div class="toc-subsection-item">
          <div class="toc-subsection-content">
            <span class="toc-subsection-number">${subsection.number}</span>
            <span class="toc-subsection-title">${formatMarkdown(subsection.title)}</span>
          </div>
        </div>
      `;
    });
  });
  tocHtml += '</div>';
  return tocHtml;
}
/**
 * Converts markdown content to a more sophisticated Word document with SAIB branding
 * using a server-side conversion API
 * @param content Markdown content to convert
 * @param title Document title
 * @param language Document language ('english', 'arabic', or 'bilingual')
 * @param processModelImage Optional base64 image data URL for process model diagram
 */
export const generateFormattedWordDocument = async (
  content: string,
  title: string,
  language: string,
  processModelImage?: string
): Promise<void> => {
  try {
    // In a real implementation, this would call a server-side API to convert
    // markdown to a properly formatted Word document with SAIB branding
    // For now, we'll use the enhanced client-side approach
    await generateWordDocument(content, title, language, processModelImage);
  } catch (error) {
    console.error('Error with formatted Word conversion:', error);
    throw error;
  }
};