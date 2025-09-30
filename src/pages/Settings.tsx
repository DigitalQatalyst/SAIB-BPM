import React, { useState } from 'react';
import { Save, Lock, User, Users, Bell, Shield, Eye, Database, Link } from 'lucide-react';
import { useUser } from '../context/UserContext';
const Settings = () => {
  const {
    role
  } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'roles':
        return <RoleSettings />;
      case 'datasource':
        return <DataSourceSettings />;
      default:
        return <ProfileSettings />;
    }
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-lg text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white shadow rounded-lg overflow-hidden">
            <nav className="p-4 space-y-1">
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-[#FECC0E]/10 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <User className="mr-3 h-5 w-5" />
                <span>Profile</span>
              </button>
              <button onClick={() => setActiveTab('security')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'security' ? 'bg-[#FECC0E]/10 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Lock className="mr-3 h-5 w-5" />
                <span>Security</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-[#FECC0E]/10 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Bell className="mr-3 h-5 w-5" />
                <span>Notifications</span>
              </button>
              {role === 'pp_team' && <>
                  <button onClick={() => setActiveTab('roles')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'roles' ? 'bg-[#FECC0E]/10 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Users className="mr-3 h-5 w-5" />
                    <span>Roles & Permissions</span>
                  </button>
                  <button onClick={() => setActiveTab('datasource')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'datasource' ? 'bg-[#FECC0E]/10 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Database className="mr-3 h-5 w-5" />
                    <span>Data Sources</span>
                  </button>
                </>}
            </nav>
          </div>
          {/* Main content */}
          <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>;
};
const ProfileSettings = () => {
  const {
    name,
    email,
    department
  } = useUser();
  return <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Profile Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input type="text" name="name" id="name" defaultValue={name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input type="email" name="email" id="email" defaultValue={email} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input type="text" name="department" id="department" defaultValue={department} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div className="pt-5">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>;
};
const SecuritySettings = () => {
  return <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Security Settings
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input type="password" name="current-password" id="current-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input type="password" name="new-password" id="new-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input type="password" name="confirm-password" id="confirm-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
        </div>
        <div className="pt-5">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            <Save className="mr-2 h-4 w-4" />
            Update Password
          </button>
        </div>
      </div>
    </div>;
};
const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    requestUpdates: true,
    statusChanges: true,
    comments: true,
    approvals: true
  });
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  return <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Notification Settings
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Notification Channels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Email Notifications
                </span>
              </div>
              <button onClick={() => handleToggle('emailNotifications')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.emailNotifications ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Push Notifications
                </span>
              </div>
              <button onClick={() => handleToggle('pushNotifications')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.pushNotifications ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Notification Types
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Request Updates
                </span>
              </div>
              <button onClick={() => handleToggle('requestUpdates')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.requestUpdates ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.requestUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Status Changes
                </span>
              </div>
              <button onClick={() => handleToggle('statusChanges')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.statusChanges ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.statusChanges ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Comments
                </span>
              </div>
              <button onClick={() => handleToggle('comments')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.comments ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.comments ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Approvals
                </span>
              </div>
              <button onClick={() => handleToggle('approvals')} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${settings.approvals ? 'bg-[#FECC0E]' : 'bg-gray-200'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${settings.approvals ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>;
};
const RoleSettings = () => {
  const roles = [{
    id: 1,
    name: 'Admin',
    description: 'Full access to all features and settings',
    users: 2
  }, {
    id: 2,
    name: 'Editor',
    description: 'Can create and edit documents, but cannot publish',
    users: 5
  }, {
    id: 3,
    name: 'Reviewer',
    description: 'Can review and approve documents',
    users: 8
  }, {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to documents',
    users: 15
  }];
  return <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Roles & Permissions
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Available Roles
          </h3>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {roles.map(role => <li key={role.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-400 mr-3" />
                          <p className="font-medium text-gray-900">
                            {role.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">
                            {role.users} users
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">
                            {role.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <button className="text-[#9E800D] hover:text-[#FECC0E] flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View Permissions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>
        </div>
        <div className="pt-5 flex justify-between">
          <button type="button" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            Add New Role
          </button>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>;
};
const DataSourceSettings = () => {
  const [dataSources, setDataSources] = useState([{
    id: 1,
    name: 'Abacus Process Repository',
    type: 'Process Model Repository',
    status: 'Connected',
    lastSync: '2023-10-15'
  }, {
    id: 2,
    name: 'SAMA Regulatory Database',
    type: 'API Connection',
    status: 'Disconnected',
    lastSync: '2023-09-22'
  }, {
    id: 3,
    name: 'Internal Knowledge Base',
    type: 'Document Repository',
    status: 'Connected',
    lastSync: '2023-10-12'
  }]);
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'Process Model Repository',
    url: '',
    apiKey: '',
    username: '',
    password: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewConnection({
      ...newConnection,
      [name]: value
    });
  };
  const handleAddConnection = () => {
    // In a real app, this would validate and send to an API
    const newDataSource = {
      id: dataSources.length + 1,
      name: newConnection.name,
      type: newConnection.type,
      status: 'Connected',
      lastSync: new Date().toISOString().split('T')[0]
    };
    setDataSources([...dataSources, newDataSource]);
    setShowNewConnectionForm(false);
    setNewConnection({
      name: '',
      type: 'Process Model Repository',
      url: '',
      apiKey: '',
      username: '',
      password: ''
    });
  };
  return <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Data Source Connections
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Connect to external repositories and data sources that the AI DocWriter
        can use to generate documents.
      </p>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Connected Data Sources
        </h3>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sync
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataSources.map(source => <tr key={source.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {source.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${source.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.lastSync}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                      <button className={`${source.status === 'Connected' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                        {source.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showNewConnectionForm ? <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Connection
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Connection Name
              </label>
              <input type="text" id="name" name="name" value={newConnection.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="e.g., Abacus Repository" />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Connection Type
              </label>
              <select id="type" name="type" value={newConnection.type} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                <option value="Process Model Repository">
                  Process Model Repository
                </option>
                <option value="Document Repository">Document Repository</option>
                <option value="API Connection">API Connection</option>
                <option value="Database">Database</option>
              </select>
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Connection URL
              </label>
              <input type="text" id="url" name="url" value={newConnection.url} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="https://repository.example.com/api" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input type="text" id="username" name="username" value={newConnection.username} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input type="password" id="password" name="password" value={newConnection.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
              </div>
            </div>
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                API Key (if applicable)
              </label>
              <input type="text" id="apiKey" name="apiKey" value={newConnection.apiKey} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E]" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowNewConnectionForm(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                Cancel
              </button>
              <button type="button" onClick={handleAddConnection} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                <Link className="mr-2 h-4 w-4" />
                Connect
              </button>
            </div>
          </div>
        </div> : <button type="button" onClick={() => setShowNewConnectionForm(true)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
          <Link className="mr-2 h-4 w-4" />
          Add New Connection
        </button>}
    </div>;
};
export default Settings;