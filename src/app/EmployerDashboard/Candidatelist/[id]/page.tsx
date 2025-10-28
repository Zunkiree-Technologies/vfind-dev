"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  User,
  Award,
  Briefcase,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Loader from "../../../../../components/loading";
import EmployerNavbar from "../../components/EmployerNavbar";
import MainButton from "@/components/ui/MainButton";
import Footer from "@/app/Admin/components/layout/Footer";

interface ProfileImage {
  url?: string;
  access?: string;
  path?: string;
  name?: string;
  type?: string;
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

interface CandidateDetail {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  currentResidentialLocation?: string;
  postcode?: string;
  willingToRelocate?: string;
  jobSearchStatus?: string;
  qualification?: string;
  otherQualification?: string;
  experience?: string;
  workingInHealthcare?: string;
  residencyStatus?: string;
  visaType?: string;
  visaDuration?: string;
  visaExpiry?: string;
  maxWorkHours?: string;
  workHoursRestricted?: string;
  ahpraRegistration?: string;
  registrationNumber?: string;
  ahprRegistrationExpiry?: string;
  jobTypes?: string;
  openToOtherTypes?: string;
  shiftPreferences?: string[];
  preferredLocations?: string[];
  startTime?: string;
  startDate?: string;
  certifications?: string[];
  licenses?: string[];
  profileImage?: ProfileImage | null;
  education?: Education[];
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

export default function CandidateDetailPage() {
  const params = useParams() as { id?: string };
  const id = params.id;

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingConnection, setSendingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "accepted" | "rejected"
  >("none");

  const [nurseId, setNurseId] = useState<number | null>(null);
  const [employerId, setEmployerId] = useState<number | null>(null);
  const [wishlisted, setWishlisted] = useState(false);

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([]);

  // Load employerId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmployerId = localStorage.getItem("employerId");
      if (storedEmployerId) setEmployerId(Number(storedEmployerId));
    }
  }, []);

  // Fetch candidate details
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          setError("Candidate ID is missing.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        // Fetch nurse profile
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/nurse_profiles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          setError(`Failed to fetch candidate details: ${res.status} ${res.statusText}. ${errorText}`);
          setLoading(false);
          return;
        }

        const data: CandidateDetail = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setError("Candidate not found.");
          setCandidate(null);
        } else {
          setCandidate(data);
          setNurseId(data.id);

          // Fetch education and work experience in parallel
          const [eduRes, workRes] = await Promise.all([
            fetch(
              `https://x76o-gnx4-xrav.a2.xano.io/api:31adG1Q0/get_education`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ nurse_profiles_id: id }),
              }
            ),
            fetch(
              `https://x76o-gnx4-xrav.a2.xano.io/api:wAG4ZQ6V/get_workExperience`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ nurse_profiles_id: id }),
              }
            ),
          ]);

          // Handle education data
          if (eduRes.ok) {
            const eduData = await eduRes.json();
            setEducationList(eduData || []);
          }

          // Handle work experience data
          if (workRes.ok) {
            const workData = await workRes.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped = workData.map((exp: any) => ({
              id: exp.id,
              organization_name: exp.organizationName || exp.organization_name || "",
              role_title: exp.roleTitle || exp.role_title || "",
              total_years_of_experience:
                exp.totalYearsOfExperience || exp.total_years_of_experience || "",
              start_date: exp.startDate || exp.start_date || "",
              end_date: exp.endDate || exp.end_date || "",
            }));
            setWorkExperienceList(mapped);
          }
        }
      } catch (err: unknown) {
        console.error("Error fetching candidate details:", err);
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!id || !employerId) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/fetch_wishlist_status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nurse_profiles_id: id,
            }),
          }
        );

        const data = await res.json();
        if (data[0] && typeof data[0].status === "string" && data[0].status === "saved") {
          setWishlisted(true);
        } else {
          setWishlisted(false);
        }
      } catch (err) {
        console.error("Error fetching wishlist status:", err);
      }
    };

    fetchWishlistStatus();
  }, [id, employerId]);

  // Check connection status
  const checkConnection = useCallback(async () => {
    if (!id || !employerId) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const connRes = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/sendStatus?employer_profiles_id=${employerId}&nurse_profiles_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (connRes.ok) {
        const connData = await connRes.json();
        if (connData.length > 0) {
          setConnectionStatus(connData[0].status);
        } else {
          setConnectionStatus("none");
        }
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  }, [id, employerId]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!nurseId || !employerId) return;

    const token = localStorage.getItem("authToken");
    if (!token) return alert("Unauthorized: Please log in");

    try {
      if (!wishlisted) {
        // Add to wishlist
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nurse_profiles_id: nurseId,
              employer_profiles_id: employerId,
            }),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to add wishlist:", text);
          return alert("Failed to add to wishlist");
        }

        setWishlisted(true);
      } else {
        // Remove from wishlist
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/fetch_wishlist_id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nurse_profiles_id: id,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to get wishlist ID");
        const data = await res.json();
        const wishlistId = data[0].id;
        if (!wishlistId) throw new Error("Wishlist ID not found");

        const deleteRes = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/wishlist/${wishlistId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!deleteRes.ok) {
          const text = await deleteRes.text();
          console.error("Failed to remove wishlist:", text);
          return alert("Failed to remove from wishlist");
        }

        setWishlisted(false);
      }
    } catch (err) {
      console.error("Error handling wishlist:", err);
      alert("An error occurred while updating wishlist");
    }
  };

  // Handle send connection
  const handleSendConnection = async () => {
    if (connectionStatus !== "none" || !nurseId || !employerId) return;

    const confirmSend = window.confirm(
      "Are you sure you want to connect with this candidate? They will be notified of your request..."
    );
    if (!confirmSend) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized: Please log in");

      setSendingConnection(true);

      const res = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/sendConnection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nurse_profiles_id: nurseId,
            employer_profiles_id: employerId,
            status: "pending",
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to send connection:", text);
        return alert(`Failed to send connection: ${text}`);
      }

      setConnectionStatus("pending");
    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("Error sending connection request.");
    } finally {
      setSendingConnection(false);
    }
  };

  // Helper function to parse arrays
  const parseValues = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Loading and error states
  if (loading) return <Loader loading={true} message="Loading Profile...." />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Candidate not found.
      </div>
    );
  }

  // Helper arrays
  const preferredLocationsArray = parseValues(candidate.preferredLocations);
  const jobTypesArray = parseValues(candidate.jobTypes);
  const shiftPreferencesArray = parseValues(candidate.shiftPreferences);
  const certificationsArray = parseValues(candidate.certifications);

  // Profile image URL
  const profileImageUrl = candidate.profileImage?.url ||
    (candidate.profileImage?.path ? `https://x76o-gnx4-xrav.a2.xano.io${candidate.profileImage.path}` : null);

  // ==================== RETURN STATEMENT STARTS HERE ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - sticky */}
      <div className="sticky top-0 z-50">
        <EmployerNavbar />
      </div>
      <div className="container mx-auto mt-23">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          {/* Section Header with Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h2>
            </div>

            {/* Connection & Wishlist Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Connection Buttons */}
              {connectionStatus === "pending" && (
                <button
                  disabled
                  className="px-4 py-1 rounded-lg  text-blue-400 border border-blue-400"
                >
                  Request Pending
                </button>
              )}

              {connectionStatus === "accepted" && (
                <button
                  disabled
                  className="px-4 py-1 rounded-lg  text-green-400 border border-green-400"
                >
                  Connected
                </button>
              )}

              {(connectionStatus === "rejected" || connectionStatus === "none") && (
                <MainButton
                  onClick={handleSendConnection}
                  disabled={sendingConnection}
                >
                  {sendingConnection ? "Sending..." : "Connect With Candidate"}
                </MainButton>
              )}

              {/* Wishlist Button */}
              <MainButton
                onClick={handleWishlistToggle}
                disabled={!nurseId || !employerId}
                className={`${wishlisted
                  ? " text-blue-400 border-[#0073FF]"
                  : "bg-white hover:text-blue-400 text-blue-400  border-blue-400"
                  }`}
              >
                {wishlisted ? "UnSave" : "Save Candidate"}
              </MainButton>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                {profileImageUrl ? (
                  <Image
                    priority
                    src={profileImageUrl}
                    alt={candidate.fullName}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold">
                    {candidate.fullName?.charAt(0) || "N"}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
              {[
                { label: "Full Name", value: candidate.fullName },
                { label: "Email", value: candidate.email || "Not specified" },
                { label: "Phone Number", value: candidate.phoneNumber || "Not specified" },
                { label: "Current Location", value: candidate.currentResidentialLocation || "Not specified" },
                { label: "Postcode", value: candidate.postcode || "Not specified" },
                { label: "Willing to Relocate", value: candidate.willingToRelocate || "Not specified" },
              ].map((item, index) => (
                <div key={index}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {item.label}
                  </label>
                  <p className="text-gray-900 break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Visa & Residency */}
        <CollapsibleSection
          title="Visa & Residency"
          icon={<Shield className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Residency / Visa Status
                </label>
                <p className="text-gray-900">
                  {candidate.residencyStatus || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Visa Type
                </label>
                <p className="text-gray-900">
                  {candidate.visaType || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Visa Expiry
                </label>
                <p className="text-gray-900">
                  {candidate.visaExpiry || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Work Restriction
                </label>
                <p className="text-gray-900">
                  {candidate.workHoursRestricted || "Not specified"}
                </p>
              </div>

              {candidate.workHoursRestricted === "Yes" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Work Restriction Details
                  </label>
                  <p className="text-gray-900">
                    {candidate.maxWorkHours || "Not specified"}
                  </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  AHPRA Registration
                </label>
                <p className="text-gray-900">
                  {candidate.ahpraRegistration || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  AHPRA Registration Number
                </label>
                <p className="text-gray-900">
                  {candidate.registrationNumber || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Registration Expiry
                </label>
                <p className="text-gray-900">
                  {candidate.ahprRegistrationExpiry || "Not specified"}
                </p>
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
              educationList.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Education {index + 1}
                    </h3>
                  </div>

                  {/* Display Mode - Clean text display */}
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
                </div>
              ))
            )}
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
              workExperienceList.map((exp, index) => (
                <div
                  key={exp.id || index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Experience {index + 1}
                    </h3>
                  </div>

                  {/* Display Mode - Clean text display */}
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
                </div>
              ))
            )}
          </div>
        </CollapsibleSection>

        {/* Certifications */}
        <CollapsibleSection
          title="Certifications"
          icon={<Award className="w-6 h-6 text-blue-400" />}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {certificationsArray && certificationsArray.length > 0 ? (
                  certificationsArray.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"
                    >
                      <span>{cert}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic py-2">
                    No certifications specified
                  </p>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Job Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobTypesArray && jobTypesArray.length > 0 ? (
                    jobTypesArray.map((type, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"
                      >
                        <span>{type}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic py-2">
                      No job types specified
                    </p>
                  )}
                </div>
              </div>

              {/* Open to Other Job Types */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Open to Other Job Types
                </label>
                <p className="flex items-center w-fit gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200">

                  {candidate.openToOtherTypes || "Not specified"}
                </p>
              </div>

              {/* Preferred Shift */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Shift
                </label>
                <div className="flex flex-wrap gap-2">
                  {shiftPreferencesArray && shiftPreferencesArray.length > 0 ? (
                    shiftPreferencesArray.map((shift, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"
                      >
                        <span>{shift}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic py-2">
                      No shift preferences specified
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Locations
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferredLocationsArray && preferredLocationsArray.length > 0 ? (
                    preferredLocationsArray.map((location, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200"
                      >
                        <span>{location}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic py-2">
                      No locations specified
                    </p>
                  )}
                </div>
              </div>

              {/* Available to Start */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available to Start
                </label>
                <p className="flex items-center w-fit gap-2 px-3 py-2 bg-gray-50 text-black rounded-lg text-sm font-medium border border-gray-200">

                  {candidate.startTime || candidate.startDate || "Not specified"}
                </p>
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