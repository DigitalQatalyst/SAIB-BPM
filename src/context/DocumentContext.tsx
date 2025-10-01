import React, { useEffect, useState, createContext, useContext } from 'react';
import { getRequestById, linkDocumentToRequest } from '../services/requestTracking';
type ApprovalStatus = 'Draft' | 'In Review (Level 1)' | 'In Review (Level 2)' | 'In Review (Level 3)' | 'Approved for Publication' | 'Published' | 'Needs Revision';
interface Approver {
  name: string;
  role: string;
  email: string;
  level: number;
  status: 'Pending' | 'Approved' | 'Requested Changes';
  date: string;
  comments?: string;
}
interface DocumentData {
  id: string;
  requestId: number;
  title: string;
  content: string;
  version: number;
  status: ApprovalStatus;
  currentApprovalLevel: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvers: Approver[];
  documentUrl?: string;
}
interface DocumentContextType {
  documents: DocumentData[];
  currentDocument: DocumentData | null;
  createDocument: (requestId: number, initialData: Partial<DocumentData>) => DocumentData;
  updateDocument: (id: string, updates: Partial<DocumentData>) => void;
  getDocumentByRequestId: (requestId: number) => DocumentData | null;
  getDocumentById: (id: string) => DocumentData | null;
  setCurrentDocument: (document: DocumentData | null) => void;
  advanceToNextApprovalStage: (documentId: string) => void;
  requestRevision: (documentId: string, comments: string, approverLevel: number) => void;
  approveDocument: (documentId: string, approverLevel: number) => void;
  publishDocument: (documentId: string) => void;
}
const STORAGE_KEY = 'policyDocuments';
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);
export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);
  // Load documents from localStorage on mount
  useEffect(() => {
    const loadDocuments = () => {
      try {
        const storedDocs = localStorage.getItem(STORAGE_KEY);
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        }
      } catch (error) {
        console.error('Error loading documents from localStorage:', error);
      }
    };
    loadDocuments();
    window.addEventListener('storage', loadDocuments);
    return () => {
      window.removeEventListener('storage', loadDocuments);
    };
  }, []);
  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }
  }, [documents]);
  const createDocument = (requestId: number, initialData: Partial<DocumentData>): DocumentData => {
    // Get request details to pre-fill document
    const request = getRequestById(requestId);
    const newDocument: DocumentData = {
      id: `doc-${Date.now()}`,
      requestId,
      title: initialData.title || request?.requestDetail || 'Untitled Document',
      content: initialData.content || '',
      version: 1,
      status: 'Draft',
      currentApprovalLevel: 0,
      createdBy: 'Khalid Al-Otaibi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvers: initialData.approvers || [{
        name: 'Ahmed Al-Rashid',
        role: 'Compliance Officer',
        email: 'ahmed.alrashid@saib.com',
        level: 1,
        status: 'Pending',
        date: '-'
      }, {
        name: 'Mohammed Al-Qahtani',
        role: 'Department Head',
        email: 'mohammed.alqahtani@saib.com',
        level: 2,
        status: 'Pending',
        date: '-'
      }, {
        name: 'Fatima Al-Harbi',
        role: 'Legal Reviewer',
        email: 'fatima.alharbi@saib.com',
        level: 3,
        status: 'Pending',
        date: '-'
      }],
      ...initialData
    };
    setDocuments(prev => [...prev, newDocument]);
    // Link document to request
    if (requestId) {
      linkDocumentToRequest(requestId, newDocument.id);
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
    }
    return newDocument;
  };
  const updateDocument = (id: string, updates: Partial<DocumentData>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? {
      ...doc,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: updates.content ? doc.version + 1 : doc.version
    } : doc));
    if (currentDocument?.id === id) {
      setCurrentDocument(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
        version: updates.content ? prev.version + 1 : prev.version
      } : null);
    }
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };
  const getDocumentByRequestId = (requestId: number): DocumentData | null => {
    // First check if we have the document in our state
    const existingDoc = documents.find(doc => doc.requestId === requestId);
    if (existingDoc) {
      return existingDoc;
    }
    // If not in state, check localStorage (for mock completed documents)
    try {
      const storedDocuments = localStorage.getItem('generatedDocuments');
      if (storedDocuments) {
        const parsedDocuments = JSON.parse(storedDocuments);
        const doc = parsedDocuments.find((doc: any) => doc.requestId === requestId);
        if (doc) {
          return doc;
        }
      }
    } catch (error) {
      console.error('Error retrieving document from localStorage:', error);
    }
    return null;
  };
  const getDocumentById = (id: string): DocumentData | null => {
    return documents.find(doc => doc.id === id) || null;
  };
  const advanceToNextApprovalStage = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    const nextLevel = document.currentApprovalLevel + 1;
    let newStatus: ApprovalStatus;
    if (nextLevel > 3) {
      newStatus = 'Approved for Publication';
    } else {
      newStatus = `In Review (Level ${nextLevel})` as ApprovalStatus;
    }
    updateDocument(documentId, {
      status: newStatus,
      currentApprovalLevel: nextLevel
    });
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };
  const requestRevision = (documentId: string, comments: string, approverLevel: number) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    const updatedApprovers = document.approvers.map(approver => approver.level === approverLevel ? {
      ...approver,
      status: 'Requested Changes',
      date: new Date().toISOString().split('T')[0],
      comments
    } : approver);
    updateDocument(documentId, {
      status: 'Needs Revision',
      approvers: updatedApprovers
    });
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };
  const approveDocument = (documentId: string, approverLevel: number) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    const updatedApprovers = document.approvers.map(approver => approver.level === approverLevel ? {
      ...approver,
      status: 'Approved',
      date: new Date().toISOString().split('T')[0]
    } : approver);
    updateDocument(documentId, {
      approvers: updatedApprovers
    });
    advanceToNextApprovalStage(documentId);
  };
  const publishDocument = (documentId: string) => {
    updateDocument(documentId, {
      status: 'Published',
      documentUrl: 'https://saib.sharepoint.com/sites/policies/documents/policy-123.docx'
    });
    // Find the associated request and mark it as completed
    const document = documents.find(doc => doc.id === documentId);
    if (document && document.requestId) {
      const {
        requestId
      } = document;
      import('../services/requestTracking').then(module => {
        module.completeRequest(requestId);
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      });
    }
  };
  return <DocumentContext.Provider value={{
    documents,
    currentDocument,
    createDocument,
    updateDocument,
    getDocumentByRequestId,
    getDocumentById,
    setCurrentDocument,
    advanceToNextApprovalStage,
    requestRevision,
    approveDocument,
    publishDocument
  }}>
      {children}
    </DocumentContext.Provider>;
};
export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};