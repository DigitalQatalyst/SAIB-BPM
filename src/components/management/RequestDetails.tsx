import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, CheckCircle, MessageCircle, FileText, AlertCircle, FileBarChart, Edit, UserPlus, MessageSquare, ThumbsUp, FilePenLine, ExternalLink, Zap } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
interface RequestDetailsProps {
  requestId: number;
  onBackToList: () => void;
}
const RequestDetails: React.FC<RequestDetailsProps> = ({
  requestId,
  onBackToList
}) => {
  const navigate = useNavigate();
  const {
    getDocumentByRequestId,
    publishDocument
  } = useDocument();
  const [activeTab, setActiveTab] = useState('details');
  // Check if there's already a document for this request
  const existingDocument = getDocumentByRequestId(requestId);
  // Mock data - in a real app this would come from an API
  const request = {
    id: requestId,
    ticketNumber: 'REQ-2023-042',
    dateCreated: '2023-09-15',
    requestType: 'Policy',
    requestDetail: 'Update Information Security Policy',
    fullDescription: 'Request to update the Information Security Policy to incorporate new SAMA cybersecurity requirements. The update should address multi-factor authentication requirements, cloud security standards, and incident response procedures.',
    department: 'IT Security',
    requester: 'Ahmed Al-Mansour',
    requesterEmail: 'ahmed.almansour@saib.com.sa',
    requesterPhone: '+966 11 123 4567',
    slaTargetDate: '2023-09-25',
    priority: 'High',
    status: existingDocument ? existingDocument.status : 'In Progress',
    assignedTo: 'Khalid Al-Otaibi',
    justification: 'The Saudi Central Bank (SAMA) has issued new cybersecurity framework requirements that must be incorporated into our Information Security Policy by the end of the quarter.',
    sourceOfRequest: 'Regulatory Requirement',
    category: 'Information Security',
    documentType: 'Policy',
    approvers: [{
      name: 'Mohammed Al-Qahtani',
      role: 'CISO',
      status: existingDocument && existingDocument.currentApprovalLevel > 0 ? 'Approved' : 'Pending',
      date: existingDocument && existingDocument.currentApprovalLevel > 0 ? '2023-09-28' : '-'
    }, {
      name: 'Khalid Al-Otaibi',
      role: 'CIO',
      status: existingDocument && existingDocument.currentApprovalLevel > 1 ? 'Approved' : 'Pending',
      date: existingDocument && existingDocument.currentApprovalLevel > 1 ? '2023-09-30' : '-'
    }, {
      name: 'Noura Al-Zahrani',
      role: 'Compliance Head',
      status: existingDocument && existingDocument.currentApprovalLevel > 2 ? 'Approved' : 'Pending',
      date: existingDocument && existingDocument.currentApprovalLevel > 2 ? '2023-10-02' : '-'
    }],
    attachments: [{
      name: 'SAMA Circular 41-54321.pdf',
      type: 'PDF',
      size: '3.5 MB',
      uploadedBy: 'Ahmed Al-Mansour',
      date: '2023-09-15'
    }, {
      name: 'Current Information Security Policy.docx',
      type: 'DOCX',
      size: '2.8 MB',
      uploadedBy: 'System',
      date: '2023-09-15'
    }],
    timeline: [{
      date: '2023-09-15 13:15',
      event: 'Request submitted',
      user: 'Ahmed Al-Mansour',
      icon: FileText
    }, {
      date: '2023-09-15 15:30',
      event: 'Request assigned to Khalid Al-Otaibi',
      user: 'System',
      icon: User
    }, {
      date: '2023-09-16 11:20',
      event: 'Policy review initiated',
      user: 'Khalid Al-Otaibi',
      icon: FileText
    }, ...(existingDocument ? [{
      date: '2023-09-20 14:45',
      event: 'Document generated in AI DocWriter',
      user: 'Khalid Al-Otaibi',
      icon: FilePenLine
    }, ...(existingDocument.currentApprovalLevel > 0 ? [{
      date: '2023-09-28 10:30',
      event: 'Document approved by Level 1 Approver',
      user: 'Mohammed Al-Qahtani',
      icon: CheckCircle
    }] : []), ...(existingDocument.currentApprovalLevel > 1 ? [{
      date: '2023-09-30 15:20',
      event: 'Document approved by Level 2 Approver',
      user: 'Khalid Al-Otaibi',
      icon: CheckCircle
    }] : []), ...(existingDocument.currentApprovalLevel > 2 ? [{
      date: '2023-10-02 11:10',
      event: 'Document approved by Level 3 Approver',
      user: 'Noura Al-Zahrani',
      icon: CheckCircle
    }] : []), ...(existingDocument.status === 'Published' ? [{
      date: '2023-10-03 09:45',
      event: 'Document published to Policy & Procedure Marketplace',
      user: 'Khalid Al-Otaibi',
      icon: Zap
    }] : [])] : [])],
    comments: [{
      date: '2023-09-15 14:40',
      user: 'Khalid Al-Otaibi',
      text: "I've reviewed the SAMA circular. I'll begin updating the policy and will need input from the IT Security team regarding the technical implementation details of the new requirements."
    }, {
      date: '2023-09-16 09:30',
      user: 'Ahmed Al-Mansour',
      text: 'Please ensure that the updated policy addresses the incident response timeline requirements in section 4.3 of the circular. This is a critical component of the new requirements.'
    }, ...(existingDocument && existingDocument.status === 'Needs Revision' ? [{
      date: '2023-09-29 11:20',
      user: 'Mohammed Al-Qahtani',
      text: 'The document needs more detail on the multi-factor authentication implementation requirements. Please revise section 3.2 to include specific guidance for different user roles.'
    }] : [])]
  };
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
      case 'In Review (Level 1)':
        return 'bg-purple-100 text-purple-800';
      case 'In Review (Level 2)':
        return 'bg-purple-100 text-purple-800';
      case 'In Review (Level 3)':
        return 'bg-purple-100 text-purple-800';
      case 'Approved for Publication':
        return 'bg-green-100 text-green-800';
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Needs Revision':
        return 'bg-orange-100 text-orange-800';
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
    // Navigate to the document writer with the request ID
    navigate(`/docwriter/${requestId}`);
  };
  const handlePublishDocument = () => {
    if (existingDocument) {
      publishDocument(existingDocument.id);
      // In a real app, we would update the request status as well
    }
  };
  // Check if all approvers have approved
  const allApproversApproved = existingDocument && existingDocument.currentApprovalLevel >= 3;
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
              {request.requestType} - {request.requestDetail}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Request Details
            </button>
            <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Documents & Attachments
            </button>
            <button onClick={() => setActiveTab('timeline')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeline' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Timeline & Comments
            </button>
          </nav>
        </div>
        {/* Tab content */}
        <div>
          {activeTab === 'details' && <div className="px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.fullDescription}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Requester
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="font-medium">{request.requester}</div>
                    <div className="text-gray-500">
                      {request.requesterEmail}
                    </div>
                    <div className="text-gray-500">
                      {request.requesterPhone}
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Department
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.department}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Date Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.dateCreated}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    SLA Target Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.slaTargetDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Priority
                  </dt>
                  <dd className="mt-1 text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Assigned To
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.assignedTo || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Source of Request
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.sourceOfRequest}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.category}
                  </dd>
                </div>
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Justification
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.justification}
                  </dd>
                </div>
                {/* Document Generation Button - Prominently displayed */}
                {(request.status === 'In Progress' || request.status === 'Needs Revision') && <div className="sm:col-span-3 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      Document Generation
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Use the AI DocWriter to{' '}
                      {existingDocument ? 'edit the existing document' : 'generate a new document'}{' '}
                      based on this request's information.
                    </p>
                    <button onClick={handleGenerateDocument} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <FilePenLine className="mr-2 h-5 w-5" />
                      {existingDocument ? 'Edit Document in AI DocWriter' : 'Generate Document in AI DocWriter'}
                    </button>
                  </div>}
              </dl>
              {/* Approval Status */}
              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Approval Status
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Approver
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {request.approvers.map((approver, index) => <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {approver.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {approver.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(approver.status)}`}>
                              {approver.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {approver.date}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Publish Document Button - only enabled when all approvers have approved */}
              {existingDocument && <div className="mt-8 flex justify-end">
                  <button onClick={handlePublishDocument} disabled={!allApproversApproved} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${allApproversApproved ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2`}>
                    <Zap className="mr-2 h-5 w-5" />
                    Publish Document
                  </button>
                </div>}
            </div>}
          {activeTab === 'documents' && <div className="px-4 py-5 sm:px-6">
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Attachments
                </h4>
                <ul className="divide-y divide-gray-200">
                  {request.attachments.map((attachment, index) => <li key={index} className="py-4 flex justify-between items-center">
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
                      <div className="flex space-x-3">
                        <button className="text-sm font-medium text-[#FECC0E] hover:text-[#e6b800]">
                          Download
                        </button>
                      </div>
                    </li>)}
                </ul>
              </div>
              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Generated Documents
                </h4>
                {existingDocument ? <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {request.requestDetail} - v{existingDocument.version}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Generated on{' '}
                          {new Date(existingDocument.createdAt).toLocaleDateString()}{' '}
                          by {existingDocument.createdBy}
                        </p>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(existingDocument.status)}`}>
                        {existingDocument.status}
                      </span>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FilePenLine className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Document in{' '}
                            {existingDocument.status === 'Published' ? 'Policy & Procedure Marketplace' : 'AI DocWriter'}
                          </span>
                        </div>
                        {existingDocument.status === 'Published' ? <a href="#" className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                            <ExternalLink size={16} className="mr-1" />
                            View in Marketplace
                          </a> : <button onClick={handleGenerateDocument} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
                            <Edit size={16} className="mr-1" />
                            Edit in DocWriter
                          </button>}
                      </div>
                      {/* Document Preview */}
                      <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-2">Document Preview:</p>
                          <p className="mb-2">
                            {existingDocument.content.substring(0, 200)}...
                          </p>
                          <button onClick={handleGenerateDocument} className="text-indigo-600 hover:text-indigo-500 font-medium">
                            View Full Document
                          </button>
                        </div>
                      </div>
                      {/* Approval Status */}
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">
                          Document Approval Status
                        </h5>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="relative">
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                <div style={{
                            width: `${existingDocument.currentApprovalLevel / 3 * 100}%`
                          }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${existingDocument.status === 'Needs Revision' ? 'bg-orange-500' : existingDocument.status === 'Published' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                              </div>
                              <div className="mt-2 flex justify-between text-xs text-gray-600">
                                <div className={existingDocument.currentApprovalLevel >= 1 ? 'font-medium text-blue-600' : ''}>
                                  Level 1
                                </div>
                                <div className={existingDocument.currentApprovalLevel >= 2 ? 'font-medium text-blue-600' : ''}>
                                  Level 2
                                </div>
                                <div className={existingDocument.currentApprovalLevel >= 3 ? 'font-medium text-blue-600' : ''}>
                                  Level 3
                                </div>
                                <div className={existingDocument.status === 'Published' ? 'font-medium text-green-600' : ''}>
                                  Published
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Document Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        {existingDocument.status === 'Needs Revision' && <button onClick={handleGenerateDocument} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Edit className="mr-2 h-5 w-5" />
                            Revise Document
                          </button>}
                        {/* Publish Document Button - only enabled when all approvers have approved */}
                        {allApproversApproved && <button onClick={handlePublishDocument} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <Zap className="mr-2 h-5 w-5" />
                            Publish Document
                          </button>}
                      </div>
                    </div>
                  </div> : <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <FilePenLine className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No documents generated yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate a document using the AI DocWriter.
                    </p>
                    <div className="mt-6">
                      <button type="button" onClick={handleGenerateDocument} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FilePenLine className="-ml-1 mr-2 h-5 w-5" />
                        Generate Document
                      </button>
                    </div>
                  </div>}
              </div>
            </div>}
          {activeTab === 'timeline' && <div className="px-4 py-5 sm:px-6">
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Timeline
                </h4>
                <div className="flow-root">
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
              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Comments
                </h4>
                <div className="space-y-6">
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
                          <p className="text-sm text-gray-500">
                            {comment.date}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {comment.text}
                        </p>
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
                            <button className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90">
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default RequestDetails;