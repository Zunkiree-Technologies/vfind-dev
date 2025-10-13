import { StepProps } from "../types/FormTypes";
import { Check } from "lucide-react";

export function ResidencyVisaStep({ formData, handleChange }: StepProps) {
  const residencyOptions = [
    "Australian Citizen / Permanent Resident",
    "Temporary Resident",
    "Student Visa Holder",
    "Student Dependent Visa Holder",
    "Working Visa Holder",
    "Other",
  ];

  const workHoursOptions = ["No, I can work full-time", "Yes"];

  return (
    <>
      <h2 className="font-[16px] font-bold text-[#121224]">
        What is your current residency or visa status in Australia?
      </h2>

      <div className="flex flex-col gap-3 mt-5 w-fit">
        {residencyOptions.map((opt) => {
          const isSelected = formData.residencyStatus === opt;
          return (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                }`}
                onClick={() => handleChange("residencyStatus", opt)}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-[14px] font-light">{opt}</span>
            </label>
          );
        })}
      </div>

      {formData.residencyStatus === "Other" && (
        <input
          type="text"
          placeholder="Please specify your visa type"
          value={formData.visaType}
          onChange={(e) => handleChange("visaType", e.target.value)}
          className="mt-3 w-full border rounded p-2"
        />
      )}

      {[
        "Temporary Resident",
        "Student Visa Holder",
        "Student Dependent Visa Holder",
        "Working Visa Holder",
        "Other",
      ].includes(formData.residencyStatus) && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How long is your visa valid? (in months or years)
          </label>
          <input
            type="text"
            placeholder="e.g., 2 years, 6 months"
            value={formData.visaDuration}
            onChange={(e) => handleChange("visaDuration", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      )}

      <h3 className="mt-4 font-medium">
        Are there any restrictions on the number of hours you can work per fortnight?
      </h3>
      <div className="flex flex-col gap-3 mt-3 w-fit">
        {workHoursOptions.map((opt) => {
          const isSelected = formData.workHoursRestricted === opt;
          return (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                }`}
                onClick={() => handleChange("workHoursRestricted", opt)}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-[14px] font-light">{opt}</span>
            </label>
          );
        })}
      </div>

      {formData.workHoursRestricted === "Yes" && (
        <input
          type="number"
          placeholder="Enter max hours per Week"
          value={formData.maxWorkHours}
          onChange={(e) => handleChange("maxWorkHours", e.target.value)}
          className="mt-3 w-full border rounded p-2"
        />
      )}
    </>
  );
}
