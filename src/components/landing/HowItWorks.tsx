import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
const HowItWorks = () => {
  const {
    t
  } = useLanguage();
  return <div className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-700 mb-3">
            {t('howItWorksSubtitle')}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-5">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {t('howItWorksDescription')}
          </p>
        </div>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#FECC0E] transform -translate-x-1/2"></div>
          {/* Step 1 - Left side */}
          <div className="relative mb-32 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="md:pr-16 text-right">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('submitRequest')}
              </h3>
              <p className="text-base text-gray-600">
                {t('submitRequestDesc')}
              </p>
            </div>
            <div className="flex justify-center md:justify-start mt-8 md:mt-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FECC0E] text-gray-900 font-bold text-xl relative z-10">
                1
              </div>
            </div>
          </div>
          {/* Step 2 - Right side */}
          <div className="relative mb-32 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="flex justify-center md:justify-end order-2 md:order-1 mt-8 md:mt-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FECC0E] text-gray-900 font-bold text-xl relative z-10">
                2
              </div>
            </div>
            <div className="md:pl-16 order-1 md:order-2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('trackProgress')}
              </h3>
              <p className="text-base text-gray-600">
                {t('trackProgressDesc')}
              </p>
            </div>
          </div>
          {/* Step 3 - Left side */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="md:pr-16 text-right">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('receiveReview')}
              </h3>
              <p className="text-base text-gray-600">
                {t('receiveReviewDesc')}
              </p>
            </div>
            <div className="flex justify-center md:justify-start mt-8 md:mt-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FECC0E] text-gray-900 font-bold text-xl relative z-10">
                3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HowItWorks;