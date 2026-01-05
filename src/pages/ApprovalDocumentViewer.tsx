import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Network, AlertCircle } from 'lucide-react';
import { useDocument } from '../context/DocumentContext';
import { getLinkedProcessModel, getProcessModelImage } from '../utils/processModelUtils';
import { generateFormattedWordDocument } from '../utils/wordGenerator';

const ApprovalDocumentViewer = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const navigate = useNavigate();
    const { getDocumentByRequestId } = useDocument();

    const [document, setDocument] = useState<any | null>(null);
    const [processModelId, setProcessModelId] = useState<string | null>(null);
    const [processModelImage, setProcessModelImage] = useState<string | null>(null);
    const [processModelTitle, setProcessModelTitle] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (requestId) {
            // Get document from request ID
            const doc = getDocumentByRequestId(parseInt(requestId));
            if (doc) {
                setDocument(doc);

                // Load process model if linked
                const linkedModel = getLinkedProcessModel(doc.id);
                if (linkedModel) {
                    setProcessModelId(linkedModel.id);
                    setProcessModelImage(linkedModel.imageDataUrl);
                    setProcessModelTitle(linkedModel.title);
                }
            } else {
                // No document found - create mock document for approval preview
                const mockDocument = {
                    id: `approval-${requestId}`,
                    title: 'Information Security Policy Update',
                    content: `# Information Security Policy

## 1. Purpose
This policy establishes the framework for protecting information assets and managing information security risks across the organization.

## 2. Scope
This policy applies to all employees, contractors, and third parties who have access to organizational information and information systems.

## 3. Policy Statements

### 3.1 Information Classification
All information must be classified according to its sensitivity and criticality to the organization.

### 3.2 Access Control
Access to information and systems must be granted based on business need and the principle of least privilege.

### 3.3 Incident Response
All security incidents must be reported immediately through the designated incident response channels.

## 4. Responsibilities
- **Information Security Team**: Implement and maintain security controls
- **Department Heads**: Ensure compliance within their departments
- **All Employees**: Follow security policies and report incidents

## 5. Compliance
Non-compliance with this policy may result in disciplinary action up to and including termination.`,
                    status: 'Pending Approval',
                    requestId: parseInt(requestId)
                };

                setDocument(mockDocument);

                // Try to load process model if one was created
                const linkedModel = getLinkedProcessModel(mockDocument.id);
                if (linkedModel) {
                    setProcessModelId(linkedModel.id);
                    setProcessModelImage(linkedModel.imageDataUrl);
                    setProcessModelTitle(linkedModel.title);
                }
            }
        }
    }, [requestId, getDocumentByRequestId]);

    const handleDownloadWord = async () => {
        if (document && document.content) {
            try {
                setIsDownloading(true);

                // Get process model image if exists
                const processImage = processModelImage || undefined;

                // Generate Word document with process model
                await generateFormattedWordDocument(
                    document.content,
                    document.title,
                    'english',
                    processImage
                );
            } catch (error) {
                console.error('Error downloading Word document:', error);
                alert('Failed to generate Word document. Please try again.');
            } finally {
                setIsDownloading(false);
            }
        }
    };

    if (!document) {
        return (
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Document not found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            The document you're looking for doesn't exist or you don't have permission to view it.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/approval-requests')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Back to Approvals
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/approval-requests')}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Approval List
                    </button>

                    <button
                        onClick={handleDownloadWord}
                        disabled={isDownloading}
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E] ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? 'Downloading...' : 'Download as Word'}
                    </button>
                </div>

                {/* Document Header */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-900">{document.title}</h1>
                        <div className="mt-2 flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending Approval
                            </span>
                        </div>
                    </div>

                    {/* Process Model Preview */}
                    {processModelImage && (
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Process Flow Diagram</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{processModelTitle}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/process-model-creator/${requestId}`)}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Network className="h-3.5 w-3.5 mr-1" />
                                    View Process Model
                                </button>
                            </div>
                            <div className="bg-white p-3 rounded border border-gray-300">
                                <img
                                    src={processModelImage}
                                    alt="Process Model"
                                    className="w-full rounded"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                This process diagram will be automatically embedded in the downloaded Word document
                            </p>
                        </div>
                    )}

                    {/* Document Content */}
                    <div className="px-6 py-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Document Content</h2>
                        <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                                {document.content}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDocumentViewer;
