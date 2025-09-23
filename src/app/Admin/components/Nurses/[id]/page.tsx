"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  User,
  Briefcase,
  Clock,
  Shield,
  Award,
  UserRoundSearch,
} from "lucide-react";
import Loader from "../../../../../../components/loading";

interface ProfileImage {
  url?: string;
  path?: string;
}

interface NurseDetail {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string | number;  // use string if formatting matters
  currentResidentialLocation?: string;
  postcode?: string;
  jobSearchStatus?: string;
  qualification?: string;
  otherQualification?: string;
  residencyStatus?: string;
  jobTypes?: string | string[];
  openToOtherTypes?: string;
  certifications?: string[];
  specializations?: string[];
  experience?: string;
  workingInHealthcare?: string;
  locationPreference?: string;
  preferredLocations?: string[];
  shiftPreferences?: string[];
  maxWorkHours?: string;
  workHoursRestricted?: string;
  startTime?: string;
  startDate?: string;
  visaType?: string;
  visaDuration?: string;
  profileImage?: ProfileImage | null;
  organisation?: string;          // matches your data
  organizationStartYear?: string;
  created_at?: number;
  user_id?: number;
  connections_id?: number;
}


export default function NurseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [nurse, setNurse] = useState<NurseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch nurse details
  useEffect(() => {
    async function fetchNurse() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/nurse_profiles_admin/${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch nurse details");

        const data: NurseDetail = await res.json();
        setNurse(data);
      } catch (err) {
        console.error("Error fetching nurse:", err);
        setError("Could not load nurse details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchNurse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <Loader loading={true} message="Loading Nurse Profile..." />
      </div>
    );
  }

  if (error || !nurse) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 font-semibold">
        {error || "Nurse not found"}
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 border rounded text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Normalized arrays
  const preferredLocationsArray = nurse.preferredLocations ?? [];
  const certificationsArray = nurse.certifications ?? [];
  const jobTypesArray = nurse.jobTypes
    ? Array.isArray(nurse.jobTypes)
      ? nurse.jobTypes
      : [nurse.jobTypes]
    : [];

  const profileImageUrl = nurse.profileImage?.url
    ? nurse.profileImage.url
    : nurse.profileImage?.path
      ? `https://x76o-gnx4-xrav.a2.xano.io${nurse.profileImage.path}`
      : null;

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-4">
      {/* Top Profile Section */}
      <div className="mx-auto bg-white rounded-xl shadow-sm p-8 mb-8 relative container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Profile Image */}
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex-shrink-0">
            {profileImageUrl ? (
              <Image
                priority
                src={profileImageUrl}
                alt={nurse.fullName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                {nurse.fullName?.charAt(0) || "N"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {nurse.fullName}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4 text-blue-700" />
              Joined:{" "}
              {nurse.created_at
                ? new Date(nurse.created_at).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info & Visa */}
      <div className="lg:col-span-1 flex flex-col lg:flex-row justify-between gap-4 mx-4 mx-auto container">
        {/* Basic Info */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
          </div>
          <div className="space-y-4">
            {nurse.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{nurse.email}</p>
              </div>
            )}
            {nurse.phoneNumber && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-gray-900">{nurse.phoneNumber}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900">
                {nurse.currentResidentialLocation || "Location not specified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Job Status</h3>
              <p className="text-gray-900">{nurse.jobSearchStatus || "Not specified"}</p>
            </div>
          </div>
        </div>


        {/* Visa & Residency */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Visa & Residency
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Residency Status</h3>
              <p className="text-gray-900">
                {nurse.residencyStatus || "Australian Citizen / Permanent Resident"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visa Type</h3>
              <p className="text-gray-900">
                {nurse.visaType || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visa Duration</h3>
              <p className="text-gray-900">
                {nurse.visaDuration || "Not specified"}
              </p>
            </div>
          </div>
        </div>

      </div>
      {/* ================= Job Search Preferences ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-5 mx-4 mx-auto container">
        <div className="flex items-center space-x-2 mb-6">
          <UserRoundSearch className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Job Search Preferences</h2>
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
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {loc}
                  </span>
                ))
              ) : nurse.currentResidentialLocation ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {nurse.currentResidentialLocation}
                </span>
              ) : (
                <span className="text-gray-400 text-sm italic">No preferred locations specified</span>
              )}
            </div>
          </div>

          {/* Preferred Job Types */}
          <div className="w-1/2 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preferred Job Types</h3>
            <div className="flex flex-wrap gap-2">
              {jobTypesArray.length > 0 ? (
                jobTypesArray.map((type, index) => (
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
              {nurse.openToOtherTypes ? (
                <span className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium">
                  {nurse.openToOtherTypes}
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
              {nurse.shiftPreferences && nurse.shiftPreferences.length > 0 ? (
                nurse.shiftPreferences.map((shift, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium"
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
          Available To Start:{" "}
          <span className="ml-1">{nurse.startTime || "Not Specified"}</span>
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
              {nurse.qualification || "Not Specified"}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Certifications</h3>
          {certificationsArray.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-800">
              {certificationsArray.map((cert, index) => (
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
                {nurse.experience || "No experience specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Currently Working in Healthcare</p>
              <p className="font-medium text-gray-900">
                {nurse.workingInHealthcare || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Organization</p>
              <p className="font-medium text-gray-900">
                {nurse.organisation
                  ? `${nurse.organisation} (since ${nurse.organizationStartYear || "N/A"})`
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

          <div>
            <p className="text-gray-500">Maximum Work Hours</p>
            <p className="font-medium text-gray-900">
              {nurse.maxWorkHours || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Work Hours Restricted</p>
            <p className="font-medium text-gray-900">
              {nurse.workHoursRestricted === "Yes" ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
