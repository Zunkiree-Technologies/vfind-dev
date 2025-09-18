"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import Loader from "../../../../components/loading";

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
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/jobs");
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

  // Apply Filters
  const applyFilters = useCallback(() => {
    let temp = [...jobs];

    if (search.trim()) {
      temp = temp.filter((job) =>
        [job.title, job.company, job.description]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (location.trim()) {
      temp = temp.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (typeFilter.length > 0) {
      temp = temp.filter((job) => typeFilter.includes(job.type));
    }

    if (shifts.length > 0) {
      temp = temp.filter((job) => job.shift && shifts.includes(job.shift));
    }

    if (experience.length > 0) {
      temp = temp.filter((job) => {
        const exp = parseInt(job.experienceMin);
        if (experience.includes("0-1 Year")) return exp <= 1;
        if (experience.includes("1-3 Years")) return exp >= 1 && exp <= 3;
        if (experience.includes("3-5 Years")) return exp >= 3 && exp <= 5;
        if (experience.includes("5+ Years")) return exp > 5;
        return true;
      });
    }

    setFilteredJobs(temp);
  }, [jobs, search, location, typeFilter, shifts, experience]);

  useEffect(() => {
    const debounce = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(debounce);
  }, [search, location, typeFilter, shifts, experience, applyFilters]);

  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setTypeFilter([]);
    setShifts([]);
    setExperience([]);
    setFilteredJobs(jobs);
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className="p-6 min-h-screen mx-auto container bg-[#F5F6FA]">
    

      <div className="flex gap-6 mt-6 items-start">
        {/* Filters Sidebar */}
        <div className="hidden md:block w-64 bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-15 h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="font-semibold text-gray-800 flex justify-between">
            All Filters
            <button onClick={clearFilters} className="text-sm text-blue-600">
              Clear All
            </button>
          </h2>
          <div className="h-0.5 bg-gray-300" />

          {/* Job Type */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Job Type</h3>
            {["Full-time", "Part-time", "Contract", "Casual"].map((type) => (
              <div key={type} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={typeFilter.includes(type)}
                  onChange={() => handleCheckboxChange(type, setTypeFilter)}
                  className="rounded"
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
          <div className="h-0.5 bg-gray-300" />

          {/* Shift */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Shift</h3>
            {["Morning ", "Afternoon", "Night "].map((shift) => (
              <div key={shift} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={shifts.includes(shift)}
                  onChange={() => handleCheckboxChange(shift, setShifts)}
                  className="rounded"
                />
                <label>{shift}</label>
              </div>
            ))}
          </div>
          <div className="h-0.5 bg-gray-300" />

          {/* Experience */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Experience</h3>
            {["0-1 Year", "1-3 Years", "3-5 Years", "5+ Years"].map((exp) => (
              <div key={exp} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={experience.includes(exp)}
                  onChange={() => handleCheckboxChange(exp, setExperience)}
                  className="rounded"
                />
                <label>{exp}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="flex-1 max-w-4xl mx-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2"
              >
                {/* Left side */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-blue-600 mb-1">{job.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{job.company || "Healthcare Facility"}</p>

                  <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-blue-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} className="text-blue-500" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-blue-500" />
                      <span>{job.experienceMin}+ years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} className="text-blue-500" />
                      <span>${job.minPay} - ${job.maxPay}/hr</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Button */}
                <div className="flex items-center gap-4 ml-6 flex-col">
                  <button
                    onClick={() =>
                      window.open(`/nurseProfile/jobapplicationpage/${job.id}`, "_blank")
                    }
                    className="px-4 py-2 bg-blue-400 text-white text-sm font-medium rounded-[10px] hover:bg-blue-500 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
