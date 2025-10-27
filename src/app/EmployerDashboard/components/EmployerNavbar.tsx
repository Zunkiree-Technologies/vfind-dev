"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { ChevronDown, UserRound, Menu, X } from "lucide-react";

interface NavbarProps {
  companyName?: string;
}

export default function EmployerNavbar({}: NavbarProps) {
  const router = useRouter();
  const [showDesktopProfileMenu, setShowDesktopProfileMenu] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  // Close desktop profile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDesktopProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile profile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="mx-auto container flex justify-around items-center px-5 md:px-6 py-3 ">
        {/* Left: Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/EmployerDashboard")}
        >
          <span className="text-lg font-bold">
            <span className="text-primary">V</span>FIND
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => router.push("/EmployerDashboard/Candidatelist")}
            className="px-4 xl:px-6 py-2 text-gray-700 hover:text-[#477fff] text-sm font-medium whitespace-nowrap"
          >
            Search Candidate
          </button>
          <button
            onClick={() => router.push("/EmployerDashboard/jobposting")}
            className="px-4 xl:px-6 py-2 text-gray-700 hover:text-[#477fff] text-sm font-medium whitespace-nowrap"
          >
            Post a Job
          </button>
          <button
            onClick={() => router.push("/EmployerDashboard/status")}
            className="px-4 xl:px-6 py-2 text-gray-700 hover:text-[#477fff] text-sm font-medium whitespace-nowrap"
          >
            Connection Request
          </button>
          <button
            onClick={() => router.push("/EmployerDashboard/Wishlist")}
            className="px-4 xl:px-6 py-2 text-gray-700 hover:text-[#477fff] text-sm font-medium whitespace-nowrap"
          >
            Saved Candidates
          </button>
        </div>

        {/* Right: Profile Icon & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Profile & Notification */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDesktopProfileMenu(!showDesktopProfileMenu);
                }}
                className="flex items-center gap-1 focus:outline-none"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 hover:bg-gray-50">
                  <UserRound size={20} className="text-gray-700" />
                </div>
                <ChevronDown size={20} className="text-gray-700 hover:text-blue-600" />
              </button>

              {showDesktopProfileMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      router.push("/EmployerDashboard/employprofile");
                      setShowDesktopProfileMenu(false);
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

            <NotificationSidebar />
          </div>

          {/* Mobile Profile & Notification */}
          <div className="flex lg:hidden items-center gap-3">
            <NotificationSidebar />
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileProfileMenu(!showMobileProfileMenu);
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 hover:bg-gray-50"
              >
                <UserRound size={20} className="text-gray-700" />
              </button>

              {showMobileProfileMenu && (
                <div className="absolute right-0 mt-2 w-38 bg-white  rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      router.push("/EmployerDashboard/employprofile");
                      setShowMobileProfileMenu(false);
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col px-4 py-2">
            <button
              onClick={() => {
                router.push("/EmployerDashboard/Candidatelist");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Search Candidate
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/jobposting");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Post a Job
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/status");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Connection Request
            </button>
            <button
              onClick={() => {
                router.push("/EmployerDashboard/Wishlist");
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Saved Candidates
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
