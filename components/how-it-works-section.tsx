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
    <section className="min-h-fit p-5 mt-5  flex items-center justify-center bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-paragraph">
            Start your working journey in Australia with our simple three-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-full mx-auto">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-blue-200 z-0" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12 relative z-10">
            {steps.map((step, index) => (


              <div key={index} className="text-center flex flex-col items-center">

                
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-400 flex items-center justify-center bg-white mb-4 sm:mb-6">
                  <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base max-w-sm sm:max-w-xs">
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
