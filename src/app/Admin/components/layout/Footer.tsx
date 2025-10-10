"use client";
import { Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className=" text-gray-200 min-h-fit p-4 mt-4">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-[500px_1fr_1fr_1fr] gap-10">
                {/* Logo & About */}
                <div>
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer">


                        <span className="text-lg font-bold text-black">
                            <span className="text-primary">V</span> FIND
                        </span>


                    </Link>
                    <p className="text-sm text-black leading-relaxed">
                        VFind – A trusted platform that connects nurses and healthcare professionals with leading employers across Australia.
                        We make the hiring process faster, simpler, and more reliable, while helping jobseekers build successful careers
                        in the healthcare sector.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-5">
                        <a
                            href="#"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F6FA] border border-blue-400  text-blue-400"

                        >
                            <Linkedin size={18} />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F6FA]  border border-blue-400  text-blue-400"

                        >
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>

                {/* Explore Job */}
                <div>
                    <h4 className="text-black  font-semibold mb-4">Explore Job</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="" className="text-black ">Job Listing</a>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="text-black  font-semibold mb-4">Important Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="blogs" className="text-black ">Resources</a></li>
                        <li><a href="" className="text-black ">Privacy Policy</a></li>
                        <li><a href="" className="text-black ">Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-black  font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/contact" className="text-black ">Contact Us</a></li>
                        <li><a href="/about" className="text-black ">About Us</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-black ">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-center text-sm text-black">
                    {new Date().getFullYear()} | VFind Pty. Ltd.
                </div>
            </div>
        </footer>
    );
}
