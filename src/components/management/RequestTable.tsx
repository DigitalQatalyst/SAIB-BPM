import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { useUser } from '../../context/UserContext';
interface RequestTableProps {
  onRequestSelect: (id: number) => void;
}
const RequestTable: React.FC<RequestTableProps> = ({
  onRequestSelect
}) => {
  const {
    name
  } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'my-requests' | 'all-requests'>('my-requests');
  // Mock data - in a real app this would come from an API
  const requests = [{
    id: 1,
    ticketNumber: 'REQ-2023-042',
    dateCreated: '2023-09-15',
    requestType: 'Policy',
    requestDetail: 'Update Information Security Policy',
    requester: 'Ahmed Al-Mansour',
    department: 'IT Security',
    slaTargetDate: '2023-09-25',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Khalid Al-Otaibi'
  }, {
    id: 2,
    ticketNumber: 'REQ-2023-038',
    dateCreated: '2023-09-10',
    requestType: 'Policy',
    requestDetail: 'Revise Corporate Governance Policy',
    requester: 'Fatima Al-Harbi',
    department: 'Legal',
    slaTargetDate: '2023-09-28',
    priority: 'Medium',
    status: 'In Review (Level 1)',
    assignedTo: 'Khalid Al-Otaibi'
  }, {
    id: 3,
    ticketNumber: 'REQ-2023-045',
    dateCreated: '2023-09-18',
    requestType: 'Procedure',
    requestDetail: 'New Anti-Money Laundering Procedure',
    requester: 'Mohammed Al-Qahtani',
    department: 'Compliance',
    slaTargetDate: '2023-09-30',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: null
  }, {
    id: 4,
    ticketNumber: 'REQ-2023-036',
    dateCreated: '2023-09-08',
    requestType: 'Procedure',
    requestDetail: 'Update HR Onboarding Procedure',
    requester: 'Noura Al-Zahrani',
    department: 'HR',
    slaTargetDate: '2023-09-22',
    priority: 'Low',
    status: 'In Review (Level 2)',
    assignedTo: 'Omar Al-Sulaiman'
  }, {
    id: 5,
    ticketNumber: 'REQ-2023-032',
    dateCreated: '2023-09-05',
    requestType: 'Policy',
    requestDetail: 'Cancel Outdated Mobile Device Policy',
    requester: 'Khalid Al-Otaibi',
    department: 'IT',
    slaTargetDate: '2023-09-19',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Khalid Al-Otaibi'
  }, {
    id: 6,
    ticketNumber: 'REQ-2023-048',
    dateCreated: '2023-09-22',
    requestType: 'Policy',
    requestDetail: 'Update Remote Work Policy',
    requester: 'Layla Al-Shamsi',
    department: 'HR',
    slaTargetDate: '2023-10-06',
    priority: 'Medium',
    status: 'In Review (Level 3)',
    assignedTo: 'Khalid Al-Otaibi'
  }, {
    id: 7,
    ticketNumber: 'REQ-2023-050',
    dateCreated: '2023-09-24',
    requestType: 'Procedure',
    requestDetail: 'Credit Card Application Process Update',
    requester: 'Tariq Al-Farsi',
    department: 'Retail Banking',
    slaTargetDate: '2023-10-08',
    priority: 'High',
    status: 'Needs Revision',
    assignedTo: 'Khalid Al-Otaibi'
  }];
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  // First filter by view mode (my requests vs all requests)
  const viewFilteredRequests = viewMode === 'my-requests' ? requests.filter(request => request.assignedTo === 'Khalid Al-Otaibi') : requests;
  // Then apply other filters
  const filteredRequests = viewFilteredRequests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestDetail.toLowerCase().includes(searchQuery.toLowerCase()) || request.requester.toLowerCase().includes(searchQuery.toLowerCase()) || request.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || request.priority === priorityFilter;
    const matchesType = typeFilter === 'All' || request.requestType === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });
  // Sort the filtered requests
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
  return <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-lg mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" placeholder="Search requests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          {/* View Mode Toggle */}
          <div className="mb-4 md:mb-0 md:ml-4">
            <div className="bg-gray-100 p-1 rounded-md inline-flex">
              <button className={`px-3 py-1.5 text-sm font-medium rounded ${viewMode === 'my-requests' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => setViewMode('my-requests')}>
                My Requests
              </button>
              <button className={`px-3 py-1.5 text-sm font-medium rounded ${viewMode === 'all-requests' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`} onClick={() => setViewMode('all-requests')}>
                All Requests
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review (Level 1)">In Review (Level 1)</option>
                <option value="In Review (Level 2)">In Review (Level 2)</option>
                <option value="In Review (Level 3)">In Review (Level 3)</option>
                <option value="Needs Revision">Needs Revision</option>
                <option value="Approved for Publication">
                  Approved for Publication
                </option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
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
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Policy">Policy</option>
                <option value="Procedure">Procedure</option>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('requestType')}>
                  <div className="flex items-center">
                    Type
                    {sortField === 'requestType' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('requester')}>
                  <div className="flex items-center">
                    Requester
                    {sortField === 'requester' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('slaTargetDate')}>
                  <div className="flex items-center">
                    SLA Target
                    {sortField === 'slaTargetDate' && (sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
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
                      {request.requestType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{request.requester}</div>
                        <div className="text-xs text-gray-400">
                          {request.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.slaTargetDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.assignedTo || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500" onClick={e => {
                  e.stopPropagation();
                  // Show dropdown menu
                }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                    {viewMode === 'my-requests' ? 'No requests have been assigned to you.' : 'No requests match your current filters.'}
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default RequestTable;