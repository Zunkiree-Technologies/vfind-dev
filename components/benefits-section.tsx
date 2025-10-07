"use client";
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
    <section className="w-screen bg-white py-10 sm:py-14 lg:py-20 flex items-center justify-center">
      <div className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold  font-bold text-black mb-4">
            Why Choose <span className="text-primary">Vfind</span>?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to helping nurses build successful careers in Australia’s thriving healthcare system.
          </p>
        </div>

        {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              
              {/* Icon Circle */}
              <div className="bg-blue-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center">
                <benefit.icon className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm sm:text-base max-w-[260px]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
