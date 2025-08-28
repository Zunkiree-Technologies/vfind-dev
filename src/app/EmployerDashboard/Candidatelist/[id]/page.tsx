"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  Info,
  HelpCircle,
  ArrowLeft,
  FileText,
  Lock,
  Heart,
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
  openToOtherTypes?: string;
  maxWorkHours?: string;
  startTime?: string;
  visaType?: string;
  workHoursRestricted?: string;
  workingInHealthcare?: string;
  otherQualification?: string;
  profileImage?: ProfileImage | null;
}

export default function CandidateDetailPage() {
  const params = useParams() as { id?: string };
  const id = params.id;
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Top Row: Profile Info */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8 relative">
        {/* Wishlist Button Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-6 right-6 p-2 rounded-full shadow-md transition-all duration-200 ${wishlisted ? "bg-blue-600" : "bg-white"
            }`}
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
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.fullName}
            </h1>
            <p className="text-gray-500 text-sm">
              Profile last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-700" />
                {candidate.currentResidentialLocation ||
                  "Location not specified"}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                {candidate.qualification || "Bachelor of Nursing"}
              </div>
              {candidate.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-700" />
                  {candidate.phoneNumber}
                </div>
              )}
              {candidate.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-700" />
                  {candidate.email}
                </div>
              )}
              {candidate.startTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  Available: {candidate.startTime}
                </div>
              )}
            </div>

            {/* Connection Button Logic */}
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
                <button
                  disabled
                  className="px-6 py-2 bg-green-600 text-white rounded-lg"
                >
                  Connected
                </button>
                <div className="px-6 py-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                  💬 Message
                </div>
              </div>
            )}
            {connectionStatus === "rejected" || connectionStatus === "none" ? (
              <button
                onClick={handleSendConnection}
                disabled={sendingConnection}
                className="mt-3 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
              >
                {sendingConnection ? "Sending..." : "Connect with candidate"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 2-Column Grid Below Header */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick links</h3>
            <div className="space-y-3">
              <button className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 text-sm w-full text-left">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                <span>Need support?</span>
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 text-sm w-full text-left"
              >
                <ArrowLeft className="w-4 h-4 text-blue-700" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Data management</h3>
            <div className="space-y-3">
              <button className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 text-sm w-full text-left">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>View Terms of Use</span>
              </button>
              <button className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 text-sm w-full text-left">
                <Lock className="w-4 h-4 text-blue-700" />
                <span>View Privacy Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Job Search Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Job search preferences
              </h2>
              <Info className="w-4 h-4 text-blue-700" />
            </div>

            {/* Preferred Locations */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">
                Preferred work locations
              </h3>
              <div className="space-y-2">
                {preferredLocationsArray.length > 0 ? (
                  preferredLocationsArray.map((loc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      {loc}
                    </div>
                  ))
                ) : candidate.currentResidentialLocation ? (
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                    {candidate.currentResidentialLocation}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    No preferred locations specified
                  </div>
                )}
              </div>
            </div>

            {/* Preferred Shifts */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Preferred shifts</h3>
              <div className="space-y-2">
                {jobTypesArray.length > 0 ? (
                  jobTypesArray.map((type: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      {type}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                    Part-time
                  </div>
                )}
              </div>
            </div>

            {/* Available to start */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Available to start</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                  {candidate.startTime || "2025-09-15"}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Qualifications</h2>
              <Info className="w-4 h-4 text-blue-700" />
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Certifications</h3>
              {certificationsArray.length > 0 ? (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                  {certificationsArray.map((cert: string, index: number) => (
                    <div key={index} className="text-sm text-gray-700">
                      {cert}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm italic mb-3">
                  No certifications specified
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Work experience</h2>
              <Info className="w-4 h-4 text-blue-700" />
            </div>

            {candidate.experience ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                  <div className="font-medium text-sm text-gray-900">
                    Healthcare Experience - {candidate.experience}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                No Experience specified
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Education</h2>
              <Info className="w-4 h-4 text-blue-700" />
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
              {candidate.qualification || "Bachelor of Nursing"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}