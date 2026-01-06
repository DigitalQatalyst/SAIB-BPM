import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, CheckCircle, MessageCircle, FileText, AlertCircle, FileEdit, UserPlus, XCircle, Zap, ExternalLink, Check, Download } from 'lucide-react';
import { generateFormattedWordDocument } from '../../utils/wordGenerator';
import { getProcessModelImage } from '../../utils/processModelUtils';
import { useDocument } from '../../context/DocumentContext';
import { getRequestById } from '../../services/requestTracking';
interface ApprovalDetailsProps {
  requestId: number;
  onBackToList: () => void;
}
const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
  requestId,
  onBackToList
}) => {
  const navigate = useNavigate();
  const { getDocumentByRequestId, getDocumentById } = useDocument();
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  // Fetch request data from localStorage
  const [request, setRequest] = useState(getRequestById(requestId));

  // Listen for storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setRequest(getRequestById(requestId));
    };

    window.addEventListener('requestsUpdated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('requestsUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [requestId]);

  if (!request) {
    return <div className="text-center py-12">
      <p className="text-gray-500 text-lg">Request not found.</p>
      <button className="mt-4 text-[#FECC0E] hover:text-[#e6b800]" onClick={onBackToList}>
        Back to Request List
      </button>
    </div>;
  }

  // Mock data for approvers - in real implementation, this would come from request or document
  const currentUser = 'Ahmed Al-Rashid';
  const initialApprovers = [{
    name: 'Mohammed Al-Qahtani',
    role: 'CISO',
    status: 'Approved',
    date: '2024-03-20'
  }, {
    name: 'Khalid Al-Otaibi',
    role: 'CIO',
    status: 'Approved',
    date: '2024-03-22'
  }, {
    name: 'Ahmed Al-Rashid',
    role: 'Risk Management Head',
    status: request.status === 'Approved' || request.status === 'Completed' ? 'Approved' : 'Pending',
    date: request.status === 'Approved' || request.status === 'Completed' ? new Date().toISOString().split('T')[0] : '-'
  }, {
    name: 'Noura Al-Zahrani',
    role: 'Compliance Head',
    status: 'Pending',
    date: '-'
  }];
  const [approvers, setApprovers] = useState(initialApprovers);

  // Get the actual document for this request - try both methods
  const [requestDocument, setRequestDocument] = useState<any>(null);

  useEffect(() => {
    // First try using documentId if it exists
    let doc = request.documentId ? getDocumentById(request.documentId) : null;

    // Fallback: try getting by requestId
    if (!doc) {
      doc = getDocumentByRequestId(requestId);
    }

    setRequestDocument(doc);
  }, [request, request.documentId, requestId, getDocumentById, getDocumentByRequestId]);

  // Download document with process model
  const handleDownloadDocument = async () => {
    try {
      if (!requestDocument) {
        alert('Document not found for this request');
        return;
      }

      // Get process model image if it exists
      const processImage = getProcessModelImage(requestDocument.id) || undefined;

      // Generate Word document with process model
      await generateFormattedWordDocument(
        requestDocument.content,
        requestDocument.title || request.requestDetail,
        'english', // Default language
        processImage
      );
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
      case 'Changes Requested':
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
  const handleApprove = () => {
    // Update the status of the current user (Ahmed Al-Rashid) to Approved
    const today = new Date().toISOString().split('T')[0];
    const updatedApprovers = approvers.map(approver => approver.name === currentUser ? {
      ...approver,
      status: 'Approved',
      date: today
    } : approver);
    setApprovers(updatedApprovers);
    // Add to timeline if supported
    if ((request as any).timeline) {
      (request as any).timeline.push({
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', ''),
        event: `Approved by ${currentUser}`,
        user: currentUser,
        icon: CheckCircle
      });
    }
    // Update request status (simplified, no setStatus call needed)
    setShowApproveConfirm(false);
    // In a real app, this would make an API call to update the request status
  };
  const handleReject = () => {
    // Update the status of the current user (Ahmed Al-Rashid) to Rejected
    const today = new Date().toISOString().split('T')[0];
    const updatedApprovers = approvers.map(approver => approver.name === currentUser ? {
      ...approver,
      status: 'Rejected',
      date: today
    } : approver);
    setApprovers(updatedApprovers);
    // Add to timeline if supported
    if ((request as any).timeline) {
      (request as any).timeline.push({
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', ''),
        event: `Rejected by ${currentUser}`,
        user: currentUser,
        icon: XCircle
      });
    }
    // Update request status (simplified, no setStatus call needed)
    setShowRejectConfirm(false);
    // In a real app, this would make an API call to update the request status
  };
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
            {request.requestType} - {request.requestDetail}
          </p>
        </div>
        <div>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {approvers.find(a => a.name === currentUser && a.status === 'Pending') && <>
            <button onClick={() => setShowApproveConfirm(true)} className="inline-flex items-center px-3 py-1.5 border border-green-600 text-xs font-medium rounded text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <CheckCircle size={14} className="mr-1" />
              Approve
            </button>
            <button onClick={() => setShowRejectConfirm(true)} className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <XCircle size={14} className="mr-1" />
              Reject
            </button>
          </>}
          <a
            href={requestDocument ? `/docwriter/${request.id}` : '#'}
            onClick={(e) => {
              if (!requestDocument) {
                e.preventDefault();
                alert('No document has been generated for this request yet');
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText size={14} className="mr-1" />
            View Document
          </a>
          <button
            onClick={handleDownloadDocument}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Download size={14} className="mr-1" />
            Download as Word
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {request.fullDescription}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Requester</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="font-medium">{request.requester}</div>
              <div className="text-gray-500">{request.requesterEmail}</div>
              {(request as any).requesterPhone && <div className="text-gray-500">{(request as any).requesterPhone}</div>}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Department</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {request.department}
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
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Source of Request
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {(request as any).sourceOfRequest || 'Not specified'}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.serviceCategory || 'Not specified'}</dd>
          </div>
        </dl>
      </div>
    </div>
    {/* Document Section */}
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900">Document</h4>
        <p className="mt-1 text-sm text-gray-500">
          Review the document and provide your approval
        </p>
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">
                {request.requestDetail} Document
              </span>
            </div>
            <a
              href={requestDocument ? `/docwriter/${request.id}` : '#'}
              onClick={(e) => {
                if (!requestDocument) {
                  e.preventDefault();
                  alert('No document has been generated for this request yet');
                }
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              <ExternalLink size={16} className="mr-1" />
              Open Document
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Click the link above to open the document in Microsoft Word.
          </p>
        </div>
      </div>
    </div>
    {/* Approval Status */}
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900">
          Approval Workflow
        </h4>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Approver
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvers.map((approver, index) => <tr key={index} className={approver.name === currentUser ? 'bg-yellow-50' : ''}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {approver.name}
                      {approver.name === currentUser && <span className="ml-2 text-xs text-gray-500">
                        (You)
                      </span>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {approver.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(approver.status)}`}>
                        {approver.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {approver.date}
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Timeline */}
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900">Timeline</h4>
        <div className="flow-root mt-4">
          <ul className="-mb-8">
            {(request as any).timeline?.map((event: any, index: number) => <li key={index}>
              <div className="relative pb-8">
                {index !== ((request as any).timeline?.length || 0) - 1 ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span> : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100">
                      <event.icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {event.event}{' '}
                        <span className="font-medium text-gray-900">
                          {event.user}
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {event.date}
                    </div>
                  </div>
                </div>
              </div>
            </li>)}
          </ul>
        </div>
      </div>
    </div>
    {/* Approve Confirmation Modal */}
    {showApproveConfirm && <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowApproveConfirm(false)}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Approve Document
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to approve this document? This
                  action will move the document to the next stage in the
                  approval process.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleApprove}>
              Approve
            </button>
            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowApproveConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>}
    {/* Reject Confirmation Modal */}
    {showRejectConfirm && <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowRejectConfirm(false)}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Reject Document
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to reject this document? This action
                  will return the document to the author for revision.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleReject}>
              Reject
            </button>
            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowRejectConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>}
  </div>;
};
export default ApprovalDetails;