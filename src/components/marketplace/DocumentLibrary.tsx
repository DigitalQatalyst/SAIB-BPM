import React, { useState } from 'react';
import { Search, Filter, Download, Eye, ChevronDown } from 'lucide-react';
const documents = [{
  id: 1,
  title: 'Corporate Governance Policy',
  description: 'Guidelines for corporate governance structure and practices.',
  category: 'Governance',
  department: 'Board',
  lastUpdated: '2023-06-15',
  version: '2.3',
  status: 'Active',
  type: 'Policy'
}, {
  id: 2,
  title: 'Employee Code of Conduct',
  description: 'Standards of behavior expected from all employees.',
  category: 'HR',
  department: 'HR',
  lastUpdated: '2023-08-22',
  version: '3.1',
  status: 'Active',
  type: 'Policy'
}, {
  id: 3,
  title: 'Information Security Policy',
  description: 'Guidelines for protecting information assets and systems.',
  category: 'IT',
  department: 'IT',
  lastUpdated: '2023-05-10',
  version: '4.2',
  status: 'Under Review',
  type: 'Policy'
}, {
  id: 4,
  title: 'Anti-Money Laundering Policy',
  description: 'Procedures to prevent and detect money laundering activities.',
  category: 'Compliance',
  department: 'Compliance',
  lastUpdated: '2023-07-30',
  version: '2.5',
  status: 'Active',
  type: 'Policy'
}, {
  id: 5,
  title: 'Credit Risk Management Procedure',
  description: 'Framework for managing credit risk across the bank.',
  category: 'Risk',
  department: 'Risk',
  lastUpdated: '2023-09-05',
  version: '3.0',
  status: 'Active',
  type: 'Procedure'
}, {
  id: 6,
  title: 'Business Continuity Procedure',
  description: 'Procedures for maintaining business operations during disruptions.',
  category: 'Operations',
  department: 'Operations',
  lastUpdated: '2023-04-18',
  version: '2.1',
  status: 'Active',
  type: 'Procedure'
}];
const categories = ['All', 'Governance', 'HR', 'IT', 'Compliance', 'Risk', 'Operations'];
const departments = ['All', 'Board', 'Compliance', 'HR', 'IT', 'Operations', 'Risk'];
const statuses = ['All', 'Active', 'Under Review', 'Archived'];
const types = ['All', 'Policy', 'Procedure', 'Form', 'Template'];
const DocumentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchQuery.toLowerCase()) || document.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || document.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'All' || document.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || document.status === selectedStatus;
    const matchesType = selectedType === 'All' || document.type === selectedType;
    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus && matchesType;
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
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select id="department" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                  {departments.map(department => <option key={department} value={department}>
                      {department === 'All' ? 'All Departments' : department}
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
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select id="type" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm rounded-md" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  {types.map(type => <option key={type} value={type}>
                      {type === 'All' ? 'All Types' : type}
                    </option>)}
                </select>
              </div>
              <div className="pt-4">
                <button onClick={() => {
              setSelectedCategory('All');
              setSelectedDepartment('All');
              setSelectedStatus('All');
              setSelectedType('All');
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
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] sm:text-sm" placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {filteredDocuments.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              No documents found matching your criteria.
            </p>
          </div> : <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredDocuments.map(document => <li key={document.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gray-100 rounded-md p-2">
                          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            {document.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {document.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${document.status === 'Active' ? 'bg-green-100 text-green-800' : document.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {document.status}
                        </p>
                        <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          v{document.version}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            {document.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            {document.category}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {document.department}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Updated on {document.lastUpdated}</p>
                        <div className="ml-4 flex space-x-2">
                          <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-[#FECC0E] hover:bg-[#e6b800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                            <Download className="h-4 w-4 text-gray-900" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>}
      </div>
    </div>;
};
export default DocumentLibrary;