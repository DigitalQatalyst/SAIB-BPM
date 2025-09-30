import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
const Hero = () => {
  const {
    t
  } = useLanguage();
  return <div className="relative bg-[#FFF8E1] overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large primary blob */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#FECC0E]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        {/* Secondary blobs with different colors */}
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-amber-100 rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-[450px] h-[450px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[70px] opacity-50 animate-blob animation-delay-4000"></div>
        {/* Additional smaller decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-[200px] h-[200px] bg-amber-50 rounded-full mix-blend-overlay filter blur-[40px] opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-[#FECC0E]/10 rounded-full mix-blend-overlay filter blur-[50px] opacity-30"></div>
        {/* Gradient patches */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-amber-50/30 to-transparent opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-full h-[200px] bg-gradient-to-t from-amber-50/20 to-transparent opacity-30"></div>
        {/* Horizontal gradient streaks */}
        <div className="absolute top-1/3 left-0 w-full h-[100px] bg-gradient-to-r from-amber-100/20 via-[#FECC0E]/10 to-amber-50/10 opacity-50 transform -rotate-1"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[80px] bg-gradient-to-r from-amber-50/10 via-[#FECC0E]/15 to-amber-100/20 opacity-40 transform rotate-1"></div>
      </div>
      {/* Enhanced dotted pattern overlay with better visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 mix-blend-multiply"></div>
      {/* Subtle diagonal lines pattern */}
      <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'linear-gradient(45deg, #FECC0E 1px, transparent 1px), linear-gradient(-45deg, #FECC0E 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      backgroundPosition: 'center center'
    }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32 relative z-10">
        <div className="text-center mx-auto">
          {/* Hero Title */}
          <h1 className="text-4xl tracking-normal font-semibold text-gray-900 sm:text-5xl md:text-6xl leading-loose max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>
          {/* Subtitle */}
          <p className="mt-8 text-base text-gray-700 sm:text-lg max-w-2xl mx-auto leading-tight">
            {t('heroSubtitle')}
          </p>
          {/* Buttons */}
          <div className="mt-10 flex justify-center space-x-6">
            <Link to="/services" className="bg-[#FECC0E] text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-[#FECC0E]/90 transition-all duration-300 shadow-md hover:shadow-lg">
              {t('getStarted')}
            </Link>
            <Link to="/track-requests" className="border border-gray-300 bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
              {t('trackRequestsBtn')}
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;