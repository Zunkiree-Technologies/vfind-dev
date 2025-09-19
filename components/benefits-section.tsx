import React from 'react';
import { Building2, Globe, UsersRound } from 'lucide-react';

const benefits = [
  {
    icon: UsersRound,
    title: 'For Nurses',
    description: 'Free access to jobs tailored to your skills and location.'
  },
 
  {
    icon: Building2,
    title: 'For Employers',
    description: 'Faster hiring with verified candidate profiles.'
  },
  {
    icon: Globe,
    title: 'For Everyone',
    description: 'Privacy-first platform where contact details are protected.'
  }
];

export const BenefitsSection = () => {
  return (
        <section className="min-h-fit p-4 flex items-center justify-center ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-4xl font-bold text-black text-healthcare-navy  mb-6">
            Why Choose  <span className="text-[#61A6FA]">Vfind</span>?
          </h2>
          <p className="text-xl text-healthcare-gray max-w-2xl mx-auto">
            We are committed to helping nurses build successful careers in Australia thriving healthcare system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
  {benefits.map((benefit, index) => (
    <div 
      key={index} 
      className="flex flex-col items-center space-y-4"
    >
      {/* Icon Circle */}
      <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center">
        <benefit.icon className="h-10 w-10 text-[#61A6FA]" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        {benefit.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm max-w-[260px]">
        {benefit.description}
      </p>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};