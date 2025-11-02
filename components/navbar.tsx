"use client";


import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isForEmployersDropdownOpen, setIsForEmployersDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for detecting outside clicks
  const authRef = useRef<HTMLDivElement>(null);
  const employerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <nav className="shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: Logo */}

        <Link href="/" className="flex items-center space-x-2 cursor-pointer">


          <span className="text-lg font-bold">
            <span className="text-primary">V</span>FIND
          </span>


        </Link>


        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <Link href="/blogs" className="text-gray-700 dark:text-gray-200 hover:text-[#477fff] px-3 py-2 text-sm font-medium">
            Resources
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-[#477fff] px-3 py-2 text-sm font-medium">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-[#477fff]  px-3 py-2 text-sm font-medium">
            Contact Us
          </Link>

          {/* For Seekers Dropdown */}
          <div className="relative" ref={authRef}>
            <button
              onClick={toggleAuthDropdown}
              className="flex items-center text-gray-700 px-4 py-2 text-sm font-medium hover:text-[#477fff] "
            >
              For Seekers
              <ChevronDown
                className={`ml-2 w-4 h-4 text-primary transition-transform duration-300 ${isAuthDropdownOpen ? "rotate-180" : ""
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
              className="flex items-center text-gray-700 px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:text-[#477fff] "
            >
              For Employers
              <ChevronDown
                className={`ml-2 w-4 h-4 text-primary transition-transform duration-300 ${isForEmployersDropdownOpen ? "rotate-180" : ""
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
            onClick={() => router.push("/joblist")}
            className="group relative flex items-center justify-center px-6 w-[140px] py-2 bg-blue-400 text-white font-medium rounded-[10px] transition-all duration-300  overflow-hidden"
          >
            <p className="text-sm transition-all duration-300 group-hover:-translate-x-1">
              Find Jobs
            </p>
            <span className="absolute right-5 flex items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </span>
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
          <Link href="/blogs" className="block text-gray-700 hover:text-[#477fff]  px-3 py-2 rounded">
            Resources
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-[#477fff]  px-3 py-2 rounded">
            About Us
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:text-[#477fff]  px-3 py-2 rounded">
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

          {/* Mobile Find Jobs Button */}
          <button
            onClick={() => router.push("/joblist")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-blue-400 text-white font-medium rounded-lg transition-all duration-300 hover:bg-blue-500"
          >
            <span className="text-sm">Find Jobs</span>
            <ArrowRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      )}
    </nav>
  );
}