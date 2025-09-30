import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceCatalog from '../components/marketplace/ServiceCatalog';
import DocumentLibrary from '../components/marketplace/DocumentLibrary';
import RegulationsLibrary from '../components/marketplace/RegulationsLibrary';
const Marketplace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  useEffect(() => {
    // Get the tab from URL query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'documents') {
      setActiveTab('documents');
    } else if (tab === 'regulations') {
      setActiveTab('regulations');
    } else {
      setActiveTab('services');
    }
  }, [location.search]);
  const handleTabChange = tab => {
    setActiveTab(tab);
    navigate(`/marketplace?tab=${tab}`);
  };
  return <div className="bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            SAIB BPM Marketplace
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our catalogs of services, documents, and regulations.
          </p>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
            <button onClick={() => handleTabChange('services')} className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'services' ? 'border-[#FECC0E] text-[#FECC0E]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
              Core Services
            </button>
            <button onClick={() => handleTabChange('documents')} className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'documents' ? 'border-[#FECC0E] text-[#FECC0E]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
              Policies & Procedures
            </button>
            <button onClick={() => handleTabChange('regulations')} className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'regulations' ? 'border-[#FECC0E] text-[#FECC0E]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
              Regulations
            </button>
          </nav>
        </div>
        <div className="mt-8">
          {activeTab === 'services' && <ServiceCatalog />}
          {activeTab === 'documents' && <DocumentLibrary />}
          {activeTab === 'regulations' && <RegulationsLibrary />}
        </div>
      </div>
    </div>;
};
export default Marketplace;