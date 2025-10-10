import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User, CheckCircle, MessageCircle, FileText, AlertCircle, FileEdit, ExternalLink, Download } from 'lucide-react';
import { getRequestById, RequestItem, addApproverComment, getDocumentByRequestId } from '../../services/requestTracking';
import { useUser } from '../../context/UserContext';
import { useDocument } from '../../context/DocumentContext';
interface RequestDetailsProps {
  requestId: number;
  onBackToList: () => void;
}
const RequestDetails: React.FC<RequestDetailsProps> = ({
  requestId,
  onBackToList
}) => {
  const {
    role,
    name
  } = useUser();
  const {
    createDocument,
    getDocumentByRequestId: contextGetDocumentByRequestId,
    approveDocument,
    requestRevision
  } = useDocument();
  const [request, setRequest] = useState<RequestItem | undefined>(getRequestById(requestId));
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'approve' | 'reject'>('comment');
  const [document, setDocument] = useState<any>(null);
  // Load the latest request data and associated document
  useEffect(() => {
    const loadData = () => {
      const updatedRequest = getRequestById(requestId);
      setRequest(updatedRequest);
      if (updatedRequest?.documentId) {
        // First try to get from context
        const doc = contextGetDocumentByRequestId(requestId);
        if (doc) {
          setDocument(doc);
        } else {
          // If not in context, try from localStorage (for mock documents)
          const storedDoc = getDocumentByRequestId(requestId);
          if (storedDoc) {
            setDocument(storedDoc);
          } else {
            setDocument(null);
          }
        }
      } else {
        setDocument(null);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [requestId, contextGetDocumentByRequestId]);
  if (!request) {
    return <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Request not found.</p>
        <button className="mt-4 text-[#FECC0E] hover:text-[#e6b800]" onClick={onBackToList}>
          Back to Request List
        </button>
      </div>;
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleGenerateDocument = () => {
    if (role === 'pp_team') {
      const newDoc = createDocument(requestId, {
        title: request.requestDetail,
        content: `# ${request.requestDetail}\n\n## Purpose\nThis document outlines the policy for ${request.requestDetail.toLowerCase()}.\n\n## Scope\nThis policy applies to all employees, contractors, and third parties who have access to the bank's systems and information.\n\n## Policy\n1. All employees must comply with this policy.\n2. Violations may result in disciplinary action.\n3. This policy is subject to annual review.`
      });
      setDocument(newDoc);
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
    }
  };
  const handlePostComment = () => {
    if (newComment.trim()) {
      if (role === 'approver' && request.documentId) {
        // Add comment as approver
        if (commentType === 'approve') {
          // Approve the document
          approveDocument(request.documentId, 1);
          addApproverComment(requestId, name, `Approved: ${newComment}`, true);
        } else if (commentType === 'reject') {
          // Request changes
          requestRevision(request.documentId, newComment, 1);
          addApproverComment(requestId, name, `Requested changes: ${newComment}`, false);
        } else {
          // Just a comment
          addApproverComment(requestId, name, newComment);
        }
      } else {
        // Regular comment
        console.log('Adding comment:', newComment);
      }
      setNewComment('');
      setCommentType('comment');
      // Refresh the request data
      const updatedRequest = getRequestById(requestId);
      setRequest(updatedRequest);
    }
  };
  // Comments from approvers
  const approverComments = request.approverComments || [];
  return <div>
      <button onClick={onBackToList} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Request List
      </button>
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Request Details - {request.ticketNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {request.requestType}
            </p>
          </div>
          <div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
        </div>
        {/* Quick Actions for P&P Team */}
        {role === 'pp_team' && !document && request.status === 'Pending' && <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex gap-2">
              <button onClick={handleGenerateDocument} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                <FileEdit className="mr-2 h-4 w-4" />
                Generate Document
              </button>
              <a href="https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EdIIVCTn8nRDg3tSEzmd2MoBLjQ81A0yzDXCZKGGqgBa-g?e=5plPMs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <div className="mr-2 h-4 w-4" />
                Use Template
              </a>
            </div>
          </div>}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.fullDescription || request.requestDetail}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Requester</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.requester || 'Anonymous User'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.department || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Date Created
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.dateCreated}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                SLA Target Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.slaTargetDate}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.assignedTo || 'Not assigned'}
              </dd>
            </div>
            {document && <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Generated Document
                </dt>
                <dd className="mt-1 text-sm">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{document.title}</h3>
                      <div className="flex space-x-2">
                        <a href="https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/ERQyAc0e_RdFmotNyopxxI0BOV5Wq3HCrZ6lwsEIgU9Nrw?e=WwJYum" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                          <ExternalLink size={16} className="mr-1" />
                          View Document
                        </a>
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap">
                        {document.content.substring(0, 300)}...
                      </pre>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
                      <span>
                        Version: {document.version} | Last updated:{' '}
                        {new Date(document.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {document.status}
                      </span>
                    </div>
                  </div>
                </dd>
              </div>}
            {request.approvalStatus && <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Approval Status
                </dt>
                <dd className="mt-1 text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${request.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : request.approvalStatus === 'Changes Requested' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                    {request.approvalStatus}
                  </span>
                </dd>
              </div>}
          </dl>
        </div>
      </div>
      {/* Approval Timeline (for completed requests) */}
      {request.status === 'Completed' && document && document.approvers && <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">
              Approval Timeline
            </h4>
            <div className="mt-4">
              <div className="relative">
                {/* Progress Bar */}
                <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                  <div style={{
                width: '100%'
              }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
                {/* Approval Steps */}
                <div className="flex justify-between mb-2">
                  {document.approvers.map((approver: any, index: number) => <div key={index} className="text-center">
                      <div className="w-8 h-8 mx-auto rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="mt-2 text-xs">
                        <div className="font-medium text-gray-900">
                          {approver.name}
                        </div>
                        <div className="text-gray-500">
                          Level {approver.level}
                        </div>
                        <div className="text-gray-500">
                          {new Date(approver.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>)}
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="mt-2 text-xs">
                      <div className="font-medium text-gray-900">Published</div>
                      <div className="text-gray-500">
                        {new Date(document.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* Comments Section */}
      {(approverComments.length > 0 || role === 'approver') && <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Comments</h4>
            <div className="mt-4 space-y-6">
              {approverComments.map((comment, index) => <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.approver}
                      </p>
                      <p className="text-sm text-gray-500">{comment.date}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {comment.comment}
                    </p>
                  </div>
                </div>)}
              {/* Add comment section for approvers */}
              {role === 'approver' && request.documentId && request.status !== 'Completed' && <div className="mt-6">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden focus-within:border-[#FECC0E] focus-within:ring-1 focus-within:ring-[#FECC0E]">
                          <textarea rows={3} name="comment" id="comment" className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
                          <div className="py-2 px-3 bg-gray-50 flex justify-between">
                            <div>
                              <button onClick={() => setCommentType('comment')} className={`inline-flex items-center px-3 py-1 mr-2 border text-sm font-medium rounded-md ${commentType === 'comment' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Comment
                              </button>
                              <button onClick={() => setCommentType('approve')} className={`inline-flex items-center px-3 py-1 mr-2 border text-sm font-medium rounded-md ${commentType === 'approve' ? 'bg-green-100 border-green-300 text-green-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button onClick={() => setCommentType('reject')} className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-md ${commentType === 'reject' ? 'bg-red-100 border-red-300 text-red-900' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Request Changes
                              </button>
                            </div>
                            <button onClick={handlePostComment} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
            </div>
          </div>
        </div>}
    </div>;
};
export default RequestDetails;