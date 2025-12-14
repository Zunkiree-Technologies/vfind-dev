"use client";
import React from "react";
import { Target, Mail, Globe, Shield } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "One Profile, All Employers",
    description:
      "Build once. Be discovered by hospitals, aged care, clinics—all actively hiring.",
  },
  {
    icon: Mail,
    title: "Employers Reach Out to You",
    description:
      "Get connection requests directly from recruiters interested in YOUR qualifications.",
  },
  {
    icon: Globe,
    title: "Visa Sponsorship Visibility",
    description:
      "International nurse? Employers seeking sponsored talent can find you.",
  },
  {
    icon: Shield,
    title: "You're in Control",
    description:
      "Choose who sees your profile. Hide from current employers. Respond when ready.",
  },
];

export const WhyVfindSection = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned like How It Works */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="font-secondary text-sm text-gray-500">Why VFind</span>
          </div>
          <h2 className="font-primary text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Why nurses choose VFind
            <br />
            <span className="text-gray-400">Stop applying. Start getting discovered.</span>
          </h2>
        </div>

        {/* Benefits Grid - AssessFirst benefits_component style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#f8f8fa] rounded-3xl p-8 sm:p-10 min-h-[220px] flex flex-col border border-gray-100"
            >
              {/* Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100">
                  <benefit.icon className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-primary text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="font-secondary text-gray-500 text-base leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
