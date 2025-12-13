"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { MapPin, Search, UserRound, Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getCookie } from "@/utils/cookies";
import { getNurseProfile } from "@/lib/supabase-api";


export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Use auth context
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setLocationTerm(searchParams.get("location") || "");
  }, [searchParams]);

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
    logout(); // Uses auth context logout
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const token = getCookie("authToken") || localStorage.getItem("token");

    if (token && isAuthenticated) {
      getNurseProfile(token)
        .then((data) => {
          setProfileImage(data?.profile_image_url || null);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    } else {
      setProfileImage(null);
    }
  }, [isAuthenticated]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            onClick={() => {
              if (isAuthenticated) {
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

          {/* Desktop Navigation Links - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/nurseProfile/connectedstatus"
                  className={`font-medium text-sm transition-colors ${
                    isActive("/nurseProfile/connectedstatus")
                      ? "text-blue-400"
                      : "text-gray-700 hover:text-blue-400"
                  }`}
                >
                  Connection Requests
                </Link>
                <Link
                  href="/nurseProfile/SavedJobs"
                  className={`font-medium text-sm transition-colors ${
                    isActive("/nurseProfile/SavedJobs")
                      ? "text-blue-400"
                      : "text-gray-700 hover:text-blue-400"
                  }`}
                >
                  Saved Jobs
                </Link>
                <Link
                  href="/nurseProfile/AppliedJobs"
                  className={`font-medium text-sm transition-colors ${
                    isActive("/nurseProfile/AppliedJobs")
                      ? "text-blue-400"
                      : "text-gray-700 hover:text-blue-400"
                  }`}
                >
                  Applied Jobs
                </Link>
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

          {/* Desktop Search Bar - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center max-w-md bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5 gap-2">
            <div className="flex items-center flex-1">
              <Search size={18} className="mx-2 text-[#61A6FA]" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateQuery(e.target.value, locationTerm);
                }}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>

            <div className="w-px h-4 bg-gray-300"></div>

            <div className="flex items-center flex-1">
              <MapPin size={18} className="mx-2 text-[#61A6FA]" />
              <input
                type="text"
                placeholder="Location"
                value={locationTerm}
                onChange={(e) => {
                  setLocationTerm(e.target.value);
                  updateQuery(searchTerm, e.target.value);
                }}
                className="w-full text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Mobile Search Icon - Only visible on mobile and tablet */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md bg-white shadow-sm">
              <Search size={15} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Search</span>
            </div>
          </button>

          {/* Right Side - User Menu & Notification */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                

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
                      className={`w-4 h-4 text-gray-600 transition-transform hidden lg:block ${
                        userMenuOpen ? "rotate-180" : ""
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
                        onClick={() => setUserMenuOpen(false)}
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
                {/* Notification - Visible on all screens */}
                <NotificationSidebar />
              </>
            )}

            {/* Mobile Menu Button - Only visible on mobile and tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center bg-white rounded-xl shadow border border-gray-300 px-2 py-1.5">
                <Search size={20} className="m-2 text-blue-400 flex-shrink-0" />
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
                <MapPin size={20} className="m-2 text-blue-400 flex-shrink-0" />
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          {isAuthenticated ? (
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/nurseProfile/connectedstatus"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md font-medium ${
                  isActive("/nurseProfile/connectedstatus")
                    ? "text-blue-400 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Connection Requests
              </Link>
              <Link
                href="/nurseProfile/SavedJobs"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md font-medium ${
                  isActive("/nurseProfile/SavedJobs")
                    ? "text-blue-400 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Saved Jobs
              </Link>
              <Link
                href="/nurseProfile/AppliedJobs"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md font-medium ${
                  isActive("/nurseProfile/AppliedJobs")
                    ? "text-blue-400 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Applied Jobs
              </Link>
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