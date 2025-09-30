import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, HelpCircle, FileText, BookOpen, FileQuestion, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
const Footer = () => {
  const {
    t
  } = useLanguage();
  const currentYear = new Date().getFullYear();
  return <footer className="bg-[#666666] text-white relative z-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo_white.svg" alt="SAIB Logo" className="h-8 w-auto" />
              <span className="ml-3 text-lg font-semibold">BPM Platform</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {t('streamliningPolicy')}
            </p>
            <div className="mt-4">
              <div className="flex items-center">
                <input type="email" placeholder="Enter your email" className="py-2 px-3 text-sm text-gray-900 bg-white rounded-l-md focus:outline-none" />
                <button className="bg-[#FECC0E] hover:bg-[#e6b800] text-gray-900 py-2 px-4 text-sm font-medium rounded-r-md">
                  {t('subscribe')}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              {t('aboutPlatform')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('aboutPlatform')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('faqs')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              {t('resources')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('policiesProcedures')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('templates')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('guidelines')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('trainingMaterials')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              {t('supportLegal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('contactSupport')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('submitFeedback')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  {t('termsOfUse')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {currentYear} Saudi Investment Bank. {t('allRightsReserved')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-gray-300 hover:text-white">
              <div className="flex items-center">
                <Mail size={16} className="mr-1" />
                <span>support@saib.com</span>
              </div>
            </Link>
            <Link to="/" className="text-sm text-gray-300 hover:text-white">
              <div className="flex items-center">
                <Phone size={16} className="mr-1" />
                <span>+966 11 000 0000</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;