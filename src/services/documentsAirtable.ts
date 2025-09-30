import axios from 'axios';
import { documentsData } from './mockDocumentsData';
// Airtable API configuration
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
// Airtable credentials
const AIRTABLE_TOKEN = 'pat9hokLugSCZf0QP.f3d490fe33ac9496b0483474907ef44e43ccb5ec9a9a19f65a2c59035743f0dc';
const BASE_ID = 'app1CKULVmCcpqd5i';
const DOCUMENTS_TABLE = 'Documents'; // You may need to change this to match your table name
// Flag to control whether to use mock data
const USE_MOCK_DATA = true; // Using mock data by default
// Cache configuration
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_ENABLED = true;
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
  console.log(`Using cached document data for: ${key}`);
  return item.data;
};
const setCachedData = <T,>(key: string, data: T, expiry: number = CACHE_EXPIRY): void => {
  if (!CACHE_ENABLED) return;
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry
  };
  console.log(`Cached document data for: ${key}`);
};
const clearCache = (): void => {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('Document cache cleared');
};
// Set up axios instance with auth headers
const airtableAPI = axios.create({
  baseURL: AIRTABLE_API_URL,
  timeout: 10000,
  // 10 second timeout
  headers: {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
// Add request/response interceptors for better error handling
airtableAPI.interceptors.request.use(config => {
  console.log('Making Airtable API request for documents:', config.url);
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});
airtableAPI.interceptors.response.use(response => {
  console.log('Airtable API response received successfully');
  return response;
}, error => {
  console.error('Airtable API error:', error.message);
  return Promise.reject(error);
});
// Interface for document data from Airtable
export interface AirtableDocument {
  id: string;
  fields: {
    title?: string;
    description?: string;
    category?: string;
    department?: string;
    lastUpdated?: string;
    version?: string;
    status?: string;
    type?: string;
    language?: string;
    documentLink?: string;
    createdBy?: string;
    approvedBy?: string;
    approvalDate?: string;
    effectiveDate?: string;
    nextReviewDate?: string;
    tags?: string[] | string;
    sections?: string; // JSON string
    relatedDocuments?: string[] | string; // IDs of related documents
    references?: string[];
    [key: string]: any; // Allow for additional fields
  };
}
// Interface for document sections
export interface DocumentSection {
  title: string;
  content: string;
}
// Transform Airtable record to our app's document format
export interface Document {
  id: number | string;
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
  tags: string[];
  sections?: DocumentSection[];
  relatedDocuments?: {
    id: number | string;
    title: string;
    type: string;
  }[];
  references?: string[];
  [key: string]: any;
}
// Helper function to parse array or string fields
const parseArrayField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    // Handle numbered lists
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
// Helper function to parse JSON string fields
const parseJsonField = (field: any): any => {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      console.warn('Error parsing JSON field:', field);
      return [];
    }
  }
  return field;
};
// Transform Airtable record to our document format
const transformAirtableRecord = (record: AirtableDocument): Document => {
  console.log('Transforming Airtable document record:', record);
  // Parse fields with error handling
  const tags = parseArrayField(record.fields.tags || []);
  const references = parseArrayField(record.fields.references || []);
  const sections = parseJsonField(record.fields.sections || '[]');
  // Parse related documents - these should be linked records in Airtable
  const relatedDocumentsIds = parseArrayField(record.fields.relatedDocuments || []);
  const relatedDocuments = relatedDocumentsIds.map(id => ({
    id,
    title: '',
    // This will be populated later when we have all documents
    type: ''
  }));
  // Create the document object
  const document: Document = {
    id: record.id,
    title: record.fields.title || '',
    description: record.fields.description || '',
    category: record.fields.category || '',
    department: record.fields.department || '',
    lastUpdated: record.fields.lastUpdated || '',
    version: record.fields.version || '',
    status: record.fields.status || '',
    type: record.fields.type || '',
    language: record.fields.language || 'English',
    // Default to English if not specified
    documentLink: record.fields.documentLink || '',
    createdBy: record.fields.createdBy || '',
    approvedBy: record.fields.approvedBy || '',
    approvalDate: record.fields.approvalDate || '',
    effectiveDate: record.fields.effectiveDate || '',
    nextReviewDate: record.fields.nextReviewDate || '',
    tags: tags,
    sections: sections,
    relatedDocuments: relatedDocuments,
    references: references
  };
  // Add any additional fields from Airtable
  Object.keys(record.fields).forEach(key => {
    if (!(key in document)) {
      document[key] = record.fields[key];
    }
  });
  return document;
};
// Get all documents from Airtable
export const getDocuments = async (): Promise<Document[]> => {
  const cacheKey = 'all_documents';
  const cachedDocuments = getCachedData<Document[]>(cacheKey);
  if (cachedDocuments) {
    return cachedDocuments;
  }
  // Try to use live data first
  if (!USE_MOCK_DATA) {
    try {
      console.log('Fetching documents from Airtable...');
      const response = await airtableAPI.get(`/${BASE_ID}/${DOCUMENTS_TABLE}`);
      console.log('Airtable response received with records:', response.data.records.length);
      // Transform Airtable records to our document format
      const documents = response.data.records.map(transformAirtableRecord);
      // Populate related documents with titles
      const documentsById = documents.reduce((acc, doc) => {
        acc[doc.id] = doc;
        return acc;
      }, {});
      documents.forEach(doc => {
        if (doc.relatedDocuments) {
          doc.relatedDocuments = doc.relatedDocuments.map(relDoc => {
            const fullDoc = documentsById[relDoc.id];
            return {
              id: relDoc.id,
              title: fullDoc ? fullDoc.title : 'Unknown Document',
              type: fullDoc ? fullDoc.type : ''
            };
          });
        }
      });
      // Cache the result
      setCachedData(cacheKey, documents);
      return documents;
    } catch (error: any) {
      console.error('Error fetching documents from Airtable:', error.message);
      console.log('Falling back to mock data');
    }
  }
  // If we get here, either USE_MOCK_DATA is true or the API call failed
  console.log('Using mock document data');
  return Object.values(documentsData);
};
// Get a single document by ID
export const getDocumentById = async (id: string | number): Promise<Document | null> => {
  const cacheKey = `document_${id}`;
  const cachedDocument = getCachedData<Document | null>(cacheKey);
  if (cachedDocument) {
    return cachedDocument;
  }
  // Try to use live data first
  if (!USE_MOCK_DATA) {
    try {
      console.log(`Fetching document with ID: ${id} from Airtable...`);
      const response = await airtableAPI.get(`/${BASE_ID}/${DOCUMENTS_TABLE}/${id}`);
      console.log('Airtable document response received');
      const document = transformAirtableRecord(response.data);
      // Fetch related documents
      if (document.relatedDocuments && document.relatedDocuments.length > 0) {
        const relatedDocsIds = document.relatedDocuments.map(doc => doc.id);
        const relatedDocsFilter = `OR(${relatedDocsIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;
        const relatedDocsResponse = await airtableAPI.get(`/${BASE_ID}/${DOCUMENTS_TABLE}?filterByFormula=${encodeURIComponent(relatedDocsFilter)}`);
        const relatedDocs = relatedDocsResponse.data.records.map(transformAirtableRecord);
        document.relatedDocuments = relatedDocs.map(doc => ({
          id: doc.id,
          title: doc.title,
          type: doc.type
        }));
      }
      // Cache the result
      setCachedData(cacheKey, document);
      return document;
    } catch (error: any) {
      console.error(`Error fetching document with ID ${id} from Airtable:`, error.message);
      console.log(`Falling back to mock data for ID: ${id}`);
    }
  }
  // If we get here, either USE_MOCK_DATA is true or the API call failed
  console.log(`Using mock data for document ID: ${id}`);
  return documentsData[id] || null;
};
// Get unique values for filters
export const getDocumentFilterOptions = async () => {
  const cacheKey = 'document_filter_options';
  const cachedOptions = getCachedData(cacheKey);
  if (cachedOptions) {
    return cachedOptions;
  }
  try {
    const documents = await getDocuments();
    const options = {
      categories: ['All', ...new Set(documents.map(doc => doc.category).filter(Boolean))],
      departments: ['All', ...new Set(documents.map(doc => doc.department).filter(Boolean))],
      statuses: ['All', ...new Set(documents.map(doc => doc.status).filter(Boolean))],
      types: ['All', ...new Set(documents.map(doc => doc.type).filter(Boolean))],
      languages: ['All', ...new Set(documents.map(doc => doc.language).filter(Boolean))]
    };
    // Cache the result
    setCachedData(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Error fetching document filter options:', error);
    return {
      categories: ['All'],
      departments: ['All'],
      statuses: ['All'],
      types: ['All'],
      languages: ['All']
    };
  }
};
// Export a function to clear the cache if needed
export const clearDocumentsCache = clearCache;
export default {
  getDocuments,
  getDocumentById,
  getDocumentFilterOptions,
  clearCache: clearDocumentsCache
};