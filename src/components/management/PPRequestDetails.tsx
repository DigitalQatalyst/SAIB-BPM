import React, { useState } from 'react';
import { ArrowLeft, Clock, User, CheckCircle, MessageCircle, FileText, AlertCircle, FileEdit, UserPlus, XCircle, Zap } from 'lucide-react';
import { getRequestById, updateRequest, RequestItem } from '../../services/requestTracking';
interface PPRequestDetailsProps {
  requestId: number;
  onBackToList: () => void;
}
const PPRequestDetails: React.FC<PPRequestDetailsProps> = ({
  requestId,
  onBackToList
}) => {
  const [request, setRequest] = useState<RequestItem | undefined>(getRequestById(requestId));
  const [newComment, setNewComment] = useState('');
  const [statusUpdate, setStatusUpdate] = useState(request?.status || '');
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
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusUpdate(e.target.value);
  };
  const handleUpdateStatus = () => {
    if (statusUpdate !== request.status) {
      try {
        const updatedRequest = updateRequest(requestId, {
          status: statusUpdate as RequestItem['status'],
          latestNote: `Status updated to ${statusUpdate}`
        });
        if (updatedRequest) {
          setRequest(updatedRequest);
        }
        // Dispatch storage event to update other components
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error updating request status:', error);
      }
    }
  };
  const handlePostComment = () => {
    if (newComment.trim()) {
      // In a real app, this would call your API to add a comment
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };
  const handleQuickAction = (action: string) => {
    // In a real app, this would call your API
    console.log(`Performing action: ${action} on request ${requestId}`);
    let newStatus = request.status;
    let actionNote = '';
    switch (action) {
      case 'assign':
        newStatus = 'In Progress';
        actionNote = 'Request assigned to team member';
        break;
      case 'approve':
        newStatus = 'Approved';
        actionNote = 'Request approved by P&P team';
        break;
      case 'reject':
        newStatus = 'Rejected';
        actionNote = 'Request rejected by P&P team';
        break;
      case 'generate':
        actionNote = 'Document generation initiated';
        break;
      case 'publish':
        newStatus = 'Completed';
        actionNote = 'Document published and request completed';
        break;
      default:
        return;
    }
    try {
      const updatedRequest = updateRequest(requestId, {
        status: newStatus,
        latestNote: actionNote
      });
      if (updatedRequest) {
        setRequest(updatedRequest);
        setStatusUpdate(newStatus);
      }
      // Dispatch storage event to update other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };
  // Mock data for approval workflow and comments
  const approvers = [{
    name: 'Mohammed Al-Qahtani',
    role: 'Department Head',
    status: 'Approved',
    date: '2023-09-16'
  }, {
    name: 'Khalid Al-Otaibi',
    role: 'Compliance Officer',
    status: 'Pending',
    date: '-'
  }, {
    name: 'Fatima Al-Harbi',
    role: 'Legal Reviewer',
    status: 'Pending',
    date: '-'
  }];
  const comments = [{
    date: '2023-09-15 14:20',
    user: 'Fatima Al-Harbi',
    text: "I've reviewed your request and will process it. Could you please confirm the exact transaction types that should be included in the delegation?"
  }, {
    date: '2023-09-16 08:30',
    user: request.requester || 'Anonymous User',
    text: 'Thank you. The delegation should cover FX transactions, money market placements, and interbank transfers, all up to the SAR 500,000 limit.'
  }];
  const timeline = [{
    date: '2023-09-15 09:30',
    event: 'Request submitted',
    user: request.requester || 'Anonymous User',
    icon: FileText
  }, {
    date: '2023-09-15 11:45',
    event: 'Request assigned to Fatima Al-Harbi',
    user: 'System',
    icon: User
  }, {
    date: '2023-09-16 10:15',
    event: 'Approved by Department Head',
    user: 'Mohammed Al-Qahtani',
    icon: CheckCircle
  }];
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
        {/* Quick Actions */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {request.status === 'Pending' && <>
                <button onClick={() => handleQuickAction('assign')} className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <UserPlus size={14} className="mr-1" />
                  Assign Request
                </button>
                <button onClick={() => handleQuickAction('approve')} className="inline-flex items-center px-3 py-1.5 border border-green-600 text-xs font-medium rounded text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <CheckCircle size={14} className="mr-1" />
                  Approve Request
                </button>
                <button onClick={() => handleQuickAction('reject')} className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <XCircle size={14} className="mr-1" />
                  Reject Request
                </button>
              </>}
            {(request.status === 'In Progress' || request.status === 'Approved') && <button onClick={() => handleQuickAction('generate')} className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-xs font-medium rounded text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <FileEdit size={14} className="mr-1" />
                Generate Document
              </button>}
            {request.status === 'Approved' && <button onClick={() => handleQuickAction('publish')} className="inline-flex items-center px-3 py-1.5 border border-[#FECC0E] text-xs font-medium rounded text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                <Zap size={14} className="mr-1" />
                Publish Document
              </button>}
          </div>
        </div>
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
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Status Update
              </dt>
              <dd className="mt-1 flex items-center">
                <select value={statusUpdate} onChange={handleStatusChange} className="mr-3 block w-full max-w-xs pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button onClick={handleUpdateStatus} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                  Update Status
                </button>
              </dd>
            </div>
          </dl>
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
                    {approvers.map((approver, index) => <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {approver.name}
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
              {timeline.map((event, index) => <li key={index}>
                  <div className="relative pb-8">
                    {index !== timeline.length - 1 ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span> : null}
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
      {/* Comments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900">Comments</h4>
          <div className="mt-4 space-y-6">
            {comments.map((comment, index) => <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user}
                    </p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{comment.text}</p>
                </div>
              </div>)}
            <div className="mt-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden focus-within:border-[#FECC0E] focus-within:ring-1 focus-within:ring-[#FECC0E]">
                    <textarea rows={3} name="comment" id="comment" className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
                    <div className="py-2 px-3 bg-gray-50 flex justify-end">
                      <button onClick={handlePostComment} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PPRequestDetails;