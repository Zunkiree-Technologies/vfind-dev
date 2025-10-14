/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { parseValues } from "../utils/profileHelpers";
import Loading from "../../../../components/loading";
import Image from "next/image";
import {
  GraduationCap,
  User,
  Award,
  Briefcase,
  Clock,
  Shield,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ProfileImage {
  url: string;
}

interface Education {
  id?: number;
  institution_name: string;
  degree_name: string;
  from_year: string;
  to_year: string;
}

interface WorkExperience {
  id?: number;
  organization_name: string;
  role_title: string;
  total_years: string;
  start_date: string;
  end_date: string;
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
  education?: Education[];
  residencyStatus?: string;
  visaType?: string;
  visaDuration?: string;
  visaExpiry?: string;
  maxWorkHours?: string;
  workHoursRestricted?: string;
  postcode?: string;
  organisation?: string;
  currentResidentialLocation?: string;
  profileImage?: ProfileImage | null;
  willingToRelocate: string;
  ahpraRegistration: string;
  registrationNumber: string;
  ahprRegistrationExpiry: string;
  workExperiences?: WorkExperience[];
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
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
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([]);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingWorkExperience, setIsEditingWorkExperience] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        console.log("🔐 Using token:", token);

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
        console.log("✅ Nurse Profile fetched:", data);

        setProfile(data);
        setWorkExperienceList(data.workExperiences || []);

        const eduRes = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/get_education",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (eduRes.ok) {
          const eduData = await eduRes.json();
          console.log("🎓 Education Data fetched:", eduData);
          setEducationList(eduData || []);
        }
      } catch (err: any) {
        console.error("❌ Fetch Error:", err);
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFieldChange = (field: keyof NurseProfile, value: string | string[]) => {
    console.log("✏️ Field Changed:", field, "=>", value);
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
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

      console.log("📝 Saving Profile with Data:", editedData);

      const updatedProfile = { ...profile, ...editedData };

      const apiPayload = {
        ...updatedProfile,
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
      };

      console.log("📦 Final Payload to API:", apiPayload);

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
      console.log("✅ Profile successfully updated:", updatedData);

      setProfile(updatedData);
      setEditedData({});
      setIsGlobalEdit(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    console.log("🚫 Edit cancelled");
    setEditedData({});
    setIsGlobalEdit(false);
  };

  const handleImageEdit = async (file: File) => {
    if (!profile) return;

    try {
      console.log("🖼️ Uploading new image file:", file);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found");
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", file);

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
      console.log("✅ Image updated:", updatedData);
      setProfile(updatedData);
    } catch (err: any) {
      console.error("❌ Image Upload Error:", err);
      alert(err.message || "Error uploading image");
    }
  };

  const handleAddEducation = async (education: Education) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("➕ Adding Education:", education);

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/add_education",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(education),
        }
      );

      if (!res.ok) throw new Error("Failed to add education");
      const newEducation = await res.json();
      console.log("✅ New Education Added:", newEducation);
      return newEducation;
    } catch (err: any) {
      console.error("❌ Add Education Error:", err);
      alert(err.message || "Failed to add education");
      throw err;
    }
  };

  const handleEditEducation = async (education: Education) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("✏️ Editing Education:", education);

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/edit_education",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(education),
        }
      );

      if (!res.ok) throw new Error("Failed to edit education");
      const updatedEducation = await res.json();
      console.log("✅ Education Updated:", updatedEducation);
      return updatedEducation;
    } catch (err: any) {
      console.error("❌ Edit Education Error:", err);
      alert(err.message || "Failed to edit education");
      throw err;
    }
  };

  const handleSaveEducation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("🎓 Saving education list:", educationList);

      for (const edu of educationList) {
        if (edu.id) {
          await handleEditEducation(edu);
        } else {
          await handleAddEducation(edu);
        }
      }

      const eduRes = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/get_education",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (eduRes.ok) {
        const eduData = await eduRes.json();
        console.log("🔄 Education refreshed:", eduData);
        setEducationList(eduData || []);
      }

      setIsEditingEducation(false);
      alert("Education saved successfully!");
    } catch (err: any) {
      console.error("❌ Save Education Error:", err);
      alert(err.message || "Failed to save education");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No profile data found
      </div>
    );

  const renderArray = (value: string[] | string | undefined) => parseValues(value) || [];

  const preferredLocationsArray = renderArray(profile.preferredLocations);
  console.log("📍 Preferred Locations:", preferredLocationsArray);

  const jobTypesArray = renderArray(profile.jobTypes);
  console.log("💼 Job Types:", jobTypesArray);

  const shiftPreferencesArray = renderArray(profile.shiftPreferences);
  console.log("⏰ Shift Preferences:", shiftPreferencesArray);

  const certificationsArray = renderArray(profile.certifications);
  console.log("🏅 Certifications:", certificationsArray);





  return (
    <div className="min-h-screen bg-[#F5F6FA] p-4">
      <div className="container mx-auto">
        {/* Profile Picture & Basic Information */}
        <CollapsibleSection
          title="Profile Picture & Basic Information"
          icon={<User className="w-6 h-6 text-blue-600" />}
        >
          <div className="relative">
            {/* Edit Profile Button */}
            {!isGlobalEdit ? (
              <button
                onClick={() => setIsGlobalEdit(true)}
                className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="absolute top-0 right-0 flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Profile Content */}
            <div className="flex flex-col items-center gap-4 pt-12">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                  {profile.profileImage?.url ? (
                    <Image
                      priority
                      src={profile.profileImage.url}
                      alt={profile.fullName}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
                      {profile.fullName?.charAt(0) || "N"}
                    </div>
                  )}
                </div>

                <label className="mt-3 bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Upload/Change Picture
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

              {/* Basic Info Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name
                  </label>
                  {isGlobalEdit ? (
                    <input
                      type="text"
                      value={editedData.fullName ?? profile.fullName}
                      onChange={(e) => handleFieldChange("fullName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone Number
                  </label>
                  {isGlobalEdit ? (
                    <input
                      type="text"
                      value={editedData.phoneNumber ?? profile.phoneNumber}
                      onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Current Location
                  </label>
                  {isGlobalEdit ? (
                    <input
                      type="text"
                      value={
                        editedData.currentResidentialLocation ??
                        profile.currentResidentialLocation
                      }
                      onChange={(e) =>
                        handleFieldChange("currentResidentialLocation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.currentResidentialLocation}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Postcode
                  </label>
                  {isGlobalEdit ? (
                    <input
                      type="text"
                      value={editedData.postcode ?? profile.postcode}
                      onChange={(e) => handleFieldChange("postcode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.postcode || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Willing to Relocate
                  </label>
                  {isGlobalEdit ? (
                    <select
                      value={editedData.willingToRelocate ?? profile.willingToRelocate}
                      onChange={(e) => handleFieldChange("willingToRelocate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.willingToRelocate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Visa & Residency */}
        <CollapsibleSection
          title="Visa & Residency"
          icon={<Shield className="w-6 h-6 text-blue-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Residency / Visa Status
              </label>
              {isGlobalEdit ? (
                <input
                  type="text"
                  value={editedData.residencyStatus ?? profile.residencyStatus}
                  onChange={(e) => handleFieldChange("residencyStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.residencyStatus}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Visa Type
              </label>
              {isGlobalEdit ? (
                <input
                  type="text"
                  value={editedData.visaType ?? profile.visaType}
                  onChange={(e) => handleFieldChange("visaType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.visaType || "Not specified"}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Visa Expiry
              </label>
              {isGlobalEdit ? (
                <input
                  type="date"
                  value={editedData.visaExpiry ?? profile.visaExpiry}
                  onChange={(e) => handleFieldChange("visaExpiry", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.visaExpiry || "Not specified"}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Work Restriction
              </label>
              {isGlobalEdit ? (
                <select
                  value={editedData.workHoursRestricted ?? profile.workHoursRestricted}
                  onChange={(e) => handleFieldChange("workHoursRestricted", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.workHoursRestricted}</p>
              )}
            </div>

            {profile.workHoursRestricted === "Yes" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Work Restriction Details
                </label>
                {isGlobalEdit ? (
                  <input
                    type="text"
                    value={editedData.maxWorkHours ?? profile.maxWorkHours}
                    onChange={(e) => handleFieldChange("maxWorkHours", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">{profile.maxWorkHours || "Not specified"}</p>
                )}
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* AHPRA Registration */}
        <CollapsibleSection
          title="AHPRA Registration"
          icon={<Award className="w-6 h-6 text-blue-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                AHPRA Registration
              </label>
              {isGlobalEdit ? (
                <select
                  value={editedData.ahpraRegistration ?? profile.ahpraRegistration}
                  onChange={(e) => handleFieldChange("ahpraRegistration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.ahpraRegistration}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                AHPRA Registration Number
              </label>
              {isGlobalEdit ? (
                <input
                  type="text"
                  value={editedData.registrationNumber ?? profile.registrationNumber}
                  onChange={(e) => handleFieldChange("registrationNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.registrationNumber}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Registration Expiry
              </label>
              {isGlobalEdit ? (
                <input
                  type="date"
                  value={editedData.ahprRegistrationExpiry ?? profile.ahprRegistrationExpiry}
                  onChange={(e) =>
                    handleFieldChange("ahprRegistrationExpiry", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.ahprRegistrationExpiry}</p>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Education */}
        <CollapsibleSection
          title="Education"
          icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
        >
          <div className="space-y-4">
            <div className="flex justify-end gap-2 mb-4">
              {!isEditingEducation ? (
                <button
                  onClick={() => setIsEditingEducation(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Education
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingEducation(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEducation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>

            {educationList.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Education {index + 1}</h3>
                  {isEditingEducation && (
                    <button
                      onClick={() => {
                        const newList = educationList.filter((_, i) => i !== index);
                        setEducationList(newList);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      value={edu.degree_name}
                      onChange={(e) => {
                        const newList = [...educationList];
                        newList[index].degree_name = e.target.value;
                        setEducationList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingEducation}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution_name}
                      onChange={(e) => {
                        const newList = [...educationList];
                        newList[index].institution_name = e.target.value;
                        setEducationList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingEducation}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      From Year
                    </label>
                    <input
                      type="text"
                      value={edu.from_year}
                      onChange={(e) => {
                        const newList = [...educationList];
                        newList[index].from_year = e.target.value;
                        setEducationList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingEducation}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      To Year
                    </label>
                    <input
                      type="text"
                      value={edu.to_year}
                      onChange={(e) => {
                        const newList = [...educationList];
                        newList[index].to_year = e.target.value;
                        setEducationList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingEducation}
                    />
                  </div>
                </div>
              </div>
            ))}

            {isEditingEducation && (
              <button
                onClick={() => {
                  setEducationList([
                    ...educationList,
                    {
                      institution_name: "",
                      degree_name: "",
                      from_year: "",
                      to_year: "",
                    },
                  ]);
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            )}
          </div>
        </CollapsibleSection>

        {/* Work Experience */}
        <CollapsibleSection
          title="Work Experience"
          icon={<Briefcase className="w-6 h-6 text-blue-600" />}
        >
          <div className="space-y-6">
            <div className="flex justify-end gap-2 mb-4">
              {!isEditingWorkExperience ? (
                <button
                  onClick={() => setIsEditingWorkExperience(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Work Experience
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingWorkExperience(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingWorkExperience(false);
                      alert("Work experience saved!");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>

            {workExperienceList.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                  {isEditingWorkExperience && (
                    <button
                      onClick={() => {
                        const newList = workExperienceList.filter((_, i) => i !== index);
                        setWorkExperienceList(newList);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={exp.organization_name}
                      onChange={(e) => {
                        const newList = [...workExperienceList];
                        newList[index].organization_name = e.target.value;
                        setWorkExperienceList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingWorkExperience}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Total Years of Experience
                    </label>
                    <input
                      type="text"
                      value={exp.total_years}
                      onChange={(e) => {
                        const newList = [...workExperienceList];
                        newList[index].total_years = e.target.value;
                        setWorkExperienceList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingWorkExperience}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={exp.role_title}
                      onChange={(e) => {
                        const newList = [...workExperienceList];
                        newList[index].role_title = e.target.value;
                        setWorkExperienceList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingWorkExperience}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={(e) => {
                        const newList = [...workExperienceList];
                        newList[index].start_date = e.target.value;
                        setWorkExperienceList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingWorkExperience}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => {
                        const newList = [...workExperienceList];
                        newList[index].end_date = e.target.value;
                        setWorkExperienceList(newList);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!isEditingWorkExperience}
                    />
                  </div>
                </div>
              </div>
            ))}

            {isEditingWorkExperience && (
              <button
                onClick={() => {
                  setWorkExperienceList([
                    ...workExperienceList,
                    {
                      organization_name: "",
                      role_title: "",
                      total_years: "",
                      start_date: "",
                      end_date: "",
                    },
                  ]);
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            )}
          </div>
        </CollapsibleSection>

        {/* Certifications */}
        <CollapsibleSection
          title="Certifications"
          icon={<Award className="w-6 h-6 text-blue-600" />}
        >
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Certifications
              </label>
              {isGlobalEdit ? (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !certificationsArray.includes(e.target.value)) {
                      handleFieldChange("certifications", [
                        ...certificationsArray,
                        e.target.value,
                      ]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a certification</option>
                  <option value="Police Check Certificate">Police Check Certificate</option>
                  <option value="BLS Certification">BLS Certification</option>
                  <option value="ACLS Certification">ACLS Certification</option>
                  <option value="PALS Certification">PALS Certification</option>
                </select>
              ) : null}

              <div className="flex flex-wrap gap-2 mt-3">
                {certificationsArray.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    <span>{cert}</span>
                    {isGlobalEdit && (
                      <button
                        onClick={() => {
                          const newCerts = certificationsArray.filter((_, i) => i !== idx);
                          handleFieldChange("certifications", newCerts);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {certificationsArray.length === 0 && (
                <p className="text-gray-400 text-sm italic mt-2">
                  No certifications specified
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Other Certifications
              </label>
              {isGlobalEdit ? (
                <input
                  type="text"
                  placeholder="Enter other certifications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-400 text-sm italic">Not specified</p>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Work Preferences */}
        <CollapsibleSection
          title="Work Preferences"
          icon={<Clock className="w-6 h-6 text-blue-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Job Type
              </label>
              {isGlobalEdit ? (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !jobTypesArray.includes(e.target.value)) {
                      handleFieldChange("jobTypes", [...jobTypesArray, e.target.value]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select job type</option>
                  <option value="Full time">Full time</option>
                  <option value="Part time">Part time</option>
                  <option value="Contract">Contract</option>
                  <option value="Casual">Casual</option>
                </select>
              ) : null}

              <div className="flex flex-wrap gap-2 mt-2">
                {jobTypesArray.map((type, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    <span>{type}</span>
                    {isGlobalEdit && (
                      <button
                        onClick={() => {
                          const newTypes = jobTypesArray.filter((_, i) => i !== idx);
                          handleFieldChange("jobTypes", newTypes);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Open to Other Job Types
              </label>
              {isGlobalEdit ? (
                <select
                  value={editedData.openToOtherTypes ?? profile.openToOtherTypes}
                  onChange={(e) => handleFieldChange("openToOtherTypes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.openToOtherTypes}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Shift
              </label>
              {isGlobalEdit ? (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !shiftPreferencesArray.includes(e.target.value)) {
                      handleFieldChange("shiftPreferences", [
                        ...shiftPreferencesArray,
                        e.target.value,
                      ]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select shift preference</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              ) : null}

              <div className="flex flex-wrap gap-2 mt-2">
                {shiftPreferencesArray.map((shift, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    <span>{shift}</span>
                    {isGlobalEdit && (
                      <button
                        onClick={() => {
                          const newShifts = shiftPreferencesArray.filter((_, i) => i !== idx);
                          handleFieldChange("shiftPreferences", newShifts);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Locations
              </label>
              {isGlobalEdit ? (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !preferredLocationsArray.includes(e.target.value)) {
                      handleFieldChange("preferredLocations", [
                        ...preferredLocationsArray,
                        e.target.value,
                      ]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select location</option>
                  <option value="Sydney">Sydney</option>
                  <option value="Melbourne">Melbourne</option>
                  <option value="Brisbane">Brisbane</option>
                  <option value="Perth">Perth</option>
                  <option value="Adelaide">Adelaide</option>
                </select>
              ) : null}

              <div className="flex flex-wrap gap-2 mt-2">
                {preferredLocationsArray.map((location, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    <span>{location}</span>
                    {isGlobalEdit && (
                      <button
                        onClick={() => {
                          const newLocations = preferredLocationsArray.filter(
                            (_, i) => i !== idx
                          );
                          handleFieldChange("preferredLocations", newLocations);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Available to Start
              </label>
              {isGlobalEdit ? (
                <select
                  value={editedData.startTime ?? profile.startTime}
                  onChange={(e) => handleFieldChange("startTime", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Immediately">Immediately</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Within 2 months">Within 2 months</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.startTime || profile.startDate}</p>
              )}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}