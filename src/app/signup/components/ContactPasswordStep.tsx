import { useState,  } from "react";
import { FormDataType } from "../types/FormTypes";
import rawPostcodeSuburbs from "./json/postcodeSuburbs.json";
import { Check } from "lucide-react";

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
    <h2 className="text-xl font-semibold text-[#121224] mb-6">
        Personal & Contact Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
      {/* Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#121224] mb-2">Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={(e) => {
              handleChange("fullName", e.target.value);
              const value = e.target.value.trim();
              if (value.length === 0) {
                setFullNameError("Full name is required");
              } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                setFullNameError("Please enter letters only");
              } else if (value.length < 2) {
                setFullNameError("Name must be at least 2 characters");
              } else {
                setFullNameError("");
              }
            }}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder-gray-400"
          />
          {fullNameError && <p className="text-red-600 text-sm mt-1">{fullNameError}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#121224] mb-2">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              handleChange("email", e.target.value);
              setEmailError(validateEmail(e.target.value) ? "" : "Invalid email format");
            }}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder-gray-400"
          />
          {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#121224] mb-2">Phone</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full">
            <span className="px-3 text-[#121224] select-none bg-gray-50">04</span>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone"
              value={formData.phone}
              maxLength={8}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  handleChange("phone", value);
                  const fullPhone = `04${value}`;
                  setPhoneError(value.length === 8 && validatePhone(fullPhone) ? "" : "Phone number must be 8 digits");
                }
              }}
              className="flex-1 p-3 outline-none text-sm placeholder-gray-400"
            />
          </div>
          {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-[#121224] mb-2">Postal Code</label>
          <input
            type="text"
            id="postcode"
            placeholder="Enter your postal code"
            value={postcode}
            maxLength={4}
            onChange={handlePostcodeChange}
            onFocus={() => {
              if (postcode.length === 4 && postcodeSuburbs[postcode]) setFilteredSuburbs(postcodeSuburbs[postcode]);
            }}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#121224] mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => {
                handleChange("password", e.target.value);
                setPasswordStrength(checkPasswordStrength(e.target.value));
              }}
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-sm placeholder-gray-400"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 text-xs">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formData.password && 
          <p className={`text-sm mt-1 ${passwordStrength === "Weak" ? "text-red-600" : passwordStrength === "Medium" ? "text-yellow-600" : "text-green-600"}`}>
           </p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#121224] mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-sm placeholder-gray-400"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 text-xs">
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formData.confirmPassword && formData.confirmPassword !== formData.password && (
            <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      {/* Suburb Selection - Full Width Below Grid */}
      {filteredSuburbs.length > 0 && (
        <div className="mt-4">
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

      {selectedSuburb && <p className="mt-2 text-blue-400 font-semibold">Selected Location: {selectedSuburb}</p>}

       {/* Terms */}
     <div className="mt-6 flex items-center">
        <button
          type="button"
          onClick={() => handleChange("termsAccepted", !formData.termsAccepted)}
          className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 ${formData.termsAccepted ? "bg-blue-400 text-white" : "bg-[#ECEFFD] text-[#2142B9]"}`}
        >
          {formData.termsAccepted && <Check size={16} />}
        </button>
        <label className="text-sm text-gray-700">
          I accept the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            Terms & Conditions
          </a>
        </label>
      </div>
    </>
  );
}