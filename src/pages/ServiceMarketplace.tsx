import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/shared/ServiceCard';
import { getServices, getFilterOptions, Service } from '../services/airtable';
const ServiceMarketplace = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [categories, setCategories] = useState(['All Categories']);
  const itemsPerPage = 15; // Changed from 9 to 15 cards per page
  // Fetch services and filter options from Airtable
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch services
        const servicesData = await getServices();
        setServices(servicesData);
        // Fetch filter options
        const options = await getFilterOptions();
        setCategories(options.categories);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);
  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'A-Z') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'Newest') {
      // If you have a createdAt field, use that
      return 0; // Placeholder, replace with actual sorting logic
    }
    // Default to Most Popular (you might want to add a popularity field in Airtable)
    return 0;
  });
  // Pagination
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
  };
  return <div className="bg-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-2 text-gray-600">
            Explore structured services designed to streamline policy and
            procedure management.
          </p>
        </div>
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input type="text" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FECC0E]"></div>
          </div> : error ? <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-500">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#FECC0E] text-gray-900 rounded-md">
              Retry
            </button>
          </div> : <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Filters</h3>
                  <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                    Clear
                  </button>
                </div>
                {/* Service Category filter */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Service Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map(category => <div key={category} className="flex items-center">
                        <input id={`category-${category}`} name="category" type="radio" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} className="h-4 w-4 text-[#FECC0E] focus:ring-[#FECC0E] border-gray-300 accent-[#FECC0E]" />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
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
                  Showing {filteredServices.length} services
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Sort by:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-[#FECC0E] focus:border-[#FECC0E] px-3 py-1">
                    <option value="Most Popular">Most Popular</option>
                    <option value="Newest">Newest</option>
                    <option value="A-Z">A-Z</option>
                  </select>
                </div>
              </div>
              {/* Services grid */}
              {paginatedServices.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-lg">
                    No services found matching your criteria.
                  </p>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedServices.map(service => <ServiceCard key={service.id} id={service.id} title={service.title} description={service.description} category={service.category} tag={service.tags && service.tags.length > 0 ? service.tags[0] : 'Service'} link={`/service/${service.id}`} linkText="View Details" />)}
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
          </div>}
      </div>
    </div>;
};
export default ServiceMarketplace;