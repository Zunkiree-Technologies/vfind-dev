"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[auto] lg:h-[calc(100vh-64px)] bg-white overflow-hidden py-12 sm:py-16 lg:py-0">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* Left Content */}
          <div className="space-y-6">
            {/* Main Headline - Two line contrasting style */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.1] tracking-[-0.02em]">
              <span className="text-gray-900">Get Discovered.</span>
              <br />
              <span className="text-gray-500 sm:whitespace-nowrap">By Healthcare Employers.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
              Create your free profile and let Australia&apos;s top healthcare recruiters find you — including visa sponsors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-200"
              >
                CREATE FREE PROFILE
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-gray-900 text-sm font-bold tracking-wider uppercase rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                HOW IT WORKS
              </Link>
            </div>

            {/* Trust indicators - Rating style */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              {/* Google Rating */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">4.9</span>
                <span className="text-gray-500 text-sm">on Google</span>
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center ml-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>

              {/* Trustpilot Rating */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">4.8</span>
                <span className="text-gray-500 text-sm">on Trustpilot</span>
                <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center ml-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00B67A"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="hidden lg:flex items-end justify-center h-[calc(100vh-64px)] absolute right-8 bottom-0">
            <Image
              src="/assets/hero-nurse-nobg.png"
              alt="Healthcare professional"
              width={580}
              height={750}
              className="object-contain object-bottom max-h-[105%] -scale-x-100"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
};
