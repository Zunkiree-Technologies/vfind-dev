"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, DollarSign, Clock, Briefcase, ArrowRight } from "lucide-react";
import { getActiveJobs } from "@/lib/supabase-api";
import type { Job as DbJob } from "@/lib/supabase";

interface Job {
  id: string;
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
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getActiveJobs();

        // Map to component format and shuffle
        const mappedJobs: Job[] = data.map((job: DbJob) => ({
          id: job.id,
          title: job.title,
          location: job.location,
          type: job.type,
          minPay: job.min_pay,
          maxPay: job.max_pay,
          description: job.description,
          experienceMin: job.experience_min,
          experienceMax: job.experience_max,
          updated_at: job.updated_at,
          shift: job.job_shift,
          roleCategory: job.role_category,
        }));

        // Shuffle and take 4 random jobs
        const shuffled = [...mappedJobs].sort(() => 0.5 - Math.random());
        setJobs(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section
      className="py-20 md:py-28 bg-white"
      id="Featurejobs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-pink-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Current Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Jobs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your next career opportunity with Australia&apos;s top healthcare employers
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:border-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {job.title || "Untitled Job"}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-semibold rounded-full">
                  {job.type || "Full Time"}
                </span>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {job.location || "Location"}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  {job.minPay && job.maxPay
                    ? `${job.minPay} - ${job.maxPay}`
                    : "Not listed"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  {job.experienceMin && job.experienceMax
                    ? `${job.experienceMin} - ${job.experienceMax} yrs`
                    : "Experience not listed"}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-400" />
                  {job.shift || "Day Shift"}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {job.updated_at
                    ? new Date(job.updated_at).toLocaleDateString()
                    : "Recently posted"}
                </p>
                <button
                  onClick={() => router.push(`/nurseProfile/jobapplicationpage/${job.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
