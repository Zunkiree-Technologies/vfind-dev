"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [menuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Search for: ${searchTerm} in ${locationTerm}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 flex-wrap">
          {/* Browse Jobs
          <Link
            href="/browse-jobs"
            className="hidden md:inline-block ml-2 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Browse Jobs
          </Link> */}

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center flex-1 max-w-3xl bg-white rounded-full shadow border border-gray-300 px-3 py-2 gap-3"
          >
            {/* Job Search */}
            <div className="flex items-center flex-1">
              <Image
                width={20}
                height={20}
                src="/icons/search.png"
                alt="search"
                className="m-2"
              />
              <input
                type="text"
                placeholder="Search by keyword, specialty, job title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Location Search */}
            <div className="flex items-center flex-1">
              <Image
                width={20}
                height={20}
                src="/icons/location.png"
                alt="location"
                className="m-2"
              />
              <input
                type="text"
                placeholder="City, State or Zip code"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition text-sm"
            >
              Search
            </button>
          </form>
         

          {/* Profile & Dropdown */}
          <div className="relative flex items-center">
             <Link
            href="/nurseProfile/connectedstatus"
            className="hidden md:inline-block ml-2 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Connected Request
          </Link>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer ml-4"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                <Image
                  src="/assets/profile.png"
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="40px"
                />
              </div>

              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${userMenuOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>

            </button>
            <div>
              <NotificationSidebar />
            </div>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md w-40 z-50">
                <Link
                  href="/nurseProfile/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/nurseProfile/connectedstatus"
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"

                >
                  Connections
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md z-40">
            <Link
              href="/browse-jobs"
              className="block w-full text-left px-4 py-3 text-blue-600 font-semibold hover:bg-gray-100"
            >
              Browse Jobs
            </Link>



            <div
              className="flex items-center space-x-3 mt-4 px-4 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                <Image
                  src="/assets/profile.png"
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="40px"
                />
              </div>
            </div>

            {userMenuOpen && (
              <div className="mt-2 border-t border-gray-200">
                <Link
                  href="/nurseProfile/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};
