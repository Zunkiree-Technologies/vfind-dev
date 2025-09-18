"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";
import { Briefcase, Calendar, CheckCircle, Clock, Mail, Phone, Search } from "lucide-react";

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
}

interface Employer {
  fullName?: string;
  email?: string;
  company?: string;
  mobile?: string;
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

  // 🔹 Fetch employer + jobs
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchEmployer = async () => {
      try {
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:t5TlTxto/get_employer_profile",
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
          "https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/get_job_details",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    Promise.all([fetchEmployer(), fetchJobs()]).finally(() =>
      setLoading(false)
    );
  }, []);

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
        `https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/jobs/${jobId}`,
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
 const handleSaveCompanyProfile = () => {
  if (companyDescription.trim() === "") {
    alert("Please provide a brief description before saving.");
    return;
  }
  // you can add API call / localStorage here if needed
  setCompanyProfileStep("completed");
};

  const toggleMobileActionMenu = (jobId: number) => {
    setMobileActionMenu(mobileActionMenu === jobId ? null : jobId);
  };

  // 🔹 Loader
  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50">
      {/* 🔹 Navbar */}
      <EmployerNavbar />

      {/* 🔹 Main container */}
      <div className="p-4 mt-5 md:p-6  h-fit flex flex-col lg:flex-row gap-6 mx-auto container justify-center">

        {/* 👉 Left section */}
        <div className="space-y-5">
          {/* Welcome */}
          <h1 className="text-xl font-semibold">
            Welcome,{" "}
            <span className="text-blue-600">
              {employer.fullName || employer.company || employer.email}
            </span>
          </h1>

          {/* KYC Section */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
  {companyProfileStep === "initial" && (
    <>
      <h2 className="font-semibold text-gray-800">
        Complete Your Company Profile
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Provide your company details to make your job postings stand out.
      </p>

      <button
        onClick={() => setCompanyProfileStep("editing")}
        className="mt-3 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 text-sm md:text-base"
      >
        Complete Profile
      </button>
    </>
  )}

  {companyProfileStep === "editing" && (
    <>
      <h2 className="font-semibold text-gray-800">
        Complete Your Company Profile
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Provide your company details to make your job postings stand out.
      </p>

      {/* Textarea */}
      <textarea
        placeholder="Provide a brief description of your company"
        value={companyDescription}
        onChange={(e) => setCompanyDescription(e.target.value)}
        rows={4}
        className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
      />

      {/* Save button */}
      <button
        onClick={handleSaveCompanyProfile}
        className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm md:text-base"
      >
        Save & Continue
      </button>

      <p className="mt-2 text-xs text-gray-500">
        Your company description will appear on job postings.
      </p>
    </>
  )}

  {companyProfileStep === "completed" && (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
      <CheckCircle className="text-green-600" size={22} />
      <div>
        <h2 className="font-semibold text-green-700">Company Profile Completed</h2>
        <p className="mt-1 text-sm text-green-600">
          Your company description has been saved successfully.
        </p>
      </div>
    </div>
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
        <div className="lg:w-80 lg:mt-12">
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800">Need Help?</h2>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone size={20} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">Phone</p>
                <p className="mt-2 text-sm text-gray-700"> {employer.mobile}  </p>
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
      <div className=" flex item-center justify-center h-fit overflow-x-auto  container mx-auto">
        <div className="bg-white p-5 w-5xl rounded-lg  shadow-sm ">
          <h2 className="font-semibold text-gray-800">Job Postings</h2>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full mt-3 text-sm text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2 px-3">Job Title</th>
                  <th className="py-2 px-3">Created By</th>
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
                        <a
                          href={`/EmployerDashboard/Applicants/${job.id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <a
                            href={`/EmployerDashboard/jobPreview/${job.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 p-1 rounded cursor-pointer"
                            title="Preview"
                          >
                            <FaEye size={16} />
                          </a>
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-gray-600 hover:text-blue-600 p-1 rounded cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-gray-600 hover:text-red-600 p-1 rounded cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-gray-500"
                    >
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
                <div key={job.id} className="pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-xs text-gray-500">

                        <a
                          href={`/EmployerDashboard/Applicants/${job.id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {employer.email}
                        </a>
                      </p>

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
