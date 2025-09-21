/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { parseValues } from "../utils/profileHelpers";
import Loading from "../../../../components/loading";
import Image from "next/image";
import {
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  User,
  UserRoundSearch,
  Award,
  Briefcase,
  Clock,
  Shield,
  Edit,
  Check,
  X,
} from "lucide-react";

interface ProfileImage {
  url: string;
}

interface NurseProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  otherQualification?: string;
  experience: string;
  workingInHealthcare: string;
  jobTypes: string[] | string;
  openToOtherTypes?: string;
  startDate: string;
  startTime: string;
  jobSearchStatus: string;
  preferredLocations: string[];
  shiftPreferences: string[] | string;
  licenses?: string[] | string;
  certifications?: string[] | string;
  education?: string[] | string;
  residencyStatus?: string;
  visaType?: string;
  visaDuration?: string;
  maxWorkHours?: string;
  workHoursRestricted?: string;
  postcode?: string;
  organisation?: string;
  currentResidentialLocation?: string;
  profileImage?: ProfileImage | null;
}

interface EditableFieldProps {
  field: keyof NurseProfile;
  value: string | undefined;
  placeholder?: string;
  multiline?: boolean;
  onSave: (field: keyof NurseProfile, value: string) => void;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  field,
  value,
  placeholder = "Not specified",
  multiline = false,
  onSave,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  const handleSave = () => {
    console.log("Editing field:", field, "with value:", tempValue);
    onSave(field, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <span className="flex-1">{value || placeholder}</span>
        {!disabled && (
          <Edit
            className="w-3 h-3 text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              setTempValue(value || "");
              setIsEditing(true);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {multiline ? (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSave();
            }
            if (e.key === "Escape") {
              handleCancel();
            }
          }}
          className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm resize-none"
          rows={2}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
            if (e.key === "Escape") {
              handleCancel();
            }
          }}
          className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm"
          autoFocus
        />
      )}
      <Check
        className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
        onClick={handleSave}
      />
      <X
        className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
        onClick={handleCancel}
      />
    </div>
  );
};

interface EditableArrayFieldProps {
  field: keyof NurseProfile;
  values: string[];
  placeholder?: string;
  onSave: (field: keyof NurseProfile, values: string[]) => void;
}

const EditableArrayField: React.FC<EditableArrayFieldProps> = ({
  field,
  values,
  placeholder = "None specified",
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValues, setTempValues] = useState(values.join('\n'));

  const handleSave = () => {
    const newValues = tempValues.split('\n').filter(v => v.trim());
    onSave(field, newValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValues(values.join('\n'));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {values.length > 0 ? (
          <div className="flex flex-wrap gap-2 group">
            {values.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
              >
                {value}
              </span>
            ))}
            <Edit
              className="w-3 h-3 text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <span className="text-gray-400 text-sm italic">{placeholder}</span>
            <Edit
              className="w-3 h-3 text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={tempValues}
        onChange={(e) => setTempValues(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            handleSave();
          }
          if (e.key === "Escape") {
            handleCancel();
          }
        }}
        className="w-full px-3 py-2 border border-blue-300 rounded text-sm resize-none"
        rows={Math.max(3, tempValues.split('\n').length)}
        placeholder="Enter each item on a new line"
        autoFocus
      />
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Press Ctrl+Enter to save, Escape to cancel</span>
        <Check
          className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
          onClick={handleSave}
        />
        <X
          className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default function NurseProfilePage() {
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/get_nurse_profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res)
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
          console.log("Fetched Profile Data:", data);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFieldSave = async (field: keyof NurseProfile, newValue: string | string[]) => {
    if (!profile) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found");
        return;
      }

      const updatedProfile = { ...profile, [field]: newValue };

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/edit_nurse_profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update profile: ${res.status} ${errorText}`);
      }

      const updatedData = await res.json();
         console.log("Profile Updated Successfully:", updatedData);
      setProfile(updatedData);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  };

  const handleStringFieldSave = (field: keyof NurseProfile, value: string) => {
    handleFieldSave(field, value);
  };

  const handleArrayFieldSave = (field: keyof NurseProfile, values: string[]) => {
    handleFieldSave(field, values);
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
      {error}
    </div>
  );
  if (!profile) return (
    <div className="flex justify-center items-center h-screen text-gray-600">
      No profile data found
    </div>
  );

  const renderArray = (value: string[] | string | undefined) =>
    parseValues(value) || [];

  const preferredLocationsArray = renderArray(profile.preferredLocations);
  const jobTypesArray = renderArray(profile.jobTypes);
  const shiftPreferencesArray = renderArray(profile.shiftPreferences);
  const certificationsArray = renderArray(profile.certifications);

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-4">
      {/* ================= Top Profile Section ================= */}
      <div className="container mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex-shrink-0">
              {profile.profileImage?.url ? (
                <Image
                  priority
                  src={profile.profileImage.url}
                  alt={profile.fullName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                  {profile.fullName?.charAt(0) || "N"}
                </div>
              )}
            </div>

            {/* Edit Profile Image Button */}
            <label className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded cursor-pointer hover:bg-blue-700">
              Edit Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const file = e.target.files[0];

                  const formData = new FormData();
                  formData.append("profileImage", file);

                  Object.entries(profile).forEach(([key, value]) => {
                    if (key !== "profileImage") formData.append(key, value as any);
                  });

                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(
                      "https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/edit_nurse_profile",
                      {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      }
                    );

                    if (!res.ok) throw new Error("Failed to update profile image");
                    const updatedData = await res.json();
                    setProfile(updatedData);
                  } catch (err: any) {
                    alert(err.message || "Error uploading image");
                  }
                }}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              <EditableField
                field="fullName"
                value={profile.fullName}
                placeholder="Full Name"
                onSave={handleStringFieldSave}
              />
            </h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4 text-blue-700" />
              Profile last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Basic Info & Visa Section ================= */}
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-4 mb-5">
        {/* Basic Information */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900">
                <EditableField
                  field="currentResidentialLocation"
                  value={profile.currentResidentialLocation}
                  placeholder="Location not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Job Status</h3>
              <p className="text-gray-900">
                <EditableField
                  field="jobSearchStatus"
                  value={profile.jobSearchStatus}
                  placeholder="Not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">
                <EditableField
                  field="email"
                  value={profile.email}
                  placeholder="Email"
                  onSave={handleStringFieldSave}
                  disabled={true}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <p className="text-gray-900">
                <EditableField
                  field="phoneNumber"
                  value={profile.phoneNumber}
                  placeholder="Phone number"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Availability</h3>
              <p className="text-gray-900">
                <EditableField
                  field="startTime"
                  value={profile.startDate || profile.startTime}
                  placeholder="Not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Visa & Residency */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Visa & Residency</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <p className="text-gray-900">
                <EditableField
                  field="residencyStatus"
                  value={profile.residencyStatus}
                  placeholder="Australian Citizen / Permanent Resident"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visa Type</h3>
              <p className="text-gray-900">
                <EditableField
                  field="visaType"
                  value={profile.visaType}
                  placeholder="Not Specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              <p className="text-gray-900">
                <EditableField
                  field="visaDuration"
                  value={profile.visaDuration}
                  placeholder="Not Specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Job Search Preferences ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-5 container mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <UserRoundSearch className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Job search preferences</h2>
        </div>
        <div className="flex justify-between gap-6">
          {/* Preferred Work Locations */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Work Locations</h3>
            <EditableArrayField
              field="preferredLocations"
              values={preferredLocationsArray}
              placeholder="No preferred locations specified"
              onSave={handleArrayFieldSave}
            />
          </div>

          {/* Preferred Job Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Job Types</h3>
            <EditableArrayField
              field="jobTypes"
              values={jobTypesArray}
              placeholder="No job types specified"
              onSave={handleArrayFieldSave}
            />
          </div>
        </div>

        {/* Open To Other Types & Preferred Shift */}
        <div className="flex justify-between gap-6">
          {/* Open To Other Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Open To Other Types</h3>
            <div>
              <span className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium">
                <EditableField
                  field="openToOtherTypes"
                  value={profile.openToOtherTypes}
                  placeholder="Not Specified"
                  onSave={handleStringFieldSave}
                />
              </span>
            </div>
          </div>

          {/* Preferred Shift */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Shift</h3>
            <EditableArrayField
              field="shiftPreferences"
              values={shiftPreferencesArray}
              placeholder="No shift preferences specified"
              onSave={handleArrayFieldSave}
            />
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-700 mr-2" />
          Available To Start: <span className="ml-1">
            <EditableField
              field="startTime"
              value={profile.startDate || profile.startTime}
              placeholder="Not specified"
              onSave={handleStringFieldSave}
            />
          </span>
        </div>
      </div>

      {/* ================= Qualifications & Certificates ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-5 container mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Qualifications & Certificates</h2>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Education</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-800">
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
              <EditableField
                field="qualification"
                value={profile.qualification}
                placeholder="Bachelor of Nursing"
                onSave={handleStringFieldSave}
              />
            </div>
            {profile.otherQualification && (
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
                <EditableField
                  field="otherQualification"
                  value={profile.otherQualification}
                  placeholder="Other Qualification"
                  onSave={handleStringFieldSave}
                />
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Certifications</h3>
          {certificationsArray.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-800">
              {certificationsArray.map((cert: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-700" />
                  {cert}
                </li>
              ))}
            </ul>
          ) : (
            <div className="group">
              <span className="text-gray-400 text-sm italic">No certifications specified</span>
              <EditableArrayField
                field="certifications"
                values={certificationsArray}
                placeholder="No certifications specified"
                onSave={handleArrayFieldSave}
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= Work Experience & Preferences ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto">
        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
          </div>

          <div className="space-y-3 text-sm border-l-4 border-blue-500 pl-4">
            <div>
              <p className="text-gray-500">Healthcare Experience</p>
              <p className="font-medium text-gray-900">
                <EditableField
                  field="experience"
                  value={profile.experience}
                  placeholder="No experience specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>

            <div>
              <p className="text-gray-500">Currently working in healthcare</p>
              <p className="font-medium text-gray-900">
                <EditableField
                  field="workingInHealthcare"
                  value={profile.workingInHealthcare}
                  placeholder="Not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>

            <div>
              <p className="text-gray-500">Organization Name</p>
              <p className="font-medium text-gray-900">
                <EditableField
                  field="organisation"
                  value={profile.organisation}
                  placeholder="Not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Work Preferences</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Maximum work hours</p>
              <p className="font-medium text-gray-900">
                <EditableField
                  field="maxWorkHours"
                  value={profile.maxWorkHours}
                  placeholder="Not specified"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
            <div>
              <p className="text-gray-500">Work hours restricted</p>
              <p className="font-medium text-gray-900">
                <EditableField
                  field="workHoursRestricted"
                  value={profile.workHoursRestricted}
                  placeholder="No"
                  onSave={handleStringFieldSave}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}