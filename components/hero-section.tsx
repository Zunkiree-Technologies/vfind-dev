"use client";
import React from "react";
import { SearchBar } from "@/components/ui/search-bar";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section
      className="relative min-h-[576px] flex items-center justify-center overflow-hidden bg-[#F8FAFD]"
    >
      <div className="container mx-auto px-10 lg:px-1 flex flex-col lg:flex-row items-center justify-between ">

        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-4xl h-[415px]  flex flex-col justify-center">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Find Your{" "}
            <span className="text-[#61A6FA]">Nursing</span> <br />
            <span className="text-[#61A6FA]">Job</span> in{" "}
            <span className="text-black">Australia</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl lg:text-2xl leading-relaxed">
            VFind helps nurses and healthcare professionals find the right jobs,
            while making it easier for aged care providers to hire the right
            people—fast, secure, and reliable.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl h-[90px] mx-auto lg:mx-0">
            <SearchBar />
          </div>
        </div>


        {/* Right Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end relative hidden sm:flex">


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
