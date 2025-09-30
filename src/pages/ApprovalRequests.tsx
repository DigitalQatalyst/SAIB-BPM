import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import ApprovalRequestTable from '../components/approval/ApprovalRequestTable';
import ApprovalDetails from '../components/approval/ApprovalDetails';
import ApproverDashboard from '../components/approval/ApproverDashboard';
const ApprovalRequests = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'requests'>('dashboard');
  const {
    role
  } = useUser();
  // Redirect if user doesn't have the right role
  if (role !== 'approver') {
    return <Navigate to="/track-requests" replace />;
  }
  const handleRequestSelect = (id: number) => {
    setSelectedRequestId(id);
  };
  const handleBackToList = () => {
    setSelectedRequestId(null);
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 bg-gray-50 z-10 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Manage Approvals
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Review and approve document requests in your queue
          </p>
          {!selectedRequestId && <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button onClick={() => setActiveView('dashboard')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeView === 'dashboard' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Dashboard
                </button>
                <button onClick={() => setActiveView('requests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeView === 'requests' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  All Requests
                </button>
              </nav>
            </div>}
        </div>
        {!selectedRequestId ? <>
            {activeView === 'dashboard' ? <ApproverDashboard onRequestSelect={handleRequestSelect} setActiveView={setActiveView} /> : <ApprovalRequestTable onRequestSelect={handleRequestSelect} />}
          </> : <ApprovalDetails requestId={selectedRequestId} onBackToList={handleBackToList} />}
      </div>
    </div>;
};
export default ApprovalRequests;