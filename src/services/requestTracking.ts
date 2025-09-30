import { v4 as uuidv4 } from 'uuid';
// Types for request tracking
export interface RequestItem {
  id: number;
  ticketNumber: string;
  dateCreated: string;
  requestType: string;
  requestDetail: string;
  serviceName: string;
  serviceCategory: string;
  slaTargetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Approved' | 'Completed' | 'Rejected';
  latestNote: string;
  requester?: string;
  requesterEmail?: string;
  department?: string;
  assignedTo?: string;
  fullDescription?: string;
}
// Get all requests from localStorage
export const getRequests = (): RequestItem[] => {
  try {
    const requests = localStorage.getItem('serviceRequests');
    return requests ? JSON.parse(requests) : [];
  } catch (error) {
    console.error('Error retrieving requests from localStorage:', error);
    return [];
  }
};
// Add a new request
export const addRequest = (request: Omit<RequestItem, 'id' | 'ticketNumber' | 'dateCreated' | 'slaTargetDate' | 'status'>): RequestItem => {
  try {
    const requests = getRequests();
    // Generate a unique ID
    const id = requests.length > 0 ? Math.max(...requests.map(req => req.id)) + 1 : 1;
    // Generate ticket number (REQ-YYYY-XXX format)
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(3, '0');
    const ticketNumber = `REQ-${year}-${paddedId}`;
    // Create current date string
    const dateCreated = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    // Calculate SLA target date based on priority
    const targetDate = new Date();
    switch (request.priority) {
      case 'High':
        targetDate.setDate(targetDate.getDate() + 3);
        break;
      case 'Medium':
        targetDate.setDate(targetDate.getDate() + 7);
        break;
      case 'Low':
        targetDate.setDate(targetDate.getDate() + 10);
        break;
      default:
        targetDate.setDate(targetDate.getDate() + 7);
    }
    const slaTargetDate = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    // Create the new request object
    const newRequest: RequestItem = {
      id,
      ticketNumber,
      dateCreated,
      slaTargetDate,
      status: 'Pending',
      ...request
    };
    // Save to localStorage
    localStorage.setItem('serviceRequests', JSON.stringify([...requests, newRequest]));
    return newRequest;
  } catch (error) {
    console.error('Error adding request to localStorage:', error);
    throw error;
  }
};
// Get a request by ID
export const getRequestById = (id: number): RequestItem | undefined => {
  const requests = getRequests();
  return requests.find(request => request.id === id);
};
// Update a request
export const updateRequest = (id: number, updates: Partial<RequestItem>): RequestItem | undefined => {
  try {
    const requests = getRequests();
    const index = requests.findIndex(request => request.id === id);
    if (index === -1) return undefined;
    const updatedRequest = {
      ...requests[index],
      ...updates
    };
    requests[index] = updatedRequest;
    localStorage.setItem('serviceRequests', JSON.stringify(requests));
    return updatedRequest;
  } catch (error) {
    console.error('Error updating request in localStorage:', error);
    throw error;
  }
};
// Delete a request
export const deleteRequest = (id: number): boolean => {
  try {
    const requests = getRequests();
    const filteredRequests = requests.filter(request => request.id !== id);
    if (filteredRequests.length === requests.length) return false;
    localStorage.setItem('serviceRequests', JSON.stringify(filteredRequests));
    return true;
  } catch (error) {
    console.error('Error deleting request from localStorage:', error);
    throw error;
  }
};
// Get dashboard stats
export const getDashboardStats = () => {
  const requests = getRequests();
  const totalRequests = requests.length;
  const activeRequests = requests.filter(req => req.status === 'Pending' || req.status === 'In Progress').length;
  const completedRequests = requests.filter(req => req.status === 'Completed').length;
  // Calculate average days to close for completed requests
  let avgDaysToClose = 0;
  const completedReqs = requests.filter(req => req.status === 'Completed');
  if (completedReqs.length > 0) {
    const totalDays = completedReqs.reduce((sum, req) => {
      const createDate = new Date(req.dateCreated);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    avgDaysToClose = parseFloat((totalDays / completedReqs.length).toFixed(1));
  }
  return {
    totalRequests,
    activeRequests,
    completedRequests,
    avgDaysToClose
  };
};