"use client";

import React from "react";
import { BenefitsSection } from "../../../components/benefits-section2";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

// Public components
import NavbarPublic from "../../../components/navbar";
import FooterPublic from "../../../components/footer-section";

// Logged-in components
import { Navbar as NurseNavbar } from "../nurseProfile/components/Navbar";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";
import FooterPrivate from "../Admin/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main>
      {/* Conditional Navbar based on user role */}
      {!isAuthenticated ? (
        <NavbarPublic />
      ) : user.role === "Employer" ? (
        <EmployerNavbar />
      ) : (
        <NurseNavbar />
      )}

      {/* --------------------------other section about vfind---------------------- */}
      <section
        className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8 max-w-4xl flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              About <span className="text-[#61A6FA]">VFind</span> <br />
            </h1>

            <p className="text-base md:text-xl font-medium text-[#646465]">
              VFind is a trusted healthcare recruitment platform built to connect nurses and healthcare professionals with the right career opportunities in Australia. We simplify the hiring process for aged care providers and hospitals, making recruitment faster, secure, and reliable.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <div className="hidden sm:flex relative w-[388px] h-[336px] lg:w-[450px] lg:h-[390px]">
              <Image
                src="/assets/About1.png"
                alt="Nurse illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 388px, 450px"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------other section- who we are--------------------- */}

      <section className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left Image */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="hidden sm:flex relative w-[388px] h-[336px] lg:w-[450px] lg:h-[390px]">
              <Image
                src="/assets/About2.png"
                alt="Nurse illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 388px, 450px"
                priority
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex items-center justify-center bg-[#F5F6FA] rounded-lg p-6 sm:p-8 md:p-10 min-w-[320px] lg:min-w-[746px] h-auto">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                Who We <span className="text-[#61A6FA]">Are</span>?
              </h1>
              <p className="text-[#646465] text-base md:text-xl font-medium leading-relaxed max-w-[629px]">
                We are a team of healthcare and technology professionals passionate about building a platform that empowers nurses while supporting employers in delivering quality care. At VFind, people come first — we are driven by empathy, trust, and innovation.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* --------------------------other section what we do---------------------- */}

      <section  >
        <BenefitsSection />
      </section>
      {/* --------------------------other section our mission ---------------------- */}
      <section className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left Content */}
          <div className="flex-1 flex items-center justify-center bg-[#F5F6FA] rounded-lg p-6 sm:p-8 md:p-10 min-w-[320px] lg:min-w-[746px] h-auto">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                Our <span className="text-[#61A6FA]">Mission</span>
              </h1>
              <p className="text-[#646465] text-base md:text-xl font-medium leading-relaxed max-w-[629px]">
                To empower nurses and healthcare professionals by providing equal access to opportunities while supporting employers with trusted hiring solutions.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            <div className="hidden sm:flex relative w-[345px] h-[314px] lg:w-[345px] lg:h-[314px]">
              <Image
                src="/assets/About3.png"
                alt="Nurse illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 388px, 450px"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------other section over vision---------------------- */}
      <section className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left Image */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            <div className="hidden sm:flex relative w-[345px] h-[314px] lg:w-[345px] lg:h-[314px]">
              <Image
                src="/assets/About4.png"
                alt="Nurse illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 388px, 450px"
                priority
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex items-center justify-center bg-[#F5F6FA] rounded-lg p-6 sm:p-8 md:p-10 min-w-[320px] lg:min-w-[746px] h-auto">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                Our <span className="text-[#61A6FA]">Vision</span>
              </h1>
              <p className="text-[#646465] text-base md:text-xl font-medium leading-relaxed max-w-[629px]">
                To become Australia most trusted healthcare hiring platform — where nurses thrive, employers succeed, and quality care reaches every community.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------other section Contact---------------------- */}
      <section
        className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
              Have questions or want to partner with <span className="text-[#61A6FA]">us</span>?<br />
            </h1>
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold leading-tight text-[#58A6F9]">
                Let&apos;s connect!
              </h1>

              <a
                href="/contact"
                className="group relative inline-flex items-center px-6 py-3 bg-[#58A6F9] text-white font-semibold rounded-lg transition-all duration-300 hover:bg-blue-500 overflow-hidden w-fit"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm transition-all duration-300 group-hover:-translate-x-1">
                    Contact Us
                  </span>
                  <ArrowRight
                    className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    strokeWidth={3}
                  />
                </span>
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end relative hidden sm:flex">
            <div className="relative w-[325px] h-[300px] lg:w-[325px] lg:h-[300px]">
              <Image
                src="/assets/About5.png"
                alt="Nurse illustration"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 325px, 300px"
                priority
              />
            </div>
          </div>

        </div>
      </section>
      {/* -------------------------- Footer Section -------------------------- */}
      <div>
        {isAuthenticated ? <FooterPrivate /> : <FooterPublic />}
      </div>


    </main>
  );
}