"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock1,
  Ban,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import Footer from "@/app/Admin/components/layout/Footer";
import { JobFilters } from "@/app/nurseProfile/components/JobFilters";
import MainButton from "@/components/ui/MainButton";
import { getAppliedJobs } from "@/lib/supabase-api";

interface JobDetails {
  id: number;
  title: string;
  locality?: string;
  location?: string;
  minPay?: string;
  maxPay?: string;
  type?: string;
  JobShift?: string;
  description?: string;
  roleCategory?: string;
  experienceMin?: string;
  experienceMax?: string;
  created_at?: number;
  certifications?: string[];
  keyResponsibilities?: string;
  workEnvironment?: string;
  status?: string;
  expiryDate?: string;

}

interface AppliedJob {
  id: number;
  jobs_id: number;
  status: string;
  applied_date: string;
  email: string;
  nurse_profiles_id?: number;
  _jobs?: JobDetails;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
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
          </div>
        ))}
      </div>

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

const AppliedJobs = () => {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ✅ Filter states
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [payRate, setPayRate] = useState<number>(0);

  const clearFilters = () => {
    setTypeFilter([]);
    setRoleCategories([]);
    setExperience([]);
    setPayRate(0);
  };

  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem("token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login.");
      }

      const appliedJobsData = await getAppliedJobs(authToken);

      // Map to the AppliedJob interface
      const mappedJobs: AppliedJob[] = appliedJobsData.map((app) => ({
        id: Number(app.id),
        jobs_id: Number(app.job_id),
        status: app.status || "applied",
        applied_date: app.applied_at || "",
        email: app.nurse?.email || "",
        nurse_profiles_id: app.nurse_id ? Number(app.nurse_id) : undefined,
        _jobs: app.job ? {
          id: Number(app.job.id),
          title: app.job.title || "",
          locality: app.job.locality,
          location: app.job.location,
          minPay: app.job.min_pay,
          maxPay: app.job.max_pay,
          type: app.job.type,
          JobShift: app.job.job_shift,
          description: app.job.description,
          roleCategory: app.job.role_category,
          experienceMin: app.job.experience_min,
          experienceMax: app.job.experience_max,
          created_at: app.job.created_at ? new Date(app.job.created_at).getTime() : undefined,
          certifications: app.job.certifications,
          expiryDate: app.job.expiry_date,
        } : undefined,
      }));

      setJobs(mappedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("Pending") ||
      statusLower.includes("Review") ||
      statusLower === "Applied"
    ) {
      return " border border-blue-400 ";
    }
    if (
      statusLower.includes("accepted") ||
      statusLower.includes("approved")
    ) {
      return "bg-green-100 text-blue-400 border-blue-200";
    }
    if (statusLower.includes("rejected") || statusLower.includes("declined")) {
      return "bg-red-100 text-blue-400 border-blue-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getCompanyName = (job: AppliedJob) => {
    return job._jobs?.locality || job._jobs?.location || "Healthcare Facility";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const j = job._jobs;
    return (
      (typeFilter.length === 0 || typeFilter.includes(j?.type ?? "")) &&
      (roleCategories.length === 0 ||
        roleCategories.includes(j?.roleCategory ?? "")) &&
      (experience.length === 0 ||
        experience.includes(
          j?.experienceMin || j?.experienceMax || "Not specified"
        )) &&
      (payRate === 0 ||
        (parseInt(j?.minPay ?? "0") >= payRate ||
          parseInt(j?.maxPay ?? "0") >= payRate))
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Fetching job data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchAppliedJobs}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-4 min-h-screen bg-[#F5F6FA]">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl lg:ml-125 font-bold text-blue-400">
              Applied Jobs
            </h1>
          </div>
        </div>

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
                  const jobDetails = job._jobs;
                  const isExpired = jobDetails?.expiryDate && new Date(jobDetails.expiryDate) < new Date();

                  return (
                    <div
                      key={job.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2 gap-4"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-semibold text-bold text-lg text-[#61A6FA]">
                            {jobDetails?.title || "Job Title"}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                              job.status
                            )}`}
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 font-medium">
                          {getCompanyName(job)}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="flex-shrink-0" />
                            <span className="truncate">
                              {jobDetails?.location || "Location not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="flex-shrink-0" />
                            <span>{jobDetails?.type || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className="flex-shrink-0" />
                            <span>
                              {jobDetails?.experienceMin
                                ? `${jobDetails.experienceMin}${jobDetails?.experienceMax
                                  ? ` - ${jobDetails.experienceMax}`
                                  : ""
                                } years`
                                : "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="flex-shrink-0" />
                            <span>
                              {jobDetails?.minPay || jobDetails?.maxPay
                                ? `${jobDetails?.minPay || "0"} - ${jobDetails?.maxPay || "0"}/hr`
                                : "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} className="flex-shrink-0" />
                            <span>{jobDetails?.roleCategory || "General"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock1 size={16} className="flex-shrink-0" />
                            <span>
                              Applied: {formatDate(job.applied_date)}
                            </span>
                          </div>
                          <div
                            className={` text-sm font-extralight w-fit flex items-center gap-1 ${jobDetails?.expiryDate && new Date(jobDetails.expiryDate).setHours(23, 59, 59, 999) < new Date().getTime()
                              ? "text-[#D9796C]"
                              : "text-gray-600"
                              }`}
                          >
                            {jobDetails?.expiryDate
                              ? (() => {
                                const today = new Date();
                                const expiry = new Date(jobDetails.expiryDate);

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
                      </div>
                      <div className="flex items-center w-full md:w-auto md:ml-6">
                        <MainButton
                          href={`/nurseProfile/jobapplicationpage/${job.jobs_id}?company=${encodeURIComponent(
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

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
              {filteredJobs.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  No applied jobs found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AppliedJobs;
