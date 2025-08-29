"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "../../../../../components/loading";
import { MapPin, DollarSignIcon, Clock, Briefcase } from "lucide-react";

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
  const { id } = useParams(); // grab id from URL
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null); // state for token

  // Fetch token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // same key as login page
    if (token) setAuthToken(token);
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

    const emailInput = (document.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement)?.value;

    if (!emailInput) {
      alert("Email is required");
      return;
    }

    if (!authToken) {
      alert("You must be logged in to apply.");
      return;
    }

    try {
      setSubmitting(true);

      // Hit the applications API using the token
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
            email: emailInput,
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white bg-opacity-10 rounded-md p-3">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <p className="text-blue-100">{job.company || "Healthcare Provider"}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Salary Range</p>
                <p className="text-sm text-gray-500">${job.minPay} - ${job.maxPay}/hr</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Job Type</p>
                <p className="text-sm text-gray-500">{job.type}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Experience Required</p>
                <p className="text-sm text-gray-500">
                  {job.experienceMin} - {job.experienceMax} years
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Job Description
              </h3>
              {job.type && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-800 dark:text-blue-200">
                  {job.type}
                </span>
              )}
            </div>

            {/* Raw description */}
            <div
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {/* Certifications / Highlights */}
            {job.certifications?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full dark:bg-blue-800 dark:text-blue-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>


          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {job.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h2>
            {job.contact_email ? (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800">
                  To apply, send your resume to{" "}
                  <a href={`mailto:${job.contact_email}`} className="font-medium underline">
                    {job.contact_email}
                  </a>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                  <input
                    type="file"
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  disabled={submitting}
                  onClick={handleSubmitApplication}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
