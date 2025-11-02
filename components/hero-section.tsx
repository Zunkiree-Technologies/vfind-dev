"use client";
import React from "react";
import { SearchBar } from "@/components/ui/search-bar";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 flex items-center justify-center overflow-hidden bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row items-center justify-between w-full">

        {/* Left Content */}
        <div className="flex-1 text-center xl:text-left space-y-6 sm:space-y-8 w-full max-w-4xl flex flex-col justify-center py-8 sm:py-12 md:py-16">

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight px-2">
            Find Your{" "}
            <span className="text-primary">Nursing</span> <br />
            <span className="text-primary">Job</span> in{" "}
            <span className="">Australia</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-xxl text-[#717376] leading-relaxed px-2 max-w-2xl mx-auto xl:mx-0">
            VFind helps nurses and healthcare professionals find the right jobs,
            while making it easier for aged care providers to hire the right
            people—fast, secure, and reliable.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto xl:mx-0 px-2">
            <SearchBar />
          </div>
        </div>

        {/* Right Illustration - Hidden on mobile, tablet, and iPad */}
        <div className="flex-1 flex justify-center xl:justify-end relative hidden xl:flex">
          <div className="relative w-[482px] h-[533px]">
            <Image
              src="/assets/landing.png"
              alt="Nurse illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};