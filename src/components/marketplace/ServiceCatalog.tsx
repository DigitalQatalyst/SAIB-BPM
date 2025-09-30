import React, { useState } from 'react';
import { Search, Filter, ArrowRight, ChevronDown } from 'lucide-react';
import Button from '../shared/Button';
import ServiceCard from '../shared/ServiceCard';
const services = [{
  id: '1',
  title: 'Delegation Request',
  description: 'Request temporary delegation of authority or responsibilities to another employee during absence or for specific projects.',
  category: 'Authorization',
  department: 'All',
  priority: 'Medium',
  complexity: 'Low'
}, {
  id: '2',
  title: 'Authorization Request',
  description: 'Request new authorization or permissions for specific business activities that require formal approval from the P&P team.',
  category: 'Authorization',
  department: 'All',
  priority: 'High',
  complexity: 'Medium'
}, {
  id: '3',
  title: 'Policy Update',
  description: 'Request changes or updates to existing policies and procedures to reflect new business requirements or regulatory changes.',
  category: 'Documentation',
  department: 'All',
  priority: 'Medium',
  complexity: 'Medium'
}, {
  id: '4',
  title: 'Regulatory Compliance',
  description: 'Request assistance with implementing new regulatory requirements from SAMA, CMA, or other regulatory bodies into existing policies.',
  category: 'Compliance',
  department: 'Compliance',
  priority: 'High',
  complexity: 'High'
}, {
  id: '5',
  title: 'New Policy Creation',
  description: 'Request development of a new policy or procedure document for your department to formalize processes and controls.',
  category: 'Documentation',
  department: 'All',
  priority: 'Medium',
  complexity: 'High'
}, {
  id: '6',
  title: 'Compliance Assessment',
  description: "Request a comprehensive assessment of your department's compliance with internal policies and external regulatory requirements.",
  category: 'Compliance',
  department: 'Compliance',
  priority: 'Medium',
  complexity: 'High'
}];
const categories = ['All', 'Authorization', 'Documentation', 'Compliance'];
const departments = ['All', 'Compliance', 'Finance', 'HR', 'IT', 'Operations', 'Risk'];
const priorities = ['All', 'Low', 'Medium', 'High'];
const complexities = ['All', 'Low', 'Medium', 'High'];
const ServiceCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'All' || service.department === selectedDepartment;
    const matchesPriority = selectedPriority === 'All' || service.priority === selectedPriority;
    const matchesComplexity = selectedComplexity === 'All' || service.complexity === selectedComplexity;
    return matchesSearch && matchesCategory && matchesDepartment && matchesPriority && matchesComplexity;
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
                <select id="category" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring[#FECC0E] focus:border[#FECC0E] sm:text-sm rounded-md" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  {categories.map(category => <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select id="department" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring[#FECC0E] focus:border[#FECC0E] sm:text-sm rounded-md" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                  {departments.map(department => <option key={department} value={department}>
                      {department === 'All' ? 'All Departments' : department}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select id="priority" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring[#FECC0E] focus:border[#FECC0E] sm:text-sm rounded-md" value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)}>
                  {priorities.map(priority => <option key={priority} value={priority}>
                      {priority === 'All' ? 'All Priorities' : priority}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Complexity
                </label>
                <select id="complexity" className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring[#FECC0E] focus:border[#FECC0E] sm:text-sm rounded-md" value={selectedComplexity} onChange={e => setSelectedComplexity(e.target.value)}>
                  {complexities.map(complexity => <option key={complexity} value={complexity}>
                      {complexity === 'All' ? 'All Complexity Levels' : complexity}
                    </option>)}
                </select>
              </div>
              <div className="pt-4">
                <button onClick={() => {
              setSelectedCategory('All');
              setSelectedDepartment('All');
              setSelectedPriority('All');
              setSelectedComplexity('All');
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
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring[#FECC0E] focus:border[#FECC0E] sm:text-sm" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {filteredServices.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              No services found matching your criteria.
            </p>
          </div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map(service => <ServiceCard key={service.id} id={service.id} title={service.title} description={service.description} category={service.category} tag={service.priority === 'High' ? 'High Priority' : 'Amendment'} link={`/service/${service.id}`} linkText="View Details" />)}
          </div>}
      </div>
    </div>;
};
export default ServiceCatalog;