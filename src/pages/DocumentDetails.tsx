import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, CheckCircle, AlertTriangle, Download, BookmarkCheck, Bookmark, ChevronRight, ChevronDown, ChevronUp, Share2, FileBarChart, BarChart, Users, Calendar, Bell, Star, Scale, Check, Copy, ExternalLink, Building, Tag, User, CheckSquare, Globe, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useComparison } from '../context/ComparisonContext';
import ComparisonPanel from '../components/comparison/ComparisonPanel';
import ComparisonModal from '../components/comparison/ComparisonModal';
import { documentsData } from '../services/mockDocumentsData';
const DocumentDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [savedDocument, setSavedDocument] = useState(false);
  const [relatedDocuments, setRelatedDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedFaqs, setExpandedFaqs] = useState([0]);
  const [expandedSections, setExpandedSections] = useState([0, 1]); // Default expanded sections
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const {
    comparisonTools: comparisonDocuments,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  } = useComparison();
  // Find the document with the matching ID
  const documentId = parseInt(id || '1');
  const document = documentsData[documentId];
  // Get related documents
  useEffect(() => {
    if (document && document.relatedDocuments) {
      // Enhance related documents with full document data
      const enhancedRelatedDocs = document.relatedDocuments.map(relatedDoc => {
        // Find the full document data for each related doc
        return documentsData[relatedDoc.id];
      });
      // If we have fewer than 4 related documents, add more from the same category
      if (enhancedRelatedDocs.length < 4) {
        const sameCategory = Object.values(documentsData).filter(doc => doc.id !== documentId && doc.category === document.category && !enhancedRelatedDocs.some(relDoc => relDoc?.id === doc.id));
        // If still not enough, get documents from other categories
        let additionalDocs = sameCategory;
        if (enhancedRelatedDocs.length + additionalDocs.length < 4) {
          const otherDocs = Object.values(documentsData).filter(doc => doc.id !== documentId && !enhancedRelatedDocs.some(relDoc => relDoc?.id === doc.id) && !additionalDocs.some(addDoc => addDoc.id === doc.id));
          additionalDocs = [...additionalDocs, ...otherDocs];
        }
        // Add enough documents to make it 4 total
        const docsToAdd = additionalDocs.slice(0, 4 - enhancedRelatedDocs.length);
        setRelatedDocuments([...enhancedRelatedDocs, ...docsToAdd]);
      } else {
        setRelatedDocuments(enhancedRelatedDocs);
      }
    } else if (document) {
      // If no related documents, find 4 documents from the same category
      const sameCategory = Object.values(documentsData).filter(doc => doc.id !== documentId && doc.category === document.category).slice(0, 4);
      // If not enough from same category, add from other categories
      if (sameCategory.length < 4) {
        const otherDocs = Object.values(documentsData).filter(doc => doc.id !== documentId && doc.category !== document.category).slice(0, 4 - sameCategory.length);
        setRelatedDocuments([...sameCategory, ...otherDocs]);
      } else {
        setRelatedDocuments(sameCategory);
      }
    }
  }, [document, documentId]);
  // Handle document not found
  if (!document) {
    return <div className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/documents" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Documents
          </Link>
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Document Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={() => navigate('/documents')} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
              Browse All Documents
            </button>
          </div>
        </div>
      </div>;
  }
  // Toggle save/unsave document
  const toggleSaveDocument = () => {
    setSavedDocument(!savedDocument);
  };
  // Handle adding to comparison
  const handleAddToComparison = () => {
    if (document) {
      addToComparison(document);
    }
  };
  // Open comparison modal
  const openComparisonModal = () => {
    if (comparisonDocuments.length >= 2) {
      setIsComparisonModalOpen(true);
    }
  };
  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };
  // Toggle section expansion
  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };
  // Copy link
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Get language color
  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'English':
        return 'bg-blue-100 text-blue-800';
      case 'Arabic':
        return 'bg-purple-100 text-purple-800';
      case 'Bilingual':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Get view button text based on document type
  const getViewButtonText = (type: string) => {
    switch (type) {
      case 'Policy':
        return 'View Policy';
      case 'Procedure':
        return 'View Procedure';
      case 'Form':
        return 'View Form';
      default:
        return 'View Document';
    }
  };
  // Handle document download
  const handleDownload = () => {
    if (document && document.documentLink) {
      window.open(document.documentLink, '_blank');
    }
  };
  // Generate benefits based on document properties
  const generateBenefits = () => {
    const benefits = [];
    if (document.type === 'Policy') {
      benefits.push({
        title: 'Clear governance framework',
        description: 'Establishes clear rules and guidelines for organizational governance and decision-making'
      });
    }
    if (document.type === 'Procedure') {
      benefits.push({
        title: 'Standardized processes',
        description: 'Ensures consistent execution of business processes across the organization'
      });
    }
    if (document.category === 'Governance') {
      benefits.push({
        title: 'Improved accountability',
        description: 'Clearly defines roles, responsibilities, and reporting structures'
      });
    }
    if (document.category === 'Compliance' || document.tags?.includes('Compliance')) {
      benefits.push({
        title: 'Regulatory compliance',
        description: 'Helps ensure adherence to regulatory requirements and reduces compliance risk'
      });
    }
    if (document.category === 'Risk' || document.tags?.includes('Risk')) {
      benefits.push({
        title: 'Enhanced risk management',
        description: 'Provides framework for identifying, assessing, and mitigating risks'
      });
    }
    if (document.category === 'HR' || document.department === 'HR') {
      benefits.push({
        title: 'Clear employee expectations',
        description: 'Sets clear standards for employee behavior and performance'
      });
    }
    if (document.category === 'IT' || document.department === 'IT') {
      benefits.push({
        title: 'Information security',
        description: 'Protects critical information assets from unauthorized access and breaches'
      });
    }
    // Add generic benefits if we don't have enough
    if (benefits.length < 3) {
      benefits.push({
        title: 'Operational efficiency',
        description: 'Streamlines operations and reduces inconsistencies in business processes'
      });
    }
    if (benefits.length < 3) {
      benefits.push({
        title: 'Decision support',
        description: 'Provides clear guidelines to support consistent decision-making'
      });
    }
    if (benefits.length < 3) {
      benefits.push({
        title: 'Knowledge management',
        description: 'Captures and preserves institutional knowledge and best practices'
      });
    }
    return benefits.slice(0, 4); // Limit to 4 benefits
  };
  // Get use cases based on document properties
  const getUseCases = () => {
    const useCases = [];
    if (document.type === 'Policy' && document.category === 'Governance') {
      useCases.push({
        title: 'Board Governance',
        description: 'Guides board activities, composition, and oversight responsibilities'
      });
    }
    if (document.type === 'Policy' && document.category === 'HR') {
      useCases.push({
        title: 'Employee Management',
        description: 'Establishes standards for employee conduct, rights, and responsibilities'
      });
    }
    if (document.type === 'Procedure' && document.category === 'Operations') {
      useCases.push({
        title: 'Operational Continuity',
        description: 'Ensures business operations can continue during and after disruptions'
      });
    }
    if (document.type === 'Policy' && document.category === 'IT') {
      useCases.push({
        title: 'Information Protection',
        description: 'Safeguards sensitive information and systems from security threats'
      });
    }
    if (document.type === 'Policy' && document.category === 'Compliance') {
      useCases.push({
        title: 'Regulatory Adherence',
        description: 'Ensures compliance with legal and regulatory requirements'
      });
    }
    if (document.type === 'Procedure' && document.category === 'Risk') {
      useCases.push({
        title: 'Risk Assessment',
        description: 'Provides framework for identifying and managing organizational risks'
      });
    }
    // Generic use cases if needed
    if (useCases.length < 3) {
      useCases.push({
        title: 'Staff Training',
        description: 'Used in onboarding and ongoing training to ensure understanding of requirements'
      });
    }
    if (useCases.length < 3) {
      useCases.push({
        title: 'Audit Preparation',
        description: 'Demonstrates compliance with internal and external audit requirements'
      });
    }
    if (useCases.length < 3) {
      useCases.push({
        title: 'Process Standardization',
        description: 'Ensures consistent execution of processes across the organization'
      });
    }
    return useCases.slice(0, 3); // Limit to 3 use cases
  };
  // Get implementation steps based on document properties
  const getImplementationSteps = () => {
    const steps = [];
    if (document.type === 'Policy') {
      steps.push({
        title: 'Review and Understanding',
        description: 'Thoroughly review the policy to understand its requirements and implications'
      });
      steps.push({
        title: 'Gap Analysis',
        description: 'Assess current practices against policy requirements to identify gaps'
      });
      steps.push({
        title: 'Implementation Planning',
        description: 'Develop a plan to address gaps and implement policy requirements'
      });
      steps.push({
        title: 'Communication and Training',
        description: 'Communicate policy requirements to stakeholders and provide necessary training'
      });
      steps.push({
        title: 'Monitoring and Reporting',
        description: 'Establish mechanisms to monitor compliance and report on implementation status'
      });
    } else if (document.type === 'Procedure') {
      steps.push({
        title: 'Process Mapping',
        description: 'Map the current process to understand how the procedure will be integrated'
      });
      steps.push({
        title: 'Resource Allocation',
        description: 'Identify and allocate resources needed to implement the procedure'
      });
      steps.push({
        title: 'Testing',
        description: 'Test the procedure in a controlled environment to ensure effectiveness'
      });
      steps.push({
        title: 'Staff Training',
        description: 'Train staff on the new procedure and their roles in implementation'
      });
      steps.push({
        title: 'Full Implementation',
        description: 'Roll out the procedure across the organization and monitor execution'
      });
    } else {
      steps.push({
        title: 'Initial Assessment',
        description: 'Assess the document requirements and their impact on operations'
      });
      steps.push({
        title: 'Stakeholder Engagement',
        description: 'Engage key stakeholders in the implementation process'
      });
      steps.push({
        title: 'Implementation Planning',
        description: 'Develop a comprehensive implementation plan with timelines and responsibilities'
      });
      steps.push({
        title: 'Execution',
        description: 'Execute the implementation plan with regular progress monitoring'
      });
      steps.push({
        title: 'Review and Adjustment',
        description: 'Review implementation effectiveness and make necessary adjustments'
      });
    }
    return steps;
  };
  // Get features list based on document properties
  const getFeatures = () => {
    const features = [];
    if (document.type === 'Policy') {
      features.push({
        icon: <FileText className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Comprehensive policy framework',
        description: 'Provides a complete framework for governance and compliance'
      });
    }
    if (document.type === 'Procedure') {
      features.push({
        icon: <FileBarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Detailed procedural guidance',
        description: 'Step-by-step instructions for consistent process execution'
      });
    }
    if (document.category === 'Governance') {
      features.push({
        icon: <Building className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Governance structure',
        description: 'Clear definition of governance bodies and their responsibilities'
      });
    }
    if (document.category === 'Compliance' || document.tags?.includes('Compliance')) {
      features.push({
        icon: <CheckSquare className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Compliance requirements',
        description: 'Specific requirements to ensure regulatory compliance'
      });
    }
    if (document.category === 'Risk' || document.tags?.includes('Risk')) {
      features.push({
        icon: <AlertTriangle className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Risk management framework',
        description: 'Structured approach to identifying and managing risks'
      });
    }
    if (document.tags && document.tags.includes('Security')) {
      features.push({
        icon: <Shield className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Security controls',
        description: 'Specific controls to protect information and systems'
      });
    }
    // Add more generic features if needed
    if (features.length < 4) {
      features.push({
        icon: <Users className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Role definitions',
        description: 'Clear definition of roles and responsibilities'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <BarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Performance metrics',
        description: 'Metrics to measure compliance and effectiveness'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <Clock className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Review schedule',
        description: 'Defined schedule for regular review and updates'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <FileText className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Clear documentation',
        description: 'Well-structured and easy to understand documentation'
      });
    }
    return features;
  };
  // Generate specifications based on document properties
  const getSpecifications = () => {
    const specs = [];
    specs.push({
      name: 'Document Type',
      value: document.type
    });
    specs.push({
      name: 'Version',
      value: document.version
    });
    specs.push({
      name: 'Status',
      value: document.status
    });
    specs.push({
      name: 'Category',
      value: document.category
    });
    specs.push({
      name: 'Department',
      value: document.department
    });
    specs.push({
      name: 'Language',
      value: document.language
    });
    specs.push({
      name: 'Last Updated',
      value: document.lastUpdated
    });
    specs.push({
      name: 'Effective Date',
      value: document.effectiveDate
    });
    specs.push({
      name: 'Next Review Date',
      value: document.nextReviewDate
    });
    specs.push({
      name: 'Created By',
      value: document.createdBy
    });
    specs.push({
      name: 'Approved By',
      value: document.approvedBy
    });
    return specs;
  };
  // Generate FAQs based on document properties
  const getFAQs = () => {
    const faqs = [];
    // Who is responsible for this document?
    faqs.push({
      question: 'Who is responsible for this document?',
      answer: `This document is owned by the ${document.department} department. The current version was created by ${document.createdBy} and approved by the ${document.approvedBy}.`
    });
    // Who needs to comply with this document?
    faqs.push({
      question: 'Who needs to comply with this document?',
      answer: document.type === 'Policy' ? 'All employees, contractors, and third parties operating on behalf of SAIB must comply with this policy.' : 'All staff members involved in the relevant processes must follow this procedure.'
    });
    // How often is this document reviewed?
    faqs.push({
      question: 'How often is this document reviewed?',
      answer: `This document is reviewed annually. The next scheduled review date is ${document.nextReviewDate}.`
    });
    // What happens if this document is not followed?
    faqs.push({
      question: 'What happens if this document is not followed?',
      answer: document.type === 'Policy' ? 'Non-compliance with this policy may result in disciplinary action, up to and including termination of employment. It may also expose the organization to regulatory risks and penalties.' : 'Failure to follow this procedure may result in operational inefficiencies, inconsistent outcomes, and potential compliance issues.'
    });
    // How do I request changes to this document?
    faqs.push({
      question: 'How do I request changes to this document?',
      answer: `Change requests should be submitted to the ${document.department} department with a clear rationale for the proposed changes. All changes must go through the formal review and approval process.`
    });
    return faqs;
  };
  // Generate document benefits
  const benefits = generateBenefits();
  // Get use cases
  const useCases = getUseCases();
  // Get implementation steps
  const implementationSteps = getImplementationSteps();
  // Get features list
  const features = getFeatures();
  // Get specifications
  const specifications = getSpecifications();
  // Get FAQs
  const faqs = getFAQs();
  return <div className="bg-gray-50 min-h-screen pb-16">
      {/* Comparison panel */}
      <ComparisonPanel selectedTools={comparisonDocuments} removeFromComparison={removeFromComparison} clearComparison={clearComparison} openComparisonModal={openComparisonModal} />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${comparisonDocuments.length > 0 ? 'pt-28' : 'pt-8'}`}>
        {/* Back button */}
        <Link to="/documents" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Documents
        </Link>
        {/* Document banner */}
        <div className="bg-gradient-to-r from-[#FFEDA8] to-[#F4F1E3] rounded-xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-white p-4 rounded-full shadow-sm mr-6 mb-4 md:mb-0">
              <FileText size={32} className="text-[#FECC0E]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {document.title}
              </h1>
              <p className="mt-2 text-gray-700">{document.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                  {document.type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                  {document.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal ${getLanguageColor(document.language)}`}>
                  <Globe className="h-3 w-3 mr-1" />
                  {document.language}
                </span>
              </div>
            </div>
          </div>
          {/* Document stats and CTA in same row */}
          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">Department:</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.department}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">Version:</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.version}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-sm text-gray-700 mr-2">Updated:</span>
                <span className="text-sm font-medium text-gray-900">
                  {document.lastUpdated}
                </span>
              </div>
            </div>
            {/* CTA Button */}
            <div className="mt-4 md:mt-0">
              <button onClick={handleDownload} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm inline-flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                {getViewButtonText(document.type)}
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Description
            </button>
            <button onClick={() => setActiveTab('content')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Content
            </button>
            <button onClick={() => setActiveTab('implementation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'implementation' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Implementation
            </button>
            <button onClick={() => setActiveTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faq' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              FAQ
            </button>
          </nav>
        </div>
        {/* Tab content with sidebar layout */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          {/* Main content area - 75% width on desktop */}
          <div className="lg:w-3/4">
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
                      <p className="text-gray-600 text-sm">
                        {document.description}
                      </p>
                      <div className="mt-4 space-y-4">
                        {benefits.map((benefit, index) => <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-3">
                              <span className="h-2 w-2 rounded-full bg-[#FECC0E]"></span>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {benefit.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {benefit.description}
                              </p>
                            </div>
                          </div>)}
                      </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {useCases.map((useCase, index) => <div key={index} className="bg-gray-50 rounded-lg p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#FECC0E]"></div>
                            <div className="pl-3">
                              <h3 className="font-medium text-gray-900 mb-2">
                                {useCase.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {useCase.description}
                              </p>
                            </div>
                          </div>)}
                      </div>
                    </div>}
                </div>
                {/* Document Information Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(2)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Document Information
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(2) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(2) && <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                              Document Details
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Type: {document.type}</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Version: {document.version}</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Status: {document.status}</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Language: {document.language}</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                              Key Dates
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Last Updated: {document.lastUpdated}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Effective Date: {document.effectiveDate}
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Next Review: {document.nextReviewDate}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
                {/* References Accordion */}
                {document.references && document.references.length > 0 && <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(3)}>
                      <h2 className="text-lg font-medium text-gray-900">
                        References
                      </h2>
                      <button className="text-gray-400 hover:text-gray-500">
                        {expandedSections.includes(3) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    {expandedSections.includes(3) && <div className="px-4 pb-4">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <ExternalLink className="h-6 w-6 text-[#FECC0E] mr-3" />
                            <h3 className="text-base font-medium text-gray-900">
                              External References
                            </h3>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {document.references.map((reference, index) => <li key={index} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>{reference}</span>
                              </li>)}
                          </ul>
                        </div>
                      </div>}
                  </div>}
              </div>}
            {activeTab === 'content' && <div className="space-y-4">
                {/* Document Content Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(4)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Document Content
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(4) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(4) && <div className="px-4 pb-4">
                      <div className="space-y-6 mt-4">
                        {document.sections && document.sections.map((section, index) => <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                              <h3 className="font-medium text-gray-900 mb-2">
                                {section.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {section.content}
                              </p>
                            </div>)}
                      </div>
                    </div>}
                </div>
                {/* Key Features Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(5)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Key Features
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(5) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(5) && <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {features.map((feature, index) => <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="h-10 w-10 rounded-full bg-[#FECC0E]/10 flex items-center justify-center mb-3">
                              {feature.icon}
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {feature.description}
                            </p>
                          </div>)}
                      </div>
                    </div>}
                </div>
              </div>}
            {activeTab === 'implementation' && <div className="space-y-4">
                {/* Implementation Process Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(6)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Implementation Process
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(6) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(6) && <div className="px-4 pb-4">
                      <div className="bg-white p-4 mt-2">
                        <div className="relative">
                          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-8">
                            {implementationSteps.map((step, index) => <div key={index} className="relative flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FECC0E] flex items-center justify-center z-10 text-white font-medium">
                                  {index + 1}
                                </div>
                                <div className="ml-6 pt-1">
                                  <h3 className="font-medium text-gray-900 mb-1">
                                    {step.title}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {step.description}
                                  </p>
                                </div>
                              </div>)}
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
                {/* Implementation Tips Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(7)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Implementation Tips
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(7) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(7) && <div className="px-4 pb-4">
                      <ul className="space-y-3 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Involve key stakeholders early in the implementation
                            process
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Provide comprehensive training to all affected staff
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Establish clear metrics to measure implementation
                            success
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Schedule regular review sessions to evaluate
                            effectiveness
                          </span>
                        </li>
                      </ul>
                    </div>}
                </div>
                {/* Technical Specifications Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(8)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Document Specifications
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(8) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(8) && <div className="px-4 pb-4">
                      <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <tbody className="divide-y divide-gray-200">
                          {specifications.map((spec, index) => <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {spec.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {spec.value}
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>}
                </div>
              </div>}
            {activeTab === 'faq' && <div className="space-y-4">
                {/* FAQ Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(9)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Frequently Asked Questions
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(9) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(9) && <div className="px-4 pb-4 mt-2">
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
                                <p className="text-gray-600 text-sm">
                                  {faq.answer}
                                </p>
                              </div>}
                          </div>)}
                      </div>
                    </div>}
                </div>
                {/* Support & Resources Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(10)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Support & Resources
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(10) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(10) && <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Document Owner
                            </h4>
                            <p className="text-sm text-gray-600">
                              Contact the {document.department} department for
                              questions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Related Templates
                            </h4>
                            <p className="text-sm text-gray-600">
                              Access templates and forms in the Resource Center
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Training Sessions
                            </h4>
                            <p className="text-sm text-gray-600">
                              Schedule training on document implementation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>}
          </div>
          {/* Sidebar - 25% width on desktop */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Document Details
                </h3>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getStatusColor(document.status)}`}>
                    {document.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Version:</span>
                  <span className="text-sm font-semibold">
                    {document.version}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Language:</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getLanguageColor(document.language)}`}>
                    <Globe className="h-3 w-3 inline mr-1" />
                    {document.language}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Review Date:</span>
                  <span className="text-sm font-semibold">
                    {document.nextReviewDate}
                  </span>
                </div>
                <div className="mt-6 mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Quick Actions:
                  </h4>
                  <div className="space-y-3">
                    <button onClick={toggleSaveDocument} className="w-full flex items-center justify-between p-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                      <span className="text-sm">Save for later</span>
                      {savedDocument ? <BookmarkCheck className="h-5 w-5 text-[#FECC0E]" /> : <Bookmark className="h-5 w-5 text-gray-400" />}
                    </button>
                    <button onClick={copyLink} className="w-full flex items-center justify-between p-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                      <span className="text-sm">Copy link</span>
                      {copySuccess ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <button onClick={handleDownload} className="w-full bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-3 px-6 rounded-md transition-colors shadow-sm text-base flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {getViewButtonText(document.type)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related Documents Section */}
        {relatedDocuments.length > 0 && <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Related Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedDocuments.map(relatedDoc => <Link to={`/document/${relatedDoc.id}`} key={relatedDoc.id} className="block h-full">
                  <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group cursor-pointer">
                    {/* Yellow border on left side when hovered */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#FECC0E] transition-all duration-300"></div>
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-gray-500 text-sm">
                          v{relatedDoc.version}
                        </div>
                      </div>
                      {/* Title: 18px font size, truncate to 2 lines */}
                      <h3 className="text-lg font-medium text-gray-900 mb-4 line-clamp-2 h-14">
                        {relatedDoc.title}
                      </h3>
                      {/* Tags: similar to service cards, font size 12px, one line only */}
                      <div className="flex flex-wrap gap-2 mb-4 overflow-hidden h-7">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${relatedDoc.status === 'Active' ? 'bg-green-100 text-green-800' : relatedDoc.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {relatedDoc.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {relatedDoc.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {relatedDoc.language}
                        </span>
                      </div>
                      {/* Description: 14px font size, truncate to 2 lines */}
                      <p className="text-sm text-gray-600 mb-8 flex-grow line-clamp-2">
                        {relatedDoc.description}
                      </p>
                      {/* CTA: 14px font size, font weight 400 */}
                      <div className="mt-auto">
                        <span className="flex items-center text-[#9E800D] group-hover:text-[#FECC0E] text-sm font-normal transition-colors">
                          View details <ArrowRight size={16} className="ml-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>)}
            </div>
          </div>}
      </div>
      {/* Comparison modal */}
      <ComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} selectedTools={comparisonDocuments} />
    </div>;
};
export default DocumentDetails;