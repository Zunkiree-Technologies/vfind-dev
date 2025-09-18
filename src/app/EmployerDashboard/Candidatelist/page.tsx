"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { MapPin, Briefcase, Clock, Search, Mail, DollarSign, Clock1 } from "lucide-react";
import Loader from "../../../../components/loading";
import Link from "next/link";

interface ProfileImage {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
}

interface Candidate {
  residencyStatus: string;
  shiftPreferences: string[];
  experience: string;
  visaStatus: string;
  id: number;
  fullName: string;
  email?: string;
  currentResidentialLocation?: string;
  jobTypes?: string;
  maxWorkHours?: string;
  phoneNumber?: string;
  qualification?: string;
  profileImage?: ProfileImage | null;

}

const BASE_IMAGE_URL = "https://x8ki-letl-twmt.n7.xano.io";

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Updated filter states to match new layout
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([]);
  const [payRate, setPayRate] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);
  const [, setEmployerId] = useState<string | null>(null);
  const [experience, setExperience] = useState<string[]>([]);
  ;
  const [visaStatus, setVisaStatus] = useState<string[]>([]);



  // Load cookies and employerId
  useEffect(() => {
    const savedSearch = Cookies.get("search") || "";
    const savedLocation = Cookies.get("location") || "";
    const savedJobTypes = Cookies.get("jobTypes");
    const savedShifts = Cookies.get("shifts");
    const savedRoleCategories = Cookies.get("roleCategories");
    const savedExperience = Cookies.get("experience");
    const savedPayRate = Cookies.get("payRate");
    const savedVisaStatus = Cookies.get("visaStatus");
    const savedRadius = Cookies.get("radius");

    const storedEmployerId =
      typeof window !== "undefined" ? localStorage.getItem("employerId") : null;

    if (storedEmployerId) {
      setEmployerId(storedEmployerId);
    }

    setSearch(savedSearch);
    setLocation(savedLocation);
    if (savedJobTypes) setJobTypes(JSON.parse(savedJobTypes));
    if (savedShifts) setShifts(JSON.parse(savedShifts));
    if (savedRoleCategories) setRoleCategories(JSON.parse(savedRoleCategories));
    if (savedExperience) setExperience(JSON.parse(savedExperience));
    if (savedPayRate && !isNaN(Number(savedPayRate))) setPayRate(Number(savedPayRate));
    if (savedVisaStatus) setVisaStatus(JSON.parse(savedVisaStatus));
    if (savedRadius && !isNaN(Number(savedRadius))) setRadius(Number(savedRadius));
  }, []);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:MeLrTB-C/get_nurse_for_employers",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setCandidates(list);
        setFilteredCandidates(list);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);


  const experienceRanges: Record<string, [number, number]> = {
  "Less than 6 months": [0, 0.5],
  "6 months – 1 year": [0.5, 1],
  "1–3 years": [1, 3],
  "3 - 5 years": [3, 5],
  "Over 5 years": [5, Infinity],
};

function parseExperienceToYears(exp: string): number {
  const normalized = exp.trim().toLowerCase().replace(/–/g, "-");

  if (normalized.includes("less than 6 months")) return 0.25;
  if (normalized.includes("6 months")) return 0.75;
  if (normalized.includes("1-3 years")) return 2;
  if (normalized.includes("3-5 years")) return 4;
  if (normalized.includes("over 5 years") || normalized.includes("5+")) return 6;

  return 0;
}



 const applyFilters = useCallback(
  (instant = false) => {
    let filtered = [...candidates];

    // 🔹 SEARCH filter
    if (search.trim()) {
      filtered = filtered.filter((c) =>
        [c.fullName, c.qualification, c.jobTypes]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // 🔹 LOCATION filter
    if (location.trim()) {
      filtered = filtered.filter((c) =>
        [c.currentResidentialLocation]
          .join(" ")
          .toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    // 🔹 JOB TYPE filter
    if (jobTypes.length > 0) {
      filtered = filtered.filter((c) => {
        try {
          const jobTypesArray = c.jobTypes ? JSON.parse(c.jobTypes) : [];
          return jobTypesArray.some((jt: string) =>
            jobTypes.some((et) => jt.toLowerCase().includes(et.toLowerCase()))
          );
        } catch {
          return false;
        }
      });
    }

    // 🔹 SHIFT filter
    if (shifts.length > 0) {
      filtered = filtered.filter((c) =>
        c.shiftPreferences?.some((pref: string) =>
          shifts.some((s) => pref.toLowerCase().includes(s.toLowerCase()))
        )
      );
    }

    // 🔹 EXPERIENCE filter
    if (experience.length > 0) {
      filtered = filtered.filter((c) => {
        if (!c.experience) return false;

        const candidateYears = parseExperienceToYears(c.experience);

        return experience.some((exp) => {
          const [min, max] = experienceRanges[exp];
          return candidateYears >= min && candidateYears < max;
        });
      });
    }

    // 🔹 ROLE filter
    if (roleCategories.length > 0) {
      filtered = filtered.filter((c) =>
        roleCategories.some((role) =>
          (c.qualification || "").toLowerCase().includes(role.toLowerCase())
        )
      );
    }

    // 🔹 VISA filter
    if (visaStatus.length > 0) {
      filtered = filtered.filter((c) =>
        visaStatus.some((status) =>
          (c.residencyStatus || "").toLowerCase().includes(status.toLowerCase())
        )
      );
    }

    // 🔹 PAY RATE filter
    if (payRate > 0) {
      filtered = filtered.filter((c) => {
        const rate = parseFloat(c.maxWorkHours || "0");
        return !isNaN(rate) && rate >= payRate;
      });
    }

    setFilteredCandidates(filtered);

    // Save cookies if not instant
    if (!instant) {
      Cookies.set("search", search, { expires: 7 });
      Cookies.set("location", location, { expires: 7 });
      Cookies.set("jobTypes", JSON.stringify(jobTypes), { expires: 7 });
      Cookies.set("shifts", JSON.stringify(shifts), { expires: 7 });
      Cookies.set("roleCategories", JSON.stringify(roleCategories), { expires: 7 });
      Cookies.set("experience", JSON.stringify(experience), { expires: 7 }); // ✅ FIXED
      Cookies.set("payRate", String(payRate), { expires: 7 });
      Cookies.set("visaStatus", JSON.stringify(visaStatus), { expires: 7 });
      Cookies.set("radius", String(radius), { expires: 7 });
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    candidates,
    search,
    location,
    jobTypes,
    shifts,
    experience, 
    roleCategories,
    payRate,
    radius,
    visaStatus,
  ]
);

  useEffect(() => {
    const debounce = setTimeout(() => applyFilters(true), 300);
    return () => clearTimeout(debounce);
  }, [search, location, jobTypes, shifts, roleCategories, experience, payRate, radius, applyFilters]);

  const handleCheckboxChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobTypes([]);
    setShifts([]);
    setRoleCategories([]);
    setExperience([]);
    setVisaStatus([]);
    setPayRate(0);
    setRadius(0);
    setFilteredCandidates(candidates);

    // Clear all cookies
    Cookies.remove("search");
    Cookies.remove("location");
    Cookies.remove("jobTypes");
    Cookies.remove("shifts");
    Cookies.remove("roleCategories");
    Cookies.remove("experience");
    Cookies.remove("payRate");
    Cookies.remove("visaStatus");
    Cookies.remove("radius");
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6 min-h-screen mx-auto container bg-[#F5F6FA]">

      {/* Top Search Bar */}
      <div className="flex justify-center items-center sticky top-0 z-50 bg-[#F5F6FA] ">
        <div className="flex items-center w-[950px] border border-gray-300 rounded-lg bg-white overflow-hidden p-1">
          {/* Search input with icon */}
          <div className="flex items-center px-3 w-1/2">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by keyword, designation, company name"
              className="w-full outline-none py-2"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300" />

          {/* Location input with icon */}
          <div className="flex items-center px-3 w-1/3">
            <MapPin className="text-gray-400 mr-2" size={18} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="City, State or ZIP code"
              className="w-full outline-none py-2"
            />
          </div>

          {/* Search button */}
          <button
            onClick={() => applyFilters()}
            className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-600 rounded-[10px]"
          >
            Search
          </button>
        </div>
      </div>



      <div className="flex gap-6 mt-6 items-start">
        {/* Left Filters */}
        <div className="hidden md:block w-[320px] bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-15 h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="font-semibold text-gray-800 flex justify-between ">
            All Filters
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 "
            >
              Clear All
            </button>
          </h2>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Job Type */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2 ">Job Type</h3>
            {["Full-Time", "Part-Time", "Casual", "Open to any"].map((type) => (
              <div key={type} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={jobTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type, setJobTypes)}
                  className="rounded"
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Shift */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Shift</h3>
            {["Morning", "Afternoon", "Night"].map((shift) => (
              <div key={shift} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={shifts.includes(shift)}
                  onChange={() => handleCheckboxChange(shift, setShifts)}
                  className="rounded"
                />
                <label>{shift}</label>
              </div>
            ))}
          </div>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Role Category */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Role Category</h3>
            {[
              "Clinical Lead / Manager",
              "Registered Nurse (RN)",
              "Enrolled Nurse (EN)",
              "Assistant in Nursing (AIN)",
              "Others"
            ].map((role) => (
              <div key={role} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={roleCategories.includes(role)}
                  onChange={() => handleCheckboxChange(role, setRoleCategories)}
                  className="rounded"
                />
                <label>{role}</label>
              </div>
            ))}
          </div>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Experience */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Experience</h3>
            {[
              "Less than 6 months",
              "6 months – 1 year",
              "1–3 years",
              "3 - 5 years",
              "Over 5 years",
            ].map((exp) => (
              <div key={exp} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={experience.includes(exp)}
                  onChange={() => handleCheckboxChange(exp, setExperience)}
                  className="rounded"
                />
                <label>{exp}</label>
              </div>
            ))}
          </div>



          <div className="w-py h-0.5 bg-gray-300" />
          {/* visa status */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Visa Status</h3>
            {[
              "Australian Citizen / Permanent Resident",
              "Temporary Resident",
              "Student Visa Holder",
              "Student Dependent Visa Holder",
              "Working Visa Holder",
              "Other",
            ].map((status) => (
              <div key={status} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={visaStatus.includes(status)}
                  onChange={() => handleCheckboxChange(status, setVisaStatus)}
                  className="rounded"
                />
                <label>{status}</label>
              </div>
            ))}
          </div>
          <div className="w-py h-0.5 bg-gray-300" />


          {/* Pay Rate */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Pay Rate</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={isNaN(payRate) ? 0 : payRate}
              onChange={(e) => setPayRate(Number(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Any</span>
              <span>${payRate}+</span>
            </div>
          </div>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Radius */}
          {/* <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Radius</h3>
            <input
              type="range"
              min="0"
              max="50"
              value={isNaN(radius) ? 0 : radius}
              onChange={(e) => setRadius(Number(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Any</span>
              <span>{radius} km</span>
            </div>
          </div> */}
        </div>

        {/* Candidate Cards */}
        <div className="flex-1 max-w-[983px] ">
          <div className="grid grid-cols-1 gap-4">
            {filteredCandidates.map((candidate) => {
              let jobTypesArray: string[] = [];
              try {
                if (candidate.jobTypes) jobTypesArray = JSON.parse(candidate.jobTypes);
              } catch {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                jobTypesArray = [];
              }
              const profileImageUrl = candidate.profileImage
                ? BASE_IMAGE_URL + candidate.profileImage.path
                : null;

              return (
                <div
                  key={candidate.id}
                  className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2"
                >
                  {/* Left side content */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-bold text-lg text-[#61A6FA] mb-1">
                      {candidate.fullName}
                    </h2>
                    <p className=" text-regular  mb-3">
                      {candidate.qualification || "Qualification not specified"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                      {/* Location */}
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>
                          {candidate.currentResidentialLocation || "Location not specified"}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        <span>{candidate.email || "Not specified"}</span>
                      </div>

                      {/* Pay Rate */}
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>
                          {candidate.maxWorkHours
                            ? `$${candidate.maxWorkHours}/hr`
                            : "Not specified"}
                        </span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-1">
                        <Clock1 size={16} className="text-blue-500" />
                        <span>
                          {candidate.experience || "Not specified"}
                        </span>
                      </div>


                      {/* Job Type */}
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{candidate.jobTypes || "Not specified"}</span>

                      </div>

                      {/* Shift */}
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>
                          {candidate.shiftPreferences.length > 0
                            ? candidate.shiftPreferences.join(", ")
                            : "Not specified"}


                        </span>
                      </div>


                    </div>


                  </div>


                  {/* Right side - Photo and button */}
                  <div className="flex items-center gap-4 ml-6 flex-col">
                    {/* Circular Profile Image */}
                    <div className="h-16 w-16 rounded-full overflow-hidden border flex-shrink-0">
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt={candidate.fullName}
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                          No Photo
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    <Link
                      href={`/EmployerDashboard/Candidatelist/${candidate.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#61A6FA] text-white text-sm font-medium rounded-[10px] hover:bg-blue-500 transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

              );
            })}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No candidates found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}