"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import router from "next/router";

export default function Navbar() {
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isForEmployersDropdownOpen, setIsForEmployersDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for detecting outside clicks
  const authRef = useRef<HTMLDivElement>(null);
  const employerRef = useRef<HTMLDivElement>(null);

  const toggleAuthDropdown = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
    setIsForEmployersDropdownOpen(false);
  };

  const toggleEmployersDropdown = () => {
    setIsForEmployersDropdownOpen(!isForEmployersDropdownOpen);
    setIsAuthDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsAuthDropdownOpen(false);
    setIsForEmployersDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authRef.current &&
        !authRef.current.contains(event.target as Node) &&
        employerRef.current &&
        !employerRef.current.contains(event.target as Node)
      ) {
        setIsAuthDropdownOpen(false);
        setIsForEmployersDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="shadow-md px-4 py-2 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        {/* Left: Logo */}

        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-[10px]">
            <Search size={16} className="text-white" />
          </div>

          <span className="font-bold text-lg text-black">VFind</span>
        </Link>


        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <Link href="/blogs" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 text-sm font-medium">
            Blogs
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 text-sm font-medium">
            Contact Us
          </Link>

          {/* For Seekers Dropdown */}
          <div className="relative" ref={authRef}>
            <button
              onClick={toggleAuthDropdown}
              className="flex items-center text-black px-4 py-2 text-sm font-medium"
            >
              For Seekers
              <ChevronDown
                className={`ml-2 w-4 h-4 text-red-500 transition-transform duration-300 ${isAuthDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isAuthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-45 bg-white rounded-md shadow-lg border z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link href="/signin" className="block px-4 py-2 hover:bg-gray-100">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="block px-4 py-2 hover:bg-gray-100">
                      Create an Account
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* For Employers Dropdown */}
          <div className="relative" ref={employerRef}>
            <button
              onClick={toggleEmployersDropdown}
              className="flex items-center text-black px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              For Employers
              <ChevronDown
                className={`ml-2 w-4 h-4 text-red-500 transition-transform duration-300 ${isForEmployersDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isForEmployersDropdownOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg border z-50 mt-2">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link href="/employerloginpage" className="block px-4 py-2 hover:bg-gray-100">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/foremployer" className="block px-4 py-2 hover:bg-gray-100">
                      Create an Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/foremployer" className="block px-4 py-2 hover:bg-gray-100">
                      Post a Free Job
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-400 text-white font-medium hover:bg-blue-500 rounded-[10px]"
          >
            <p className="text-sm"> Find Jobs</p>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-200">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-2 border-t">
          <Link href="/blogs" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
            Blogs
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
            About
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
            Contact Us
          </Link>

          {/* Mobile For Seekers */}
          <div className="relative">
            <button
              onClick={toggleAuthDropdown}
              className="flex justify-between w-full items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              For Seekers
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isAuthDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isAuthDropdownOpen && (
              <ul className="pl-4 mt-1 space-y-1">
                <li>
                  <Link href="/signin" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Create an Account
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Mobile For Employers */}
          <div className="relative">
            <button
              onClick={toggleEmployersDropdown}
              className="flex justify-between w-full items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              For Employers
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isForEmployersDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isForEmployersDropdownOpen && (
              <ul className="pl-4 mt-1 space-y-1">
                <li>
                  <Link href="/employerloginpage" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/foremployer" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Create an Account
                  </Link>
                </li>
                <li>
                  <Link href="/foremployer" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Post a Free Job
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
