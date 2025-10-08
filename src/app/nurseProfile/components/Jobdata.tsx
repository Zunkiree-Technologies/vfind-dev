"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, Clock, DollarSign, Calendar, ChevronLeft, ChevronRight, Clock1 } from "lucide-react";
import Loader from "../../../../components/loading";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const EXPERIENCE_RANGES: Record<string, [number, number]> = {
  "Less than 6 months": [0, 0.5],
  "6 months – 1 year": [0.5, 1],
  "1–3 years": [1, 3],
  "3 - 5 years": [3, 5],
  "Over 5 years": [5, Infinity],
};

function normalizeStr(s?: string) {
  return (s || "").toString().trim().toLowerCase().replace(/–/g, "-");
}

function parseExperienceStringToYears(exp?: string): number {
  if (!exp) return 0;
  const n = normalizeStr(exp);
  const numericMatch = n.match(/^\s*(\d+(\.\d+)?)/);
  if (numericMatch) return parseFloat(numericMatch[1]);
  if (n.includes("less than 6")) return 0.25;
  if (n.includes("6 months") && !n.includes("1-3")) return 0.75;
  if (n.includes("1-3") || n.includes("1–3")) return 2;
  if (n.includes("3-5") || n.includes("3 - 5") || n.includes("3–5")) return 4;
  if (n.includes("over 5") || n.includes("5+")) return 6;
  return 0;
}

interface Job {
  id: number;
  title: string;
  location: string;
  locality?: string;
  companyName?: string;
  type?: string;
  minPay?: string;
  maxPay?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  experienceMin?: string;
  experienceMax?: string;
  company?: string;
  shift?: string;
  contact_email?: string;
  roleCategory?: string;
  visaRequirement?: string;
  created_at?: string;  
  updated_at?: string;

}

// Pagination props typing
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default function JobData() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [payRate, setPayRate] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);

  const searchParams = useSearchParams();

  // Calculate pagination values
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  // fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setJobs(list);
        setFilteredJobs(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Helper function to get company name
  const getCompanyName = (job: Job): string => {
    // Try multiple fields to get company name
    return job.locality || job.companyName || job.company || "Healthcare Facility";
  };

  // checkbox helper
  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getJobExperienceYears = (job: Job) => {
    if (job.experienceMin) {
      const numeric = parseFloat(job.experienceMin as unknown as string);
      if (!isNaN(numeric) && numeric >= 0) return numeric;
    }
    return (
      parseExperienceStringToYears(job.experienceMin) ||
      parseExperienceStringToYears(job.experienceMax) ||
      0
    );
  };

  const applyFilters = useCallback(() => {
    let temp = [...jobs];

    if (search) {
      const q = normalizeStr(search);
      temp = temp.filter(
        (job) =>
          normalizeStr(job.title).includes(q) ||
          normalizeStr(job.description).includes(q) ||
          normalizeStr(job.roleCategory).includes(q) ||
          normalizeStr(getCompanyName(job)).includes(q)
      );
    }

    if (location) {
      const loc = normalizeStr(location);
      temp = temp.filter((job) => normalizeStr(job.location).includes(loc));
    }

    if (typeFilter.length > 0) {
      temp = temp.filter((job) =>
        job.type
          ? typeFilter.some((t) => normalizeStr(job.type).includes(normalizeStr(t)))
          : false
      );
    }

    if (shifts.length > 0) {
      temp = temp.filter((job) => {
        if (!job.shift) return false;
        const jobShift = normalizeStr(job.shift);

        return shifts.some((s) => {
          const selected = normalizeStr(s);
          // Match if jobShift contains the selected keyword
          return jobShift.includes(selected);
        });
      });
    }

    if (roleCategories.length > 0) {
      temp = temp.filter((job) =>
        roleCategories.some((role) =>
          (
            (job.roleCategory || "") +
            " " +
            (job.title || "") +
            " " +
            (job.description || "")
          )
            .toLowerCase()
            .includes(role.toLowerCase())
        )
      );
    }

    if (experience.length > 0) {
      temp = temp.filter((job) => {
        const years = getJobExperienceYears(job);
        return experience.some((expLabel) => {
          const range = EXPERIENCE_RANGES[expLabel];
          if (!range) return false;
          const [min, max] = range;
          return years >= min && years < max;
        });
      });
    }

    if (payRate > 0) {
      temp = temp.filter((job) => {
        const max = parseFloat((job.maxPay || job.minPay || "0").toString());
        if (isNaN(max)) return false;
        return max >= payRate;
      });
    }

    setFilteredJobs(temp);
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, search, location, typeFilter, shifts, roleCategories, experience, payRate, radius]);

  useEffect(() => {
    const t = setTimeout(() => applyFilters(), 250);
    return () => clearTimeout(t);
  }, [applyFilters]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setTypeFilter([]);
    setShifts([]);
    setRoleCategories([]);
    setExperience([]);
    setPayRate(0);
    setRadius(0);
    setFilteredJobs(jobs);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-[#F5F6FA]">
      <div className="flex gap-6 mt-6 items-start">
        <div className="mx-auto container flex justify-center item-center gap-8">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-[320px] bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-[60px] h-fit overflow-y-auto scrollbar-hide">
            <h2 className="font-semibold text-gray-800 flex justify-between">
              All Filters
              <button onClick={clearFilters} className="text-sm text-blue-600">Clear All</button>
            </h2>
            <div className="h-0.5 bg-gray-300" />

            {/* Job Type */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Job Type</h3>
              {["Full-time", "Part-time", "Contract", "Casual", "Open to any"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm mb-1">
                  <input type="checkbox" checked={typeFilter.includes(t)} onChange={() => handleCheckboxChange(t, setTypeFilter)} className="rounded" />
                  <label>{t}</label>
                </div>
              ))}
            </div>
            <div className="h-0.5 bg-gray-300" />

            {/* Role Category */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Role Category</h3>
              {[
                "Clinical Lead / Manager",
                "Registered Nurse (RN)",
                "Enrolled Nurse (EN)",
                "Assistant in Nursing (AIN)",
                "Others",
              ].map((role) => (
                <div key={role} className="flex items-center gap-2 text-sm mb-1">
                  <input type="checkbox" checked={roleCategories.includes(role)} onChange={() => handleCheckboxChange(role, setRoleCategories)} className="rounded" />
                  <label>{role}</label>
                </div>
              ))}
            </div>
            <div className="h-0.5 bg-gray-300" />

            {/* Experience */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Experience</h3>
              {Object.keys(EXPERIENCE_RANGES).map((exp) => (
                <div key={exp} className="flex items-center gap-2 text-sm mb-1">
                  <input type="checkbox" checked={experience.includes(exp)} onChange={() => handleCheckboxChange(exp, setExperience)} className="rounded" />
                  <label>{exp}</label>
                </div>
              ))}
            </div>
            <div className="h-0.5 bg-gray-300" />

            {/* Pay Rate slider */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Pay Rate</h3>
              <input type="range" min={0} max={100} value={isNaN(payRate) ? 0 : payRate} onChange={(e) => setPayRate(Number(e.target.value) || 0)} className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Any</span>
                <span>${payRate}+</span>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="flex-1 max-w-[983px]">
            <div className="grid grid-cols-1 gap-4">
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2"
                >
                  {/* Job info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-bold text-lg text-[#61A6FA] mb-1">
                      {job.title}
                    </h2>

                    {/* Updated company name display */}
                    <p className="text-gray-600 text-sm mb-3 font-medium">
                      {getCompanyName(job)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location || "Location not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{job.type || "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {job.experienceMin
                            ? `${job.experienceMin}${job.experienceMax ? ` - ${job.experienceMax}` : ""
                            } years`
                            : "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>
                          {job.minPay || job.maxPay
                            ? `${job.minPay || "0"} - ${job.maxPay || "0"}/hr`
                            : "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{job.roleCategory || "General"}</span>
                      </div>


                    
                      <div className="flex items-center gap-1">
                        <Clock1 size={16} />
                        <span>
                          {job.created_at
                            ? new Date(job.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                            : "Date not available"}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="flex items-center gap-4 ml-6 flex-col">
                    <Link
                      href={{
                        pathname: `/nurseProfile/jobapplicationpage/${job.id}`,
                        query: { company: getCompanyName(job) },
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#61A6FA] text-white text-sm font-medium rounded-[10px] hover:bg-blue-500 transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {filteredJobs.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No jobs found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}