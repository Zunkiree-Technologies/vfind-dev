"use client";
import React from "react";
import Link from "next/link";

export const InternationalNursesSection = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-gray-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Two-line headline */}
          <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="text-white">Visa sponsorship made simple</span>
            <br />
            <span className="text-gray-500">for international nurses.</span>
          </h2>

          {/* Subtitle */}
          <p className="font-secondary text-gray-400 text-lg sm:text-xl mb-4 max-w-2xl mx-auto">
            Finding employers who sponsor 482 and 494 visas shouldn&apos;t feel impossible.
          </p>
          <p className="font-secondary text-gray-500 mb-10">
            Let sponsors find you — no more guessing.
          </p>

          {/* CTA Button */}
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold uppercase tracking-wider rounded-full shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Join Talent Network
          </Link>
        </div>
      </div>
    </section>
  );
};
