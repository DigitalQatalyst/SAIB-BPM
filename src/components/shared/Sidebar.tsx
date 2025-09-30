import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, BookOpen, HelpCircle, MessageSquare, Bell, Users, FileBarChart, Settings as SettingsIcon, BarChart2, FilePenLine, CheckSquare } from 'lucide-react';
import { useUser } from '../../context/UserContext';
const Sidebar = () => {
  const location = useLocation();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const {
    role
  } = useUser();
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  useEffect(() => {
    // Function to check if footer is visible
    const checkFooterVisibility = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight;
        setIsFooterVisible(isVisible);
      }
    };
    // Initial check
    checkFooterVisibility();
    // Add scroll event listener
    window.addEventListener('scroll', checkFooterVisibility);
    // Clean up
    return () => {
      window.removeEventListener('scroll', checkFooterVisibility);
    };
  }, []);
  return <div className={`${isFooterVisible ? 'absolute' : 'fixed'} top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-10`}>
      <nav className="flex flex-col h-full">
        <div className="p-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Requests
          </h3>
          {role === 'user' ? <Link to="/track-requests" className={`flex items-center p-3 rounded-md ${isActive('/track-requests') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <FileText className="h-5 w-5 mr-3" />
              Track Requests
            </Link> : role === 'approver' ? <Link to="/approval-requests" className={`flex items-center p-3 rounded-md ${isActive('/approval-requests') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <CheckSquare className="h-5 w-5 mr-3" />
              Approval Requests
            </Link> : <>
              <Link to="/manage-requests" className={`flex items-center p-3 rounded-md ${isActive('/manage-requests') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FileText className="h-5 w-5 mr-3" />
                Manage Requests
              </Link>
              <Link to="/docwriter" className={`flex items-center p-3 rounded-md ${isActive('/docwriter') || isActive('/template') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FilePenLine className="h-5 w-5 mr-3" />
                AI DocWriter
              </Link>
              <a href="https://4825e705-e605-4bf1-a7ac-0dceee5eaa60-render.magicpatterns.app/" target="_blank" rel="noopener noreferrer" className={`flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100`}>
                <BarChart2 className="h-5 w-5 mr-3" />
                Analytics
              </a>
              <Link to="/team" className={`flex items-center p-3 rounded-md ${isActive('/team') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Users className="h-5 w-5 mr-3" />
                Team
              </Link>
            </>}
        </div>
        <div className="px-4 pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Resources & Support
          </h3>
          <div className="mt-3 space-y-1">
            <Link to="/resource-center" className={`flex items-center p-3 rounded-md ${isActive('/resource-center') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-3" />
              Resource Center
            </Link>
            <Link to="/support" className={`flex items-center p-3 rounded-md ${isActive('/support') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <HelpCircle className="h-5 w-5 mr-3" />
              Support
            </Link>
            <Link to="/feedback" className={`flex items-center p-3 rounded-md ${isActive('/feedback') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <MessageSquare className="h-5 w-5 mr-3" />
              Provide Feedback
            </Link>
          </div>
        </div>
        <div className="px-4 pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </h3>
          <div className="mt-3 space-y-1">
            <Link to="/settings" className={`flex items-center p-3 rounded-md ${isActive('/settings') ? 'bg-[#FECC0E]/10 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <SettingsIcon className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
      </nav>
    </div>;
};
export default Sidebar;