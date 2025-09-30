import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, ArrowRight, FileText } from 'lucide-react';
import { documentsData } from '../services/mockDocumentsData';
// Define document types
interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  department: string;
  lastUpdated: string;
  version: string;
  status: string;
  type: string;
  language: string;
  documentLink?: string;
  createdBy?: string;
  approvedBy?: string;
  approvalDate?: string;
  effectiveDate?: string;
  nextReviewDate?: string;
  tags?: string[];
  sections?: {
    title: string;
    content: string;
  }[];
  relatedDocuments?: {
    id: number;
    title: string;
    type: string;
  }[];
  references?: string[];
}
const DocumentsMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [documents, setDocuments] = useState<Document[]>([]);
  // Extract unique categories, departments, statuses, types, and languages from documents
  const [categories, setCategories] = useState<string[]>(['All']);
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [statuses, setStatuses] = useState<string[]>(['All']);
  const [types, setTypes] = useState<string[]>(['All']);
  const [languages, setLanguages] = useState<string[]>(['All']);
  useEffect(() => {
    // Convert documentsData object to array
    const docsArray = Object.values(documentsData);
    setDocuments(docsArray);
    // Extract unique values for filters
    const allCategories = ['All', ...new Set(docsArray.map(doc => doc.category))];
    // Limit to 5 categories (plus "All")
    const mainCategories = ['All', 'Finance', 'Governance', 'Risk', 'Compliance', 'Operations'];
    const uniqueDepartments = ['All', ...new Set(docsArray.map(doc => doc.department))];
    const uniqueStatuses = ['All', ...new Set(docsArray.map(doc => doc.status))];
    const uniqueTypes = ['All', ...new Set(docsArray.map(doc => doc.type))];
    const uniqueLanguages = ['All', ...new Set(docsArray.map(doc => doc.language))];
    setCategories(mainCategories);
    setDepartments(uniqueDepartments);
    setStatuses(uniqueStatuses);
    setTypes(uniqueTypes);
    setLanguages(uniqueLanguages);
  }, []);
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchQuery.toLowerCase()) || document.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || document.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'All' || document.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || document.status === selectedStatus;
    const matchesType = selectedType === 'All' || document.type === selectedType;
    const matchesLanguage = selectedLanguage === 'All' || document.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus && matchesType && matchesLanguage;
  });
  return <div className="bg-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Policies & Procedures
          </h1>
          <p className="mt-2 text-gray-600">
            Access the complete library of SAIB's policies, procedures, and
            related documents.
          </p>
        </div>
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input type="text" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                setSelectedType('All');
                setSelectedLanguage('All');
                setSearchQuery('');
              }} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear
                </button>
              </div>
              {/* Document Type filter - moved to the top */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Document Type
                </h4>
                <div className="space-y-2">
                  {types.map(type => <div key={type} className="flex items-center">
                      <input id={`type-${type}`} name="type" type="radio" checked={selectedType === type} onChange={() => setSelectedType(type)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                        {type === 'All' ? 'All Types' : type}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Category filter - moved to second position */}
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
              {/* Owner filter (renamed from Department) */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Owner
                </h4>
                <div className="space-y-2">
                  {departments.map(department => <div key={department} className="flex items-center">
                      <input id={`department-${department}`} name="department" type="radio" checked={selectedDepartment === department} onChange={() => setSelectedDepartment(department)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`department-${department}`} className="ml-2 text-sm text-gray-700">
                        {department === 'All' ? 'All Owners' : department}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Status filter */}
              <div className="p-4 border-b border-gray-200">
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
              {/* Language filter */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Language
                </h4>
                <div className="space-y-2">
                  {languages.map(language => <div key={language} className="flex items-center">
                      <input id={`language-${language}`} name="language" type="radio" checked={selectedLanguage === language} onChange={() => setSelectedLanguage(language)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`language-${language}`} className="ml-2 text-sm text-gray-700">
                        {language === 'All' ? 'All Languages' : language}
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
                Showing {filteredDocuments.length} documents
              </p>
            </div>
            {filteredDocuments.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No documents found matching your criteria.
                </p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map(document => <Link to={`/document/${document.id}`} key={document.id} className="block h-full">
                    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group cursor-pointer">
                      {/* Yellow border on left side when hovered */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#FECC0E] transition-all duration-300"></div>
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500 text-sm">
                            v{document.version}
                          </div>
                        </div>
                        {/* Title: 18px font size, truncate to 2 lines */}
                        <h3 className="text-lg font-medium text-gray-900 mb-4 line-clamp-2 h-14">
                          {document.title}
                        </h3>
                        {/* Tags: similar to service cards, font size 12px, one line only */}
                        <div className="flex flex-wrap gap-2 mb-4 overflow-hidden h-7">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${document.status === 'Active' ? 'bg-green-100 text-green-800' : document.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {document.status}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {document.type}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {document.language}
                          </span>
                        </div>
                        {/* Description: 14px font size, truncate to 2 lines */}
                        <p className="text-sm text-gray-600 mb-8 flex-grow line-clamp-2">
                          {document.description}
                        </p>
                        {/* CTA: 14px font size, font weight 400 */}
                        <div className="mt-auto">
                          <span className="flex items-center text-[#9E800D] group-hover:text-[#FECC0E] text-sm font-normal transition-colors">
                            View details{' '}
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
export default DocumentsMarketplace;