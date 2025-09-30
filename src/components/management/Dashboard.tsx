import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle, Calendar, TrendingUp, PieChart, XCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
interface DashboardProps {
  onRequestSelect: (id: number) => void;
  setActiveView: (view: 'dashboard' | 'requests') => void;
}
const Dashboard: React.FC<DashboardProps> = ({
  onRequestSelect,
  setActiveView
}) => {
  const navigate = useNavigate();
  // In a real app, these stats would come from an API
  const stats = {
    pending: 12,
    inProgress: 18,
    approved: 45,
    rejected: 5,
    total: 80,
    slaCompliance: 92,
    avgTimeToComplete: 3.5,
    requestsByType: {
      policy: 38,
      procedure: 42
    },
    requestsByCategory: {
      regulatory: 35,
      internal: 25,
      strategic: 20
    }
  };
  // Mock data for requests approaching deadline
  const upcomingRequests = [{
    id: 1,
    ticketNumber: 'REQ-2023-042',
    serviceName: 'Update Information Security Policy',
    deadline: 'Tomorrow',
    priority: 'High',
    status: 'In Progress'
  }, {
    id: 2,
    ticketNumber: 'REQ-2023-038',
    serviceName: 'Revise Corporate Governance Policy',
    deadline: '3 days',
    priority: 'Medium',
    status: 'In Review'
  }, {
    id: 3,
    ticketNumber: 'REQ-2023-045',
    serviceName: 'New Anti-Money Laundering Procedure',
    deadline: '5 days',
    priority: 'Medium',
    status: 'Pending'
  }];
  const handleRequestClick = (requestId: number) => {
    onRequestSelect(requestId);
  };
  const handleViewAllRequests = () => {
    setActiveView('requests');
  };
  return <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Request Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">{stats.inProgress}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-semibold">{stats.approved}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>
      {/* SLA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            SLA Compliance
          </h3>
          <div className="flex items-center justify-between">
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path className="stroke-current text-gray-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-current text-green-500" strokeWidth="3" strokeDasharray={`${stats.slaCompliance}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="fill-current text-gray-800 font-medium" textAnchor="middle" fontSize="7">
                  {stats.slaCompliance}%
                </text>
              </svg>
            </div>
            <div className="flex-1 pl-6">
              <p className="text-sm text-gray-500">
                {stats.slaCompliance}% of requests are completed within SLA
                targets
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Avg. Completion Time
          </h3>
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {stats.avgTimeToComplete} days
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Average time to complete requests
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Requests by Type
          </h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats.requestsByType.policy}
              </p>
              <p className="text-sm text-gray-500 mt-1">Policy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {stats.requestsByType.procedure}
              </p>
              <p className="text-sm text-gray-500 mt-1">Procedure</p>
            </div>
          </div>
        </div>
      </div>
      {/* Requests Approaching Deadline */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Requests Approaching Deadline
          </h2>
          <button className="text-sm text-[#9E800D] hover:text-[#FECC0E]" onClick={handleViewAllRequests}>
            View All Requests
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingRequests.map(request => <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRequestClick(request.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.ticketNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                    {request.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.priority === 'High' ? 'bg-red-100 text-red-800' : request.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : request.status === 'In Review' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default Dashboard;