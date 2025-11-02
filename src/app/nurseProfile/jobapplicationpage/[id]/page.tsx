"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Loader from "../../../../../components/loading";
import { ArrowRight, Building2, TriangleAlert } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import Footer from '@/app/Admin/components/layout/Footer';

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  minPay: string;
  maxPay: string;
  description: string;
  requirements?: string[];
  roleCategory: string;
  benefits?: string[];
  experienceMin: string;
  experienceMax: string;
  created_at: string;
  certifications: string[];
  company?: string;
  JobShift?: string;
  contact_email?: string;
  user_id?: number;
  status?: string;
  expiryDate?: string;
}

interface Company {
  about_company: string;
}

export default function JobApplicationPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const companyFromQuery = searchParams.get("company");

  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [nurseEmail, setNurseEmail] = useState<string | null>(null);
  const [, setNurseProfileId] = useState<number | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpired, setIsExpired] = useState(false); // ✅ new

  // Load token, email, profileId from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const profileId = localStorage.getItem("nurse_profile_id");

    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    if (email) setNurseEmail(email);
    if (profileId) setNurseProfileId(Number(profileId));
  }, []);

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!id) return alert("Missing job ID");

    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to save jobs");

    try {
      if (!isSaved) {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:vUfT8k87/jobssaved",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobs_id: Number(id) }),
          }
        );
        if (!res.ok) throw new Error("Failed to save job");
        setIsSaved(true);
      } else {
        const fetchRes = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:vUfT8k87/fetch_jobSaved_status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobs_id: id.toString() }),
          }
        );

        const data = await fetchRes.json();
        const savedJobId = data[0]?.id;
        if (!savedJobId) throw new Error("Saved job ID not found");

        const deleteRes = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:vUfT8k87/jobssaved/${savedJobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!deleteRes.ok) throw new Error("Failed to remove saved job");

        setIsSaved(false);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error updating saved job");
    }
  };

  const fetchSavedStatus = async (jobId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return setIsSaved(false);

    try {
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:vUfT8k87/fetch_jobSaved_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobs_id: jobId.toString() }),
        }
      );

      const data = await res.json();
      setIsSaved(Array.isArray(data) && data.length > 0);
    } catch (err) {
      console.error("Error fetching saved status:", err);
      setIsSaved(false);
    }
  };

  useEffect(() => {
    if (id) fetchSavedStatus(Number(id));
  }, [id]);

  // Check if user has already applied
  const checkIfAlreadyApplied = async (jobId: number, email: string) => {
    try {
      setCheckingApplication(true);
      const payload = { jobs_id: jobId.toString(), email };

      const res = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/is_applied`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok) {
        if (Array.isArray(result) && result.length > 0) {
          const hasAppliedStatus = result.some(
            (app) => app.status === "applied"
          );
          setHasApplied(hasAppliedStatus);
        } else {
          setHasApplied(false);
        }
      } else {
        setHasApplied(false);
      }
    } catch (err) {
      console.error("Error checking application status:", err);
      setHasApplied(false);
    } finally {
      setCheckingApplication(false);
    }
  };

  // Fetch job and company details
  useEffect(() => {
    if (!id) {
      router.push("/nurseProfile");
      return;
    }

    const fetchJobData = async () => {
      try {
        setLoading(true);
        const jobRes = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs/${id}`
        );
        if (!jobRes.ok) throw new Error("Job not found");

        const jobData: Job = await jobRes.json();
        setJob(jobData);

        // ✅ check expiry
        if (jobData.expiryDate) {
          const expiry = new Date(jobData.expiryDate);
          expiry.setDate(expiry.getDate() + 1);
          const now = new Date();
          setIsExpired(expiry < now);
        }


        if (jobData.user_id) {
          await fetchCompanyInfo(jobData.user_id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, router]);

  useEffect(() => {
    if (job && nurseEmail && isLoggedIn) {
      checkIfAlreadyApplied(job.id, nurseEmail);
    }
  }, [job, nurseEmail, isLoggedIn]);

  const fetchCompanyInfo = async (id: number) => {
    try {
      const companyRes = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/get_about_company_for_saved_jobs_page`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: id }),
        }
      );

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        setCompany({
          about_company:
            companyData.about_company || "No company information available.",
        });
      } else {
        setCompany({ about_company: "Failed to load company information." });
      }
    } catch {
      setCompany({ about_company: "There is no about company information." });
    }
  };

  const handleSubmitApplication = async () => {
    if (!job) return;

    if (!authToken) {
      alert("You must be logged in to apply.");
      return;
    }
    if (!nurseEmail) {
      alert("Could not find your email. Please log in again.");
      return;
    }
    if (hasApplied || isExpired) return; // ✅ block if expired

    try {
      setSubmitting(true);

      const payload = {
        jobs_id: job.id,
        status: "applied",
        applied_date: new Date().toISOString(),
        email: nurseEmail,
      };

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.message || "Failed to submit application");

      setHasApplied(true);
      alert("Job application sent successfully!");
      router.push("/nurseProfile");
    } catch (err: unknown) {
      console.error("Failed to submit application:", err);
      alert(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isExpired) return "Expired"; // ✅
    if (!isLoggedIn) return "Create an Account";
    if (checkingApplication) return "Checking...";
    if (hasApplied) return "Applied";
    if (submitting) return "Submitting...";
    return "Apply Now";
  };

  const handleButtonClick = () => {
    if (isExpired) return; // ✅ prevent click
    if (!isLoggedIn) {
      router.push("/signup");
    } else {
      handleSubmitApplication();
    }
  };

  const getCompanyName = () => companyFromQuery || "Healthcare Facility";

  if (loading) return <Loader loading={true} message="Fetching job data..." />;
  if (error || !job)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error || "Job not found."}</p>
        </div>
      </div>
    );



  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Job Details */}
            <div className="lg:col-span-2 bg-white rounded-lg">

              <div className="shadow-sm relative">
                {/* Header Section */}
                <div className="flex justify-end items-center gap-3 mb-2 mr-4 mt-4">
                  {isLoggedIn && (
                    <button
                      onClick={handleBookmarkToggle}
                      disabled={!id || checkingApplication}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all
        ${isSaved
                          ? "bg-[#0073FF] text-white border-[#0073FF]"
                          : "bg-[#FFFDFD] border border-blue-400 hover:bg-[#0073FF] hover:text-white text-[#0073FF]"
                        }`}
                      title={isSaved ? "Remove from saved jobs" : "Save job"}
                    >
                      {isSaved ? "Unsave Job" : "Save Job"}
                    </button>
                  )}

                </div>

                {/* Header Section */}
                <div className="p-6 border-b border-gray-500 ">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        {getCompanyName()}
                      </h1>
                      <h2 className="text-[20px] font-semibold text-gray-900">{job.title}</h2>
                    </div>
                  </div>

                  {isExpired && (
                    <div className="flex items-center gap-2 text-[#B94A48] font-medium text-sm bg-[#F2D7D5] px-2 py-4 w-fit rounded-sm">
                      <TriangleAlert className="w-5 h-5" />
                      This job posting has expired and is no longer accepting applications.
                    </div>
                  )}
                </div>




                {/* Basic Info Section */}
                <div className="p-4 border-b border-gray-500">
                  <div className="flex flex-col gap-4 text-sm">
                    {/* Location */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Location
                      </span>
                      <div className="flex justify-start items-center w-1/2 gap-10">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">Salary</span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.minPay && job.maxPay
                            ? `AUD ${job.minPay}-${job.maxPay}/hr`
                            : job.minPay
                              ? `From AUD ${job.minPay}/hr`
                              : job.maxPay
                                ? `Up to AUD ${job.maxPay}/hr`
                                : "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Job Type */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Job Type
                      </span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.type || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Job Shift */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Job Shift
                      </span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.JobShift || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Job Expiry */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">Job Expiry</span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.expiryDate
                            ? (() => {
                              const expiry = new Date(job.expiryDate);
                              expiry.setDate(expiry.getDate() + 1);
                              return expiry.toLocaleDateString("en-AU", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                            })()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Candidate Preferences */}
                <div className="p-6 border-b border-gray-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Candidate Preferences
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Role Category
                      </span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">{job.roleCategory}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Experience
                      </span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.experienceMin} {job.experienceMax}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Preferred Certifications
                      </span>
                      <div className="mt-2 space-y-1">
                        {job.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Job Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-700 rounded-lg p-4 bg-gray-50 text-justify"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleButtonClick}
                disabled={isExpired || (isLoggedIn && (submitting || hasApplied || checkingApplication))}
                className={`group text-white px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium mt-3 flex items-center justify-center overflow-hidden 
    ${!isLoggedIn
                    ? "bg-blue-400"
                    : hasApplied
                      ? "bg-primary"
                      : isExpired
                        ? "bg-gray-400"
                        : "bg-blue-400"
                  }`}
              >
                <span className="flex items-center">
                  <span className="transition-all duration-300 group-hover:-translate-x-1">
                    {isExpired ? "Expired" : getButtonText()}
                  </span>
                  {!isExpired &&
                    !(isLoggedIn && (submitting || hasApplied || checkingApplication)) && (
                      <ArrowRight
                        className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        strokeWidth={3}
                      />
                    )}
                </span>
              </button>

            </div>

            {/* Right Column - About Company */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About Company
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {company?.about_company ? (
                    <p>{company.about_company}</p>
                  ) : (
                    <p>Loading company information...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
