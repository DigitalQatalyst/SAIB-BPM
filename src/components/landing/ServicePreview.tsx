import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../shared/ServiceCard';
import { getServices, Service } from '../../services/airtable';
import { useLanguage } from '../../context/LanguageContext';
const ServicePreview = () => {
  const {
    t
  } = useLanguage();
  const [activeTab, setActiveTab] = useState('Policy');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch services from Airtable
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);
  // Filter services based on active tab
  const getFilteredServices = () => {
    const categoryMap = {
      Policy: 'Policy Management',
      Procedure: 'Procedure Management',
      Form: 'Form Management'
    };
    const selectedCategory = categoryMap[activeTab as keyof typeof categoryMap] || activeTab;
    return services.filter(service => service.category === selectedCategory).slice(0, 4); // Limit to 4 cards
  };
  const filteredServices = getFilteredServices();
  return <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('featuredServices')}
            </h2>
            <p className="mt-2 text-gray-600">{t('browseServicesCatalog')}</p>
          </div>
          <Link to="/services" className="flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] transition-colors">
            {t('exploreMore')} <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="mb-8 mt-10">
          <div className="inline-flex space-x-4">
            {['Policy', 'Procedure', 'Form'].map(category => <button key={category} onClick={() => setActiveTab(category)} className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === category ? 'bg-white border border-[#FECC0E] text-gray-900' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {t(category.toLowerCase())}
              </button>)}
          </div>
        </div>
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FECC0E]"></div>
          </div> : error ? <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{error}</p>
          </div> : filteredServices.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('noServices')}</p>
          </div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredServices.map(service => <ServiceCard key={service.id} id={service.id} title={service.title} description={service.description} category={service.category} tag={service.tags && service.tags.length > 0 ? service.tags[0] : t('services')} link={`/service/${service.id}`} linkText="View Details" />)}
          </div>}
      </div>
    </div>;
};
export default ServicePreview;