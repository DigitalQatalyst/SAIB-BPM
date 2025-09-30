import React, { useState } from 'react';
import Dashboard from '../components/tracking/Dashboard';
import RequestTable from '../components/tracking/RequestTable';
import RequestDetails from '../components/tracking/RequestDetails';
import Sidebar from '../components/shared/Sidebar';
import { useLanguage } from '../context/LanguageContext';
const TrackRequests = () => {
  const {
    t
  } = useLanguage();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const handleRequestSelect = (id: number) => {
    setSelectedRequestId(id);
  };
  const handleBackToList = () => {
    setSelectedRequestId(null);
  };
  return <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {t('trackRequestsTitle')}
          </h1>
          <p className="mt-2 text-lg text-gray-500">{t('trackRequestsDesc')}</p>
        </div>
        {!selectedRequestId ? <>
            <Dashboard />
            <div className="mt-8">
              <RequestTable onRequestSelect={handleRequestSelect} />
            </div>
          </> : <RequestDetails requestId={selectedRequestId} onBackToList={handleBackToList} />}
      </div>
    </div>;
};
export default TrackRequests;