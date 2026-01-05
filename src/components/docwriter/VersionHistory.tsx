import React, { useEffect, useState } from 'react';
import { History, Clock, ArrowLeft, Download, Eye, RotateCcw } from 'lucide-react';
import { useCollaboration, DocumentVersion } from '../../context/CollaborationContext';
import { generateFormattedWordDocument } from '../../utils/wordGenerator';
import { getProcessModelImage } from '../../utils/processModelUtils';
interface VersionHistoryProps {
  documentId: string;
  currentContent: string;
  documentTitle: string;
  language: string;
  onRestoreVersion?: (content: string) => void;
}
const VersionHistory: React.FC<VersionHistoryProps> = ({
  documentId,
  currentContent,
  documentTitle,
  language,
  onRestoreVersion
}) => {
  const {
    getDocumentVersions,
    addVersion
  } = useCollaboration();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [isViewingVersion, setIsViewingVersion] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [showSaveVersionForm, setShowSaveVersionForm] = useState(false);
  useEffect(() => {
    // Load versions for this document
    const documentVersions = getDocumentVersions(documentId);
    setVersions(documentVersions);
  }, [documentId, getDocumentVersions]);
  const handleSaveVersion = () => {
    const newVersion = addVersion({
      documentId,
      content: currentContent,
      createdBy: 'Current User',
      notes: versionNotes
    });
    setVersions([newVersion, ...versions]);
    setVersionNotes('');
    setShowSaveVersionForm(false);
  };
  const handleViewVersion = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setIsViewingVersion(true);
  };
  const handleRestoreVersion = () => {
    if (selectedVersion && onRestoreVersion) {
      onRestoreVersion(selectedVersion.content);
      setIsViewingVersion(false);
      setSelectedVersion(null);
    }
  };
  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      setIsDownloading(true);

      // Get process model image for this document
      const processImage = getProcessModelImage(documentId) || undefined;

      // Generate Word document with process model
      await generateFormattedWordDocument(
        version.content,
        `${documentTitle} (Version ${version.versionNumber})`,
        language,
        processImage
      );
    } catch (error) {
      console.error('Error downloading version:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <History className="h-5 w-5 mr-2 text-gray-400" />
        Version History
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Track changes and restore previous versions
      </p>
    </div>
    {isViewingVersion ? <div className="px-4 py-5 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => {
          setIsViewingVersion(false);
          setSelectedVersion(null);
        }} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to version list
        </button>
        <div className="flex space-x-2">
          <button onClick={handleRestoreVersion} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RotateCcw className="mr-1 h-4 w-4" />
            Restore this version
          </button>
          <button onClick={() => selectedVersion && handleDownloadVersion(selectedVersion)} disabled={isDownloading} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Download className="mr-1 h-4 w-4" />
            Download
          </button>
        </div>
      </div>
      <div className="mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              Version {selectedVersion?.versionNumber}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {selectedVersion && formatDate(selectedVersion.createdAt)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Created by {selectedVersion?.createdBy}
          </div>
        </div>
        {selectedVersion?.notes && <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
          <p className="font-medium text-gray-600 mb-1">Version notes:</p>
          <p>{selectedVersion.notes}</p>
        </div>}
      </div>
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto max-h-96">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
          {selectedVersion?.content}
        </pre>
      </div>
    </div> : <div className="px-4 py-5 sm:px-6">
      {/* Save current version form */}
      {!showSaveVersionForm ? <div className="mb-6">
        <button onClick={() => setShowSaveVersionForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Current Version
        </button>
      </div> : <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Save Current Version
        </h4>
        <div className="mb-3">
          <label htmlFor="version-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Version Notes (optional)
          </label>
          <textarea id="version-notes" rows={3} value={versionNotes} onChange={e => setVersionNotes(e.target.value)} placeholder="Describe the changes made in this version..." className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => {
            setShowSaveVersionForm(false);
            setVersionNotes('');
          }} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="button" onClick={handleSaveVersion} className="inline-flex items-center px-4 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Version
          </button>
        </div>
      </div>}
      {/* Version list */}
      {versions.length > 0 ? <ul className="divide-y divide-gray-200">
        {versions.map(version => <li key={version.id} className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">
                  Version {version.versionNumber}
                </span>
                <span className="ml-2 flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(version.createdAt)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Created by {version.createdBy}
              </div>
              {version.notes && <div className="mt-1 text-sm text-gray-700">
                <p className="line-clamp-1">{version.notes}</p>
              </div>}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleViewVersion(version)} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Eye className="mr-1 h-3 w-3" />
                View
              </button>
              <button onClick={() => handleDownloadVersion(version)} disabled={isDownloading} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Download className="mr-1 h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        </li>)}
      </ul> : <div className="text-center py-6">
        <History className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">
          No saved versions yet
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Save versions to track changes and restore previous work
        </p>
      </div>}
    </div>}
  </div>;
};
export default VersionHistory;