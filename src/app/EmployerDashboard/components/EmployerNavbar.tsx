"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationSidebar from "./NotificationSidebar";
import { ChevronDown, Heart, Search, UserRound } from "lucide-react";

interface NavbarProps {
  companyName?: string;
}

export default function EmployerNavbar({ }: NavbarProps) {
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
      <div className="mx-auto container flex justify-around items-center px-4 md:px-6 py-3">
        {/* Left: Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/EmployerDashboard")}
        >
          {/* Icon inside a rounded square */}
          <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-[10px]">
            <Search size={16} className="text-white" />
          </div>

          <span className="font-semibold text-lg text-black">VFind</span>
        </div>


        {/* Right: Profile Icon */}
        <div className="relative flex  gap-5">
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => router.push("/EmployerDashboard/status")}
              className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px]"
            >
              <p className="text-sm"> Connection Request</p>
            </button>

            <button
              onClick={() => router.push("/EmployerDashboard/Wishlist")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-200
             "text-white" : "text-blue-600"
          }`}
              />
            </button>
          </div>

          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-1 focus:outline-none"
          >
            {/* User circle */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 hover:bg-gray-50">
              <UserRound size={20} className="text-gray-700" />
            </div>

            {/* Dropdown arrow */}
            <ChevronDown size={20} className="text-gray-700 hover:text-blue-600" />
          </button>

          <div>
            <NotificationSidebar />
          </div>

          {showProfileMenu && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-15 w-36 bg-white border rounded-md shadow-lg z-50"
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
