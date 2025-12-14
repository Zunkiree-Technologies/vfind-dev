"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerNurse } from "@/lib/supabase-auth";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Validation functions
  const validateFullName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) return false;
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(trimmedName);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Google Sign-Up (TODO: Implement with Supabase OAuth)
  const signupWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      setError("Google Sign-Up coming soon. Please use email/password.");
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Google signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!validateFullName(fullName)) {
      setError("Please enter your full name (first and last name).");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      // Generate unique placeholder values to avoid database constraint violations
      // These will be replaced when user completes their profile
      const timestamp = Date.now();
      const uniquePhone = `PENDING_${timestamp}`; // Unique placeholder for phone

      // Register with minimal data - profile will be completed later
      const result = await registerNurse({
        email,
        password,
        fullName,
        phone: uniquePhone, // Unique placeholder - will be updated during profile completion
        postcode: "0000", // Placeholder postcode
        currentResidentialLocation: "Not specified", // Placeholder location
        jobTypes: "",
        openToOtherTypes: "",
        shiftPreferences: [],
        startTime: "",
        startDate: "",
        jobSearchStatus: "",
        qualification: "",
        otherQualification: "",
        workingInHealthcare: "",
        experience: "",
        organisation: "",
        locationPreference: "",
        preferredLocations: [],
        certifications: [],
        residencyStatus: "",
        visaType: "",
        visaDuration: "",
        workHoursRestricted: "",
        maxWorkHours: "",
        termsAccepted: true,
        visibilityStatus: "visibleToAll",
      });

      if (result.success) {
        // Save token and profile
        if (typeof window !== "undefined") {
          if (result.authToken) {
            localStorage.setItem("authToken", result.authToken);
            localStorage.setItem("token", result.authToken);
            // Log the user in via AuthContext so they're authenticated
            login(result.authToken, "Nurse", email);
          }
          if (result.data) {
            localStorage.setItem("userProfile", JSON.stringify(result.data));
          }
          localStorage.setItem("email", email);
        }

        // Redirect to welcome page
        router.push("/welcome");
      } else {
        // Handle specific error messages
        const errorMsg = result.error?.toLowerCase() || "";

        if (errorMsg.includes("email") && (errorMsg.includes("exists") || errorMsg.includes("duplicate") || errorMsg.includes("unique"))) {
          setError("This email is already registered. Please use a different email or try logging in.");
        } else if (errorMsg.includes("phone") && (errorMsg.includes("exists") || errorMsg.includes("duplicate") || errorMsg.includes("unique"))) {
          setError("Registration failed. Please try again.");
        } else if (errorMsg.includes("duplicate key") || errorMsg.includes("unique constraint")) {
          setError("This account may already exist. Please try logging in instead.");
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : "";

      if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
        setError("This account may already exist. Please try logging in instead.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    validateFullName(fullName) &&
    validateEmail(email) &&
    validatePassword(password) &&
    password === confirmPassword &&
    termsAccepted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/70 to-pink-300/50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-100/60 to-amber-100/40 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-100/50 to-rose-100/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gradient-to-tr from-orange-100/40 to-pink-100/30 rounded-full blur-2xl translate-y-1/3" />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[2rem] shadow-sm border border-gray-100 px-10 py-10 sm:px-12 sm:py-12">

        {/* Circular Logo with Gradient Ring */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 w-[88px] h-[88px] -m-1 rounded-full border-2 border-orange-200/60"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-orange-400 p-[3px]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-orange-50 flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-500 font-bold text-3xl">V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 mb-2">
            Join VFind<span className="text-orange-400">.</span>
          </h1>
          <p className="text-gray-500 text-[15px]">
            Your nursing career starts here
          </p>
        </div>

        {/* Google Sign Up Button */}
        <div className="space-y-4 mb-6">
          <button
            onClick={signupWithGoogle}
            disabled={loading}
            className="w-full h-14 border border-gray-200 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <Image
              src="/icons/google.png"
              alt="Google"
              width={22}
              height={22}
            />
            <span className="text-[15px]">Sign up with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Full name*
            </label>
            <input
              type="text"
              className="w-full h-14 px-5 border border-gray-200 rounded-full bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-300 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100/50"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            {fullName && !validateFullName(fullName) && (
              <p className="text-orange-500 text-xs mt-1">Please include first and last name</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Email address*
            </label>
            <input
              type="email"
              className="w-full h-14 px-5 border border-gray-200 rounded-full bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-300 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-14 px-5 pr-14 border border-gray-200 rounded-full bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-300 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {password && !validatePassword(password) && (
              <p className="text-orange-500 text-xs mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Confirm password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full h-14 px-5 pr-14 border border-gray-200 rounded-full bg-white text-gray-900 text-[15px] placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-300 focus:bg-blue-50/50 focus:ring-4 focus:ring-blue-100/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-orange-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I accept the{" "}
              <Link href="/terms" className="text-pink-500 hover:text-pink-600 font-medium">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-pink-500 hover:text-pink-600 font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-500 text-[15px]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-pink-500 hover:text-pink-600 font-semibold transition-colors"
          >
            Log in
          </Link>
        </p>

        {/* Help Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-sm">
            Your data is safe with VFind.{" "}
            <Link
              href="/privacy"
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
