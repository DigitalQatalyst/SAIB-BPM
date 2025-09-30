import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
const FeaturesOverview = () => {
  const {
    t
  } = useLanguage();
  const regulationLink = 'https://rulebook.sama.gov.sa/en/new-banking-products-and-services-regulation';
  return <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('regulationsTitle')}
          </h2>
          <Link to="/regulations" className="flex items-center justify-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] transition-colors mt-4">
            {t('exploreMore')} <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured regulation (left side) */}
          <div className="lg:col-span-6">
            <a href={regulationLink} target="_blank" rel="noopener noreferrer" className="block h-full">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full hover:shadow-md transition-all duration-300">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="SAMA building" className="w-full h-64 object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t('samaCircular')}
                  </h3>
                  <p className="text-sm text-gray-500 mt-4">April 14, 2025</p>
                </div>
              </div>
            </a>
          </div>
          {/* Right side regulations */}
          <div className="lg:col-span-6 space-y-6">
            <a href={regulationLink} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="w-1/3">
                  <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="CMA building" className="w-full h-32 object-cover" />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {t('cmaUpdates')}
                  </h3>
                  <p className="text-sm text-gray-500">March 28, 2025</p>
                </div>
              </div>
            </a>
            <a href={regulationLink} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="w-1/3">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="Business meeting" className="w-full h-32 object-cover" />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {t('amlUpdates')}
                  </h3>
                  <p className="text-sm text-gray-500">March 18, 2025</p>
                </div>
              </div>
            </a>
            <a href={regulationLink} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="w-1/3">
                  <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="Financial institution" className="w-full h-32 object-cover" />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {t('cyberSecurityFramework')}
                  </h3>
                  <p className="text-sm text-gray-500">March 24, 2025</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>;
};
export default FeaturesOverview;