import React, { useState } from 'react';
import { Send, Phone, Mail, Clock, Plus, Minus } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - would connect to backend in production
    console.log('Form submitted:', formData);
    alert('Your support request has been submitted. We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    });
  };
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  const faqItems = [{
    question: 'How long does it take to process a policy request?',
    answer: 'Standard policy requests are typically processed within 5-7 business days. Complex requests may take longer depending on the scope and required approvals.'
  }, {
    question: 'Who can submit policy and procedure requests?',
    answer: "Department heads and authorized representatives can submit formal requests. If you're unsure about your authorization status, please contact your department administrator."
  }, {
    question: 'How do I track the status of my request?',
    answer: 'You can track the status of your request through the "Track Requests" section in your dashboard. All updates will be reflected there in real-time.'
  }, {
    question: 'Can I expedite a policy request?',
    answer: 'Yes, urgent requests can be expedited. Please indicate the urgency in your request form and provide justification. Our team will prioritize accordingly.'
  }];
  return <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
          <p className="mt-2 text-lg text-gray-600">
            Need help? Our team is ready to assist you with any questions or
            issues.
          </p>
        </div>
        {/* Contact Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Support Category
                </label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required>
                  <option value="">Select a category</option>
                  <option value="policy_request">Policy Request Help</option>
                  <option value="procedure_question">Procedure Question</option>
                  <option value="technical_issue">Technical Issue</option>
                  <option value="account_access">Account Access</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required></textarea>
              </div>
              <div className="text-right">
                <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]">
                  Submit Request
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-3">
                <Phone className="h-5 w-5 text-[#FECC0E]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Phone Support
              </h3>
            </div>
            <p className="text-gray-600 mb-2">
              Call our dedicated support line
            </p>
            <p className="text-gray-900 font-medium">+966 11 234 5678</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-[#FECC0E]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Email Support
              </h3>
            </div>
            <p className="text-gray-600 mb-2">Send us an email anytime</p>
            <p className="text-gray-900 font-medium">support@saib-pp.com</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#FECC0E]/10 rounded-full flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-[#FECC0E]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Business Hours
              </h3>
            </div>
            <p className="text-gray-600 mb-2">We're available</p>
            <p className="text-gray-900 font-medium">
              Sun-Thu: 8:00 AM - 4:00 PM
            </p>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <button onClick={() => toggleFaq(index)} className="flex items-center justify-between w-full text-left py-2 focus:outline-none">
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <div className="w-6 h-6 bg-[#FECC0E]/10 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                      {expandedFaqs.includes(index) ? <Minus className="h-4 w-4 text-[#FECC0E]" /> : <Plus className="h-4 w-4 text-[#FECC0E]" />}
                    </div>
                  </button>
                  {expandedFaqs.includes(index) && <div className="mt-2 text-gray-600 pl-0">{faq.answer}</div>}
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Support;