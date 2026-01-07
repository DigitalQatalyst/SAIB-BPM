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
  documentId?: string; // Link to generated document
  approvalStatus?: 'Not Started' | 'In Review' | 'Changes Requested' | 'Approved';
  approverComments?: Array<{
    approver: string;
    comment: string;
    date: string;
  }>;

  attachments?: Array<{
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    date: string;
    url?: string; // Optional URL for download link
    icon?: string; // Optional icon path
  }>;
}
// Notification tracking interface
export interface RequestNotification {
  requestId: number;
  viewedBy: string[]; // Array of usernames who have viewed this request
  createdAt: string;
}

// P&P Team notification interface for approval decisions
export interface PPTeamNotification {
  id: string;
  requestId: number;
  ticketNumber: string;
  requestDetail: string;
  type: 'approval' | 'rejection';
  createdAt: string;
  readBy: string[]; // P&P team members who have read this notification
}

// Storage key
const STORAGE_KEY = 'serviceRequests';
// Storage key for documents
const DOCUMENTS_STORAGE_KEY = 'generatedDocuments';
// Storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = 'requestNotifications';
// Storage key for P&P team notifications
const PP_TEAM_NOTIFICATIONS_KEY = 'ppTeamNotifications';

// Force clear storage for development - this will clear old data and load correct attribution
localStorage.clear(); // Clear everything
console.log('All localStorage cleared - correct attribution (Salem Doe) will be loaded');

// Function to update existing requests with proper URLs
const updateExistingRequestsWithUrls = () => {
  const requests = getRequests();
  const updatedRequests = requests.map(request => {
    if (request.attachments) {
      const updatedAttachments = request.attachments.map(attachment => {
        if (attachment.name === 'Business Processes and Procedures Manual' && !attachment.url) {
          return { ...attachment, url: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/IQCaS8I5BF47Q59FDrXYiCHuATohzQcv1iPOgu4hjC8MXmA?e=LUqwkz' };
        }
        if (attachment.name === 'SAMA_EN_10831_VER1' && !attachment.url) {
          return { ...attachment, url: 'https://arqitek.sharepoint.com/:b:/s/DELSAIBBPM4.0/IQDj2HBSKMCcRKYd85fAaSA4AVMHoNQzt-ZIkziCvmTR8Jo?e=ijFWr5' };
        }
        return attachment;
      });
      return { ...request, attachments: updatedAttachments };
    }
    return request;
  });

  if (updatedRequests.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
    console.log('Updated existing requests with URLs');
  }
};
// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Create document IDs for the mock completed requests
    const treasuryOpDocId = uuidv4();
    const interbankDocId = uuidv4();
    // Initialize with mock documents
    const mockDocuments = [{
      id: treasuryOpDocId,
      requestId: 3,
      title: 'Treasury Operations Manual',
      content: `# Treasury Operations Manual
## 1. Introduction
This manual outlines the procedures and guidelines for treasury operations at SAIB.
## 2. FX Transaction Limits
### 2.1 Transaction Authority
- Level 1: Up to SAR 100,000
- Level 2: Up to SAR 250,000
- Level 3: Up to SAR 500,000
- Level 4: Above SAR 500,000 (requires dual approval)
### 2.2 Daily Limits
- Intraday position limit: SAR 5,000,000
- Overnight position limit: SAR 2,500,000
## 3. Money Market Placements
### 3.1 Authorized Counterparties
- Only counterparties on the approved list may be used
- Counterparty limits must be adhered to at all times
### 3.2 Placement Procedures
- All placements must be documented in the treasury system
- Confirmation must be obtained within 24 hours
- Settlement instructions must be verified before transaction
## 4. Risk Management
### 4.1 Market Risk
- Daily position reports must be generated and reviewed
- Stress testing must be conducted monthly
### 4.2 Operational Risk
- Segregation of duties between front, middle, and back office
- All calls must be recorded
- All transactions must be confirmed in writing`,
      version: '1.2',
      status: 'Published',
      createdBy: 'Khalid Al-Otaibi',
      createdAt: '2023-08-10T10:30:00Z',
      updatedAt: '2023-08-14T14:45:00Z',
      currentApprovalLevel: 3,
      approvers: [{
        level: 1,
        name: 'Mohammed Al-Qahtani',
        status: 'Approved',
        date: '2023-08-12T09:15:00Z'
      }, {
        level: 2,
        name: 'Ahmed Al-Mansour',
        status: 'Approved',
        date: '2023-08-13T11:20:00Z'
      }, {
        level: 3,
        name: 'Fatima Al-Harbi',
        status: 'Approved',
        date: '2023-08-14T10:05:00Z'
      }]
    }, {
      id: interbankDocId,
      requestId: 4,
      title: 'Interbank Transfer Procedures',
      content: `# Interbank Transfer Procedures
## 1. Purpose
This document outlines the procedures for conducting secure interbank transfers.
## 2. Scope
These procedures apply to all interbank transfers processed by the Treasury Department.
## 3. Authorization Matrix
### 3.1 Transaction Limits
- Up to SAR 100,000: Single approval (Level 1)
- SAR 100,001 - 500,000: Two approvals (Level 1 + Level 2)
- Above SAR 500,000: Three approvals (Level 1 + Level 2 + Level 3)
### 3.2 Approval Levels
- Level 1: Treasury Officers
- Level 2: Treasury Managers
- Level 3: Treasury Head or designate
## 4. Security Measures
### 4.1 Authentication
- Two-factor authentication required for all transfers
- Biometric verification for high-value transfers
- Token-based authentication for system access
### 4.2 Verification
- Call-back verification required for all transfers above SAR 50,000
- Beneficiary bank confirmation for transfers above SAR 250,000
- Dual verification of account details prior to submission
## 5. Documentation Requirements
- All transfer requests must be documented in the prescribed form
- Supporting documentation must be attached
- Audit trail of approvals must be maintained for 7 years
## 6. Monitoring and Reporting
- Daily reconciliation of all transfers
- Weekly review of unusual transactions
- Monthly reporting to Compliance Department`,
      version: '1.0',
      status: 'Published',
      createdBy: 'Khalid Al-Otaibi',
      createdAt: '2023-07-15T09:20:00Z',
      updatedAt: '2023-07-20T15:30:00Z',
      currentApprovalLevel: 3,
      approvers: [{
        level: 1,
        name: 'Mohammed Al-Qahtani',
        status: 'Approved',
        date: '2023-07-17T14:25:00Z'
      }, {
        level: 2,
        name: 'Ahmed Al-Mansour',
        status: 'Approved',
        date: '2023-07-18T10:40:00Z'
      }, {
        level: 3,
        name: 'Fatima Al-Harbi',
        status: 'Approved',
        date: '2023-07-19T16:15:00Z'
      }]
    }];
    if (!localStorage.getItem(DOCUMENTS_STORAGE_KEY)) {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(mockDocuments));
    }
    const initialRequests: RequestItem[] = [
      // Original mock requests for P&P team
      {
        id: 1,
        ticketNumber: 'REQ-2023-001',
        dateCreated: '2023-09-15',
        requestType: 'Policy Request',
        requestDetail: 'Update Information Security Policy',
        serviceName: 'Policy: Information Security Policy',
        serviceCategory: 'Policy Management',
        slaTargetDate: '2023-09-25',
        priority: 'High',
        status: 'In Progress',
        latestNote: 'Request assigned to team member',
        requester: 'Salem Doe',
        requesterEmail: 'salem.doe@saib.com',
        department: 'Treasury',
        assignedTo: 'Khalid Al-Otaibi',
        fullDescription: 'Need to update the Information Security Policy to incorporate new SAMA Cybersecurity Framework requirements.',
        attachments: [
          {
            name: 'Business Processes and Procedures Manual',
            type: 'DOCX',
            size: '2.1 MB',
            uploadedBy: 'Salem Doe',
            date: '2023-09-15',
            url: '',
            icon: '/microsoft-word-icon.webp'
          },
          {
            name: 'SAMA_EN_10831_VER1',
            type: 'PDF',
            size: '1.8 MB',
            uploadedBy: 'Salem Doe',
            date: '2023-09-15',
            url: '',
            icon: '/PDF_file_icon.svg.png'
          }
        ]
      }, {
        id: 2,
        ticketNumber: 'REQ-2023-002',
        dateCreated: '2023-09-10',
        requestType: 'Policy Request',
        requestDetail: 'Revise Corporate Governance Policy',
        serviceName: 'Policy: Corporate Governance Policy',
        serviceCategory: 'Policy Management',
        slaTargetDate: '2023-09-28',
        priority: 'Medium',
        status: 'In Progress',
        latestNote: 'Document in review process',
        requester: 'Fatima Al-Harbi',
        requesterEmail: 'fatima.alharbi@saib.com',
        department: 'Legal',
        assignedTo: 'Khalid Al-Otaibi',
        fullDescription: 'Update needed to align with new regulatory requirements from Capital Market Authority.'
      },
      // Add the specific request from the screenshot
      {
        id: 42,
        ticketNumber: 'REQ-2023-042',
        dateCreated: '2023-09-15',
        requestType: 'Policy Request',
        requestDetail: 'Update Information Security Policy',
        serviceName: 'Policy: Update Information Security Policy',
        serviceCategory: 'Policy Management',
        slaTargetDate: '2023-09-25',
        priority: 'High',
        status: 'In Progress',
        latestNote: 'Request assigned to team member',
        requester: 'Salem Doe',
        requesterEmail: 'salem.doe@saib.com',
        department: 'Treasury',
        assignedTo: 'Khalid Al-Otaibi',
        fullDescription: 'Need to update the Information Security Policy to incorporate new SAMA Cybersecurity Framework requirements.',
        attachments: [
          {
            name: 'Business Processes and Procedures Manual',
            type: 'DOCX',
            size: '2.1 MB',
            uploadedBy: 'Salem Doe',
            date: '2023-09-15',
            url: '',
            icon: '/microsoft-word-icon.webp'
          },
          {
            name: 'SAMA_EN_10831_VER1',
            type: 'PDF',
            size: '1.8 MB',
            uploadedBy: 'Salem Doe',
            date: '2023-09-15',
            url: '',
            icon: '/PDF_file_icon.svg.png'
          }
        ]
      },
      // Add completed mock requests for Salem Doe
      {
        id: 3,
        ticketNumber: 'REQ-2023-003',
        dateCreated: '2023-08-05',
        requestType: 'Policy Request',
        requestDetail: 'Treasury Operations Manual Update',
        serviceName: 'Policy: Treasury Operations Manual',
        serviceCategory: 'Policy Management',
        slaTargetDate: '2023-08-15',
        priority: 'Medium',
        status: 'Completed',
        latestNote: 'Document published and request completed',
        requester: 'Salem Doe',
        requesterEmail: 'salem.doe@saib.com',
        department: 'Treasury',
        assignedTo: 'Khalid Al-Otaibi',
        fullDescription: 'Update the Treasury Operations Manual to include new FX transaction limits and procedures for money market placements.',
        documentId: treasuryOpDocId,
        approvalStatus: 'Approved',
        approverComments: [{
          approver: 'Mohammed Al-Qahtani',
          comment: 'Approved: The updated manual provides clear guidance on transaction limits and procedures.',
          date: '2023-08-12'
        }, {
          approver: 'Ahmed Al-Mansour',
          comment: 'Approved: Well structured and comprehensive. All requirements have been addressed.',
          date: '2023-08-13'
        }, {
          approver: 'Fatima Al-Harbi',
          comment: 'Approved: Final approval granted. This document is ready for publication.',
          date: '2023-08-14'
        }]
      }, {
        id: 4,
        ticketNumber: 'REQ-2023-004',
        dateCreated: '2023-07-12',
        requestType: 'Procedure Request',
        requestDetail: 'Interbank Transfer Procedures',
        serviceName: 'Procedure: Interbank Transfer Procedures',
        serviceCategory: 'Procedure Management',
        slaTargetDate: '2023-07-22',
        priority: 'High',
        status: 'Completed',
        latestNote: 'Document published and request completed',
        requester: 'Salem Doe',
        requesterEmail: 'salem.doe@saib.com',
        department: 'Treasury',
        assignedTo: 'Khalid Al-Otaibi',
        fullDescription: 'Create a new procedure document for interbank transfers that includes enhanced security measures and approval workflows.',
        documentId: interbankDocId,
        approvalStatus: 'Approved',
        approverComments: [{
          approver: 'Mohammed Al-Qahtani',
          comment: 'Approved: The security measures are comprehensive and meet our requirements.',
          date: '2023-07-17'
        }, {
          approver: 'Ahmed Al-Mansour',
          comment: 'Approved: The approval matrix is clear and appropriate for our risk profile.',
          date: '2023-07-18'
        }, {
          approver: 'Fatima Al-Harbi',
          comment: 'Approved: This document provides excellent guidance for secure interbank transfers.',
          date: '2023-07-19'
        }]
      }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRequests));
  }
};
// Call initialization
initializeStorage();

// Update existing requests with URLs
setTimeout(() => {
  updateExistingRequestsWithUrls();
}, 100);

// Force clear storage for development (remove this in production)
export const clearStorageForDevelopment = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
  initializeStorage();
};
// Get all requests from localStorage
export const getRequests = (): RequestItem[] => {
  try {
    const requests = localStorage.getItem(STORAGE_KEY);
    return requests ? JSON.parse(requests) : [];
  } catch (error) {
    console.error('Error retrieving requests from localStorage:', error);
    return [];
  }
};
// Get requests filtered by user role
export const getRequestsByRole = (role: string, userName: string): RequestItem[] => {
  const requests = getRequests();

  console.log('===== getRequestsByRole DEBUG =====');
  console.log('Role:', role);
  console.log('UserName:', userName);
  console.log('Total requests in storage:', requests.length);
  console.log('All requests:', requests);

  let result: RequestItem[];

  switch (role) {
    case 'user':
      // Regular users only see their own requests
      result = requests.filter(req => {
        const matches = req.requester === userName;
        console.log(`Checking request ${req.ticketNumber}: requester="${req.requester}" === userName="${userName}" ? ${matches}`);
        return matches;
      });
      console.log(`Filtered for user "${userName}":`, result);
      return result;

    case 'pp_team':
      // P&P team members see all requests, with their assigned ones first
      result = [...requests.filter(req => req.assignedTo === userName), ...requests.filter(req => req.assignedTo !== userName)];
      console.log(`Filtered for pp_team "${userName}":`, result);
      return result;

    case 'approver':
      // Approvers see requests that have been worked on by P&P team
      // (i.e., have documents generated OR are in approval workflow)
      result = requests.filter(req =>
        req.documentId ||
        req.status === 'In Progress' ||
        req.status === 'Approved' ||
        req.approvalStatus === 'In Review' ||
        req.approvalStatus === 'Changes Requested'
      );
      console.log(`Filtered for approver:`, result);
      return result;

    default:
      console.log(`Unknown role "${role}", returning all requests:`, requests);
      return requests;
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
    // Create the new request object with default attachments
    const newRequest: RequestItem = {
      id,
      ticketNumber,
      dateCreated,
      slaTargetDate,
      status: 'Pending',
      assignedTo: 'Khalid Al-Otaibi',
      // Auto-assign to P&P team member
      approvalStatus: 'Not Started',
      approverComments: [],
      // Add default attachments to every request
      attachments: [
        {
          name: 'Business Processes and Procedures Manual',
          type: 'DOCX',
          size: '2.1 MB',
          uploadedBy: 'Salem Doe',
          date: dateCreated,
          url: 'https://arqitek.sharepoint.com/:w:/s/DELSAIBBPM4.0/IQCaS8I5BF47Q59FDrXYiCHuATohzQcv1iPOgu4hjC8MXmA?e=LUqwkz',
          icon: '/microsoft-word-icon.webp'
        },
        {
          name: 'SAMA_EN_10831_VER1',
          type: 'PDF',
          size: '1.8 MB',
          uploadedBy: 'Salem Doe',
          date: dateCreated,
          url: 'https://arqitek.sharepoint.com/:b:/s/DELSAIBBPM4.0/IQDj2HBSKMCcRKYd85fAaSA4AVMHoNQzt-ZIkziCvmTR8Jo?e=ijFWr5',
          icon: '/PDF_file_icon.svg.png'
        }
      ],
      ...request
    };

    console.log('addRequest: Creating new request:', newRequest);
    console.log('addRequest: Current requests before adding:', requests);

    // Save to localStorage
    const allRequests = [...requests, newRequest];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRequests));

    console.log('addRequest: Saved to localStorage. Total requests now:', allRequests.length);
    console.log('addRequest: All requests:', allRequests);

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    // Dispatch event to update UI across all views
    window.dispatchEvent(new CustomEvent('requestsUpdated'));
    console.log('updateRequest: Request updated, event dispatched for request:', id);

    return updatedRequest;
  } catch (error) {
    console.error('Error updating request in localStorage:', error);
    throw error;
  }
};
// Link a document to a request
export const linkDocumentToRequest = (requestId: number, documentId: string): RequestItem | undefined => {
  return updateRequest(requestId, {
    documentId,
    status: 'In Progress',
    approvalStatus: 'In Review',
    latestNote: 'Document generated and sent for approval'
  });
};
// Add approver comment to request
export const addApproverComment = (requestId: number, approver: string, comment: string, approve: boolean = false): RequestItem | undefined => {
  const request = getRequestById(requestId);
  if (!request) return undefined;
  const newComment = {
    approver,
    comment,
    date: new Date().toISOString().split('T')[0]
  };
  const approverComments = request.approverComments || [];
  const updates: Partial<RequestItem> = {
    approverComments: [...approverComments, newComment]
  };
  if (approve) {
    updates.approvalStatus = 'Approved';
    updates.status = 'Approved';
    updates.latestNote = `Approved by ${approver}`;
  } else {
    updates.approvalStatus = 'Changes Requested';
    updates.latestNote = `Changes requested by ${approver}`;
  }
  return updateRequest(requestId, updates);
};
// Complete a request (final publication)
export const completeRequest = (requestId: number): RequestItem | undefined => {
  return updateRequest(requestId, {
    status: 'Completed',
    latestNote: 'Document published and request completed'
  });
};

// ========== Workflow Helper Functions ==========

// Start work on a request (P&P Team assigns themselves)
export const startWorkOnRequest = (requestId: number, assignedTo: string): RequestItem | undefined => {
  console.log(`startWorkOnRequest: Starting work on request ${requestId}, assigned to ${assignedTo}`);
  return updateRequest(requestId, {
    status: 'In Progress',
    assignedTo,
    latestNote: `Assigned to ${assignedTo} - work started`
  });
};

// Submit document for approval (P&P Team generates document)
export const submitForApproval = (requestId: number, documentId: string): RequestItem | undefined => {
  console.log(`submitForApproval: Submitting request ${requestId} for approval with document ${documentId}`);

  const request = updateRequest(requestId, {
    documentId,
    status: 'In Progress',
    approvalStatus: 'In Review',
    latestNote: 'Document generated and submitted for approval'
  });

  // Automatically mark as read for the P&P team member who submitted it
  if (request && request.assignedTo) {
    markRequestAsRead(requestId, request.assignedTo);
    console.log(`submitForApproval: Marked request ${requestId} as read for ${request.assignedTo}`);
  }

  return request;
};

// Approve a request (Approver approves)
export const approveRequest = (requestId: number, approver: string, comment?: string): RequestItem | undefined => {
  console.log(`approveRequest: Approving request ${requestId} by ${approver}`);
  const request = getRequestById(requestId);
  if (!request) return undefined;

  const newComment = comment ? {
    approver,
    comment,
    date: new Date().toISOString().split('T')[0]
  } : null;

  const approverComments = request.approverComments || [];

  const updatedRequest = updateRequest(requestId, {
    approverComments: newComment ? [...approverComments, newComment] : approverComments,
    approvalStatus: 'Approved',
    status: 'Approved',
    latestNote: `Approved by ${approver}`
  });

  // Automatically mark as read for the approver who approved it
  if (updatedRequest) {
    markRequestAsRead(requestId, approver);
    console.log(`approveRequest: Marked request ${requestId} as read for ${approver}`);
  }

  return updatedRequest;
};

// Request changes (Approver requests revision)
export const requestChanges = (requestId: number, approver: string, comment: string): RequestItem | undefined => {
  console.log(`requestChanges: Requesting changes for request ${requestId} by ${approver}`);
  const request = getRequestById(requestId);
  if (!request) return undefined;

  const newComment = {
    approver,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  const approverComments = request.approverComments || [];

  return updateRequest(requestId, {
    approverComments: [...approverComments, newComment],
    approvalStatus: 'Changes Requested',
    status: 'In Progress', // Back to In Progress for P&P team to revise
    latestNote: `Changes requested by ${approver}`
  });
};

// Reject a request (Approver rejects)
export const rejectRequest = (requestId: number, approver: string, comment: string): RequestItem | undefined => {
  console.log(`rejectRequest: Rejecting request ${requestId} by ${approver}`);
  const request = getRequestById(requestId);
  if (!request) return undefined;

  const newComment = {
    approver,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  const approverComments = request.approverComments || [];

  const updatedRequest = updateRequest(requestId, {
    approverComments: [...approverComments, newComment],
    status: 'Rejected',
    latestNote: `Rejected by ${approver}`
  });

  // Automatically mark as read for the approver who rejected it
  if (updatedRequest) {
    markRequestAsRead(requestId, approver);
    console.log(`rejectRequest: Marked request ${requestId} as read for ${approver}`);
  }

  return updatedRequest;
};

// Delete a request
export const deleteRequest = (id: number): boolean => {
  try {
    const requests = getRequests();
    const filteredRequests = requests.filter(request => request.id !== id);
    if (filteredRequests.length === requests.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRequests));
    return true;
  } catch (error) {
    console.error('Error deleting request from localStorage:', error);
    throw error;
  }
};
// Get dashboard stats
export const getDashboardStats = (role: string, userName: string) => {
  const requests = getRequestsByRole(role, userName);
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
  // Role-specific stats
  let roleSpecificStats = {};
  if (role === 'pp_team') {
    roleSpecificStats = {
      pendingAssignment: requests.filter(req => req.status === 'Pending' && !req.assignedTo).length,
      inDrafting: requests.filter(req => req.status === 'In Progress' && !req.documentId).length,
      inApproval: requests.filter(req => req.status === 'In Progress' && req.documentId && req.approvalStatus === 'In Review').length,
      needsRevision: requests.filter(req => req.approvalStatus === 'Changes Requested').length
    };
  } else if (role === 'approver') {
    roleSpecificStats = {
      pendingReview: requests.filter(req => req.approvalStatus === 'In Review').length,
      approvedByMe: requests.filter(req => {
        return req.approverComments?.some(comment => comment.approver === userName && comment.comment.includes('Approved'));
      }).length
    };
  }
  return {
    totalRequests,
    activeRequests,
    completedRequests,
    avgDaysToClose,
    ...roleSpecificStats
  };
};
// Get generated documents
export const getGeneratedDocuments = () => {
  try {
    const documents = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    return documents ? JSON.parse(documents) : [];
  } catch (error) {
    console.error('Error retrieving documents from localStorage:', error);
    return [];
  }
};
// Get document by ID
export const getDocumentById = (documentId: string) => {
  const documents = getGeneratedDocuments();
  return documents.find((doc: any) => doc.id === documentId);
};
// Get document by request ID
export const getDocumentByRequestId = (requestId: number) => {
  const documents = getGeneratedDocuments();
  return documents.find((doc: any) => doc.requestId === requestId);
};

// ========== Notification Tracking Functions ==========

// Get all notifications from localStorage
const getNotifications = (): RequestNotification[] => {
  try {
    const notifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error retrieving notifications from localStorage:', error);
    return [];
  }
};

// Save notifications to localStorage
const saveNotifications = (notifications: RequestNotification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    // Dispatch custom event to notify UI of notification changes
    window.dispatchEvent(new CustomEvent('requestNotificationsUpdated'));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
};

// Get or create notification for a request
const getOrCreateNotification = (requestId: number): RequestNotification => {
  const notifications = getNotifications();
  let notification = notifications.find(n => n.requestId === requestId);

  if (!notification) {
    notification = {
      requestId,
      viewedBy: [],
      createdAt: new Date().toISOString()
    };
    notifications.push(notification);
    saveNotifications(notifications);
  }

  return notification;
};

// Get count of unread requests for a user (P&P team member)
export const getUnreadRequestCount = (userName: string): number => {
  try {
    const requests = getRequests();
    const notifications = getNotifications();

    // Filter pending requests that haven't been viewed by this user
    const unreadCount = requests.filter(request => {
      // Only count pending or in-progress requests
      if (request.status !== 'Pending' && request.status !== 'In Progress') {
        return false;
      }

      // Check if user has viewed this request
      const notification = notifications.find(n => n.requestId === request.id);
      if (!notification) {
        // No notification record means it's unread
        return true;
      }

      // Check if this user is in the viewedBy list
      return !notification.viewedBy.includes(userName);
    });

    console.log(`getUnreadRequestCount for ${userName}: ${unreadCount.length} unread requests`);
    return unreadCount.length;
  } catch (error) {
    console.error('Error getting unread request count:', error);
    return 0;
  }
};

// Mark a request as read by a user
export const markRequestAsRead = (requestId: number, userName: string): void => {
  try {
    const notifications = getNotifications();
    let notification = notifications.find(n => n.requestId === requestId);

    if (!notification) {
      notification = {
        requestId,
        viewedBy: [userName],
        createdAt: new Date().toISOString()
      };
      notifications.push(notification);
    } else if (!notification.viewedBy.includes(userName)) {
      notification.viewedBy.push(userName);
    }

    saveNotifications(notifications);
    console.log(`markRequestAsRead: Request ${requestId} marked as read by ${userName}`);
  } catch (error) {
    console.error('Error marking request as read:', error);
  }
};

// Mark all current requests as read by a user
export const markAllRequestsAsRead = (userName: string): void => {
  try {
    const requests = getRequests();
    requests.forEach(request => {
      markRequestAsRead(request.id, userName);
    });
    console.log(`markAllRequestsAsRead: All requests marked as read by ${userName}`);
  } catch (error) {
    console.error('Error marking all requests as read:', error);
  }
};

// Get all unread requests for a user
export const getUnreadRequests = (userName: string): RequestItem[] => {
  try {
    const requests = getRequests();
    const notifications = getNotifications();

    return requests.filter(request => {
      // Only include pending or in-progress requests
      if (request.status !== 'Pending' && request.status !== 'In Progress') {
        return false;
      }

      const notification = notifications.find(n => n.requestId === request.id);
      if (!notification) {
        return true;
      }

      return !notification.viewedBy.includes(userName);
    });
  } catch (error) {
    console.error('Error getting unread requests:', error);
    return [];
  }
};

// ========== Approver Notification Functions ==========

// Get count of unread approval requests for an Approver
export const getUnreadApprovalCount = (userName: string): number => {
  try {
    const requests = getRequests();
    const notifications = getNotifications();

    // Filter requests that are in review and haven't been viewed by this approver
    const unreadCount = requests.filter(request => {
      // Only count requests that are in review status
      if (request.approvalStatus !== 'In Review') {
        return false;
      }

      // Check if user has viewed this request
      const notification = notifications.find(n => n.requestId === request.id);
      if (!notification) {
        // No notification record means it's unread
        return true;
      }

      // Check if this user is in the viewedBy list
      return !notification.viewedBy.includes(userName);
    });

    console.log(`getUnreadApprovalCount for ${userName}: ${unreadCount.length} unread approvals`);
    return unreadCount.length;
  } catch (error) {
    console.error('Error getting unread approval count:', error);
    return 0;
  }
};

// Get all unread approval requests for an Approver
export const getUnreadApprovals = (userName: string): RequestItem[] => {
  try {
    const requests = getRequests();
    const notifications = getNotifications();

    return requests.filter(request => {
      // Only include requests that are in review
      if (request.approvalStatus !== 'In Review') {
        return false;
      }

      const notification = notifications.find(n => n.requestId === request.id);
      if (!notification) {
        return true;
      }

      return !notification.viewedBy.includes(userName);
    });
  } catch (error) {
    console.error('Error getting unread approvals:', error);
    return [];
  }
};

// ========== P&P Team Notification Functions ==========

// Get all P&P team notifications from localStorage
export const getPPTeamNotifications = (): PPTeamNotification[] => {
  try {
    const notifications = localStorage.getItem(PP_TEAM_NOTIFICATIONS_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error retrieving P&P team notifications from localStorage:', error);
    return [];
  }
};

// Save P&P team notifications to localStorage
const savePPTeamNotifications = (notifications: PPTeamNotification[]): void => {
  try {
    localStorage.setItem(PP_TEAM_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    // Dispatch custom event to notify UI of notification changes
    window.dispatchEvent(new CustomEvent('ppTeamNotificationsUpdated'));
    console.log('P&P team notifications saved and event dispatched');
  } catch (error) {
    console.error('Error saving P&P team notifications to localStorage:', error);
  }
};

// Create a notification for P&P team members when approver makes a decision
export const createPPTeamNotification = (requestId: number, type: 'approval' | 'rejection'): void => {
  try {
    const request = getRequestById(requestId);
    if (!request) {
      console.error(`createPPTeamNotification: Request ${requestId} not found`);
      return;
    }

    const notifications = getPPTeamNotifications();

    // Create unique notification ID
    const notificationId = `pp-notif-${Date.now()}-${requestId}`;

    const newNotification: PPTeamNotification = {
      id: notificationId,
      requestId: request.id,
      ticketNumber: request.ticketNumber,
      requestDetail: request.requestDetail,
      type,
      createdAt: new Date().toISOString(),
      readBy: []
    };

    notifications.push(newNotification);
    savePPTeamNotifications(notifications);

    console.log(`createPPTeamNotification: Created ${type} notification for request ${requestId}`);
  } catch (error) {
    console.error('Error creating P&P team notification:', error);
  }
};

// Get unread P&P team notifications for a specific user
export const getUnreadPPNotifications = (userName: string): PPTeamNotification[] => {
  try {
    const notifications = getPPTeamNotifications();
    return notifications.filter(notif => !notif.readBy.includes(userName));
  } catch (error) {
    console.error('Error getting unread P&P notifications:', error);
    return [];
  }
};

// Get count of unread P&P team notifications for a user
export const getUnreadPPNotificationCount = (userName: string): number => {
  try {
    const unreadNotifications = getUnreadPPNotifications(userName);
    console.log(`getUnreadPPNotificationCount for ${userName}: ${unreadNotifications.length} unread notifications`);
    return unreadNotifications.length;
  } catch (error) {
    console.error('Error getting unread P&P notification count:', error);
    return 0;
  }
};

// Mark a P&P team notification as read by a user
export const markPPNotificationAsRead = (notificationId: string, userName: string): void => {
  try {
    const notifications = getPPTeamNotifications();
    const notification = notifications.find(n => n.id === notificationId);

    if (notification && !notification.readBy.includes(userName)) {
      notification.readBy.push(userName);
      savePPTeamNotifications(notifications);
      console.log(`markPPNotificationAsRead: Notification ${notificationId} marked as read by ${userName}`);
    }
  } catch (error) {
    console.error('Error marking P&P notification as read:', error);
  }
};

// Mark all P&P team notifications as read by a user
export const markAllPPNotificationsAsRead = (userName: string): void => {
  try {
    const notifications = getPPTeamNotifications();
    let updated = false;

    notifications.forEach(notification => {
      if (!notification.readBy.includes(userName)) {
        notification.readBy.push(userName);
        updated = true;
      }
    });

    if (updated) {
      savePPTeamNotifications(notifications);
      console.log(`markAllPPNotificationsAsRead: All notifications marked as read by ${userName}`);
    }
  } catch (error) {
    console.error('Error marking all P&P notifications as read:', error);
  }
};