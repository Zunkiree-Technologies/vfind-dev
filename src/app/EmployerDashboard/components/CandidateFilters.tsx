"use client";
import React from "react";

interface CandidateFiltersProps {
  jobTypes: string[];
  setJobTypes: React.Dispatch<React.SetStateAction<string[]>>;
  shifts: string[];
  setShifts: React.Dispatch<React.SetStateAction<string[]>>;
  roleCategories: string[];
  setRoleCategories: React.Dispatch<React.SetStateAction<string[]>>;
  experience: string[];
  setExperience: React.Dispatch<React.SetStateAction<string[]>>;
  visaStatus: string[];
  setVisaStatus: React.Dispatch<React.SetStateAction<string[]>>;
  payRate: number;
  setPayRate: React.Dispatch<React.SetStateAction<number>>;
  clearFilters: () => void;
}

// Experience ranges
const experienceRanges: Record<string, [number, number]> = {
  "Fresher": [0, 0.5],
  "Less than 1 year": [0, 1],
  "1 – 2 years": [1, 3],
  "2 - 5 years": [3, 5],
  "Above 5 years": [5, Infinity],
};

export default function CandidateFilters({
  jobTypes,
  setJobTypes,
  shifts,
  setShifts,
  roleCategories,
  setRoleCategories,
  experience,
  setExperience,
  visaStatus,
  setVisaStatus,
  payRate,
  setPayRate,
  clearFilters,
}: CandidateFiltersProps) {

  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-[320px] bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-18 h-[calc(100vh-3rem)] overflow-y-auto">
      <h2 className="font-semibold text-gray-800 flex justify-between">
        All Filters
        <button onClick={clearFilters} className="text-sm text-blue-400">
          Clear All
        </button>
      </h2>
      <div className="w-py h-0.5 bg-gray-300" />

      {/* Job Type */}
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Job Type</h3>
        {["Full-time", "Part-time", "Casual", " Temporary Contract", "Open to any"].map((type) => (
          <div key={type} className="flex items-center gap-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={jobTypes.includes(type)}
              onChange={() => handleCheckboxChange(type, setJobTypes)}
              className="rounded"
            />
            <label>{type}</label>
          </div>
        ))}
      </div>

      {/* Shift */}
      <div className="w-py h-0.5 bg-gray-300" />
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Shift</h3>
        {["Morning", "Afternoon", "Night"].map((shift) => (
          <div key={shift} className="flex items-center gap-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={shifts.includes(shift)}
              onChange={() => handleCheckboxChange(shift, setShifts)}
              className="rounded"
            />
            <label>{shift}</label>
          </div>
        ))}
      </div>

      {/* Role Category */}
      <div className="w-py h-0.5 bg-gray-300" />
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Role Category</h3>
        {[
          "AIN (Assistant in Nursing)",
          "EN (Enrolled Nurse)",
          "RN (Registered Nurse)",
          "SW (Support Worker)",
          "Clinical Lead / Manager",
          "Other",
        ].map((role) => (
          <div key={role} className="flex items-center gap-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={roleCategories.includes(role)}
              onChange={() => handleCheckboxChange(role, setRoleCategories)}
              className="rounded"
            />
            <label>{role}</label>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="w-py h-0.5 bg-gray-300" />
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Experience</h3>
        {Object.keys(experienceRanges).map((exp) => (
          <div key={exp} className="flex items-center gap-2 text-sm mb-1">
            <input
              type="checkbox"
              checked={experience.includes(exp)}
              onChange={() => handleCheckboxChange(exp, setExperience)}
              className="rounded"
            />
            <label>{exp}</label>
          </div>
        ))}
      </div>

      {/* Visa Status */}
      <div className="w-py h-0.5 bg-gray-300" />
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Visa Status</h3>
        {["Australian Citizen / Permanent Resident",
          "Temporary Resident",
          "Student Visa ",
          "Student Dependent Visa ",
          "Working Holiday Visa ",
          "Other"].map((status) => (
            <div key={status} className="flex items-center gap-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={visaStatus.includes(status)}
                onChange={() => handleCheckboxChange(status, setVisaStatus)}
                className="rounded"
              />
              <label>{status}</label>
            </div>
          ))}
      </div>

      {/* Pay Rate Slider */}
      <div className="w-py h-0.5 bg-gray-300" />
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-2">Pay Rate</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={payRate}
          onChange={(e) => setPayRate(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600">${payRate}+/hr</div>
      </div>
    </div>
  );
}
