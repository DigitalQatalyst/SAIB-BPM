import React, { useEffect, useState } from 'react';
import { MessageSquare, User, Check, X, Reply, CornerUpRight } from 'lucide-react';
import { useCollaboration, DocumentComment } from '../../context/CollaborationContext';
import { useUser } from '../../context/UserContext';
interface CommentSectionProps {
  documentId: string;
  documentContent: string;
  readOnly?: boolean;
}
const CommentSection: React.FC<CommentSectionProps> = ({
  documentId,
  documentContent,
  readOnly = false
}) => {
  const {
    getDocumentComments,
    addComment,
    resolveComment,
    deleteComment
  } = useCollaboration();
  const {
    user
  } = useUser();
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [selectedText, setSelectedText] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);
  useEffect(() => {
    // Load comments for this document
    const documentComments = getDocumentComments(documentId);
    setComments(documentComments);
  }, [documentId, getDocumentComments]);
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const commentData: Omit<DocumentComment, 'id' | 'timestamp'> = {
      documentId,
      content: newCommentText,
      author: user?.name || 'Anonymous',
      authorEmail: user?.email,
      resolved: false,
      selection: selectedText || undefined,
      parentId: replyingTo || undefined
    };
    addComment(commentData);
    setNewCommentText('');
    setSelectedText(null);
    setReplyingTo(null);
    setIsCommenting(false);
    // Refresh comments
    const updatedComments = getDocumentComments(documentId);
    setComments(updatedComments);
  };
  const handleResolveComment = (commentId: string) => {
    resolveComment(commentId);
    // Refresh comments
    const updatedComments = getDocumentComments(documentId);
    setComments(updatedComments);
  };
  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
    // Refresh comments
    const updatedComments = getDocumentComments(documentId);
    setComments(updatedComments);
  };
  const handleTextSelection = () => {
    if (readOnly) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Get the textarea element
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setSelectedText({
          start,
          end,
          text: selection.toString()
        });
        setIsCommenting(true);
      }
    }
  };
  // Group comments by thread
  const topLevelComments = comments.filter(comment => !comment.parentId);
  const commentReplies = comments.filter(comment => comment.parentId);
  const getRepliesForComment = (commentId: string) => {
    return commentReplies.filter(reply => reply.parentId === commentId);
  };
  // Format date to readable format
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
          <MessageSquare className="h-5 w-5 mr-2 text-gray-400" />
          Comments
        </h3>
        {!readOnly && <p className="mt-1 text-sm text-gray-500">
            Select text in the document to add a comment
          </p>}
      </div>
      <div className="px-4 py-5 sm:px-6">
        {/* New comment form */}
        {isCommenting && !readOnly && <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                {selectedText && <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <p className="font-medium text-gray-600 mb-1">
                      Selected text:
                    </p>
                    <p className="text-gray-700 italic">
                      "{selectedText.text}"
                    </p>
                  </div>}
                {replyingTo && <div className="mb-2 flex items-center">
                    <CornerUpRight className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      Replying to comment
                    </span>
                    <button onClick={() => setReplyingTo(null)} className="ml-2 text-sm text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>}
                <div>
                  <textarea rows={3} value={newCommentText} onChange={e => setNewCommentText(e.target.value)} placeholder="Add a comment..." className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md px-4 py-3" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex-grow">
                    <button onClick={() => {
                  setIsCommenting(false);
                  setSelectedText(null);
                  setNewCommentText('');
                  setReplyingTo(null);
                }} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                  </div>
                  <button onClick={handleAddComment} className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>}
        {/* Comment list */}
        {topLevelComments.length > 0 ? <div className="space-y-6">
            {topLevelComments.map(comment => <div key={comment.id} className={`${comment.resolved ? 'opacity-60' : ''}`}>
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      {!readOnly && <div className="flex space-x-2">
                          {!comment.resolved && <button onClick={() => handleResolveComment(comment.id)} className="text-green-500 hover:text-green-600" title="Resolve comment">
                              <Check className="h-4 w-4" />
                            </button>}
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-red-400 hover:text-red-600" title="Delete comment">
                            <X className="h-4 w-4" />
                          </button>
                        </div>}
                    </div>
                    {comment.selection && <div className="mb-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
                        <p className="text-gray-700 italic">
                          "{comment.selection.text}"
                        </p>
                      </div>}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {comment.resolved && <div className="mt-2 flex items-center text-xs text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Resolved
                      </div>}
                    {!readOnly && !comment.resolved && <div className="mt-2">
                        <button onClick={() => {
                  setReplyingTo(comment.id);
                  setIsCommenting(true);
                }} className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </button>
                      </div>}
                  </div>
                </div>
                {/* Comment replies */}
                {getRepliesForComment(comment.id).length > 0 && <div className="ml-12 mt-2 space-y-3">
                    {getRepliesForComment(comment.id).map(reply => <div key={reply.id} className={`flex space-x-3 ${reply.resolved ? 'opacity-60' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {reply.author}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                {formatDate(reply.timestamp)}
                              </span>
                            </div>
                            {!readOnly && <div className="flex space-x-2">
                                {!reply.resolved && <button onClick={() => handleResolveComment(reply.id)} className="text-green-500 hover:text-green-600" title="Resolve comment">
                                    <Check className="h-4 w-4" />
                                  </button>}
                                <button onClick={() => handleDeleteComment(reply.id)} className="text-red-400 hover:text-red-600" title="Delete comment">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>}
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          {reply.resolved && <div className="mt-1 flex items-center text-xs text-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Resolved
                            </div>}
                        </div>
                      </div>)}
                  </div>}
              </div>)}
          </div> : <div className="text-center py-6">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No comments yet</p>
            {!readOnly && <button onClick={() => setIsCommenting(true)} className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add a comment
              </button>}
          </div>}
      </div>
    </div>;
};
export default CommentSection;