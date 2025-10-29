"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer-section";
import { Building2, Globe, Mail, MapPinned, User } from "lucide-react";
import Image from "next/image";

type FormData = {
  mobile: string;
  companyName: string;
  email: string;
  AustralianBusinessNumber: string;
  businessType: string;
  numberOfEmployees: string;
  fullName: string;
  yourDesignation: string;
  state: string;
  city: string;
  pinCode: string;
  companyAddress: string;
  password: string;
  organizationWebsite: string;
  creatingAccountAs: string;
};

function RegistrationComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState<string[]>(new Array(6).fill(""));
  const [, setOtpSent] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  const [formData, setFormData] = useState<FormData>({
    mobile: "",
    companyName: "",
    email: "",
    AustralianBusinessNumber: "",
    businessType: "",
    numberOfEmployees: "",
    fullName: "",
    yourDesignation: "",
    state: "",
    city: "",
    pinCode: "",
    companyAddress: "",
    password: "",
    organizationWebsite: "",
    creatingAccountAs: "company",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };


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

  const onPasswordChange = (value: string) => {
    handleChange("password", value);
    setPasswordsMatch(value === confirmPassword);
  };

  const onConfirmChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordsMatch(formData.password === value);
  };

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

  // Send OTP to email
  const sendEmailOtp = async () => {
    if (!formData.email) {
      alert("Please enter a valid email address");
      return;
    }

    setOtpSent(true);
    // TODO: Replace with actual API call to send OTP
    alert(`OTP sent to ${formData.email}`);
  };

  // Verify OTP and submit form
  const verifyOtpAndSubmit = async () => {
    const enteredOtp = emailOtp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    // TODO: Replace with actual OTP verification API call
    // For now, proceeding to submit
    await handleSubmit();
  };

  // Validate form and show OTP modal
  const handleRegisterClick = async () => {
    // Validate all required fields
    if (!formData.companyName) {
      alert("Please enter organization name");
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!formData.AustralianBusinessNumber) {
      alert("Please enter Australian Business Number");
      return;
    }
    if (!formData.businessType) {
      alert("Please select business type");
      return;
    }
    if (!formData.numberOfEmployees) {
      alert("Please select organization size");
      return;
    }
    if (!formData.fullName) {
      alert("Please enter contact name");
      return;
    }
    if (!formData.yourDesignation) {
      alert("Please select your role at organization");
      return;
    }
    if (!formData.state) {
      alert("Please select state");
      return;
    }
    if (!formData.city) {
      alert("Please enter city");
      return;
    }
    if (!formData.pinCode) {
      alert("Please enter postal code");
      return;
    }
    if (!formData.companyAddress) {
      alert("Please enter company address");
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
    if (!agreedToTerms) {
      alert("Please agree to the terms and privacy policy");
      return;
    }

    // All validations passed, send OTP
    await sendEmailOtp();
    setShowOtpModal(true);
  };

  // Submit form to backend
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();

      // Add normal fields
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as string);
      });

      // Add logo only if exists
      if (logo) {
        form.append("image", logo); // make sure "image" matches backend input name
      }

      const response = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:5OnHwV4U/employerOnboarding",
        {
          method: "POST",
          body: form, // Note: no JSON headers for multipart
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit form");

      setMessage("Registration successful!");
      setTimeout(() => router.push("/congratulation"), 1500);

    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-3xl space-y-4">

          <form className="space-y-4">
            {/* Company Details Section */}
            <div className="bg-white  rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 cursor-pointer ">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Company Details</h2>
                </div>

              </div>


              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500 text-gray-500">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder="ABC healthcare"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="abc@gmail.com"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.mobile}
                      readOnly
                      placeholder="+61 444444444"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Australian Business Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.AustralianBusinessNumber}
                      onChange={(e) => handleChange("AustralianBusinessNumber", e.target.value)}
                      placeholder="04 000000"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={formData.businessType}
                      onChange={(e) => handleChange("businessType", e.target.value)}
                      placeholder=" e.g., Healthcare, Agecare"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "

                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Number of Employees
                    </label>
                    <select
                      value={formData.numberOfEmployees}
                      onChange={(e) => handleChange("numberOfEmployees", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    >
                      <option value="0-5">Less than 5 employees</option>
                      <option value="5-20">Less than 20 employees</option>
                      <option value="20-50">Less than 50 employees</option>
                      <option value="50-100">Less than 100 employees</option>
                      <option value="100-200">Less than 200 employees</option>
                      <option value="200+">More than 200 employees</option>

                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center w-full rounded-md border px-3 ">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="Enter password"
                        className="flex-1 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-blue-400 text-xs px-2 "
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center w-full rounded-md border px-3 ">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => onConfirmChange(e.target.value)}
                        placeholder="Confirm password"
                        className="flex-1 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-blue-400 text-xs px-2 "
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                    {!passwordsMatch && confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Organization Website / Social Media Link
                    </label>
                    <input
                      type="text"
                      value={formData.organizationWebsite}
                      onChange={(e) => handleChange("organizationWebsite", e.target.value)}
                      placeholder="https://www.example.com or social media link"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Contact Person Section */}
            <div className="bg-white rounded-lg ">
              <div className="flex items-center justify-between p-4 cursor-pointer ">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />

                  <h2 className="text-lg font-semibold">Primary Contact Person</h2>
                </div>

              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Enter contact name"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.yourDesignation}
                      onChange={(e) => handleChange("yourDesignation", e.target.value)}
                      placeholder=" (e.g: HR Manager, Director)"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "

                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white  rounded-lg ">
              <div className="flex items-center justify-between p-4 cursor-pointer ">
                <div className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-blue-400" />

                  <h2 className="text-lg font-semibold">Location Information</h2>
                </div>

              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    >
                      <option value="NSW">New South Wales</option>
                      <option value="VIC">Victoria</option>
                      <option value="QLD">Queensland</option>
                      <option value="SA">South Australia</option>
                      <option value="WA">Western Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="NT">Northern Territory</option>
                      <option value="ACT">Australian Capital Territory</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Sydney"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Post Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.pinCode}
                      onChange={(e) => handleChange("pinCode", e.target.value)}
                      placeholder="0000"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Company Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyAddress}
                      onChange={(e) => handleChange("companyAddress", e.target.value)}
                      placeholder="Enter your company address..."
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm "
                    />
                    <p className="text-gray-500 text-sm mt-2"> eg: 123 High Street, Carlton North, VIC 3054</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Image or Profile Picture */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4 ">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />

                  <h2 className="text-lg font-semibold">Organization Photo / Logo (Optional) </h2>
                </div>
              </div>

              <div className="p-4 flex flex-col items-center gap-4">
                {/* Preview */}
                <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {preview ? (
                    <Image width={50} height={50} src={preview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Choose Photo</span>
                  )}
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-400 rounded "
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I have read and agree to the{" "}
                  <a href="/terms" className="text-blue-400 hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegisterClick}
              disabled={!agreedToTerms || loading}
              className={`w-fit py-3 px-5 rounded-md font-semibold text-white transition-colors ${agreedToTerms && !loading
                ? "bg-blue-400 hover:bg-blue-400"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {loading ? "Processing..." : "Register"}
            </button>

            {message && (
              <p className="text-center text-sm text-green-600 font-medium">
                {message}
              </p>
            )}
          </form>
        </div>

      </div>
      <div className="bg-[#1F3C88] ">
        <Footer />
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (


        <div className="fixed inset-0   bg-white  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-5 h-5 text-blue-400" />

              </div>
              <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
              <p className="text-gray-600 text-sm">
                We have sent a 6-digit OTP to
              </p>
              <p className="text-blue-400 font-semibold">{formData.email}</p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {emailOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-500 rounded-lg text-lg font-semibold outline-none"
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
              onClick={verifyOtpAndSubmit}
              disabled={loading || emailOtp.join("").length !== 6}
              className={`w-full py-3 rounded-md font-semibold text-white mb-3 ${loading || emailOtp.join("").length !== 6
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-400 hover:bg-blue-500"
                }`}
            >
              {loading ? "Verifying..." : "Verify & Complete Registration"}
            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              disabled={loading}
              className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>

            <div className="text-center mt-4">
              <button
                onClick={sendEmailOtp}
                className="text-blue-400 text-sm hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>

        </div>



      )}
    </>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registration form...</p>
          </div>
        </div>
      }
    >
      <RegistrationComponent />
    </Suspense>
  );
}