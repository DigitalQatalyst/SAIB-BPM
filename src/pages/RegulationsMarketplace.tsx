import React, { useState } from 'react';
import { Search, Download, ExternalLink, Clock, Eye, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
const regulations = [{
  id: 1,
  title: 'SAMA Circular: New Guidelines for Digital Banking Services and Open Banking Implementation',
  description: 'The Saudi Central Bank (SAMA) has issued comprehensive guidelines for banks and financial institutions on implementing digital banking services and open banking APIs.',
  regulator: 'SAMA',
  category: 'Digital Banking',
  publicationDate: 'Jun 8, 2023',
  effectiveDate: '2023-07-01',
  impact: 'High',
  status: 'New',
  relatedPolicies: ['Digital Banking Policy', 'Customer Data Protection Policy'],
  tags: ['Digital Banking', 'Open Banking'],
  readTime: 6,
  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/SAMA.jpg"
}, {
  id: 2,
  title: 'CMA Updates Corporate Governance Framework for Listed Companies',
  description: 'The Capital Market Authority (CMA) has published updated requirements for financial reporting and disclosure for listed companies to enhance transparency.',
  regulator: 'CMA',
  category: 'Financial Reporting',
  publicationDate: 'May 15, 2023',
  effectiveDate: '2023-08-01',
  impact: 'Medium',
  status: 'Active',
  relatedPolicies: ['Financial Reporting Policy', 'Disclosure Policy'],
  tags: ['Governance', 'Reporting'],
  readTime: 5,
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/CMA.png"
}, {
  id: 3,
  title: 'Updated Anti-Money Laundering and Counter-Terrorism Financing Requirements',
  description: 'SAMA has released comprehensive updates to anti-money laundering regulations to align with FATF recommendations and global best practices.',
  regulator: 'SAMA',
  category: 'Compliance',
  publicationDate: 'Apr 20, 2023',
  effectiveDate: '2023-07-01',
  impact: 'High',
  status: 'Active',
  relatedPolicies: ['AML Policy', 'KYC Procedures', 'Risk Assessment Framework'],
  tags: ['AML', 'Compliance'],
  readTime: 8,
  image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/SAMA.jpg"
}, {
  id: 4,
  title: 'MOF Directive on Tax Reporting Requirements for Financial Institutions',
  description: 'The Ministry of Finance has issued new directives regarding tax reporting requirements for all financial institutions operating in Saudi Arabia.',
  regulator: 'MOF',
  category: 'Taxation',
  publicationDate: 'Jun 5, 2023',
  effectiveDate: '2023-09-01',
  impact: 'Medium',
  status: 'New',
  relatedPolicies: ['Tax Compliance Policy', 'Financial Reporting Policy'],
  tags: ['Taxation', 'Reporting'],
  readTime: 6,
  image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/MOF.jpg"
}, {
  id: 5,
  title: 'SAMA Cybersecurity Framework for Banking and Financial Institutions',
  description: 'SAMA has published a comprehensive cybersecurity framework to enhance the security posture of all banking and financial institutions.',
  regulator: 'SAMA',
  category: 'IT Security',
  publicationDate: 'May 12, 2023',
  effectiveDate: '2023-11-12',
  impact: 'High',
  status: 'Draft',
  relatedPolicies: ['Information Security Policy', 'Cyber Incident Response Plan', 'IT Risk Management Policy'],
  tags: ['Cybersecurity', 'IT'],
  readTime: 7,
  image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/SAMA.jpg"
}, {
  id: 6,
  title: 'CMA Circular on Corporate Governance Requirements for Listed Companies',
  description: 'The CMA has updated the corporate governance framework for listed companies to enhance transparency and shareholder protection.',
  regulator: 'CMA',
  category: 'Governance',
  publicationDate: 'Jun 18, 2023',
  effectiveDate: '2023-09-01',
  impact: 'Medium',
  status: 'Active',
  relatedPolicies: ['Corporate Governance Policy', 'Board Charter', 'Conflict of Interest Policy'],
  tags: ['Governance', 'Compliance'],
  readTime: 5,
  image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/CMA.png"
}, {
  id: 7,
  title: 'SAMA Guidelines on Digital Currencies and Blockchain-Based Financial Services',
  description: 'New guidelines for financial institutions regarding the handling of digital currencies and blockchain-based financial services.',
  regulator: 'SAMA',
  category: 'Digital Banking',
  publicationDate: 'Jun 10, 2023',
  effectiveDate: '2023-10-01',
  impact: 'High',
  status: 'New',
  relatedPolicies: ['Digital Currency Policy', 'Blockchain Framework'],
  tags: ['Digital Banking', 'Blockchain'],
  readTime: 6,
  image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/SAMA.jpg"
}, {
  id: 8,
  title: 'SAMA Guidelines on Basel IV Capital Requirements Implementation',
  description: 'SAMA has issued detailed guidelines for the implementation of Basel IV capital requirements for all banks operating in the Kingdom.',
  regulator: 'SAMA',
  category: 'Banking',
  publicationDate: 'May 25, 2023',
  effectiveDate: '2024-01-01',
  impact: 'High',
  status: 'Active',
  relatedPolicies: ['Capital Adequacy Policy', 'Risk Management Framework'],
  tags: ['Basel IV', 'Capital'],
  readTime: 9,
  image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/SAMA.jpg"
}, {
  id: 9,
  title: 'CMA ESG Reporting Requirements for Listed Companies',
  description: 'The CMA has introduced new ESG reporting requirements for listed companies to promote sustainable business practices and transparency.',
  regulator: 'CMA',
  category: 'Financial Reporting',
  publicationDate: 'Jun 1, 2023',
  effectiveDate: '2024-03-01',
  impact: 'Medium',
  status: 'Draft',
  relatedPolicies: ['Sustainability Policy', 'Corporate Social Responsibility'],
  tags: ['ESG', 'Reporting'],
  readTime: 6,
  image: 'https://images.unsplash.com/photo-1580227974546-fbd48825d991?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  logo: "/CMA.png"
}];
const categories = ['All Content', 'Digital Banking', 'Financial Reporting', 'Taxation', 'IT Security', 'Trending'];
const regulators = ['All Regulators', 'SAMA', 'CMA', 'MOF'];
const sortOptions = ['Relevance', 'Newest', 'Oldest', 'Most Read'];
const RegulationsMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Content');
  const [selectedRegulator, setSelectedRegulator] = useState('All Regulators');
  const [sortBy, setSortBy] = useState('Relevance');
  const [currentPage, setCurrentPage] = useState(1);
  // URL for all regulation cards
  const regulationLink = 'https://rulebook.sama.gov.sa/en/new-banking-products-and-services-regulation';
  const filteredRegulations = regulations.filter(regulation => {
    const matchesSearch = regulation.title.toLowerCase().includes(searchQuery.toLowerCase()) || regulation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Content' || regulation.category === activeCategory;
    const matchesRegulator = selectedRegulator === 'All Regulators' || regulation.regulator === selectedRegulator;
    return matchesSearch && matchesCategory && matchesRegulator;
  });
  return <div className="w-full">
      <div className="bg-[#FFF8E1]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Valuable Regulatory Insights
            </h1>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Explore a curated collection of regulatory circulars and
              guidelines designed to help financial institutions stay compliant.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input type="text" className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Search topics, circulars and regulators..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mb-8 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Category tabs - updated to match landing page style */}
              <div className="flex-grow overflow-x-auto">
                <div className="inline-flex space-x-4 pb-2">
                  {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === category ? 'bg-white border border-[#FECC0E] text-gray-900' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-[#FECC0E]/70 hover:shadow-sm'}`}>
                      {category}
                    </button>)}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <select value={selectedRegulator} onChange={e => setSelectedRegulator(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                  {regulators.map(regulator => <option key={regulator} value={regulator}>
                      {regulator}
                    </option>)}
                </select>
                <div className="relative flex items-center">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]">
                    {sortOptions.map(option => <option key={option} value={option}>
                        {option}
                      </option>)}
                  </select>
                  <ArrowUpDown className="absolute left-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredRegulations.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No regulations found matching your criteria.
                </p>
              </div> : <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRegulations.map(regulation => <a href={regulationLink} target="_blank" rel="noopener noreferrer" key={regulation.id} className="block h-full">
                      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md hover:border-[#FECC0E] transition-all duration-300 h-full group cursor-pointer">
                        <div className="relative h-48 overflow-hidden">
                          <img src={regulation.image} alt={regulation.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {regulation.tags.slice(0, 2).map((tag, index) => <span key={index} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {tag}
                              </span>)}
                            <div className="ml-auto flex items-center text-xs text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{regulation.readTime} min read</span>
                            </div>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-2.5 line-clamp-2">
                            {regulation.title}
                          </h3>
                          <p className="text-sm font-normal text-gray-600 mb-6 line-clamp-2">
                            {regulation.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                <img src={regulation.logo} alt={regulation.regulator} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {regulation.regulator}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {regulation.publicationDate}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-normal text-[#9E800D] group-hover:text-[#FECC0E] transition-colors">
                                Read more
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>)}
                </div>
                <div className="flex justify-center mt-12">
                  <nav className="inline-flex rounded-md shadow">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-[#FECC0E] text-sm font-medium text-gray-900">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      4
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default RegulationsMarketplace;