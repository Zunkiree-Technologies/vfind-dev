"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { MapPin, Search, UserRound, Menu, X } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Pre-fill inputs if query params exist
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setLocationTerm(searchParams.get("location") || "");

    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, [searchParams]);

  // Detect outside clicks to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 250) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const updateQuery = debounce((s: string, l: string) => {
    router.replace(
      `/nurseProfile?search=${encodeURIComponent(s)}&location=${encodeURIComponent(l)}`
    );
  }, 250);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setMobileMenuOpen(false);
    router.push("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    if (token) {
      fetch("https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/get_nurse_profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileImage(data.profileImage?.url || null);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                router.push("/nurseProfile");
              } else {
                router.push("/");
              }
            }}
          >
            <span className="text-lg font-bold">
              <span className="text-primary">V</span>FIND
            </span>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablet */}
          <div className="hidden md:flex items-center flex-1 max-w-3xl bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5 gap-3">
            {/* Job Search */}
            <div className="flex items-center flex-1">
              <Search size={22} className="m-2 text-blue-600" />
              <input
                type="text"
                placeholder="Search by keyword, specialty, job title"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateQuery(e.target.value, locationTerm);
                }}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>

            <div className="w-px h-5 bg-gray-300"></div>

            {/* Location Search */}
            <div className="flex items-center flex-1">
              <MapPin size={22} className="m-2 text-blue-600" />
              <input
                type="text"
                placeholder="City, State or Zip code"
                value={locationTerm}
                onChange={(e) => {
                  setLocationTerm(e.target.value);
                  updateQuery(searchTerm, e.target.value);
                }}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Desktop Right Side - Hidden on mobile, visible on tablet */}
          <div className="hidden md:flex items-center gap-3">
            {authToken ? (
              <>
                <button
                  onClick={() => router.push("/nurseProfile/connectedstatus")}
                  className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px] text-sm whitespace-nowrap"
                >
                  Connection Request
                </button>

                {/* User Menu */}
                <div ref={userMenuRef} className="relative flex items-center">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <div className="relative w-10 h-10 rounded-full border border-gray-400 overflow-hidden hover:bg-gray-50">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="User Profile"
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                          priority
                          quality={100}
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                          <UserRound size={20} className="text-gray-700" />
                        </div>
                      )}
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform ${userMenuOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

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
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Connections
                      </Link>
                      <Link
                        href="/nurseProfile/SavedJobs"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Saved Jobs
                      </Link>
                      <Link
                        href="/nurseProfile/AppliedJobs"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Applied Jobs
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

                <NotificationSidebar />
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px] text-sm"
                >
                  Create an Account
                </button>
                <button
                  onClick={() => router.push("/signin")}
                  className="px-6 py-2 bg-gray-200 text-black font-medium hover:bg-gray-300 rounded-[10px] text-sm"
                >
                  Log In
                </button>
              </>
            )}
          </div>

          {/* Mobile Search Icon - Only visible on mobile */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            <div className="flex items-center gap-2 px-3   border border-gray-300 rounded-md bg-white shadow-md rounded-[10px]">
              <Search size={15} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search</span>
            </div>


          </button>

          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="flex md:hidden items-center gap-2">
            {authToken && <NotificationSidebar />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only visible on mobile when search is clicked */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5">
                <Search size={20} className="m-2 text-blue-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateQuery(e.target.value, locationTerm);
                  }}
                  className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5">
                <MapPin size={20} className="m-2 text-blue-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City, State or Zip code"
                  value={locationTerm}
                  onChange={(e) => {
                    setLocationTerm(e.target.value);
                    updateQuery(searchTerm, e.target.value);
                  }}
                  className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown - Only visible on mobile */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          {authToken ? (
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="relative w-12 h-12 rounded-full border border-gray-400 overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="User Profile"
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                      priority
                      quality={100}
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <UserRound size={24} className="text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700">My Account</div>
              </div>

              <Link
                href="/nurseProfile/connectedstatus"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Connection Request
              </Link>
              <Link
                href="/nurseProfile/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Profile
              </Link>
              <Link
                href="/nurseProfile/connectedstatus"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Connections
              </Link>
              <Link
                href="/nurseProfile/SavedJobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Saved Jobs
              </Link>
              <Link
                href="/nurseProfile/AppliedJobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Applied Jobs
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 rounded-md font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  router.push("/signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px]"
              >
                Create an Account
              </button>
              <button
                onClick={() => {
                  router.push("/signin");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-gray-200 text-black font-medium hover:bg-gray-300 rounded-[10px]"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};