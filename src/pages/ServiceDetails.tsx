import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Users, Calendar, FileBarChart, ChevronDown, ChevronUp, Bell, UserPlus, ExternalLink } from 'lucide-react';
import ServiceCard from '../components/shared/ServiceCard';
import { getServiceById, getRelatedServices, Service } from '../services/airtable';
const ServiceDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedFaqs, setExpandedFaqs] = useState([0]);
  const [expandedSections, setExpandedSections] = useState([0]); // Track expanded description sections
  // Fetch service details and related services from Airtable
  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id) {
        setError('No service ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log(`Fetching service with ID: ${id}`);
        // Fetch main service details
        const serviceData = await getServiceById(id);
        console.log('Service data received:', serviceData);
        if (serviceData) {
          setService(serviceData);
          // Fetch related services based on category
          console.log(`Fetching related services for category: ${serviceData.category}`);
          const related = await getRelatedServices(id, serviceData.category);
          console.log('Related services received:', related);
          setRelatedServices(related);
        } else {
          console.error('Service not found for ID:', id);
          setError('Service not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again later.');
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [id]);
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };
  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };
  if (loading) {
    return <div className="bg-gray-50 min-h-screen pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FECC0E]"></div>
      </div>;
  }
  if (error || !service) {
    return <div className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link to="/services" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to services
          </Link>
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-500">{error || 'Service not found'}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#FECC0E] text-gray-900 rounded-md">
              Retry
            </button>
          </div>
        </div>
      </div>;
  }
  // Prepare service data for display
  const processSteps = service.processSteps ? Array.isArray(service.processSteps) ? service.processSteps : [service.processSteps] : ['Initial request submission', 'Review and processing', 'Completion and delivery'];
  const useCases = service.useCases ? Array.isArray(service.useCases) ? service.useCases : [service.useCases] : ['Standard use case'];
  const escalationTiers = service.escalationTiers ? Array.isArray(service.escalationTiers) ? service.escalationTiers : [] : [{
    tier: 'Tier 1',
    role: 'Service Lead',
    timeframe: '24 hours'
  }, {
    tier: 'Tier 2',
    role: 'Department Head',
    timeframe: '48 hours'
  }];
  // Extract FAQs or use defaults
  const faqs = service.FAQs && Array.isArray(service.FAQs) && service.FAQs.length > 0 ? service.FAQs : [{
    question: 'Who can request this service?',
    answer: service.requestors || 'This service can be requested by authorized department personnel, managers, and team leads.'
  }, {
    question: 'What information is needed to submit a request?',
    answer: service.requiredInfo || "You'll need to provide business justification, affected departments, and other relevant details specific to your request."
  }, {
    question: 'How long does the entire process take?',
    answer: `The typical timeline for this service is ${service.resolutionSLA || 7}-${service.deliverySLA || 10} business days, but this can vary based on complexity, stakeholder availability, and approval requirements.`
  }];
  // Determine which form to use based on service category
  const getRequestFormLink = () => {
    if (service.category === 'Policy Management' || service.title.toLowerCase().includes('policy') || service.category.includes('Policy')) {
      return `/service/${id}/policy-request`;
    } else {
      return `/service/${id}/request`;
    }
  };
  return <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back button */}
        <Link to="/services" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to services
        </Link>
        {/* Service banner */}
        <div className="bg-gradient-to-r from-[#FFEDA8] to-[#F4F1E3] rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-white p-4 rounded-full shadow-sm mr-6 mb-4 md:mb-0">
              <FileText size={32} className="text-[#FECC0E]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {service.title}
              </h1>
              <p className="mt-2 text-gray-700">{service.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                  {service.category}
                </span>
                {service.tags && service.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                      {tag}
                    </span>)}
              </div>
            </div>
          </div>
          {/* Service stats and CTA in same row */}
          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <div className="flex items-center">
                <FileBarChart className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">Category:</span>
                <span className="text-sm font-medium text-gray-900">
                  {service.category}
                </span>
              </div>
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">
                  Priority Level:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {service.priority}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">
                  Avg. Completion:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {service.deliverySLA} days
                </span>
              </div>
            </div>
            {/* CTA Button */}
            <div className="mt-4 md:mt-0">
              <Link to={getRequestFormLink()} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm inline-flex items-center">
                Request This Service
                <UserPlus size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Description
            </button>
            <button onClick={() => setActiveTab('process')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'process' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Process Steps
            </button>
            <button onClick={() => setActiveTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faq' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              FAQ
            </button>
          </nav>
        </div>
        {/* Tab content */}
        <div className="mt-8">
          {activeTab === 'description' && <div className="space-y-4">
              {/* Overview Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(0)}>
                  <h2 className="text-lg font-medium text-gray-900">
                    Overview
                  </h2>
                  <button className="text-gray-400 hover:text-gray-500">
                    {expandedSections.includes(0) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                {expandedSections.includes(0) && <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      {service.longDescription || service.description}
                    </p>
                  </div>}
              </div>
              {/* Use Cases Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(1)}>
                  <h2 className="text-lg font-medium text-gray-900">
                    Use Cases
                  </h2>
                  <button className="text-gray-400 hover:text-gray-500">
                    {expandedSections.includes(1) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                {expandedSections.includes(1) && <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {useCases.map((useCase, index) => <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-3">
                            <span className="h-2 w-2 rounded-full bg-[#FECC0E]"></span>
                          </div>
                          <span className="text-gray-600">{useCase}</span>
                        </li>)}
                    </ul>
                  </div>}
              </div>
              {/* Service Level Agreements Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(2)}>
                  <h2 className="text-lg font-medium text-gray-900">
                    Service Level Agreements
                  </h2>
                  <button className="text-gray-400 hover:text-gray-500">
                    {expandedSections.includes(2) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                {expandedSections.includes(2) && <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Initial Communication Time
                          </h3>
                          <div className="flex items-center">
                            <Bell className="h-5 w-5 text-[#FECC0E] mr-2" />
                            <span className="text-lg font-medium">
                              {service.initialCommunicationSLA || service.responseSLA || 8}{' '}
                              hours
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Response Time
                          </h3>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-[#FECC0E] mr-2" />
                            <span className="text-lg font-medium">
                              {service.responseSLA || 24} hours
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Resolution Time
                          </h3>
                          <div className="flex items-center">
                            <FileBarChart className="h-5 w-5 text-[#FECC0E] mr-2" />
                            <span className="text-lg font-medium">
                              {service.resolutionSLA || 7} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>
              {/* Escalation Tiers Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(3)}>
                  <h2 className="text-lg font-medium text-gray-900">
                    Escalation Tiers
                  </h2>
                  <button className="text-gray-400 hover:text-gray-500">
                    {expandedSections.includes(3) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                {expandedSections.includes(3) && <div className="px-4 pb-4">
                    <div className="bg-white rounded-lg p-6">
                      <div className="space-y-4">
                        {escalationTiers.map((tier, index) => <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#FECC0E] flex items-center justify-center mt-0.5 mr-3 text-white text-xs font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {tier.tier}: {tier.role}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Escalation timeframe: {tier.timeframe}
                              </p>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>}
              </div>
            </div>}
          {activeTab === 'process' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Process Steps
              </h2>
              <div className="relative">
                {processSteps.map((step, index) => <div key={index} className="flex mb-8 relative">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="h-8 w-8 rounded-full bg-[#FECC0E] flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      {index < processSteps.length - 1 && <div className="h-full w-0.5 bg-gray-200 mt-2"></div>}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-700 font-medium">{step}</p>
                    </div>
                  </div>)}
              </div>
            </div>}
          {activeTab === 'faq' && <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden" onClick={() => toggleFaq(index)}>
                    <div className="p-4 cursor-pointer flex justify-between items-center">
                      <h3 className="text-base font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      <button className="text-gray-400 hover:text-gray-500">
                        {expandedFaqs.includes(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    {expandedFaqs.includes(index) && <div className="px-4 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>}
                  </div>)}
              </div>
            </div>}
        </div>
        {/* Related services */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Related Services
          </h2>
          {relatedServices.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map(relatedService => <ServiceCard key={relatedService.id} id={relatedService.id} title={relatedService.title} description={relatedService.description} category={relatedService.category} tag={relatedService.tags && relatedService.tags.length > 0 ? relatedService.tags[0] : 'Service'} link={`/service/${relatedService.id}`} linkText="View Service" />)}
            </div> : <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No related services found.</p>
            </div>}
        </div>
      </div>
    </div>;
};
export default ServiceDetails;