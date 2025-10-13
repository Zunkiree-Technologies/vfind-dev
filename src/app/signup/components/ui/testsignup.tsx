/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

// Types
interface FormDataType {
  // Step 1: Personal & Contact Information
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  password: string;
  confirmPassword: string;
  currentResidentialLocation: string;
  
  // Step 2: Job Preferences & Availability
  locationPreference: string;
  preferredLocations: string[];
  startTime: string;
  startDate: string;
  shiftPreferences: string[];
  jobTypes: string;
  openToOtherTypes: string;
  
  // Step 3: Qualifications & Work Eligibility
  jobSearchStatus: string;
  residencyStatus: string;
  visaType: string;
  visaDuration: string;
  workHoursRestricted: string;
  maxWorkHours: string;
  qualification: string;
  otherQualification: string;
  certifications: string[];
  
  // Additional fields
  workingInHealthcare: string;
  experience: string;
  organisation: string;
  termsAccepted: boolean;
  photoIdFile: File | null;
}

// Step Components
const Step1PersonalContact = ({ formData, handleChange }: any) => {
  const validateFullName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) return false;
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(trimmedName);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 8 && /^\d+$/.test(phone);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Personal & Contact Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.fullName && !validateFullName(formData.fullName) && (
            <p className="text-xs text-red-500 mt-1">Please enter full name (first and last)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.email && !validateEmail(formData.email) && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid email</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            placeholder="Enter your phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            maxLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.phone && !validatePhone(formData.phone) && (
            <p className="text-xs text-red-500 mt-1">Phone must be 8 digits</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
          <input
            type="text"
            placeholder="Enter your postal code"
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
            maxLength={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Residential Location</label>
        <input
          type="text"
          placeholder="Enter your current location"
          value={formData.currentResidentialLocation}
          onChange={(e) => handleChange("currentResidentialLocation", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

const Step2JobPreferences = ({ formData, handleChange, handleCheckboxChange }: any) => {
  const locations = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"];
  const jobTypesList = ["Full Time", "Part Time", "Casual", "Open to any"];
  const shifts = ["Morning", "Afternoon", "Night", "Select All"];

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Job Preferences & Availability</h2>

      {/* Location Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select your preferred work location</label>
        <select
          value={formData.locationPreference}
          onChange={(e) => handleChange("locationPreference", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select state or city</option>
          <option value="No preference, I can work anywhere">No preference, I can work anywhere</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {formData.locationPreference && formData.locationPreference !== "No preference, I can work anywhere" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
          <div className="space-y-2">
            {locations.map(location => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.preferredLocations.includes(location)}
                  onChange={() => handleCheckboxChange("preferredLocations", location)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{location}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What is your ideal time to start a new role?</label>
        <div className="space-y-2">
          {["Immediately", "With in a few weeks", "I have a specific date in mind"].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={formData.startTime === option}
                onChange={() => handleChange("startTime", option)}
                className="border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
        {formData.startTime === "I have a specific date in mind" && (
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Shift Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Which shifts are you open to working?</label>
        <div className="space-y-2">
          {shifts.map(shift => (
            <label key={shift} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={shift === "Select All" 
                  ? shifts.slice(0, -1).every(s => formData.shiftPreferences.includes(s))
                  : formData.shiftPreferences.includes(shift)}
                onChange={() => {
                  if (shift === "Select All") {
                    const allSelected = shifts.slice(0, -1).every(s => formData.shiftPreferences.includes(s));
                    if (allSelected) {
                      handleChange("shiftPreferences", []);
                    } else {
                      handleChange("shiftPreferences", shifts.slice(0, -1));
                    }
                  } else {
                    handleCheckboxChange("shiftPreferences", shift);
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{shift}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What type of job are you currently looking for?</label>
        <div className="space-y-2">
          {jobTypesList.map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.jobTypes.includes(type)}
                onChange={() => handleCheckboxChange("jobTypes", type)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step3Qualifications = ({ formData, handleChange, handleCheckboxChange }: any) => {
  const qualifications = [
    "Clinical Lead / Manager",
    "Registered Nurse (RN)",
    "Enrolled Nurse (EN)",
    "Assistant in Nursing (AIN)",
    "Other"
  ];
  
  const certificationsList = [
    "CPR/First Aid",
    "Manual Handling",
    "Infection Control",
    "Medication Management"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Qualifications & Work Eligibility</h2>

      {/* Job Search Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">How far along are you in your job search?</label>
        <div className="space-y-2">
          {["Just Starting", "Actively Applying"].map(status => (
            <label key={status} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={formData.jobSearchStatus === status}
                onChange={() => handleChange("jobSearchStatus", status)}
                className="border-gray-300"
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Residency Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What is your Current Residency or Visa Status?</label>
        <div className="space-y-2">
          {["Citizen", "PR", "Student", "Temporary Resident", "Other"].map(status => (
            <label key={status} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={formData.residencyStatus === status}
                onChange={() => handleChange("residencyStatus", status)}
                className="border-gray-300"
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
        {formData.residencyStatus === "Other" && (
          <input
            type="text"
            placeholder="Please specify"
            value={formData.visaType}
            onChange={(e) => handleChange("visaType", e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Nursing Qualification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What is your current nursing qualification?</label>
        <div className="space-y-2">
          {qualifications.map(qual => (
            <label key={qual} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={formData.qualification === qual}
                onChange={() => handleChange("qualification", qual)}
                className="border-gray-300"
              />
              <span className="text-sm">{qual}</span>
            </label>
          ))}
        </div>
        {formData.qualification === "Other" && (
          <input
            type="text"
            placeholder="Please specify"
            value={formData.otherQualification}
            onChange={(e) => handleChange("otherQualification", e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Certifications (select all that apply)</label>
        <div className="space-y-2">
          {certificationsList.map(cert => (
            <label key={cert} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.certifications.includes(cert)}
                onChange={() => handleCheckboxChange("certifications", cert)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleChange("termsAccepted", e.target.checked)}
            className="mt-1 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Accept Terms & Conditions</span>
        </label>
      </div>
    </div>
  );
};

// Main Component
export default function NurseSignup() {
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    password: "",
    confirmPassword: "",
    currentResidentialLocation: "",
    locationPreference: "",
    preferredLocations: [],
    startTime: "",
    startDate: "",
    shiftPreferences: [],
    jobTypes: "",
    openToOtherTypes: "",
    jobSearchStatus: "",
    residencyStatus: "",
    visaType: "",
    visaDuration: "",
    workHoursRestricted: "",
    maxWorkHours: "",
    qualification: "",
    otherQualification: "",
    certifications: [],
    workingInHealthcare: "",
    experience: "",
    organisation: "",
    termsAccepted: false,
    photoIdFile: null,
  });

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

  const validateFullName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) return false;
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(trimmedName);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 8 && /^\d+$/.test(phone);
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.fullName &&
          validateFullName(formData.fullName) &&
          formData.email &&
          validateEmail(formData.email) &&
          formData.phone &&
          validatePhone(formData.phone) &&
          formData.password &&
          formData.password === formData.confirmPassword &&
          formData.currentResidentialLocation &&
          formData.postcode &&
          formData.postcode.length === 4
        );
      case 2:
        return (
          formData.locationPreference &&
          (formData.locationPreference === "No preference, I can work anywhere" ||
            formData.preferredLocations.length > 0) &&
          formData.startTime &&
          (formData.startTime !== "I have a specific date in mind" || formData.startDate) &&
          formData.shiftPreferences.length > 0 &&
          formData.jobTypes.length > 0
        );
      case 3:
        return (
          formData.jobSearchStatus &&
          formData.residencyStatus &&
          (formData.residencyStatus !== "Other" || formData.visaType) &&
          formData.qualification &&
          (formData.qualification !== "Other" || formData.otherQualification) &&
          formData.certifications.length > 0 &&
          formData.termsAccepted
        );
      default:
        return false;
    }
  };

  const renderStep = (stepNumber: number) => {
    const stepProps = { formData, handleChange, handleCheckboxChange };
    switch (stepNumber) {
      case 1:
        return <Step1PersonalContact {...stepProps} />;
      case 2:
        return <Step2JobPreferences {...stepProps} />;
      case 3:
        return <Step3Qualifications {...stepProps} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("🎉 Registration successful!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl flex items-start justify-center gap-8 py-8">
        {/* Left Side - Benefits Card */}
        <div className="hidden lg:flex flex-col items-center sticky top-8">
          <div className="w-[400px] rounded-lg shadow-md p-8 text-center bg-gradient-to-t from-blue-100 via-blue-50 to-white">
            <h2 className="text-lg font-bold mb-6 text-gray-800">On registering, you can</h2>
            <ul className="text-left space-y-4">
              {[
                "Build your profile and let recruiters find you.",
                "Get job posting delivered right to your email.",
                "Find a job and grow your career with Vfind.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button className="text-blue-500 font-medium hover:underline">Login</button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-3xl">
          {/* Step Progress Bar */}
          <div className="flex justify-between mb-6">
            {[...Array(totalSteps)].map((_, index) => {
              const stepNumber = index + 1;
              return (
                <div
                  key={stepNumber}
                  className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                    currentStep > stepNumber
                      ? "bg-green-500"
                      : currentStep === stepNumber
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              );
            })}
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 min-h-[500px]">
            {renderStep(currentStep)}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    isStepComplete(currentStep)
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepComplete(currentStep) || isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    isStepComplete(currentStep) && !isSubmitting
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Login Link */}
      <div className="lg:hidden text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button className="text-blue-500 font-medium">Login</button>
      </div>
    </div>
  );
}