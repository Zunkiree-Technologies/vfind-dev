"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Calendar, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submitContactForm } from "@/lib/supabase-api";

// Public components
import NavbarPublic from "../../../components/navbar";
import FooterPublic from "../../../components/footer-section";

// Logged-in components
import { Navbar as NurseNavbar } from "../nurseProfile/components/Navbar";
import EmployerNavbar from "../EmployerDashboard/components/EmployerNavbar";
import FooterPrivate from "../Admin/components/layout/Footer";

export default function ContactUs() {
  const { isAuthenticated, user } = useAuth();

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
      const result = await submitContactForm({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: formData.message,
      });

      if (result) {
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
      {/* Conditional Navbar based on user role */}
      {!isAuthenticated ? (
        <NavbarPublic />
      ) : user.role === "Employer" ? (
        <EmployerNavbar />
      ) : (
        <NurseNavbar />
      )}

      {/* Contact Section */}
      <div className="bg-[#f9fafb] flex justify-center items-center py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Section - Contact Form */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-400 mb-4">
              Contact Us
            </h1>
            <p className="text-black text-base md:text-lg mb-2">
              Need to get in touch with us?
            </p>
            <p className="text-black text-base md:text-lg mb-8">
              Either fill out the form or contact us at{" "}
              <a
                href="mailto:info@vfind.com"
                className="text-primary hover:underline font-medium"
              >
                info@vfind.com
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm md:text-base font-medium text-black mb-2"
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
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm md:text-base font-medium text-black mb-2"
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
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-medium text-black mb-2"
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
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Feedback */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm md:text-base font-medium text-black mb-2"
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
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Send Button */}
              <Button
                type="submit"
                className="w-full sm:w-[120px] bg-blue-400 text-white text-sm md:text-base rounded-md font-medium py-2.5 transition hover:bg-blue-500"
              >
                Send
              </Button>
            </form>
          </div>

          {/* Right Section - Contact Info */}
          {/* -------------------- Right: Contact Info -------------------- */}
          <Card className="bg-gray-50 border-0 shadow-none rounded-2xl w-full md:w-1/3 text-gray-800">
            <CardContent className="p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-6 text-sm md:text-base">
                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-[#717376] mt-1">
                      04 23457855 / 61 0425145245
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-[#717376] mt-1">
                      7:00 AM – 6:00 PM, Mon – Sat
                    </p>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Weekdays</p>
                    <p className="text-[#717376] mt-1">
                      7:00 AM – 6:00 PM, Mon – Sat
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:support@vfind.com"
                      className="text-[#717376] mt-1 block hover:underline"
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
      {isAuthenticated ? <FooterPrivate /> : <FooterPublic />}
    </div>
  );
}
