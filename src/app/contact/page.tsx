"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Calendar, Mail } from "lucide-react";


// Public components
import NavbarPublic from "../../../components/navbar";
import FooterPublic from "../../../components/footer-section";

// Logged-in components
import { Navbar as NavbarPrivate } from "../nurseProfile/components/Navbar";
import FooterPrivate from "../Admin/components/layout/Footer";

export default function ContactUs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      document.cookie.includes("token=");
    setIsLoggedIn(!!token);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:gbZ4MFHH/contact_us",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      {isLoggedIn ? <NavbarPrivate /> : <NavbarPublic />}

      {/* Contact Section */}
      <div className="bg-[#f9fafb] flex justify-center items-center py-20 px-6">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-16">
          {/* Left Section - Contact Form */}
          <div className="flex-1">
            <h1 className="text-[34px] font-semibold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-black text-[16px] text-sm mb-2">
              Need to get in touch with us?
            </p>
            <p className="text-black text-[16px] text-sm mb-8">
              Either fill out the form or contact us at{" "}
              <a
                href="mailto:info@vfind.com"
                className="text-[#2563eb] hover:underline font-medium"
              >
                info@vfind.com
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-black mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Feedback */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Feedback
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Send Button */}
              <Button
                type="submit"
                className="w-[90px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm rounded-md font-medium py-2 transition"
              >
                Send
              </Button>
            </form>
          </div>

          {/* Right Section - Contact Info */}
          {/* -------------------- Right: Contact Info -------------------- */}
          <Card className="bg-gray-50 border-0 shadow-none rounded-2xl w-full md:w-1/3 text-gray-800">
            <CardContent className="">
              <h3 className="text-lg text-[18px] font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-6 text-sm">
                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-[2px]" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-[#717376] mt-[3px]">
                      04 23457855 / 61 0425145245
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-[2px]" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-[#717376]  mt-[3px]">
                      7:00 AM – 6:00 PM, Mon – Sat
                    </p>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500 mt-[2px]" />
                  <div>
                    <p className="font-medium">Weekdays</p>
                    <p className="text-[#717376]  mt-[3px]">
                      7:00 AM – 6:00 PM, Mon – Sat
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-[2px]" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:support@vfind.com"
                      className="text-[#717376]  mt-[3px]"
                    >
                      support@vfind.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      {isLoggedIn ? <FooterPrivate /> : <FooterPublic />}
    </div>
  );
}
