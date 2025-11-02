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
    <section className="py-16 md:py-20 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
            What we <span className="text-[#61A6FA]">Do</span>?
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-center">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4"
            >
              {/* Icon Circle */}
              <div className="bg-blue-100 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[138px] lg:h-[138px] rounded-full flex items-center justify-center">
                <benefit.icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[62px] lg:w-[62px] text-[#61A6FA]" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl md:text-[22px] font-medium text-gray-900">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-[16px] text-gray-600 font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
