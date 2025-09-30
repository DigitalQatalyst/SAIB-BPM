import React from 'react';
import Hero from '../components/landing/Hero';
import ServicePreview from '../components/landing/ServicePreview';
import PoliciesProcedures from '../components/landing/PoliciesProcedures';
import FeaturesOverview from '../components/landing/FeaturesOverview';
import HowItWorks from '../components/landing/HowItWorks';
const LandingPage = () => {
  return <div className="bg-white">
      <Hero />
      <ServicePreview />
      <PoliciesProcedures />
      <FeaturesOverview />
      <HowItWorks />
    </div>;
};
export default LandingPage;