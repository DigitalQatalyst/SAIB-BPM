import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Calendar, Filter, Users, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface RequestData {
  ticketID: string;
  requestType: string;
  dateCreated: string;
  resolvedDate?: string;
  serviceCategory: string;
  serviceType: string;
  communicationSLA: number;
  responseSLA: number;
  resolutionSLA: number;
  deliverySLA: number;
  slaCompliance: number;
  customerSatisfaction: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  slaStatus: 'On Time' | 'Overdue';
  assignedTo: string;
  department: string;
  overdueFlag: boolean;
}
// Generate comprehensive mock data with at least 12 requests per day
const generateMockData = (): RequestData[] => {
  const data: RequestData[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date();
  const serviceTypes = [{
    category: 'Policy',
    types: ['Cancel Policy Service', 'Update Policy Service', 'Policy Full Revision', 'Develop New Policy']
  }, {
    category: 'Procedure',
    types: ['Cancel Manual', 'Update Manual', 'Develop New Manual', 'Revise Manual']
  }, {
    category: 'Form',
    types: ['Develop New Form', 'Revise Form', 'Cancel Form', 'Update Form']
  }];
  const priorities: ('Critical' | 'High' | 'Medium' | 'Low')[] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: ('Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed')[] = ['Open', 'Pending', 'In Progress', 'Resolved', 'Closed'];
  const assignees = ['Michael Chen', 'Sarah Johnson', 'Amanda Thompson', 'James Rodriguez', 'Lisa Wang', 'David Kim', 'Emma Wilson', 'Carlos Martinez'];
  const departments = ['Support', 'Development', 'Documentation', 'Quality Assurance'];
  let ticketCounter = 1;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const requestsPerDay = Math.floor(Math.random() * 8) + 12; // 12-19 requests per day
    for (let i = 0; i < requestsPerDay; i++) {
      const serviceCategory = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
      const serviceType = serviceCategory.types[Math.floor(Math.random() * serviceCategory.types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const assignedTo = assignees[Math.floor(Math.random() * assignees.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const createdDate = new Date(d);
      const shouldHaveResolvedDate = ['Resolved', 'Closed'].includes(status) || Math.random() > 0.3;
      let resolvedDate: string | undefined;
      if (shouldHaveResolvedDate && createdDate < new Date()) {
        const daysToResolve = Math.floor(Math.random() * 15) + 1; // 1-15 days
        const resolved = new Date(createdDate);
        resolved.setDate(resolved.getDate() + daysToResolve);
        if (resolved <= endDate) {
          resolvedDate = resolved.toISOString().split('T')[0];
        }
      }
      const slaCompliance = Math.floor(Math.random() * 40) + 60; // 60-100%
      const customerSatisfaction = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0-5.0
      const overdueFlag = Math.random() > 0.8; // 20% chance of being overdue
      data.push({
        ticketID: `REQ-${createdDate.getFullYear()}-${String(ticketCounter).padStart(4, '0')}`,
        requestType: serviceType,
        dateCreated: createdDate.toISOString().split('T')[0],
        resolvedDate,
        serviceCategory: serviceCategory.category,
        serviceType,
        communicationSLA: Math.floor(Math.random() * 5) + 1,
        responseSLA: Math.floor(Math.random() * 4) + 1,
        resolutionSLA: Math.floor(Math.random() * 10) + 1,
        deliverySLA: Math.floor(Math.random() * 5) + 1,
        slaCompliance,
        customerSatisfaction,
        priority,
        status,
        slaStatus: overdueFlag ? 'Overdue' : 'On Time',
        assignedTo,
        department,
        overdueFlag
      });
      ticketCounter++;
    }
  }
  return data;
};
const mockData = generateMockData();
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
export function Dashboard({
  'data-id': dataId
}: {
  'data-id'?: string;
}) {
  const [selectedView, setSelectedView] = useState<'executive' | 'management'>('executive');
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Format date range display
  const formatDateRange = () => {
    const startFormatted = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const endFormatted = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${startFormatted} - ${endFormatted}`;
  };
  // Handle date range selection
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (start && end) {
      setShowDatePicker(false);
    }
  };
  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      // Category filter
      if (categoryFilter !== 'All' && item.serviceCategory !== categoryFilter) return false;
      // Date range filter
      const itemDate = new Date(item.dateCreated);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [categoryFilter, startDate, endDate]);
  const metrics = useMemo(() => {
    const totalOpen = filteredData.filter(item => ['Open', 'Pending', 'In Progress'].includes(item.status)).length;
    const avgResolutionTime = filteredData.reduce((acc, item) => acc + (item.resolutionSLA || 0), 0) / filteredData.length;
    const avgSLACompliance = filteredData.reduce((acc, item) => acc + item.slaCompliance, 0) / filteredData.length;
    const avgCustomerSatisfaction = filteredData.reduce((acc, item) => acc + item.customerSatisfaction, 0) / filteredData.length;
    const today = new Date().toISOString().split('T')[0];
    const newToday = filteredData.filter(item => item.dateCreated === today).length;
    const resolvedToday = filteredData.filter(item => item.resolvedDate === today).length;
    const overdue = filteredData.filter(item => item.overdueFlag).length;
    const firstResponseTime = 3.67;
    return {
      totalOpen,
      avgResolutionTime,
      avgSLACompliance,
      avgCustomerSatisfaction,
      newToday,
      resolvedToday,
      overdue,
      firstResponseTime
    };
  }, [filteredData]);
  const requestTypeData = useMemo(() => {
    const types = filteredData.reduce((acc, item) => {
      acc[item.serviceType] = (acc[item.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    // Filter out empty categories
    return Object.entries(types).filter(([name, value]) => value > 0).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredData]);
  const priorityData = useMemo(() => {
    const priorities = filteredData.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    // Filter out empty categories
    return Object.entries(priorities).filter(([name, value]) => value > 0).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredData]);
  const teamWorkloadData = useMemo(() => {
    const workload = filteredData.reduce((acc, item) => {
      acc[item.assignedTo] = (acc[item.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(workload).filter(([name, value]) => value > 0) // Filter out empty categories
    .sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value]) => ({
      name: name.split(' ')[0],
      value
    }));
  }, [filteredData]);
  const volumeTrendsData = useMemo(() => {
    const monthlyData = filteredData.reduce((acc, item) => {
      const date = new Date(item.dateCreated);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(monthlyData).filter(([month, requests]) => requests > 0) // Filter out empty months
    .sort(([a], [b]) => a.localeCompare(b)).map(([month, requests]) => ({
      month: month,
      requests
    }));
  }, [filteredData]);
  const resolutionPerformanceData = useMemo(() => {
    const resolved = filteredData.filter(item => item.resolvedDate);
    const oneTwodays = resolved.filter(item => {
      const created = new Date(item.dateCreated);
      const resolvedDate = new Date(item.resolvedDate!);
      const diffDays = Math.ceil((resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 1 && diffDays <= 2;
    }).length;
    const threeFiveDays = resolved.filter(item => {
      const created = new Date(item.dateCreated);
      const resolvedDate = new Date(item.resolvedDate!);
      const diffDays = Math.ceil((resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 3 && diffDays <= 5;
    }).length;
    const sixNineDays = resolved.filter(item => {
      const created = new Date(item.dateCreated);
      const resolvedDate = new Date(item.resolvedDate!);
      const diffDays = Math.ceil((resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 6 && diffDays <= 9;
    }).length;
    const tenPlusDays = resolved.filter(item => {
      const created = new Date(item.dateCreated);
      const resolvedDate = new Date(item.resolvedDate!);
      const diffDays = Math.ceil((resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 10;
    }).length;
    // Filter out empty categories
    return [{
      range: '1-2 days',
      count: oneTwodays
    }, {
      range: '3-5 days',
      count: threeFiveDays
    }, {
      range: '6-9 days',
      count: sixNineDays
    }, {
      range: '10+ days',
      count: tenPlusDays
    }].filter(item => item.count > 0);
  }, [filteredData]);
  const statusBreakdownData = useMemo(() => {
    const statusCounts = filteredData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    // Filter out empty categories
    return Object.entries(statusCounts).filter(([status, count]) => count > 0).map(([status, count]) => ({
      status,
      count
    }));
  }, [filteredData]);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed':
        return 'text-green-600 bg-green-50';
      case 'Resolved':
        return 'text-blue-600 bg-blue-50';
      case 'In Progress':
        return 'text-purple-600 bg-purple-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Open':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={500}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>;
  };
  // Custom label component for bar charts - positioned inside bars
  const renderBarLabel = (props: any) => {
    const {
      x,
      y,
      width,
      height,
      value
    } = props;
    return <text x={x + width / 2} y={y + height / 2} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={600}>
        {value}
      </text>;
  };
  return <div className="min-h-screen bg-gray-50 w-full" data-id={dataId}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-black rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SAIB Request Support Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Real-time insights into service request performance and team
                productivity
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 space-y-4">
            {/* Date Range Filters */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="w-full border-2 border-teal-500 rounded-md px-3 py-2 text-sm bg-white cursor-pointer hover:bg-gray-50" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                    <span className="text-gray-700">{formatDateRange()}</span>
                  </div>
                </div>
                {showDatePicker && <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <DatePicker selected={startDate} onChange={handleDateRangeChange} startDate={startDate} endDate={endDate} selectsRange inline minDate={new Date('2023-01-01')} maxDate={new Date()} className="border-0" />
                    <div className="p-3 border-t border-gray-200 flex justify-between">
                      <button onClick={() => setShowDatePicker(false)} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                        Cancel
                      </button>
                      <button onClick={() => setShowDatePicker(false)} className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600">
                        Apply
                      </button>
                    </div>
                  </div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setStartDate(lastWeek);
                  setEndDate(today);
                }} className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    Last 7 days
                  </button>
                  <button onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  setStartDate(lastMonth);
                  setEndDate(today);
                }} className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    Last 30 days
                  </button>
                  <button onClick={() => {
                  const today = new Date();
                  const lastQuarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                  setStartDate(lastQuarter);
                  setEndDate(today);
                }} className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    Last 90 days
                  </button>
                  <button onClick={() => {
                  const today = new Date();
                  const lastYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                  setStartDate(lastYear);
                  setEndDate(today);
                }} className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                    Last year
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option value="All">All</option>
                  <option value="Policy">Policy</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Form">Form</option>
                </select>
              </div>
            </div>
            {/* Navigation */}
            <div className="pt-6 space-y-1">
              <button onClick={() => setSelectedView('executive')} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedView === 'executive' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Executive Summary
              </button>
              <button onClick={() => setSelectedView('management')} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedView === 'management' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Request Management
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedView === 'executive' ? <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total Open Requests
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.totalOpen}
                      </p>
                      <p className="text-xs text-green-600">Active Requests</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Average Resolution Time
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.avgResolutionTime.toFixed(1)}
                      </p>
                      <p className="text-xs text-green-600">Days</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">SLA Compliance</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.avgSLACompliance.toFixed(1)}%
                      </p>
                      <p className="text-xs text-green-600">Average</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Customer Satisfaction
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.avgCustomerSatisfaction.toFixed(1)}
                      </p>
                      <p className="text-xs text-green-600">Out of 5.0</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Charts Row 1 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Request Volume Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={volumeTrendsData}>
                      <XAxis dataKey="month" />
                      <YAxis label={{
                    value: 'Number of Requests',
                    angle: -90,
                    position: 'insideLeft',
                    textAnchor: 'middle',
                    style: {
                      fontSize: '12px',
                      fill: '#6B7280',
                      textAnchor: 'middle'
                    }
                  }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} dot={{
                    r: 3,
                    strokeWidth: 0
                  }} activeDot={{
                    r: 4,
                    strokeWidth: 0
                  }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resolution Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={resolutionPerformanceData} margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 5
                }}>
                      <XAxis dataKey="range" />
                      <YAxis tick={false} axisLine={false} label={{
                    value: 'Request Count',
                    angle: -90,
                    position: 'insideLeft',
                    textAnchor: 'middle',
                    style: {
                      fontSize: '12px',
                      fill: '#6B7280',
                      textAnchor: 'middle'
                    }
                  }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#fbbf24" radius={0}>
                        <LabelList content={renderBarLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Charts Row 2 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Request Types
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={requestTypeData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value" cornerRadius={0}>
                        {requestTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Team Workload Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={teamWorkloadData} margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 25
                }}>
                      <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} interval={0} />
                      <YAxis tick={false} axisLine={false} label={{
                    value: 'Request Count',
                    angle: -90,
                    position: 'insideLeft',
                    textAnchor: 'middle',
                    style: {
                      fontSize: '12px',
                      fill: '#6B7280',
                      textAnchor: 'middle'
                    }
                  }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#374151" radius={0}>
                        <LabelList content={renderBarLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div> : <div className="space-y-6">
              {/* Management View Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        New Requests Today
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.newToday}
                      </p>
                      <p className="text-xs text-green-600">Today's Intake</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Resolved Today</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.resolvedToday}
                      </p>
                      <p className="text-xs text-green-600">Today's Closures</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Overdue Requests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.overdue}
                      </p>
                      <p className="text-xs text-red-600">Requires Attention</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        First Response Time
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.firstResponseTime}
                      </p>
                      <p className="text-xs text-green-600">Hours Average</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Priority Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Priority Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={0}>
                        {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {priorityData.map((entry, index) => <div key={entry.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 mr-2" style={{
                      backgroundColor: COLORS[index % COLORS.length]
                    }}></div>
                          <span>{entry.name}</span>
                        </div>
                        <span className="font-medium">{entry.value}</span>
                      </div>)}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Status Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={statusBreakdownData} margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 5
                }}>
                      <XAxis dataKey="status" />
                      <YAxis tick={false} axisLine={false} label={{
                    value: 'Request Count',
                    angle: -90,
                    position: 'insideLeft',
                    textAnchor: 'middle',
                    style: {
                      fontSize: '12px',
                      fill: '#6B7280',
                      textAnchor: 'middle'
                    }
                  }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#fbbf24" radius={0}>
                        <LabelList content={renderBarLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Recent High Priority Requests Table */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="bg-yellow-100 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent High Priority Requests
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SLA Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.filter(item => ['High', 'Critical'].includes(item.priority)).sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()).slice(0, 15).map(request => <tr key={request.ticketID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {request.ticketID}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(request.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.requestType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.assignedTo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.slaStatus === 'On Time' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {request.slaStatus}
                              </span>
                            </td>
                          </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}