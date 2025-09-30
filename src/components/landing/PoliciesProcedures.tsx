import React, { createElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
const policies = [{
  id: 'HR-001',
  title: 'Employee Code of Conduct',
  department: 'Human Resources',
  departmentColor: 'bg-blue-100 text-blue-700',
  lastUpdated: '2025-08-15'
}, {
  id: 'IT-004',
  title: 'Information Security Policy',
  department: 'Information Technology',
  departmentColor: 'bg-blue-100 text-blue-700',
  lastUpdated: '2025-07-22'
}, {
  id: 'FIN-002',
  title: 'Expense Reimbursement Procedure',
  department: 'Finance',
  departmentColor: 'bg-green-100 text-green-700',
  lastUpdated: '2025-09-01'
}];
const PoliciesProcedures = () => {
  const {
    t
  } = useLanguage();
  // Function to handle document download
  const handleDownload = policy => {
    // Create dummy content for the document
    const content = `
# ${policy.title}
Department: ${policy.department}
Last Updated: ${policy.lastUpdated}
## Introduction
This is a dummy test document for ${policy.title}.
## Purpose
The purpose of this document is to demonstrate the download functionality.
## Scope
This policy applies to all employees of SAIB.
## Policy Details
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
## Compliance
All employees are expected to comply with this policy.
## References
- SAIB Corporate Governance Framework
- Regulatory Guidelines
Document ID: ${policy.id}
Version: 1.0
    `;
    // Create a Blob containing the text content
    const blob = new Blob([content], {
      type: 'text/plain'
    });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policy.id} - ${policy.title}.txt`;
    document.body.appendChild(a);
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
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
          {policies.map(policy => <div key={policy.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 13H8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17H8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 9H9H8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {policy.id}: {policy.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-3 py-1 rounded-full ${policy.departmentColor}`}>
                      {policy.department}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 mr-6">
                  {t('lastUpdated')}: {policy.lastUpdated}
                </div>
                <button className="bg-[#FECC0E]/20 hover:bg-[#FECC0E]/30 text-[#9E800D] px-4 py-2 rounded-md text-sm font-medium transition-all duration-200" onClick={() => handleDownload(policy)}>
                  {t('download')}
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default PoliciesProcedures;