"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Briefcase, Clock, DollarSign, Calendar, ChevronLeft, ChevronRight, Clock1, Ban } from "lucide-react";
import Loader from "../../../../components/loading";
import { useSearchParams } from "next/navigation";
import MainButton from "@/components/ui/MainButton";
import { JobFilters } from "./JobFilters";

const EXPERIENCE_RANGES: Record<string, [number, number]> = {
  "Fresher": [0, 0.5],
  "Less than 1 year": [0, 1],
  "1 - 2 years": [1, 3],
  "2 - 5 years": [3, 5],
  "Above 5 years": [5, Infinity],
};

function normalizeStr(s?: string) {
  return (s || "").toString().trim().toLowerCase().replace(/–/g, "-");
}

function parseExperienceStringToYears(exp?: string): number {
  if (!exp) return 0;
  const n = normalizeStr(exp);
  const numericMatch = n.match(/^\s*(\d+(\.\d+)?)/);
  if (numericMatch) return parseFloat(numericMatch[1]);
  if (n.includes("Fresher")) return 0.25;
  if (n.includes("Less than 1 year") && !n.includes("0-1")) return 0.75;
  if (n.includes("1-2") || n.includes("1–2")) return 2;
  if (n.includes("3-5") || n.includes("2 - 5") || n.includes("1–5")) return 4;
  if (n.includes("Above 5 years") || n.includes("5+")) return 6;
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
  expiryDate?: string;

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
        console.log(data)
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
    <div className="p-4 min-h-screen bg-[#F5F6FA]">
      <div className="flex gap-6 mt-6 items-start">
        <div className="mx-auto container flex justify-center item-center gap-8">
          {/* Filters Sidebar */}
          <JobFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            roleCategories={roleCategories}
            setRoleCategories={setRoleCategories}
            experience={experience}
            setExperience={setExperience}
            payRate={payRate}
            setPayRate={setPayRate}
            clearFilters={clearFilters}
            handleCheckboxChange={handleCheckboxChange}
          />

          {/* Job Cards */}
          <div className="flex-1 max-w-[983px]">
            <div className="grid grid-cols-1 gap-4">
              {currentJobs.map((job) => {
                const isExpired = job.expiryDate && new Date(job.expiryDate) < new Date();

                return (
                  <div
                    key={job.id}
                    className="relative flex justify-between items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2"
                  >
                    {/* Expired badge
                    {isExpired && (
                      <div className="absolute top-3 right-3 bg-red-100 text-[#D9796C] text-xs font-semibold px-2 py-1 rounded">
                        Expired
                      </div>
                    )} */}

                    {/* Job info */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-bold text-lg text-[#61A6FA] mb-1">
                        {job.title}
                      </h2>

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
                              ? `${job.experienceMin}${job.experienceMax ? ` - ${job.experienceMax}` : ""} years`
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
                            {job.expiryDate
                              ? new Date(job.expiryDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                              : "Date not available"}
                          </span>
                        </div>
                      </div>
                      {/* Apply Before Indicator */}

                      <div
                        className={`mt-4 text-sm font-extralight w-fit flex items-center gap-1 ${job.expiryDate && new Date(job.expiryDate).setHours(23, 59, 59, 999) < new Date().getTime()
                          ? "text-[#D9796C]"
                          : "text-gray-600"
                          }`}
                      >
                        {job.expiryDate
                          ? (() => {
                            const today = new Date();
                            const expiry = new Date(job.expiryDate);

                            // Set expiry to end of the day
                            expiry.setHours(23, 59, 59, 999);

                            const diffTime = expiry.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays > 0) {
                              return `Apply Before: ${diffDays} day${diffDays > 1 ? "s" : ""} from now`;
                            } else {
                              return (
                                <>
                                  <Ban size={16} />
                                  Job Expired
                                </>
                              );
                            }
                          })()
                          : "Date not available"}
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="flex items-center gap-4 ml-6 flex-col">
                      <MainButton
                        href={`/nurseProfile/jobapplicationpage/${job.id}?company=${encodeURIComponent(
                          getCompanyName(job)
                        )}&expired=${isExpired}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-all duration-200 ${isExpired ? "cursor-not-allowed" : ""
                          }`}
                      >

                        <span className="flex items-center gap-2">
                          {" "}
                          <span className="transition-all duration-300 group-hover:-translate-x-1">
                            {" "}
                            View Details{" "}

                          </span>{" "}
                        </span>
                      </MainButton>
                    </div>
                  </div>
                );
              })}
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
    </div >
  );
}