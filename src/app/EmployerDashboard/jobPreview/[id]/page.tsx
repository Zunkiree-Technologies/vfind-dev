"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../../../../components/loading";
import { MapPin, Briefcase, DollarSign, Award } from "lucide-react";

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
  languageRequirements: string;
  certifications: string[];
  updated_at: string;
  created_at: number;
  applicants_count?: number;
}

export default function JobPreviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/get_job_details`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const jobs: Job[] = await res.json();
        const selected = jobs.find((j) => id && j.id === Number(id));
        setJob(selected || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <Loading />;
  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border">
        <p className="text-gray-600 text-lg">Job not found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4 text-gray-900">
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-4xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Briefcase className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {job.roleCategory}
            </span>
          </div>

          {/* Main Job Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">

            {/* Job Header */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      <span> Title:</span> {job.title}
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">Posted:</span>
                      <span className="ml-2">
                        {job.created_at
                          ? `${Math.floor((Date.now() - job.created_at) / (1000 * 60 * 60 * 24))} days ago`
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Type:</span>
                  <span className="ml-2">{job.type}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Pay:</span>
                  <span className="ml-2 font-semibold">${job.minPay} - {job.maxPay} /hr</span>
                </div>
              </div>

              {/* Certifications */}
              {job.certifications && job.certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    Preferred Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {job.experienceMin && (
                <div className="p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">Experience Required:</h3>
                  <p className="text-gray-800 font-medium">
                    {job.experienceMin}
                    {job.experienceMax && job.experienceMax !== job.experienceMin
                      ? ` - ${job.experienceMax}`
                      : ''} years
                  </p>
                </div>
              )}

              {job.languageRequirements && (
                <div className="p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">Language Requirements:</h3>
                  <p className="text-gray-800 font-medium">{job.languageRequirements}</p>
                </div>
              )}
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
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.certifications.map((cert) => (
  
                    <span
                      key={cert}
                      className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full dark:bg-blue-800 dark:text-blue-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>







          </div>
        </div>
      </div>
    </div>
  );
}
