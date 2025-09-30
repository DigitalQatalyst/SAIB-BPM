import axios from 'axios';
import { mockServices, getMockServiceById, getMockRelatedServices } from './mockData';

// Airtable API configuration
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const AIRTABLE_TOKEN = 'patV4B1iIsKhe0BKU.8602ca8fcd4515ea2025f9d093a6e66f531b278ff45e5ce9235a1f64beaccad6';

// You'll need to replace these with your actual base ID and table names
const BASE_ID = 'appjuApacwA1cyeyi'; // Replace with your actual base ID
const SERVICES_TABLE = 'Services'; // Replace with your actual table name

// Flag to control whether to use mock data - SET TO FALSE to use live data
const USE_MOCK_DATA = false; // Set to false to use live data from Airtable

// Cache configuration
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_ENABLED = true; // Enable caching

// Cache structure
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// In-memory cache
const cache: {
  [key: string]: CacheItem<any>;
} = {};

// Cache helper functions
const getCachedData = <T,>(key: string): T | null => {
  if (!CACHE_ENABLED) return null;
  const item = cache[key];
  if (!item) return null;
  const now = Date.now();
  if (now - item.timestamp > item.expiry) {
    // Cache expired
    delete cache[key];
    return null;
  }
  console.log(`Using cached data for: ${key}`);
  return item.data;
};
const setCachedData = <T,>(key: string, data: T, expiry: number = CACHE_EXPIRY): void => {
  if (!CACHE_ENABLED) return;
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry
  };
  console.log(`Cached data for: ${key}`);
};
const clearCache = (): void => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('Cache cleared');
};

// Set up axios instance with auth headers and timeout configuration
const airtableAPI = axios.create({
  baseURL: AIRTABLE_API_URL,
  timeout: 10000,
  // 10 second timeout
  headers: {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for better error handling
airtableAPI.interceptors.request.use(config => {
  console.log('Making Airtable API request:', config.url);
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
airtableAPI.interceptors.response.use(response => {
  console.log('Airtable API response received successfully');
  return response;
}, error => {
  console.error('Airtable API error:', error.message);
  if (error.code === 'ECONNABORTED') {
    console.error('Request timeout - falling back to mock data');
  }
  return Promise.reject(error);
});

// Interface for service data from Airtable
export interface AirtableService {
  id: string;
  fields: {
    title?: string;
    description?: string;
    overview?: string;
    longDescription?: string;
    category?: string;
    department?: string;
    priority?: string;
    complexity?: string;
    responseSLA?: number;
    resolutionSLA?: number;
    deliverySLA?: number;
    domain?: string;
    audience?: string[];
    tags?: string[];
    useCases?: string[] | string;
    processSteps?: string[] | string;
    escalationTiers?: any[] | string;
    requestors?: string;
    requiredInfo?: string;
    FAQs?: any[];
    [key: string]: any; // Allow for additional fields
  };
}

// Transform Airtable record to our app's service format
export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  department: string;
  priority: string;
  complexity: string;
  responseSLA: number;
  resolutionSLA: number;
  deliverySLA: number;
  domain: string;
  audience: string[];
  tags: string[];
  useCases: string[] | string;
  processSteps: string[] | string;
  escalationTiers: any[];
  requestors?: string;
  requiredInfo?: string;
  FAQs?: any[];
  [key: string]: any;
}

// Helper function to parse array or string fields
const parseArrayField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    // Handle numbered lists like "1. Item one\n2. Item two"
    if (/^\d+\.\s/.test(field)) {
      return field.split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(item => item);
    }
    // Handle comma-separated strings
    if (field.includes(',')) {
      return field.split(',').map(item => item.trim()).filter(item => item);
    }
    return [field];
  }
  return [];
};

// Helper function to parse JSON string fields - FIXED VERSION
const parseJsonField = (field: any): any[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      // First, try to parse it as regular JSON
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.warn('Error parsing JSON field, trying alternative parsing:', field);
      // Handle numbered lists (like your FAQ data)
      if (/^\d+\.\s/.test(field)) {
        return field.split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(item => item);
      }
      // If it's not valid JSON, try to handle it as a comma-separated string
      if (field.includes(',')) {
        return field.split(',').map(item => item.trim()).filter(item => item);
      }
      // If it's a single value that looks like it might be malformed JSON
      // Try to clean it up
      const cleanedField = field.replace(/^['"]|['"]$/g, '') // Remove surrounding quotes
      .trim();
      // If it's still not empty, return it as an array
      return cleanedField ? [cleanedField] : [];
    }
  }
  // For any other type, return as array
  return Array.isArray(field) ? field : [field];
};

// Transform Airtable record to our service format - ENHANCED VERSION
const transformAirtableRecord = (record: AirtableService): Service => {
  console.log('Transforming Airtable record:', record);

  // Parse fields with enhanced error handling - FIXED TAGS PARSING
  const audience = parseArrayField(record.fields.audience);
  const tags = parseArrayField(record.fields.tags || []); // Ensure tags is always an array
  const escalationTiers = parseJsonField(record.fields.escalationTiers);
  const faqs = parseJsonField(record.fields.FAQs);

  // Handle useCases and processSteps which might be arrays or strings
  const useCases = Array.isArray(record.fields.useCases) ? record.fields.useCases : typeof record.fields.useCases === 'string' ? parseArrayField(record.fields.useCases) : [];
  const processSteps = Array.isArray(record.fields.processSteps) ? record.fields.processSteps : typeof record.fields.processSteps === 'string' ? parseArrayField(record.fields.processSteps) : [];

  // Create the service object without spreading record.fields first
  const service: Service = {
    id: record.id,
    title: record.fields.title || '',
    description: record.fields.description || record.fields.overview || '',
    longDescription: record.fields.longDescription || record.fields.overview || record.fields.description || '',
    category: record.fields.category || '',
    department: record.fields.department || 'All',
    priority: record.fields.priority || 'Medium',
    complexity: record.fields.complexity || 'Low',
    responseSLA: record.fields.responseSLA || 48,
    resolutionSLA: record.fields.resolutionSLA || 14,
    deliverySLA: record.fields.deliverySLA || 14,
    domain: record.fields.domain || '',
    audience: audience,
    tags: tags,
    // This is now guaranteed to be an array
    useCases: useCases,
    processSteps: processSteps,
    escalationTiers: escalationTiers,
    requestors: record.fields.requestors || '',
    requiredInfo: record.fields.requiredInfo || '',
    FAQs: faqs
  };

  // Add any additional fields from Airtable
  Object.keys(record.fields).forEach(key => {
    if (!(key in service)) {
      service[key] = record.fields[key];
    }
  });
  return service;
};

// Get all services from Airtable with improved error handling and caching
export const getServices = async (): Promise<Service[]> => {
  const cacheKey = 'all_services';
  const cachedServices = getCachedData<Service[]>(cacheKey);
  if (cachedServices) {
    return cachedServices;
  }

  // Try to use live data first
  if (!USE_MOCK_DATA) {
    try {
      console.log('Fetching services from Airtable...');
      const response = await airtableAPI.get(`/${BASE_ID}/${SERVICES_TABLE}`);
      console.log('Airtable response received with records:', response.data.records.length);
      // Transform Airtable records to our service format
      const services = response.data.records.map(transformAirtableRecord);
      // Cache the result
      setCachedData(cacheKey, services);
      return services;
    } catch (error: any) {
      console.error('Error fetching services from Airtable:', error.message);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - using mock data');
      } else if (error.response?.status) {
        console.error(`API returned status ${error.response.status}`);
      }
      console.log('Falling back to mock data');
    }
  }

  // If we get here, either USE_MOCK_DATA is true or the API call failed
  console.log('Using mock service data');
  return mockServices;
};

// Get a single service by ID with improved error handling and caching
export const getServiceById = async (id: string): Promise<Service | null> => {
  const cacheKey = `service_${id}`;
  const cachedService = getCachedData<Service | null>(cacheKey);
  if (cachedService) {
    return cachedService;
  }

  // Try to use live data first
  if (!USE_MOCK_DATA) {
    try {
      console.log(`Fetching service with ID: ${id} from Airtable...`);
      const response = await airtableAPI.get(`/${BASE_ID}/${SERVICES_TABLE}/${id}`);
      console.log('Airtable service response received');
      const service = transformAirtableRecord(response.data);
      // Cache the result
      setCachedData(cacheKey, service);
      return service;
    } catch (error: any) {
      console.error(`Error fetching service with ID ${id} from Airtable:`, error.message);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - using mock data');
      } else if (error.response?.status) {
        console.error(`API returned status ${error.response.status}`);
      }
      console.log(`Falling back to mock data for ID: ${id}`);
    }
  }

  // If we get here, either USE_MOCK_DATA is true or the API call failed
  console.log(`Using mock data for service ID: ${id}`);
  return getMockServiceById(id);
};

// Get related services based on category with improved error handling and caching
export const getRelatedServices = async (currentServiceId: string, category: string, limit: number = 4): Promise<Service[]> => {
  const cacheKey = `related_${currentServiceId}_${category}_${limit}`;
  const cachedServices = getCachedData<Service[]>(cacheKey);
  if (cachedServices) {
    return cachedServices;
  }

  // Try to use live data first
  if (!USE_MOCK_DATA) {
    try {
      console.log(`Fetching related services for category: ${category}`);
      // Use a simpler filter formula to avoid 422 errors
      const filterByFormula = `AND({category} = "${category}", RECORD_ID() != "${currentServiceId}")`;
      const url = `/${BASE_ID}/${SERVICES_TABLE}?filterByFormula=${encodeURIComponent(filterByFormula)}&maxRecords=${limit}`;
      const response = await airtableAPI.get(url);
      console.log('Related services response received with records:', response.data.records.length);
      // Transform Airtable records to our service format
      const relatedServices = response.data.records.map(transformAirtableRecord);
      // Cache the result
      setCachedData(cacheKey, relatedServices);
      return relatedServices;
    } catch (error: any) {
      console.error('Error fetching related services:', error.message);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - using mock data');
      } else if (error.response?.status) {
        console.error(`API returned status ${error.response.status}`);
      }
      console.log(`Falling back to mock data for related services to ID: ${currentServiceId}`);
    }
  }

  // If we get here, either USE_MOCK_DATA is true or the API call failed
  console.log(`Using mock data for related services to ID: ${currentServiceId}`);
  return getMockRelatedServices(currentServiceId, category);
};

// Get unique values for filters with improved error handling and caching
export const getFilterOptions = async () => {
  const cacheKey = 'filter_options';
  const cachedOptions = getCachedData(cacheKey);
  if (cachedOptions) {
    return cachedOptions;
  }
  try {
    const services = await getServices();
    // Filter out undefined/null departments and ensure they're strings
    const departmentSet = new Set(services.map(service => service.department).filter(dept => dept !== undefined && dept !== null).map(dept => String(dept)));
    const options = {
      categories: ['All Categories', ...new Set(services.map(service => service.category))],
      departments: ['All',
      // Changed back to 'All' to match ServiceMarketplace
      ...departmentSet],
      priorities: ['All Priorities', ...new Set(services.map(service => service.priority))],
      complexities: ['All', ...new Set(services.map(service => service.complexity))]
    };
    // Cache the result
    setCachedData(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      categories: ['All Categories'],
      departments: ['All'],
      // Changed back to 'All'
      priorities: ['All Priorities'],
      complexities: ['All']
    };
  }
};

// Export a function to clear the cache if needed
export const clearAirtableCache = clearCache;
export default {
  getServices,
  getServiceById,
  getRelatedServices,
  getFilterOptions,
  clearCache: clearAirtableCache
};