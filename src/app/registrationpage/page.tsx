"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

type FormData = {
  mobile: string;
  creatingAccountAs: string;
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  numberOfEmployees: string;
  yourDesignation: string;
  country: string;
  city: string;
  pinCode: string;
  companyAddress: string;
};

function RegistrationComponent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    mobile: "",
    creatingAccountAs: "company",
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    numberOfEmployees: "",
    yourDesignation: "",
    country: "Australia",
    city: "",
    pinCode: "",
    companyAddress: "",
  });

  // Pre-fill mobile from query params
  useEffect(() => {
    const mobileFromQuery = searchParams.get("mobile");
    if (mobileFromQuery) {
      setFormData((prev) => ({ ...prev, mobile: mobileFromQuery }));
    }
  }, [searchParams]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const onPasswordChange = (value: string) => {
    handleChange("password", value);
    setPasswordsMatch(value === confirmPassword);
  };

  const onConfirmChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordsMatch(formData.password === value);
  };

  // Email OTP states
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleEmailOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...emailOtp];
      newOtp[index] = value;
      setEmailOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleEmailOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && emailOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Simulate sending OTP (replace with your API call)
  const sendEmailOtp = () => {
    if (!formData.email) {
      alert("Please enter a valid email address first");
      return;
    }
    setEmailOtpSent(true);
    alert(`OTP sent to ${formData.email}`);
  };

  // Simulate verifying OTP (replace with your API call/logic)
  const verifyEmailOtp = () => {
    const enteredOtp = emailOtp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }
    alert(`Verifying OTP: ${enteredOtp}`);
    nextStep();
  };

  // Submit to Xano (last step)
  const router = useRouter();

  const handleSubmit = async () => {
  // Validate all required fields
  if (!formData.companyName || !formData.numberOfEmployees || 
      !formData.yourDesignation || !formData.city || 
      !formData.pinCode || !formData.companyAddress) {
    alert("Please fill all required company details");
    return;
  }

  setLoading(true);
  setMessage("");
  try {
    const response = await fetch(
      "https://x76o-gnx4-xrav.a2.xano.io/api:5OnHwV4U/employerOnboarding",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      // Check for duplicate email error
      if (data.error && data.error.toLowerCase().includes("email")) {
        alert("This email is already registered. Please use a different email or login.");
        return;
      }
      // Check for duplicate phone number error
      if (data.error && data.error.toLowerCase().includes("phone")) {
        alert("This phone number is already registered. Please use a different number or login.");
        return;
      }
      // Generic error
      throw new Error(data.message || "Failed to submit form");
    }

    setMessage("Registration successful!");
    console.log("Response:", data);

    // Redirect after success
    setTimeout(() => {
      router.push("/congratulation"); 
    }, 1500);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Failed to submit form. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-4">
      {/* Step Indicator */}
      <div className="w-full max-w-md h-10 flex items-center justify-center text-center mt-2 mb-4 gap-2 text-xs sm:text-sm font-semibold">
        {/* Step 1 */}
        <div className={`flex items-center gap-1 ${step === 1 ? "text-blue-600" : step > 1 ? "text-green-600" : "text-gray-500"}`}>
          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${step > 1 ? "bg-green-600" : step === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
            {step > 1 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : null}
          </div>
          <span className="hidden sm:inline">Basic Details</span>
        </div>

        <span className="text-xs">—</span>

        {/* Step 2 */}
        <div className={`flex items-center gap-1 ${step === 2 ? "text-blue-600" : step > 2 ? "text-green-600" : "text-gray-500"}`}>
          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${step > 2 ? "bg-green-600" : step === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
            {step > 2 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : null}
          </div>
          <span className="hidden sm:inline">Verif Email</span>
        </div>

        <span className="text-xs">—</span>

        {/* Step 3 */}
        <div className={`flex items-center gap-1 ${step === 3 ? "text-blue-600" : "text-gray-500"}`}>
          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${step === 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
          <span className="hidden sm:inline">Company Details</span>
        </div>
      </div>

      {/* Steps container */}
      <div className="w-full max-w-md min-h-[500px] bg-white rounded-xl shadow-md px-4 sm:px-6 py-6 overflow-auto">
        {/* STEP 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Image src="/icons/badgeIcon.png" alt="Badge Icon" width={50} height={35} />
              <h2 className="mt-2 text-[#6B7794] text-sm sm:text-base">
                We need these details to identify you and create your account
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile}
                  readOnly
                  className="w-full mt-1 px-3 py-2 rounded-md text-sm bg-gray-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold">Account Type</label>
                <div className="flex gap-4 mt-1 text-xs sm:text-sm">
                  <label className="flex items-center font-bold gap-1">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.creatingAccountAs === "company"}
                      onChange={() => handleChange("creatingAccountAs", "company")}
                      className="w-3 h-3"
                    />
                    Company/Organization
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Name as per ABN"
                  className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm">Official Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email"
                  className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 text-sm"
                />
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <label className="text-xs sm:text-sm block mb-1">Create Password</label>
                  <div className="flex items-center w-full rounded-md bg-gray-100 px-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      placeholder="Enter password"
                      className="flex-1 py-2 bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-600 text-xs px-2"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs sm:text-sm block mb-1">Confirm Password</label>
                  <div className="flex items-center w-full rounded-md bg-gray-100 px-3">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => onConfirmChange(e.target.value)}
                      placeholder="Confirm password"
                      className="flex-1 py-2 bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-blue-600 text-xs px-2"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {!passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>

            <button
              className="w-full mt-4 py-2 bg-blue-600 text-white font-medium rounded-md text-sm sm:text-base"
              onClick={() => {
                if (!formData.fullName) {
                  alert("Please enter your full name");
                  return;
                }
                if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                  alert("Please enter a valid email address");
                  return;
                }
                if (!formData.password || formData.password.length < 6) {
                  alert("Password must be at least 6 characters");
                  return;
                }
                if (!passwordsMatch) {
                  alert("Passwords do not match");
                  return;
                }
                nextStep();
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: Email OTP Verification */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <Image src="/icons/badgeIcon.png" alt="Badge Icon" width={50} height={35} />
              <h2 className="mt-2 text-[#6B7794] text-sm sm:text-base">
                We need these details to identify you and create your account
              </h2>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-center">
              Verify email ID
            </h2>
            <p className="text-gray-600 text-center text-sm">
              We sent an OTP to: <strong>{formData.email}</strong>
            </p>

            {!emailOtpSent ? (
              <button
                className="w-full py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base"
                onClick={sendEmailOtp}
              >
                Send OTP
              </button>
            ) : (
              <>
                <div className="flex gap-2 justify-center max-w-xs mx-auto">
                  {emailOtp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center border rounded-md text-lg outline-none"
                      value={digit}
                      onChange={(e) => handleEmailOtpChange(e.target, index)}
                      onKeyDown={(e) => handleEmailOtpKeyDown(e, index)}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                    />
                  ))}
                </div>

                <button
                  className="w-full py-2 bg-green-600 text-white rounded-md text-sm sm:text-base"
                  onClick={verifyEmailOtp}
                >
                  Verify OTP
                </button>
              </>
            )}

            <button
              onClick={prevStep}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-md text-sm sm:text-base"
            >
              Back
            </button>
          </div>
        )}

        {/* STEP 3: Company Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Image src="/icons/badgeIcon.png" alt="Badge Icon" width={50} height={35} />
              <h2 className="mt-2 text-[#6B7794] text-sm sm:text-base px-2">
                We use this information to know about your company and generate invoices
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs sm:text-sm">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm">Number of Employees</label>
                <select
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleChange("numberOfEmployees", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                >
                  <option value="">Select range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm">Your Designation</label>
                <input
                  type="text"
                  value={formData.yourDesignation}
                  onChange={(e) => handleChange("yourDesignation", e.target.value)}
                  placeholder="Enter designation"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                >
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm">Postal Code</label>
                <select
                  value={formData.pinCode}
                  onChange={(e) => handleChange("pinCode", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                >
                  <option value="">Select Postal Code</option>
                  <option value="2000">2000 - Sydney, NSW</option>
                  <option value="3000">3000 - Melbourne, VIC</option>
                  <option value="4000">4000 - Brisbane, QLD</option>
                  <option value="5000">5000 - Adelaide, SA</option>
                  <option value="6000">6000 - Perth, WA</option>
                  <option value="7000">7000 - Hobart, TAS</option>
                  <option value="0800">0800 - Darwin, NT</option>
                  <option value="2600">2600 - Canberra, ACT</option>
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm">Company Address</label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={(e) => handleChange("companyAddress", e.target.value)}
                  placeholder="Enter company address"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={prevStep}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md text-sm sm:text-base"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {message && (
              <p className="text-center mt-2 text-sm text-gray-600">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    }>
      <RegistrationComponent />
    </Suspense>
  );
}