import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, X, Globe, ChevronDown, Settings, LogOut, Users, User, FileText, BookOpen, ClipboardList, Check, BarChart2, LineChart, AlertTriangle, CheckCircle, Shield, Bell, XCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { getUnreadRequestCount, getUnreadRequests, markRequestAsRead, getUnreadApprovalCount, getUnreadApprovals, getUnreadPPNotifications, getUnreadPPNotificationCount, markPPNotificationAsRead } from '../../services/requestTracking';
const NavbarSecondary = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  // Get user context
  const {
    role,
    setRole,
    name,
    email
  } = useUser();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  // Mock user data - in a real app this would come from auth context or state
  const user = {
    name,
    initials: name.split(' ').map(n => n[0]).join('')
  };
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  // Handle role switching
  const switchToRole = (newRole: 'user' | 'pp_team' | 'approver') => {
    setRole(newRole);
    // Navigate to the appropriate page based on role
    switch (newRole) {
      case 'pp_team':
        navigate('/manage-requests');
        break;
      case 'approver':
        navigate('/approval-requests');
        break;
      default:
        // user
        navigate('/track-requests');
        break;
    }
    setIsProfileOpen(false);
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef, exploreRef, languageRef, notificationRef]);

  // Track notification count for P&P team members and Approvers
  useEffect(() => {
    const updateNotificationCount = () => {
      if (role === 'pp_team') {
        const requestCount = getUnreadRequestCount(name);
        const ppNotifCount = getUnreadPPNotificationCount(name);
        setNotificationCount(requestCount + ppNotifCount);
      } else if (role === 'approver') {
        const count = getUnreadApprovalCount(name);
        setNotificationCount(count);
      } else {
        setNotificationCount(0);
      }
    };

    // Update on mount and when role/name changes
    updateNotificationCount();

    // Listen for notification updates
    const handleNotificationUpdate = () => {
      updateNotificationCount();
    };

    window.addEventListener('requestNotificationsUpdated', handleNotificationUpdate);
    window.addEventListener('ppTeamNotificationsUpdated', handleNotificationUpdate);
    window.addEventListener('requestsUpdated', handleNotificationUpdate);
    window.addEventListener('storage', handleNotificationUpdate);

    return () => {
      window.removeEventListener('requestNotificationsUpdated', handleNotificationUpdate);
      window.removeEventListener('ppTeamNotificationsUpdated', handleNotificationUpdate);
      window.removeEventListener('requestsUpdated', handleNotificationUpdate);
      window.removeEventListener('storage', handleNotificationUpdate);
    };
  }, [role, name]);
  // Determine if this is a sidebar page (stage 2)
  const hasSidebar = ['/track-requests', '/manage-requests', '/approval-requests', '/admin-dashboard', '/resource-center', '/support', '/feedback', '/notifications', '/settings'].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith('/docwriter') || location.pathname.startsWith('/template');
  return <div className={`${hasSidebar ? 'fixed' : 'relative'} top-0 left-0 right-0 bg-[#FECC0E] shadow-sm z-50`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo_black.svg" alt="SAIB Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-8">
          <div className="flex space-x-8">
            {/* Explore Dropdown */}
            <div ref={exploreRef} className="relative">
              <button onClick={() => setIsExploreOpen(!isExploreOpen)} className={`flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors ${isActive('/services') || isActive('/regulations') || isActive('/documents') || isActive('/process-mining') || isActive('/performance-management') || isActive('/risk-management') ? 'border-b-2 border-gray-900' : ''}`}>
                {t('explore')}
                <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExploreOpen && <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('exploreSAIB')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('exploreCatalog')}
                  </p>
                </div>
                <div className="py-2 overflow-y-auto" style={{
                  maxHeight: '360px'
                }}>
                  <Link to="/services" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('services')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('browseServices')}
                      </p>
                    </div>
                  </Link>
                  <Link to="/regulations" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('regulations')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('accessRegulations')}
                      </p>
                    </div>
                  </Link>
                  <Link to="/documents" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('policiesProcedures')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('findLatestDocuments')}
                      </p>
                    </div>
                  </Link>
                  <Link to="/process-mining" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('processMining')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('analyzeProcesses')}
                      </p>
                    </div>
                  </Link>
                  <Link to="/performance-management" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <LineChart className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('performanceManagement')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('trackKPIs')}
                      </p>
                    </div>
                  </Link>
                  <Link to="/risk-management" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-[#9E800D]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">
                        {t('riskManagement')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('identifyRisks')}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>}
            </div>

            {/* Role-specific navigation */}
            {role === 'user' ? <Link to="/track-requests" className={`px-3 py-2 text-sm font-medium ${isActive('/track-requests') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-900 hover:text-gray-700'}`}>
              {t('trackRequests')}
            </Link> : role === 'pp_team' ? <Link to="/manage-requests" className={`px-3 py-2 text-sm font-medium ${isActive('/manage-requests') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-900 hover:text-gray-700'}`}>
              {t('manageRequests')}
            </Link> : role === 'approver' ? <Link to="/approval-requests" className={`px-3 py-2 text-sm font-medium ${isActive('/approval-requests') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-900 hover:text-gray-700'}`}>
              {t('approvalRequests')}
            </Link> : <Link to="/admin-dashboard" className={`px-3 py-2 text-sm font-medium ${isActive('/admin-dashboard') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-900 hover:text-gray-700'}`}>
              {t('adminDashboard')}
            </Link>}
          </div>

          <div className="flex items-center space-x-4 ml-6">
            {/* Language Dropdown */}
            <div ref={languageRef} className="relative">
              <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-2 rounded-full text-gray-900 hover:bg-yellow-200 transition-colors" aria-label="Change language">
                <Globe size={20} />
              </button>
              {isLanguageOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
                <div className="py-1">
                  <button onClick={() => {
                    setLanguage('en');
                    setIsLanguageOpen(false);
                  }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span className="flex-1 text-left">{t('english')}</span>
                    {language === 'en' && <Check size={16} className="text-[#9E800D]" />}
                  </button>
                  <button onClick={() => {
                    setLanguage('ar');
                    setIsLanguageOpen(false);
                  }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span className="flex-1 text-left">{t('arabic')}</span>
                    {language === 'ar' && <Check size={16} className="text-[#9E800D]" />}
                  </button>
                </div>
              </div>}
            </div>

            {/* Notification Bell - For P&P Team and Approvers */}
            {(role === 'pp_team' || role === 'approver') && (
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-full text-gray-900 hover:bg-yellow-200 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role === 'pp_team' ? 'New Requests' : 'Approval Requests'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {notificationCount} unread {role === 'pp_team' ? 'request' : 'approval'}{notificationCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="py-2 overflow-y-auto" style={{ maxHeight: '360px' }}>
                      {role === 'pp_team' ? (
                        <>
                          {/* P&P Team Approval Decision Notifications */}
                          {getUnreadPPNotifications(name).map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                markPPNotificationAsRead(notif.id, name);
                                setIsNotificationOpen(false);
                                navigate('/manage-requests');
                              }}
                              className="w-full flex items-start p-4 hover:bg-gray-50 text-left transition-colors border-l-4 border-transparent hover:border-[#9E800D]"
                            >
                              <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${notif.type === 'approval'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                                }`}>
                                {notif.type === 'approval' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notif.ticketNumber} {notif.type === 'approval' ? 'Approved' : 'Rejected'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {notif.type === 'approval'
                                    ? 'Ready to publish to Procedure Marketplace'
                                    : 'Needs revision'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </button>
                          ))}

                          {/* Regular Request Notifications -*/}
                          {getUnreadRequests(name).map((request) => (
                            <button
                              key={request.id}
                              onClick={() => {
                                markRequestAsRead(request.id, name);
                                setIsNotificationOpen(false);
                                navigate('/manage-requests');
                              }}
                              className="w-full flex items-start p-4 hover:bg-gray-50 text-left transition-colors"
                            >
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-[#9E800D]" />
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {request.ticketNumber}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {request.requestDetail}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {request.requester} • {new Date(request.dateCreated).toLocaleDateString()}
                                </p>
                              </div>
                            </button>
                          ))}

                          {/* No notifications message */}
                          {getUnreadPPNotifications(name).length === 0 && getUnreadRequests(name).length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                              <p className="text-sm">No unread notifications</p>
                            </div>
                          )}
                        </>
                      ) : (
                        getUnreadApprovals(name).length > 0 ? (
                          getUnreadApprovals(name).map((request) => (
                            <button
                              key={request.id}
                              onClick={() => {
                                markRequestAsRead(request.id, name);
                                setIsNotificationOpen(false);
                                navigate('/approval-requests');
                              }}
                              className="w-full flex items-start p-4 hover:bg-gray-50 text-left transition-colors"
                            >
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-[#9E800D]" />
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {request.ticketNumber}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {request.requestDetail}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  From: {request.assignedTo} • {new Date(request.dateCreated).toLocaleDateString()}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No pending approvals</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="p-2 rounded-full text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            </button>

            <div ref={profileRef} className="relative">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-900 font-medium text-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                {user.initials}
              </div>

              {/* Profile dropdown */}
              {isProfileOpen && <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>

                <div className="py-1 border-b border-gray-100">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    {t('switchView')}
                  </div>
                  <button onClick={() => switchToRole('user')} className={`w-full text-left px-4 py-2 text-sm ${role === 'user' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'} flex items-center`}>
                    <User size={16} className="mr-2" />
                    {t('regularUser')}
                  </button>
                  <button onClick={() => switchToRole('pp_team')} className={`w-full text-left px-4 py-2 text-sm ${role === 'pp_team' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'} flex items-center`}>
                    <Users size={16} className="mr-2" />
                    {t('ppTeamMember')}
                  </button>
                  <button onClick={() => switchToRole('approver')} className={`w-full text-left px-4 py-2 text-sm ${role === 'approver' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'} flex items-center`}>
                    <CheckCircle size={16} className="mr-2" />
                    {t('Approver')}
                  </button>
                </div>

                <div className="py-1">
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Settings size={16} className="mr-2" />
                    {t('settings')}
                  </Link>
                  <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center" onClick={() => alert('Logout functionality would go here')}>
                    <LogOut size={16} className="mr-2" />
                    {t('signOut')}
                  </button>
                </div>
              </div>}
            </div>
          </div>
        </div>

        <div className="flex items-center md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-900 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900">
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    {isMenuOpen && <div className="md:hidden bg-[#FECC0E] shadow-lg absolute left-0 right-0 z-50">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Mobile Explore Section */}
        <div className="px-3 py-2 text-base font-medium text-gray-900">
          {t('exploreSAIB')}
        </div>
        <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-900" />
            {t('services')}
          </div>
        </Link>
        <Link to="/regulations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-gray-900" />
            {t('regulations')}
          </div>
        </Link>
        <Link to="/documents" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-gray-900" />
            {t('policiesProcedures')}
          </div>
        </Link>
        <Link to="/process-mining" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-gray-900" />
            {t('processMining')}
          </div>
        </Link>
        <Link to="/performance-management" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-gray-900" />
            {t('performanceManagement')}
          </div>
        </Link>
        <Link to="/risk-management" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6" onClick={() => setIsMenuOpen(false)}>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-gray-900" />
            {t('riskManagement')}
          </div>
        </Link>

        {/* Role-specific navigation in mobile */}
        {role === 'user' ? <Link to="/track-requests" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/track-requests') ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`} onClick={() => setIsMenuOpen(false)}>
          {t('trackRequests')}
        </Link> : role === 'pp_team' ? <Link to="/manage-requests" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/manage-requests') ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`} onClick={() => setIsMenuOpen(false)}>
          {t('manageRequests')}
        </Link> : role === 'approver' ? <Link to="/approval-requests" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/approval-requests') ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`} onClick={() => setIsMenuOpen(false)}>
          {t('approvalRequests')}
        </Link> : <Link to="/admin-dashboard" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin-dashboard') ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`} onClick={() => setIsMenuOpen(false)}>
          {t('adminDashboard')}
        </Link>}

        {/* Language options in mobile menu */}
        <div className="px-3 py-2 text-base font-medium text-gray-900 mt-4">
          {t('language')}
        </div>
        <button onClick={() => {
          setLanguage('en');
          setIsMenuOpen(false);
        }} className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6">
          <span>{t('english')}</span>
          {language === 'en' && <Check size={16} className="text-gray-900" />}
        </button>
        <button onClick={() => {
          setLanguage('ar');
          setIsMenuOpen(false);
        }} className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-yellow-200 pl-6">
          <span>{t('arabic')}</span>
          {language === 'ar' && <Check size={16} className="text-gray-900" />}
        </button>

        {/* Role switching in mobile menu */}
        <div className="mt-4 space-y-2">
          <div className="px-3 py-2 text-xs font-medium text-gray-700">
            {t('switchView')}
          </div>
          <button onClick={() => switchToRole('user')} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${role === 'user' ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`}>
            {t('regularUser')}
          </button>
          <button onClick={() => switchToRole('pp_team')} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${role === 'pp_team' ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`}>
            {t('ppTeamMember')}
          </button>
          <button onClick={() => switchToRole('approver')} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${role === 'approver' ? 'bg-yellow-200 text-gray-900' : 'text-gray-900 hover:bg-yellow-200'}`}>
            {t('approver')}
          </button>
        </div>

        <div className="mt-4 flex space-x-2 px-3">
          {/* Notification Bell in mobile - Only for P&P Team */}
          {role === 'pp_team' && (
            <Link to="/manage-requests" className="p-2 rounded-full text-gray-900 hover:bg-yellow-200 relative" onClick={() => setIsMenuOpen(false)} aria-label="Notifications">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificationCount}
                </span>
              )}
            </Link>
          )}
          <button className="p-2 rounded-full text-gray-900 hover:bg-yellow-200">
            <Globe size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-900 hover:bg-yellow-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          </button>
        </div>

        <div className="mt-2 pb-2 flex justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900 font-medium">
            {user.initials}
          </div>
        </div>
      </div>
    </div>}
  </div>;
};
export default NavbarSecondary;