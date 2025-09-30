import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Download, CheckCircle, AlertTriangle } from 'lucide-react';
// Mock template data - in a real app this would come from an API or context
const templates = [{
  id: 1,
  title: 'Policy Document Template',
  description: 'Standard template for creating bank policies with pre-defined sections and formatting.',
  category: 'Policy',
  department: 'All',
  lastUpdated: '2023-09-15',
  version: '3.2',
  status: 'Active',
  type: 'Template',
  createdBy: 'Sarah Johnson',
  createdDate: '2023-01-10',
  sections: ['Executive Summary', 'Purpose', 'Scope', 'Policy Statements', 'Roles and Responsibilities', 'Compliance Requirements', 'Related Documents', 'Review and Approval History'],
  features: ['Pre-formatted sections aligned with bank standards', 'Built-in compliance checklist', 'Automatic version control', 'Integration with regulatory reference database']
}, {
  id: 2,
  title: 'Procedure Document Template',
  description: 'Detailed template for documenting step-by-step procedures with process flows.',
  category: 'Procedure',
  department: 'All',
  lastUpdated: '2023-10-05',
  version: '2.1',
  status: 'Active',
  type: 'Template',
  createdBy: 'Ahmed Al-Farsi',
  createdDate: '2023-03-22',
  sections: ['Purpose', 'Scope', 'Definitions', 'Process Overview', 'Detailed Procedure Steps', 'Exception Handling', 'Related Documents', 'Revision History'],
  features: ['Process flow diagram placeholders', 'Step-by-step formatting with numbering', 'Role responsibility matrices', 'Integration with process model repository']
}, {
  id: 3,
  title: 'Regulatory Compliance Template',
  description: 'Template designed for creating documents that address specific SAMA regulatory requirements.',
  category: 'Compliance',
  department: 'Compliance',
  lastUpdated: '2023-08-22',
  version: '4.0',
  status: 'Active',
  type: 'Template',
  createdBy: 'Fatima Al-Otaibi',
  createdDate: '2022-11-15',
  sections: ['Regulatory Reference', 'Compliance Requirement Summary', 'Implementation Approach', 'Control Measures', 'Monitoring and Reporting', 'Roles and Responsibilities', 'Compliance Attestation', 'Regulatory Communication History'],
  features: ['Built-in SAMA regulatory references', 'Compliance status tracking fields', 'Automatic notification of regulatory updates', 'Audit trail for compliance evidence']
}, {
  id: 4,
  title: 'Information Security Template',
  description: 'Specialized template for information security policies with cybersecurity framework sections.',
  category: 'IT',
  department: 'IT',
  lastUpdated: '2023-07-30',
  version: '2.5',
  status: 'Active',
  type: 'Template',
  createdBy: 'Mohammed Al-Qahtani',
  createdDate: '2023-02-08',
  sections: ['Security Objectives', 'Scope and Applicability', 'Security Controls', 'Access Management', 'Incident Response', 'Risk Assessment', 'Compliance Requirements', 'Review and Updates'],
  features: ['Aligned with ISO 27001 standards', 'SAMA cybersecurity framework mapping', 'Security control implementation checklist', 'Integration with security control database']
}, {
  id: 5,
  title: 'Risk Management Template',
  description: 'Template for risk assessment and management documentation with built-in risk matrices.',
  category: 'Risk',
  department: 'Risk',
  lastUpdated: '2023-09-18',
  version: '1.8',
  status: 'Active',
  type: 'Template',
  createdBy: 'Norah Al-Subaie',
  createdDate: '2023-05-20',
  sections: ['Risk Overview', 'Risk Identification', 'Risk Assessment Matrix', 'Risk Mitigation Strategies', 'Monitoring and Review', 'Risk Reporting', 'Roles and Responsibilities', 'Appendices'],
  features: ['Interactive risk assessment matrix', 'Risk categorization framework', 'Key risk indicator tracking', 'Integration with enterprise risk management system']
}, {
  id: 6,
  title: 'HR Policy Template',
  description: 'Standardized template for human resources policies with employment law compliance sections.',
  category: 'HR',
  department: 'HR',
  lastUpdated: '2023-06-12',
  version: '2.3',
  status: 'Active',
  type: 'Template',
  createdBy: 'Layla Al-Harbi',
  createdDate: '2022-12-05',
  sections: ['Policy Purpose', 'Scope and Eligibility', 'Policy Statements', 'Procedures and Guidelines', 'Legal Compliance', 'Exceptions', 'Related Policies', 'Review and Approval'],
  features: ['Saudi Labor Law compliance references', 'Employee acknowledgment tracking', 'Multi-language support', 'Integration with HR management system']
}];
const TemplateDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  // Find the template by ID
  const template = templates.find(t => t.id === Number(id));
  if (!template) {
    return <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-xl font-medium text-gray-900">
              Template not found
            </h1>
            <button onClick={() => navigate('/docwriter')} className="mt-4 flex items-center text-sm font-medium text-[#9E800D]">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Templates
            </button>
          </div>
        </div>
      </div>;
  }
  const handleUseTemplate = () => {
    navigate(`/docwriter/create/${template.id}`);
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <button onClick={() => navigate('/docwriter')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Templates
          </button>
        </div>
        {/* Template Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {template.title}
                  </h1>
                  <p className="mt-1 text-gray-500 max-w-3xl">
                    {template.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${template.status === 'Active' ? 'bg-green-100 text-green-800' : template.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {template.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {template.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Version {template.version}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                <button onClick={handleUseTemplate} className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                  Use This Template
                </button>
                <button className="mt-2 flex items-center text-sm text-gray-600">
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span>Created by: {template.createdBy}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span>Last updated: {template.lastUpdated}</span>
            </div>
          </div>
        </div>
        {/* Template Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Template Sections */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Template Sections
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pre-defined sections included in this template
                </p>
              </div>
              <div className="px-6 py-5">
                <ul className="divide-y divide-gray-200">
                  {template.sections.map((section, index) => <li key={index} className="py-3 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span>{section}</span>
                    </li>)}
                </ul>
              </div>
            </div>
            {/* Template Features */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Template Features
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Special features and capabilities of this template
                </p>
              </div>
              <div className="px-6 py-5">
                <ul className="divide-y divide-gray-200">
                  {template.features.map((feature, index) => <li key={index} className="py-3 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-8">
            {/* Template Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Template Information
                </h2>
              </div>
              <div className="px-6 py-5">
                <dl className="divide-y divide-gray-200">
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.category}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      Department
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.department}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      Version
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.version}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      Created Date
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.createdDate}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.lastUpdated}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            {/* Usage Notes */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Usage Notes
                </h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Before you begin
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Make sure you have all required information ready before
                      starting the document creation process.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  This template is designed for use with the AI DocWriter. The
                  AI will use this template structure to generate a
                  comprehensive document based on your inputs and any process
                  models you provide.
                </p>
              </div>
            </div>
            {/* Call to Action */}
            <div className="bg-[#FFF8E1] shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Ready to create your document?
                </h2>
                <p className="mt-1 text-sm text-gray-600 mb-4">
                  Use this template with AI DocWriter to quickly generate a
                  professional document.
                </p>
                <button onClick={handleUseTemplate} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default TemplateDetails;