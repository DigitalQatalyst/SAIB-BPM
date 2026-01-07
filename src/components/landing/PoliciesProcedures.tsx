import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { documentsData } from '../../services/mockDocumentsData';
import { getRecentPublishedDocuments } from '../../services/requestTracking';

const PoliciesProcedures = () => {
  const { t } = useLanguage();
  const [featuredDocs, setFeaturedDocs] = useState<any[]>([]);

  useEffect(() => {
    const loadFeaturedDocuments = () => {
      // Try to get recently published documents
      const publishedDocs = getRecentPublishedDocuments(3);

      if (publishedDocs && publishedDocs.length > 0) {
        // Map published documents to the format expected by the component
        const mappedDocs = publishedDocs.map(doc => ({
          id: doc.id,
          title: doc.title,
          type: doc.type,
          status: doc.status,
          lastUpdated: doc.lastUpdated,
        }));
        setFeaturedDocs(mappedDocs);
      } else {
        // Fallback to mock data if no published documents
        const docsArray = Object.values(documentsData);
        const featuredPolicy = docsArray.find(doc => doc.type === 'Policy');
        const featuredProcedure = docsArray.find(doc => doc.type === 'Procedure');
        const featuredForm = docsArray.find(doc => doc.type === 'Form');
        const mockDocs = [featuredPolicy, featuredProcedure, featuredForm].filter(Boolean);
        setFeaturedDocs(mockDocs);
      }
    };

    // Initial load
    loadFeaturedDocuments();

    // Listen for published documents updates
    window.addEventListener('publishedDocumentsUpdated', loadFeaturedDocuments);
    window.addEventListener('storage', loadFeaturedDocuments);

    return () => {
      window.removeEventListener('publishedDocumentsUpdated', loadFeaturedDocuments);
      window.removeEventListener('storage', loadFeaturedDocuments);
    };
  }, []);

  return (
    <div className="py-16 bg-[#FECC0E]/5">
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
          {featuredDocs.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-between">
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
                <a
                  href="https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/IQBcOyDhQr5lQoXIDfaQWDVCAfrX0bPBBnSVexqdmRNj8GE?e=nvJ2FY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FECC0E]/20 hover:bg-[#FECC0E]/30 text-[#9E800D] px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  {t('view') || 'View'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliciesProcedures;