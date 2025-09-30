import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Calendar } from 'lucide-react';
import { getDashboardStats } from '../../services/requestTracking';
import { useLanguage } from '../../context/LanguageContext';
const Dashboard = () => {
  const {
    t
  } = useLanguage();
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    avgDaysToClose: 0
  });
  useEffect(() => {
    const loadStats = () => {
      const currentStats = getDashboardStats();
      setStats(currentStats);
    };
    loadStats();
    // Update stats when localStorage changes
    window.addEventListener('storage', loadStats);
    return () => {
      window.removeEventListener('storage', loadStats);
    };
  }, []);
  return <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {t('dashboardOverview')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('totalRequests')}</p>
            <p className="text-2xl font-semibold">{stats.totalRequests}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="bg-yellow-100 rounded-full p-3 mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('activeRequests')}</p>
            <p className="text-2xl font-semibold">{stats.activeRequests}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('completedRequests')}</p>
            <p className="text-2xl font-semibold">{stats.completedRequests}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="bg-purple-100 rounded-full p-3 mr-4">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('avgDaysToClose')}</p>
            <p className="text-2xl font-semibold">{stats.avgDaysToClose}</p>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;