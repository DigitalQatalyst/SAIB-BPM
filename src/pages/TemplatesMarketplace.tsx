import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
const templates = [{
  id: 1,
  title: 'Policy Document Template',
  description: 'Standard template for creating bank policies with pre-defined sections and formatting.',
  category: 'Policy',
  department: 'All',
  lastUpdated: '2023-09-15',
  version: '3.2',
  status: 'Active',
  type: 'Template'
}, {
  id: 2,
  title: 'Procedure Document Template',
  description: 'Detailed template for documenting step-by-step procedures with process flows.',
  category: 'Procedure',
  department: 'All',
  lastUpdated: '2023-10-05',
  version: '2.1',
  status: 'Active',
  type: 'Template'
}, {
  id: 3,
  title: 'Regulatory Compliance Template',
  description: 'Template designed for creating documents that address specific SAMA regulatory requirements.',
  category: 'Compliance',
  department: 'Compliance',
  lastUpdated: '2023-08-22',
  version: '4.0',
  status: 'Active',
  type: 'Template'
}, {
  id: 4,
  title: 'Information Security Template',
  description: 'Specialized template for information security policies with cybersecurity framework sections.',
  category: 'IT',
  department: 'IT',
  lastUpdated: '2023-07-30',
  version: '2.5',
  status: 'Active',
  type: 'Template'
}, {
  id: 5,
  title: 'Risk Management Template',
  description: 'Template for risk assessment and management documentation with built-in risk matrices.',
  category: 'Risk',
  department: 'Risk',
  lastUpdated: '2023-09-18',
  version: '1.8',
  status: 'Active',
  type: 'Template'
}, {
  id: 6,
  title: 'HR Policy Template',
  description: 'Standardized template for human resources policies with employment law compliance sections.',
  category: 'HR',
  department: 'HR',
  lastUpdated: '2023-06-12',
  version: '2.3',
  status: 'Active',
  type: 'Template'
}];
const categories = ['All', 'Policy', 'Procedure', 'Compliance', 'IT', 'Risk', 'HR'];
const departments = ['All', 'Board', 'Compliance', 'HR', 'IT', 'Operations', 'Risk'];
const statuses = ['All', 'Active', 'Under Review', 'Archived'];
const TemplatesMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'All' || template.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || template.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus;
  });
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Document Templates
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Select a template to start creating a new document with AI DocWriter
          </p>
        </div>
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input type="text" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button onClick={() => {
                setSelectedCategory('All');
                setSelectedDepartment('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear
                </button>
              </div>
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {categories.map(category => <div key={category} className="flex items-center">
                      <input id={`category-${category}`} name="category" type="radio" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category === 'All' ? 'All Categories' : category}
                      </label>
                    </div>)}
                </div>
              </div>
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Department
                </h4>
                <div className="space-y-2">
                  {departments.map(department => <div key={department} className="flex items-center">
                      <input id={`department-${department}`} name="department" type="radio" checked={selectedDepartment === department} onChange={() => setSelectedDepartment(department)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`department-${department}`} className="ml-2 text-sm text-gray-700">
                        {department === 'All' ? 'All Departments' : department}
                      </label>
                    </div>)}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Status
                </h4>
                <div className="space-y-2">
                  {statuses.map(status => <div key={status} className="flex items-center">
                      <input id={`status-${status}`} name="status" type="radio" checked={selectedStatus === status} onChange={() => setSelectedStatus(status)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700">
                        {status === 'All' ? 'All Statuses' : status}
                      </label>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredTemplates.length} templates
              </p>
            </div>
            {filteredTemplates.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No templates found matching your criteria.
                </p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => <Link to={`/template/${template.id}`} key={template.id} className="block h-full">
                    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group cursor-pointer">
                      {/* Yellow border on left side when hovered */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#FECC0E] transition-all duration-300"></div>
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="text-gray-500 text-sm">
                            v{template.version}
                          </div>
                        </div>
                        {/* Title: 18px font size, truncate to 2 lines */}
                        <h3 className="text-lg font-medium text-gray-900 mb-4 line-clamp-2 h-14">
                          {template.title}
                        </h3>
                        {/* Tags: similar to service cards, font size 12px, one line only */}
                        <div className="flex flex-wrap gap-2 mb-4 overflow-hidden h-7">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium 
                              ${template.status === 'Active' ? 'bg-green-100 text-green-800' : template.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {template.status}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {template.category}
                          </span>
                        </div>
                        {/* Description: 14px font size, truncate to 2 lines */}
                        <p className="text-sm text-gray-600 mb-8 flex-grow line-clamp-2">
                          {template.description}
                        </p>
                        {/* CTA: 14px font size, font weight 400 */}
                        <div className="mt-auto">
                          <span className="flex items-center text-[#9E800D] group-hover:text-[#FECC0E] text-sm font-normal transition-colors">
                            Use this template{' '}
                            <ArrowRight size={16} className="ml-2" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default TemplatesMarketplace;