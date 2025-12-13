"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  MapPin,
  Search,
  Mail,
  Clock1,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";
import Loader from "../../../../components/loading";
import Footer from "@/app/Admin/components/layout/Footer";
import EmployerNavbar from "../../EmployerDashboard/components/EmployerNavbar";
import MainButton from "../../../components/ui/MainButton";
import CandidateFilters from "../components/CandidateFilters";
import { getNursesForEmployers } from "@/lib/supabase-api";
import { supabase } from "@/lib/supabase";

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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// Get the Supabase storage URL for profile images
const getImageUrl = (path: string | undefined) => {
  if (!path) return null;
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  // Otherwise construct from Supabase storage
  const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
  return data.publicUrl;
};

// Updated experience ranges to match the form
const experienceRanges: Record<string, [number, number]> = {
  "Fresher": [0, 0.5],
  "Less than 1 year": [0, 1],
  "1 – 2 years": [1, 3],
  "2 - 5 years": [3, 5],
  "Above 5 years": [5, Infinity],
};

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([]);
  const [payRate, setPayRate] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);
  const [, setEmployerId] = useState<string | null>(null);
  const [experience, setExperience] = useState<string[]>([]);
  const [visaStatus, setVisaStatus] = useState<string[]>([]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

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
    if (savedPayRate && !isNaN(Number(savedPayRate)))
      setPayRate(Number(savedPayRate));
    if (savedVisaStatus) setVisaStatus(JSON.parse(savedVisaStatus));
    if (savedRadius && !isNaN(Number(savedRadius)))
      setRadius(Number(savedRadius));
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const data = await getNursesForEmployers();

        // Map Supabase data to Candidate interface
        const list: Candidate[] = data.map((nurse) => ({
          id: Number(nurse.id),
          fullName: nurse.full_name || "",
          email: nurse.email,
          currentResidentialLocation: nurse.current_residential_location,
          jobTypes: nurse.job_types ? JSON.stringify(nurse.job_types) : undefined,
          maxWorkHours: nurse.max_work_hours,
          phoneNumber: nurse.phone_number,
          qualification: nurse.qualification,
          profileImage: nurse.profile_image_url ? { access: "", path: nurse.profile_image_url, name: "", type: "", size: 0 } : null,
          residencyStatus: nurse.residency_status || "",
          shiftPreferences: nurse.shift_preferences || [],
          experience: nurse.experience || "",
          visaStatus: nurse.visa_status || "",
        }));

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

  function parseExperienceToYears(exp: string): number {
    const normalized = exp.trim().toLowerCase().replace(/–/g, "-");
    if (normalized.includes("fresher")) return 0.25;
    if (normalized.includes("less than 1 year")) return 0.75;
    if (normalized.includes("1 – 2 years") || normalized.includes("1 - 2 years")) return 2;
    if (normalized.includes("2 - 5 years")) return 4;
    if (normalized.includes("above 5 years") || normalized.includes("5+"))
      return 6;

    return 0;
  }

  const applyFilters = useCallback(
    (instant = false) => {
      let filtered = [...candidates];

      if (search.trim()) {
        filtered = filtered.filter((c) =>
          [c.fullName, c.qualification, c.jobTypes]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

      if (location.trim()) {
        filtered = filtered.filter((c) =>
          [c.currentResidentialLocation]
            .join(" ")
            .toLowerCase()
            .includes(location.toLowerCase())
        );
      }

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

      if (shifts.length > 0) {
        filtered = filtered.filter((c) =>
          c.shiftPreferences?.some((pref: string) =>
            shifts.some((s) => pref.toLowerCase().includes(s.toLowerCase()))
          )
        );
      }

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

      if (roleCategories.length > 0) {
        filtered = filtered.filter((c) =>
          roleCategories.some((role) =>
            (c.qualification || "")
              .toLowerCase()
              .includes(role.toLowerCase())
          )
        );
      }

      if (visaStatus.length > 0) {
        filtered = filtered.filter((c) =>
          visaStatus.some((status) =>
            (c.residencyStatus || "")
              .toLowerCase()
              .includes(status.toLowerCase())
          )
        );
      }

      if (payRate > 0) {
        filtered = filtered.filter((c) => {
          const rate = parseFloat(c.maxWorkHours || "0");
          return !isNaN(rate) && rate >= payRate;
        });
      }

      setFilteredCandidates(filtered);
      setCurrentPage(1);

      if (!instant) {
        Cookies.set("search", search, { expires: 7 });
        Cookies.set("location", location, { expires: 7 });
        Cookies.set("jobTypes", JSON.stringify(jobTypes), { expires: 7 });
        Cookies.set("shifts", JSON.stringify(shifts), { expires: 7 });
        Cookies.set("roleCategories", JSON.stringify(roleCategories), {
          expires: 7,
        });
        Cookies.set("experience", JSON.stringify(experience), { expires: 7 });
        Cookies.set("payRate", String(payRate), { expires: 7 });
        Cookies.set("visaStatus", JSON.stringify(visaStatus), { expires: 7 });
        Cookies.set("radius", String(radius), { expires: 7 });
      }
    },
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
  }, [
    search,
    location,
    jobTypes,
    shifts,
    roleCategories,
    experience,
    payRate,
    radius,
    applyFilters,
  ]);


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
    setCurrentPage(1);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Navbar - sticky */}
      <div className="sticky top-0 z-50">
        <EmployerNavbar />
      </div>

      {/* Search Bar - sticky below navbar */}
      <div className="sticky top-[64px] z-40 bg-[#F5F6FA] py-3">
        <div className="flex justify-center">

          <div className="flex items-center justify-between w-[95%] max-w-[950px] border border-gray-300 rounded-lg bg-white overflow-hidden p-1">
            {/* Search Input */}
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

            {/* Location Input */}
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

            {/* Search Button */}
            <MainButton
              onClick={() => applyFilters()}
            >
              <span className="flex items-center gap-2">
                {" "}
                <span className="transition-all duration-300 group-hover:-translate-x-1">
                  {" "}
                  Search{" "}
                </span>{" "}
              </span>
            </MainButton>
          </div>
        </div>
      </div>

      <div className=" mx-auto bg-[#F5F6FA]">
        <div className="flex gap-6 mt-10 mx-auto container">
          {/* Left Filters */}
          <div className="hidden md:block">
            <CandidateFilters
              jobTypes={jobTypes}
              setJobTypes={setJobTypes}
              shifts={shifts}
              setShifts={setShifts}
              roleCategories={roleCategories}
              setRoleCategories={setRoleCategories}
              experience={experience}
              setExperience={setExperience}
              visaStatus={visaStatus}
              setVisaStatus={setVisaStatus}
              payRate={payRate}
              setPayRate={setPayRate}
              clearFilters={clearFilters}
            />
          </div>

          {/* Right Candidate List */}
          <div className="flex-1">
            {/* Candidates */}
            <div className="space-y-4">
              {currentCandidates.map((candidate) => {
                let jobTypesArray: string[] = [];
                try {
                  if (candidate.jobTypes) {
                    jobTypesArray = JSON.parse(candidate.jobTypes);
                  }
                } catch {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  jobTypesArray = [];
                }

                return (
                  <div
                    key={candidate.id}
                    className="flex justify-between items-center bg-white max-w-[983px] rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2 "
                  >
                    {/* Left side content */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-[#61A6FA] mb-1">
                        {candidate.fullName}
                      </h2>
                      <p className="text-regular mb-3">
                        {candidate.qualification || "Qualification not specified"}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                        {/* Location */}
                        <div className="flex items-center gap-1">
                          <MapPin size={16} className="text-blue-500" />
                          <span>{candidate.currentResidentialLocation || "Location not specified"}</span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-1">
                          <Mail size={16} className="text-blue-500" />
                          <span>{candidate.email || "Not specified"}</span>
                        </div>

                        {/* Pay Rate */}
                        <div className="flex items-center gap-1">
                          <BriefcaseBusiness size={16} className="text-blue-500" />
                          <span>{candidate.experience}</span>
                        </div>



                        {/* Job Type
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} className="text-blue-500" />
                          <span>
                            {Array.isArray(candidate.jobTypes) && candidate.jobTypes.length > 0
                              ? candidate.jobTypes.join(", ")
                              : "Not specified"}
                          </span>
                        </div> */}


                        {/* Shift */}
                        <div className="flex items-center gap-1">
                          <Clock1 size={16} className="text-blue-500" />

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
                        {candidate.profileImage?.path ? (
                          <Image
                            src={getImageUrl(candidate.profileImage.path) || ""}
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

                      {/* View Details Button */}
                      <MainButton
                        href={`/EmployerDashboard/Candidatelist/${candidate.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        <span className="flex items-center gap-2">
                          {" "}
                          <span className="transition-all duration-300 group-hover:-translate-x-1">
                            {" "}
                            View Details{" "}

                          </span>{" "}
                        </span>
                      </MainButton>
                    </div>
                  </div>
                );

              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>


        <div className="bg-white">
          <Footer />
        </div>
      </div>
    </div>

  );
}
