import { useState } from "react";
import { StepProps } from "../types/FormTypes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Check } from "lucide-react";


export function StartTimeStep({ formData, handleChange }: StepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        handleChange("startDate", date ? date.toISOString() : "");
    };

    const options = [
        "Immediately",
        "Within a week",
        "I have a specific date in mind",
    ];

    return (
        <>
            <h2 className="font-[16px] font-semibold text-[#121224]">
                What is your ideal time to start a new role?
            </h2>

            <div className="flex flex-col gap-3 mt-5">
                {options.map((opt) => {
                    const isSelected = formData.startTime === opt;
                    return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <div
                                className={`w-5 h-5 flex items-center justify-center border-2 ${
                                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                                }`}
                                onClick={() => handleChange("startTime", opt)}
                            >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-[14px] font-light">{opt}</span>
                        </label>
                    );
                })}
            </div>

            {formData.startTime === "I have a specific date in mind" && (
                <div className="mt-3 relative w-fit">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateSelect}
                        dateFormat="MM/dd/yyyy"
                        className="w-fit border rounded p-2 pr-10 bg-white"
                        placeholderText="MM/DD/YYYY"
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/3 text-gray-500 pointer-events-none" />
                </div>
            )}
        </>
    );
}
