"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  MapPin,
  Briefcase,
  Clock,
  Search,
  Mail,
  DollarSign,
  Clock1,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Loader from "../../../../components/loading";
import Footer from "@/app/Admin/components/layout/Footer";
import EmployerNavbar from "../components/EmployerNavbar";
import MainButton from "@/components/ui/MainButton";

interface ProfileImage {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
}

interface NurseProfile {
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

const BASE_IMAGE_URL = "https://x76o-gnx4-xrav.a2.xano.io";

const experienceRanges: Record<string, [number, number]> = {
  "Less than 6 months": [0, 0.5],
  "6 months – 1 year": [0.5, 1],
  "1–3 years": [1, 3],
  "3 - 5 years": [3, 5],
  "Over 5 years": [5, Infinity],
};

export default function WishlistNurses() {
  const [nurses, setNurses] = useState<NurseProfile[]>([]);
  const [filteredNurses, setFilteredNurses] = useState<NurseProfile[]>([]);
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
  const [experience, setExperience] = useState<string[]>([]);
  const [visaStatus, setVisaStatus] = useState<string[]>([]);

  const totalPages = Math.ceil(filteredNurses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNurses = filteredNurses.slice(startIndex, endIndex);

  useEffect(() => {
    const savedSearch = Cookies.get("wishlist_search") || "";
    const savedLocation = Cookies.get("wishlist_location") || "";
    const savedJobTypes = Cookies.get("wishlist_jobTypes");
    const savedShifts = Cookies.get("wishlist_shifts");
    const savedRoleCategories = Cookies.get("wishlist_roleCategories");
    const savedExperience = Cookies.get("wishlist_experience");
    const savedPayRate = Cookies.get("wishlist_payRate");
    const savedVisaStatus = Cookies.get("wishlist_visaStatus");
    const savedRadius = Cookies.get("wishlist_radius");

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
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/getWishlistForSpecificEmployer",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nurseList: NurseProfile[] = data.map((item: any) => item._nurse_profiles_2);

        setNurses(nurseList);
        setFilteredNurses(nurseList);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch nurses.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  function parseExperienceToYears(exp: string): number {
    const normalized = exp.trim().toLowerCase().replace(/–/g, "-");

    if (normalized.includes("less than 6 months")) return 0.25;
    if (normalized.includes("6 months")) return 0.75;
    if (normalized.includes("1-3 years")) return 2;
    if (normalized.includes("3-5 years")) return 4;
    if (normalized.includes("over 5 years") || normalized.includes("5+"))
      return 6;

    return 0;
  }

  const applyFilters = useCallback(
    (instant = false) => {
      let filtered = [...nurses];

      if (search.trim()) {
        filtered = filtered.filter((n) =>
          [n.fullName, n.qualification, n.jobTypes]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }

      if (location.trim()) {
        filtered = filtered.filter((n) =>
          [n.currentResidentialLocation]
            .join(" ")
            .toLowerCase()
            .includes(location.toLowerCase())
        );
      }

      if (jobTypes.length > 0) {
        filtered = filtered.filter((n) => {
          try {
            const jobTypesArray = n.jobTypes ? JSON.parse(n.jobTypes) : [];
            return jobTypesArray.some((jt: string) =>
              jobTypes.some((et) => jt.toLowerCase().includes(et.toLowerCase()))
            );
          } catch {
            return false;
          }
        });
      }

      if (shifts.length > 0) {
        filtered = filtered.filter((n) =>
          n.shiftPreferences?.some((pref: string) =>
            shifts.some((s) => pref.toLowerCase().includes(s.toLowerCase()))
          )
        );
      }

      if (experience.length > 0) {
        filtered = filtered.filter((n) => {
          if (!n.experience) return false;

          const nurseYears = parseExperienceToYears(n.experience);

          return experience.some((exp) => {
            const [min, max] = experienceRanges[exp];
            return nurseYears >= min && nurseYears < max;
          });
        });
      }

      if (roleCategories.length > 0) {
        filtered = filtered.filter((n) =>
          roleCategories.some((role) =>
            (n.qualification || "").toLowerCase().includes(role.toLowerCase())
          )
        );
      }

      if (visaStatus.length > 0) {
        filtered = filtered.filter((n) =>
          visaStatus.some((status) =>
            (n.residencyStatus || "").toLowerCase().includes(status.toLowerCase())
          )
        );
      }

      if (payRate > 0) {
        filtered = filtered.filter((n) => {
          const rate = parseFloat(n.maxWorkHours || "0");
          return !isNaN(rate) && rate >= payRate;
        });
      }

      setFilteredNurses(filtered);
      setCurrentPage(1);

      if (!instant) {
        Cookies.set("wishlist_search", search, { expires: 7 });
        Cookies.set("wishlist_location", location, { expires: 7 });
        Cookies.set("wishlist_jobTypes", JSON.stringify(jobTypes), { expires: 7 });
        Cookies.set("wishlist_shifts", JSON.stringify(shifts), { expires: 7 });
        Cookies.set("wishlist_roleCategories", JSON.stringify(roleCategories), {
          expires: 7,
        });
        Cookies.set("wishlist_experience", JSON.stringify(experience), { expires: 7 });
        Cookies.set("wishlist_payRate", String(payRate), { expires: 7 });
        Cookies.set("wishlist_visaStatus", JSON.stringify(visaStatus), { expires: 7 });
        Cookies.set("wishlist_radius", String(radius), { expires: 7 });
      }
    },
    [
      nurses,
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
    setFilteredNurses(nurses);
    setCurrentPage(1);

    Cookies.remove("wishlist_search");
    Cookies.remove("wishlist_location");
    Cookies.remove("wishlist_jobTypes");
    Cookies.remove("wishlist_shifts");
    Cookies.remove("wishlist_roleCategories");
    Cookies.remove("wishlist_experience");
    Cookies.remove("wishlist_payRate");
    Cookies.remove("wishlist_visaStatus");
    Cookies.remove("wishlist_radius");
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
    <div className="p-6 min-h-screen mx-auto bg-gray-50">
      {/* Navbar - sticky */}
      <div className="sticky top-0 z-50">
        <EmployerNavbar />
      </div>
      {/* Search Bar - sticky below navbar */}
      <div className="sticky top-[64px] z-40 bg-gray-50 py-3">
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


      <div className="flex gap-6 mt-12 mx-auto container">
        {/* Left Filters */}
        <div className="hidden md:block w-[320px] bg-white rounded-lg p-4 shadow-sm space-y-6 sticky top-15 h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="font-semibold text-gray-800 flex justify-between">
            All Filters
            <button onClick={clearFilters} className="text-sm text-blue-400">
              Clear All
            </button>
          </h2>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Job Type */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Job Type</h3>
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
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Role Category
            </h3>
            {[
              "Clinical Lead / Manager",
              "Registered Nurse (RN)",
              "Enrolled Nurse (EN)",
              "Assistant in Nursing (AIN)",
              "Personal Care Assistant (PCA)",
              "Attendant",
              "Support Worker",
              "Nursing Assistant",
            ].map((role) => (
              <div key={role} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={roleCategories.includes(role)}
                  onChange={() =>
                    handleCheckboxChange(role, setRoleCategories)
                  }
                  className="rounded"
                />
                <label>{role}</label>
              </div>
            ))}
          </div>
          <div className="w-py h-0.5 bg-gray-300" />

          {/* Experience */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Experience
            </h3>
            {Object.keys(experienceRanges).map((exp) => (
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

          {/* Visa Status */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Visa Status
            </h3>
            {["Permanent", "Temporary", "Citizen"].map((status) => (
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

          {/* Pay Rate Slider */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Pay Rate</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={payRate}
              onChange={(e) => setPayRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600">${payRate}+/hr</div>
          </div>
        </div>

        {/* Right Nurse List */}
        <div className="flex-1">
          <div className="space-y-4">
            {currentNurses.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No nurses found matching your filters.</p>
            ) : (
              currentNurses.map((nurse) => (
                <div
                  key={nurse.id}
                  className="flex justify-between items-center bg-white max-w-[983px] rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-[#61A6FA] mb-1">
                      {nurse.fullName}
                    </h2>
                    <p className="text-regular mb-3">
                      {nurse.qualification || "Qualification not specified"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{nurse.currentResidentialLocation || "Location not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        <span>{nurse.email || "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{nurse.maxWorkHours ? `$${nurse.maxWorkHours}/hr` : "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock1 size={16} className="text-blue-500" />
                        <span>{nurse.experience || "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{nurse.jobTypes || "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>
                          {nurse.shiftPreferences.length > 0
                            ? nurse.shiftPreferences.join(", ")
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-6 flex-col">
                    <div className="h-16 w-16 rounded-full overflow-hidden border flex-shrink-0">
                      {nurse.profileImage ? (
                        <Image
                          src={BASE_IMAGE_URL + nurse.profileImage.path}
                          alt={nurse.fullName}
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

                    <MainButton
                      href={`/EmployerDashboard/Candidatelist/${nurse.id}`}
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
              ))
            )}
          </div>

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

  );
}