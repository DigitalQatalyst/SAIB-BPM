import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { documentsData } from '../../services/mockDocumentsData';
const PoliciesProcedures = () => {
  const {
    t
  } = useLanguage();
  // Convert documentsData object to array
  const docsArray = Object.values(documentsData);
  // Filter to get one policy, one procedure, and one form
  const featuredPolicy = docsArray.find(doc => doc.type === 'Policy');
  const featuredProcedure = docsArray.find(doc => doc.type === 'Procedure');
  const featuredForm = docsArray.find(doc => doc.type === 'Form');
  // Combine into a featured documents array, filtering out undefined values
  const featuredDocs = [featuredPolicy, featuredProcedure, featuredForm].filter(Boolean);
  return <div className="py-16 bg-[#FECC0E]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('featuredPolicies')}
            </h2>
            <p className="mt-2 text-gray-600">{t('accessLatestPolicies')}</p>
          </div>
          <Link to="/documents" className="flex items-center text-sm font-medium text-gray-900 hover:text-[#9E800D] transition-colors">
            {t('exploreMore')} <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="mt-8 space-y-4">
          {featuredDocs.map(doc => <div key={doc.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {doc.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-3 py-1 rounded-full ${doc.status === 'Active' ? 'bg-green-100 text-green-800' : doc.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {doc.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 mr-6">
                  {t('lastUpdated')}: {doc.lastUpdated}
                </div>
                <Link to={`/document/${doc.id}`} className="bg-[#FECC0E]/20 hover:bg-[#FECC0E]/30 text-[#9E800D] px-4 py-2 rounded-md text-sm font-medium transition-all duration-200">
                  {t('view') || 'View'}
                </Link>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default PoliciesProcedures;