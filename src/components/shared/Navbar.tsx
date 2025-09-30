import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X, Globe, ChevronDown, FileText, BookOpen, ClipboardList, Check, BarChart2, LineChart, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();
  const exploreRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <div className="fixed top-0 z-50 w-full flex justify-center px-4 pt-4">
      <nav className={`${scrolled ? 'bg-white shadow-lg' : 'bg-white'} rounded-xl w-full max-w-7xl transition-all duration-300`}>
        <div className="px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo_black.svg" alt="SAIB Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <div className="flex space-x-8">
                {/* Explore Dropdown */}
                <div ref={exploreRef} className="relative">
                  <button onClick={() => setIsExploreOpen(!isExploreOpen)} className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-[#FECC0E] transition-colors">
                    {t('explore')}
                    <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isExploreOpen && <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('exploreSAIB')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t('exploreCatalog')}
                        </p>
                      </div>
                      <div className="py-2 overflow-y-auto" style={{
                    maxHeight: '360px'
                  }}>
                        <Link to="/services" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('services')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('browseServices')}
                            </p>
                          </div>
                        </Link>
                        <Link to="/regulations" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('regulations')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('accessRegulations')}
                            </p>
                          </div>
                        </Link>
                        <Link to="/documents" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('policiesProcedures')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('findLatestDocuments')}
                            </p>
                          </div>
                        </Link>
                        <Link to="/process-mining" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <BarChart2 className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('processMining')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('analyzeProcesses')}
                            </p>
                          </div>
                        </Link>
                        <Link to="/performance-management" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <LineChart className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('performanceManagement')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('trackKPIs')}
                            </p>
                          </div>
                        </Link>
                        <Link to="/risk-management" className="flex items-start p-4 hover:bg-gray-50" onClick={() => setIsExploreOpen(false)}>
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#FECC0E]/10 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-[#9E800D]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {t('riskManagement')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('identifyRisks')}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>}
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-6">
                {/* Language Dropdown */}
                <div ref={languageRef} className="relative">
                  <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Change language">
                    <Globe size={20} />
                  </button>
                  {isLanguageOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
                      <div className="py-1">
                        <button onClick={() => {
                      setLanguage('en');
                      setIsLanguageOpen(false);
                    }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <span className="flex-1 text-left">
                            {t('english')}
                          </span>
                          {language === 'en' && <Check size={16} className="text-[#9E800D]" />}
                        </button>
                        <button onClick={() => {
                      setLanguage('ar');
                      setIsLanguageOpen(false);
                    }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <span className="flex-1 text-left">
                            {t('arabic')}
                          </span>
                          {language === 'ar' && <Check size={16} className="text-[#9E800D]" />}
                        </button>
                      </div>
                    </div>}
                </div>
                <button className="p-2 rounded-full text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                </button>
                <button className="border border-[#FECC0E] text-[#FECC0E] hover:bg-[#FECC0E]/5 px-5 py-2 rounded-md text-sm font-medium transition-all duration-200">
                  {t('signIn')}
                </button>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FECC0E]">
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && <div className="md:hidden bg-white rounded-b-xl shadow-lg absolute top-16 left-0 right-0">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Explore Section */}
              <div className="px-3 py-2 text-base font-medium text-gray-900">
                {t('exploreSAIB')}
              </div>
              <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('services')}
                </div>
              </Link>
              <Link to="/regulations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('regulations')}
                </div>
              </Link>
              <Link to="/documents" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('policiesProcedures')}
                </div>
              </Link>
              <Link to="/process-mining" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('processMining')}
                </div>
              </Link>
              <Link to="/performance-management" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('performanceManagement')}
                </div>
              </Link>
              <Link to="/risk-management" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-[#9E800D]" />
                  {t('riskManagement')}
                </div>
              </Link>
              <div className="px-3 py-2 text-base font-medium text-gray-900 mt-4">
                {t('language')}
              </div>
              <button onClick={() => {
            setLanguage('en');
            setIsMenuOpen(false);
          }} className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6">
                <span>{t('english')}</span>
                {language === 'en' && <Check size={16} className="text-[#9E800D]" />}
              </button>
              <button onClick={() => {
            setLanguage('ar');
            setIsMenuOpen(false);
          }} className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 pl-6">
                <span>{t('arabic')}</span>
                {language === 'ar' && <Check size={16} className="text-[#9E800D]" />}
              </button>
              <div className="mt-4 flex space-x-2 px-3">
                <button className="p-2 rounded-full text-gray-900 hover:bg-gray-100">
                  <Globe size={20} />
                </button>
                <button className="p-2 rounded-full text-gray-900 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 pb-2">
                <button className="w-full border border-[#FECC0E] text-[#FECC0E] hover:bg-[#FECC0E]/5 px-4 py-2 rounded-md text-sm font-medium">
                  {t('signIn')}
                </button>
              </div>
            </div>
          </div>}
      </nav>
    </div>;
};
export default Navbar;