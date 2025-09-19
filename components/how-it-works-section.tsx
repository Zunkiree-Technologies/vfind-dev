"use client";
import React from "react";
import { UserPlus, FileText, Briefcase } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Create your profile and upload your nursing credentials and experience.",
  },
  {
    icon: FileText,
    title: "Apply",
    description:
      "Browse and apply to nursing positions that match your skills and preferences.",
  },
  {
    icon: Briefcase,
    title: "Get Hired",
    description:
      "Connect with employers, complete interviews, and start your nursing career in Australia.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="min-h-[746px] bg-[#F8FAFD] flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Start your working journey in Australia with our simple three-step
            process.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto relative">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-blue-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center flex flex-col items-center"
              >
                {/* Circle with Icon */}
                <div className="w-20 h-20 rounded-full border-2 border-blue-400 flex items-center justify-center bg-white mb-6">
                  <step.icon className="h-8 w-8 text-blue-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
