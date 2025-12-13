"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";
import { Briefcase, Calendar, Clock, Edit, Eye, Mail, Phone, Search, Trash, Pause, Play } from "lucide-react";
import Footer from "../Admin/components/layout/Footer";
import MainButton from "@/components/ui/MainButton";
import {
  getEmployerProfile,
  getEmployerJobs,
  getCompanyProfile,
  createCompanyProfile as createCompanyProfileApi,
  updateCompanyProfile as updateCompanyProfileApi,
  deleteCompanyProfile as deleteCompanyProfileApi,
  deleteJob,
  toggleJobStatus,
  getApplicantCount,
} from "@/lib/supabase-api";

interface Job {
  created_at: string;
  id: number;
  title: string;
  location: string;
  locality?: string;
  type: string;
  minPay: string;
  maxPay: string;
  description: string;
  roleCategory: string;
  experienceMin: string;
  experienceMax: string;
  certifications: string[];
  updated_at: string;
  applicants_count?: number;
  is_active?: boolean;
  status: "Active" | "Paused";
  expiryDate?: string;
}

interface Employer {
  fullName?: string;
  email?: string;
  company?: string;
  mobile?: string;
  companyName?: string;
}

// Utility function to calculate timeframe
const getJobTimeframe = (expiryDate?: string): { text: string; isExpired: boolean } => {
  if (!expiryDate) {
    return { text: "No expiry date", isExpired: false };
  }

  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Expired", isExpired: true };
  }

  if (diffDays === 0) {
    return { text: "Expires today", isExpired: false };
  }

  if (diffDays === 1) {
    return { text: "1 day left", isExpired: false };
  }

  if (diffDays < 30) {
    return { text: `${diffDays} days left`, isExpired: false };
  }

  if (diffDays < 60) {
    return { text: "1 month left", isExpired: false };
  }

  const months = Math.floor(diffDays / 30);
  return { text: `${months} months left`, isExpired: false };
};

export default function EmployerDashboard() {
  const router = useRouter();

  // 🔹 States
  const [employer, setEmployer] = useState<Employer>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [mobileActionMenu, setMobileActionMenu] = useState<number | null>(null);
  const [companyProfileStep, setCompanyProfileStep] = useState<
    "initial" | "editing" | "completed"
  >("initial");
  const [companyDescription, setCompanyDescription] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingCompanyData, setExistingCompanyData] = useState<any>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [pausingJobId] = useState<number | null>(null);

  // 🔹 Function to fetch applicant counts for each job
  const fetchApplicantCounts = async (jobsList: Job[]) => {
    const jobsWithCounts = await Promise.all(
      jobsList.map(async (job) => {
        try {
          const count = await getApplicantCount(String(job.id));
          return { ...job, applicants_count: count };
        } catch (err) {
          console.error(`Error fetching applicants for job ${job.id}:`, err);
          return { ...job, applicants_count: 0 };
        }
      })
    );

    return jobsWithCounts;
  };

  // 🔹 Fetch employer + jobs + company profile
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchEmployer = async () => {
      try {
        const data = await getEmployerProfile(token);

        if (data) {
          setEmployer({
            fullName: data.full_name,
            email: data.email,
            company: data.company_name,
            mobile: data.mobile,
            companyName: data.company_name,
          });

          // Store employerId in localStorage
          if (data.id) {
            localStorage.setItem("employerId", String(data.id));
          }
        }
      } catch (err) {
        console.error("Error fetching employer profile:", err);
      }
    };

    const fetchJobs = async () => {
      try {
        const data = await getEmployerJobs(token);

        // Map data to match the Job interface
        const mappedJobs: Job[] = data.map((job) => ({
          id: Number(job.id),
          title: job.title || "",
          location: job.location || "",
          locality: job.locality,
          type: job.type || "",
          minPay: job.min_pay || "",
          maxPay: job.max_pay || "",
          description: job.description || "",
          roleCategory: job.role_category || "",
          experienceMin: job.experience_min || "",
          experienceMax: job.experience_max || "",
          certifications: job.certifications || [],
          created_at: job.created_at || "",
          updated_at: job.updated_at || "",
          status: (job.status as "Active" | "Paused") || "Active",
          expiryDate: job.expiry_date,
        }));

        // Fetch applicant counts for all jobs
        const jobsWithCounts = await fetchApplicantCounts(mappedJobs);
        setJobs(jobsWithCounts);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    const fetchCompanyProfileData = async () => {
      try {
        const data = await getCompanyProfile(token);

        if (data && data.about_company) {
          setExistingCompanyData(data);
          setCompanyDescription(data.about_company);
          setCompanyProfileStep("completed");
        }
        // If no company profile exists, we keep the initial state
      } catch (err) {
        console.error("Error fetching company profile:", err);
        // Keep initial state if there's an error
      }
    };

    Promise.all([fetchEmployer(), fetchJobs(), fetchCompanyProfileData()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 🔹 Company Profile API Functions
  const createCompanyProfile = async (aboutCompany: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const result = await createCompanyProfileApi(token, aboutCompany);
    if (!result.success) throw new Error(result.error || "Failed to create company profile");
    return result.data;
  };

  const updateCompanyProfile = async (aboutCompany: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const result = await updateCompanyProfileApi(token, aboutCompany);
    if (!result.success) throw new Error(result.error || "Failed to update company profile");
    return result.data;
  };

  const deleteCompanyProfileHandler = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const result = await deleteCompanyProfileApi(token);
    if (!result.success) throw new Error(result.error || "Failed to delete company profile");
    return result;
  };

  // 🔹 Job actions
  const handleEdit = (job: Job) => {
    router.push(`/EmployerDashboard/jobposting?jobId=${job.id}`);
  };

  const handleDelete = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized. Please login.");
        return;
      }

      const result = await deleteJob(token, String(jobId));

      if (!result.success) throw new Error(result.error || "Failed to delete job");

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      alert("Job deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the job. Please try again.");
    }
  };

  const handleTogglePauseJob = async (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const newStatus = job.status === "Active" ? "Paused" : "Active";

    // Optimistically update UI
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const result = await toggleJobStatus(token, String(jobId));

      if (result.success && result.data?.status) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: result.data!.status as "Active" | "Paused" } : j
          )
        );
      }
    } catch (err) {
      // Silently handle network or fetch errors
      console.warn("Network/API request failed, but UI already updated", err);
    }
  };

  const handleSaveCompanyProfile = async () => {
    if (companyDescription.trim() === "") {
      alert("Please provide a brief description before saving.");
      return;
    }

    setSaveLoading(true);
    try {
      if (existingCompanyData) {
        // Update existing profile
        await updateCompanyProfile(companyDescription);
      } else {
        // Create new profile
        const newData = await createCompanyProfile(companyDescription);
        setExistingCompanyData(newData);
      }

      setCompanyProfileStep("completed");
      setIsEditingExisting(false);
      alert("Company profile saved successfully!");
    } catch (err) {
      console.error("Error saving company profile:", err);
      alert("Failed to save company profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditCompanyProfile = () => {
    setIsEditingExisting(true);
    setCompanyProfileStep("editing");
  };

  const handleDeleteCompanyProfile = async () => {
    if (!confirm("Are you sure you want to delete your company profile?")) return;

    try {
      await deleteCompanyProfileHandler();
      setExistingCompanyData(null);
      setCompanyDescription("");
      setCompanyProfileStep("initial");
      setIsEditingExisting(false);
      alert("Company profile deleted successfully.");
    } catch (err) {
      console.error("Error deleting company profile:", err);
      alert("Failed to delete company profile. Please try again.");
    }
  };

  const toggleMobileActionMenu = (jobId: number) => {
    setMobileActionMenu(mobileActionMenu === jobId ? null : jobId);
  };

  // Helper function to truncate description
  const getTruncatedDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // 🔹 Loader
  if (loading) return <Loading />;

  return (
    <div className="  bg-[#F5F6FA] min-h-screen">
      {/* 🔹 Navbar */}
      <EmployerNavbar />

      {/* 🔹 Main container */}
      <div className="p-4 md:p-6   flex flex-col lg:flex-row gap-6 mx-auto container justify-center ">
        <div className="container mx-auto px-4 py-6">
          {/* Main Section */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            {/* 👉 Left Section */}
            <div className="w-full lg:w-[770px] space-y-5">
              {/* Company Profile / KYC Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {companyProfileStep === "initial" && (
                  <>
                    <h2 className="font-semibold text-gray-800 text-lg">
                      Complete Your Company Profile
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      Provide your company details to make your job postings stand out.
                    </p>
                    <MainButton
                      onClick={() => setCompanyProfileStep("editing")}
                      className="mt-4 "
                    >
                      Complete Profile
                    </MainButton>
                  </>
                )}

                {companyProfileStep === "editing" && (
                  <>
                    <h2 className="font-semibold text-gray-800 text-lg">
                      {isEditingExisting ? "Edit Company Profile" : "Complete Your Company Profile"}
                    </h2>
                    <textarea
                      placeholder="Provide a brief description of your company"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      rows={4}
                      className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <MainButton
                        onClick={handleSaveCompanyProfile}
                        disabled={saveLoading}
                      >
                        {saveLoading ? "Saving..." : "Save & Continue"}
                      </MainButton>
                      {isEditingExisting && (
                        <MainButton
                          onClick={() => {
                            setCompanyProfileStep("completed");
                            setIsEditingExisting(false);
                          }}
                        >
                          Cancel
                        </MainButton>
                      )}
                    </div>
                  </>
                )}

                {companyProfileStep === "completed" && (
                  <>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">
                        Company Description
                      </h3>
                      <div className="max-h-48 overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {showFullDescription
                            ? companyDescription
                            : getTruncatedDescription(companyDescription)}
                        </p>
                      </div>
                      {companyDescription.length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-2 text-blue-400  text-sm font-medium"
                        >
                          {showFullDescription ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <MainButton onClick={handleEditCompanyProfile}>Edit Description</MainButton>
                      <MainButton onClick={handleDeleteCompanyProfile}>Delete Description</MainButton>
                    </div>
                  </>
                )}
              </div>

              {/* Talent Pool + Job Posting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Talent Pool */}
                <div className="bg-white rounded-lg p-4 shadow-sm flex gap-4 items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <Search size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">VFind Talent Pool</h2>
                    <p className="text-sm text-gray-600">Discover talent, start free.</p>
                    <MainButton
                      onClick={() => window.open("/EmployerDashboard/Candidatelist", "_blank")}
                      className="mt-3"
                    >
                      Search Candidate
                    </MainButton>
                  </div>
                </div>

                {/* Free Job Posting */}
                <div className="bg-white rounded-lg p-4 shadow-sm flex gap-4 items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <Briefcase size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Post a Job</h2>
                    <p className="text-sm text-gray-600">Start posting jobs.</p>
                    <MainButton
                      onClick={() => router.push("/EmployerDashboard/jobposting")}
                      className="mt-3"
                    >
                      Post a Job
                    </MainButton>
                  </div>
                </div>
              </div>
            </div>

            {/* 👉 Right Section */}
            <div className="hidden lg:block lg:w-[350px]">
              <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                <h2 className="font-semibold text-gray-800">Need Help?</h2>

                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Phone</p>
                    <p className="mt-1 text-sm text-gray-700">{employer.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock size={20} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Hours</p>
                    <p className="text-sm text-gray-600">7:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar size={20} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Weekdays</p>
                    <p className="text-sm text-gray-600">Mon - Sat</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail size={20} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Email</p>
                    <a href="mailto:support@vfind.com" className="text-sm text-gray-600 hover:underline">
                      support@vfind.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Job Postings Section */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg p-6 shadow-sm w-full max-w-[1125px]">
              <h2 className="font-semibold text-gray-800">Job Postings</h2>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full mt-3 text-sm text-left border-collapse">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="py-2 px-3">Job Title</th>
                      <th className="py-2 px-3">Created By</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Timeframe</th>
                      <th className="py-2 px-3">Applicants</th>
                      <th className="py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 ? (
                      (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => {
                        const timeframe = getJobTimeframe(job.expiryDate);
                        return (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">{job.title}</td>
                          <td className="py-2 px-3">{employer.email}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "Active"
                                ? "border border-green-500 text-green-600 bg-[#6FB7720D] px-3 py-1 w-28 text-center"
                                : "border border-gray-400 bg-gray-100 text-gray-600 px-2 py-1 w-28 text-center"
                                }`}
                            >
                              {job.status === "Active" ? "Active" : "Paused"}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`text-sm font-medium ${
                                timeframe.isExpired ? "text-red-300" : "text-gray-700"
                              }`}
                            >
                              {timeframe.text}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <a
                              href={`/EmployerDashboard/Applicants/${job.id}`}
                              className="text-blue-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View ({job.applicants_count || 0})
                            </a>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleTogglePauseJob(job.id)}
                                disabled={pausingJobId === job.id}
                                className={`p-1 rounded cursor-pointer ${job.status === "Active"
                                  ? "text-gray-600 hover:text-[#61A6FA]"
                                  : "text-gray-600 hover:text-[#61A6FA]"
                                  } disabled:opacity-50`}
                                title={
                                  job.status === "Active"
                                    ? "Pause Job"
                                    : "Resume Job"
                                }
                              >
                                {pausingJobId === job.id ? (
                                  <Clock size={16} className="animate-spin" />
                                ) : job.status === "Active" ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} />
                                )}
                              </button>

                              <a
                                href={`/EmployerDashboard/jobPreview/${job.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600 p-1 rounded cursor-pointer"
                                title="Preview"
                              >
                                <Eye size={16} />
                              </a>

                              <button
                                onClick={() => handleEdit(job)}
                                className="text-gray-600 hover:text-blue-600 p-1 rounded cursor-pointer"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() => handleDelete(job.id)}
                                className="text-gray-600 hover:text-red-600 p-1 rounded cursor-pointer"
                                title="Delete"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          No jobs posted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile List */}
              <div className="md:hidden mt-3 space-y-3">
                {jobs.length > 0 ? (
                  (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => {
                    const timeframe = getJobTimeframe(job.expiryDate);
                    return (
                    <div key={job.id} className="pb-3 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-xs text-gray-500">{employer.email}</p>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${job.is_active !== false
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {job.is_active !== false ? "Active" : "Paused"}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                timeframe.isExpired ? "text-red-300" : "text-gray-700"
                              }`}
                            >
                              {timeframe.text}
                            </span>
                          </div>
                          <a
                            href={`/EmployerDashboard/Applicants/${job.id}`}
                            className="text-xs text-blue-400 hover:underline inline-block mt-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Applicants ({job.applicants_count || 0})
                          </a>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleMobileActionMenu(job.id)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {mobileActionMenu === job.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border">
                              <button
                                onClick={() => handleTogglePauseJob(job.id)} // only pass job.id
                                disabled={pausingJobId === job.id}
                                className={`p-1 rounded cursor-pointer ${job.status === "Active"
                                  ? "text-gray-600 hover:text-orange-600"
                                  : "text-gray-600 hover:text-green-600"
                                  } disabled:opacity-50`}
                                title={
                                  job.status === "Active"
                                    ? "Pause Job"
                                    : "Resume Job"
                                }
                              >
                                {pausingJobId === job.id ? (
                                  <Clock size={16} className="animate-spin" />
                                ) : job.status === "Active" ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} />
                                )}
                              </button>

                              <a
                                href={`/EmployerDashboard/jobPreview/${job.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Preview
                              </a>
                              <button
                                onClick={() => {
                                  handleEdit(job);
                                  setMobileActionMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(job.id);
                                  setMobileActionMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No jobs posted yet.
                  </div>
                )}
              </div>

              {/* Show All Button */}
              {jobs.length > 4 && (
                <MainButton
                  onClick={() => setShowAllJobs(!showAllJobs)}
                  className="mt-4  gap-3 text-primary  text-sm md:text-base"
                >
                  {showAllJobs ? "Show Less" : "View all Jobs"}
                </MainButton>
              )}
            </div>
          </div>

          <div className="bg-white">
            <Footer />
          </div>
        </div>
        </div>
        </div>


        );
}