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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#F5F6FA] rounded-lg shadow-sm ">

              {/* Header Section */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {job.company || "St. Mary's Aged Care Facility"}
                    </h1>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              </div>

              {/* Basic Info Section */}
            <div className="p-4 border-b border-gray-200">
  <div className="flex flex-col gap-4 text-sm">

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Industry</span>
      <p className="text-gray-900">: Healthcare &amp; Social Assistance</p>
    </div>

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Location</span>
      <p className="text-gray-900">: Melbourne, Victoria</p>
    </div>

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Salary</span>
      <p className="text-gray-900">: AUD 14-16/hr</p>
    </div>

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Job Type</span>
      <p className="text-gray-900">: Full Time</p>
    </div>

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Job Shift</span>
      <p className="text-gray-900">: Not specified</p>
    </div>

    <div className="flex justify-between items-center w-2/3">
      <span className="font-medium text-gray-600">Job Posted</span>
      <p className="text-gray-900">: 1 Days Ago</p>
    </div>

  </div>
</div>


              {/* Candidate Preferences */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Preferences</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Role Category</span>
                    <p className="text-gray-900 mt-1">{job.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Experience</span>
                    <p className="text-gray-900 mt-1">{job.experienceMin} - {job.experienceMax} years</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Preferred Certifications</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>

                {/* Clinical Care Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Clinical Care</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Provide high-quality nursing care to residents</li>
                    <li>• Administer medications per AHPRA standards</li>
                    <li>• Develop and review care plans</li>
                  </ul>
                </div>

                {/* Resident Wellbeing Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Resident Wellbeing</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Monitor physical and emotional health</li>
                    <li>• Support daily living needs</li>
                    <li>• Ensure dignity, respect, and compassion</li>
                  </ul>
                </div>

                {/* Team Collaboration Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Work with care staff & allied health professionals</li>
                    <li>• Mentor junior staff</li>
                    <li>• Participate in team meetings</li>
                  </ul>
                </div>

                {/* Compliance & Safety Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Compliance & Safety</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Maintain accurate documentation</li>
                    <li>• Follow infection control & WHS standards</li>
                    <li>• Report incidents and improve quality</li>
                  </ul>
                </div>

                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {submitting ? "Submitting..." : "Apply Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - About Company */}
          <div className="lg:col-span-1">
            <div className="bg-[#F5F6FA] rounded-lg shadow-sm  p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="mb-4">
                  St. Marys Aged Care Facility is committed to providing compassionate, high-quality care to our elderly residents in a safe, nurturing, and homelike environment. Our focus is on promoting dignity, independence, and quality of life through person-centered care for all of every resident.
                </p>
                <p className="mb-4">
                  With a team of dedicated healthcare professionals, we ensure that residents receive not only exceptional clinical care but also emotional and social support to ensure they feel valued, respected, and at home.
                </p>
                <p>
                  We are a close-knit community where both residents and staff can thrive, offering opportunities for professional growth while maintaining the highest standards of care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}