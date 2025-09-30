import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Clock, Save } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
const Notifications = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    requestUpdates: true,
    statusChanges: true,
    comments: true,
    approvals: true,
    weeklyDigest: false,
    marketplaceUpdates: true,
    regulationAlerts: true,
    dailySummary: false
  });
  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings]
    });
  };
  const handleSave = () => {
    // In a real application, this would send the settings to a server
    console.log('Saved notification settings:', settings);
    alert('Your notification preferences have been saved.');
  };
  return <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Customize how and when you receive notifications about your service
            requests.
          </p>
        </div>
        {/* Notification Channels */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Notification Channels
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-[#FECC0E]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleToggle('emailNotifications')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.emailNotifications ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-4">
                    <Smartphone className="h-5 w-5 text-[#FECC0E]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications on your device
                    </p>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleToggle('pushNotifications')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.pushNotifications ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Notification Types */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Notification Types
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Request Updates
                  </h3>
                  <p className="text-sm text-gray-500">
                    General updates about your service requests
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('requestUpdates')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.requestUpdates ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.requestUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Status Changes
                  </h3>
                  <p className="text-sm text-gray-500">
                    When your request status changes
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('statusChanges')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.statusChanges ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.statusChanges ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Comments
                  </h3>
                  <p className="text-sm text-gray-500">
                    When someone comments on your request
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('comments')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.comments ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.comments ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Approvals
                  </h3>
                  <p className="text-sm text-gray-500">
                    When your request is approved or rejected
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('approvals')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.approvals ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.approvals ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Frequency & Digests */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Frequency & Digests
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-[#FECC0E]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Weekly Digest
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of all activities
                    </p>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleToggle('weeklyDigest')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.weeklyDigest ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.weeklyDigest ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Daily Summary
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive a daily summary of all activities
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('dailySummary')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.dailySummary ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.dailySummary ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Additional Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Marketplace Updates
                  </h3>
                  <p className="text-sm text-gray-500">
                    New services and features in the marketplace
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('marketplaceUpdates')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.marketplaceUpdates ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.marketplaceUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Regulation Alerts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Updates about new or changed regulations
                  </p>
                </div>
                <div>
                  <button onClick={() => handleToggle('regulationAlerts')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.regulationAlerts ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.regulationAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <button onClick={handleSave} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            Save Preferences
            <Save className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};
export default Notifications;