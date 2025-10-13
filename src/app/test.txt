/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { parseValues } from "../utils/profileHelpers";
import Loading from "../../../../components/loading";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  User,
  UserRoundSearch,
  Award,
  Briefcase,
  Clock,
  Shield,
  Edit,
  Save,
  X,
  Plus,
  Minus,
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
  isGlobalEdit: boolean;
  editedData: Partial<NurseProfile>;
  onFieldChange: (field: keyof NurseProfile, value: string) => void;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  field,
  value,
  placeholder = "Not specified",
  multiline = false,
  isGlobalEdit,
  editedData,
  onFieldChange,
  disabled = false,
}) => {
  const currentValue = editedData[field] !== undefined ? editedData[field] as string : (value || "");

  if (isGlobalEdit && !disabled) {
    return multiline ? (
      <textarea
        value={currentValue}
        onChange={(e) => onFieldChange(field, e.target.value)}
        className="w-full px-2 py-1 border border-blue-300 rounded text-sm resize-none"
        rows={2}
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        value={currentValue}
        onChange={(e) => onFieldChange(field, e.target.value)}
        className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
        placeholder={placeholder}
      />
    );
  }

  return <span>{currentValue || placeholder}</span>;
};

interface EditableArrayFieldProps {
  field: keyof NurseProfile;
  values: string[];
  placeholder?: string;
  isGlobalEdit: boolean;
  editedData: Partial<NurseProfile>;
  onFieldChange: (field: keyof NurseProfile, values: string[]) => void;
}

const EditableArrayField: React.FC<EditableArrayFieldProps> = ({
  field,
  values,
  placeholder = "None specified",
  isGlobalEdit,
  editedData,
  onFieldChange,
}) => {
  const currentValues = editedData[field] !== undefined
    ? (Array.isArray(editedData[field]) ? editedData[field] as string[] : [editedData[field] as string])
    : values;

  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim() && !currentValues.includes(newItem.trim())) {
      const updatedValues = [...currentValues, newItem.trim()];
      onFieldChange(field, updatedValues);
      setNewItem("");
    }
  };

  const removeItem = (indexToRemove: number) => {
    const updatedValues = currentValues.filter((_, index) => index !== indexToRemove);
    onFieldChange(field, updatedValues);
  };

  if (isGlobalEdit) {
    return (
      <div className="space-y-3">
        {/* Display current items with remove buttons */}
        <div className="flex flex-wrap gap-2">
          {currentValues.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
            >
              <span>{value}</span>
              <button
                onClick={() => removeItem(index)}
                className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                type="button"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new item input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
              }
            }}
            className="flex-1 px-3 py-2 border border-blue-300 rounded text-sm"
            placeholder="Add new item..."
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim() || currentValues.includes(newItem.trim())}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Show placeholder when no items */}
        {currentValues.length === 0 && (
          <span className="text-gray-400 text-sm italic">{placeholder}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentValues.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentValues.map((value, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 text-sm italic">{placeholder}</span>
      )}
    </div>
  );
};

export default function NurseProfilePage() {
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGlobalEdit, setIsGlobalEdit] = useState(false);
  const [editedData, setEditedData] = useState<Partial<NurseProfile>>({});
  const [saving, setSaving] = useState(false);

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

  const handleFieldChange = (field: keyof NurseProfile, value: string | string[]) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAll = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found");
        return;
      }

      // Merge original profile with edited data
      const updatedProfile = { ...profile, ...editedData };

      // Convert array fields to strings for API compatibility
      const apiPayload = {
        ...updatedProfile,
        // Convert arrays to JSON strings for fields that might be arrays
        jobTypes: Array.isArray(updatedProfile.jobTypes)
          ? JSON.stringify(updatedProfile.jobTypes)
          : updatedProfile.jobTypes,
        preferredLocations: Array.isArray(updatedProfile.preferredLocations)
          ? JSON.stringify(updatedProfile.preferredLocations)
          : updatedProfile.preferredLocations,
        shiftPreferences: Array.isArray(updatedProfile.shiftPreferences)
          ? JSON.stringify(updatedProfile.shiftPreferences)
          : updatedProfile.shiftPreferences,
        licenses: Array.isArray(updatedProfile.licenses)
          ? JSON.stringify(updatedProfile.licenses)
          : updatedProfile.licenses,
        certifications: Array.isArray(updatedProfile.certifications)
          ? JSON.stringify(updatedProfile.certifications)
          : updatedProfile.certifications,
        education: Array.isArray(updatedProfile.education)
          ? JSON.stringify(updatedProfile.education)
          : updatedProfile.education,
      };

      console.log("API Payload:", apiPayload); // Debug log to see what's being sent

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/edit_nurse_profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update profile: ${res.status} ${errorText}`);
      }

      const updatedData = await res.json();
      console.log("Profile Updated Successfully:", updatedData);
      setProfile(updatedData);
      setEditedData({});
      setIsGlobalEdit(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({});
    setIsGlobalEdit(false);
  };

  const handleImageEdit = async (file: File) => {
    if (!profile) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found");
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", file);

      // Add all profile fields to formData
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== "profileImage" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/image_edit",
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
      {/* ================= Edit/Save Button Section ================= */}
      <div className="container mx-auto mb-4">

      </div>

      {/* ================= Top Profile Section ================= */}
      <div className="container mx-auto bg-white rounded-xl shadow-sm p-8 mb-8 relative">
        {/* Top-right buttons */}
        <div className="absolute top-4 right-4 flex justify-end gap-2">
          {!isGlobalEdit ? (
            <button
              onClick={() => setIsGlobalEdit(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
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
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageEdit(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 w-fit">
              <EditableField
                field="fullName"
                value={profile.fullName}
                placeholder="Full Name"
                isGlobalEdit={isGlobalEdit}
                editedData={editedData}
                onFieldChange={handleFieldChange}
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
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 ">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="currentResidentialLocation"
                  value={profile.currentResidentialLocation}
                  placeholder="Location not specified"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Job Status</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="jobSearchStatus"
                  value={profile.jobSearchStatus}
                  placeholder="Not specified"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="email"
                  value={profile.email}
                  placeholder="Email"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                  disabled={true}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="phoneNumber"
                  value={profile.phoneNumber}
                  placeholder="Phone number"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Availability</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="startTime"
                  value={profile.startDate || profile.startTime}
                  placeholder="Not specified"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="residencyStatus"
                  value={profile.residencyStatus}
                  placeholder="Australian Citizen / Permanent Resident"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visa Type</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="visaType"
                  value={profile.visaType}
                  placeholder="Not Specified"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              <p className="text-gray-900 w-fit">
                <EditableField
                  field="visaDuration"
                  value={profile.visaDuration}
                  placeholder="Not Specified"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
              isGlobalEdit={isGlobalEdit}
              editedData={editedData}
              onFieldChange={handleFieldChange}
            />
          </div>

          {/* Preferred Job Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Job Types</h3>
            <EditableArrayField
              field="jobTypes"
              values={jobTypesArray}
              placeholder="No job types specified"
              isGlobalEdit={isGlobalEdit}
              editedData={editedData}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Open To Other Types & Preferred Shift */}
        <div className="flex justify-between gap-6">
          {/* Open To Other Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Open To Other Types</h3>
            <div className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium inline-block">
              <EditableField
                field="openToOtherTypes"
                value={profile.openToOtherTypes}
                placeholder="Not Specified"
                isGlobalEdit={isGlobalEdit}
                editedData={editedData}
                onFieldChange={handleFieldChange}
              />
            </div>
          </div>

          {/* Preferred Shift */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Shift</h3>
            <EditableArrayField
              field="shiftPreferences"
              values={shiftPreferencesArray}
              placeholder="No shift preferences specified"
              isGlobalEdit={isGlobalEdit}
              editedData={editedData}
              onFieldChange={handleFieldChange}
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
              isGlobalEdit={isGlobalEdit}
              editedData={editedData}
              onFieldChange={handleFieldChange}
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
                isGlobalEdit={isGlobalEdit}
                editedData={editedData}
                onFieldChange={handleFieldChange}
              />
            </div>
            {(profile.otherQualification || isGlobalEdit) && (
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
                <EditableField
                  field="otherQualification"
                  value={profile.otherQualification}
                  placeholder="Other Qualification"
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </div>
            )}
          </div>
        </div>
        {/* Certification */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Certifications</h3>
          <div className="flex flex-col gap-2">
            {certificationsArray && certificationsArray.length > 0 ? (
              certificationsArray.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-800">
                  <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{cert}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm">
                No certifications specified
              </span>
            )}
          </div>

          {/* Editable mode */}
          {isGlobalEdit && (
            <EditableArrayField
              field="certifications"
              values={certificationsArray}
              placeholder="Add certification"
              isGlobalEdit={isGlobalEdit}
              editedData={editedData}
              onFieldChange={handleFieldChange}
            />
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
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
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
                  isGlobalEdit={isGlobalEdit}
                  editedData={editedData}
                  onFieldChange={handleFieldChange}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}