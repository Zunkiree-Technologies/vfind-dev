import { useState,  } from "react";
import { FormDataType } from "../types/FormTypes";
import rawPostcodeSuburbs from "./json/postcodeSuburbs.json";

interface ContactPasswordStepProps {
  formData: FormDataType;
  handleChange: <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => void;
}

interface SuburbData {
  suburb: string;
  state: string;
}

interface PostcodeSuburbs {
  [postcode: string]: SuburbData[];
}

const postcodeSuburbs = rawPostcodeSuburbs as PostcodeSuburbs;

export function ContactPasswordStep({ formData, handleChange }: ContactPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [postcode, setPostcode] = useState(formData.postcode || "");
  const [filteredSuburbs, setFilteredSuburbs] = useState<SuburbData[]>([]);
  const [selectedSuburb, setSelectedSuburb] = useState(formData.currentResidentialLocation || "");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Full name validation
  const validateFullName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    
    // Check if it contains at least one space (first name + last name)
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) return false;
    
    // Check if it only contains letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(trimmedName);
  };

  // Australian phone number validation - updated for 04 + 8 digits
  const validatePhone = (phone: string) => {
    const auPhoneRegex = /^04\d{8}$/;
    return auPhoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,4}$/.test(val)) {
      setPostcode(val);
      handleChange("postcode", val as FormDataType["postcode"]);

      setSelectedSuburb("");
      handleChange("currentResidentialLocation", "" as FormDataType["currentResidentialLocation"]);

      if (val.length === 4 && postcodeSuburbs[val]) {
        setFilteredSuburbs(postcodeSuburbs[val]);
      } else {
        setFilteredSuburbs([]);
      }
    }
  };

  const handleSuburbSelect = (suburb: string, state: string) => {
    const fullAddress = `${suburb}, ${state} ${postcode}`;
    setSelectedSuburb(fullAddress);
    handleChange("currentResidentialLocation", fullAddress as FormDataType["currentResidentialLocation"]);
    setFilteredSuburbs([]);
  };

  return (
    <>
      <h2 className="font-[16px] font-semibold text-[#121224]">
        Where should we send job matches and updates?
      </h2>

      {/* Full Name */}
      <div className="mt-5">
        <label htmlFor="fullName" className="block text-sm font-medium text-[#121224] mb-1">Full Name</label>
        <input
          type="text"
          id="fullName"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => {
            handleChange("fullName", e.target.value);
            const isValid = validateFullName(e.target.value);
            if (e.target.value.trim().length === 0) {
              setFullNameError("Full name is required");
            } else if (!isValid) {
              setFullNameError("Please enter your first and last name (letters only)");
            } else {
              setFullNameError("");
            }
          }}
          className="w-full border rounded p-2"
        />
        {fullNameError && <p className="text-red-600 text-sm mt-1">{fullNameError}</p>}
      </div>

      {/* Postcode */}
      <div className="mt-3">
        <label htmlFor="postcode" className="block text-sm font-medium text-[#121224] mb-1">Current Residential Postcode</label>
        <input
          type="text"
          id="postcode"
          placeholder="Enter 4-digit postcode"
          value={postcode}
          maxLength={4}
          onChange={handlePostcodeChange}
          onFocus={() => {
            if (postcode.length === 4 && postcodeSuburbs[postcode]) setFilteredSuburbs(postcodeSuburbs[postcode]);
          }}
          className="w-full border rounded p-2"
        />
      </div>

      {filteredSuburbs.length > 0 && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-[#121224] mb-1">Select Suburb</label>
          <ul className="border rounded max-h-40 overflow-y-auto bg-white">
            {filteredSuburbs.map(({ suburb, state }, index) => (
              <li
                key={`${suburb}-${state}-${index}`}
                className={`cursor-pointer p-2 hover:bg-blue-100 ${selectedSuburb.startsWith(suburb) ? "bg-blue-200" : ""}`}
                onClick={() => handleSuburbSelect(suburb, state)}
              >
                {suburb}, {state} {postcode}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedSuburb && <p className="mt-2 text-blue-700 font-semibold">Selected Location: {selectedSuburb}</p>}

      {/* Email */}
      <div className="mt-3">
        <label htmlFor="email" className="block text-sm font-medium text-[#121224] mb-1">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => {
            handleChange("email", e.target.value);
            setEmailError(validateEmail(e.target.value) ? "" : "Invalid email format");
          }}
          className="w-full border rounded p-2"
        />
        {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
      </div>

      {/* Phone */}
      <div className="mt-3">
        <label htmlFor="phone" className="block text-sm font-medium text-[#121224] mb-1">Phone Number</label>
        <div className="flex items-center border rounded overflow-hidden w-full">
          <span className=" px-3 text-[#121224] select-none">04</span>
          <input
            type="tel"
            id="phone"
            placeholder="XXXXXXXX"
            value={formData.phone}
            maxLength={8}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Only allow digits
              if (value.length <= 8) {
                handleChange("phone", value);
                const fullPhone = `04${value}`;
                setPhoneError(value.length === 8 && validatePhone(fullPhone) ? "" : "Phone number must be 8 digits");
              }
            }}
            className="flex-1 p-2 outline-none"
          />
        </div>
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
      </div>

      {/* Password */}
      <div className="mt-3">
        <label htmlFor="password" className="block text-sm font-medium text-[#121224] mb-1">Create a Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Create a Password"
            value={formData.password}
            onChange={(e) => {
              handleChange("password", e.target.value);
              setPasswordStrength(checkPasswordStrength(e.target.value));
            }}
            className="w-full border rounded p-2 pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-[#717B9E]">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {formData.password && <p className={`text-sm mt-1 ${passwordStrength === "Weak" ? "text-red-600" : passwordStrength === "Medium" ? "text-yellow-600" : "text-green-600"}`}>Strength: {passwordStrength}</p>}
      </div>

      {/* Confirm Password */}
      <div className="mt-3">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#121224] mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full border rounded p-2 pr-10"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
          <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Terms */}
      <div className="mt-4 flex items-center">
        <button
          type="button"
          onClick={() => handleChange("termsAccepted", !formData.termsAccepted)}
          className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 ${formData.termsAccepted ? "bg-blue-700 text-white" : "bg-[#ECEFFD] text-[#2142B9]"}`}
        >
          {formData.termsAccepted && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <label className="text-sm text-gray-700">
          I accept the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Terms & Conditions
          </a>
        </label>
      </div>
    </>
  );
}