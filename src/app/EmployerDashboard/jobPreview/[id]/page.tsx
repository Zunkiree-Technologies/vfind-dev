"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../../../../components/loading";
import { Building2 } from "lucide-react";
import EmployerNavbar from "../../components/EmployerNavbar";
import Footer from "@/app/Admin/components/layout/Footer";

interface Job {
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
  languageRequirements?: string;
  certifications?: string[];
  created_at: number;
  applicants_count?: number;
  JobShift?: string;
  user_id?: number;
}

interface Company {
  about_company: string;
  name: string;
}

export default function JobPreviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setAuthToken] = useState<string | null>(null);
  const [] = useState(false);

  // Load auth token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setAuthToken(token);
  }, []);

  // Fetch job details
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/get_job_details`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const jobs: Job[] = await res.json();
        const selected = jobs.find((j) => j.id === Number(id));
        setJob(selected || null);

        if (selected?.user_id) fetchCompanyInfo(selected.user_id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const fetchCompanyInfo = async (userId: number) => {
    try {
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:dttXPFU4/get_about_company_for_saved_jobs_page",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const data = await res.json();

      // ✅ Store both name and about_company
      setCompany({
        name: data.company_name || "Unknown Company",
        about_company: data.about_company || "No company info available.",
      });
    } catch (error) {
      console.error("Error fetching company info:", error);
      setCompany({
        name: "Error loading name",
        about_company: "Failed to load company info.",
      });
    }
  };

  // Handle bookmark toggle

  if (loading) return <Loading />;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found.</div>;

  return (
    <div>
      {/* Navbar */}
      <EmployerNavbar />

      <div className="min-h-fit bg-gray-50 py-8 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="shadow-sm relative bg-white rounded-lg">



                {/* Header Section */}
                <div className="p-6 border-b border-gray-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        {company?.name}
                      </h1>
                    </div>
                  </div>
                  <h2 className="text-[24px] font-semibold text-gray-900">
                    {job.title}
                  </h2>
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

                    {/* Job Posted */}
                    <div className="flex justify-between items-center w-2/3">
                      <span className="font-medium text-gray-600">
                        Job Posted
                      </span>
                      <div className="flex justify-start gap-10 items-center w-1/2">
                        <span className="font-medium text-gray-600">:</span>
                        <p className="text-gray-900">
                          {job.created_at
                            ? new Date(job.created_at).toLocaleDateString(
                              "en-AU",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
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
            </div>

            {/* Right Column - Company Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                <p className="text-gray-700">{company?.about_company || "Loading company info..."}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="bg-white">
              <Footer />
            </div>
    </div>
  );

}
