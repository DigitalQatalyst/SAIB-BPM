import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, BarChart2, CalendarClock, Users, FileCheck, ChevronRight, Activity, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
const PPDashboard = () => {
  // In a real app, these would come from an API or context
  const stats = {
    totalRequests: 48,
    pendingRequests: 12,
    inProgressRequests: 18,
    approvedRequests: 10,
    rejectedRequests: 8,
    slaCompliance: 92,
    avgTimeToCompletion: 5.3,
    requestsByCategory: [{
      category: 'Policy Creation',
      count: 18
    }, {
      category: 'Policy Revision',
      count: 15
    }, {
      category: 'Procedure Update',
      count: 10
    }, {
      category: 'Policy Cancellation',
      count: 5
    }],
    recentActivity: [{
      id: 'REQ-2023-042',
      title: 'Information Security Policy Update',
      status: 'In Progress',
      date: 'Today, 10:30 AM'
    }, {
      id: 'REQ-2023-038',
      title: 'Corporate Governance Policy Revision',
      status: 'In Review',
      date: 'Yesterday, 2:15 PM'
    }, {
      id: 'REQ-2023-036',
      title: 'Anti-Money Laundering Procedure',
      status: 'Approved',
      date: '2 days ago'
    }, {
      id: 'REQ-2023-034',
      title: 'Customer Data Protection Policy',
      status: 'Completed',
      date: '3 days ago'
    }],
    monthlyTrends: [{
      month: 'Jan',
      requests: 32
    }, {
      month: 'Feb',
      requests: 40
    }, {
      month: 'Mar',
      requests: 35
    }, {
      month: 'Apr',
      requests: 42
    }, {
      month: 'May',
      requests: 38
    }, {
      month: 'Jun',
      requests: 48
    }],
    upcomingDeadlines: [{
      id: 'REQ-2023-045',
      title: 'Regulatory Compliance Update',
      dueDate: 'Tomorrow',
      priority: 'High'
    }, {
      id: 'REQ-2023-047',
      title: 'Employee Handbook Revision',
      dueDate: 'In 2 days',
      priority: 'Medium'
    }, {
      id: 'REQ-2023-049',
      title: 'Data Privacy Policy Update',
      dueDate: 'In 5 days',
      priority: 'Medium'
    }]
  };
  return <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Welcome back, Sarah
            </h2>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your P&P requests today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Last updated:</span>
              <span className="text-sm font-medium text-gray-900">
                Today, 10:45 AM
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalRequests}
          </h3>
          <p className="text-gray-600 mt-1">Total Requests</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full" style={{
            width: '100%'
          }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.inProgressRequests}
          </h3>
          <p className="text-gray-600 mt-1">In Progress</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-yellow-600 h-1 rounded-full" style={{
            width: `${stats.inProgressRequests / stats.totalRequests * 100}%`
          }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.approvedRequests}
          </h3>
          <p className="text-gray-600 mt-1">Approved</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-green-600 h-1 rounded-full" style={{
            width: `${stats.approvedRequests / stats.totalRequests * 100}%`
          }}></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600 flex items-center">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              3%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.rejectedRequests}
          </h3>
          <p className="text-gray-600 mt-1">Rejected</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-red-600 h-1 rounded-full" style={{
            width: `${stats.rejectedRequests / stats.totalRequests * 100}%`
          }}></div>
          </div>
        </div>
      </div>
      {/* Middle Row: Performance & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              SLA Performance
            </h3>
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              On Target
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="stroke-current text-gray-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-current text-[#FECC0E]" strokeWidth="3" strokeDasharray={`${stats.slaCompliance}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="18.5" className="fill-current text-gray-800 font-bold" textAnchor="middle" fontSize="8">
                  {stats.slaCompliance}%
                </text>
                <text x="18" y="23" className="fill-current text-gray-500" textAnchor="middle" fontSize="2.5">
                  SLA COMPLIANCE
                </text>
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between text-center">
            <div>
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-lg font-bold text-gray-900">95%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Time</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.avgTimeToCompletion} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Improvement</p>
              <p className="text-lg font-bold text-green-600">+2.4%</p>
            </div>
          </div>
        </div>
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Request Trends
            </h3>
            <div className="text-sm text-gray-500">Last 6 months</div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {stats.monthlyTrends.map((item, index) => <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-[#FECC0E] rounded-t-sm" style={{
              height: `${item.requests / 50 * 100}%`,
              opacity: index === stats.monthlyTrends.length - 1 ? 1 : 0.7 - 0.1 * (stats.monthlyTrends.length - 1 - index)
            }}></div>
                <div className="text-xs text-gray-500 mt-2">{item.month}</div>
              </div>)}
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-green-600">+20%</span> increase
              from January to June
            </span>
          </div>
        </div>
      </div>
      {/* Bottom Row: Activity & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <button className="text-[#9E800D] hover:text-[#FECC0E] text-sm font-medium flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentActivity.map((activity, index) => <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${activity.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : activity.status === 'In Review' ? 'bg-purple-100 text-purple-800' : activity.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.date}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Deadlines
              </h3>
              <button className="text-[#9E800D] hover:text-[#FECC0E] text-sm font-medium flex items-center">
                View calendar <Calendar className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.upcomingDeadlines.map((deadline, index) => <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${deadline.priority === 'High' ? 'bg-red-500' : deadline.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {deadline.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${deadline.dueDate.includes('Tomorrow') ? 'text-red-600' : deadline.dueDate.includes('2 days') ? 'text-yellow-600' : 'text-gray-600'}`}>
                          {deadline.dueDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {deadline.priority} Priority
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Requests by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Requests by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {stats.requestsByCategory.map((category, index) => <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {category.category}
                </span>
                <span className="text-sm text-gray-600">
                  {category.count} requests
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#FECC0E] h-2.5 rounded-full" style={{
              width: `${category.count / stats.totalRequests * 100}%`
            }}></div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default PPDashboard;