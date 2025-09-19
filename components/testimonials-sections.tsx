"use client";
import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Registered Nurse",
    location: "Sydney, NSW",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    content:
      "AusNurse Connect helped me find my dream job at Royal Prince Alfred Hospital. The visa support was incredible!",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "ICU Nurse",
    location: "Melbourne, VIC",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    content:
      "Within 3 weeks, I had multiple job offers. The platform made everything so simple and professional.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Pediatric Nurse",
    location: "Brisbane, QLD",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    content:
      "The career growth opportunities here are amazing. I've advanced faster than I ever imagined possible.",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "Emergency Nurse",
    location: "Perth, WA",
    image:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    content:
      "From application to starting work took just 6 weeks. The whole process was seamless and supportive.",
    rating: 5,
  },
  {
    name: "Lisa Wang",
    role: "Surgical Nurse",
    location: "Adelaide, SA",
    image:
      "https://images.unsplash.com/photo-1594824949097-7c0ddc7f5de7?w=400&h=400&fit=crop&crop=face",
    content:
      "The quality of employers on this platform is exceptional. I found exactly what I was looking for.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Mental Health Nurse",
    location: "Canberra, ACT",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    content:
      "AusNurse Connect truly cares about nurses. They supported me every step of my relocation journey.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="min-h-fit p-4 bg-healthcare-gray-light overflow-hidden">
   <div className="container mx-auto px-4 mb-16 text-center">
  <h2 className="text-3xl font-bold text-gray-700">
    Success Stories from Our Nurses
  </h2>
  <p className="text-xl text-gray-500 max-w-2xl mt-5 mx-auto text-center">
    Join thousands of nurses who have successfully built their careers in Australia through our platform.
  </p>
</div>


      {/* Top Scrolling Testimonials */}
      <div className="relative overflow-hidden ">
        <div className="flex space-x-5 sm:space-x-3 animate-scroll-left">
          {duplicatedTestimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 sm:w-64 bg-gray-50 rounded-2xl p-8 sm:p-4 shadow-soft"
            >
              <div className="flex items-center mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-healthcare-gray mb-6 text-balance text-sm sm:text-xs">
                {t.content}
              </p>
              <div className="flex items-center">
                <Image
                  width={25}
                  height={25}
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-healthcare-navy text-sm sm:text-xs">
                    {t.name}
                  </h4>
                  <p className="text-sm sm:text-xs text-healthcare-gray">
                    {t.role} • {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scrolling Testimonials (Opposite Direction) */}
      <div className="relative overflow-hidden mt-4 ">
        <div className="flex space-x-8 sm:space-x-3 animate-scroll-right">
          {duplicatedTestimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 sm:w-64 bg-gray-50 rounded-2xl p-8 sm:p-4 shadow-soft"
            >
              <div className="flex items-center mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-healthcare-gray mb-6 text-balance text-sm sm:text-xs">
                {t.content}
              </p>
              <div className="flex items-center">
                <Image
                  width={30}
                  height={30}
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-healthcare-navy text-sm sm:text-xs">
                    {t.name}
                  </h4>
                  <p className="text-sm sm:text-xs text-healthcare-gray">
                    {t.role} • {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
      `}</style>
    </section>
  );
};
