"use client";

import React from "react";

interface JobFiltersProps {
    typeFilter: string[];
    setTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
    roleCategories: string[];
    setRoleCategories: React.Dispatch<React.SetStateAction<string[]>>;
    experience: string[];
    setExperience: React.Dispatch<React.SetStateAction<string[]>>;
    payRate: number;
    setPayRate: React.Dispatch<React.SetStateAction<number>>;
    clearFilters: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCheckboxChange: (value: string, setter: any) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
    typeFilter,
    setTypeFilter,
    roleCategories,
    setRoleCategories,
    experience,
    setExperience,
    payRate,
    setPayRate,
    clearFilters,
    handleCheckboxChange,
}) => {
    return (
        <div className="hidden md:block w-[320px] bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-[60px] h-fit overflow-y-auto scrollbar-hide">
            <h2 className="font-semibold text-gray-800 flex justify-between">
                All Filters
                <button onClick={clearFilters} className="text-sm text-blue-400">
                    Clear All
                </button>
            </h2>
            <div className="h-0.5 bg-gray-300" />

            {/* Job Type */}
            <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Job Type</h3>
                {["Full-time", "Part-time", "Contract", "Casual", "Open to any"].map(
                    (t) => (
                        <div key={t} className="flex items-center gap-2 text-sm mb-1">
                            <input
                                type="checkbox"
                                checked={typeFilter.includes(t)}
                                onChange={() => handleCheckboxChange(t, setTypeFilter)}
                                className="rounded"
                            />
                            <label>{t}</label>
                        </div>
                    )
                )}
            </div>

            <div className="h-0.5 bg-gray-300" />

            {/* Role Category */}
            <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Role Category</h3>
                {[
                    "Clinical Lead / Manager",
                    "Registered Nurse (RN)",
                    "Enrolled Nurse (EN)",
                    "Assistant in Nursing (AIN)",
                    "Others",
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

            <div className="h-0.5 bg-gray-300" />

            {/* Experience */}
            <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Experience</h3>
                {[
                    "Fresher",
                    "Less than 1 year",
                    "1 – 2 years",
                    "2 - 5 years",
                    "Above 5 years",
                ].map((exp) => (
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


            <div className="h-0.5 bg-gray-300" />

            {/* Pay Rate */}
            <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Pay Rate</h3>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={isNaN(payRate) ? 0 : payRate}
                    onChange={(e) => setPayRate(Number(e.target.value) || 0)}
                    className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Any</span>
                    <span>${payRate}+</span>
                </div>
            </div>
        </div>
    );
};
