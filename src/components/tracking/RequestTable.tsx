import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getRequestsByRole, RequestItem } from '../../services/requestTracking';
import { useUser } from '../../context/UserContext';
interface RequestTableProps {
  onRequestSelect: (id: number) => void;
}
const RequestTable: React.FC<RequestTableProps> = ({
  onRequestSelect
}) => {
  const {
    role,
    name
  } = useUser();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof RequestItem>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // Load requests from storage based on user role
  useEffect(() => {
    const loadRequests = () => {
      console.log('Loading requests for role:', role, 'name:', name);
      const filteredRequests = getRequestsByRole(role, name);
      console.log('Filtered requests:', filteredRequests);
      setRequests(filteredRequests);
    };

    // Initial load
    loadRequests();

    // Set up event listener for custom requestsUpdated event
    const handleRequestsUpdate = () => {
      console.log('requestsUpdated event received');
      loadRequests();
    };

    window.addEventListener('requestsUpdated', handleRequestsUpdate);

    return () => {
      window.removeEventListener('requestsUpdated', handleRequestsUpdate);
    };
  }, [role, name]); // Re-run when role or name changes
  const handleSort = (field: keyof RequestItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestType.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestDetail.toLowerCase().includes(searchQuery.toLowerCase()) || request.serviceName && request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || request.requester && request.requester.toLowerCase().includes(searchQuery.toLowerCase());
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
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
              {role !== 'user' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
              </th>}
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
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
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
                {request.serviceName || request.requestType}
              </td>
              {role !== 'user' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.requester || 'Anonymous User'}
              </td>}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.slaTargetDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.priority}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-[#FECC0E] hover:text-[#e6b800]" onClick={e => {
                  e.stopPropagation();
                  onRequestSelect(request.id);
                }}>
                  View
                </button>
              </td>
            </tr>) : <tr>
              <td colSpan={role !== 'user' ? 8 : 7} className="px-6 py-10 text-center text-gray-500">
                {requests.length === 0 ? 'No service requests found. Submit a service request to see it here.' : 'No requests match your current filters.'}
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
};
export default RequestTable;