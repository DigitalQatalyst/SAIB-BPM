import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, MessageSquare, Edit, Download, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';
import { useCollaboration } from '../context/CollaborationContext';
import { useDocument } from '../context/DocumentContext';
import CommentSection from '../components/docwriter/CommentSection';
import { generateFormattedWordDocument } from '../utils/wordGenerator';
const SharedDocument = () => {
  const {
    shareId
  } = useParams<{
    shareId: string;
  }>();
  const navigate = useNavigate();
  const {
    getSharedDocument
  } = useCollaboration();
  const {
    documents,
    updateDocument
  } = useDocument();
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [document, setDocument] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [content, setContent] = useState('');
  const [documentLanguage, setDocumentLanguage] = useState('english');
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!shareId) return;
    const sharedDocument = getSharedDocument(shareId);
    if (!sharedDocument) {
      // Invalid share link
      return;
    }
    // Check if share has expired
    if (sharedDocument.expiresAt) {
      const expiryDate = new Date(sharedDocument.expiresAt);
      if (expiryDate < new Date()) {
        // Share link has expired
        return;
      }
    }
    // If no password protection, mark as verified
    if (!sharedDocument.password) {
      setIsPasswordVerified(true);
    }
    // Find the original document
    const originalDocument = documents.find(doc => doc.id === sharedDocument.originalDocumentId);
    if (originalDocument) {
      setDocument(originalDocument);
      setContent(originalDocument.content);
      setDocumentLanguage('english'); // Default to English, could be stored in document
    }
  }, [shareId, getSharedDocument, documents]);
  const verifyPassword = () => {
    if (!shareId) return;
    const sharedDocument = getSharedDocument(shareId);
    if (!sharedDocument) return;
    if (password === sharedDocument.password) {
      setIsPasswordVerified(true);
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
    }
  };
  const handleDownload = async () => {
    if (!document) return;
    try {
      setIsDownloading(true);
      await generateFormattedWordDocument(content, document.title, documentLanguage);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleSaveChanges = () => {
    if (!document) return;
    updateDocument(document.id, {
      content: content
    });
    setIsEditing(false);
    // Show success message or notification
  };
  // Get access level from the shared document
  const getAccessLevel = (): 'view' | 'comment' | 'edit' => {
    if (!shareId) return 'view';
    const sharedDocument = getSharedDocument(shareId);
    return sharedDocument?.accessLevel || 'view';
  };
  const accessLevel = getAccessLevel();
  const canEdit = accessLevel === 'edit';
  const canComment = accessLevel === 'comment' || accessLevel === 'edit';
  // Check if the share link is valid
  if (!shareId || !getSharedDocument(shareId)) {
    return <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Invalid Share Link
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This shared document link is invalid or has been revoked.
            </p>
            <div className="mt-6">
              <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  // Check if the share link has expired
  const sharedDocument = getSharedDocument(shareId);
  if (sharedDocument?.expiresAt && new Date(sharedDocument.expiresAt) < new Date()) {
    return <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Share Link Expired
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This shared document link has expired.
            </p>
            <div className="mt-6">
              <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  // Password verification screen
  if (!isPasswordVerified && sharedDocument?.password) {
    return <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
              Password Protected
            </h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              This document is password protected. Please enter the password to
              view it.
            </p>
            <div className="mt-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input type="password" id="password" value={password} onChange={e => {
                setPassword(e.target.value);
                setIsPasswordError(false);
              }} className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${isPasswordError ? 'border-red-300' : ''}`} placeholder="Enter password" />
              </div>
              {isPasswordError && <p className="mt-2 text-sm text-red-600">
                  Incorrect password. Please try again.
                </p>}
            </div>
            <div className="mt-6">
              <button onClick={verifyPassword} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Access Document
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  // Loading state
  if (!document) {
    return <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {document.title}
              </h1>
              <div className="mt-1 flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${accessLevel === 'view' ? 'bg-blue-100 text-blue-800' : accessLevel === 'comment' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                  {accessLevel === 'view' ? <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      View only
                    </div> : accessLevel === 'comment' ? <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Can comment
                    </div> : <div className="flex items-center">
                      <Edit className="h-3 w-3 mr-1" />
                      Can edit
                    </div>}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleDownload} disabled={isDownloading} className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E] ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                <Download className="-ml-0.5 mr-2 h-4 w-4" />
                Download
              </button>
              {canEdit && !isEditing && <button onClick={() => setIsEditing(true)} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Edit className="-ml-0.5 mr-2 h-4 w-4" />
                  Edit
                </button>}
            </div>
          </div>
          {/* Document content */}
          <div className="px-6 py-5">
            {isEditing ? <div>
                <textarea rows={25} value={content} onChange={handleContentChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono" style={{
              lineHeight: 1.6
            }} />
                <div className="mt-4 flex justify-end space-x-3">
                  <button onClick={() => {
                setIsEditing(false);
                setContent(document.content); // Reset content
              }} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button onClick={handleSaveChanges} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div> : <div className="prose max-w-none" style={{
            whiteSpace: 'pre-wrap'
          }}>
                {content}
              </div>}
          </div>
        </div>
        {/* Comments section - only show if user can comment */}
        {canComment && <div className="mb-8">
            <CommentSection documentId={document.id} documentContent={content} readOnly={accessLevel !== 'edit'} />
          </div>}
      </div>
    </div>;
};
export default SharedDocument;