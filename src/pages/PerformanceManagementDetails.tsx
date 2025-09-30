import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileBarChart, CheckCircle, AlertTriangle, Download, BookmarkCheck, Bookmark, ChevronRight, ChevronDown, ChevronUp, Share2, PieChart, BarChart, Users, Calendar, Bell, Star, Scale, Check, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { performanceManagementTools } from '../data/performanceManagementData';
import { useComparison } from '../context/ComparisonContext';
import ComparisonPanel from '../components/comparison/ComparisonPanel';
import ComparisonModal from '../components/comparison/ComparisonModal';
const PerformanceManagementDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [savedTool, setSavedTool] = useState(false);
  const [relatedTools, setRelatedTools] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedFaqs, setExpandedFaqs] = useState([0]);
  const [expandedSections, setExpandedSections] = useState([0, 1]); // Default expanded sections
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<any | null>(null);
  const {
    comparisonTools,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  } = useComparison();
  // Find the tool with the matching ID and get related tools
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      // Get ID from params and ensure it's a number
      const idFromParams = id;
      console.log('Raw ID from params:', idFromParams);
      if (!idFromParams) {
        throw new Error('No ID provided in URL');
      }
      const numericId = parseInt(idFromParams, 10);
      console.log('Parsed numeric ID:', numericId);
      if (isNaN(numericId)) {
        throw new Error(`Invalid ID: ${idFromParams} is not a number`);
      }
      // Find the tool with the matching ID
      const foundTool = performanceManagementTools.find(t => t.id === numericId);
      console.log('Found tool:', foundTool);
      if (!foundTool) {
        throw new Error(`No tool found with ID: ${numericId}`);
      }
      setTool(foundTool);
      // Find related tools based on industry, use case, or feature
      const related = performanceManagementTools.filter(t => {
        // Don't include the current tool
        if (t.id === foundTool.id) return false;
        // Match by industry, use case, or feature
        return foundTool.industry && t.industry === foundTool.industry || foundTool.useCase && t.useCase === foundTool.useCase || foundTool.feature && t.feature === foundTool.feature;
      }).slice(0, 4); // Show 4 related tools
      setRelatedTools(related);
    } catch (err) {
      console.error('Error loading tool details:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);
  // Toggle save/unsave tool
  const toggleSaveTool = () => {
    setSavedTool(!savedTool);
  };
  // Handle adding to comparison
  const handleAddToComparison = () => {
    if (tool) {
      if (isInComparison(tool.id)) {
        removeFromComparison(tool.id);
      } else {
        addToComparison(tool);
      }
    }
  };
  // Open comparison modal
  const openComparisonModal = () => {
    if (comparisonTools.length >= 2) {
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
  // Loading state
  if (loading) {
    return <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[#FECC0E] mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Loading tool details...</p>
        </div>
      </div>;
  }
  // Error state
  if (error) {
    return <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/performance-management" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Performance Management
          </Link>
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Tool
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => navigate('/performance-management')} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
              Browse All Tools
            </button>
          </div>
        </div>
      </div>;
  }
  // Handle tool not found
  if (!tool) {
    return <div className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/performance-management" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Performance Management
          </Link>
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tool Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The performance management tool you're looking for doesn't exist
              or has been removed.
            </p>
            <button onClick={() => navigate('/performance-management')} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
              Browse All Tools
            </button>
          </div>
        </div>
      </div>;
  }
  // Generate benefits based on tool properties
  const generateBenefits = () => {
    const benefits = [];
    if (tool.aiPowered) {
      benefits.push({
        title: 'AI-powered insights',
        description: 'Leverages artificial intelligence to provide intelligent analysis and performance recommendations'
      });
    }
    if (tool.realTime) {
      benefits.push({
        title: 'Real-time monitoring',
        description: 'Provides immediate visibility into performance metrics and trends'
      });
    }
    if (tool.useCase === 'Performance Evaluation') {
      benefits.push({
        title: 'Streamlined evaluations',
        description: 'Optimizes employee evaluation processes to ensure fairness and consistency'
      });
    }
    if (tool.useCase === 'Goal Setting') {
      benefits.push({
        title: 'Effective goal alignment',
        description: 'Ensures individual and team goals are aligned with organizational objectives'
      });
    }
    if (tool.useCase === 'Feedback Management') {
      benefits.push({
        title: 'Continuous feedback',
        description: 'Facilitates ongoing feedback exchanges to drive performance improvement'
      });
    }
    if (tool.feature === 'Analytics') {
      benefits.push({
        title: 'Advanced analytics',
        description: 'Comprehensive performance data analysis to identify trends and opportunities'
      });
    }
    if (tool.feature === 'Heatmap') {
      benefits.push({
        title: 'Visual performance tracking',
        description: 'Intuitive visualization of performance metrics across teams and departments'
      });
    }
    if (tool.feature === 'Strategy Alignment') {
      benefits.push({
        title: 'Strategic alignment',
        description: 'Aligns individual performance with organizational goals and strategies'
      });
    }
    if (tool.title.toLowerCase().includes('dashboard')) {
      benefits.push({
        title: 'Comprehensive dashboards',
        description: 'Customizable dashboards that provide a holistic view of performance metrics'
      });
    }
    if (tool.department) {
      benefits.push({
        title: `${tool.department} optimization`,
        description: `Specifically designed for ${tool.department} teams to enhance productivity and performance`
      });
    }
    // Add generic benefits if we don't have enough
    if (benefits.length < 3) {
      benefits.push({
        title: 'Performance efficiency',
        description: 'Improves performance management processes and reduces administrative overhead'
      });
    }
    if (benefits.length < 3) {
      benefits.push({
        title: 'Data-driven decisions',
        description: 'Enables evidence-based performance decisions through comprehensive metrics'
      });
    }
    if (benefits.length < 3) {
      benefits.push({
        title: 'Employee engagement',
        description: 'Increases employee engagement through transparent performance processes'
      });
    }
    return benefits.slice(0, 4); // Limit to 4 benefits
  };
  // Get use cases based on tool properties
  const getUseCases = () => {
    const useCases = [];
    if (tool.useCase) {
      useCases.push({
        title: tool.useCase,
        description: `Optimized for ${tool.useCase.toLowerCase()} scenarios and workflows`
      });
    }
    if (tool.industry) {
      useCases.push({
        title: `${tool.industry} Performance`,
        description: `Tailored for performance management in ${tool.industry.toLowerCase()} environments`
      });
    }
    if (tool.department) {
      useCases.push({
        title: `${tool.department} Excellence`,
        description: `Drive performance excellence within ${tool.department} teams and functions`
      });
    }
    if (tool.riskLevel === 'High') {
      useCases.push({
        title: 'Critical Performance Areas',
        description: 'Track and manage high-impact performance areas requiring close oversight'
      });
    }
    if (tool.feature === 'Heatmap') {
      useCases.push({
        title: 'Performance Gap Identification',
        description: 'Visually identify and address performance gaps and improvement opportunities'
      });
    }
    if (tool.title.toLowerCase().includes('dashboard')) {
      useCases.push({
        title: 'Executive Reporting',
        description: 'Generate comprehensive performance reports for leadership and stakeholders'
      });
    }
    // Generic use cases if needed
    if (useCases.length < 3) {
      useCases.push({
        title: 'Performance Improvement',
        description: 'Identify opportunities to enhance individual and team performance'
      });
    }
    if (useCases.length < 3) {
      useCases.push({
        title: 'Talent Development',
        description: 'Support employee growth through data-driven development plans'
      });
    }
    if (useCases.length < 3) {
      useCases.push({
        title: 'Organizational Effectiveness',
        description: 'Enhance overall organizational performance and efficiency'
      });
    }
    return useCases.slice(0, 3); // Limit to 3 use cases
  };
  // Get implementation steps based on tool properties
  const getImplementationSteps = () => {
    const steps = [];
    if (tool.title.toLowerCase().includes('template')) {
      steps.push({
        title: 'Template Selection',
        description: 'Select and customize the template for your specific performance management needs'
      });
      steps.push({
        title: 'Process Mapping',
        description: 'Map your existing performance processes to the template structure'
      });
      steps.push({
        title: 'Configuration',
        description: 'Configure analytics and reporting parameters'
      });
      steps.push({
        title: 'Testing',
        description: 'Test with historical performance data to validate accuracy'
      });
      steps.push({
        title: 'Deployment',
        description: 'Deploy to production environment'
      });
    } else if (tool.title.toLowerCase().includes('dashboard')) {
      steps.push({
        title: 'KPI Definition',
        description: 'Identify key performance metrics and KPIs to monitor'
      });
      steps.push({
        title: 'Data Connection',
        description: 'Connect performance data sources to the dashboard'
      });
      steps.push({
        title: 'Visualization Setup',
        description: 'Configure visualization and reporting preferences'
      });
      steps.push({
        title: 'Alert Configuration',
        description: 'Set up alerts and notifications for key thresholds'
      });
      steps.push({
        title: 'Stakeholder Access',
        description: 'Share dashboard with stakeholders'
      });
    } else if (tool.aiPowered) {
      steps.push({
        title: 'Data Preparation',
        description: 'Prepare historical performance data for AI training'
      });
      steps.push({
        title: 'AI Configuration',
        description: 'Configure AI parameters and performance optimization goals'
      });
      steps.push({
        title: 'Model Training',
        description: 'Train the model with your performance data'
      });
      steps.push({
        title: 'Validation',
        description: 'Validate recommendations against expert knowledge'
      });
      steps.push({
        title: 'Continuous Learning',
        description: 'Implement continuous learning and improvement'
      });
    } else {
      steps.push({
        title: 'Scope Definition',
        description: 'Define performance management objectives and scope'
      });
      steps.push({
        title: 'Data Collection',
        description: 'Gather and prepare performance data from source systems'
      });
      steps.push({
        title: 'Tool Configuration',
        description: 'Configure the tool according to your specific performance requirements'
      });
      steps.push({
        title: 'Analysis',
        description: 'Analyze results and identify improvement opportunities'
      });
      steps.push({
        title: 'Implementation',
        description: 'Implement performance management changes and monitor outcomes'
      });
    }
    return steps;
  };
  // Get features list based on tool properties
  const getFeatures = () => {
    const features = [];
    if (tool.feature) {
      features.push({
        icon: <BarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: tool.feature,
        description: `Advanced ${tool.feature.toLowerCase()} capabilities`
      });
    }
    if (tool.aiPowered) {
      features.push({
        icon: <PieChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'AI-powered analytics',
        description: 'Intelligent insights and performance recommendations powered by machine learning'
      });
    }
    if (tool.realTime) {
      features.push({
        icon: <Clock className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Real-time monitoring',
        description: 'Live tracking and analysis of performance metrics'
      });
    }
    if (tool.integration) {
      features.push({
        icon: <Share2 className="h-5 w-5 text-[#FECC0E]" />,
        title: `${tool.integration} integration`,
        description: `Seamless connectivity with ${tool.integration} systems and data`
      });
    }
    if (tool.title.toLowerCase().includes('dashboard')) {
      features.push({
        icon: <PieChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Interactive dashboards',
        description: 'Customizable visual displays of key performance metrics and KPIs'
      });
    }
    if (tool.title.toLowerCase().includes('evaluation')) {
      features.push({
        icon: <FileBarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Evaluation templates',
        description: 'Standardized frameworks for consistent performance evaluations'
      });
    }
    if (tool.title.toLowerCase().includes('feedback')) {
      features.push({
        icon: <Users className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Feedback management',
        description: 'Tools for capturing, tracking, and analyzing performance feedback'
      });
    }
    // Add more generic features if needed
    if (features.length < 4) {
      features.push({
        icon: <Calendar className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Performance cycles',
        description: 'Configurable performance review cycles and timelines'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <FileBarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Goal tracking',
        description: 'Track progress against individual and team performance goals'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <BarChart className="h-5 w-5 text-[#FECC0E]" />,
        title: 'Performance metrics',
        description: 'Comprehensive measurements of individual and team performance'
      });
    }
    if (features.length < 4) {
      features.push({
        icon: <Users className="h-5 w-5 text-[#FECC0E]" />,
        title: 'User-friendly interface',
        description: 'Intuitive design that requires minimal training to use effectively'
      });
    }
    return features;
  };
  // Generate specifications based on tool properties
  const getSpecifications = () => {
    const specs = [];
    if (tool.complexity) {
      specs.push({
        name: 'Complexity Level',
        value: tool.complexity
      });
    }
    if (tool.riskLevel) {
      specs.push({
        name: 'Risk Level',
        value: tool.riskLevel
      });
    }
    if (tool.easeOfUse) {
      specs.push({
        name: 'Ease of Use',
        value: tool.easeOfUse
      });
    }
    if (tool.department) {
      specs.push({
        name: 'Target Department',
        value: tool.department
      });
    }
    if (tool.integration) {
      specs.push({
        name: 'Primary Integration',
        value: tool.integration
      });
    }
    if (tool.metric) {
      specs.push({
        name: 'Key Metric',
        value: tool.metric
      });
    }
    if (tool.realTime !== null && tool.realTime !== undefined) {
      specs.push({
        name: 'Real-Time Capability',
        value: tool.realTime ? 'Yes' : 'No'
      });
    }
    if (tool.aiPowered !== null && tool.aiPowered !== undefined) {
      specs.push({
        name: 'AI-Powered',
        value: tool.aiPowered ? 'Yes' : 'No'
      });
    }
    // Add generic specs if we don't have enough
    if (specs.length < 4) {
      specs.push({
        name: 'Implementation Time',
        value: tool.complexity === 'High' ? '4-6 weeks' : tool.complexity === 'Medium' ? '2-4 weeks' : '1-2 weeks'
      });
    }
    if (specs.length < 4) {
      specs.push({
        name: 'Support Level',
        value: 'Standard'
      });
    }
    if (specs.length < 4) {
      specs.push({
        name: 'Updates Frequency',
        value: 'Quarterly'
      });
    }
    return specs;
  };
  // Generate FAQs based on tool properties
  const getFAQs = () => {
    const faqs = [];
    // Who can use this tool?
    faqs.push({
      question: 'Who can use this tool?',
      answer: tool.department ? `This tool is designed primarily for ${tool.department} teams, but can be utilized by other departments with appropriate permissions.` : tool.industry ? `This tool is designed for performance management professionals in the ${tool.industry} industry, particularly those involved in employee evaluation and development.` : 'This tool is designed for HR professionals, managers, and team leaders looking to optimize performance management processes and drive employee development.'
    });
    // What data is required?
    faqs.push({
      question: 'What data is required to use this tool?',
      answer: tool.realTime ? 'This tool requires access to real-time performance data, including employee metrics, goals, and feedback information.' : 'This tool requires historical performance data, including employee metrics, past evaluations, and goal achievement information.'
    });
    // How long does implementation take?
    faqs.push({
      question: 'How long does implementation typically take?',
      answer: tool.complexity === 'High' ? 'Implementation typically takes 4-6 weeks, including data preparation, configuration, testing, and user training.' : tool.complexity === 'Medium' ? 'Implementation typically takes 2-4 weeks, including data preparation, configuration, and user training.' : 'Implementation typically takes 1-2 weeks, including basic setup and user training.'
    });
    // What technical expertise is required?
    faqs.push({
      question: 'What technical expertise is required?',
      answer: tool.easeOfUse === 'Advanced' ? 'This tool requires advanced knowledge of performance management concepts and some data analysis skills.' : tool.easeOfUse === 'Intermediate' ? 'This tool requires basic understanding of performance management concepts but is designed to be accessible to non-technical users with proper training.' : 'This tool is designed to be user-friendly and requires minimal technical expertise to operate effectively.'
    });
    // What are the main benefits?
    faqs.push({
      question: 'What are the main benefits of using this tool?',
      answer: tool.aiPowered ? 'The main benefits include AI-powered insights, automated performance tracking, predictive analytics, and data-driven decision making for performance management.' : 'The main benefits include increased performance transparency, identification of development opportunities, efficiency improvements, and data-driven decision making for talent management.'
    });
    return faqs;
  };
  // Generate tool benefits
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
  // Helper function to get icon based on feature
  const getFeatureIcon = (feature: string | null) => {
    if (feature === 'Analytics') {
      return <PieChart className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Heatmap') {
      return <BarChart className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Strategy Alignment') {
      return <FileBarChart className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Collaboration') {
      return <Users className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Lifecycle Tracking') {
      return <Calendar className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Alerts') {
      return <Bell className="h-24 w-24 text-gray-400" />;
    } else if (feature === 'Training') {
      return <Star className="h-24 w-24 text-gray-400" />;
    } else {
      return <BarChart className="h-24 w-24 text-gray-400" />;
    }
  };
  return <div className="bg-gray-50 min-h-screen pb-16">
      {/* Comparison panel */}
      <ComparisonPanel selectedTools={comparisonTools} removeFromComparison={removeFromComparison} clearComparison={clearComparison} openComparisonModal={openComparisonModal} />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${comparisonTools.length > 0 ? 'pt-28' : 'pt-8'}`}>
        {/* Back button */}
        <Link to="/performance-management" className="inline-flex items-center text-sm font-medium text-[#9E800D] hover:text-[#FECC0E] mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Performance Management
        </Link>
        {/* Tool banner */}
        <div className="bg-gradient-to-r from-[#FFEDA8] to-[#F4F1E3] rounded-xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-white p-4 rounded-full shadow-sm mr-6 mb-4 md:mb-0">
              {getFeatureIcon(tool.feature)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {tool.title}
              </h1>
              <p className="mt-2 text-gray-700">{tool.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.aiPowered && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100">
                    AI-Powered
                  </span>}
                {tool.realTime && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">
                    Real-Time
                  </span>}
                {tool.industry && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                    {tool.industry}
                  </span>}
                {tool.feature && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-gray-100 text-gray-800">
                    {tool.feature}
                  </span>}
              </div>
            </div>
          </div>
          {/* Tool stats and CTA in same row */}
          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              {tool.complexity && <div className="flex items-center">
                  <FileBarChart className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm text-gray-700 mr-2">
                    Complexity:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {tool.complexity}
                  </span>
                </div>}
              {tool.riskLevel && <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm text-gray-700 mr-2">
                    Risk Level:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {tool.riskLevel}
                  </span>
                </div>}
              {tool.easeOfUse && <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm text-gray-700 mr-2">
                    Ease of Use:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {tool.easeOfUse}
                  </span>
                </div>}
            </div>
            {/* CTA Button */}
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button onClick={handleAddToComparison} className={`border ${isInComparison(tool.id) ? 'border-[#FECC0E] bg-[#FECC0E]/10 text-[#9E800D]' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'} font-medium py-2 px-4 rounded-md transition-colors shadow-sm text-sm flex items-center`}>
                <Scale className="h-4 w-4 mr-2" />
                {isInComparison(tool.id) ? 'Added to Comparison' : 'Add to Comparison'}
              </button>
              <button className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm inline-flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Get Demo
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
            <button onClick={() => setActiveTab('features')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'features' ? 'border-[#9E800D] text-[#9E800D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Features
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
                        {tool.description}
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
                {/* Technical Requirements Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(2)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Technical Requirements
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
                              System Requirements
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Modern web browser (Chrome, Firefox, Edge)
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Stable internet connection</span>
                              </li>
                              {tool.integration && <li className="flex items-start">
                                  <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                  </div>
                                  <span>{tool.integration} system access</span>
                                </li>}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                              Data Requirements
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Performance data with historical metrics
                                </span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>Employee and team identifiers</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                                </div>
                                <span>
                                  Organizational structure information
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
                {/* Integrations Accordion */}
                {tool.integration && <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(3)}>
                      <h2 className="text-lg font-medium text-gray-900">
                        Integrations
                      </h2>
                      <button className="text-gray-400 hover:text-gray-500">
                        {expandedSections.includes(3) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    {expandedSections.includes(3) && <div className="px-4 pb-4">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <Share2 className="h-6 w-6 text-[#FECC0E] mr-3" />
                            <h3 className="text-base font-medium text-gray-900">
                              {tool.integration} Integration
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm">
                            This tool seamlessly integrates with{' '}
                            {tool.integration}, allowing you to leverage
                            existing performance data and workflows. The
                            integration provides automatic data synchronization,
                            unified user experience, and consistent analytics
                            across platforms.
                          </p>
                        </div>
                      </div>}
                  </div>}
              </div>}
            {activeTab === 'features' && <div className="space-y-4">
                {/* Key Features Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(4)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Key Features
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(4) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(4) && <div className="px-4 pb-4">
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
                {/* Why Choose This Tool Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(5)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Why Choose This Tool
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(5) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(5) && <div className="px-4 pb-4">
                      <div className="flex items-start mt-4">
                        <div className="flex-shrink-0">
                          <Star className="h-6 w-6 text-[#FECC0E]" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">
                            Why choose {tool.title}?
                          </h3>
                          <p className="mt-2 text-gray-600 text-sm">
                            This{' '}
                            {tool.title.toLowerCase().includes('template') ? 'template' : tool.title.toLowerCase().includes('dashboard') ? 'dashboard' : tool.title.toLowerCase().includes('analytics') ? 'analytics tool' : 'performance management tool'}{' '}
                            is designed specifically for{' '}
                            {tool.industry || tool.department || 'organizational'}{' '}
                            environments, providing{' '}
                            {tool.aiPowered ? 'intelligent, AI-powered performance insights' : 'comprehensive performance management capabilities'}
                            {tool.realTime ? ' in real-time' : ''}. With{' '}
                            {tool.feature ? `advanced ${tool.feature.toLowerCase()} functionality` : 'powerful features'}
                            , you can optimize your performance processes and{' '}
                            {tool.useCase ? `improve ${tool.useCase.toLowerCase()} workflows` : 'enhance employee and team performance'}
                            .
                          </p>
                        </div>
                      </div>
                    </div>}
                </div>
                {/* Performance Metrics Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(11)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Performance Metrics
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(11) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(11) && <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <div className="h-10 w-10 rounded-full bg-[#FECC0E]/10 flex items-center justify-center mb-3">
                            <BarChart className="h-5 w-5 text-[#FECC0E]" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">
                            Key Performance Indicators
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Track essential KPIs to measure individual and team
                            performance against goals
                          </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <div className="h-10 w-10 rounded-full bg-[#FECC0E]/10 flex items-center justify-center mb-3">
                            <PieChart className="h-5 w-5 text-[#FECC0E]" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">
                            Performance Trends
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Analyze performance trends over time to identify
                            patterns and improvement opportunities
                          </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <div className="h-10 w-10 rounded-full bg-[#FECC0E]/10 flex items-center justify-center mb-3">
                            <FileBarChart className="h-5 w-5 text-[#FECC0E]" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">
                            Benchmark Comparisons
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Compare performance against industry standards and
                            organizational benchmarks
                          </p>
                        </div>
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
                            Start with a small pilot group before full
                            organization rollout
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Involve managers and team leaders early in the
                            implementation process
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Ensure performance metrics are clearly defined and
                            understood
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Schedule regular review sessions to evaluate and
                            adjust as needed
                          </span>
                        </li>
                      </ul>
                    </div>}
                </div>
                {/* Technical Specifications Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(8)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Technical Specifications
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
                {/* Change Management Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(12)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Change Management
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(12) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(12) && <div className="px-4 pb-4">
                      <p className="text-gray-600 text-sm mt-4">
                        Implementing a new performance management tool requires
                        effective change management. Consider these key factors:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Communication Strategy
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>
                                Clear communication of benefits and expectations
                              </span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>
                                Regular updates throughout implementation
                              </span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>
                                Feedback channels for questions and concerns
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Training Approach
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>
                                Role-based training for different user groups
                              </span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>Hands-on practice sessions</span>
                            </li>
                            <li className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-[#FECC0E]/20 flex items-center justify-center mt-0.5 mr-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FECC0E]"></span>
                              </div>
                              <span>
                                Ongoing support resources and documentation
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
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
                          <Calendar className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Training
                            </h4>
                            <p className="text-sm text-gray-600">
                              Comprehensive training available for all user
                              levels
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Implementation Support
                            </h4>
                            <p className="text-sm text-gray-600">
                              Dedicated support team available during
                              implementation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileBarChart className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Documentation
                            </h4>
                            <p className="text-sm text-gray-600">
                              Comprehensive documentation and user guides
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
                {/* Best Practices Accordion */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection(13)}>
                    <h2 className="text-lg font-medium text-gray-900">
                      Best Practices
                    </h2>
                    <button className="text-gray-400 hover:text-gray-500">
                      {expandedSections.includes(13) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  {expandedSections.includes(13) && <div className="px-4 pb-4">
                      <ul className="space-y-3 mt-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Set clear, measurable performance goals aligned with
                            organizational objectives
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Provide regular feedback rather than waiting for
                            formal review cycles
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Focus on both performance outcomes and development
                            opportunities
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Use data-driven insights to inform performance
                            conversations
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#9E800D] mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">
                            Train managers on effective performance management
                            techniques
                          </span>
                        </li>
                      </ul>
                    </div>}
                </div>
              </div>}
          </div>
          {/* Sidebar - 25% width on desktop */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tool Details
                </h3>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    Performance Improvement:
                  </span>
                  <span className="text-sm font-semibold">
                    {tool.complexity === 'High' ? '95%' : tool.complexity === 'Medium' ? '85%' : '75%'}
                  </span>
                </div>
                <div className="mt-6 mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    This tool includes:
                  </h4>
                  <div className="space-y-3">
                    {features.slice(0, 3).map((feature, index) => <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-3 text-green-500">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700 text-sm">
                          {feature.title}
                        </span>
                      </div>)}
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <button className="w-full bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-3 px-6 rounded-md transition-colors shadow-sm text-base flex items-center justify-center">
                    Request Demo
                  </button>
                  <button onClick={handleAddToComparison} className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors shadow-sm text-base flex items-center justify-center">
                    <Scale className="h-4 w-4 mr-2" />
                    {isInComparison(tool.id) ? 'Remove from Comparison' : 'Add to Comparison'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related Tools Section */}
        {relatedTools.length > 0 && <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTools.map(relatedTool => <Link key={relatedTool.id} to={`/performance-management/${relatedTool.id}`} className="group">
                  <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:border-[#FECC0E] hover:shadow-md group-hover:border-l-4 group-hover:border-[#FECC0E]">
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-1 overflow-hidden group-hover:text-[#9E800D]">
                        {relatedTool.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-8 flex-grow line-clamp-3 overflow-hidden">
                        {relatedTool.description}
                      </p>
                      {/* Divider line */}
                      <div className="border-t border-gray-100 pt-4 mt-auto flex justify-between items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {relatedTool.industry || relatedTool.useCase || relatedTool.feature || 'Performance Management'}
                        </span>
                        <span className="text-sm font-normal text-[#9E800D] group-hover:text-[#FECC0E] transition-colors flex items-center">
                          View details{' '}
                          <ChevronRight size={16} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>)}
            </div>
          </div>}
      </div>
      {/* Comparison modal */}
      <ComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} selectedTools={comparisonTools} />
    </div>;
};
export default PerformanceManagementDetails;