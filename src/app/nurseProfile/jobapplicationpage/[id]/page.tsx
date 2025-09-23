"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Loader from "../../../../../components/loading";
import { Building2 } from "lucide-react";

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
  created_at: string;
  certifications: string[];
  company?: string;
  JobShift?: string;
  contact_email?: string;
  employer_id?: number;
}

interface Company {
  about_company: string;
}

interface Employer {
  id: number;
  companyName?: string;
  fullName?: string;
  company?: string;
}

export default function JobApplicationPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [nurseEmail, setNurseEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const companyFromQuery = searchParams.get("company");

  // Fetch token & nurse email from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) setAuthToken(token);
    if (email) setNurseEmail(email);
  }, []);

  // Fetch job details
  useEffect(() => {
    if (!id) {
      router.push("/nurseProfile");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs/${id}`
        );
        if (!res.ok) throw new Error("Job not found");
        const data: Job = await res.json();
        setJob(data);

        // After getting job data, fetch employer and company info
        if (data.employer_id) {
          await fetchEmployer(data.employer_id);
          await fetchCompany(data.employer_id); // Use employer_id for company data
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  // Fetch employer details
  const fetchEmployer = async (employerId: number) => {
    try {
      const employerRes = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/employers/${employerId}`
      );

      if (employerRes.ok) {
        const employerData: Employer = await employerRes.json();
        setEmployer(employerData);
        console.log("Employer data:", employerData);
      }
    } catch (err) {
      console.error("Error fetching employer data:", err);
    }
  };

  // Fetch company about info using the employer ID
  const fetchCompany = async (employerId: number) => {
    try {
      const companyRes = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/get_about_company`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: employerId.toString()
          })
        }
      );

      if (companyRes.ok) {
        const companyData = await companyRes.json();
        // Extract only the about_company field
        setCompany({ about_company: companyData.about_company });
        console.log("Company about:", companyData.about_company);
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
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

    try {
      setSubmitting(true);

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            jobs_id: job.id,
            status: "applied",
            applied_date: new Date().toISOString(),
            email: nurseEmail,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit application");

      alert("Job application sent successfully!");
      router.push("/nurseProfile");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader loading={true} message="Fetching job data..." />;
  if (error || !job)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error || "Job not found."}</p>
        </div>
      </div>
    );

  const getCompanyName = () => {
    if (companyFromQuery) return companyFromQuery;
    if (employer?.companyName) return employer.companyName;
    return "Healthcare Facility"; 
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#F5F6FA] rounded-lg shadow-sm ">

              {/* Header Section */}
              <div className="p-6 border-b border-gray-500" >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {getCompanyName()}
                    </h1>
                  </div>
                </div>
                <h2 className="text-[24px] font-semibold text-gray-900 ">{job.title}</h2>
              </div>

              {/* Basic Info Section */}
              <div className="p-4 border-b border-gray-500">
                <div className="flex flex-col gap-4 text-sm">

                  {/* Location */}
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Location</span>
                    <div className="flex justify-start items-center w-1/2 gap-10">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900">{job.location || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Salary</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
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
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Job Type</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900">{job.type || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Job Shift */}
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Job Shift</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900">{job.JobShift || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Job Posted */}
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Job Posted</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900">
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Candidate Preferences */}
              <div className="p-6 border-b border-gray-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Preferences</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Role Category</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900">{job.title}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-2/3 ">
                    <span className="font-medium text-gray-600">Experience</span>
                    <div className="flex justify-start gap-10 items-center w-1/2 ">
                      <span className="font-medium text-gray-600">:</span>
                      <p className="text-gray-900 ">{job.experienceMin}  {job.experienceMax} </p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Preferred Certifications</span>
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
              <div className="p-6  ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700  rounded-lg p-4 bg-gray-50 text-justify"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

            </div>

            <button
              onClick={() => {
                if (!authToken || !nurseEmail) {
                  router.push("/signup"); // redirect to signup
                } else {
                  handleSubmitApplication();
                }
              }}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium mt-3"
            >
              {submitting ? "Submitting..." : "Apply Now"}
            </button>

          </div>

          {/* Right Column - About Company */}
          <div className="lg:col-span-1">
            <div className="bg-[#F5F6FA] rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About Company
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                {company?.about_company ? (
                  <p>{company.about_company}</p>
                ) : (
                  <p>No company information available.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}