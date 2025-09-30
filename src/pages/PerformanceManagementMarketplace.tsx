import React, { useState } from 'react';
import { Search, ArrowUpDown, Bookmark, BookmarkCheck, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { performanceManagementTools } from '../data/performanceManagementData';
import { useComparison } from '../context/ComparisonContext';
import ComparisonPanel from '../components/comparison/ComparisonPanel';
import ComparisonModal from '../components/comparison/ComparisonModal';
// Filter options
const industries = ['All Industries', 'Banking', 'Finance'];
const useCases = ['All Use Cases', 'KPI Tracking', 'Document Approval', 'Benchmarking', 'Risk Mitigation', 'Bottleneck Analysis', 'Regulatory Compliance', 'Loan Processing', 'Customer Feedback', 'Version Control', 'Performance Optimization', 'Risk Assessment'];
const complexities = ['All Complexities', 'Low', 'Medium', 'High'];
const departments = ['All Departments', 'P&P'];
const integrations = ['All Integrations', 'Dynamics 365', 'SharePoint', 'Office 365', 'Snowflake', 'CRM', 'OneDrive', 'Teams'];
const features = ['All Features', 'Analytics', 'Efficiency', 'Heatmap', 'Strategy Alignment', 'Collaboration', 'Lifecycle Tracking', 'Training', 'Alerts'];
const aiPoweredOptions = ['All', 'Yes', 'No'];
const riskLevels = ['All Risk Levels', 'Low', 'Medium', 'High'];
const metrics = ['All Metrics', 'SLA Compliance', 'Task Completion', 'Risk Resolution', 'KPIs'];
const realTimeOptions = ['All', 'Yes', 'No'];
const sortOptions = ['Relevance', 'Newest', 'A-Z'];
const PerformanceManagementMarketplace = () => {
  const {
    t
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedUseCase, setSelectedUseCase] = useState('All Use Cases');
  const [selectedComplexity, setSelectedComplexity] = useState('All Complexities');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedIntegration, setSelectedIntegration] = useState('All Integrations');
  const [selectedFeature, setSelectedFeature] = useState('All Features');
  const [selectedAIPowered, setSelectedAIPowered] = useState('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All Risk Levels');
  const [selectedMetric, setSelectedMetric] = useState('All Metrics');
  const [selectedRealTime, setSelectedRealTime] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedTools, setSavedTools] = useState<number[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const {
    comparisonTools,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  } = useComparison();
  const itemsPerPage = 15;
  // Toggle save/unsave tool
  const toggleSaveTool = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedTools.includes(id)) {
      setSavedTools(savedTools.filter(toolId => toolId !== id));
    } else {
      setSavedTools([...savedTools, id]);
    }
  };
  // Handle comparison tool actions
  const handleAddToComparison = (tool: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToComparison(tool);
  };
  // Open comparison modal
  const openComparisonModal = () => {
    if (comparisonTools.length >= 2) {
      setIsComparisonModalOpen(true);
    }
  };
  // Filter the tools based on selected filters
  const filteredTools = performanceManagementTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || tool.industry === selectedIndustry;
    const matchesUseCase = selectedUseCase === 'All Use Cases' || tool.useCase === selectedUseCase;
    const matchesComplexity = selectedComplexity === 'All Complexities' || tool.complexity === selectedComplexity;
    const matchesDepartment = selectedDepartment === 'All Departments' || tool.department === selectedDepartment;
    const matchesIntegration = selectedIntegration === 'All Integrations' || tool.integration === selectedIntegration;
    const matchesFeature = selectedFeature === 'All Features' || tool.feature === selectedFeature;
    const matchesAIPowered = selectedAIPowered === 'All' || selectedAIPowered === 'Yes' && tool.aiPowered || selectedAIPowered === 'No' && !tool.aiPowered;
    const matchesRiskLevel = selectedRiskLevel === 'All Risk Levels' || tool.riskLevel === selectedRiskLevel;
    const matchesMetric = selectedMetric === 'All Metrics' || tool.metric === selectedMetric;
    const matchesRealTime = selectedRealTime === 'All' || selectedRealTime === 'Yes' && tool.realTime || selectedRealTime === 'No' && !tool.realTime;
    return matchesSearch && matchesIndustry && matchesUseCase && matchesComplexity && matchesDepartment && matchesIntegration && matchesFeature && matchesAIPowered && matchesRiskLevel && matchesMetric && matchesRealTime;
  });
  // Sort the filtered tools
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'A-Z') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'Newest') {
      return b.id - a.id; // Using ID as a proxy for "newest" in this mock data
    }
    return 0; // Default to relevance (no specific sorting)
  });
  // Pagination
  const totalPages = Math.ceil(sortedTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = sortedTools.slice(startIndex, startIndex + itemsPerPage);
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All Industries');
    setSelectedUseCase('All Use Cases');
    setSelectedComplexity('All Complexities');
    setSelectedDepartment('All Departments');
    setSelectedIntegration('All Integrations');
    setSelectedFeature('All Features');
    setSelectedAIPowered('All');
    setSelectedRiskLevel('All Risk Levels');
    setSelectedMetric('All Metrics');
    setSelectedRealTime('All');
  };
  // Helper function to get additional tags for each tool
  const getTagsForTool = (tool: any) => {
    const tags = [];
    // Add existing tags first
    if (tool.aiPowered) {
      tags.push({
        text: 'AI-Powered',
        className: 'text-green-700 bg-green-100'
      });
    }
    if (tool.industry) {
      tags.push({
        text: tool.industry,
        className: 'text-gray-500 bg-gray-100'
      });
    }
    if (tool.useCase) {
      tags.push({
        text: tool.useCase,
        className: 'text-gray-500 bg-gray-100'
      });
    }
    if (tool.complexity) {
      const complexityClass = tool.complexity === 'High' ? 'text-yellow-800 bg-yellow-100' : tool.complexity === 'Medium' ? 'text-blue-800 bg-blue-100' : 'text-green-800 bg-green-100';
      tags.push({
        text: tool.complexity,
        className: complexityClass
      });
    }
    if (tool.integration) {
      tags.push({
        text: tool.integration,
        className: 'text-purple-800 bg-purple-100'
      });
    }
    if (tool.feature) {
      tags.push({
        text: tool.feature,
        className: 'text-indigo-800 bg-indigo-100'
      });
    }
    if (tool.riskLevel) {
      const riskClass = tool.riskLevel === 'High' ? 'text-red-800 bg-red-100' : tool.riskLevel === 'Medium' ? 'text-orange-800 bg-orange-100' : 'text-green-800 bg-green-100';
      tags.push({
        text: tool.riskLevel + ' Risk',
        className: riskClass
      });
    }
    if (tool.metric) {
      tags.push({
        text: tool.metric,
        className: 'text-teal-800 bg-teal-100'
      });
    }
    if (tool.realTime) {
      tags.push({
        text: 'Real-Time',
        className: 'text-blue-700 bg-blue-100'
      });
    }
    if (tool.easeOfUse) {
      tags.push({
        text: tool.easeOfUse,
        className: 'text-gray-700 bg-gray-100'
      });
    }
    if (tool.difficulty) {
      tags.push({
        text: tool.difficulty + ' Level',
        className: 'text-gray-700 bg-gray-100'
      });
    }
    if (tool.format) {
      tags.push({
        text: tool.format + ' Format',
        className: 'text-gray-700 bg-gray-100'
      });
    }
    if (tool.department) {
      tags.push({
        text: tool.department + ' Dept',
        className: 'text-gray-700 bg-gray-100'
      });
    }
    // If we still don't have at least 3 tags, add some generic ones based on the tool type
    if (tags.length < 3) {
      if (tool.title.toLowerCase().includes('template')) {
        tags.push({
          text: 'Template',
          className: 'text-gray-700 bg-gray-100'
        });
      }
      if (tool.title.toLowerCase().includes('dashboard')) {
        tags.push({
          text: 'Dashboard',
          className: 'text-blue-700 bg-blue-100'
        });
      }
      if (tool.title.toLowerCase().includes('analyzer') || tool.title.toLowerCase().includes('analysis')) {
        tags.push({
          text: 'Analytics',
          className: 'text-indigo-700 bg-indigo-100'
        });
      }
      if (tool.description.toLowerCase().includes('performance')) {
        tags.push({
          text: 'Performance',
          className: 'text-green-700 bg-green-100'
        });
      }
      if (tool.description.toLowerCase().includes('optimization')) {
        tags.push({
          text: 'Optimization',
          className: 'text-teal-700 bg-teal-100'
        });
      }
      if (tool.description.toLowerCase().includes('efficiency')) {
        tags.push({
          text: 'Efficiency',
          className: 'text-green-700 bg-green-100'
        });
      }
      if (tags.length < 3) {
        tags.push({
          text: 'Performance Management',
          className: 'text-gray-700 bg-gray-100'
        });
      }
      if (tags.length < 3) {
        tags.push({
          text: 'Business Process',
          className: 'text-gray-700 bg-gray-100'
        });
      }
    }
    // Limit to 3 tags
    return tags.slice(0, 3);
  };
  return <div className="bg-white pb-16">
      {/* Comparison panel */}
      <ComparisonPanel selectedTools={comparisonTools} removeFromComparison={removeFromComparison} clearComparison={clearComparison} openComparisonModal={openComparisonModal} />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${comparisonTools.length > 0 ? 'pt-28' : ''}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track KPIs, measure success, and align operational performance with
            strategic goals to improve efficiency and accountability.
          </p>
        </div>
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input type="text" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Search performance management tools and templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear
                </button>
              </div>
              {/* Industry filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Industry
                </h4>
                <div className="space-y-2">
                  {industries.map(industry => <div key={industry} className="flex items-center">
                      <input id={`industry-${industry}`} name="industry" type="radio" checked={selectedIndustry === industry} onChange={() => setSelectedIndustry(industry)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`industry-${industry}`} className="ml-2 text-sm text-gray-700">
                        {industry}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Use Case filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Use Case
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {useCases.map(useCase => <div key={useCase} className="flex items-center">
                      <input id={`useCase-${useCase}`} name="useCase" type="radio" checked={selectedUseCase === useCase} onChange={() => setSelectedUseCase(useCase)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`useCase-${useCase}`} className="ml-2 text-sm text-gray-700">
                        {useCase}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Complexity filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Complexity
                </h4>
                <div className="space-y-2">
                  {complexities.map(complexity => <div key={complexity} className="flex items-center">
                      <input id={`complexity-${complexity}`} name="complexity" type="radio" checked={selectedComplexity === complexity} onChange={() => setSelectedComplexity(complexity)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`complexity-${complexity}`} className="ml-2 text-sm text-gray-700">
                        {complexity}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Department filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Department
                </h4>
                <div className="space-y-2">
                  {departments.map(department => <div key={department} className="flex items-center">
                      <input id={`department-${department}`} name="department" type="radio" checked={selectedDepartment === department} onChange={() => setSelectedDepartment(department)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`department-${department}`} className="ml-2 text-sm text-gray-700">
                        {department}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Integration filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Integration
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {integrations.map(integration => <div key={integration} className="flex items-center">
                      <input id={`integration-${integration}`} name="integration" type="radio" checked={selectedIntegration === integration} onChange={() => setSelectedIntegration(integration)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`integration-${integration}`} className="ml-2 text-sm text-gray-700">
                        {integration}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Feature filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Feature
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {features.map(feature => <div key={feature} className="flex items-center">
                      <input id={`feature-${feature}`} name="feature" type="radio" checked={selectedFeature === feature} onChange={() => setSelectedFeature(feature)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                        {feature}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Metric filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Metric
                </h4>
                <div className="space-y-2">
                  {metrics.map(metric => <div key={metric} className="flex items-center">
                      <input id={`metric-${metric}`} name="metric" type="radio" checked={selectedMetric === metric} onChange={() => setSelectedMetric(metric)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`metric-${metric}`} className="ml-2 text-sm text-gray-700">
                        {metric}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* AI-Powered filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  AI-Powered
                </h4>
                <div className="space-y-2">
                  {aiPoweredOptions.map(option => <div key={option} className="flex items-center">
                      <input id={`aiPowered-${option}`} name="aiPowered" type="radio" checked={selectedAIPowered === option} onChange={() => setSelectedAIPowered(option)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`aiPowered-${option}`} className="ml-2 text-sm text-gray-700">
                        {option}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Real-Time filter */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Real-Time
                </h4>
                <div className="space-y-2">
                  {realTimeOptions.map(option => <div key={option} className="flex items-center">
                      <input id={`realTime-${option}`} name="realTime" type="radio" checked={selectedRealTime === option} onChange={() => setSelectedRealTime(option)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`realTime-${option}`} className="ml-2 text-sm text-gray-700">
                        {option}
                      </label>
                    </div>)}
                </div>
              </div>
              {/* Risk Level filter */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Risk Level
                </h4>
                <div className="space-y-2">
                  {riskLevels.map(riskLevel => <div key={riskLevel} className="flex items-center">
                      <input id={`riskLevel-${riskLevel}`} name="riskLevel" type="radio" checked={selectedRiskLevel === riskLevel} onChange={() => setSelectedRiskLevel(riskLevel)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                      <label htmlFor={`riskLevel-${riskLevel}`} className="ml-2 text-sm text-gray-700">
                        {riskLevel}
                      </label>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredTools.length} tools and templates
              </p>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Sort by:</span>
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
            {/* Tools grid */}
            {paginatedTools.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No tools or templates found matching your criteria.
                </p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTools.map(tool => {
              const toolTags = getTagsForTool(tool);
              const isInCompare = isInComparison(tool.id);
              return <div key={tool.id} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group cursor-pointer">
                      {/* Yellow border on left side when hovered */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#FECC0E] transition-all duration-300"></div>
                      <Link to={`/performance-management/${tool.id}`} className="p-6 flex flex-col h-full">
                        {/* Title - truncate to 2 lines */}
                        <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2 h-12 overflow-hidden">
                          {tool.title}
                        </h3>
                        {/* Description - truncate to 3 lines */}
                        <p className="text-sm text-gray-500 mb-6 line-clamp-3 h-14 overflow-hidden">
                          {tool.description}
                        </p>
                        <div className="mt-auto">
                          {/* Tags - limit to 2 lines */}
                          <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden">
                            {toolTags.map((tag, index) => <span key={index} className={`text-xs ${tag.className} px-3 py-1 rounded-full`}>
                                {tag.text}
                              </span>)}
                          </div>
                          {/* Divider line */}
                          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button onClick={e => toggleSaveTool(tool.id, e)} className="text-gray-500 hover:text-[#FECC0E] transition-colors" aria-label={savedTools.includes(tool.id) ? 'Unsave' : 'Save'}>
                                {savedTools.includes(tool.id) ? <BookmarkCheck className="h-5 w-5 text-[#FECC0E]" /> : <Bookmark className="h-5 w-5" />}
                              </button>
                              <button onClick={e => handleAddToComparison(tool, e)} className={`transition-colors ${isInCompare ? 'text-[#FECC0E]' : 'text-gray-500 hover:text-[#FECC0E]'}`} aria-label="Compare">
                                <Scale className="h-5 w-5" />
                              </button>
                            </div>
                            <span className="text-sm font-normal text-[#9E800D] group-hover:text-[#FECC0E] transition-colors">
                              View details
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>;
            })}
              </div>}
            {/* Pagination */}
            {totalPages > 1 && <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-full border border-gray-300 text-gray-500 disabled:opacity-50">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${currentPage === i + 1 ? 'bg-[#FECC0E] text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}>
                      {i + 1}
                    </button>)}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-full border border-gray-300 text-gray-500 disabled:opacity-50">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
      {/* Comparison modal */}
      <ComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} selectedTools={comparisonTools} />
    </div>;
};
export default PerformanceManagementMarketplace;