import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { getDashboardStats } from '../../services/requestTracking';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
const Dashboard = () => {
  const {
    t
  } = useLanguage();
  const {
    role,
    name
  } = useUser();
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    avgDaysToClose: 0
  });
  useEffect(() => {
    const loadStats = () => {
      const dashboardStats = getDashboardStats(role, name);
      setStats(dashboardStats);
    };
    loadStats();
    // Listen for changes to requests
    window.addEventListener('storage', loadStats);
    return () => {
      window.removeEventListener('storage', loadStats);
    };
  }, [role, name]);
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {t('totalRequests')}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalRequests}
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
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {t('activeRequests')}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.activeRequests}
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
                  {t('completedRequests')}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.completedRequests}
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
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {t('avgDaysToClose')}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.avgDaysToClose}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;