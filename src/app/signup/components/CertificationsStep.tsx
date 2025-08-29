import { StepProps } from "../types/FormTypes";
import { Check } from "lucide-react";

export function CertificationsStep({ formData, handleCheckboxChange, handleChange }: StepProps) {
  const allCertifications = [
    "AHPRA Registration",
    "Police Check Certificate",
    "Working with Children Check",
    "First Aid/CPR",
    "Manual Handling",
    "Vaccination / Immunisation",
    "NDIS Worker Screening",
    // "Photo ID Card",
  ];

  const allSelected = allCertifications.every(cert => formData.certifications.includes(cert));

  const toggleSelectAll = () => {
    if (allSelected) {
      handleChange("certifications", []);
    } else {
      handleChange("certifications", [...allCertifications]);
    }
  };

  return (
    <>
      <h2 className="font-[16px] font-semibold text-[#121224]">
        Do you have any of the following certifications?
      </h2>

      {/* Select All / Deselect All */}
      <button
        type="button"
        onClick={toggleSelectAll}
        className={`inline-flex w-fit px-4 py-2 mt-2  font-bold text-[14px] ${
          allSelected ? " text-[#2142B9] " : " text-[#2142B9] "
        }`}
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>

      <div className="flex flex-col gap-3 mt-3 w-fit">
        {allCertifications.map((cert) => {
          const isSelected = formData.certifications.includes(cert);
          return (
            <label key={cert} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 ${
                  isSelected ? "border-blue-700 bg-blue-700" : "border-gray-400"
                }`}
                onClick={() => handleCheckboxChange("certifications", cert)}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-[14px] font-medium">{cert}</span>
            </label>
          );
        })}
      </div>

      {/* Show file upload if "Photo ID Card" is selected */}
      {formData.certifications.includes("Photo ID Card") && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Upload your Photo ID Card</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("photoIdFile", e.target.files?.[0] || null)}
            className="w-full border rounded p-2"
          />
          {formData.photoIdFile && (
            <p className="text-green-600 text-sm mt-2">
              Selected File: {formData.photoIdFile.name}
            </p>
          )}
        </div>
      )}
    </>
  );
}
