import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
interface ApprovalRequest {
  id: number;
  title: string;
  requestor: string;
  department: string;
  type: string;
  status: string;
  priority: string;
  submittedDate: string;
  dueDate: string;
  description: string;
  documentLink: string;
  comments: string[];
  ticketNumber?: string;
  dateCreated?: string;
  serviceName?: string;
  requester?: string;
}
interface ApprovalRequestTableProps {
  onRequestSelect: (id: number) => void;
}
const ApprovalRequestTable: React.FC<ApprovalRequestTableProps> = ({
  onRequestSelect
}) => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof ApprovalRequest>('submittedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // Load mock requests
  useEffect(() => {
    // Mock data for approval requests
    const approvalRequests = [{
      id: 1001,
      ticketNumber: 'REQ-2024-001',
      title: 'Information Security Policy Update',
      requestor: 'Khalid Al-Otaibi',
      requester: 'Khalid Al-Otaibi',
      department: 'Policies & Procedures',
      type: 'Policy',
      status: 'Pending Approval',
      priority: 'High',
      submittedDate: '2024-03-15',
      dateCreated: '2024-03-15',
      dueDate: '2024-03-30',
      serviceName: 'Policy Update',
      description: 'Updated Information Security Policy to incorporate new SAMA Cybersecurity Framework requirements.',
      documentLink: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EQRkD8B_QwpIqiQ0e3hvclwBW9g_Pe_Ho4niPxIkpUEE9A?e=mRIcqf',
      comments: []
    }, {
      id: 1002,
      ticketNumber: 'REQ-2024-002',
      title: 'Anti-Money Laundering Procedure',
      requestor: 'Fatima Al-Zahrani',
      requester: 'Fatima Al-Zahrani',
      department: 'Compliance',
      type: 'Procedure',
      status: 'Pending Approval',
      priority: 'Medium',
      submittedDate: '2024-03-12',
      dateCreated: '2024-03-12',
      dueDate: '2024-03-27',
      serviceName: 'Procedure Update',
      description: 'Updated AML procedure to reflect recent regulatory changes and enhance customer due diligence process.',
      documentLink: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EQRkD8B_QwpIqiQ0e3hvclwBW9g_Pe_Ho4niPxIkpUEE9A?e=mRIcqf',
      comments: []
    }, {
      id: 1003,
      ticketNumber: 'REQ-2024-003',
      title: 'Customer Complaint Handling Form',
      requestor: 'Mohammed Al-Ghamdi',
      requester: 'Mohammed Al-Ghamdi',
      department: 'Customer Service',
      type: 'Form',
      status: 'Pending Approval',
      priority: 'Low',
      submittedDate: '2024-03-10',
      dateCreated: '2024-03-10',
      dueDate: '2024-03-25',
      serviceName: 'Form Creation',
      description: 'New customer complaint handling form designed to improve documentation and tracking of customer issues.',
      documentLink: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EQRkD8B_QwpIqiQ0e3hvclwBW9g_Pe_Ho4niPxIkpUEE9A?e=mRIcqf',
      comments: []
    }, {
      id: 1004,
      ticketNumber: 'REQ-2024-004',
      title: 'Credit Card Issuance Policy',
      requestor: 'Sara Al-Malik',
      requester: 'Sara Al-Malik',
      department: 'Cards Department',
      type: 'Policy',
      status: 'Pending Approval',
      priority: 'Medium',
      submittedDate: '2024-03-08',
      dateCreated: '2024-03-08',
      dueDate: '2024-03-23',
      serviceName: 'Policy Update',
      description: 'Updated credit card issuance policy to incorporate new risk assessment criteria and approval workflows.',
      documentLink: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EQRkD8B_QwpIqiQ0e3hvclwBW9g_Pe_Ho4niPxIkpUEE9A?e=mRIcqf',
      comments: []
    }, {
      id: 1005,
      ticketNumber: 'REQ-2024-005',
      title: 'Business Continuity Plan Update',
      requestor: 'Ahmed Al-Rashid',
      requester: 'Ahmed Al-Rashid',
      department: 'Risk Management',
      type: 'Procedure',
      status: 'Pending Approval',
      priority: 'High',
      submittedDate: '2024-03-05',
      dateCreated: '2024-03-05',
      dueDate: '2024-03-20',
      serviceName: 'Procedure Update',
      description: 'Updated business continuity plan to address pandemic scenarios and remote work arrangements.',
      documentLink: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/EQRkD8B_QwpIqiQ0e3hvclwBW9g_Pe_Ho4niPxIkpUEE9A?e=mRIcqf',
      comments: []
    }];
    setRequests(approvalRequests);
  }, []);
  const handleSort = (field: keyof ApprovalRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || request.title.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestor.toLowerCase().includes(searchQuery.toLowerCase()) || request.serviceName && request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Changes Requested':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-lg mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" placeholder="Search requests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Changes Requested">Changes Requested</option>
              </select>
            </div>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ticketNumber')}>
                  <div className="flex items-center">
                    Ticket Number
                    {sortField === 'ticketNumber' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dateCreated')}>
                  <div className="flex items-center">
                    Date Created
                    {sortField === 'dateCreated' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('serviceName')}>
                  <div className="flex items-center">
                    Service
                    {sortField === 'serviceName' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('requester')}>
                  <div className="flex items-center">
                    Requester
                    {sortField === 'requester' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('priority')}>
                  <div className="flex items-center">
                    Priority
                    {sortField === 'priority' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.length > 0 ? sortedRequests.map(request => <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRequestSelect(request.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.ticketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.dateCreated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.serviceName || request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.requester || request.requestor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                      <button className="text-[#FECC0E] hover:text-[#e6b800] inline-flex items-center" onClick={e => {
                  e.stopPropagation();
                  onRequestSelect(request.id);
                }}>
                        <FileText className="h-4 w-4 mr-1" />
                        View Document
                      </button>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    {requests.length === 0 ? 'No approval requests found.' : 'No requests match your current filters.'}
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default ApprovalRequestTable;