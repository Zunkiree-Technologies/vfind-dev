"use client";
import { Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-gray-200 min-h-fit  p-6 sm:p-8 md:p-10  border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[500px_1fr_1fr_1fr] gap-10 md:gap-8 lg:gap-12">
        
        {/* Logo & About */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4">
           
          <span className="text-lg font-bold">
            <span className="">V</span>FIND
          </span>
          </div>

          <p className="text-sm  leading-relaxed">
            VFind – A trusted platform that connects nurses and healthcare
            professionals with leading employers across Australia. We make the
            hiring process faster, simpler, and more reliable, while helping
            jobseekers build successful careers in the healthcare sector.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F6FA] border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F6FA] border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Explore Job */}
        <div>
          <h4 className="font-semibold  mb-4">Explore Jobs</h4>
          <ul className="space-y-2 text-sm ">
            <li>
              <Link href="/joblist" className=" transition">
                Job Listing
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold  mb-4">Important Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/blogs" className="transition">
                Resources
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold  mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm ">
          © {new Date().getFullYear()} | VFind Pty. Ltd.
        </div>
      </div>
    </footer>
  );
}
