"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FormDataType } from "./types/FormTypes";
import { CertificationsStep } from "./components/CertificationsStep";
import { ContactPasswordStep } from "./components/ContactPasswordStep";
import { JobSearchStatusStep } from "./components/JobSearchStatusStep";
import { JobTypesStep } from "./components/JobTypesStep";
import { LocationPreferenceStep } from "./components/LocationPreferenceStep";
import { QualificationStep } from "./components/QualificationStep";
import { ResidencyVisaStep } from "./components/ResidencyVisaStep";
import { StartTimeStep } from "./components/StartTimeStep";
import { WorkingInHealthcareStep } from "./components/WorkingInHealthcareStep";
import { ShiftPreferenceStep } from "./components/ShiftPreferanceStep";
import Navbar from "../../../components/navbar";

export default function NurseSignup() {
    const router = useRouter();
    const totalSteps = 10;
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormDataType>({
        jobTypes: "",
        openToOtherTypes: "",
        startTime: "",
        startDate: "",
        jobSearchStatus: "",
        qualification: "",
        shiftPreferences: [],
        otherQualification: "",
        workingInHealthcare: "",
        experience: "",
        organisation: "",
        locationPreference: "",
        preferredLocations: [],
        certifications: [],
        residencyStatus: "",
        visaType: "",
        visaDuration: "",
        workHoursRestricted: "",
        maxWorkHours: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        postcode: "",
        currentResidentialLocation: "",
        termsAccepted: false,
        photoIdFile: null,
    });

    const formRef = useRef<HTMLDivElement>(null);

    const handleChange = <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = <K extends keyof FormDataType>(field: K, value: string) => {
        setFormData((prev) => {
            const values = prev[field] as unknown as string[];
            return {
                ...prev,
                [field]: values.includes(value)
                    ? values.filter((v) => v !== value)
                    : [...values, value],
            };
        });
    };

    const isStepComplete = (stepNumber: number) => {
        switch (stepNumber) {
            case 1:
                return (
                    formData.jobTypes.includes("Open to any") ||
                    (formData.jobTypes.length >= 1 &&
                        (formData.openToOtherTypes || formData.jobTypes.includes("Open to any")))
                );
            case 2:
                return formData.shiftPreferences && formData.shiftPreferences.length > 0;
            case 3:
                return (
                    formData.startTime &&
                    (formData.startTime !== "I have a specific date in mind" || formData.startDate)
                );
            case 4:
                return formData.jobSearchStatus !== "";
            case 5:
                return (
                    formData.qualification &&
                    (formData.qualification !== "Other" || formData.otherQualification)
                );
            case 6:
                return (
                    formData.workingInHealthcare &&
                    (formData.workingInHealthcare === "No" ||
                        (formData.experience && formData.organisation))
                );
            case 7:
                return (
                    formData.locationPreference &&
                    (formData.locationPreference === "No preference, I can work anywhere" ||
                        formData.preferredLocations.length > 0)
                );
            case 8:
                return formData.certifications.length > 0;
            case 9:
                return (
                    formData.residencyStatus &&
                    (formData.residencyStatus !== "Other" || formData.visaType) &&
                    formData.workHoursRestricted &&
                    (formData.workHoursRestricted === "No, I can work full-time" || formData.maxWorkHours)
                );
            case 10:
                return (
                    formData.email &&
                    formData.phone &&
                    formData.password &&
                    formData.password === formData.confirmPassword &&
                    formData.termsAccepted &&
                    formData.currentResidentialLocation
                );
            default:
                return false;
        }
    };

    const renderStep = (stepNumber: number) => {
        const stepProps = { formData, handleChange, handleCheckboxChange };
        switch (stepNumber) {
            case 1:
                return <JobTypesStep {...stepProps} />;
            case 2:
                return <ShiftPreferenceStep {...stepProps} />;
            case 3:
                return <StartTimeStep {...stepProps} />;
            case 4:
                return <JobSearchStatusStep {...stepProps} />;
            case 5:
                return <QualificationStep {...stepProps} />;
            case 6:
                return <WorkingInHealthcareStep {...stepProps} />;
            case 7:
                return <LocationPreferenceStep {...stepProps} />;
            case 8:
                return <CertificationsStep {...stepProps} />;
            case 9:
                return <ResidencyVisaStep {...stepProps} />;
            case 10:
                return <ContactPasswordStep formData={formData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    const handleSubmit = async () => {
        // Validate all steps before submit
        for (let step = 1; step <= totalSteps; step++) {
            if (!isStepComplete(step)) {
                const stepElement = document.getElementById(`step-${step}`);
                if (stepElement) {
                    stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                alert("Please complete all required fields in this step.");
                return;
            }
        }

        const form = new FormData();
        for (const key in formData) {
            const value = formData[key as keyof FormDataType];
            if (Array.isArray(value)) {
                form.append(key, JSON.stringify(value));
            } else if (value instanceof File) {
                form.append(key, value);
            } else {
                form.append(key, value as string);
            }
        }

        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT ||
                "https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_onboarding",
                { method: "POST", body: form }
            );

            const data = await res.json();

            if (res.ok) {
                // Save token and profile, then redirect
                if (typeof window !== "undefined") {
                    localStorage.setItem("authToken", data.authToken);
                    localStorage.setItem("userProfile", JSON.stringify(data.user));
                    router.push("/signin");
                }
            } else {
                // Check specifically for email 
                if (data.message?.includes("Email already exists")) {
                    alert("Email is already registered. Please use a different email or login.");

                } else {
                    alert("Error submitting form. Please try again.");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Mobile Login Link - Only visible on mobile */}
            <div className="block lg:hidden px-4 py-2 text-center text-sm text-gray-600">
                Already have an account?
                <button onClick={() => router.push("/signin")} className="text-[#4A90E2] font-medium ml-1">
                    Login
                </button>
            </div>

            <div className="container mx-auto px-4 lg:px-0 flex items-center justify-center gap-10 min-h-[calc(100vh-80px)] py-4 lg:py-0">
                {/* Left Side - Static Card - Hidden on mobile */}
                <div className="hidden lg:flex w-[300px] h-[374px] bg-white rounded-lg shadow-md flex-col items-center text-center text-gray-800  -gray-200 -mt-40">
                    <div className="mt-10">
                        <Image src="/assets/nurse.png" alt="Profile" className="w-28 h-28 object-cover rounded-full -2 -blue-400 mx-auto" width={112} height={112} />
                    </div>
                    <h2 className="text-lg font-bold mt-5 text-[14px]">On registering, you can</h2>
                    <ul className=" text-[#474D6A] font-medium text-sm flex items-center justify-center flex-col ">
                        <li className="flex w-[92%] items-center gap-3 mt-5 text-[14px] leading-[18px] text-[#474D6A]">
                            <span className="flex mb-[15px] w-[14px] h-[14px] rounded-full ">
                                <Image src="/icons/check.png" alt="Check Icon" width={14} height={14} />
                            </span>
                            <span className="flex-1 text-justify">Build your profile and let recruiters find you</span>
                        </li>
                        <li className="flex w-[92%] items-center gap-3 mt-3 text-[14px] leading-[18px] text-[#474D6A]">
                            <span className="flex mb-[15px] w-[14px] h-[14px] rounded-full "> <Image src="/icons/check.png" alt="Check Icon" width={14} height={14} /> </span>
                            <span className="flex-1 text-justify">Get job posting delivered right to your email</span>
                        </li>
                        <li className="flex w-[92%] items-center gap-3 mt-3 text-[14px] leading-[18px] text-[#474D6A]">
                            <span className="flex mb-[15px] w-[14px] h-[14px] rounded-full "> <Image src="/icons/check.png" alt="Check Icon" width={14} height={14} /> </span>
                            <span className="flex-1 text-justify">Find a job and grow your career with Vfind</span> 
                        </li>
                        <div className="block text-center mt-10 text-sm text-gray-600"> 
                            Already have an account?
                            <button onClick={() => router.push("/signin")} className="text-[#4A90E2] font-medium ml-1"> Login </button>
                        </div>
                    </ul>
                </div>

                {/* Right Side - Form - Responsive */}
                <div className="w-full max-w-[779px]">
                    {/* Step Progress Bar */}
                    <div className="flex justify-between p-2 lg:p-4">
                        {[...Array(totalSteps)].map((_, index) => {
                            const stepNumber = index + 1;
                            return (
                                <div
                                    key={stepNumber}
                                    className={`flex-1 h-1.5 lg:h-2 mx-0.5 lg:mx-1 rounded-full ${currentStep > stepNumber
                                        ? "bg-green-600"
                                        : currentStep === stepNumber
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                        }`}
                                />
                            );
                        })}
                    </div>

                    <div
                        className="w-full min-h-[400px] lg:min-h-[576px] max-h-[calc(100vh-200px)] lg:max-h-[80vh] rounded-lg shadow-md flex flex-col overflow-y-auto bg-white"
                        ref={formRef}
                    >
                        <div className="p-3 lg:p-6 mt-1 lg:mt-3 space-y-4 lg:space-y-8 flex-grow">
                            {[...Array(currentStep)].map((_, i) => {
                                const stepNumber = i + 1;
                                return (
                                    <div key={stepNumber} id={`step-${stepNumber}`} className="p-2 lg:p-4  rounded bg-white">
                                        {renderStep(stepNumber)}
                                    </div>
                                );
                            })}

                            {/* Navigation Buttons */}
                            <div className="flex justify-end p-3 lg:p-6 -t -gray-200 sticky bottom-0 bg-white">
                                {currentStep < totalSteps && (
                                    <button
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                        disabled={!isStepComplete(currentStep)}
                                        className={`px-4 lg:px-4 py-2 lg:py-2 rounded text-white text-sm lg:text-base ${isStepComplete(currentStep)
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                            } transition-colors`}
                                    >
                                        Next
                                    </button>
                                )}
                                {currentStep === totalSteps && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!isStepComplete(currentStep)}
                                        className={`px-4 lg:px-4 py-2 lg:py-2 rounded text-white text-sm lg:text-base ${isStepComplete(currentStep)
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                            } transition-colors`}
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}