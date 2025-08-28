"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { MapPin, Briefcase, Clock } from "lucide-react";
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
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [licenses, setLicenses] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [payRange, setPayRange] = useState<number>(0);
  const [, setEmployerId] = useState<string | null>(null);

  // Load cookies and employerId
  useEffect(() => {
    const savedSearch = Cookies.get("search") || "";
    const savedLocation = Cookies.get("location") || "";
    const savedEmployment = Cookies.get("employmentTypes");
    const savedLicenses = Cookies.get("licenses");
    const savedShifts = Cookies.get("shifts");
    const savedPay = Cookies.get("payRange");

    const storedEmployerId =
      typeof window !== "undefined" ? localStorage.getItem("employerId") : null;

    if (storedEmployerId) {
      setEmployerId(storedEmployerId);
      // console.log("Employer ID in CandidateList:", storedEmployerId);
    }

    setSearch(savedSearch);
    setLocation(savedLocation);
    if (savedEmployment) setEmploymentTypes(JSON.parse(savedEmployment));
    if (savedLicenses) setLicenses(JSON.parse(savedLicenses));
    if (savedShifts) setShifts(JSON.parse(savedShifts));
    if (savedPay && !isNaN(Number(savedPay))) setPayRange(Number(savedPay));
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

      if (employmentTypes.length > 0 && !employmentTypes.includes("Other")) {
        filtered = filtered.filter((c) => {
          try {
            const jobTypesArray = c.jobTypes ? JSON.parse(c.jobTypes) : [];
            return jobTypesArray.some((jt: string) =>
              employmentTypes.some((et) => jt.toLowerCase().includes(et.toLowerCase()))
            );
          } catch {
            return false;
          }
        });
      }

      if (licenses.length > 0) {
        filtered = filtered.filter((c) =>
          licenses.some((lic) =>
            (c.qualification || "").toLowerCase().includes(lic.toLowerCase())
          )
        );
      }

      if (shifts.length > 0) {
        filtered = filtered.filter((c) => {
          try {
            const jobTypesArray = c.jobTypes ? JSON.parse(c.jobTypes) : [];
            return jobTypesArray.some((jt: string) =>
              shifts.some((s) => jt.toLowerCase().includes(s.toLowerCase()))
            );
          } catch {
            return false;
          }
        });
      }

      if (payRange > 0) {
        filtered = filtered.filter((c) => {
          const rate = parseFloat(c.maxWorkHours || "0");
          return !isNaN(rate) && rate >= payRange;
        });
      }

      setFilteredCandidates(filtered);

      if (!instant) {
        Cookies.set("search", search, { expires: 7 });
        Cookies.set("location", location, { expires: 7 });
        Cookies.set("employmentTypes", JSON.stringify(employmentTypes), { expires: 7 });
        Cookies.set("licenses", JSON.stringify(licenses), { expires: 7 });
        Cookies.set("shifts", JSON.stringify(shifts), { expires: 7 });
        Cookies.set("payRange", String(payRange), { expires: 7 });
      }
    },
    [candidates, search, location, employmentTypes, licenses, shifts, payRange]
  );

  useEffect(() => {
    const debounce = setTimeout(() => applyFilters(true), 300);
    return () => clearTimeout(debounce);
  }, [search, location, employmentTypes, licenses, shifts, payRange, applyFilters]);

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
    setEmploymentTypes([]);
    setLicenses([]);
    setShifts([]);
    setPayRange(0);
    setFilteredCandidates(candidates);
    Cookies.remove("search");
    Cookies.remove("location");
    Cookies.remove("employmentTypes");
    Cookies.remove("licenses");
    Cookies.remove("shifts");
    Cookies.remove("payRange");
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6 min-h-screen mx-auto container">
      {/* Top Search Bar */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex gap-2 w-[950px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by keyword, specialty, job title"
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="City, State or ZIP code"
            className="w-1/2 border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => applyFilters()}
            className="px-6 py-2 w-[150px] bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Filters */}
        <div className="w-64 bg-white h-fit rounded-lg p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 flex justify-between">
            All Filters
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </h2>

          {/* Employment Type */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">
              Employment Type
            </h3>
            {["Full-Time", "Part-Time", "Open to any", "Other"].map((type) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={employmentTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type, setEmploymentTypes)}
                />{" "}
                {type}
              </div>
            ))}
          </div>

          {/* License */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">License</h3>
            {[
              "Registered Nurse (RN)",
              "Clinical Lead / Manager",
              "Enrolled Nurse (EN)",
              "Licensed Practical Nurse (LPN)",
              "Certified Nursing Assistant (CNA)",
              "Assistant in Nursing (AIN)",
            ].map((lic) => (
              <div key={lic} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={licenses.includes(lic)}
                  onChange={() => handleCheckboxChange(lic, setLicenses)}
                />{" "}
                {lic}
              </div>
            ))}
          </div>

          {/* Shift */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">Shift</h3>
            {["Day Shift", "Night Shift", "Evening Shift"].map((shift) => (
              <div key={shift} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={shifts.includes(shift)}
                  onChange={() => handleCheckboxChange(shift, setShifts)}
                />{" "}
                {shift}
              </div>
            ))}
          </div>

          {/* Pay */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">Pay (Min $/hr)</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={isNaN(payRange) ? 0 : payRange}
              onChange={(e) => setPayRange(Number(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
            <p className="text-sm text-gray-600 mt-1">${payRange}/hr</p>
          </div>
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
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
                className="relative rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full"
              >


                {/* Photo */}
                <div className="absolute top-6 right-6 h-20 w-20 bg-gray-200 rounded-lg overflow-hidden">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt={candidate.fullName}
                      className="h-full w-full object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300" />
                  )}
                </div>

                <h2 className="font-bold text-xl mb-1 text-blue-700">
                  {candidate.fullName}
                </h2>
                <p className="text-gray-600 w-[150px] mb-4">
                  {candidate.qualification || "Qualification not specified"}
                </p>

                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    <span>
                      {candidate.currentResidentialLocation || "Location not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    <span>{candidate.jobTypes || "Job type not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <span>
                      {candidate.maxWorkHours
                        ? `${candidate.maxWorkHours}/hr Per Week`
                        : "Hourly pay not specified"}
                    </span>
                    
                  </div>
                </div>

                <Link
                  href={`/EmployerDashboard/Candidatelist/${candidate.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-full inline-block text-center"
                >
                  View details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
