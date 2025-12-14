"use client";
import React from "react";
import { Target, Mail, Globe, Shield } from "lucide-react";

const valueProps = [
  {
    icon: Target,
    title: "One Profile, All Employers",
    description: "Build once. Be discovered by hospitals, aged care, clinics—all actively hiring.",
  },
  {
    icon: Mail,
    title: "Employers Reach Out to You",
    description: "Get connection requests directly from recruiters interested in YOUR qualifications.",
  },
  {
    icon: Globe,
    title: "Visa Sponsorship Visibility",
    description: "International nurse? Employers seeking sponsored talent can find you.",
  },
  {
    icon: Shield,
    title: "You're in Control",
    description: "Choose who sees your profile. Hide from current employers. Respond when ready.",
  },
];

export const ValuePropositionStrip = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Why Nurses Choose VFind
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stop applying. Start getting discovered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-pink-100 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 group-hover:bg-pink-100 mb-5 transition-colors duration-300">
                <prop.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {prop.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
