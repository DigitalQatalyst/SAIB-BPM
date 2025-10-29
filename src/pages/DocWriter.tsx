import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, Check, RotateCw, Sparkles, FileText, AlertCircle, Upload, FileUp, Download, Globe, CheckCircle, FilePenLine, Network } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { bilingualPolicyTemplate, generateBilingualMarkdown, customizeTemplate } from '../utils/documentTemplates';
import { generateFormattedWordDocument } from '../utils/wordGenerator';
import CommentSection from '../components/docwriter/CommentSection';
import VersionHistory from '../components/docwriter/VersionHistory';
import { CollaborationProvider } from '../context/CollaborationContext';
type FormStep = 'info' | 'additionalDocs' | 'preview';
type DocumentLanguage = 'english' | 'arabic' | 'bilingual';
const DocWriter = () => {
  const {
    requestId,
    templateId
  } = useParams();
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const {
    createDocument,
    updateDocument,
    getDocumentByRequestId,
    setCurrentDocument,
    advanceToNextApprovalStage
  } = useDocument();
  const [formStep, setFormStep] = useState<FormStep>('info');
  const [formState, setFormState] = useState({
    title: '',
    category: '',
    justification: '',
    sourceOfRequest: '',
    additionalContext: '',
    documentLanguage: 'english' as DocumentLanguage
  });
  const [additionalDocFile, setAdditionalDocFile] = useState<File | null>(null);
  const [document, setDocument] = useState<{
    id: string;
    content: string;
    status: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Azure OpenAI API configuration with fallback values
  const azureOpenAIBaseUrl = typeof process !== 'undefined' && process.env && process.env.REACT_APP_AZURE_OPENAI_BASE_URL ? process.env.REACT_APP_AZURE_OPENAI_BASE_URL : 'https://samwe-m4r3zeki-swedencentral.openai.azure.com/openai/deployments/gpt-4-32k/chat/completions?api-version=2024-02-15-preview';
  const azureOpenAIApiKey = typeof process !== 'undefined' && process.env && process.env.REACT_APP_AZURE_OPENAI_API_KEY ? process.env.REACT_APP_AZURE_OPENAI_API_KEY : 'BaILIpDCFlyXTXXWXQWw5Kxpj6cwpJ4fkTNhJbY2Kj9QmpH4a83VJQQJ99ALACfhMk5XJ3w3AAAAACOGOmml';
  useEffect(() => {
    if (requestId) {
      // Mock data for the service request
      const requestData = {
        id: parseInt(requestId),
        title: 'Update Information Security Policy',
        category: 'Information Security',
        justification: 'The Saudi Central Bank (SAMA) has issued new cybersecurity framework requirements that must be incorporated into our Information Security Policy by the end of the quarter.',
        sourceOfRequest: 'Regulatory Requirement',
        department: 'IT Security'
      };
      // Check if a document already exists for this request
      const existingDocument = getDocumentByRequestId(parseInt(requestId));
      if (existingDocument) {
        // If document exists, load it into the editor
        setDocument(existingDocument);
        setCurrentDocument(existingDocument);
        setEditMode(true);
        // If the document is in a "Needs Revision" state, show the form again
        if (existingDocument.status === 'Needs Revision') {
          setShowForm(true);
          setFormState({
            title: requestData.title,
            category: requestData.category,
            justification: requestData.justification,
            sourceOfRequest: requestData.sourceOfRequest,
            additionalContext: '',
            documentLanguage: 'english'
          });
        } else {
          setShowForm(false);
        }
      } else {
        // Initialize form with request data
        setFormState({
          title: requestData.title,
          category: requestData.category,
          justification: requestData.justification,
          sourceOfRequest: requestData.sourceOfRequest,
          additionalContext: '',
          documentLanguage: 'english'
        });
      }
    } else if (templateId) {
      // Mock template data
      setFormState({
        title: 'Business Process & Procedure Policy',
        category: 'Policy',
        justification: 'Creating new document from template',
        sourceOfRequest: 'Template',
        additionalContext: '',
        documentLanguage: 'english'
      });
    }
  }, [requestId, templateId, getDocumentByRequestId, setCurrentDocument]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAdditionalDocFile(e.target.files[0]);
    }
  };
  const handleNextStep = () => {
    if (formStep === 'info') {
      setFormStep('additionalDocs');
    } else if (formStep === 'additionalDocs') {
      handleGenerateDocument();
    }
  };
  const handlePrevStep = () => {
    if (formStep === 'additionalDocs') {
      setFormStep('info');
    }
  };
  // Generate document using bilingual template
  const generateBilingualDocument = () => {
    // Customize the template with form data
    const customData = {
      title: formState.title,
      category: formState.category,
      justification: formState.justification,
      additionalContext: formState.additionalContext,
      sourceOfRequest: formState.sourceOfRequest
    };
    const customizedTemplate = customizeTemplate(bilingualPolicyTemplate, customData);
    // Generate markdown from the template
    return generateBilingualMarkdown(customizedTemplate);
  };
  const generateArabicDocument = () => {
    return `# سياسة العمليات والإجراءات
## الاختصارات
| المصطلح | الشكل الكامل |
|---------|--------------|
| البنك السعودي للاستثمار | البنك السعودي للاستثمار |
| العمليات والإجراءات | العمليات والإجراءات |
## التعريفات
| المصطلح | التعريف |
|---------|---------|
| البنك السعودي للاستثمار | البنك السعودي للاستثمار |
## المقدمة
### تعريف السياسة
هذه السياسة تخص قسم العمليات والإجراءات في البنك السعودي للاستثمار.
### غرض هذه السياسة
تحدد هذه السياسة إطارًا موحدًا لتوثيق وتنفيذ وإدارة العمليات والإجراءات في البنك السعودي للاستثمار لضمان الفعالية التشغيلية والتحسين المستمر.
### وثائق البنك المستخدمة مع السياسة
يجب استخدام هذه السياسة بالتوازي مع دليل العمليات والإجراءات ودليل الحوكمة المؤسسية.
### الوثائق التنظيمية المرجعية
تشير هذه السياسة إلى إطار العمل الخاص بقواعد ولوائح البنك المركزي السعودي (ساما).
### الملكية والتحديثات
تملك هذه السياسة إدارة العمليات والإجراءات ووحدة الحوكمة المؤسسية. يجب مراجعتها وتحديثها وتوزيعها بشكل ربع سنوي.
## قسم السياسة المباشرة للعمليات والإجراءات
### بيان حوكمة العمليات والإجراءات وتوزيع الأدوار
سوف تقوم إدارة العمليات والإجراءات بتنفيذ إطار حوكمة مفصل يحدد الأدوار والمسؤوليات وهرميات اتخاذ القرار داخل القسم.
### بيان استراتيجية قسم العمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بتحديد ومراجعة الاتجاه الاستراتيجي للقسم بشكل دوري بما يتماشى مع أهداف المنظمة.
### بيان تعريف معماريات العمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بتعريف وصيانة هيكل شامل للعمليات والإجراءات يدعم إدارة السياسات ويواكب الأطر التشغيلية والتنظيمية.
### بيان محفظة التحول للعمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بالحفاظ على محفظة تحول ذات أولوية لتحسين كفاءة وفعالية العمليات.
### بيان نموذج العمليات للإجراءات
سوف تقوم إدارة العمليات والإجراءات بتحديد ومراجعة نموذج موحد للعمل بشكل دوري لضمان التوافق مع الأهداف الاستراتيجية.
## قسم سياسة التحكم في العمليات والإجراءات
### بيان التحكم في العمليات التشغيلية
سوف تقوم إدارة العمليات والإجراءات بتحديد هياكل الحوكمة للإشراف على الأنشطة التشغيلية وضمان التوافق مع الأهداف الاستراتيجية وإدارة المخاطر.
### بيان قيمة أصحاب المصلحة في العمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بالتفاعل مع أصحاب المصلحة لضمان أن العمليات تخلق قيمة وتعزز التعاون.
### بيان الذكاء والرؤى في العمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بالاستفادة من تحليلات البيانات لإبلاغ القرارات وتحسين فعالية العمليات.
### بيان الأنظمة والأدوات في العمليات والإجراءات
سوف تقوم إدارة العمليات والإجراءات بتطبيق وصيانة الأنظمة والأدوات لإدارة السياسات والإجراءات والامتثال.
## السيادة اللغوية في حالات التعارض
في حال وجود أي اختلافات بين النص العربي والنص الإنجليزي في هذه السياسة، يتم اعتماد النص العربي.
---
**نسخة المستند:** 1.0  
**تاريخ الموافقة:** مارس 2024
**مراقبة نسخة الموافقة:**  
النسخة: 1.0  
التاريخ: مارس 2024`;
  };
  const generateEnglishDocument = () => {
    return `# Business Process & Procedure Policy
## Abbreviations
| Term | Full Form |
|------|-----------|
| SAIB | Saudi Investment Bank |
| BP&P | Business Process & Procedure |
## Definitions
| Term | Definition |
|------|-----------|
| The Bank | The Saudi Investment Bank (SAIB) |
## Introduction
### Policy Definition
This Policy is for the Business Process & Procedure Department in SAIB.
### Purpose of this Policy
This Policy defines a standardized framework for documenting, implementing, and managing SAIB's business processes & procedures to ensure operational effectiveness and continuous improvement.
### Bank's Documents Used in Tandem
This Policy should be used in tandem with the Business Process & Procedure Manual and Corporate Governance Manual.
### Regulatory Reference Documents
This Policy references the SAMA Framework for Banking Rules & Regulations.
### Ownership and Updates
This Policy is owned by the Business Process & Procedure Department and the Corporate Governance Unit. It should be reviewed, updated, and disseminated quarterly.
## BP&P Direct Policy Section
### BP&P Governance & Roles Statement
BP&P shall implement a detailed governance framework defining roles, responsibilities, and decision-making hierarchies within the BP&P department.
### BP&P Department Strategy Statement
BP&P shall establish and periodically review a strategic direction for the BP&P department that aligns with organizational goals.
### BP&P Architecture Definition Statement
BP&P shall define and maintain a comprehensive BP&P architecture that supports policy management, aligning with operational and regulatory frameworks.
### BP&P Transformation Portfolio Statement
BP&P shall maintain a prioritized transformation portfolio to enhance process efficiency and effectiveness.
### BP&P Operating Model Statement
BP&P shall establish and periodically review a standardized BP&P operating model to ensure alignment with strategic objectives.
## BP&P Control Policy Section
### BP&P Operational Control Statement
BP&P shall establish governance structures to oversee operational activities, ensuring alignment with strategic objectives and risk management.
### BP&P Stakeholder Value Statement
BP&P shall engage stakeholders to ensure BP&P processes create value and foster collaboration.
### BP&P Intelligence & Insights Statement
BP&P shall leverage data analytics to inform decisions and improve process effectiveness.
### BP&P Systems & Tools Statement
BP&P shall implement and maintain systems and tools for managing BP&P policies, procedures, and compliance.
## Language Dominance in Discrepancies
In case of any discrepancies between the Arabic and the English text of this policy, the Arabic text shall prevail.
---
**Document Version:** 1.0  
**Approval Date:** March 2024
**Approval Version Control:**  
Version: 1.0  
Date: March 2024`;
  };
  // Updated to always use bilingual generator for bilingual documents
  const generateDocumentWithAzureOpenAI = async () => {
    setError(null);
    try {
      // Prepare the data to send to Azure OpenAI API
      const additionalDocContent = additionalDocFile ? await readFileAsText(additionalDocFile) : '';
      // Special handling for bilingual documents
      if (formState.documentLanguage === 'bilingual') {
        // Always use the bilingual document generator for all document types
        console.log('Using bilingual template for document generation');
        return await generateBilingualDocumentWithAI(azureOpenAIBaseUrl, azureOpenAIApiKey, formState, additionalDocContent);
      }
      // For other document types, use the standard Azure OpenAI approach
      // Construct the prompt based on form data
      const prompt = constructPrompt(formState, additionalDocContent);
      // Make the API call to Azure OpenAI
      const response = await fetch(azureOpenAIBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureOpenAIApiKey
        },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: "You are an AI assistant specialized in generating professional policy and procedure documents for a Saudi bank. Your task is to create well-structured, comprehensive documents following the bank's standards and incorporating all relevant regulatory requirements."
          }, {
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 12000
        })
      });
      if (!response.ok) {
        throw new Error(`Azure OpenAI API returned status ${response.status}`);
      }
      const responseData = await response.json();
      // Extract the generated content from the response
      if (responseData && responseData.choices && responseData.choices.length > 0) {
        const generatedContent = responseData.choices[0].message.content;
        return generatedContent;
      } else {
        throw new Error('No content received from Azure OpenAI API');
      }
    } catch (error) {
      console.error('Error generating document with Azure OpenAI:', error);
      setError('Failed to generate document with Azure OpenAI. Falling back to template.');
      // Fallback to predefined templates if API fails
      if (formState.documentLanguage === 'bilingual') {
        return generateBilingualDocument();
      } else if (formState.documentLanguage === 'arabic') {
        return generateArabicDocument();
      } else {
        return generateEnglishDocument();
      }
    }
  };
  // Helper function to read file content
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  // Helper function to construct the prompt for the AI
  const constructPrompt = (formData: typeof formState, additionalDocContent: string): string => {
    // For bilingual documents, include instructions to follow the template structure
    let templateInstructions = '';
    if (formData.documentLanguage === 'bilingual') {
      templateInstructions = `
The document should follow this specific bilingual template structure:
1. Document title in both languages (English / Arabic)
2. Abbreviations section with table format showing terms in both languages
3. Definitions section with table format showing terms in both languages
4. Introduction section with subsections for Policy Definition, Purpose, Bank's Documents Used in Tandem, Regulatory Reference Documents, and Ownership and Updates
5. Policy-specific sections with relevant subsections
6. Language Dominance in Discrepancies section stating that Arabic text prevails in case of discrepancies
7. Footer with document version, approval date, and version control information
Each section should have both English and Arabic content side by side or in sequence.
`;
    }
    let prompt = `
Generate a professional ${formData.category} document titled "${formData.title}" in ${formData.documentLanguage === 'bilingual' ? 'both English and Arabic' : formData.documentLanguage} language.
Document Details:
- Category: ${formData.category}
- Source of Request: ${formData.sourceOfRequest}
- Justification: ${formData.justification}
- Additional Context: ${formData.additionalContext || 'None provided'}
${additionalDocContent ? 'Additional Document Information:\n' + additionalDocContent : ''}
The document should follow the standard structure for bank policies, including:
1. Title and Introduction
2. Abbreviations and Definitions
3. Purpose and Scope
4. Policy Statements
5. Roles and Responsibilities
6. Compliance Requirements
7. Related Documents
8. Version Control
${templateInstructions}
${formData.documentLanguage === 'bilingual' ? 'The document should be bilingual with English text followed by Arabic translation for each section.' : ''}
${formData.documentLanguage === 'arabic' ? 'The document should be entirely in Arabic.' : ''}
Please format the document using Markdown syntax.
`;
    return prompt;
  };
  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Generate document content using Azure OpenAI or template
      let generatedContent;
      // Special handling for bilingual documents
      if (formState.documentLanguage === 'bilingual') {
        console.log('Generating bilingual document...');
        // Use the structured template approach for all policy documents
        console.log('Using structured template for bilingual document');
        generatedContent = await generateBilingualDocumentWithAI(azureOpenAIBaseUrl, azureOpenAIApiKey, formState, additionalDocFile ? await readFileAsText(additionalDocFile) : '');
      } else if (formState.documentLanguage === 'arabic') {
        generatedContent = generateArabicDocument();
      } else {
        // For English documents, use Azure OpenAI
        generatedContent = await generateDocumentWithAzureOpenAI();
      }
      if (editMode && document) {
        // Update existing document
        updateDocument(document.id, {
          content: generatedContent,
          title: formState.title
        });
        setDocument(prev => prev ? {
          ...prev,
          content: generatedContent
        } : null);
      } else if (requestId) {
        // Create new document
        const newDocument = createDocument(parseInt(requestId), {
          title: formState.title,
          content: generatedContent
        });
        setDocument(newDocument);
        setCurrentDocument(newDocument);
      }
      setShowForm(false);
      setFormStep('info');
    } catch (error) {
      console.error('Error in document generation:', error);
      setError('An error occurred while generating the document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSendToApprover = () => {
    if (document) {
      // Update document status and advance to next approval stage
      advanceToNextApprovalStage(document.id);
      // Navigate back to the request details page
      if (requestId) {
        navigate(`/manage-requests`);
      }
    }
  };
  const handleSaveDraft = () => {
    if (document && document.content) {
      updateDocument(document.id, {
        content: document.content
      });
      alert('Document saved successfully');
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (document) {
      setDocument({
        ...document,
        content: e.target.value
      });
    }
  };
  const handleBackToRequest = () => {
    if (requestId) {
      navigate(`/manage-requests`);
    } else {
      navigate(`/docwriter`);
    }
  };
  const handleDownloadWord = async () => {
    if (document && document.content) {
      try {
        // Show loading indicator
        setIsDownloading(true);
        // Generate Word document with SAIB branding
        await generateFormattedWordDocument(document.content, formState.title, formState.documentLanguage);
        // Success message
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (error) {
        console.error('Error downloading Word document:', error);
        setDownloadError('Failed to generate Word document. Please try again.');
        setTimeout(() => setDownloadError(null), 3000);
      } finally {
        setIsDownloading(false);
      }
    } else {
      setDownloadError('No document content to download');
      setTimeout(() => setDownloadError(null), 3000);
    }
  };
  // Add text selection handler function
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Get the textarea element
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        // You can use this selection data for comments
        console.log('Selected text:', {
          start,
          end,
          text: selection.toString()
        });
      }
    }
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <button onClick={handleBackToRequest} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {requestId ? 'Back to Requests' : 'Back to Templates'}
          </button>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            AI DocWriter
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {editMode ? 'Edit document based on service request feedback' : requestId ? 'Generate document based on service request information' : 'Create document using the selected template'}
          </p>
        </div>
        {/* Error message display */}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span>{error}</span>
            </div>
          </div>}
        {showForm ? <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {formStep === 'info' ? 'Document Generation Form' : 'Additional Documents'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {formStep === 'info' ? 'Provide additional context to help the AI generate a better document' : 'Upload additional documents to assist with document generation'}
              </p>
            </div>
            {formStep === 'info' && <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Document Title
                    </label>
                    <div className="mt-1">
                      <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <input type="text" name="category" id="category" value={formState.category} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sourceOfRequest" className="block text-sm font-medium text-gray-700">
                      Source of Request
                    </label>
                    <div className="mt-1">
                      <input type="text" name="sourceOfRequest" id="sourceOfRequest" value={formState.sourceOfRequest} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="documentLanguage" className="block text-sm font-medium text-gray-700">
                      Document Language
                    </label>
                    <div className="mt-1">
                      <select id="documentLanguage" name="documentLanguage" value={formState.documentLanguage} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-3">
                        <option value="english">English Only</option>
                        <option value="arabic">Arabic Only</option>
                        <option value="bilingual">
                          Bilingual (English & Arabic)
                        </option>
                      </select>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <Globe className="h-4 w-4 mr-1 text-gray-400" />
                      {formState.documentLanguage === 'bilingual' ? 'Document will be generated with both English and Arabic content' : formState.documentLanguage === 'arabic' ? 'Document will be generated in Arabic only' : 'Document will be generated in English only'}
                    </p>
                    {formState.documentLanguage === 'bilingual' && formState.title.toLowerCase().includes('business process') && <p className="mt-2 text-sm text-green-600 flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Using structured bilingual template for Business
                          Process & Procedure Policy
                        </p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="justification" className="block text-sm font-medium text-gray-700">
                      Justification
                    </label>
                    <div className="mt-1">
                      <textarea id="justification" name="justification" rows={3} required value={formState.justification} onChange={handleInputChange} placeholder="Explain why this policy is needed" className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700">
                      Additional Context
                    </label>
                    <div className="mt-1">
                      <textarea id="additionalContext" name="additionalContext" rows={4} value={formState.additionalContext} onChange={handleInputChange} placeholder="Provide any additional information that would help in generating a better document" className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={handleBackToRequest} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                    Cancel
                  </button>
                  <button type="button" onClick={handleNextStep} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                    Next
                  </button>
                </div>
              </div>}
            {formStep === 'additionalDocs' && <div className="px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Additional Documents
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a document</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".doc,.docx,.pdf,.txt,.md,.xml" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          DOC, DOCX, PDF, TXT, MD, XML up to 10MB
                        </p>
                      </div>
                    </div>
                    {additionalDocFile && <p className="mt-2 text-sm text-gray-500">
                        Selected file: {additionalDocFile.name}
                      </p>}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button type="button" onClick={handlePrevStep} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                      Back
                    </button>
                    <button type="button" onClick={handleGenerateDocument} disabled={isGenerating} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                      {isGenerating ? <>
                          <RotateCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Generating...
                        </> : <>
                          <Sparkles className="-ml-1 mr-2 h-4 w-4" />
                          Generate Document
                        </>}
                    </button>
                  </div>
                </div>
              </div>}
          </div> : document && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Document Editor
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Review and edit the generated document before sending
                        for approval
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button type="button" onClick={() => navigate('/process-model-creator')} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                        <Network className="-ml-0.5 mr-2 h-4 w-4" />
                        Create Process Model
                      </button>
                      <button type="button" onClick={handleSaveDraft} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                        <Save className="-ml-0.5 mr-2 h-4 w-4" />
                        Save Draft
                      </button>
                      <button type="button" onClick={handleDownloadWord} disabled={isDownloading} className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E] ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isDownloading ? <>
                            <RotateCw className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                            Generating...
                          </> : <>
                            <Download className="-ml-0.5 mr-2 h-4 w-4" />
                            Download as Word
                          </>}
                      </button>
                      <button type="button" onClick={handleSendToApprover} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Send className="-ml-0.5 mr-2 h-4 w-4" />
                        Send to Approver
                      </button>
                    </div>
                  </div>
                  {/* Download status notifications */}
                  {downloadSuccess && <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <p className="text-sm text-green-700">
                          Document successfully downloaded as Word
                        </p>
                      </div>
                    </div>}
                  {downloadError && <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <p className="text-sm text-red-700">{downloadError}</p>
                      </div>
                    </div>}
                  {document.status === 'Needs Revision' && <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Revision Required
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              The document needs more detail on the multi-factor
                              authentication implementation requirements. Please
                              revise section 3.2 to include specific guidance
                              for different user roles.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>}
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <FileText className="mr-2 h-5 w-5 text-gray-400" />
                      <span>{formState.title}</span>
                      {formState.documentLanguage === 'bilingual' && <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Bilingual
                        </span>}
                      {formState.documentLanguage === 'arabic' && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Arabic
                        </span>}
                    </div>
                    {/* Enhanced bilingual document display */}
                    <div className={`border border-gray-300 rounded-md shadow-sm ${formState.documentLanguage === 'bilingual' ? 'bilingual-document' : ''}`}>
                      <textarea rows={25} value={document.content} onChange={handleContentChange} className="block w-full border-0 p-4 font-mono text-sm focus:ring-[#FECC0E] focus:border-[#FECC0E]" style={{
                  lineHeight: 1.6,
                  direction: formState.documentLanguage === 'arabic' ? 'rtl' : 'ltr'
                }} onMouseUp={handleTextSelection} />
                    </div>
                    <style jsx>{`
                      .bilingual-document textarea {
                        white-space: pre-wrap;
                        overflow-wrap: break-word;
                      }
                    `}</style>
                    <div className="mt-6 flex justify-between">
                      <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                        Back to Form
                      </button>
                      <div className="flex space-x-3">
                        <button type="button" onClick={() => navigate('/process-model-creator')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                          <Network className="-ml-1 mr-2 h-5 w-5" />
                          Create Process Model
                        </button>
                        <button type="button" onClick={handleSaveDraft} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                          <Save className="-ml-1 mr-2 h-5 w-5" />
                          Save Draft
                        </button>
                        <button type="button" onClick={handleDownloadWord} disabled={isDownloading} className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E] ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                          {isDownloading ? <>
                              <RotateCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                              Generating...
                            </> : <>
                              <Download className="-ml-1 mr-2 h-5 w-5" />
                              Download as Word
                            </>}
                        </button>
                        <button type="button" onClick={handleSendToApprover} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <Send className="-ml-1 mr-2 h-5 w-5" />
                          Send to Approver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right sidebar for comments and version history */}
              <div className="space-y-8">
                {/* Add CommentSection component */}
                {document.id && <CommentSection documentId={document.id} documentContent={document.content} />}
                {/* Add VersionHistory component */}
                {document.id && <VersionHistory documentId={document.id} currentContent={document.content} documentTitle={formState.title} language={formState.documentLanguage} onRestoreVersion={content => {
            if (document) {
              setDocument({
                ...document,
                content: content
              });
            }
          }} />}
              </div>
            </div>}
      </div>
    </div>;
};
export default DocWriter;