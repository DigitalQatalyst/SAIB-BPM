import React from 'react';
import { ArrowLeft, Clock, User, CheckCircle, MessageCircle, FileText, AlertCircle } from 'lucide-react';
import Button from '../shared/Button';
interface RequestDetailsProps {
  requestId: number;
  onBackToList: () => void;
}
const requests = [{
  id: 1,
  ticketNumber: 'REQ-2023-001',
  dateCreated: '2023-09-15',
  requestType: 'Delegation Request',
  requestDetail: 'Temporary delegation of signing authority to Deputy Manager',
  fullDescription: 'Request for temporary delegation of signing authority to the Deputy Manager of Treasury Department during my absence from September 20 to October 5, 2023. The delegation should include authority to approve transactions up to SAR 500,000.',
  department: 'Treasury',
  requester: 'Ahmed Al-Mansour',
  requesterEmail: 'ahmed.almansour@saib.com.sa',
  slaTargetDate: '2023-09-18',
  priority: 'High',
  status: 'Completed',
  assignedTo: 'Fatima Al-Harbi',
  approvers: [{
    name: 'Mohammed Al-Qahtani',
    role: 'Department Head',
    status: 'Approved',
    date: '2023-09-16'
  }, {
    name: 'Khalid Al-Otaibi',
    role: 'Compliance Officer',
    status: 'Approved',
    date: '2023-09-17'
  }],
  attachments: [{
    name: 'Delegation Form.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadedBy: 'Ahmed Al-Mansour',
    date: '2023-09-15'
  }],
  timeline: [{
    date: '2023-09-15 09:30',
    event: 'Request submitted',
    user: 'Ahmed Al-Mansour',
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
  }, {
    date: '2023-09-17 09:20',
    event: 'Approved by Compliance',
    user: 'Khalid Al-Otaibi',
    icon: CheckCircle
  }, {
    date: '2023-09-17 14:30',
    event: 'Delegation document generated',
    user: 'Fatima Al-Harbi',
    icon: FileText
  }, {
    date: '2023-09-18 08:45',
    event: 'Request completed',
    user: 'Fatima Al-Harbi',
    icon: CheckCircle
  }],
  comments: [{
    date: '2023-09-15 14:20',
    user: 'Fatima Al-Harbi',
    text: "I've reviewed your request and will process it. Could you please confirm the exact transaction types that should be included in the delegation?"
  }, {
    date: '2023-09-16 08:30',
    user: 'Ahmed Al-Mansour',
    text: 'Thank you. The delegation should cover FX transactions, money market placements, and interbank transfers, all up to the SAR 500,000 limit.'
  }, {
    date: '2023-09-17 15:00',
    user: 'Fatima Al-Harbi',
    text: 'The delegation document has been generated and is now available. Please review and let me know if any changes are needed.'
  }]
}, {
  id: 2,
  ticketNumber: 'REQ-2023-002',
  dateCreated: '2023-09-20',
  requestType: 'Policy Update',
  requestDetail: 'Update to Information Security Policy based on new SAMA regulations',
  fullDescription: "Request to update the bank's Information Security Policy to incorporate the new cybersecurity requirements issued by SAMA in Circular No. 41/54321 dated May 12, 2023. The update should address multi-factor authentication requirements, cloud security standards, and incident response procedures.",
  department: 'Information Security',
  requester: 'Noura Al-Zahrani',
  requesterEmail: 'noura.alzahrani@saib.com.sa',
  slaTargetDate: '2023-10-05',
  priority: 'Medium',
  status: 'In Progress',
  assignedTo: 'Omar Al-Sulaiman',
  approvers: [{
    name: 'Pending',
    role: 'CISO',
    status: 'Pending',
    date: '-'
  }, {
    name: 'Pending',
    role: 'CIO',
    status: 'Pending',
    date: '-'
  }, {
    name: 'Pending',
    role: 'Compliance Head',
    status: 'Pending',
    date: '-'
  }],
  attachments: [{
    name: 'SAMA Circular 41-54321.pdf',
    type: 'PDF',
    size: '3.5 MB',
    uploadedBy: 'Noura Al-Zahrani',
    date: '2023-09-20'
  }, {
    name: 'Current Information Security Policy.docx',
    type: 'DOCX',
    size: '2.8 MB',
    uploadedBy: 'System',
    date: '2023-09-20'
  }],
  timeline: [{
    date: '2023-09-20 13:15',
    event: 'Request submitted',
    user: 'Noura Al-Zahrani',
    icon: FileText
  }, {
    date: '2023-09-20 15:30',
    event: 'Request assigned to Omar Al-Sulaiman',
    user: 'System',
    icon: User
  }, {
    date: '2023-09-22 11:20',
    event: 'Policy review initiated',
    user: 'Omar Al-Sulaiman',
    icon: FileText
  }, {
    date: '2023-09-28 16:45',
    event: 'Draft update completed',
    user: 'Omar Al-Sulaiman',
    icon: FileText
  }, {
    date: '2023-09-29 09:30',
    event: 'Draft sent to IT Security for review',
    user: 'Omar Al-Sulaiman',
    icon: Clock
  }],
  comments: [{
    date: '2023-09-21 10:15',
    user: 'Omar Al-Sulaiman',
    text: "I've reviewed the SAMA circular and will begin updating the policy. I'll need input from the IT Security team regarding the technical implementation of the new requirements."
  }, {
    date: '2023-09-25 14:40',
    user: 'Noura Al-Zahrani',
    text: 'Please ensure that the updated policy addresses the incident response timeline requirements in section 4.3 of the circular.'
  }, {
    date: '2023-09-28 16:50',
    user: 'Omar Al-Sulaiman',
    text: "I've completed the draft update. The document has been sent to the IT Security team for technical review before we proceed with the formal approval process."
  }]
}];
const RequestDetails: React.FC<RequestDetailsProps> = ({
  requestId,
  onBackToList
}) => {
  const request = requests.find(req => req.id === requestId);
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
  return <div>
      <button onClick={onBackToList} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Request List
      </button>
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                {request.requester}
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
                {request.assignedTo}
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">
              Approval Status
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
                      {request.approvers.map((approver, index) => <tr key={index}>
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
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Attachments</h4>
            <ul className="mt-4 divide-y divide-gray-200">
              {request.attachments.map((attachment, index) => <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {attachment.type} · {attachment.size} · Uploaded by{' '}
                        {attachment.uploadedBy} on {attachment.date}
                      </p>
                    </div>
                  </div>
                  <button className="ml-4 text-sm font-medium text-[#FECC0E] hover:text-[#e6b800]">
                    Download
                  </button>
                </li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Timeline</h4>
            <div className="flow-root mt-4">
              <ul className="-mb-8">
                {request.timeline.map((event, index) => <li key={index}>
                    <div className="relative pb-8">
                      {index !== request.timeline.length - 1 ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span> : null}
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
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900">Comments</h4>
            <div className="mt-4 space-y-6">
              {request.comments.map((comment, index) => <div key={index} className="flex space-x-3">
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
                      <textarea rows={3} name="comment" id="comment" className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm" placeholder="Add a comment..."></textarea>
                      <div className="py-2 px-3 bg-gray-50 flex justify-end">
                        <Button size="sm">Post Comment</Button>
                      </div>
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
export default RequestDetails;