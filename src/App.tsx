import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ServiceMarketplace from './pages/ServiceMarketplace';
import RegulationsMarketplace from './pages/RegulationsMarketplace';
import DocumentsMarketplace from './pages/DocumentsMarketplace';
import DocumentDetails from './pages/DocumentDetails';
import ProcessMiningMarketplace from './pages/ProcessMiningMarketplace';
import ProcessMiningDetails from './pages/ProcessMiningDetails';
import PerformanceManagementMarketplace from './pages/PerformanceManagementMarketplace';
import PerformanceManagementDetails from './pages/PerformanceManagementDetails';
import RiskManagementMarketplace from './pages/RiskManagementMarketplace';
import RiskManagementDetails from './pages/RiskManagementDetails';
import ServiceDetails from './pages/ServiceDetails';
import ServiceRequestForm from './pages/ServiceRequestForm';
import PolicyRequestForm from './pages/PolicyRequestForm';
import TrackRequests from './pages/TrackRequests';
import ManageRequests from './pages/ManageRequests';
import ApprovalRequests from './pages/ApprovalRequests';
import ResourceCenter from './pages/ResourceCenter';
import Support from './pages/Support';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Favorites from './pages/Favorites';
import Navbar from './components/shared/Navbar';
import NavbarSecondary from './components/shared/NavbarSecondary';
import Footer from './components/shared/Footer';
import Sidebar from './components/shared/Sidebar';
import VoiceflowChat from './components/VoiceflowChat';
import { UserProvider, useUser } from './context/UserContext';
import { DocumentProvider } from './context/DocumentContext';
import { LanguageProvider } from './context/LanguageContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { CollaborationProvider } from './context/CollaborationContext';
import DocWriter from './pages/DocWriter';
import TemplatesMarketplace from './pages/TemplatesMarketplace';
import TemplateDetails from './pages/TemplateDetails';
import SharedDocument from './pages/SharedDocument';
import ProcessModelCreator from './pages/ProcessModelCreator';
const AppContent = () => {
  const location = useLocation();
  const {
    role
  } = useUser();
  const isLandingPage = location.pathname === '/';
  const isSharedDocPage = location.pathname.startsWith('/shared/');
  const showSidebar = ['/track-requests', '/manage-requests', '/approval-requests', '/resource-center', '/support', '/feedback', '/notifications', '/settings', '/docwriter', '/template', '/team', '/favorites', '/process-model-creator'].some(path => location.pathname.startsWith(path));
  return <div className="flex flex-col min-h-screen font-['Poppins']">
      {isLandingPage ? <Navbar /> : !isSharedDocPage && <NavbarSecondary />}
      {showSidebar && <Sidebar />}
      <main className={`flex-grow ${!isLandingPage && !showSidebar && !isSharedDocPage ? 'pt-16' : ''} ${showSidebar ? 'pt-16 pl-64' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServiceMarketplace />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/service/:id/request" element={<ServiceRequestForm />} />
          <Route path="/service/:id/policy-request" element={<PolicyRequestForm />} />
          <Route path="/regulations" element={<RegulationsMarketplace />} />
          <Route path="/documents" element={<DocumentsMarketplace />} />
          <Route path="/document/:id" element={<DocumentDetails />} />
          <Route path="/process-mining" element={<ProcessMiningMarketplace />} />
          <Route path="/process-mining/:id" element={<ProcessMiningDetails />} />
          <Route path="/performance-management" element={<PerformanceManagementMarketplace />} />
          <Route path="/performance-management/:id" element={<PerformanceManagementDetails />} />
          <Route path="/risk-management" element={<RiskManagementMarketplace />} />
          <Route path="/risk-management/:id" element={<RiskManagementDetails />} />
          <Route path="/track-requests" element={<TrackRequests />} />
          <Route path="/manage-requests" element={<ManageRequests />} />
          <Route path="/approval-requests" element={<ApprovalRequests />} />
          <Route path="/docwriter" element={<TemplatesMarketplace />} />
          <Route path="/template/:id" element={<TemplateDetails />} />
          <Route path="/docwriter/create/:templateId" element={<DocWriter />} />
          <Route path="/docwriter/:requestId" element={<DocWriter />} />
          <Route path="/shared/:shareId" element={<SharedDocument />} />
          <Route path="/process-model-creator" element={<ProcessModelCreator />} />
          <Route path="/resource-center" element={<ResourceCenter />} />
          <Route path="/support" element={<Support />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/team" element={<Team />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      {!isSharedDocPage && <Footer />}
      <VoiceflowChat />
    </div>;
};
export function App() {
  return <BrowserRouter>
      <UserProvider>
        <DocumentProvider>
          <LanguageProvider>
            <ComparisonProvider>
              <CollaborationProvider>
                <AppContent />
              </CollaborationProvider>
            </ComparisonProvider>
          </LanguageProvider>
        </DocumentProvider>
      </UserProvider>
    </BrowserRouter>;
}