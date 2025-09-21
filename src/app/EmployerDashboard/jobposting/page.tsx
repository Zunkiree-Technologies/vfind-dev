"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RichTextEditor from "../components/RichTextEditor";




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
  certifications: string[];
  languageRequirements?: string;
  keyResponsibilities: string;
  workEnvironment?: string;
}

function JobPostingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Omit<Job, "id">>({
    title: "",
    location: "",
    locality: "",
    type: "",
    minPay: "",
    maxPay: "",
    description: "",
    roleCategory: "",
    experienceMin: "",
    languageRequirements: "",
    certifications: [],
    keyResponsibilities: "",
    workEnvironment: "",
  });

  const JOB_POST_ENDPOINT = "https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs";
  const JOB_EDIT_ENDPOINT = "https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/edit_job_details";
  const JOB_LIST_ENDPOINT = "https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/get_job_details";
  const [isTypingOther, setIsTypingOther] = useState(false);




  // Fetch job details if editing
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const token = localStorage.getItem("authToken");
          const res = await fetch(JOB_LIST_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch job details");
          const jobs: Job[] = await res.json();

          const job = jobs.find((j: Job) => j.id === parseInt(jobId));

          if (job) {
            setFormData({
              title: job.title || "",
              location: job.location || "",
              locality: job.locality || "",
              type: job.type || "",
              minPay: job.minPay || "",
              maxPay: job.maxPay || "",
              description: job.description || "",
              roleCategory: job.roleCategory || "",
              experienceMin: job.experienceMin || "",
              languageRequirements: job.languageRequirements || "",
              certifications: job.certifications || [],
              keyResponsibilities: job.keyResponsibilities || "",
              workEnvironment: job.workEnvironment || "",
            });
          }
        } catch (err) {
          console.error("Error fetching job details:", err);
        }
      }
    };
    fetchJobDetails();
  }, [jobId]);

  // --min-max function---

  const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number(e.target.value);
    const max = Number(formData.maxPay);

    // Always update the value first
    handleChange(e);

    // Then validate
    if (max && min > max) {
      setError("Minimum pay should not be greater than maximum pay");
    } else {
      setError("");
    }
  };

  const onMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value);
    const min = Number(formData.minPay);

    // Always update the value first
    handleChange(e);

    // Then validate
    if (min && max < min) {
      setError("Maximum pay should not be less than minimum pay");
    } else {
      setError("");
    }
  };


  // Handle all field changes including certification logic
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox" && name === "certifications") {
      const checked = e.target.checked;
      setFormData((prev) => {
        let newCerts: string[] = [];

        if (value === "None") {
          // If "None" is checked, remove all others and only keep "None"
          newCerts = checked ? ["None"] : [];
        } else {
          // If any other cert is checked, remove "None" if present
          if (checked) {
            newCerts = [...prev.certifications.filter((c) => c !== "None"), value];
          } else {
            newCerts = prev.certifications.filter((c) => c !== value);
          }
        }

        return { ...prev, certifications: newCerts };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (error) {
      alert(error);
      return;
    }
    if (step === 1) {
      if (!formData.title || !formData.location || !formData.type || !formData.minPay || !formData.maxPay) {
        alert("Please fill all required fields in Job Details before continuing.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.roleCategory || !formData.experienceMin) {
        alert("Please fill Candidate Preferences before continuing.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized. Please login.");
        return;
      }

      const isEdit = !!jobId;
      const endpoint = isEdit ? JOB_EDIT_ENDPOINT : JOB_POST_ENDPOINT;
      const payload = isEdit
        ? { ...formData, id: parseInt(jobId!) }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save job");

      alert(isEdit ? "Job updated successfully!" : "Job posted successfully!");
      router.push("/EmployerDashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving job");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-10 gap-5">
      {/* Stepper */}
      <div className="w-1/4 p-6 h-fit">
        <h2 className="font-semibold text-lg mb-6">{jobId ? "Edit Job" : "Post a Job"}</h2>
        <div className="flex flex-col gap-0 relative">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border-2 ${step >= 1 ? "bg-blue-600 border-blue-600" : "border-gray-300"}`} />
            <span className={`${step >= 1 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Job Details</span>
          </div>
          <div className={`h-6 ml-[7px] border-l-2 ${step >= 2 ? "border-blue-600" : "border-gray-300"}`} />
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border-2 ${step >= 2 ? "bg-blue-600 border-blue-600" : "border-gray-300"}`} />
            <span className={`${step >= 2 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Candidate Preferences</span>
          </div>
          <div className={`h-6 ml-[7px] border-l-2 ${step >= 3 ? "border-blue-600" : "border-gray-300"}`} />
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border-2 ${step >= 3 ? "bg-blue-600 border-blue-600" : "border-gray-300"}`} />
            <span className={`${step >= 3 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>Job Description</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-[570px] h-[550px] h-fit max-w-4xl overflow-y-auto">
        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                placeholder="Registered Nurse - Age Care"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Location</label>
              <input
                type="text"
                name="location"
                placeholder="Melbourne, VIC"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Company Name </label>
              <input
                type="text"
                name="locality"
                placeholder="Sunrise Aged Care Facility"
                value={formData.locality}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="" disabled>
                  -- Select Job Type --
                </option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div className="mb-4 flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Hourly pay rate (Min)</label>
                <input
                  type="number"
                  name="minPay"
                  placeholder="35 AUD/hour Min"
                  value={formData.minPay}
                  onChange={onMinChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Hourly pay rate (Max)</label>
                <input
                  type="number"
                  name="maxPay"
                  placeholder="40 AUD/hour Max"
                  value={formData.maxPay}
                  onChange={onMaxChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          </>
        )}

        {step === 2 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Candidate Preferences</label>

            <div className="mb-4">
              <label className="block text-sm mb-1">Role Category</label>

              {formData.roleCategory === "Other" || isTypingOther ? (
                <input
                  type="text"
                  name="roleCategory"
                  placeholder="Please specify your role"
                  value={formData.roleCategory === "Other" ? "" : formData.roleCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.trim() === "") {
                      setFormData(prev => ({ ...prev, roleCategory: "" }));
                      setIsTypingOther(false);
                    } else {
                      setFormData(prev => ({ ...prev, roleCategory: val }));
                      setIsTypingOther(true);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) {
                      setFormData(prev => ({ ...prev, roleCategory: "" }));
                      setIsTypingOther(false);
                    }
                  }}
                  className="w-full border rounded p-2"
                  autoFocus
                />
              ) : (
                <select
                  name="roleCategory"
                  value={formData.roleCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Other") {
                      setFormData(prev => ({ ...prev, roleCategory: "" }));
                      setIsTypingOther(true);
                    } else {
                      setFormData(prev => ({ ...prev, roleCategory: val }));
                      setIsTypingOther(false);
                    }
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select Role Category --</option>
                  <option value="Registered Nurse (RN)">Registered Nurse (RN)</option>
                  <option value="Enrolled Nurse (EN)">Enrolled Nurse (EN)</option>
                  <option value="Assistant in Nursing (AIN)">Assistant in Nursing (AIN)</option>
                  <option value="Support Worker">Support Worker</option>
                  <option value="Clinical / Manager">Clinical / Manager</option>
                  <option value="Other">Other</option>
                </select>
              )}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm mb-1">Minimum Experience Required</label>
              <select
                name="experienceMin"
                value={formData.experienceMin}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select experience</option>
                <option value="No experience">No experience</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–2 years">1–2 years</option>
                <option value="2–5 years">2–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2"> Preferred Certification</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "AHPRA Registration",
                  "Police Check Certificate",
                  "First Aid / CPR",
                  "Manual Handling Certificate",
                  "NDIS Worker Screening",
                  "Immunisation Card",
                  "Photo ID",
                  "Vaccination / Immunisation",
                  "None",
                ].map((cert) => (
                  <label key={cert} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="certifications"
                      value={cert}
                      checked={formData.certifications.includes(cert)}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Language Requirements (Optional)</label>
              <input
                type="text"
                name="languageRequirements"
                placeholder="English, Nepali ,Hindi"
                value={formData.languageRequirements || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <textarea
                name="description"
                placeholder="We are seeking compassionate and experienced RNs to join our aged care facility in Sydney. You’ll work with a supportive team and flexible rosters"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-[150px] border rounded p-2 text-justify"
              />
            </div> */}

            <div className="mt-4  pt-4">
              <h2 className="text-lg font-semibold mb-2">Job Description</h2>


              <RichTextEditor
                value={formData.description}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>

          </>
        )}

        <div className="flex justify-end gap-4 mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-white text-[#0078DB] border border-[#0078DB] rounded hover:bg-[#0078DB] hover:text-white transition"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 rounded text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {jobId ? "Update Job" : "Post Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobPosting() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobPostingContent />
    </Suspense>
  );
}
