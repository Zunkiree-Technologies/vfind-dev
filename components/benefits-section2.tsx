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
    <section className="min-h-[505px] flex items-center justify-center bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]
">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-[32px] md:text-4xl font-semibold leading-tight">
            What we <span className="text-[#61A6FA]">Do</span>?
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4"
            >
              {/* Icon Circle */}
              <div className="bg-blue-100 w-[138px] h-[138px] rounded-full flex items-center justify-center">
                <benefit.icon className="h-[62px] w-[62px] text-[#61A6FA]" />
              </div>

              {/* Title */}
              <h3 className="text-[22px] font-medium  text-gray-900">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-[16px] text-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
