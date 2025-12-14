"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, User, Award, Briefcase, MapPin, FileCheck } from "lucide-react";

// Import step components from signup
import { QualificationStep } from "@/app/signup/components/QualificationStep";
import { JobTypesStep } from "@/app/signup/components/JobTypesStep";
import { ShiftPreferenceStep } from "@/app/signup/components/ShiftPreferanceStep";
import { LocationPreferenceStep } from "@/app/signup/components/LocationPreferenceStep";
import { CertificationsStep } from "@/app/signup/components/CertificationsStep";
import { ResidencyVisaStep } from "@/app/signup/components/ResidencyVisaStep";
import { StartTimeStep } from "@/app/signup/components/StartTimeStep";
import { JobSearchStatusStep } from "@/app/signup/components/JobSearchStatusStep";
import { WorkingInHealthcareStep } from "@/app/signup/components/WorkingInHealthcareStep";
import { FormDataType } from "@/app/signup/types/FormTypes";

type SectionId = "basic" | "qualifications" | "preferences" | "location" | "certifications" | "visa";

interface Section {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const sections: Section[] = [
  { id: "basic", label: "Basic Info", icon: <User className="w-5 h-5" />, description: "Phone and location" },
  { id: "qualifications", label: "Qualifications", icon: <Award className="w-5 h-5" />, description: "Your nursing qualifications and experience" },
  { id: "preferences", label: "Work Preferences", icon: <Briefcase className="w-5 h-5" />, description: "Job types, shifts, and availability" },
  { id: "location", label: "Location", icon: <MapPin className="w-5 h-5" />, description: "Preferred work locations" },
  { id: "certifications", label: "Certifications", icon: <FileCheck className="w-5 h-5" />, description: "Your held certifications" },
  { id: "visa", label: "Work Rights", icon: <FileCheck className="w-5 h-5" />, description: "Residency and visa status" },
];

// Wrapper component to handle useSearchParams with Suspense
function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get("section") as SectionId) || null;

  const [activeSection, setActiveSection] = useState<SectionId | null>(initialSection);
  const [saving, setSaving] = useState(false);
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

  // Load existing profile data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          setFormData(prev => ({
            ...prev,
            fullName: profile.fullName || profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            postcode: profile.postcode || "",
            currentResidentialLocation: profile.currentResidentialLocation || profile.current_residential_location || "",
            jobTypes: profile.jobTypes || profile.job_types || "",
            openToOtherTypes: profile.openToOtherTypes || profile.open_to_other_types || "",
            shiftPreferences: profile.shiftPreferences || profile.shift_preferences || [],
            startTime: profile.startTime || profile.start_time || "",
            startDate: profile.startDate || profile.start_date || "",
            jobSearchStatus: profile.jobSearchStatus || profile.job_search_status || "",
            qualification: profile.qualification || "",
            otherQualification: profile.otherQualification || profile.other_qualification || "",
            workingInHealthcare: profile.workingInHealthcare || profile.working_in_healthcare || "",
            experience: profile.experience || "",
            organisation: profile.organisation || "",
            locationPreference: profile.locationPreference || profile.location_preference || "",
            preferredLocations: profile.preferredLocations || profile.preferred_locations || [],
            certifications: profile.certifications || [],
            residencyStatus: profile.residencyStatus || profile.residency_status || "",
            visaType: profile.visaType || profile.visa_type || "",
            visaDuration: profile.visaDuration || profile.visa_duration || "",
            workHoursRestricted: profile.workHoursRestricted || profile.work_hours_restricted || "",
            maxWorkHours: profile.maxWorkHours || profile.max_work_hours || "",
          }));
        } catch (e) {
          console.error("Error parsing user profile:", e);
        }
      }
    }
  }, []);

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

  const isSectionComplete = (sectionId: SectionId): boolean => {
    switch (sectionId) {
      case "basic":
        return !!(formData.phone && formData.postcode && formData.currentResidentialLocation);
      case "qualifications":
        return !!(formData.qualification &&
          (formData.qualification !== "Other" || formData.otherQualification) &&
          formData.workingInHealthcare);
      case "preferences":
        return !!(formData.jobTypes && formData.shiftPreferences.length > 0 && formData.startTime && formData.jobSearchStatus);
      case "location":
        return !!(formData.locationPreference || formData.preferredLocations.length > 0);
      case "certifications":
        return formData.certifications.length > 0;
      case "visa":
        return !!(formData.residencyStatus && formData.workHoursRestricted);
      default:
        return false;
    }
  };

  const handleSaveSection = async () => {
    setSaving(true);
    try {
      // Update localStorage with new data
      if (typeof window !== "undefined") {
        const existingProfile = localStorage.getItem("userProfile");
        const profile = existingProfile ? JSON.parse(existingProfile) : {};

        const updatedProfile = {
          ...profile,
          phone: formData.phone,
          postcode: formData.postcode,
          currentResidentialLocation: formData.currentResidentialLocation,
          jobTypes: formData.jobTypes,
          openToOtherTypes: formData.openToOtherTypes,
          shiftPreferences: formData.shiftPreferences,
          startTime: formData.startTime,
          startDate: formData.startDate,
          jobSearchStatus: formData.jobSearchStatus,
          qualification: formData.qualification,
          otherQualification: formData.otherQualification,
          workingInHealthcare: formData.workingInHealthcare,
          experience: formData.experience,
          organisation: formData.organisation,
          locationPreference: formData.locationPreference,
          preferredLocations: formData.preferredLocations,
          certifications: formData.certifications,
          residencyStatus: formData.residencyStatus,
          visaType: formData.visaType,
          visaDuration: formData.visaDuration,
          workHoursRestricted: formData.workHoursRestricted,
          maxWorkHours: formData.maxWorkHours,
        };

        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

        // TODO: Also update via API call to Supabase
        // await updateNurseProfile(updatedProfile);
      }

      // Go back to section list
      setActiveSection(null);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const completedCount = sections.filter(s => isSectionComplete(s.id)).length;
  const completionPercentage = Math.round((completedCount / sections.length) * 100);

  const renderSectionContent = () => {
    const stepProps = { formData, handleChange, handleCheckboxChange };

    switch (activeSection) {
      case "basic":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Phone number*</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter 8-digit phone number"
                className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Postcode*</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => handleChange("postcode", e.target.value)}
                placeholder="Enter 4-digit postcode"
                maxLength={4}
                className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Current suburb/location*</label>
              <input
                type="text"
                value={formData.currentResidentialLocation}
                onChange={(e) => handleChange("currentResidentialLocation", e.target.value)}
                placeholder="E.g., Sydney CBD"
                className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/50"
              />
            </div>
          </div>
        );
      case "qualifications":
        return (
          <div className="space-y-8">
            <QualificationStep {...stepProps} />
            <div className="pt-4 border-t border-gray-100">
              <WorkingInHealthcareStep {...stepProps} />
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-8">
            <JobTypesStep {...stepProps} />
            <div className="pt-4 border-t border-gray-100">
              <ShiftPreferenceStep {...stepProps} />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <StartTimeStep {...stepProps} />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <JobSearchStatusStep {...stepProps} />
            </div>
          </div>
        );
      case "location":
        return <LocationPreferenceStep {...stepProps} />;
      case "certifications":
        return <CertificationsStep {...stepProps} />;
      case "visa":
        return <ResidencyVisaStep {...stepProps} />;
      default:
        return null;
    }
  };

  // Section detail view
  if (activeSection) {
    const currentSection = sections.find(s => s.id === activeSection);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">{currentSection?.label}</h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {renderSectionContent()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleSaveSection}
                disabled={saving || !isSectionComplete(activeSection)}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold text-[15px] transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section list view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/nurseProfile"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Complete Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
            <span className="text-lg font-bold text-pink-500">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {completedCount} of {sections.length} sections completed
          </p>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {sections.map((section, index) => {
            const isComplete = isSectionComplete(section.id);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 ${
                  index !== sections.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isComplete ? <Check className="w-5 h-5" /> : section.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Complete
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-pink-500">
                      Add
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Done Button */}
        {completionPercentage === 100 && (
          <div className="mt-6">
            <Link
              href="/nurseProfile"
              className="block w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-center shadow-lg shadow-green-500/20"
            >
              Profile Complete! View Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// Main page component wrapped in Suspense
export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteProfileContent />
    </Suspense>
  );
}
