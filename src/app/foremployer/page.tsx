"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";

export default function EmployerPage() {
  const [mobile, setMobile] = useState("");
  const [checked, setChecked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const router = useRouter();

  // Refs for OTP input boxes
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Australian mobile validation: starts with 04 or 4 and is 10 digits long
  const isValidAUSNumber = /^(?:\+?61|0)4\d{8}$/.test(mobile);
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
    router.push(`/registrationpage?mobile=${encodeURIComponent(mobile)}`);
  };



  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6">

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
          {/* Left Section */}
          <div
            style={{
              background:
                "linear-gradient(160deg, rgba(255, 255, 255, 0.22) 0%, rgba(238, 174, 202, 0.14) 72%, rgba(39, 93, 245, 0.11) 100%)",
            }}
            className="hidden md:flex flex-col justify-center w-full lg:w-[699px] h-auto md:h-[400px] lg:h-[481px] rounded-2xl shadow p-6 md:p-8 lg:p-10"
          >
            <h1 className="text-[48px] font-bold text-[#121224] leading-tight">
              Find & hire the right <br /> talent with us
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#474D6A]">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/check.png"
                  alt="Check Icon"
                  width={14}
                  height={14}
                  className="text-white"
                />
                Trusted by 9 Cr+ candidates | 5 Lakh+ employers
              </div>
            </div>
            <div className="mt-4 flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  width={32}
                  height={32}
                  src="/assets/profile.png"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="Employer Avatar"
                />
              ))}
            </div>
            <div className="mt-auto flex justify-end">
              <div className="w-35 mb-2 h-35 rounded-full overflow-hidden">
                <Image
                  src="/assets/profile.png"
                  alt="Login Illustration"
                  width={194}
                  height={194}
                  className="object-cover"
                />
              </div>
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
                    <span className="px-3 text-gray-700 select-none">+61</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full px-3 py-2 outline-none"
                    />
                  </div>
                  {!isValidAUSNumber && mobile.length > 0 && (
                    <p className="text-red-500 text-xs mt-2">
                      Enter a valid Australian number (e.g., 04XXXXXXXX)
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
                      className="text-blue-600 underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-blue-600 underline"
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
                  className={`mt-5 w-full py-2 rounded-lg font-medium transition-colors ${canSendOTP
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Send OTP
                </button>

              </>
            ) : (
              <>
                <h2 className="text-[22px] font-medium text-[#121224] mt-2">
                  Enter the OTP sent to SMS on
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>{mobile}</strong>
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
                  Didn’t receive it? {" "}
                  <button
                    onClick={() => alert("Resend OTP")}
                    className="text-blue-600 underline"
                  >
                    Resend OTP
                  </button>
                </p>
                <button
                  onClick={handleVerifyOtp}

                  className="mt-5 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}