import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText, ArrowRight, CalendarClock, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
interface ApproverDashboardProps {
  onRequestSelect: (id: number) => void;
  setActiveView: (view: 'dashboard' | 'requests') => void;
}
const ApproverDashboard: React.FC<ApproverDashboardProps> = ({
  onRequestSelect,
  setActiveView
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  // Mock data for pending approvals with approaching deadlines
  const pendingApprovals = [{
    id: 1004,
    ticketNumber: 'REQ-2024-004',
    title: 'Credit Card Issuance Policy',
    requester: 'Sara Al-Malik',
    department: 'Cards Department',
    priority: 'Medium',
    dueDate: '2024-03-23',
    daysLeft: 2
  }, {
    id: 1003,
    ticketNumber: 'REQ-2024-003',
    title: 'Customer Complaint Handling Form',
    requester: 'Mohammed Al-Ghamdi',
    department: 'Customer Service',
    priority: 'Low',
    dueDate: '2024-03-25',
    daysLeft: 4
  }, {
    id: 1005,
    ticketNumber: 'REQ-2024-005',
    title: 'Business Continuity Plan Update',
    requester: 'Ahmed Al-Rashid',
    department: 'Risk Management',
    priority: 'High',
    dueDate: '2024-03-20',
    daysLeft: 0
  }];
  // Sort by days left ascending (most urgent first)
  pendingApprovals.sort((a, b) => a.daysLeft - b.daysLeft);
  // Get priority badge based on priority level
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Medium
          </span>;
      case 'Low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low
          </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {priority}
          </span>;
    }
  };
  // Get deadline urgency indicator
  const getDeadlineIndicator = (daysLeft: number) => {
    if (daysLeft <= 0) {
      return <span className="text-red-600 font-medium">Due today</span>;
    } else if (daysLeft <= 2) {
      return <span className="text-red-600 font-medium">
          Due in {daysLeft} day{daysLeft > 1 ? 's' : ''}
        </span>;
    } else if (daysLeft <= 5) {
      return <span className="text-orange-600">Due in {daysLeft} days</span>;
    } else {
      return <span className="text-gray-600">Due in {daysLeft} days</span>;
    }
  };
  // Chart data
  const pieData = [{
    name: 'Approved',
    value: 65,
    color: '#10B981'
  }, {
    name: 'Rejected',
    value: 15,
    color: '#EF4444'
  }, {
    name: 'Changes Requested',
    value: 20,
    color: '#F59E0B'
  }];
  const COLORS = ['#10B981', '#EF4444', '#F59E0B'];
  // Custom tooltip for pie chart
  const CustomPieTooltip = ({
    active,
    payload
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>;
    }
    return null;
  };
  return <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Approvals
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      5
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved This Month
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      12
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Changes Requested
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      3
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <CalendarClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approaching Deadline
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      3
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Approvals */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Approaching Deadlines
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Documents requiring your urgent review and approval
            </p>
          </div>
          <button onClick={() => setActiveView('requests')} className="flex items-center text-[#FECC0E] hover:text-[#e6b800] text-sm font-medium">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {pendingApprovals.map(approval => <li key={approval.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => onRequestSelect(approval.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">
                        {approval.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {approval.ticketNumber} • {approval.requester} •{' '}
                        {approval.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {getDeadlineIndicator(approval.daysLeft)}
                    </div>
                    <div>{getPriorityBadge(approval.priority)}</div>
                  </div>
                </div>
              </li>)}
          </ul>
        </div>
      </div>
      {/* Approval Activity and Metrics */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Approval Activity
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your recent approval activities
            </p>
            <div className="mt-4 space-y-4">
              <div className="relative pb-4">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      You approved{' '}
                      <span className="font-medium text-gray-900">
                        Corporate Credit Card Policy
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
              <div className="relative pb-4">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center bg-red-100">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      You requested changes to{' '}
                      <span className="font-medium text-gray-900">
                        Branch Operations Procedure
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">4 days ago</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      You approved{' '}
                      <span className="font-medium text-gray-900">
                        Customer Due Diligence Form
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Simplified Approval Metrics Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Approval Metrics
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Distribution of your approval activities
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)} className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="quarter">Quarterly</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            {/* Distribution Chart - Slightly Reduced Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Approval Distribution
                </h4>
                <div className="flex space-x-2">
                  <button onClick={() => setChartType('pie')} className={`px-2 py-1 text-xs rounded-md ${chartType === 'pie' ? 'bg-[#FECC0E] text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Pie
                  </button>
                  <button onClick={() => setChartType('bar')} className={`px-2 py-1 text-xs rounded-md ${chartType === 'bar' ? 'bg-[#FECC0E] text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Bar
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-56">
                  {chartType === 'pie' ? <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={70} fill="#8884d8" dataKey="value" label={({
                      name,
                      percent
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer> : <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{
                    name: 'Distribution',
                    ...Object.fromEntries(pieData.map(item => [item.name.toLowerCase().replace(' ', '_'), item.value]))
                  }]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="approved" fill="#10B981" name="Approved" />
                        <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                        <Bar dataKey="changes_requested" fill="#F59E0B" name="Changes Requested" />
                      </BarChart>
                    </ResponsiveContainer>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ApproverDashboard;