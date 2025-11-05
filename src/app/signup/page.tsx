"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
import Footer from "../../../components/footer-section";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function NurseSignup() {
    const router = useRouter();
    const totalSteps = 10;
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        visibilityStatus: "visibleToAll",
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

    // Full name validation function
    const validateFullName = (name: string) => {
        const trimmedName = name.trim();
        if (trimmedName.length < 2) return false;

        // Check if it contains at least one space (first name + last name)
        const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
        if (nameParts.length < 2) return false;

        // Check if it only contains letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        return nameRegex.test(trimmedName);
    };

    // Email validation function
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation function
    const validatePhone = (phone: string) => {
        return phone.length === 8 && /^\d+$/.test(phone);
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
                    (formData.workingInHealthcare === "No (Fresher)" ||
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
                    // Full Name validation
                    formData.fullName &&
                    validateFullName(formData.fullName) &&
                    // Email validation
                    formData.email &&
                    validateEmail(formData.email) &&
                    // Phone validation
                    formData.phone &&
                    validatePhone(formData.phone) &&
                    // Password validation
                    formData.password &&
                    formData.password === formData.confirmPassword &&
                    // Terms and location
                    formData.termsAccepted &&
                    formData.currentResidentialLocation &&
                    formData.postcode &&
                    formData.postcode.length === 4
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getErrorMessage = (error: any, statusCode: number) => {
        // Handle different types of errors
        if (error?.message) {
            // Check for specific error messages
            if (error.message.includes("Email already exists")) {
                return "This email is already registered. Please use a different email or try logging in.";
            }
            if (error.message.includes("Phone number already exists")) {
                return "This phone number is already registered. Please use a different phone number.";
            }
            if (error.message.includes("validation")) {
                return `Validation Error: ${error.message}`;
            }
            if (error.message.includes("required")) {
                return `Required Field Missing: ${error.message}`;
            }
            return error.message;
        }

        // Handle different status codes
        switch (statusCode) {
            case 400:
                return "Bad Request: Please check your form data and try again.";
            case 401:
                return "Unauthorized: Please check your credentials.";
            case 403:
                return "Forbidden: You don't have permission to perform this action.";
            case 409:
                return "Conflict: This email or phone number may already be registered.";
            case 422:
                return "Validation Error: Please check all required fields are filled correctly.";
            case 500:
                return "Server Error: Something went wrong on our end. Please try again later.";
            case 503:
                return "Service Unavailable: The server is temporarily unavailable. Please try again later.";
            default:
                return `Error ${statusCode}: An unexpected error occurred. Please try again.`;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Validate all steps before submit
            for (let step = 1; step <= totalSteps; step++) {
                if (!isStepComplete(step)) {
                    const stepElement = document.getElementById(`step-${step}`);
                    if (stepElement) {
                        stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    alert(`Please complete all required fields in step ${step}.`);
                    setIsSubmitting(false);
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

            console.log('Submitting form data...', Object.fromEntries(form.entries()));

            const response = await fetch(
                process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT ||
                "https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_onboarding",
                {
                    method: "POST",
                    body: form,
                    headers: {
                        // Don't set Content-Type when sending FormData, let the browser set it
                    }
                }
            );

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            let responseData;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                // Handle non-JSON responses
                const textResponse = await response.text();
                console.log('Non-JSON response:', textResponse);
                responseData = { message: textResponse };
            }

            console.log('Response data:', responseData);

            if (response.ok) {
                console.log('Signup successful!');
                // Save token and profile, then redirect
                if (typeof window !== "undefined") {
                    if (responseData.authToken) {
                        localStorage.setItem("authToken", responseData.authToken);
                    }
                    if (responseData.user) {
                        localStorage.setItem("userProfile", JSON.stringify(responseData.user));
                    }

                    // Show congratulations message
                    alert("🎉 Congratulations! Your account has been created successfully!");

                    // Small delay to let user read the message before redirect
                    setTimeout(() => {
                        router.push("/signin");
                    }, 1000);
                }
            } else {
                // Handle error responses
                const errorMessage = getErrorMessage(responseData, response.status);
                console.error('Signup failed:', errorMessage);
                alert(`Registration failed: ${errorMessage}`);
            }

        } catch (err) {
            console.error('Network/Fetch error:', err);
            let errorMessage = "Network error. Please check your connection and try again.";

            if (err instanceof TypeError && err.message.includes("fetch")) {
                errorMessage = "Unable to connect to the server. Please check your internet connection.";
            } else if (err instanceof Error) {
                errorMessage = `Network Error: ${err.message}`;
            }

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <Navbar />
            </div>

            {/* Mobile Login Link - Only visible on mobile */}
            <div className="block lg:hidden px-4 py-3 text-center text-sm text-gray-600">
                Already have an account?
                <button onClick={() => router.push("/signin")} className="text-[#4A90E2] font-medium ml-1">
                    Login
                </button>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-start justify-center gap-10 py-6 lg:py-10">
                {/* Left Side - Static Card - Hidden on mobile */}

                <div className="flex flex-col items-center sticky top-24">
                    {/* Main Box */}
                    <div className="hidden lg:flex w-[435px] rounded-lg shadow-md flex-col justify-center items-center text-center text-gray-800 bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)] p-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            On registering, you can
                        </h2>

                        <ul className="text-[#474D6A] font-[14px] text-sm flex flex-col items-start justify-center gap-5">
                            {[
                                "Build your profile and let recruiters find you.",
                                "Get job posting delivered right to your email.",
                                "Find a job and grow your career with Vfind.",
                            ].map((text, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 text-[14px] leading-[18px] text-[#474D6A]"
                                >
                                    <span className="flex items-center justify-center w-[20px] h-[20px]">
                                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    </span>
                                    <span className="flex-1 text-left">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Login Below the Box */}
                    <div className="hidden lg:block text-center mt-6 text-sm text-gray-600">
                        Already have an account?
                        <button
                            onClick={() => router.push("/signin")}
                            className="text-[#4A90E2] font-medium ml-1"
                        >
                            Login
                        </button>
                    </div>
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
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                        }`}
                                />
                            );
                        })}
                    </div>

                    <div
                        className="w-full rounded-lg shadow-md flex flex-col bg-white max-h-[calc(100vh-200px)] overflow-y-auto"
                        ref={formRef}
                    >
                        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-grow">
                            {[...Array(currentStep)].map((_, i) => {
                                const stepNumber = i + 1;
                                return (
                                    <div key={stepNumber} id={`step-${stepNumber}`} className="p-2 lg:p-4  rounded bg-white">
                                        {renderStep(stepNumber)}
                                    </div>
                                );
                            })}

                            {/* Navigation Buttons */}
                            <div className="flex justify-end pt-4 pb-2 lg:pt-6 lg:pb-4 border-t border-gray-200 sticky bottom-0 bg-white">
                                {currentStep < totalSteps && (
                                    <button
                                        onClick={() => {
                                            setCurrentStep((prev) => prev + 1);
                                            // Scroll within the form container only
                                            setTimeout(() => {
                                                const nextStep = currentStep + 1;
                                                const nextStepElement = document.getElementById(`step-${nextStep}`);
                                                if (nextStepElement && formRef.current) {
                                                    // Calculate the position relative to the form container
                                                    const containerTop = formRef.current.offsetTop;
                                                    const elementTop = nextStepElement.offsetTop;
                                                    const scrollPosition = elementTop - containerTop;

                                                    // Scroll within the form container
                                                    formRef.current.scrollTo({
                                                        top: scrollPosition,
                                                        behavior: "smooth"
                                                    });
                                                }
                                            }, 100);
                                        }}
                                        disabled={!isStepComplete(currentStep)}
                                        className={`group px-4 lg:px-4 py-2 lg:py-2 rounded text-white text-sm lg:text-base transition-all duration-300 flex items-center justify-center overflow-hidden ${isStepComplete(currentStep)
                                                ? "bg-[#61A6FA]"
                                                : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="transition-all duration-300 group-hover:-translate-x-1">
                                                Next
                                            </span>
                                            {isStepComplete(currentStep) && (
                                                <ArrowRight
                                                    className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </span>
                                    </button>
                                )}
                                {currentStep === totalSteps && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!isStepComplete(currentStep) || isSubmitting}
                                        className={`px-4 lg:px-4 py-2 lg:py-2 rounded text-white text-sm lg:text-base ${isStepComplete(currentStep) && !isSubmitting
                                            ? "bg-blue-400 hover:bg-blue-500"
                                            : "bg-gray-400 cursor-not-allowed"
                                            } transition-colors`}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}