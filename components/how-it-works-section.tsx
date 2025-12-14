"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Add your qualifications, certifications, and preferences. Takes 5 minutes. No resume needed.",
    image: "/assets/step-1-profile.jpg",
  },
  {
    number: "02",
    title: "Get discovered",
    description:
      "Healthcare employers browse our talent network. Your profile appears in searches matching your skills.",
    image: "/assets/step-2-discover.jpg",
  },
  {
    number: "03",
    title: "Connect & respond",
    description:
      "Employers send connection requests directly to you. Review and respond on your terms.",
    image: "/assets/step-3-connect.jpg",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned like AssessFirst */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="font-secondary text-sm text-gray-500">Simple process</span>
          </div>
          <h2 className="font-primary text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            3 simple steps
            <br />
            <span className="text-gray-400">to get discovered</span>
          </h2>
        </div>

        {/* Steps Grid - AssessFirst style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[320px] flex flex-col group"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${step.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
                {/* Step Number & Title */}
                <div className="mb-auto">
                  <span className="font-primary text-3xl sm:text-4xl font-bold text-white/40">
                    {step.number}
                  </span>
                  <h3 className="font-primary text-lg sm:text-xl font-semibold text-white mt-1">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-secondary text-white/80 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-primary font-semibold rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Your Free Profile
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="font-secondary mt-4 text-sm text-gray-500">
            Takes 5 minutes. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};
