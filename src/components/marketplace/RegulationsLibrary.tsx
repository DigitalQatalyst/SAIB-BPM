import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, ChevronDown } from 'lucide-react';
const regulations = [{
  id: 1,
  title: 'SAMA Circular No. 41/12345',
  description: 'Guidelines on digital banking services and open banking.',
  regulator: 'SAMA',
  category: 'Digital Banking',
  publicationDate: '2023-03-15',
  effectiveDate: '2023-06-15',
  impact: 'High',
  status: 'New',
  relatedPolicies: ['Digital Banking Policy', 'Customer Data Protection Policy']
}, {
  id: 2,
  title: 'CMA Circular No. 2023-05',
  description: 'Requirements for financial reporting and disclosure for listed companies.',
  regulator: 'CMA',
  category: 'Financial Reporting',
  publicationDate: '2023-02-10',
  effectiveDate: '2023-04-01',
  impact: 'Medium',
  status: 'Active',
  relatedPolicies: ['Financial Reporting Policy', 'Disclosure Policy']
}, {
  id: 3,
  title: 'SAMA Circular No. 41/98765',
  description: 'Updated anti-money laundering and counter-terrorism financing requirements.',
  regulator: 'SAMA',
  category: 'Compliance',
  publicationDate: '2023-01-20',
  effectiveDate: '2023-07-01',
  impact: 'High',
  status: 'Active',
  relatedPolicies: ['AML Policy', 'KYC Procedures', 'Risk Assessment Framework']
}, {
  id: 4,
  title: 'MOF Directive 2023/01',
  description: 'Tax reporting requirements for financial institutions.',
  regulator: 'MOF',
  category: 'Taxation',
  publicationDate: '2023-04-05',
  effectiveDate: '2023-07-01',
  impact: 'Medium',
  status: 'New',
  relatedPolicies: ['Tax Compliance Policy', 'Financial Reporting Policy']
}, {
  id: 5,
  title: 'SAMA Circular No. 42/54321',
  description: 'Cybersecurity framework for banking and financial institutions.',
  regulator: 'SAMA',
  category: 'IT Security',
  publicationDate: '2023-05-12',
  effectiveDate: '2023-11-12',
  impact: 'High',
  status: 'Draft',
  relatedPolicies: ['Information Security Policy', 'Cyber Incident Response Plan', 'IT Risk Management Policy']
}, {
  id: 6,
  title: 'CMA Circular No. 2023-08',
  description: 'Corporate governance requirements for listed companies.',
  regulator: 'CMA',
  category: 'Governance',
  publicationDate: '2023-06-18',
  effectiveDate: '2023-09-01',
  impact: 'Medium',
  status: 'Active',
  relatedPolicies: ['Corporate Governance Policy', 'Board Charter', 'Conflict of Interest Policy']
}];
const regulators = ['All', 'SAMA', 'CMA', 'MOF'];
const categories = ['All', 'Digital Banking', 'Financial Reporting', 'Compliance', 'Taxation', 'IT Security', 'Governance'];
const impacts = ['All', 'Low', 'Medium', 'High'];
const statuses = ['All', 'Draft', 'New', 'Active', 'Superseded'];
const RegulationsLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegulator, setSelectedRegulator] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImpact, setSelectedImpact] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = regulation.title.toLowerCase().includes(searchQuery.toLowerCase()) || regulation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegulator = selectedRegulator === 'All' || regulation.regulator === selectedRegulator;
    const matchesCategory = selectedCategory === 'All' || regulation.category === selectedCategory;
    const matchesImpact = selectedImpact === 'All' || regulation.impact === selectedImpact;
    const matchesStatus = selectedStatus === 'All' || regulation.status === selectedStatus;
    return matchesSearch && matchesRegulator && matchesCategory && matchesImpact && matchesStatus;
  });
  return <div className="flex flex-col md:flex-row gap-6">
      {/* Filters sidebar */}
      <div className="md:w-1/4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Filters</h3>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="text-gray-500 hover:text-gray-700">
              <ChevronDown size={20} className={`transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {isFilterOpen && <div className="p-4 space-y-6">
              <div>
                <label htmlFor="regulator" className="block text-sm font-medium text-gray-700 mb-1">
                  Regulator
                </label>
                <select id="regulator" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedRegulator} onChange={e => setSelectedRegulator(e.target.value)}>
                  {regulators.map(regulator => <option key={regulator} value={regulator}>
                      {regulator === 'All' ? 'All Regulators' : regulator}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select id="category" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  {categories.map(category => <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Impact
                </label>
                <select id="impact" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedImpact} onChange={e => setSelectedImpact(e.target.value)}>
                  {impacts.map(impact => <option key={impact} value={impact}>
                      {impact === 'All' ? 'All Impact Levels' : impact}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select id="status" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  {statuses.map(status => <option key={status} value={status}>
                      {status === 'All' ? 'All Statuses' : status}
                    </option>)}
                </select>
              </div>
              <div className="pt-4">
                <button onClick={() => {
              setSelectedRegulator('All');
              setSelectedCategory('All');
              setSelectedImpact('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear all filters
                </button>
              </div>
            </div>}
        </div>
      </div>
      {/* Main content */}
      <div className="md:w-3/4">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" placeholder="Search regulations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {filteredRegulations.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              No regulations found matching your criteria.
            </p>
          </div> : <div className="space-y-6">
            {filteredRegulations.map(regulation => <div key={regulation.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {regulation.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {regulation.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-[#FECC0E] hover:bg-[#e6b800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                      <Download className="h-4 w-4 text-gray-900" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Regulator
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {regulation.regulator}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Category
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {regulation.category}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${regulation.status === 'New' ? 'bg-green-100 text-green-800' : regulation.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {regulation.status}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Publication Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {regulation.publicationDate}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Effective Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {regulation.effectiveDate}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Business Impact
                      </dt>
                      <dd className="mt-1 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${regulation.impact === 'High' ? 'bg-red-100 text-red-800' : regulation.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {regulation.impact}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-3">
                      <dt className="text-sm font-medium text-gray-500">
                        Related Policies
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-2">
                          {regulation.relatedPolicies.map((policy, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {policy}
                            </span>)}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
};
export default RegulationsLibrary;