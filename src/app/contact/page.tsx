"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer-section";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Fix typing here
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:gbZ4MFHH/contact_us",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error occurred: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <Navbar />

      
      <div className="flex justify-center items-center py-16 px-6 bg-gray-50 ">
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl items-start">
          {/* Left Side: Map + Info */}
          <div className="flex-1 h-[600px]">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
            <p className="mb-2 text-gray-600">Need to get in touch with us?</p>
            <p className="mb-6 text-gray-600">
              Either fill out the form or contact us at {" "}
              <a
                href="mailto:info@vfind.com"
                className="text-primary underline font-medium"
              >
                info@vfind.com
              </a>
            </p>


            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d271.7302561497269!2d85.30364919359299!3d27.675390939707295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b0cf2ce96c5%3A0x4f3ed477e4f68c22!2sSimplifycodes%20(%20Simplify%20Tech%20Pvt.%20Ltd.%20)!5e1!3m2!1sen!2snp!4v1758707183808!5m2!1sen!2snp"
              width="100%"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl shadow-md"
            ></iframe>
          </div>


          {/* Right Side: Form */}
          <Card className="flex-1 shadow-lg border-0 rounded-2xl h-[550px]">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                />

                <label
                  htmlFor="Feedback"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Feedback
                </label>
                <textarea
                  name="message"
                  placeholder="What can we help you with?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                ></textarea>


                <Button type="submit" className="w-full bg-primary hover:bg-[#477fff] text-white py-3 rounded-lg text-lg">
                  SEND MESSAGE
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

     
         <div className="bg-[#1F3C88] ">
                <Footer />
              </div>
    </div>

  );
}
