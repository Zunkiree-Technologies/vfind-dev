"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Circle, ChevronRight, User, Briefcase, MapPin, Award, FileCheck } from "lucide-react";

interface ProfileData {
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  qualification?: string;
  jobTypes?: string;
  shiftPreferences?: string[];
  locationPreference?: string;
  preferredLocations?: string[];
  certifications?: string[];
  residencyStatus?: string;
  experience?: string;
  workingInHealthcare?: string;
}

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  isComplete: boolean;
  href: string;
}

export default function ProfileCompletionWidget() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [sections, setSections] = useState<ProfileSection[]>([]);

  useEffect(() => {
    // Load profile data from localStorage
    if (typeof window !== "undefined") {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          setProfileData(profile);
        } catch (e) {
          console.error("Error parsing user profile:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (profileData) {
      // Calculate sections completion
      const newSections: ProfileSection[] = [
        {
          id: "basic",
          label: "Basic Info",
          icon: <User className="w-4 h-4" />,
          isComplete: !!(profileData.fullName || profileData.full_name) && !!profileData.email && !!profileData.phone && !!profileData.postcode,
          href: "/nurseProfile/complete-profile?section=basic",
        },
        {
          id: "qualifications",
          label: "Qualifications",
          icon: <Award className="w-4 h-4" />,
          isComplete: !!profileData.qualification,
          href: "/nurseProfile/complete-profile?section=qualifications",
        },
        {
          id: "preferences",
          label: "Work Preferences",
          icon: <Briefcase className="w-4 h-4" />,
          isComplete: !!profileData.jobTypes && (profileData.shiftPreferences?.length || 0) > 0,
          href: "/nurseProfile/complete-profile?section=preferences",
        },
        {
          id: "location",
          label: "Location",
          icon: <MapPin className="w-4 h-4" />,
          isComplete: !!profileData.locationPreference || (profileData.preferredLocations?.length || 0) > 0,
          href: "/nurseProfile/complete-profile?section=location",
        },
        {
          id: "certifications",
          label: "Certifications",
          icon: <FileCheck className="w-4 h-4" />,
          isComplete: (profileData.certifications?.length || 0) > 0,
          href: "/nurseProfile/complete-profile?section=certifications",
        },
        {
          id: "visa",
          label: "Work Rights",
          icon: <FileCheck className="w-4 h-4" />,
          isComplete: !!profileData.residencyStatus,
          href: "/nurseProfile/complete-profile?section=visa",
        },
      ];

      setSections(newSections);

      // Calculate percentage
      const completedCount = newSections.filter(s => s.isComplete).length;
      const percentage = Math.round((completedCount / newSections.length) * 100);
      setCompletionPercentage(percentage);
    }
  }, [profileData]);

  // Don't show if profile is complete
  if (completionPercentage === 100) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
        <span className="text-sm font-medium text-pink-500">{completionPercentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Message */}
      <p className="text-sm text-gray-500 mb-6">
        Complete your profile to get discovered by top employers and receive better job matches!
      </p>

      {/* Sections Checklist */}
      <div className="space-y-3 mb-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              section.isComplete
                ? "bg-green-50 border border-green-100"
                : "bg-gray-50 border border-gray-100 hover:bg-pink-50 hover:border-pink-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {section.isComplete ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <div className="flex items-center gap-2">
                <span className={section.isComplete ? "text-green-600" : "text-gray-400"}>
                  {section.icon}
                </span>
                <span className={`text-sm font-medium ${section.isComplete ? "text-green-700" : "text-gray-700"}`}>
                  {section.label}
                </span>
              </div>
            </div>
            {!section.isComplete && (
              <div className="flex items-center gap-1 text-pink-500 text-sm font-medium">
                <span>Add</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
            {section.isComplete && (
              <span className="text-xs text-green-600 font-medium">Complete</span>
            )}
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <Link
        href="/nurseProfile/complete-profile"
        className="block w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold text-sm text-center transition-all shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30"
      >
        Complete Profile
      </Link>
    </div>
  );
}
