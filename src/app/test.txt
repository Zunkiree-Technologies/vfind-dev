"use client";
import React, { useEffect, useState } from "react";
import Loader from "../../../../components/loading";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  minPay: string;
  maxPay: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  experienceMin: string;
  experienceMax: string;
  updated_at: string;
  company?: string;
  shift?: string;
  contact_email?: string;
}

export default function JobData() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/jobs"
        );
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // View Job Details
  const handleViewDetails = (job: Job) => {
    const url = `/nurseProfile/jobapplicationpage/${job.id}`;
    window.open(url, "_blank");
  };

  // Apply Filters
  useEffect(() => {
    let temp = [...jobs];

    if (locationFilter) {
      temp = temp.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      temp = temp.filter((job) => job.type === typeFilter);
    }

    if (minExperience) {
      temp = temp.filter(
        (job) => parseInt(job.experienceMin) >= parseInt(minExperience)
      );
    }

    setFilteredJobs(temp);
  }, [locationFilter, typeFilter, minExperience, jobs]);

  if (loading) return <Loader loading={true} />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 px-6 py-10 container mx-auto">
      {/* Sidebar Filters */}
      <div className="md:w-1/4 w-full h-fit bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">Filter Jobs</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Job Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Casual">Open to any</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setLocationFilter("");
              setTypeFilter("");
              setMinExperience("");
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-2 mt-2 text-sm font-medium transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="md:w-3/4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12 border border-dashed rounded-lg">
            <Briefcase className="w-12 h-12 mb-2" />
            <p>No jobs match the selected filters.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-500">{job.company || "Healthcare Facility"}</p>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign size={16} /> ${job.minPay} - ${job.maxPay}/hr
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {job.experienceMin}+ years experience
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {job.type}
                  </span>
                  {job.shift && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      {job.shift}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(job)}
                className="mt-5 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                View Details & Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
