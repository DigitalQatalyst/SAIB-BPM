import React, { useState } from 'react';
import { Share, Copy, Users, Key, Clock, Check, X } from 'lucide-react';
import { useCollaboration } from '../../context/CollaborationContext';
interface DocumentShareProps {
  documentId: string;
  documentTitle: string;
}
const DocumentShare: React.FC<DocumentShareProps> = ({
  documentId,
  documentTitle
}) => {
  const {
    shareDocument,
    sharedDocuments,
    revokeAccess
  } = useCollaboration();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'view' | 'comment' | 'edit'>('view');
  const [withPassword, setWithPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [specificUsers, setSpecificUsers] = useState(false);
  const [emails, setEmails] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  // Get existing shares for this document
  const documentShares = sharedDocuments.filter(share => share.originalDocumentId === documentId);
  const handleShare = () => {
    const options: any = {};
    if (withPassword && password) {
      options.password = password;
    }
    if (expiryDate) {
      options.expiresAt = new Date(expiryDate).toISOString();
    }
    if (specificUsers && emails) {
      options.allowedUsers = emails.split(',').map(email => email.trim()).filter(email => email.includes('@'));
    }
    const newShare = shareDocument(documentId, accessLevel, options);
    setActiveShareId(newShare.id);
    // Reset form
    setWithPassword(false);
    setPassword('');
    setExpiryDate('');
    setSpecificUsers(false);
    setEmails('');
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'view':
        return 'View only';
      case 'comment':
        return 'Can comment';
      case 'edit':
        return 'Can edit';
      default:
        return level;
    }
  };
  return <div>
      <button onClick={() => setIsShareModalOpen(true)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
        <Share className="-ml-0.5 mr-2 h-4 w-4" />
        Share
      </button>
      {isShareModalOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Share Document
              </h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Share "{documentTitle}" with others by creating a shareable link
              </p>
            </div>
            {/* Create new share section */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Create new share link
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access level
                </label>
                <select value={accessLevel} onChange={e => setAccessLevel(e.target.value as any)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm">
                  <option value="view">View only</option>
                  <option value="comment">Can comment</option>
                  <option value="edit">Can edit</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input id="with-password" type="checkbox" checked={withPassword} onChange={e => setWithPassword(e.target.checked)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" />
                  <label htmlFor="with-password" className="ml-2 block text-sm text-gray-700">
                    Protect with password
                  </label>
                </div>
                {withPassword && <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" />}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link expiry (optional)
                </label>
                <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" />
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input id="specific-users" type="checkbox" checked={specificUsers} onChange={e => setSpecificUsers(e.target.checked)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 rounded" />
                  <label htmlFor="specific-users" className="ml-2 block text-sm text-gray-700">
                    Share with specific users
                  </label>
                </div>
                {specificUsers && <div>
                    <input type="text" value={emails} onChange={e => setEmails(e.target.value)} placeholder="Enter email addresses, separated by commas" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" />
                    <p className="mt-1 text-xs text-gray-500">
                      Only these users will be able to access the document
                    </p>
                  </div>}
              </div>
              <button onClick={handleShare} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Share className="mr-2 h-4 w-4" />
                Create Share Link
              </button>
            </div>
            {/* Active shares section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Active share links
              </h4>
              {documentShares.length === 0 ? <p className="text-sm text-gray-500 italic">
                  No active share links
                </p> : <ul className="divide-y divide-gray-200">
                  {documentShares.map(share => <li key={share.id} className={`py-3 ${activeShareId === share.id ? 'bg-blue-50 -mx-3 px-3 rounded' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${share.accessLevel === 'view' ? 'bg-blue-100 text-blue-800' : share.accessLevel === 'comment' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                              {getAccessLevelLabel(share.accessLevel)}
                            </span>
                            {share.password && <span className="ml-2 flex items-center text-xs text-gray-500">
                                <Key className="h-3 w-3 mr-1" />
                                Password protected
                              </span>}
                            {share.expiresAt && <span className="ml-2 flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires {formatDate(share.expiresAt)}
                              </span>}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 truncate max-w-xs">
                            {share.shareLink}
                          </p>
                          {share.allowedUsers && share.allowedUsers.length > 0 && <div className="mt-1 flex items-center text-xs text-gray-500">
                                <Users className="h-3 w-3 mr-1" />
                                Restricted to {share.allowedUsers.length}{' '}
                                user(s)
                              </div>}
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => copyToClipboard(share.shareLink)} className="text-gray-400 hover:text-gray-600" title="Copy link">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button onClick={() => revokeAccess(share.id)} className="text-red-400 hover:text-red-600" title="Revoke access">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>)}
                </ul>}
            </div>
            {/* Copy success message */}
            {showCopiedMessage && <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-md shadow-lg flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Link copied to clipboard
              </div>}
          </div>
        </div>}
    </div>;
};
export default DocumentShare;