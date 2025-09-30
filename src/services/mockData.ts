// Mock data for services when Airtable API fails
export const mockServices = [{
  id: 'rec1',
  // Updated to match Airtable record ID format
  title: 'Develop New Policy',
  description: 'Create a new bank policy document aligned with regulatory requirements and internal governance standards.',
  longDescription: 'This service provides end-to-end support for developing new policy documents that align with both regulatory requirements and internal governance standards. Our team will work with you to understand requirements, draft appropriate policy language, coordinate reviews with stakeholders, and guide the document through the approval process.',
  category: 'Policy',
  department: 'All',
  priority: 'Medium',
  complexity: 'High',
  responseSLA: 24,
  resolutionSLA: 10,
  deliverySLA: 14,
  domain: 'Governance',
  audience: ['All Staff', 'Management'],
  tags: ['New Creation'],
  processSteps: ['Initial consultation and requirements gathering', 'Draft policy development', 'Stakeholder review and feedback', 'Revision based on feedback', 'Final approval and implementation'],
  useCases: ['Creating a new operational policy to address regulatory changes', 'Developing a policy for a new business function or process', 'Establishing governance for new technology or systems']
}, {
  id: 'rec2',
  // Updated to match Airtable record ID format
  title: 'Cancel Policy',
  description: 'Formally retire an existing policy that is no longer relevant or has been superseded by new regulations.',
  longDescription: "This service helps you formally retire policies that are no longer relevant, have been superseded by new regulations, or need to be consolidated with other policies. We'll guide you through the proper cancellation process, ensuring all stakeholders are notified and any dependencies are addressed.",
  category: 'Policy',
  department: 'All',
  priority: 'Low',
  complexity: 'Medium',
  responseSLA: 24,
  resolutionSLA: 7,
  deliverySLA: 10,
  domain: 'Governance',
  audience: ['Management', 'Policy Owners'],
  tags: ['Cancellation'],
  processSteps: ['Review policy and determine cancellation requirements', 'Document justification for cancellation', 'Obtain necessary approvals', 'Archive policy and update policy register', 'Communicate cancellation to affected stakeholders'],
  useCases: ['Retiring outdated policies that no longer reflect current practices', 'Removing policies made obsolete by regulatory changes', 'Consolidating multiple policies into a single document']
}, {
  id: 'rec3',
  // Updated to match Airtable record ID format
  title: 'Revise Policy',
  description: 'Update an existing policy to address regulatory changes, audit findings, or process improvements.',
  longDescription: 'This service provides comprehensive support for revising existing policies to address regulatory changes, audit findings, or process improvements. Our team will help you identify necessary changes, draft revised language, coordinate reviews, and guide the updated document through the approval process.',
  category: 'Policy',
  department: 'All',
  priority: 'Medium',
  complexity: 'Medium',
  responseSLA: 24,
  resolutionSLA: 7,
  deliverySLA: 10,
  domain: 'Governance',
  audience: ['All Staff', 'Management', 'Policy Owners'],
  tags: ['Revision'],
  processSteps: ['Review current policy and identify needed changes', 'Draft revised policy language', 'Conduct stakeholder review and gather feedback', 'Revise based on feedback', 'Obtain necessary approvals', 'Implement and communicate changes'],
  useCases: ['Updating policies to reflect regulatory changes', 'Revising policies based on audit findings or recommendations', 'Enhancing policies to improve clarity or effectiveness']
}, {
  id: 'rec4',
  // Updated to match Airtable record ID format
  title: 'Update Policy',
  description: 'Make minor modifications to existing policies to reflect organizational changes or clarify requirements.',
  longDescription: 'This service facilitates minor modifications to existing policies to reflect organizational changes, clarify requirements, or address small gaps. Our team will help implement these changes efficiently while ensuring proper documentation and approval.',
  category: 'Policy',
  department: 'All',
  priority: 'Low',
  complexity: 'Low',
  responseSLA: 24,
  resolutionSLA: 5,
  deliverySLA: 7,
  domain: 'Governance',
  audience: ['All Staff', 'Management'],
  tags: ['Update'],
  processSteps: ['Identify specific updates needed', 'Draft updated language', 'Obtain necessary approvals', 'Implement and communicate changes'],
  useCases: ['Updating department names or organizational references', 'Clarifying existing requirements without changing substance', 'Making minor formatting or structural improvements']
}];
// Function to get a service by ID from mock data
export const getMockServiceById = (id: string) => {
  // If the ID is one of the numeric strings from the preview, map it to the mock data
  if (id === '1') return mockServices[0];
  if (id === '2') return mockServices[1];
  if (id === '3') return mockServices[2];
  if (id === '4') return mockServices[3];
  if (id === '5') return mockServices[0]; // Fallback to first service
  if (id === '6') return mockServices[1]; // Fallback to second service
  // Otherwise try to find it directly
  return mockServices.find(service => service.id === id) || null;
};
// Function to get related services from mock data
export const getMockRelatedServices = (currentId: string, category: string) => {
  return mockServices.filter(service => service.category === category && service.id !== currentId).slice(0, 4);
};