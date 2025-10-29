"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { UserRound, Menu, X } from "lucide-react";

interface NavbarProps {
  companyName?: string;
}

export default function EmployerNavbar({}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            onClick={() => router.push("/EmployerDashboard")}
          >
            <span className="text-lg font-bold">
              <span className="text-primary">V</span>FIND
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => router.push("/EmployerDashboard/Candidatelist")}
              className={`font-medium text-sm transition-colors whitespace-nowrap ${
                isActive("/EmployerDashboard/Candidatelist")
                  ? "text-blue-400"
                  : "text-gray-700 hover:text-blue-400"
              }`}
            >
              Search Candidate
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard/jobposting")}
              className={`font-medium text-sm transition-colors whitespace-nowrap ${
                isActive("/EmployerDashboard/jobposting")
                  ? "text-blue-400"
                  : "text-gray-700 hover:text-blue-400"
              }`}
            >
              Post a Job
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard/status")}
              className={`font-medium text-sm transition-colors whitespace-nowrap ${
                isActive("/EmployerDashboard/status")
                  ? "text-blue-400"
                  : "text-gray-700 hover:text-blue-400"
              }`}
            >
              Connection Requests
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard/Wishlist")}
              className={`font-medium text-sm transition-colors whitespace-nowrap ${
                isActive("/EmployerDashboard/Wishlist")
                  ? "text-blue-400"
                  : "text-gray-700 hover:text-blue-400"
              }`}
            >
              Saved Candidates
            </button>
          </div>

          {/* Right Side - Profile, Notification & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Notification - Visible on all screens */}
            <NotificationSidebar />

            {/* Profile Menu */}
            <div ref={profileMenuRef} className="relative flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <div className="relative w-10 h-10 rounded-full border border-gray-400 overflow-hidden hover:bg-gray-50">
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <UserRound size={20} className="text-gray-700" />
                  </div>
                </div>

                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform hidden lg:block ${
                    showProfileMenu ? "rotate-180" : ""
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

              {showProfileMenu && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md w-40 z-50">
                  <button
                    onClick={() => {
                      router.push("/EmployerDashboard/employprofile");
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      sessionStorage.clear();
                      router.push("/employerloginpage");
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Only visible on mobile and tablet */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => {
                router.push("/EmployerDashboard/Candidatelist");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                isActive("/EmployerDashboard/Candidatelist")
                  ? "text-blue-400 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Search Candidate
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/jobposting");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                isActive("/EmployerDashboard/jobposting")
                  ? "text-blue-400 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Post a Job
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/status");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                isActive("/EmployerDashboard/status")
                  ? "text-blue-400 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Connection Requests
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/Wishlist");
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                isActive("/EmployerDashboard/Wishlist")
                  ? "text-blue-400 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Saved Candidates
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}