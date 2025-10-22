import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, Info, Upload, PlusCircle, CheckCircle, HelpCircle } from 'lucide-react';
import AcknowledgmentModal from '../components/marketplace/AcknowledgmentModal';
import { addRequest } from '../services/requestTracking';
import { useUser } from '../context/UserContext';
// Define the impact question type
interface ImpactQuestion {
  id: string;
  question: string;
  checked: boolean;
  assignedStakeholder?: string;
}
// Define the qualifying question type
interface QualifyingQuestion {
  id: string;
  question: string;
  checked: boolean;
}
const ServiceRequestForm = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const user = useUser();
  // Form state
  const [formState, setFormState] = useState({
    title: '',
    sourceOfRequest: '',
    type: '',
    justification: '',
    description: ''
  });
  // Qualifying questions to determine if a request is major or minor
  const [qualifyingQuestions, setQualifyingQuestions] = useState<QualifyingQuestion[]>([{
    id: 'multi_dept',
    question: 'Does this change impact multiple departments or business units?',
    checked: false
  }, {
    id: 'system_change',
    question: 'Will this change require significant IT system modifications?',
    checked: false
  }, {
    id: 'regulatory',
    question: 'Does this change directly impact regulatory compliance or reporting?',
    checked: false
  }, {
    id: 'training',
    question: 'Will this change require extensive staff training or communication?',
    checked: false
  }, {
    id: 'risk_controls',
    question: 'Does this change significantly alter existing risk controls or governance?',
    checked: false
  }]);
  // Determine if request is major based on qualifying questions
  const [isRequestMajor, setIsRequestMajor] = useState(false);
  // Update type based on qualifying questions
  useEffect(() => {
    const yesCount = qualifyingQuestions.filter(q => q.checked).length;
    const isMajor = yesCount >= 3;
    setIsRequestMajor(isMajor);
    setFormState(prev => ({
      ...prev,
      type: isMajor ? 'Major' : 'Minor'
    }));
  }, [qualifyingQuestions]);
  // File attachment state
  const [files, setFiles] = useState<File[]>([]);
  // Impact questions state
  const [impactQuestions, setImpactQuestions] = useState<ImpactQuestion[]>([{
    id: 'shariah',
    question: 'Does it impact Shariah compliance?',
    checked: false,
    assignedStakeholder: 'Shariah Committee'
  }, {
    id: 'aml',
    question: 'Does it affect AML/KYC/Screening?',
    checked: false,
    assignedStakeholder: 'Compliance Team'
  }, {
    id: 'system',
    question: 'Does it impact/introduce a system?',
    checked: false,
    assignedStakeholder: 'IT Department'
  }, {
    id: 'fraud',
    question: 'Does it affect fraud controls?',
    checked: false,
    assignedStakeholder: 'Risk Management'
  }, {
    id: 'security',
    question: 'Does it change security/controls?',
    checked: false,
    assignedStakeholder: 'Security Team'
  }, {
    id: 'vendor',
    question: 'Does it involve a third-party/vendor?',
    checked: false,
    assignedStakeholder: 'Vendor Management'
  }, {
    id: 'financial',
    question: 'Does it impact financial entries?',
    checked: false,
    assignedStakeholder: 'Finance Department'
  }, {
    id: 'privacy',
    question: 'Does it affect data privacy/classification?',
    checked: false,
    assignedStakeholder: 'Data Protection Officer'
  }, {
    id: 'terms',
    question: 'Does it impact Terms & Conditions?',
    checked: false,
    assignedStakeholder: 'Legal Department'
  }, {
    id: 'training',
    question: 'Will staff training/communication be required?',
    checked: false,
    assignedStakeholder: 'Training Department'
  }, {
    id: 'credit',
    question: 'Is there credit exposure or limits?',
    checked: false,
    assignedStakeholder: 'Credit Risk'
  }]);
  const [assignedStakeholders, setAssignedStakeholders] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  // Handle input changes for the basic form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  // Handle checkbox changes for qualifying questions
  const handleQualifyingQuestionChange = (questionId: string) => {
    const updatedQuestions = qualifyingQuestions.map(q => q.id === questionId ? {
      ...q,
      checked: !q.checked
    } : q);
    setQualifyingQuestions(updatedQuestions);
  };
  // Handle checkbox changes for impact questions
  const handleImpactQuestionChange = (questionId: string) => {
    const updatedQuestions = impactQuestions.map(q => q.id === questionId ? {
      ...q,
      checked: !q.checked
    } : q);
    setImpactQuestions(updatedQuestions);
    // Update assigned stakeholders based on selected questions
    const stakeholders = updatedQuestions.filter(q => q.checked).map(q => q.assignedStakeholder).filter((s): s is string => s !== undefined);
    setAssignedStakeholders([...new Set(stakeholders)]);
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Create a new request object to store in localStorage
      const selectedImpacts = impactQuestions.filter(q => q.checked).map(q => q.question).join(', ');
      const impactDetails = selectedImpacts.length > 0 ? `\n\nImpact Areas: ${selectedImpacts}` : '';
      const stakeholderDetails = assignedStakeholders.length > 0 ? `\n\nStakeholders: ${assignedStakeholders.join(', ')}` : '';
      const newRequest = {
        requestType: 'Procedure Request',
        requestDetail: formState.title,
        serviceName: `Procedure: ${formState.title}`,
        serviceCategory: 'Procedure Management',
        priority: formState.type === 'Major' ? 'High' : 'Medium',
        latestNote: 'Request submitted by user',
        fullDescription: `${formState.justification}\n\n${formState.description}${impactDetails}${stakeholderDetails}`,
        requester: user.name || 'Anonymous User',
        requesterEmail: user.email || 'user@example.com',
        department: user.department || 'Not specified'
      };
      // Add the request to localStorage
      const savedRequest = addRequest(newRequest);

      // Set the request number from the generated request
      setRequestNumber(savedRequest.ticketNumber);

      // Trigger custom event to update other components (with small delay)
      setTimeout(() => {
        console.log('Dispatching requestsUpdated event');
        window.dispatchEvent(new CustomEvent('requestsUpdated'));
      }, 0);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Open the acknowledgment modal
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Close the modal and navigate back
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Navigate to track requests page
    navigate('/track-requests');
  };
  // Get dynamic title based on service type
  const getFormTitle = () => {
    // This would ideally be based on the actual service being requested
    return 'Request to Develop New Manual';
  };
  return <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <button onClick={() => navigate(`/service/${id}`)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Service Details
          </button>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            {getFormTitle()}
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Complete the form below to request a new or updated procedure
            document
          </p>
        </div>
        {/* Error message display */}
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span>{error}</span>
            </div>
          </div>}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Provide details about the procedure request
              </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Name of procedure
                  </label>
                  <div className="mt-1">
                    <input type="text" name="title" id="title" required value={formState.title} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-4" placeholder="Enter procedure name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="sourceOfRequest" className="block text-sm font-medium text-gray-700">
                    Source of request
                  </label>
                  <div className="mt-1">
                    <select id="sourceOfRequest" name="sourceOfRequest" required value={formState.sourceOfRequest} onChange={handleInputChange} className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md h-10 px-3">
                      <option value="">Select Source</option>
                      <option value="Internal Request">Internal Request</option>
                      <option value="Management Request">
                        Management Request
                      </option>
                      <option value="Regulatory Requirement">
                        Regulatory Requirement
                      </option>
                      <option value="Audit Finding">Audit Finding</option>
                      <option value="Customer Feedback">
                        Customer Feedback
                      </option>
                      <option value="Process Improvement">
                        Process Improvement
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Request Type Qualification
                  </label>
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                    <div className="flex">
                      <HelpCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        Please answer the following questions to help us
                        determine if your request is major or minor.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {qualifyingQuestions.map(question => <div key={question.id} className="relative flex items-start p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
                        <div className="flex items-center h-5">
                          <input id={question.id} type="checkbox" checked={question.checked} onChange={() => handleQualifyingQuestionChange(question.id)} className="h-4 w-4 text-[#FECC0E] border-gray-300 rounded focus:ring-[#FECC0E]" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={question.id} className="font-medium text-gray-700">
                            {question.question}
                          </label>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center">
                      {isRequestMajor ? <div className="flex items-center text-amber-700">
                          <CheckCircle className="h-5 w-5 mr-2 text-amber-600" />
                          <span className="font-medium">Major Request</span>
                        </div> : <div className="flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          <span className="font-medium">Minor Request</span>
                        </div>}
                      <span className="ml-2 text-sm text-gray-500">
                        (Automatically determined based on your answers)
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="justification" className="block text-sm font-medium text-gray-700">
                    Justification
                  </label>
                  <div className="mt-1">
                    <textarea id="justification" name="justification" rows={3} required value={formState.justification} onChange={handleInputChange} placeholder="Explain why this procedure is needed" className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea id="description" name="description" rows={4} value={formState.description} onChange={handleInputChange} placeholder="Provide detailed information about the request" className="shadow-sm focus:ring-[#FECC0E] focus:border-[#FECC0E] block w-full sm:text-sm border-gray-300 rounded-md px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attachments
                  </label>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="file-upload" className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-[#FECC0E] transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <span>Upload files</span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, DOCX, XLSX up to 10MB
                          </p>
                        </div>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                  {/* File list */}
                  {files.length > 0 && <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {files.map((file, index) => <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex items-center">
                            <PlusCircle className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile(index)} className="ml-4 text-red-500 hover:text-red-700">
                            Remove
                          </button>
                        </li>)}
                    </ul>}
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Impact Questions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Impact Questions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select all that apply. This will automatically assign
                stakeholders to the request.
              </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4">
                {impactQuestions.map(question => <div key={question.id} className="relative flex items-center rounded-lg p-4 border border-gray-200 transition-all duration-200 hover:border-[#FECC0E] bg-gray-50">
                    <div className="flex h-5 items-center">
                      <input id={question.id} type="checkbox" checked={question.checked} onChange={() => handleImpactQuestionChange(question.id)} className="h-5 w-5 rounded border-gray-300 text-[#FECC0E] focus:ring-[#FECC0E]" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={question.id} className="font-medium text-gray-700">
                        {question.question}
                      </label>
                    </div>
                  </div>)}
              </div>
              {assignedStakeholders.length > 0 && <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">
                        Auto-assigned Stakeholders
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {assignedStakeholders.map((stakeholder, index) => <li key={index}>{stakeholder}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E] flex items-center justify-center">
              {isSubmitting ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Request...
                </> : <>
                  <Send className="-ml-1 mr-2 h-5 w-5" />
                  Submit Request
                </>}
            </button>
          </div>
        </form>
      </div>
      {/* Acknowledgment Modal */}
      <AcknowledgmentModal isOpen={isModalOpen} onClose={handleCloseModal} requestNumber={requestNumber} />
    </div>;
};
export default ServiceRequestForm;