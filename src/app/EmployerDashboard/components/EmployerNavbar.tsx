"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import NotificationSidebar from "./NotificationSidebar";

interface NavbarProps {
  companyName?: string;
}

export default function EmployerNavbar({ companyName }: NavbarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md w-full mx-auto container">
      <div className="mx-auto container flex justify-between items-center px-4 md:px-6 py-3">
        {/* Left: Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/EmployerDashboard")}
        >
          <span className="font-semibold text-lg text-blue-800">
            {companyName || "VFind"}
          </span>
        </div>

        {/* Right: Profile Icon */}
        <div className="relative flex gap-5">
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => router.push("/EmployerDashboard/status")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Candidate Request
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard/jobposting")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Post Job
            </button>
            <button
              onClick={() => router.push("/EmployerDashboard/Wishlist")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              WishList
            </button>
          </div>

          <button
            onClick={toggleProfileMenu}
            className="flex items-center focus:outline-none"
          >
            <FaUserCircle size={24} className="text-gray-700 hover:text-blue-600" />
          </button>

          <div>
            <NotificationSidebar />
          </div>

          {showProfileMenu && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-8 w-36 bg-white border rounded-md shadow-lg z-50"
            >
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
                  localStorage.clear();
                  sessionStorage.clear();
                  if ("caches" in window) {
                    caches.keys().then((cacheNames) => {
                      cacheNames.forEach((name) => caches.delete(name));
                    });
                  }
                  router.push("/employerloginpage");
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
              <button
                onClick={() => router.push("/EmployerDashboard/status")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                Candidate Request
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
