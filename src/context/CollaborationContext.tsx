import React, { useEffect, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Types for collaboration features
export interface DocumentComment {
  id: string;
  documentId: string;
  content: string;
  author: string;
  authorEmail?: string;
  timestamp: string;
  resolved: boolean;
  parentId?: string; // For threaded comments
  selection?: {
    start: number;
    end: number;
    text: string;
  };
}
export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  versionNumber: number;
  notes?: string;
}
export interface SharedDocument {
  id: string;
  originalDocumentId: string;
  shareLink: string;
  createdAt: string;
  expiresAt?: string;
  accessLevel: 'view' | 'comment' | 'edit';
  allowedUsers?: string[]; // List of email addresses
  password?: string;
}
interface CollaborationContextType {
  // Comments
  comments: DocumentComment[];
  addComment: (comment: Omit<DocumentComment, 'id' | 'timestamp'>) => DocumentComment;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  getDocumentComments: (documentId: string) => DocumentComment[];
  // Versions
  versions: DocumentVersion[];
  addVersion: (version: Omit<DocumentVersion, 'id' | 'createdAt' | 'versionNumber'>) => DocumentVersion;
  getDocumentVersions: (documentId: string) => DocumentVersion[];
  getDocumentVersion: (versionId: string) => DocumentVersion | null;
  // Sharing
  sharedDocuments: SharedDocument[];
  shareDocument: (documentId: string, accessLevel: 'view' | 'comment' | 'edit', options?: {
    allowedUsers?: string[];
    expiresAt?: string;
    password?: string;
  }) => SharedDocument;
  getShareLink: (shareId: string) => string | null;
  getSharedDocument: (shareId: string) => SharedDocument | null;
  revokeAccess: (shareId: string) => void;
}
const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);
export const CollaborationProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const savedComments = localStorage.getItem('documentComments');
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
      const savedVersions = localStorage.getItem('documentVersions');
      if (savedVersions) {
        setVersions(JSON.parse(savedVersions));
      }
      const savedShares = localStorage.getItem('sharedDocuments');
      if (savedShares) {
        setSharedDocuments(JSON.parse(savedShares));
      }
    } catch (error) {
      console.error('Error loading collaboration data from localStorage:', error);
    }
  }, []);
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('documentComments', JSON.stringify(comments));
      localStorage.setItem('documentVersions', JSON.stringify(versions));
      localStorage.setItem('sharedDocuments', JSON.stringify(sharedDocuments));
    } catch (error) {
      console.error('Error saving collaboration data to localStorage:', error);
    }
  }, [comments, versions, sharedDocuments]);
  // Comments functions
  const addComment = (comment: Omit<DocumentComment, 'id' | 'timestamp'>): DocumentComment => {
    const newComment: DocumentComment = {
      ...comment,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  };
  const resolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => comment.id === commentId ? {
      ...comment,
      resolved: true
    } : comment));
  };
  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };
  const getDocumentComments = (documentId: string): DocumentComment[] => {
    return comments.filter(comment => comment.documentId === documentId);
  };
  // Versions functions
  const addVersion = (version: Omit<DocumentVersion, 'id' | 'createdAt' | 'versionNumber'>): DocumentVersion => {
    // Get existing versions for this document to determine the next version number
    const documentVersions = versions.filter(v => v.documentId === version.documentId);
    const versionNumber = documentVersions.length > 0 ? Math.max(...documentVersions.map(v => v.versionNumber)) + 1 : 1;
    const newVersion: DocumentVersion = {
      ...version,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      versionNumber
    };
    setVersions(prev => [...prev, newVersion]);
    return newVersion;
  };
  const getDocumentVersions = (documentId: string): DocumentVersion[] => {
    return versions.filter(version => version.documentId === documentId).sort((a, b) => b.versionNumber - a.versionNumber); // Sort by version number descending
  };
  const getDocumentVersion = (versionId: string): DocumentVersion | null => {
    return versions.find(version => version.id === versionId) || null;
  };
  // Sharing functions
  const shareDocument = (documentId: string, accessLevel: 'view' | 'comment' | 'edit', options?: {
    allowedUsers?: string[];
    expiresAt?: string;
    password?: string;
  }): SharedDocument => {
    const shareId = uuidv4();
    const shareLink = `${window.location.origin}/shared/${shareId}`;
    const newShare: SharedDocument = {
      id: shareId,
      originalDocumentId: documentId,
      shareLink,
      createdAt: new Date().toISOString(),
      accessLevel,
      ...options
    };
    setSharedDocuments(prev => [...prev, newShare]);
    return newShare;
  };
  const getShareLink = (shareId: string): string | null => {
    const share = sharedDocuments.find(s => s.id === shareId);
    return share ? share.shareLink : null;
  };
  const getSharedDocument = (shareId: string): SharedDocument | null => {
    return sharedDocuments.find(s => s.id === shareId) || null;
  };
  const revokeAccess = (shareId: string) => {
    setSharedDocuments(prev => prev.filter(share => share.id !== shareId));
  };
  return <CollaborationContext.Provider value={{
    comments,
    addComment,
    resolveComment,
    deleteComment,
    getDocumentComments,
    versions,
    addVersion,
    getDocumentVersions,
    getDocumentVersion,
    sharedDocuments,
    shareDocument,
    getShareLink,
    getSharedDocument,
    revokeAccess
  }}>
      {children}
    </CollaborationContext.Provider>;
};
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};