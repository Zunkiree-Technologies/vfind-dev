"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  updated_at: string;
  certifications: string[];
  company?: string;
  shift?: string;
  contact_email?: string;
}

export default function JobApplicationPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [nurseEmail, setNurseEmail] = useState<string | null>(null);

  // Fetch token & nurse email from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) setAuthToken(token);
    if (email) setNurseEmail(email);
  }, []);

  useEffect(() => {
    if (!id) {
      router.push("/nurseProfile");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/jobs/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const data: Job = await res.json();
        setJob(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

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
        "https://x8ki-letl-twmt.n7.xano.io/api:PX2mK6Kr/applications",
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

  return (
    <div className="min-h-screen flex bg-white justify-around item-center gap-5 ">
      {/* Main Content */}
      <div className=" bg-[#F5F6FA] rounded-lg shadow-md">
        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {job.company || "St. Mary's Aged Care Facility"}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Content - Job Details */}
              <div className="xl:col-span-2 space-y-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {job.title}
                </h3>
                <div className="w-full h-0.5 bg-gray-300" />

                {/* Basic Info Card */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-24 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Industry</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">Healthcare & Social Assistance</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-24 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Location</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{job.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-24 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Salary</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">AUD {job.minPay}-{job.maxPay}/hr</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-24 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Job Type</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{job.type}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-24 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Job Shift</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{job.shift || "Any"}</span>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="w-full h-0.5 bg-gray-300" />

                {/* Candidate Preferences */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Preferences</h3>
                  <div className="space-y-4">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Role Category</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{job.title}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <span className="text-gray-900 font-medium">Experience</span>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 mx-4">
                        <span className="text-gray-900">:</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{job.experienceMin} - {job.experienceMax} years</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex-shrink-0 mb-3">
                        <span className="text-gray-900 font-medium">Preferred Qualifications</span>
                      </div>
                      <div className="space-y-2">
                        {job.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
                <div className="w-full h-0.5 bg-gray-300" />

                {/* Job Description */}
                <div className="p-4 sm:p-6  rounded-lg shadow-md ">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed overflow-y-auto h-75"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>


                {/* Apply Button */}
                <div className="p-4 sm:p-6">
                  <button
                    onClick={handleSubmitApplication}
                    disabled={submitting}
                    className="w-full sm:w-auto bg-blue-400 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Submitting Application..." : "Apply Now"}
                  </button>
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>

      {/* ----About company-- */}
      <div className="h-fit bg-[#F5F6FA] max-w-md p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900">About Company</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deserunt, ipsam earum quo corporis nisi suscipit maiores illo eaque porro dolore eum culpa quos tempore molestiae sunt assumenda consequatur aliquam, sed sapiente quis dolores ipsa? Aliquid soluta, nam aut dolorem cumque aspernatur? Consectetur quam deserunt ipsa magnam ipsum. Repellendus illum praesentium vel deleniti, temporibus a iste perspiciatis voluptatem officiis, est autem impedit asperiores iusto nulla ipsum tempora hic dolorum laudantium tempore ab consectetur eius eligendi quod. Debitis totam ipsum excepturi sunt dolor aliquam optio adipisci praesentium veritatis voluptatibus ullam delectus explicabo ex enim sapiente beatae aspernatur, magni fugiat dolorum. Deserunt.
        </p>


      </div>



    </div>
  );
}