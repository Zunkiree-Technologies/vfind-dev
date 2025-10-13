import { StepProps } from "../types/FormTypes";
import { Check } from "lucide-react";

export function JobSearchStatusStep({ formData, handleChange }: StepProps) {
    const options = [
        "Just starting",
        "Actively applying",
        "In interview process",
        "Not actively looking right now",
    ];

    return (
        <>
            <h2 className="font-[16px] font-semibold text-[#121224]">
                How far along are you in your job search?
            </h2>
            <div className="flex flex-col gap-3 mt-5 w-fit">
                {options.map((opt) => {
                    const isSelected = formData.jobSearchStatus === opt;
                    return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <div
                                className={`w-5 h-5 flex items-center justify-center border-2 ${
                                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                                }`}
                                onClick={() => handleChange("jobSearchStatus", opt)}
                            >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-[14px] font-light">{opt}</span>
                        </label>
                    );
                })}
            </div>
        </>
    );
}
