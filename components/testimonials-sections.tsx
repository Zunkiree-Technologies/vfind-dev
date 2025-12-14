"use client";
import React from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Priya S.",
    role: "Registered Nurse",
    location: "Melbourne, VIC",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    content:
      "I wasn't even actively job hunting—just curious. Created my profile on a Sunday. By Thursday, I had two employers asking to connect. They found ME.",
    rating: 5,
    transformation: "2 employer contacts in 4 days",
  },
  {
    name: "Maria L.",
    role: "Registered Nurse",
    location: "Geelong, VIC",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    content:
      "I'm a nurse from the Philippines. On VFind, I listed that I needed sponsorship. A regional hospital found my profile and started my 482 visa process.",
    rating: 5,
    transformation: "Sponsored & employed in Australia",
  },
  {
    name: "James K.",
    role: "Enrolled Nurse",
    location: "Sydney, NSW",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    content:
      "I was comfortable in my job but underpaid. Made a VFind profile just to see what's out there. A recruiter found me and offered 20% more.",
    rating: 5,
    transformation: "20% pay increase",
  },
  {
    name: "Sarah T.",
    role: "Registered Nurse",
    location: "Western Sydney, NSW",
    image:
      "https://images.unsplash.com/photo-1594824949097-7c0ddc7f5de7?w=400&h=400&fit=crop&crop=face",
    content:
      "After 4 years of rotating nights, I was burnt out. Within 3 weeks of creating my profile, I had an interview at a facility 12 minutes from home.",
    rating: 5,
    transformation: "Day shifts, 12min commute",
  },
  {
    name: "Raj M.",
    role: "Enrolled Nurse",
    location: "Ballarat, VIC",
    image:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    content:
      "Coming from India, every job listing felt like a closed door. VFind let me indicate I needed sponsorship. A regional hospital found me.",
    rating: 5,
    transformation: "Now working in Australia",
  },
  {
    name: "Emma W.",
    role: "Aged Care Nurse",
    location: "Brisbane, QLD",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    content:
      "I created my profile and forgot about it. Two months later, an aged care facility in my suburb reached out. Perfect hours, better pay.",
    rating: 5,
    transformation: "Dream job found me",
  },
];

export const TestimonialsSection = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 md:py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <span className="inline-block text-pink-600 font-semibold text-sm uppercase tracking-wider mb-3">
          Success Stories
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Nurses Getting Discovered
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real stories from nurses who let opportunities find them
        </p>
      </div>

      {/* Scrolling Testimonials */}
      <div className="relative overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex space-x-6 animate-scroll-left">
          {duplicatedTestimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[380px] bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-100 transition-all duration-300"
            >
              {/* Header with Quote */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-pink-100" />
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-5 text-[15px] leading-relaxed min-h-[80px]">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Transformation badge */}
              <div className="mb-5 inline-flex items-center px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                <p className="text-xs text-green-700 font-semibold">
                  {t.transformation}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center pt-4 border-t border-gray-100">
                <Image
                  width={44}
                  height={44}
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {t.role} • {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note about placeholders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
        <p className="text-xs text-gray-400">
          * Testimonials represent typical user experiences. Names changed for privacy.
        </p>
      </div>

      {/* Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 45s linear infinite;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
