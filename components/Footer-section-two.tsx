"use client";
import { Linkedin, Instagram, Search } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1F3C88] text-gray-200">
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[500px_1fr_1fr_1fr] gap-10">
  {/* Logo & About */}
  <div>
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-blue-400 p-2 rounded-lg">
        <Search size={16} className="text-white" />
      </div>
      <h3 className="text-white font-semibold text-lg">VFind</h3>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed">
      VFind – A trusted platform that connects nurses and healthcare professionals with leading employers across Australia.
      We make the hiring process faster, simpler, and more reliable, while helping jobseekers build successful careers
      in the healthcare sector.
    </p>

    {/* Social Icons */}
    <div className="flex gap-4 mt-5">
      <a
        href="#"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-700 hover:bg-gray-100"
      >
        <Linkedin size={18} />
      </a>
      <a
        href="#"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-700 hover:bg-gray-100"
      >
        <Instagram size={18} />
      </a>
    </div>
  </div>

  {/* Explore Job */}
  <div>
    <h4 className="text-white font-semibold mb-4">Explore Job</h4>
    <ul className="space-y-2 text-sm">
      <li>
        <a href="#Featurejobs" className="hover:text-white">Job Listing</a>
      </li>
    </ul>
  </div>

  {/* Resources */}
  <div>
    <h4 className="text-white font-semibold mb-4">Resources</h4>
    <ul className="space-y-2 text-sm">
      <li><a href="blogs" className="hover:text-white">Blogs</a></li>
      <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
      <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
    </ul>
  </div>

  {/* Quick Links */}
  <div>
    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
    <ul className="space-y-2 text-sm">
      <li><a href="#" className="hover:text-white">Contact Us</a></li>
      <li><a href="#" className="hover:text-white">About Us</a></li>
    </ul>
  </div>
</div>


            {/* Bottom Bar */}
            <div className="border-t border-white mt-10">
                <div className="container mx-auto px-6 py-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} | VFind Pvt. Ltd.
                </div>
            </div>
        </footer>
    );
}
