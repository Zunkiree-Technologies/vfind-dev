"use client";
import React from "react";
import Link from "next/link";

export const FinalCtaSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline - Two line style */}
        <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-10">
          <span className="text-gray-900">Ready to get discovered</span>
          <br />
          <span className="text-gray-400">by top employers?</span>
        </h2>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold uppercase tracking-wider rounded-full shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Create Free Profile
        </Link>
      </div>
    </section>
  );
};
