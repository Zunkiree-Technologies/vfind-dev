"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Clock } from "lucide-react";

export const SearchBar = () => {
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (jobTitle) params.set("search", jobTitle);
    if (city) params.set("location", city);
    if (experience) params.set("experience", experience);

    // Navigate to jobdata page with query params
    router.push(`/nurseProfile?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 max-w-4xl mx-auto shadow-md">
      {/* Job Title */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md flex-1 bg-white">
        <Briefcase className="text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md flex-1 bg-white">
        <MapPin className="text-gray-400 h-4 w-4" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full text-sm bg-transparent outline-none text-gray-600"
        >
          <option value="">City</option>
          <option value="sydney">Sydney, NSW</option>
          <option value="melbourne">Melbourne, VIC</option>
          <option value="brisbane">Brisbane, QLD</option>
          <option value="perth">Perth, WA</option>
          <option value="adelaide">Adelaide, SA</option>
          <option value="canberra">Canberra, ACT</option>
        </select>
      </div>

      {/* Experience */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md flex-1 bg-white">
        <Clock className="text-gray-400 h-4 w-4" />
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full text-sm bg-transparent outline-none text-gray-600"
        >
          <option value="">Experience</option>
          <option value="new">Starting</option>
          <option value="entry">Less than 1 year</option>
          <option value="mid">1–3 years</option>
          <option value="senior">3–5 years</option>
          <option value="expert">More than 5 years</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#61A6FA] text-white hover:bg-[#477fff] transition"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};
