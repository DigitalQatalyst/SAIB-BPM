import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, FileText, AlertCircle, Upload, FileUp, Download, CheckCircle, Network, RotateCw, Eye, Edit } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { useLanguage } from '../context/LanguageContext';
import { generateFormattedWordDocument } from '../utils/wordGenerator';
import { getLinkedProcessModel } from '../utils/processModelUtils';
import DocumentPreview from '../components/docwriter/DocumentPreview';
import { getMockFullDocument } from '../utils/mockDocumentContent';

type FormStep = 'info' | 'additionalDocs';
type DocumentLanguage = 'english' | 'arabic' | 'bilingual';

const DocWriterSimple = () => {
  const { requestId, templateId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    createDocument,
    updateDocument,
    getDocumentByRequestId,
    setCurrentDocument,
    advanceToNextApprovalStage,
  } = useDocument();

  const [formStep, setFormStep] = useState<FormStep>('info');
  const [formState, setFormState] = useState({
    title: '',
    category: '',
    justification: '',
    sourceOfRequest: '',
    additionalContext: '',
    documentLanguage: 'english' as DocumentLanguage,
  });

  const [additionalDocFile, setAdditionalDocFile] = useState<File | null>(null);
  const [document, setDocument] = useState<{
    id: string;
    content: string;
    status: string;
  } | null>(null);

  const [showForm, setShowForm] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview'); // Default to preview
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process model state
  const [processModelId, setProcessModelId] = useState<string | null>(null);
  const [processModelImage, setProcessModelImage] = useState<string | null>(null);
  const [processModelTitle, setProcessModelTitle] = useState<string>('');

  // Load request data and existing document
  useEffect(() => {
    if (requestId) {
      const requestData = {
        id: parseInt(requestId),
        title: 'Updated Rule for Section 2.3 (Forms Rules)',
        category: 'Forms & Compliance',
        justification:
          'The Saudi Central Bank (SAMA) has issued new circulars regarding customer signatures and forms requirements.',
        sourceOfRequest: 'Regulatory Requirement',
        department: 'Compliance',
      };

      const existingDocument = getDocumentByRequestId(parseInt(requestId));
      if (existingDocument) {
        setDocument(existingDocument);
        setCurrentDocument(existingDocument);
        setEditMode(true);
        setShowForm(existingDocument.status === 'Needs Revision');
      }

      setFormState({
        title: requestData.title,
        category: requestData.category,
        justification: requestData.justification,
        sourceOfRequest: requestData.sourceOfRequest,
        additionalContext: '',
        documentLanguage: 'english',
      });
    }
  }, [requestId, getDocumentByRequestId, setCurrentDocument]);

  // Load process model
  useEffect(() => {
    if (requestId) {
      const linkedModel = getLinkedProcessModel(requestId);
      if (linkedModel) {
        setProcessModelId(linkedModel.id);
        setProcessModelImage(linkedModel.imageDataUrl);
        setProcessModelTitle(linkedModel.title);
      }
    }
  }, [requestId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
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

  // Generate document - 5 seconds with hardcoded content
  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('[POC] Generating document...');

      // Show generating state for 3 seconds to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get hardcoded SAMA content
      const generatedContent = getMockFullDocument();

      if (editMode && document) {
        updateDocument(document.id, { content: generatedContent });
        setDocument((prev) => (prev ? { ...prev, content: generatedContent } : null));
      } else if (requestId) {
        const newDocument = createDocument(parseInt(requestId), {
          title: formState.title,
          content: generatedContent,
        });
        setDocument(newDocument);
        setCurrentDocument(newDocument);
      }

      setShowForm(false);
      setFormStep('info');

      console.log('[POC] Document generated successfully');
    } catch (error) {
      console.error('Error generating document:', error);
      setError('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToApprover = () => {
    if (document) {
      advanceToNextApprovalStage(document.id);
      if (requestId) {
        navigate(`/manage-requests`);
      }
    }
  };

  const handleSaveDraft = () => {
    if (document && document.content) {
      updateDocument(document.id, { content: document.content });
      alert('Document saved successfully');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (document) {
      setDocument({ ...document, content: e.target.value });
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
        setIsDownloading(true);
        await generateFormattedWordDocument(
          document.content,
          formState.title,
          formState.documentLanguage,
          processModelImage || undefined
        );
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (error) {
        console.error('Error downloading Word document:', error);
        setDownloadError('Failed to generate Word document. Please try again.');
        setTimeout(() => setDownloadError(null), 3000);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <button
            onClick={handleBackToRequest}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {requestId ? 'Back to Requests' : 'Back to Templates'}
          </button>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            AI DocWriter
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {editMode
              ? 'Edit document based on service request feedback'
              : requestId
                ? 'Generate document based on service request information'
                : 'Create document using the selected template'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {showForm ? (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {formStep === 'info'
                  ? 'Document Generation Form'
                  : 'Additional Documents'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {formStep === 'info'
                  ? 'Provide additional context to help the AI generate a better document'
                  : 'Upload additional documents to assist with document generation'}
              </p>
            </div>

            {formStep === 'info' && (
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Document Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source of Request
                    </label>
                    <input
                      type="text"
                      name="sourceOfRequest"
                      value={formState.sourceOfRequest}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Document Language
                    </label>
                    <select
                      name="documentLanguage"
                      value={formState.documentLanguage}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-3"
                    >
                      <option value="english">English Only</option>
                      <option value="arabic">Arabic Only</option>
                      <option value="bilingual">Bilingual (English & Arabic)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Justification
                    </label>
                    <textarea
                      name="justification"
                      rows={3}
                      value={formState.justification}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Context
                    </label>
                    <textarea
                      name="additionalContext"
                      rows={4}
                      value={formState.additionalContext}
                      onChange={handleInputChange}
                      className="mt-1 shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleBackToRequest}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {formStep === 'additionalDocs' && (
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Additional Documents
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload a document</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".doc,.docx,.pdf,.txt,.md,.xml"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          DOC, DOCX, PDF, TXT, MD, XML up to 10MB
                        </p>
                      </div>
                    </div>
                    {additionalDocFile && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected file: {additionalDocFile.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isGenerating}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={isGenerating}
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Document
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          document && (
            <div className="grid grid-cols-1 gap-8">
              {/* Document Editor - Main Content */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Document {viewMode === 'preview' ? 'Preview' : 'Editor'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {viewMode === 'preview'
                          ? 'Review the formatted document'
                          : 'Edit the document content'}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      {/* View Mode Toggle */}
                      <div className="flex items-center space-x-2 mr-4">
                        <button
                          type="button"
                          onClick={() => setViewMode('preview')}
                          className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md ${viewMode === 'preview'
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                          <Eye className="-ml-0.5 mr-2 h-4 w-4" />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('edit')}
                          className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md ${viewMode === 'edit'
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                          <Edit className="-ml-0.5 mr-2 h-4 w-4" />
                          Edit
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => window.open('https://arqitek-ae.avolutionsoftware.com/Browser/?p=Content%2FDiagrams%2F8476543.html', '_blank')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Network className="-ml-0.5 mr-2 h-4 w-4" />
                        {processModelId ? 'Edit Process Model' : 'Amend Process Model'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Save className="-ml-0.5 mr-2 h-4 w-4" />
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={handleSendToApprover}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Send className="-ml-0.5 mr-2 h-4 w-4" />
                        Send to Approver
                      </button>
                    </div>
                  </div>

                  {downloadSuccess && (
                    <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <p className="text-sm text-green-700">
                          Document successfully downloaded as Word
                        </p>
                      </div>
                    </div>
                  )}

                  {downloadError && (
                    <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <p className="text-sm text-red-700">{downloadError}</p>
                      </div>
                    </div>
                  )}

                  <div className="px-4 py-5 sm:px-6">
                    {viewMode === 'preview' ? (
                      /* Preview Mode - Formatted Document */
                      <DocumentPreview
                        content={document.content}
                        title={formState.title}
                      />
                    ) : (
                      /* Edit Mode - Raw Markdown */
                      <>
                        <div className="flex items-center mb-4 text-sm text-gray-500">
                          <FileText className="mr-2 h-5 w-5 text-gray-400" />
                          <span>{formState.title}</span>
                          {formState.documentLanguage === 'bilingual' && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Bilingual
                            </span>
                          )}
                        </div>

                        <div className="border border-gray-300 rounded-md shadow-sm">
                          <textarea
                            rows={25}
                            value={document.content}
                            onChange={handleContentChange}
                            className="block w-full border-0 p-4 font-mono text-sm focus:ring-[#FECC0E] focus:border-[#FECC0E]"
                            style={{ lineHeight: 1.6 }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div >
  );
};

export default DocWriterSimple;
