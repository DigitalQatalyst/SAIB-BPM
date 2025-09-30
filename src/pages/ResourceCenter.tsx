import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
const ResourceCenter = () => {
  const {
    t
  } = useLanguage();
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {t('resourceCenter')}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {t('resourceCenterDesc')}
          </p>
        </div>
        {/* Hero Section with Search */}
        <div className="relative bg-[#FFF8E1] py-16 rounded-lg mb-10">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
            <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {t('knowledgeBase')}
            </h2>
            <div className="relative max-w-xl mx-auto">
              <div className="flex items-center border border-gray-300 bg-white rounded-md shadow-sm">
                <div className="pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full py-3 pl-2 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0" placeholder={t('searchPlaceholder')} />
              </div>
            </div>
            <p className="text-center mt-4 text-gray-600">
              {t('knowledgeBaseDesc')}
            </p>
          </div>
        </div>
        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-16 h-16 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FECC0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                {t('documentTemplates')}
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {t('documentTemplatesDesc')}
              </p>
              <div className="mt-6">
                <Link to="/resource-center/templates" className="block text-center text-[#9E800D] hover:text-[#FECC0E] text-sm font-medium">
                  {t('viewTemplates')}
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-16 h-16 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FECC0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                {t('regulatoryUpdates')}
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {t('regulatoryUpdatesDesc')}
              </p>
              <div className="mt-6">
                <Link to="/resource-center/regulatory-updates" className="block text-center text-[#9E800D] hover:text-[#FECC0E] text-sm font-medium">
                  {t('viewUpdates')}
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="w-16 h-16 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FECC0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                {t('quickGuides')}
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {t('quickGuidesDesc')}
              </p>
              <div className="mt-6">
                <Link to="/resource-center/guides" className="block text-center text-[#9E800D] hover:text-[#FECC0E] text-sm font-medium">
                  {t('viewGuides')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Document Management Resources */}
        <div className="bg-white shadow rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('documentManagement')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('documentCreation')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/style-guide" className="text-[#9E800D] hover:text-[#FECC0E]">
                      SAIB Document Style Guide
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Official formatting and styling guidelines for all bank
                      documents
                    </span>
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/ai-docwriter-guide" className="text-[#9E800D] hover:text-[#FECC0E]">
                      AI DocWriter Best Practices
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Guidelines for using AI to generate effective policy
                      documents
                    </span>
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/process-modeling" className="text-[#9E800D] hover:text-[#FECC0E]">
                      Process Modeling Guidelines
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Standards for creating and maintaining process models
                    </span>
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('reviewApproval')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/review-checklist" className="text-[#9E800D] hover:text-[#FECC0E]">
                      Document Review Checklist
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Comprehensive checklist for policy and procedure review
                    </span>
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/approval-workflow" className="text-[#9E800D] hover:text-[#FECC0E]">
                      Approval Workflow Guide
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Detailed explanation of the document approval process
                    </span>
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#FECC0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-700">
                    <Link to="/resource-center/feedback-guide" className="text-[#9E800D] hover:text-[#FECC0E]">
                      Providing Effective Feedback
                    </Link>
                    <span className="block text-sm text-gray-500">
                      Guidelines for providing constructive document feedback
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Training Resources */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('ppTeamTraining')}
            </h2>
            <Link to="/resource-center/training" className="text-sm text-[#9E800D] hover:text-[#FECC0E] font-medium">
              {t('viewAllTraining')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="AI DocWriter Training" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  AI DocWriter Training
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Learn how to use AI to generate effective policy documents
                </p>
                <Link to="/resource-center/ai-training" className="mt-3 inline-block text-sm text-[#9E800D] hover:text-[#FECC0E]">
                  Watch Training
                </Link>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Regulatory Compliance" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  Regulatory Compliance
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ensuring compliance with SAMA regulations in policies
                </p>
                <Link to="/resource-center/compliance-training" className="mt-3 inline-block text-sm text-[#9E800D] hover:text-[#FECC0E]">
                  Watch Training
                </Link>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Process Modeling" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Process Modeling</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Creating effective process models for documentation
                </p>
                <Link to="/resource-center/process-training" className="mt-3 inline-block text-sm text-[#9E800D] hover:text-[#FECC0E]">
                  Watch Training
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ResourceCenter;