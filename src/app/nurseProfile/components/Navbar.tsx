"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { Search, UserRound } from "lucide-react";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [menuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill inputs if query params exist
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setLocationTerm(searchParams.get("location") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (locationTerm) params.set("location", locationTerm);

    router.push(`/nurseProfile?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 flex-wrap">

          {/* Left: Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/nurseProfile")}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-[10px]">
              <Search size={16} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-black">VFind</span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center flex-1 max-w-3xl bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5 gap-3"
          >
            {/* Job Search */}
            <div className="flex items-center flex-1">
              <Image
                width={18}
                height={18}
                src="/icons/search.png"
                alt="search"
                className="m-2"
              />
              <input
                type="text"
                placeholder="Search by keyword, specialty, job title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300"></div>

            {/* Location Search */}
            <div className="flex items-center flex-1">
              <Image
                width={18}
                height={18}
                src="/icons/location.png"
                alt="location"
                className="m-2"
              />
              <input
                type="text"
                placeholder="City, State or Zip code"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-1.5 rounded-xl font-medium transition text-sm"
            >
              Search
            </button>
          </form>

          {/* Profile & Dropdown */}
          <div className="relative flex items-center">
            <button
              onClick={() => router.push("/nurseProfile/connectedstatus")}
              className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px]"
            >
              <p className="text-sm">Connection Request</p>
            </button>

            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer ml-4"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 hover:bg-gray-50">
                <UserRound size={20} className="text-gray-700" />
              </div>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <NotificationSidebar />

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md w-40 z-50">
                <Link href="/nurseProfile/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link href="/nurseProfile/connectedstatus" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Connections</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md z-40">
            <div
              className="flex items-center space-x-3 mt-4 px-4 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                <Image src="/assets/profile.png" alt="Profile" fill style={{ objectFit: "cover" }} sizes="40px" />
              </div>
            </div>
            {userMenuOpen && (
              <div className="mt-2 border-t border-gray-200">
                <Link href="/nurseProfile/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
