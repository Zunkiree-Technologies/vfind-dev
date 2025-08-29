import { StepProps } from "../types/FormTypes";
import { Check } from "lucide-react";


export function JobTypesStep({ formData, handleChange }: StepProps) {
    const jobOptions = ["Full-time", "Part-time", "Casual", "Open to any"];

    return (
        <>
            <h2 className="font-[16px] font-semibold text-[#121224]">
                What type of job are you currently looking for?
            </h2>

            <div className="flex flex-col mt-5 gap-5 w-fit">
                {jobOptions.map((type) => {
                    const isSelected = formData.jobTypes === type;
                    return (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <div
                                className={`w-5 h-5 flex items-center justify-center border-2 ${
                                    isSelected ? "border-blue-700 bg-blue-700" : "border-gray-400"
                                }`}
                                onClick={() => handleChange("jobTypes", type)}
                            >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-[14px] font-medium">{type}</span>
                        </label>
                    );
                })}
            </div>

            {formData.jobTypes && formData.jobTypes !== "Open to any" && (
                <div className="mt-6  pt-4">
                    <h3 className="text-md font-semibold mb-2">
                        Would you be open to other job types if the opportunity fits your needs?
                    </h3>
                    <div className="flex flex-col mt-5 gap-5">
                        {["Yes", "No"].map((opt) => {
                            const isSelected = formData.openToOtherTypes === opt;
                            return (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        className={`w-5 h-5 flex items-center justify-center border-2 ${
                                            isSelected ? "border-blue-700 bg-blue-700" : "border-gray-400"
                                        }`}
                                        onClick={() => handleChange("openToOtherTypes", opt)}
                                    >
                                        {isSelected && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <span className="text-[14px] font-medium">{opt}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
