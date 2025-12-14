"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  UserPlus,
  Search,
  LogIn,
  Building2,
  Users,
  FileText,
  BookOpen,
  Info,
  Mail,
  HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileDropdown(null);
  };

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl lg:text-2xl font-bold tracking-tight">
              <span className="text-pink-600">V</span>
              <span className="text-gray-900">FIND</span>
            </span>
          </Link>

          {/* Desktop Menu - Nav items + Buttons grouped on right */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {/* For Nurses Dropdown - Hover */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-gray-700 rounded-full group-hover:bg-gray-100 group-hover:text-gray-900 transition-all duration-200">
                For Nurses
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {/* Dropdown - Shows on hover */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <UserPlus className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Create Profile
                    </span>
                  </Link>
                  <Link
                    href="/joblist"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <Search className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Browse Jobs
                    </span>
                  </Link>
                  <Link
                    href="/signin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <LogIn className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Sign In
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* For Employers Dropdown - Hover */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-gray-700 rounded-full group-hover:bg-gray-100 group-hover:text-gray-900 transition-all duration-200">
                For Employers
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {/* Dropdown - Shows on hover */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-60 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                  <Link
                    href="/employerloginpage"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <LogIn className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Employer Login
                    </span>
                  </Link>
                  <Link
                    href="/foremployer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <Building2 className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Create Account
                    </span>
                  </Link>
                  <Link
                    href="/foremployer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <FileText className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Post a Free Job
                    </span>
                  </Link>
                  <Link
                    href="/foremployer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Browse Candidates
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources Dropdown - Hover */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium text-gray-700 rounded-full group-hover:bg-gray-100 group-hover:text-gray-900 transition-all duration-200">
                Resources
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {/* Dropdown - Shows on hover */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-52 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                  <Link
                    href="/blogs"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <BookOpen className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Blog
                    </span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <Info className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      About Us
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <Mail className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      Contact
                    </span>
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-pink-50 transition-colors group/item"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50 group-hover/item:bg-pink-100 transition-colors">
                      <HelpCircle className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-700 group-hover/item:text-pink-600 transition-colors">
                      FAQs
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pricing - Direct Link */}
            <Link
              href="/contact"
              className="px-4 py-2 text-[15px] font-medium text-gray-700 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              Pricing
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-3"></div>

            {/* Sign In - Outlined Pill Button */}
            <Link
              href="/signin"
              className="px-5 py-1.5 text-[13px] font-semibold text-gray-700 border border-gray-300 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
            >
              SIGN IN
            </Link>

            {/* Create Profile - Primary CTA Pill */}
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-[13px] font-semibold rounded-full transition-all duration-200 hover:shadow-lg ml-2"
            >
              CREATE PROFILE
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Border Line - Subtle gray like AssessFirst */}
      <div className="h-[1px] bg-gray-200" />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            {/* For Nurses - Mobile */}
            <div>
              <button
                onClick={() => toggleMobileDropdown("nurses")}
                className="flex justify-between w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
              >
                For Nurses
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileDropdown === "nurses" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileDropdown === "nurses" && (
                <div className="mt-2 ml-2 space-y-1 bg-gray-50 rounded-xl p-2">
                  <Link href="/signup" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <UserPlus className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Create Profile</span>
                  </Link>
                  <Link href="/joblist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <Search className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Browse Jobs</span>
                  </Link>
                  <Link href="/signin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <LogIn className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* For Employers - Mobile */}
            <div>
              <button
                onClick={() => toggleMobileDropdown("employers")}
                className="flex justify-between w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
              >
                For Employers
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileDropdown === "employers" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileDropdown === "employers" && (
                <div className="mt-2 ml-2 space-y-1 bg-gray-50 rounded-xl p-2">
                  <Link href="/employerloginpage" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <LogIn className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Employer Login</span>
                  </Link>
                  <Link href="/foremployer" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <Building2 className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Create Account</span>
                  </Link>
                  <Link href="/foremployer" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <FileText className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Post a Free Job</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Resources - Mobile */}
            <div>
              <button
                onClick={() => toggleMobileDropdown("resources")}
                className="flex justify-between w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
              >
                Resources
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileDropdown === "resources" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileDropdown === "resources" && (
                <div className="mt-2 ml-2 space-y-1 bg-gray-50 rounded-xl p-2">
                  <Link href="/blogs" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <BookOpen className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Blog</span>
                  </Link>
                  <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <Info className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">About Us</span>
                  </Link>
                  <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-white rounded-lg transition-colors">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-pink-50">
                      <Mail className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Contact</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing - Mobile */}
            <Link
              href="/contact"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
            >
              Pricing
            </Link>

            {/* Mobile Buttons */}
            <div className="pt-4 space-y-3 border-t border-gray-100 mt-4">
              <Link
                href="/signin"
                className="block w-full text-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-pink-600 hover:text-pink-600 transition-colors"
              >
                SIGN IN
              </Link>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition-all duration-200"
              >
                CREATE PROFILE
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
