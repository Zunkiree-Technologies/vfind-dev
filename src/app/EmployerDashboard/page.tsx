"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";
import { Briefcase, Calendar, CheckCircle, Clock, Edit, Eye, Mail, Phone, Search, Trash, Pause, Play } from "lucide-react";

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
}

interface Employer {
  fullName?: string;
  email?: string;
  company?: string;
  mobile?: string;
  companyName?: string;
}

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
    const token = localStorage.getItem("authToken");
    if (!token) return jobsList;

    const jobsWithCounts = await Promise.all(
      jobsList.map(async (job) => {
        try {
          const res = await fetch(
            `https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/getAllNursesAppliedForJob?job_id=${job.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const applications = await res.json();
          return { ...job, applicants_count: applications.length };
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
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/get_employer_profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(token)

        if (!res.ok) throw new Error("Failed to fetch employer profile");
        const data = await res.json();

        setEmployer(data?.data || data);

        // ✅ Store employerId in localStorage
        const employerId = data?.data?.id || data?.id;
        if (employerId) {
          localStorage.setItem("employerId", String(employerId));
        }
      } catch (err) {
        console.error("Error fetching employer profile:", err);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/get_job_details",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();

        // Fetch applicant counts for all jobs
        const jobsWithCounts = await fetchApplicantCounts(data);
        setJobs(jobsWithCounts);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    const fetchCompanyProfile = async () => {
      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/get_about_company",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          if (data && data.about_company) {
            setExistingCompanyData(data);
            setCompanyDescription(data.about_company);
            setCompanyProfileStep("completed");
          }
        }
        // If no company profile exists, we keep the initial state
      } catch (err) {
        console.error("Error fetching company profile:", err);
        // Keep initial state if there's an error
      }
    };

    Promise.all([fetchEmployer(), fetchJobs(), fetchCompanyProfile()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // 🔹 Company Profile API Functions
  const createCompanyProfile = async (aboutCompany: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const res = await fetch(
      "https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/about_company",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ about_company: aboutCompany })
      }
    );

    if (!res.ok) throw new Error("Failed to create company profile");
    return res.json();
  };

  const updateCompanyProfile = async (aboutCompany: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const res = await fetch(
      "https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/about_company",
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ about_company: aboutCompany })
      }
    );

    if (!res.ok) throw new Error("Failed to update company profile");
    return res.json();
  };

  const deleteCompanyProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const res = await fetch(
      "https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/about_company",
      {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }
    );

    if (!res.ok) throw new Error("Failed to delete company profile");
    return res.json();
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

      const res = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete job");

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
  // console.log(jobId)
   try {
     const token = localStorage.getItem("authToken");
     const res = await fetch(
       "https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/pause_active_job",
       {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ jobs_id: jobId }),
       }
     );

     // Prevent throwing error to console
     if (!res.ok) {
       console.warn(
         "API returned an error, but frontend already updated optimistically",
         res.status
       );
       return; // do not throw
     }

     const data = await res.json();
     if (data.result1?.status) {
       setJobs((prev) =>
         prev.map((j) =>
           j.id === jobId ? { ...j, status: data.result1.status } : j
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
      await deleteCompanyProfile();
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
      <div className="p-4 mt-5 md:p-6   flex flex-col lg:flex-row gap-6 mx-auto container justify-center ">
        {/* 👉 Left section */}
        <div className="space-y-5">
          {/* KYC Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm min-h-[195px]">
            {/* Initial Step */}
            {companyProfileStep === "initial" && (
              <>
                <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                  Complete Your Company Profile
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Provide your company details to make your job postings stand
                  out.
                </p>

                <button
                  onClick={() => setCompanyProfileStep("editing")}
                  className="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-400 text-white rounded-md 
                   hover:bg-blue-500 text-sm md:text-base transition"
                >
                  Complete Profile
                </button>
              </>
            )}

            {/* Editing Step */}
            {companyProfileStep === "editing" && (
              <>
                <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                  {isEditingExisting
                    ? "Edit Company Profile"
                    : "Complete Your Company Profile"}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Provide your company details to make your job postings stand
                  out.
                </p>

                {/* Textarea */}
                <textarea
                  placeholder="Provide a brief description of your company"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows={4}
                  className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 
                   text-sm md:text-base text-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />

                {/* Save button */}
                <button
                  onClick={handleSaveCompanyProfile}
                  disabled={saveLoading}
                  className="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md 
                   hover:bg-blue-600 text-sm md:text-base transition disabled:opacity-50"
                >
                  {saveLoading ? "Saving..." : "Save & Continue"}
                </button>

                {isEditingExisting && (
                  <button
                    onClick={() => {
                      setCompanyProfileStep("completed");
                      setIsEditingExisting(false);
                    }}
                    className="mt-4 ml-2 w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md 
                     hover:bg-gray-600 text-sm md:text-base transition"
                  >
                    Cancel
                  </button>
                )}

                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  Your company description will appear on job postings.
                </p>
              </>
            )}

            {/* Completed Step */}
            {companyProfileStep === "completed" && (
              <>
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 
                      bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <CheckCircle
                    className="text-green-600 flex-shrink-0"
                    size={22}
                  />
                  <div className="flex-grow">
                    <h2 className="font-semibold text-green-700 text-sm md:text-base">
                      Company Profile Completed
                    </h2>
                    <p className="mt-1 text-xs md:text-sm text-green-600">
                      Your company description has been saved successfully.
                    </p>
                  </div>
                </div>

                {/* Company Description Display */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 text-sm mb-2">
                    Company Description
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {showFullDescription
                      ? companyDescription
                      : getTruncatedDescription(companyDescription)}
                  </p>
                  {companyDescription.length > 150 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={handleEditCompanyProfile}
                    className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 
                     text-sm transition flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteCompanyProfile}
                    className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 
                     text-sm transition flex items-center gap-2"
                  >
                    <Trash size={16} />
                    Delete Profile
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Talent Pool + Free Job Posting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Talent Pool */}
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                <Search size={20} className="text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  VFind Talent Pool
                </h2>
                <p className="text-sm text-gray-600">
                  Discover talent, start free.
                </p>
                <button
                  onClick={() =>
                    window.open("/EmployerDashboard/Candidatelist", "_blank")
                  }
                  className="mt-3 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-sm md:text-base"
                >
                  Search Candidate
                </button>
              </div>
            </div>

            {/* Free Job Posting */}
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                <Briefcase size={20} className="text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Post a Free Job</h2>
                <p className="text-sm text-gray-600">
                  Start for free upgrade anytime
                </p>
                <button
                  onClick={() => router.push("/EmployerDashboard/jobposting")}
                  className="mt-3 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-sm md:text-base"
                >
                  Post a Free Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 👉 Right section */}
        <div className="hidden lg:block lg:w-80  ">
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4 h-[343px]">
            <h2 className="font-semibold text-gray-800">Need Help?</h2>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone size={20} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Phone</p>
                <p className="mt-2 text-sm text-gray-700">
                  {" "}
                  {employer.mobile}{" "}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-3">
              <Clock size={20} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Hours</p>
                <p className="text-sm text-gray-600">7:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Weekdays */}
            <div className="flex items-start space-x-3">
              <Calendar size={20} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Weekdays</p>
                <p className="text-sm text-gray-600">Mon - Sat</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail size={20} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Email</p>
                <a
                  href="mailto:support@vfind.com"
                  className="text-sm text-gray-600 hover:underline"
                >
                  support@vfind.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Job Postings Section */}
      <div className=" flex item-center justify-center   container mx-auto ">
        <div className="bg-white p-5 w-[950px] rounded-lg  shadow-sm ">
          <h2 className="font-semibold text-gray-800">Job Postings</h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full mt-3 text-sm text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2 px-3">Job Title</th>
                  <th className="py-2 px-3">Created By</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Applicants</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">{job.title}</td>
                      <td className="py-2 px-3">{employer.email}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.is_active !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.is_active !== false ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <a
                          href={`/EmployerDashboard/Applicants/${job.id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View ({job.applicants_count || 0})
                        </a>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          {jobs.map((job) => (
                            // eslint-disable-next-line react/jsx-key
                            <button
                              onClick={() => handleTogglePauseJob(job.id)}
                              disabled={pausingJobId === job.id}
                              className={`p-1 rounded cursor-pointer ${
                                job.status === "Active"
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
                          ))}

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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
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
              (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => (
                <div key={job.id} className="pb-3 border-b last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-xs text-gray-500">{employer.email}</p>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.is_active !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.is_active !== false ? "Active" : "Paused"}
                        </span>
                      </div>
                      <a
                        href={`/EmployerDashboard/Applicants/${job.id}`}
                        className="text-xs text-blue-600 hover:underline inline-block mt-1"
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
                            className={`p-1 rounded cursor-pointer ${
                              job.status === "Active"
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
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No jobs posted yet.
              </div>
            )}
          </div>

          {/* Show All Button */}
          {jobs.length > 4 && (
            <button
              onClick={() => setShowAllJobs(!showAllJobs)}
              className="mt-4 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-sm md:text-base"
            >
              {showAllJobs ? "Show Less" : "View All Jobs"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}