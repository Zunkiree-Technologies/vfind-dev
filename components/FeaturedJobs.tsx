"use client";
import React, { useEffect, useState } from "react";
import { MapPin, DollarSign, Clock, Briefcase } from "lucide-react";

interface Job {
  id: number;
  title: string;
  location: string;
  type?: string;
  minPay?: string;
  maxPay?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  experienceMin?: string;
  experienceMax?: string;
  updated_at?: string;
  company?: string;
  shift?: string;
  contact_email?: string;
  roleCategory?: string;
  visaRequirement?: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/jobs"
        );
        const data: Job[] = await res.json();

        // Shuffle and take 4 random jobs
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setJobs(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="min-h-[780px] bg-[#F8FAFD] flex items-center justify-center px-6 py-12 " id="Featurejobs">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12 flex justify-center items-center flex-col">
          <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-4xl font-bold text-black text-healthcare-navy  mb-6">Featured Jobs</h2>
          <p className="text-gray-500 ">
            Discover your next career opportunity with Australia’s top healthcare
            employers
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-blue-500">
                    {job.title || "Untitled Job"}
                  </h3>
                  <p className="text-gray-800 mt-1">
                    {job.company || "Unknown Company"}
                  </p>
                </div>
                {/* Logo Placeholder */}
                <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                  Logo
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-5 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />{" "}
                  {job.location || "Location"}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-500" />{" "}
                  {job.minPay && job.maxPay
                    ? `${job.minPay} - ${job.maxPay}`
                    : "Not listed"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />{" "}
                  {job.experienceMin && job.experienceMax
                    ? `${job.experienceMin} - ${job.experienceMax} yrs`
                    : "Experience not listed"}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" />{" "}
                  {job.type || "Full Time"}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-xs text-gray-400">
                  {job.updated_at
                    ? new Date(job.updated_at).toLocaleDateString()
                    : "Recently posted"}
                </p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
