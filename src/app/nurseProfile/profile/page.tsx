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
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import Footer from "@/app/Admin/components/layout/Footer";
import { Navbar } from "../components/Navbar";
import MainButton from "@/components/ui/MainButton";

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
  total_years_of_experience: string;
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
  isCustomResidency?: boolean;
  isCustomDate?: boolean;
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
  defaultOpen = false,
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
  const [saving, setSaving] = useState(false);
  const [educationList, setEducationList] = useState<Education[]>([]);

  const [workExperienceList, setWorkExperienceList] = useState<
    WorkExperience[]
  >([]);
  const [isEditingEducation, setIsEditingEducation] = useState<number | null>(
    null
  );
  const [isEditingWorkExperience, setIsEditingWorkExperience] = useState<
    number | null
  >(null);


  // Independent edit states for each section
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingVisaResidency, setIsEditingVisaResidency] = useState(false);
  const [isEditingAhpraReg, setIsEditingAhpraReg] = useState(false);
  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [isEditingWorkPreferences, setIsEditingWorkPreferences] =
    useState(false);

  // Separate edited data for each section
  const [editedBasicInfo, setEditedBasicInfo] = useState<Partial<NurseProfile>>(
    {}
  );
  const [editedVisaInfo, setEditedVisaInfo] = useState<Partial<NurseProfile>>(
    {}
  );
  const [editedAhpraInfo, setEditedAhpraInfo] = useState<Partial<NurseProfile>>(
    {}
  );
  const [editedCertInfo, setEditedCertInfo] = useState<Partial<NurseProfile>>(
    {}
  );
  const [editedWorkPrefInfo, setEditedWorkPrefInfo] = useState<
    Partial<NurseProfile>
  >({});

  // Fetch work experiences helper function
  const fetchWorkExperiences = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/get_workExperience",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch work experience");

      const data = await res.json();
      console.log("📥 Work Experience Data fetched:", data);

      // Consistent mapping with proper fallbacks for both naming conventions
      const mapped = data.map((exp: any) => ({
        id: exp.id,
        organization_name: exp.organizationName || exp.organization_name || "",
        role_title: exp.roleTitle || exp.role_title || "",
        total_years_of_experience:
          exp.totalYearsOfExperience || exp.total_years_of_experience || "",
        start_date: exp.startDate || exp.start_date || "",
        end_date: exp.endDate || exp.end_date || "",
      }));

      setWorkExperienceList(mapped);
      console.log("✅ Work Experience loaded successfully:", mapped);
    } catch (err: any) {
      console.error("❌ Fetch Work Experience Error:", err);
      setWorkExperienceList([]); // Set empty array on error
    }
  };

  // Single useEffect for initial data load
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

        // Fetch nurse profile
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

        // Fetch education and work experience in parallel
        const [eduRes, workRes] = await Promise.all([
          fetch(
            "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/get_education",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          fetch(
            "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/get_workExperience",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        // Handle education data
        if (eduRes.ok) {
          const eduData = await eduRes.json();
          setEducationList(eduData || []);
          console.log("✅ Education loaded:", eduData);
        }

        // Handle work experience data
        if (workRes.ok) {
          const workData = await workRes.json();
          const mapped = workData.map((exp: any) => ({
            id: exp.id,
            organization_name:
              exp.organizationName || exp.organization_name || "",
            role_title: exp.roleTitle || exp.role_title || "",
            total_years_of_experience:
              exp.totalYearsOfExperience || exp.total_years_of_experience || "",
            start_date: exp.startDate || exp.start_date || "",
            end_date: exp.endDate || exp.end_date || "",
          }));
          setWorkExperienceList(mapped);
          console.log("✅ Work Experience loaded:", mapped);
        }
      } catch (err: any) {
        console.error("❌ Fetch Error:", err);
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Run only once on mount

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

  // ==================== BASIC INFO HANDLERS ====================
  const handleBasicInfoChange = (
    field: keyof NurseProfile,
    value: string | string[]
  ) => {
    setEditedBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBasicInfo = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedProfile = { ...profile, ...editedBasicInfo };
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

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedData = await res.json();
      setProfile(updatedData);
      setEditedBasicInfo({});
      setIsEditingBasicInfo(false);
      alert("Basic information updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBasicInfo = () => {
    setEditedBasicInfo({});
    setIsEditingBasicInfo(false);
  };

  // ==================== VISA & RESIDENCY HANDLERS ====================
  const handleVisaInfoChange = (
    field: keyof NurseProfile,
    value: string | string[]
  ) => {
    setEditedVisaInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVisaInfo = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedProfile = { ...profile, ...editedVisaInfo };
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

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedData = await res.json();
      setProfile(updatedData);
      setEditedVisaInfo({});
      setIsEditingVisaResidency(false);
      alert("Visa & Residency information updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelVisaInfo = () => {
    setEditedVisaInfo({});
    setIsEditingVisaResidency(false);
  };

  // ==================== AHPRA REGISTRATION HANDLERS ====================
  const handleAhpraInfoChange = (
    field: keyof NurseProfile,
    value: string | string[]
  ) => {
    setEditedAhpraInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAhpraInfo = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedProfile = { ...profile, ...editedAhpraInfo };
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

      if (!res.ok) throw new Error("Failed to update AHPRA registration");
      const updatedData = await res.json();
      setProfile(updatedData);
      setEditedAhpraInfo({});
      setIsEditingAhpraReg(false);
      alert("AHPRA registration updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update AHPRA registration");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAhpraInfo = () => {
    setEditedAhpraInfo({});
    setIsEditingAhpraReg(false);
  };

  // ==================== CERTIFICATIONS HANDLERS ====================
  const handleCertInfoChange = (
    field: keyof NurseProfile,
    value: string | string[]
  ) => {
    setEditedCertInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCertInfo = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedProfile = { ...profile, ...editedCertInfo };
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

      if (!res.ok) throw new Error("Failed to update certifications");
      const updatedData = await res.json();
      setProfile(updatedData);
      setEditedCertInfo({});
      setIsEditingCertifications(false);
      alert("Certifications updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update certifications");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelCertInfo = () => {
    setEditedCertInfo({});
    setIsEditingCertifications(false);
  };

  // ==================== WORK PREFERENCES HANDLERS ====================
  const handleWorkPrefChange = (
    field: keyof NurseProfile,
    value: string | string[]
  ) => {
    setEditedWorkPrefInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveWorkPref = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const updatedProfile = { ...profile, ...editedWorkPrefInfo };
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

      if (!res.ok) throw new Error("Failed to update work preferences");
      const updatedData = await res.json();
      setProfile(updatedData);
      setEditedWorkPrefInfo({});
      setIsEditingWorkPreferences(false);
      alert("Work preferences updated successfully!");
    } catch (err: any) {
      console.error("❌ Save Error:", err);
      alert(err.message || "Failed to update work preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelWorkPref = () => {
    setEditedWorkPrefInfo({});
    setIsEditingWorkPreferences(false);
  };

  // ==================== EDUCATION FUNCTIONALITY ====================
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

  const handleDeleteEducation = async (degree_name: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      console.log("🗑️ Deleting education with degree name:", degree_name);

      // Get education ID
      const getIdRes = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/get_education_id",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ degree_name }),
        }
      );

      const getIdData = await getIdRes.json();
      const education_id = getIdData[0]?.id;

      if (!education_id) {
        console.error("❌ Education ID not found for degree:", degree_name);
        alert(
          "Could not find education ID. Make sure the degree name matches exactly."
        );
        return;
      }

      // Delete education
      const deleteRes = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/delete_education",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ education_id }),
        }
      );

      if (!deleteRes.ok) throw new Error("Failed to delete education");

      // Update local state
      setEducationList((prev) =>
        prev.filter((edu) => edu.degree_name !== degree_name)
      );
      alert(`Education "${degree_name}" deleted successfully!`);
    } catch (err: any) {
      console.error("❌ Delete Education Error:", err);
      alert(err.message || "Failed to delete education");
    }
  };

  // ==================== WORK EXPERIENCE FUNCTIONALITY ====================
  const handleAddWorkExperience = async (experience: WorkExperience) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("➕ Adding Work Experience:", experience);

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/add_work_experience",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experience),
        }
      );

      if (!res.ok) throw new Error("Failed to add work experience");
      const newExperience = await res.json();
      console.log("✅ New Work Experience Added:", newExperience);
      return newExperience;
    } catch (err: any) {
      console.error("❌ Add Work Experience Error:", err);
      alert(err.message || "Failed to add work experience");
      throw err;
    }
  };

  const handleEditWorkExperience = async (experience: WorkExperience) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("✏️ Editing Work Experience:", experience);

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/edit_work_experience",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experience),
        }
      );

      if (!res.ok) throw new Error("Failed to edit work experience");
      const updatedExperience = await res.json();
      console.log("✅ Work Experience Updated:", updatedExperience);
      return updatedExperience;
    } catch (err: any) {
      console.error("❌ Edit Work Experience Error:", err);
      alert(err.message || "Failed to edit work experience");
      throw err;
    }
  };

  const handleDeleteWorkExperience = async (experience: WorkExperience) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      console.log("🗑️ Deleting work experience:", experience);

      // Get work experience ID
      const getIdRes = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/get_workExperience_id",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organization_name: experience.organization_name,
            roleTitle: experience.role_title,
          }),
        }
      );

      const getIdData = await getIdRes.json();
      const work_experience_id = getIdData[0]?.id;

      if (!work_experience_id) {
        console.error("❌ Work Experience ID not found:", experience);
        alert(
          "Could not find work experience ID. Make sure organization and role match exactly."
        );
        return;
      }

      // Delete work experience
      const deleteRes = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/work_experience",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ work_experience_id }),
        }
      );

      if (!deleteRes.ok) throw new Error("Failed to delete work experience");

      // Refresh data from server instead of manual filtering
      await fetchWorkExperiences();

      alert(`Work Experience "${experience.role_title}" deleted successfully!`);
    } catch (err: any) {
      console.error("❌ Delete Work Experience Error:", err);
      alert(err.message || "Failed to delete work experience");
    }
  };

  // Loading and error states
  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No profile data found
      </div>
    );
  }

  // Helper function to render arrays
  const renderArray = (value: string[] | string | undefined) =>
    parseValues(value) || [];

  const preferredLocationsArray = renderArray(profile.preferredLocations);
  const jobTypesArray = renderArray(profile.jobTypes);
  const shiftPreferencesArray = renderArray(profile.shiftPreferences);
  const certificationsArray = renderArray(profile.certifications);

  // ==================== RETURN STATEMENT STARTS HERE ====================

  return (
    <div className="min-h-screen bg-[#F5F6FA] ">
      <Navbar />
      <div className="container mx-auto mt-5 ">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h2>
            </div>

            {!isEditingBasicInfo ? (
              <MainButton
                onClick={() => setIsEditingBasicInfo(true)}
                className="group flex items-center gap-2 px-4  text-black rounded-lg transition-all duration-300"
              >
                <span>Edit</span>
              </MainButton>
            ) : (
              <div className="flex gap-2">
                <MainButton
                  onClick={handleCancelBasicInfo}
                  disabled={saving}
                  className="group px-4 py-2 flex items-center justify-center border border-blue-400 rounded-lg text-blue-400 font-medium text-sm transition-all duration-300 overflow-hidden disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="transition-all duration-300 group-hover:-translate-x-1">
                      Cancel
                    </span>
                  </span>
                </MainButton>

                <MainButton
                  onClick={handleSaveBasicInfo}
                  disabled={saving}
                  className="group px-4 py-2 min-w-[80px] flex items-center justify-center border border-blue-400 rounded-lg text-blue-400 font-medium text-sm transition-all duration-300 overflow-hidden disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="transition-all duration-300 group-hover:-translate-x-1">
                      {saving ? "Saving..." : "Save"}
                    </span>
                  </span>
                </MainButton>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="flex flex-col items-center gap-4">
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

              {isEditingBasicInfo && (
                <label className="mt-3 bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Upload/Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleImageEdit(e.target.files[0]);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Full Name
                </label>
                {isEditingBasicInfo ? (
                  <input
                    type="text"
                    value={editedBasicInfo.fullName ?? profile.fullName}
                    onChange={(e) =>
                      handleBasicInfoChange("fullName", e.target.value)
                    }
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
                {isEditingBasicInfo ? (
                  <input
                    type="text"
                    value={editedBasicInfo.phoneNumber ?? profile.phoneNumber}
                    onChange={(e) =>
                      handleBasicInfoChange("phoneNumber", e.target.value)
                    }
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
                {isEditingBasicInfo ? (
                  <input
                    type="text"
                    value={
                      editedBasicInfo.currentResidentialLocation ??
                      profile.currentResidentialLocation
                    }
                    onChange={(e) =>
                      handleBasicInfoChange(
                        "currentResidentialLocation",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.currentResidentialLocation}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Postcode
                </label>
                {isEditingBasicInfo ? (
                  <input
                    type="text"
                    value={editedBasicInfo.postcode ?? profile.postcode}
                    onChange={(e) =>
                      handleBasicInfoChange("postcode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.postcode || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Willing to Relocate
                </label>
                {isEditingBasicInfo ? (
                  <select
                    value={
                      editedBasicInfo.willingToRelocate ??
                      profile.willingToRelocate
                    }
                    onChange={(e) =>
                      handleBasicInfoChange("willingToRelocate", e.target.value)
                    }
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

        {/* Visa & Residency */}
        <CollapsibleSection
          title="Visa & Residency"
          icon={<Shield className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
              {!isEditingVisaResidency ? (
                <MainButton
                  onClick={() => setIsEditingVisaResidency(true)}
                  className="flex items-center gap-2 px-4 text-black rounded-lg  transition-colors"
                >
                  <span>Edit</span>
                </MainButton>
              ) : (
                <div className="flex gap-2">
                  <MainButton onClick={handleCancelVisaInfo} disabled={saving}>
                    <span className="flex items-center gap-2">
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        Cancel
                      </span>
                    </span>
                  </MainButton>

                  <MainButton onClick={handleSaveVisaInfo} disabled={saving}>
                    <span className="flex items-center gap-2">
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        {saving ? "Saving..." : "Save"}
                      </span>
                    </span>
                  </MainButton>
                </div>
              )}
            </div>

            {/* Visa & Residency Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Residency / Visa Status
                </label>

                {isEditingVisaResidency ? (
                  <div className="relative">
                    {editedVisaInfo.isCustomResidency ? (
                      <input
                        type="text"
                        placeholder="Type your residency status"
                        value={editedVisaInfo.residencyStatus || ""}
                        onChange={(e) =>
                          handleVisaInfoChange("residencyStatus", e.target.value)
                        }
                        onBlur={() => {
                          if (!editedVisaInfo.residencyStatus) {
                            setEditedVisaInfo((prev) => ({
                              ...prev,
                              isCustomResidency: false,
                            }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                      />
                    ) : (
                      <select
                        value={editedVisaInfo.residencyStatus ?? profile.residencyStatus}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "Other") {
                            setEditedVisaInfo((prev) => ({
                              ...prev,
                              residencyStatus: "",
                              isCustomResidency: true,
                            }));
                          } else {
                            handleVisaInfoChange("residencyStatus", value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                      >
                        <option value="">Select Residency / Visa Status</option>
                        <option value="Australian Citizen / Permanent Resident">
                          Australian Citizen / Permanent Resident
                        </option>
                        <option value="Temporary Resident">Temporary Resident</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Student Dependent Visa">Student Dependent Visa</option>
                        <option value="Working Holiday Visa">Working Holiday Visa</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {profile.residencyStatus || "Not specified"}
                  </p>
                )}
              </div>



              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Visa Number
                </label>
                {isEditingVisaResidency ? (
                  <input
                    type="text"
                    value={editedVisaInfo.visaType ?? profile.visaType}
                    onChange={(e) =>
                      handleVisaInfoChange("visaType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.visaType || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Visa Expiry
                </label>
                {isEditingVisaResidency ? (
                  <input
                    type="date"
                    value={editedVisaInfo.visaExpiry ?? profile.visaExpiry}
                    onChange={(e) =>
                      handleVisaInfoChange("visaExpiry", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.visaExpiry || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Work Restriction
                </label>
                {isEditingVisaResidency ? (
                  <select
                    value={
                      editedVisaInfo.workHoursRestricted ??
                      profile.workHoursRestricted
                    }
                    onChange={(e) =>
                      handleVisaInfoChange(
                        "workHoursRestricted",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {profile.workHoursRestricted || "Not specified"}
                  </p>
                )}
              </div>

              {((isEditingVisaResidency &&
                editedVisaInfo.workHoursRestricted === "Yes") ||
                (!isEditingVisaResidency &&
                  profile.workHoursRestricted === "Yes")) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Work Restriction Details
                    </label>
                    {isEditingVisaResidency ? (
                      <input
                        type="text"
                        value={
                          editedVisaInfo.maxWorkHours ?? profile.maxWorkHours
                        }
                        onChange={(e) =>
                          handleVisaInfoChange("maxWorkHours", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., 20 hours per week"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.maxWorkHours || "Not specified"}
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>
        </CollapsibleSection>

        {/* AHPRA Registration */}
        <CollapsibleSection
          title="AHPRA Registration"
          icon={<Award className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
              {!isEditingAhpraReg ? (
                <MainButton
                  onClick={() => setIsEditingAhpraReg(true)}
                  className="flex items-center gap-2 px-4 text-black rounded-lg  transition-colors"
                >
                  <span>Edit</span>
                </MainButton>
              ) : (
                <div className="flex gap-2">
                  <MainButton onClick={handleCancelAhpraInfo} disabled={saving}>
                    <span className="flex items-center gap-2">
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        Cancel
                      </span>
                    </span>
                  </MainButton>

                  <MainButton onClick={handleSaveAhpraInfo} disabled={saving}>
                    <span className="flex items-center gap-2">
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        {saving ? "Saving..." : "Save"}
                      </span>
                    </span>
                  </MainButton>
                </div>
              )}
            </div>

            {/* AHPRA Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  AHPRA Registration
                </label>
                {isEditingAhpraReg ? (
                  <select
                    value={
                      editedAhpraInfo.ahpraRegistration ??
                      profile.ahpraRegistration
                    }
                    onChange={(e) =>
                      handleAhpraInfoChange("ahpraRegistration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {profile.ahpraRegistration || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  AHPRA Registration Number
                </label>
                {isEditingAhpraReg ? (
                  <input
                    type="text"
                    value={
                      editedAhpraInfo.registrationNumber ??
                      profile.registrationNumber
                    }
                    onChange={(e) =>
                      handleAhpraInfoChange(
                        "registrationNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter registration number"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.registrationNumber || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Registration Expiry
                </label>
                {isEditingAhpraReg ? (
                  <input
                    type="date"
                    value={
                      editedAhpraInfo.ahprRegistrationExpiry ??
                      profile.ahprRegistrationExpiry
                    }
                    onChange={(e) =>
                      handleAhpraInfoChange(
                        "ahprRegistrationExpiry",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.ahprRegistrationExpiry || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Education */}
        <CollapsibleSection
          title="Education"
          icon={<GraduationCap className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-4">
            {educationList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No education records found.
              </div>
            ) : (
              educationList.map((edu, index) => {
                const isEditingThis = isEditingEducation === index;

                return (
                  <div
                    key={edu.id || index}
                    className="border border-gray-200 rounded-lg p-4 "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Education {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!isEditingThis ? (
                          <>
                            <MainButton
                              onClick={() => setIsEditingEducation(index)}
                            >
                              Edit
                            </MainButton>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${edu.degree_name}" education record?`
                                  )
                                ) {
                                  handleDeleteEducation(edu.degree_name);
                                }
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <MainButton
                              onClick={() => setIsEditingEducation(null)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="transition-all duration-300 group-hover:-translate-x-1">
                                  Cancel
                                </span>
                              </span>
                            </MainButton>
                            <MainButton
                              onClick={async () => {
                                try {
                                  if (edu.id) {
                                    await handleEditEducation(edu);
                                  } else {
                                    await handleAddEducation(edu);
                                  }
                                  setIsEditingEducation(null);
                                  alert("Education saved successfully!");
                                } catch (err) {
                                  console.error("Save failed:", err);
                                }
                              }}
                            >
                              <span className="transition-all duration-300 group-hover:-translate-x-1">
                                Save
                              </span>
                            </MainButton>
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditingThis ? (
                      // Display Mode - Clean text display
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-40">
                            Qualification:
                          </span>
                          <span className="text-sm text-gray-600 font-medium">
                            {edu.degree_name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-40">
                            Institution:
                          </span>
                          <span className="text-sm text-gray-600">
                            {edu.institution_name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-40">
                            From Year:
                          </span>
                          <span className="text-sm text-gray-600">
                            {edu.from_year || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-40">
                            To Year:
                          </span>
                          <span className="text-sm text-gray-600">
                            {edu.to_year || "N/A"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Edit Mode - Box UI with inputs
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Qualification
                          </label>
                          <input
                            type="text"
                            value={edu.degree_name}
                            onChange={(e) => {
                              const newList = [...educationList];
                              newList[index].degree_name = e.target.value;
                              setEducationList(newList);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            From Year
                          </label>
                          <input
                            type="date"
                            value={edu.from_year}
                            onChange={(e) => {
                              const newList = [...educationList];
                              newList[index].from_year = e.target.value;
                              setEducationList(newList);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                          />
                        </div>


                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            To Year
                          </label>
                          <input
                            type="date"
                            value={edu.to_year}
                            onChange={(e) => {
                              const newList = [...educationList];
                              newList[index].to_year = e.target.value;
                              setEducationList(newList);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <MainButton
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
                setIsEditingEducation(educationList.length);
              }}
            >
              <span className="flex items-center gap-2 py-1 px-1">
                {" "}
                <span className="transition-all duration-300 group-hover:-translate-x-1">
                  {" "}
                  Add Education{" "}
                </span>{" "}
              </span>
            </MainButton>
          </div>
        </CollapsibleSection>

        {/* Work Experience */}
        <CollapsibleSection
          title="Work Experience"
          icon={<Briefcase className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-4">
            {workExperienceList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No work experience records found.
              </div>
            ) : (
              workExperienceList.map((exp, index) => {
                const isEditingThis = isEditingWorkExperience === index;

                return (
                  <div
                    key={exp.id || index}
                    className="border border-gray-200 rounded-lg p-4 "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Experience {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!isEditingThis ? (
                          <>
                            <MainButton
                              onClick={() => setIsEditingWorkExperience(index)}
                            >
                              Edit
                            </MainButton>
                            <button
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${exp.role_title}" at "${exp.organization_name}"?`
                                  )
                                ) {
                                  await handleDeleteWorkExperience(exp);
                                }
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <MainButton
                              onClick={() => setIsEditingWorkExperience(null)}
                            >
                              <span className="flex items-center gap-2">
                                {" "}
                                <span className="transition-all duration-300 group-hover:-translate-x-1">
                                  {" "}
                                  Cancel{" "}
                                </span>{" "}
                              </span>
                            </MainButton>
                            <MainButton
                              onClick={async () => {
                                try {
                                  if (exp.id) {
                                    await handleEditWorkExperience(exp);
                                  } else {
                                    await handleAddWorkExperience(exp);
                                  }
                                  await fetchWorkExperiences(); // Refresh list
                                  setIsEditingWorkExperience(null);
                                  alert("Work experience saved successfully!");
                                } catch (err) {
                                  console.error("Save failed:", err);
                                }
                              }}
                            >
                              <span className="transition-all duration-300 group-hover:-translate-x-1">
                                {" "}
                                Save{" "}
                              </span>
                            </MainButton>
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditingThis ? (
                      // Display Mode - Clean text display
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-48">
                            Organization Name:
                          </span>
                          <span className="text-sm text-gray-600 font-medium">
                            {exp.organization_name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-48">
                            Role Title:
                          </span>
                          <span className="text-sm text-gray-600">
                            {exp.role_title || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-48">
                            Total Years of Experience:
                          </span>
                          <span className="text-sm text-gray-600">
                            {exp.total_years_of_experience || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-48">
                            Start Date:
                          </span>
                          <span className="text-sm text-gray-600">
                            {exp.start_date || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-48">
                            End Date:
                          </span>
                          <span className="text-sm text-gray-600">
                            {exp.end_date || "N/A"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Edit Mode - Box UI with inputs
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Total Years of Experience
                          </label>
                          <input
                            type="text"
                            value={exp.total_years_of_experience}
                            onChange={(e) => {
                              const newList = [...workExperienceList];
                              newList[index].total_years_of_experience =
                                e.target.value;
                              setWorkExperienceList(newList);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <MainButton
              onClick={() => {
                setWorkExperienceList([
                  ...workExperienceList,
                  {
                    organization_name: "",
                    role_title: "",
                    total_years_of_experience: "",
                    start_date: "",
                    end_date: "",
                  },
                ]);
                setIsEditingWorkExperience(workExperienceList.length);
              }}
            >
              <span className="flex items-center gap-2 py-1 px-1">
                {" "}
                <span className="transition-all duration-300 group-hover:-translate-x-1">
                  {" "}
                  Add Experience{" "}
                </span>{" "}
              </span>
            </MainButton>
          </div>
        </CollapsibleSection>

        {/* Certifications */}
        <CollapsibleSection
          title="Certifications"
          icon={<Award className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-4">
            {/* Edit Button */}
            <div className="flex justify-end">
              {!isEditingCertifications ? (
                <button
                  onClick={() => setIsEditingCertifications(true)}
                  className="relative group flex items-center justify-center px-4 py-1 min-w-[80px] border border-blue-400 rounded-lg overflow-hidden transition-colors duration-300 text-blue-400 hover:text-blue-400"
                >
                  {/* Button text */}
                  <span className="relative z-10 transition-all duration-300 group-hover:-translate-x-2">
                    Edit
                  </span>

                  {/* Arrow overlay */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-blue-400 group-hover:text-blue-400">
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <MainButton
                    onClick={handleCancelCertInfo}
                    disabled={saving}
                  >
                    <span className="flex items-center gap-2 ">
                      {" "}
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        {" "}
                        Cancel{" "}
                      </span>{" "}
                    </span>
                  </MainButton>
                  <MainButton
                    onClick={handleSaveCertInfo}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </MainButton>
                </div>
              )}
            </div>

            {/* Certification Selection */}
            {isEditingCertifications && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add Certification
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      // Get current certifications from editedCertInfo or profile
                      const currentCerts = editedCertInfo.certifications
                        ? Array.isArray(editedCertInfo.certifications)
                          ? editedCertInfo.certifications
                          : parseValues(editedCertInfo.certifications)
                        : certificationsArray;

                      // Check if certification already exists
                      if (!currentCerts.includes(value)) {
                        const updatedCerts = [...currentCerts, value];
                        handleCertInfoChange("certifications", updatedCerts);
                      }

                      // Reset select value
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a certification</option>
                  <option value="AHPRA Registration">AHPRA Registration</option>
                  <option value="Police Check Certificate">
                    Police Check Certificate
                  </option>
                  <option value="Working with Children Check">
                    Working with Children Check
                  </option>
                  <option value="First Aid/CPR">First Aid/CPR</option>
                  <option value="Manual Handling">Manual Handling</option>
                  <option value="Vaccination / Immunisation">
                    Vaccination / Immunisation
                  </option>
                  <option value="NDIS Worker Screening">
                    NDIS Worker Screening
                  </option>
                  <option value=" Certificate lll in Individual Support">
                    Certificate lll in Individual Support
                  </option>
                  <option value=" Certificate lV in Individual Support">
                    Certificate lV in Individual Support
                  </option>
                </select>
              </div>
            )}

            {/* Display Selected Certifications */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {isEditingCertifications
                  ? "Selected Certifications"
                  : "Certifications"}
              </label>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // Get the current certification list based on edit state
                  const currentCerts =
                    isEditingCertifications && editedCertInfo.certifications
                      ? Array.isArray(editedCertInfo.certifications)
                        ? editedCertInfo.certifications
                        : parseValues(editedCertInfo.certifications)
                      : certificationsArray;

                  return currentCerts && currentCerts.length > 0 ? (
                    currentCerts.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"

                      >

                        <span>{cert}</span>

                        {isEditingCertifications && (
                          <button
                            type="button"
                            onClick={() => {
                              const newCerts = currentCerts.filter((item) => item !== cert);
                              handleCertInfoChange("certifications", newCerts);
                            }}
                            className="text-blue-400 hover:text-blue-600 transition-colors ml-1"
                            aria-label={`Remove ${cert}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic py-2">
                      {isEditingCertifications
                        ? "No certifications added yet. Select from dropdown above."
                        : "No certifications specified"}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Work Preferences */}
        <CollapsibleSection
          title="Work Preferences"
          icon={<Clock className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-6">
            {/* Edit Button */}
            <div className="flex justify-end">
              {!isEditingWorkPreferences ? (
                <MainButton onClick={() => setIsEditingWorkPreferences(true)}>
                  <span>Edit</span>
                </MainButton>
              ) : (
                <div className="flex gap-2">
                  <MainButton onClick={handleCancelWorkPref} disabled={saving}>
                    <span className="flex items-center gap-2">
                      {" "}
                      <span className="transition-all duration-300 group-hover:-translate-x-1">
                        {" "}
                        Cancel{" "}
                      </span>{" "}
                    </span>
                  </MainButton>
                  <MainButton onClick={handleSaveWorkPref} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </MainButton>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Job Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {isEditingWorkPreferences
                    ? "Add Preferred Job Type"
                    : "Preferred Job Type"}
                </label>

                {isEditingWorkPreferences && (
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const currentJobTypes = editedWorkPrefInfo.jobTypes
                          ? Array.isArray(editedWorkPrefInfo.jobTypes)
                            ? editedWorkPrefInfo.jobTypes
                            : parseValues(editedWorkPrefInfo.jobTypes)
                          : jobTypesArray;

                        if (!currentJobTypes.includes(value)) {
                          handleWorkPrefChange("jobTypes", [
                            ...currentJobTypes,
                            value,
                          ]);
                        }
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select job type</option>
                    <option value="Full time">Full time</option>
                    <option value="Part time">Part time</option>
                    <option value="Casual">Casual</option>
                    <option value="Temporary Contract">Temporary Contract</option>
                    <option value="Open to any">Open to any</option>
                  </select>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {(() => {
                    const currentJobTypes =
                      isEditingWorkPreferences && editedWorkPrefInfo.jobTypes
                        ? Array.isArray(editedWorkPrefInfo.jobTypes)
                          ? editedWorkPrefInfo.jobTypes
                          : parseValues(editedWorkPrefInfo.jobTypes)
                        : jobTypesArray;

                    return currentJobTypes && currentJobTypes.length > 0 ? (
                      currentJobTypes.map((type, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"


                        >

                          <span>{type}</span>

                          {isEditingWorkPreferences && (
                            <button
                              onClick={() => {
                                const newTypes = currentJobTypes.filter((item) => item !== type);
                                handleWorkPrefChange("jobTypes", newTypes);
                              }}
                              className="text-blue-500 transition-colors ml-1"
                              aria-label={`Remove ${type}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic py-2">
                        {isEditingWorkPreferences
                          ? "No job types added yet. Select at least one."
                          : "No job types specified"}
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Open to Other Job Types */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Open to Other Job Types
                </label>
                {isEditingWorkPreferences ? (
                  <select
                    value={
                      editedWorkPrefInfo.openToOtherTypes ??
                      profile.openToOtherTypes ??
                      ""
                    }
                    onChange={(e) =>
                      handleWorkPrefChange("openToOtherTypes", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <p className="flex items-center w-fit gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200">
                    {profile.openToOtherTypes || "Not specified"}
                  </p>
                )}
              </div>

              {/* Preferred Shift */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {isEditingWorkPreferences
                    ? "Add Preferred Shift"
                    : "Preferred Shift"}
                </label>

                {isEditingWorkPreferences && (
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const currentShifts =
                          editedWorkPrefInfo.shiftPreferences
                            ? Array.isArray(editedWorkPrefInfo.shiftPreferences)
                              ? editedWorkPrefInfo.shiftPreferences
                              : parseValues(editedWorkPrefInfo.shiftPreferences)
                            : shiftPreferencesArray;

                        if (!currentShifts.includes(value)) {
                          handleWorkPrefChange("shiftPreferences", [
                            ...currentShifts,
                            value,
                          ]);
                        }
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select shift preference</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {(() => {
                    const currentShifts =
                      isEditingWorkPreferences &&
                        editedWorkPrefInfo.shiftPreferences
                        ? Array.isArray(editedWorkPrefInfo.shiftPreferences)
                          ? editedWorkPrefInfo.shiftPreferences
                          : parseValues(editedWorkPrefInfo.shiftPreferences)
                        : shiftPreferencesArray;

                    return currentShifts && currentShifts.length > 0 ? (
                      currentShifts.map((shift, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"


                        >
                          <span>{shift}</span>
                          {isEditingWorkPreferences && (
                            <button
                              onClick={() => {
                                const newShifts = currentShifts.filter(
                                  (item) => item !== shift
                                );
                                handleWorkPrefChange(
                                  "shiftPreferences",
                                  newShifts
                                );
                              }}
                              className="text-blue-400  transition-colors ml-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic py-2">
                        {isEditingWorkPreferences
                          ? "No shift preferences added yet. Select at least one."
                          : "No shift preferences specified"}
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {isEditingWorkPreferences
                    ? "Add Preferred Location"
                    : "Preferred Locations"}
                </label>

                {isEditingWorkPreferences && (
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const currentLocations =
                          editedWorkPrefInfo.preferredLocations
                            ? Array.isArray(
                              editedWorkPrefInfo.preferredLocations
                            )
                              ? editedWorkPrefInfo.preferredLocations
                              : parseValues(
                                editedWorkPrefInfo.preferredLocations
                              )
                            : preferredLocationsArray;

                        if (!currentLocations.includes(value)) {
                          handleWorkPrefChange("preferredLocations", [
                            ...currentLocations,
                            value,
                          ]);
                        }
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select location</option>
                    <option value="New South Wales (NSW)"> New South Wales (NSW)</option>
                    <option value="Victoria (VIC)">Victoria (VIC)</option>
                    <option value="Queensland (QLD)">Queensland (QLD)</option>
                    <option value="Western Australia (WA)">Western Australia (WA)</option>
                    <option value="South Australia (SA)">South Australia (SA)</option>
                    <option value="Tasmania (TAS)">Tasmania (TAS)</option>
                    <option value="Australian Capital Territory (ACT)">Australian Capital Territory (ACT)</option>
                    <option value="Northern Territory (NT)">Northern Territory (NT)</option>
                  </select>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {(() => {
                    const currentLocations =
                      isEditingWorkPreferences &&
                        editedWorkPrefInfo.preferredLocations
                        ? Array.isArray(editedWorkPrefInfo.preferredLocations)
                          ? editedWorkPrefInfo.preferredLocations
                          : parseValues(editedWorkPrefInfo.preferredLocations)
                        : preferredLocationsArray;

                    return currentLocations && currentLocations.length > 0 ? (
                      currentLocations.map((location, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"


                        >
                          <span>{location}</span>

                          {isEditingWorkPreferences && (
                            <button
                              onClick={() => {
                                const newLocations = currentLocations.filter(
                                  (item) => item !== location
                                );
                                handleWorkPrefChange(
                                  "preferredLocations",
                                  newLocations
                                );
                              }}
                              className="text-blue-400  transition-colors ml-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic py-2">
                        {isEditingWorkPreferences
                          ? "No locations added yet. Select at least one."
                          : "No locations specified"}
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Available to Start */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available to Start
                </label>

                {isEditingWorkPreferences ? (
                  <div className="relative">
                    {/* Dropdown */}
                    <select
                      value={
                        editedWorkPrefInfo.startTime ?? profile.startTime ?? ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Pick a date") {
                          // trigger date mode
                          handleWorkPrefChange("startTime", "");
                          setEditedWorkPrefInfo((prev) => ({
                            ...prev,
                            isCustomDate: true,
                          }));
                        } else {
                          setEditedWorkPrefInfo((prev) => ({
                            ...prev,
                            isCustomDate: false,
                          }));
                          handleWorkPrefChange("startTime", value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select availability</option>
                      <option value="Immediately">Immediately</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Pick a date">Pick a specific date</option>
                    </select>

                    {/* Date picker (only shows when “Pick a date” is selected) */}
                    {editedWorkPrefInfo.isCustomDate && (
                      <input
                        type="date"
                        value={editedWorkPrefInfo.startTime || ""}
                        onChange={(e) => handleWorkPrefChange("startTime", e.target.value)}
                        className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <p className="flex w-fit items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"
                  >
                    {profile.startTime || profile.startDate || "Not specified"}
                  </p>
                )}
              </div>


            </div>
          </div>
        </CollapsibleSection>
      </div>


      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
