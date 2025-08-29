"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";



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
}

export default function EmployerDashboard() {
  const router = useRouter();

  const [employer, setEmployer] = useState<Employer>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [mobileActionMenu, setMobileActionMenu] = useState<number | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchEmployer = async () => {
      try {
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:t5TlTxto/get_employer_profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch employer profile");
        const data = await res.json();

        setEmployer(data?.data || data);

        // ✅ Store employerId in localStorage directly here
        const employerId = data?.data?.id || data?.id;
        if (employerId) {
          // console.log("Employer ID:", employerId);
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
        // console.log(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    Promise.all([fetchEmployer(), fetchJobs()]).finally(() => setLoading(false));
  }, []);




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

  const toggleMobileActionMenu = (jobId: number) => {
    setMobileActionMenu(mobileActionMenu === jobId ? null : jobId);
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div>
      <EmployerNavbar />
      <div className="p-4 mt-5  md:p-6 bg-gray-50 min-h-screen flex flex-col lg:flex-row gap-6 mx-auto container  justify-center">


        {/* Left section */}
        <div className=" space-y-5  ">
          <h1 className="text-xl font-semibold">
            Welcome,{" "}
            <span className="text-blue-600">
              {employer.fullName || employer.company || employer.email}
            </span>
          </h1>

          {/* KYC Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-yellow-800 font-semibold">Important</h2>
            <p className="text-sm text-gray-700 mt-1">
              Your KYC is pending. Complete your KYC to activate your subscription
              and secure your account.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base">
              Complete KYC
            </button>
          </div>

          {/* Talent pool and Free Job Posting in grid for tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Talent Pool */}
            <div className="bg-white  rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">VFind Talent Pool</h2>
                <p className="text-sm text-gray-600">
                  Searching required Candidate, As Fast as Needed
                </p>
                <button
                  onClick={() =>
                    window.open("/EmployerDashboard/Candidatelist", "_blank")
                  }
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
                >
                  Search Candidate
                </button>
              </div>
            </div>

            {/* Free Job Posting */}
            <div className="bg-white  rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  You are eligible for posting a Free Job
                </h2>
                <p className="text-sm text-gray-600">
                  Start without any charges and upgrade later
                </p>
                <button
                  onClick={() => router.push("/EmployerDashboard/jobposting")}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
                >
                  Post a Free Job
                </button>
              </div>
            </div>
          </div>

          {/* Job Postings */}
          <div className="bg-white h-fit  rounded-lg p-4 shadow-sm overflow-x-auto">
            <h2 className="font-semibold text-gray-800">Job Postings</h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full mt-3 text-sm text-left border-collapse">
                <thead>
                  <tr className=" text-gray-600">
                    <th className="py-2 px-3">Job Title</th>
                    <th className="py-2 px-3">Created By</th>
                    <th className="py-2 px-3">Created  On</th>
                    <th className="py-2 px-3">Applicants</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length > 0 ? (
                    (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => (
                      <tr key={job.id} className=" hover:bg-gray-50">
                        <td className="py-2 px-3">{job.title}</td>
                        <td className="py-2 px-3">{employer.email}</td>
                        <td className="py-2 px-3">
                          {job.created_at ? new Date(Number(job.created_at)).toLocaleDateString() : "-"}
                        </td>

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
                          <div className="relative">
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
                  <div key={job.id} className=" pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-xs text-gray-500">
                          Modified: {new Date(job.updated_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applicants: {job.applicants_count ?? 0}
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

            {jobs.length > 4 && (
              <button
                onClick={() => setShowAllJobs(!showAllJobs)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
              >
                {showAllJobs ? "Show Less" : "View All Jobs"}
              </button>
            )}
          </div>
        </div>

        {/* Right section - Contact Us + Logout */}
        <div className="lg:w-80 lg:mt-12 space-y-4 ">
          <div className="bg-white  rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800">Contact Us</h2>
            <p className="mt-2 text-sm text-gray-700">
              04 23547855 | 61 0425145245
              <br />
              (7:00 AM - 6:00 PM, Mon - Sat)
              <br />
              <a
                href="mailto:info@simplifycodes.com"
                className="text-blue-600 underline"
              >
                support@vfind.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}