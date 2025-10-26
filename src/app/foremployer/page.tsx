"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import { ArrowRight, CheckCircle } from "lucide-react";
import Footer from "../../../components/footer-section";

export default function EmployerPage() {
  const [mobile, setMobile] = useState("");
  const [checked, setChecked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const router = useRouter();

  // Refs for OTP input boxes
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Australian mobile validation: exactly 8 digits (04 prefix is already shown)
  const isValidAUSNumber = /^\d{8}$/.test(mobile);

  const canSendOTP = isValidAUSNumber && checked;

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    if (/^\d?$/.test(value)) { // Allow only one digit or empty
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if digit entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // On backspace, if current box is empty, focus previous input
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (!mobile) {
      alert("Mobile number is required");
      return;
    }
    // Combine 04 prefix with the entered 8 digits
    const fullMobile = "04" + mobile;
    router.push(`/registrationpage?mobile=${encodeURIComponent(fullMobile)}`);
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-fit flex items-center justify-center   py-10  px-4 sm:px-6">


        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
          {/* Left Section */}

          <div
            className="hidden md:flex flex-col justify-between w-full lg:w-[627px] lg:h-[480px] p-10 rounded-2xl shadow-md bg-[linear-gradient(to_top,#61A6FA_0%,#AAD0FD_20%,#F4F9FF_100%)]"
          >
            <div className="mt-5 ml-10">
              <h2 className="text-2xl font-bold  text-gray-800 ">
                Find & hire the right talent with us
              </h2>
              <ul className="space-y-3 text-[#474D6A] font-weight-medium text-sm  ">

                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 bg-white rounded-full" />
                  <span className=" font-regular text-[14px]  text-black " >Post jobs and reach verified healthcare professionals.</span>
                </li>

                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 bg-white rounded-full" />
                  <span className=" font-regular text-[14px]  text-black "  > View detailed nurse profiles and credentials.</span>
                </li>
                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 bg-white rounded-full" />
                  <span className=" font-regular text-[14px]  text-black "  >  Connect directly with top nursing talent.</span>
                </li>
                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 bg-white rounded-full" />
                  <span className=" font-regular text-[14px]  text-black " > Build your trusted employer brand.</span>
                </li>

              </ul>
              <button
                onClick={() => router.push("/foremployer")}
                className="group mt-6 h-[38px] w-[225px] text-white bg-[#4A90E2] rounded-[8px] shadow transition-all duration-300 overflow-hidden flex items-center justify-center font-medium"
              >
                <span className="flex items-center gap-2">
                  <span className="transition-all duration-300 group-hover:-translate-x-1">
                    Register for Free
                  </span>
                  <ArrowRight
                    className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    strokeWidth={3}
                  />
                </span>
              </button>

            </div>

          </div>
          {/* Right Section (Dynamic) */}
          <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md h-[313px]">
            {!otpSent ? (
              <>
                <h2 className="text-[22px] font-medium text-[#121224] mt-2">
                  Continue with mobile
                </h2>
                <div className="mt-5">
                  <label className="block text-sm text-[#091E42] mb-1">
                    Mobile number
                  </label>
                  <div className="w-full h-[40px] flex items-center border rounded-[25px] overflow-hidden">
                    <span className="px-3 text-gray-700 select-none border-r">04</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter 8 digits"
                      className="w-full px-3 py-2 outline-none"
                      maxLength={8} // Limit to 8 digits only
                    />
                  </div>
                  {!isValidAUSNumber && mobile.length > 0 && (
                    <p className="text-red-500 text-xs mt-2">
                      Please enter your number
                    </p>
                  )}
                </div>
                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mr-2"
                  />
                  <p className="text-xs text-gray-600">
                    I agree to the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Terms & Conditions
                    </a>
                  </p>
                </div>
                <button
                  disabled={!canSendOTP}
                  onClick={() => {
                    setOtpSent(true);
                    // Optional: store the mobile or do other side effects here
                  }}
                  className={`group mt-5 w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center overflow-hidden ${canSendOTP
                    ? "bg-blue-400 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="transition-all duration-300 group-hover:-translate-x-1">
                      Send OTP
                    </span>
                    {canSendOTP && (
                      <ArrowRight
                        className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </button>

              </>
            ) : (
              <>
                <h2 className="text-[22px] font-medium text-[#121224] mt-2">
                  Enter the OTP sent to SMS on
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>04{mobile}</strong>
                </p>
                <div className="mt-5">
                  <label className="block text-sm text-[#091E42] mb-1">
                    Enter OTP
                  </label>
                  <div className="flex gap-2 justify-between max-w-xs">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center border rounded-md text-xl outline-none"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        ref={(el: HTMLInputElement | null) => {
                          inputRefs.current[index] = el;
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 ">
                  Didnt receive it? {" "}
                  <button
                    onClick={() => alert("Resend OTP")}
                    className="text-blue-400 underline"
                  >
                    Resend OTP
                  </button>
                </p>
                <button
                  onClick={handleVerifyOtp}
                  className="group mt-5 w-full py-2 rounded-lg bg-blue-400 text-white transition-all duration-300 overflow-hidden flex items-center justify-center"
                >
                  <span className="flex items-center gap-2">
                    <span className="transition-all duration-300 group-hover:-translate-x-1">
                      Verify OTP
                    </span>
                    <ArrowRight
                      className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      strokeWidth={3}
                    />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
      <div className="bg-[#1F3C88] ">
        <Footer />
      </div>
    </div>
  );
}