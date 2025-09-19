"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  Heart,
  User,
  UserRoundSearch,
  Award,
  Briefcase,
  Clock,
  Shield,
} from "lucide-react";
import Loader from "../../../../../components/loading";

interface ProfileImage {
  access?: string;
  path?: string;
  name?: string;
  type?: string;
}

interface CandidateDetail {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  currentResidentialLocation?: string;
  jobSearchStatus?: string;
  qualification?: string;
  residencyStatus?: string;
  jobTypes?: string;
  certifications?: string[];
  specializations?: string[];
  experience?: string;
  locationPreference?: string;
  preferredLocations?: string[];
  shiftPreferences?: string[];
  openToOtherTypes?: string;
  maxWorkHours?: string;
  startTime?: string;
  visaType?: string;
  visaDuration?: string,
  workHoursRestricted?: string;
  workingInHealthcare?: string;
  otherQualification?: string;
  profileImage?: ProfileImage | null;
  organizationName?: string;
  organizationStartYear?: string;
}

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

  // Wishlist state
  const [wishlisted, setWishlisted] = useState(false);

  // Load employerId from localStorage
  useEffect(() => {
    if (!employerId && typeof window !== "undefined") {
      const storedEmployerId = localStorage.getItem("employerId");
      if (storedEmployerId) setEmployerId(Number(storedEmployerId));
    }
  }, [employerId]);

  // Load wishlist state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const stored = localStorage.getItem(`wishlist-${id}`);
      setWishlisted(stored === "true");
    }
  }, [id]);

  // Check if this candidate is already in wishlist
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!nurseId || !employerId) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:P9j60cGD/wishlist?employer_profiles_id=${employerId}&nurse_profiles_id=${nurseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch wishlist status:", text);
          return;
        }

        const data = await res.json();

        if (data.length > 0) {
          setWishlisted(true);
        } else {
          setWishlisted(false);
        }
      } catch (err) {
        console.error("Error fetching wishlist status:", err);
      }
    };

    fetchWishlistStatus();
  }, [nurseId, employerId]);


  const handleWishlistToggle = async () => {
    if (!nurseId || !employerId) return;

    const token = localStorage.getItem("authToken");
    if (!token) return alert("Unauthorized: Please log in");

    try {
      if (!wishlisted) {
        // Add to wishlist
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:P9j60cGD/wishlist",
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
        // First, get the wishlist ID for this combination
        const fetchRes = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:P9j60cGD/wishlist?employer_profiles_id=${employerId}&nurse_profiles_id=${nurseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!fetchRes.ok) {
          const text = await fetchRes.text();
          console.error("Failed to fetch wishlist:", text);
          return alert("Failed to remove from wishlist");
        }

        const data = await fetchRes.json();

        if (data.length === 0) return; // Nothing to delete

        const wishlistId = data[0].id;

        const deleteRes = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:P9j60cGD/wishlist/${wishlistId}`,
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

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:MeLrTB-C/nurse_profiles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          setError(
            `Failed to fetch candidate details: ${res.status} ${res.statusText}. ${errorText}`
          );
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

  // Check connection
  const checkConnection = useCallback(async () => {
    if (!id || !employerId) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const connRes = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/sendStatus?employer_profiles_id=${employerId}&nurse_profiles_id=${id}`,
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

  // Send connection
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
        `https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/sendConnection`,
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <Loader loading={true} message="Loading Profiles...." />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error}
      </div>
    );

  if (!candidate)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Candidate not found.
      </div>
    );

  const parseJsonArray = (str?: string) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  const preferredLocationsArray = candidate.preferredLocations ?? [];
  const certificationsArray = candidate.certifications ?? [];
  const jobTypesArray = parseJsonArray(candidate.jobTypes);

  const profileImageUrl = candidate.profileImage?.path
    ? `https://x8ki-letl-twmt.n7.xano.io${candidate.profileImage.path}`
    : null;

  return (
    <div className="min-h-screen bg-[#F5F6FA]  p-4  ">
      {/* ================= Top Profile Section ================= */}
      <div className=" mx-auto bg-white rounded-xl shadow-sm p-8 mb-8 relative container" >
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-6 right-6 p-2 rounded-full shadow-md transition-all duration-200
          ${wishlisted ? "bg-blue-600 animate-heart-pop" : "bg-white hover:animate-heart-hover"}`}
        >
          <Heart
            className={`w-6 h-6 transition-colors duration-200 ${wishlisted ? "text-white" : "text-blue-600"
              }`}
          />
        </button>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Profile Image */}
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex-shrink-0">
            {profileImageUrl ? (
              <Image
                priority
                src={profileImageUrl}
                alt={candidate.fullName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                {candidate.fullName?.charAt(0) || "N"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{candidate.fullName}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4 text-blue-700" />
              Profile last updated: {new Date().toLocaleDateString()}
            </div>

            {/* Connection Buttons */}
            {connectionStatus === "pending" && (
              <button
                disabled
                className="mt-3 px-6 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
              >
                Request Sent
              </button>
            )}

            {connectionStatus === "accepted" && (
              <div className="flex items-center gap-3 mt-3">
                <button disabled className="px-6 py-2 bg-green-600 text-white rounded-lg">
                  Connected
                </button>
                <div className="px-6 py-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                  Connected
                </div>
              </div>
            )}

            {(connectionStatus === "rejected" || connectionStatus === "none") && (
              <button
                onClick={handleSendConnection}
                disabled={sendingConnection}
                className="mt-3 px-6 py-1 rounded-[14px] bg-[#FFFDFD] hover:bg-[#0073FF] hover:text-white text-[#0073FF] border border-blue-400 font-regular"
              >
                {sendingConnection ? "Sending..." : "Connect With Candidate"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= Basic Info & Visa Section ================= */}
      <div className="lg:col-span-1 flex flex-col lg:flex-row justify-between gap-4 mx-4 mx-auto container">
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
                {candidate.currentResidentialLocation || "Location not specified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Job Role</h3>
              <p className="text-gray-900">
                {candidate.jobSearchStatus || " Not specified"}
              </p>
            </div>
            {candidate.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{candidate.email}</p>
              </div>
            )}
            {candidate.startTime && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Availability</h3>
                <p className="text-gray-900">{candidate.startTime}</p>
              </div>
            )}
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
                {candidate.residencyStatus || "Australian Citizen / Permanent Resident"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visa Type</h3>
              <p className="text-gray-900">
                {candidate.visaType || "Not Speciified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              {candidate.visaDuration || "Not Speciified"}

            </div>
          </div>
        </div>
      </div>

      {/* ================= Job Search Preferences ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-5 mx-4 mx-auto container">
        <div className="flex items-center space-x-2 mb-6">
          <UserRoundSearch className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Job search preferences</h2>
        </div>
        <div className="flex justify-between gap-6">
          {/* Preferred Work Locations */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Work Locations</h3>
            <div className="flex flex-wrap gap-2">
              {preferredLocationsArray.length > 0 ? (
                preferredLocationsArray.map((loc, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50  rounded-lg text-sm font-medium"
                  >
                    {loc}
                  </span>
                ))
              ) : candidate.currentResidentialLocation ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {candidate.currentResidentialLocation}
                </span>
              ) : (
                <span className="text-gray-400 text-sm italic">
                  No preferred locations specified
                </span>
              )}
            </div>
          </div>

          {/* Preferred Job Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Job Types</h3>
            <div className="flex flex-wrap gap-2">
              {jobTypesArray.length > 0 ? (
                jobTypesArray.map((type: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Not Specified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Open To Other Types & Preferred Shift */}
        <div className="flex justify-between gap-6">
          {/* Open To Other Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Open To Other Types</h3>
            <div>
              {candidate.openToOtherTypes ? (
                <span className="px-3 py-1  border border-gray-300 rounded-lg text-sm font-medium">
                  {candidate.openToOtherTypes}
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Not Specified
                </span>
              )}
            </div>
          </div>

          {/* Preferred Shift */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Shift</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.shiftPreferences && candidate.shiftPreferences.length > 0 ? (
                candidate.shiftPreferences.map((shift, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 border border-gray-300  rounded-lg text-sm font-medium"
                  >
                    {shift}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Not Specified
                </span>
              )}
            </div>
          </div>
        </div>


        {/* Availability */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-blue-700 mr-2" />
          Available To Start: <span className="ml-1">{candidate.startTime || "2025-09-15"}</span>
        </div>
      </div>

      {/* ================= Qualifications & Certificates ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mt-5 mx-auto container">
        <div className="flex items-center space-x-2 mb-6">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Qualifications & Certificates</h2>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Education</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-800">
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
              {candidate.qualification || "Bachelor of Nursing"}
            </div>
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
            <p className="text-gray-400 text-sm italic">No certifications specified</p>
          )}
        </div>
      </div>

      {/* ================= Work Experience & Preferences ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 mt-5 mx-auto container">
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
                {candidate.experience || "No experience specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Currently working in healthcare</p>
              <p className="font-medium text-gray-900">
                {candidate.workingInHealthcare || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Organization Name</p>
              <p className="font-medium text-gray-900">
                {candidate.organizationName
                  ? `${candidate.organizationName} (since ${candidate.organizationStartYear || "N/A"})`
                  : "Not specified"}
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
              <p className="font-medium text-gray-900">{candidate.maxWorkHours || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Work hours restricted</p>
              <p className="font-medium text-gray-900">
                {candidate.workHoursRestricted ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}