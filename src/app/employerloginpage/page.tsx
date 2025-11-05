"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import { ArrowRight, CheckCircle } from "lucide-react";
import Footer from "../../../components/footer-section";
import { setAuthCookies, getCookie } from "@/utils/cookies";
import MainButton from "@/components/ui/MainButton";

const EmployerLoginPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Email + Password
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Timer for OTP step (in seconds)
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Start countdown timer when step 2 is active
  useEffect(() => {
    if (step !== 2) return;

    if (timeLeft <= 0) return; // Stop if time ended

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }

    const timerId = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [resendCooldown]);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // API Base
  const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || "";

  // Handle OTP Input
  const handleOtpChange = (
    target: EventTarget & HTMLInputElement,
    index: number
  ) => {
    const val = target.value;
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Function to send OTP (used for both initial send and resend)
  const sendOtp = async (authToken: string, userEmail: string) => {
    const otpRes = await fetch(
      "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/email_otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ email: userEmail }),
      }
    );

    if (!otpRes.ok) {
      throw new Error("Failed to send OTP email");
    }

    return otpRes;
  };

  // Step 1: Login with email & password (and request OTP)
  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password) {
      alert("Please enter your password");
      return;
    }

    const userEmail = email.trim().toLowerCase();

    try {
      setIsLoading(true);

      // Step 1: Call login API
      const loginRes = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          password,
          role: "Employer",
        }),
      });

      if (!loginRes.ok) {
        alert("Invalid Credentials");
        setIsLoading(false);
        return;
      }

      const loginData = await loginRes.json();

      const authToken = loginData.authToken;

      if (!authToken) {
        alert("Login failed: no auth token returned");
        setIsLoading(false);
        return;
      }

      // Store the token in cookies and localStorage
      setAuthCookies(authToken, "Employer", userEmail);
      localStorage.setItem("authToken", authToken);

      // Step 2: Send OTP
      await sendOtp(authToken, userEmail);

      // Move to step 2: show OTP input UI and reset timer
      setStep(2);
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60); // 60 seconds cooldown before allowing resend
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    const authToken = getCookie("authToken") || localStorage.getItem("authToken");
    const userEmail = email.trim().toLowerCase();

    if (!authToken) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    try {
      setIsResending(true);

      await sendOtp(authToken, userEmail);

      // Reset OTP input
      setOtp(new Array(6).fill(""));

      // Reset timers
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60); // 60 seconds cooldown

      alert("OTP has been resent to your email!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("").trim();

    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    const authToken = getCookie("authToken") || localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/verify_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            otp_code: enteredOtp,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // OTP verified successfully
        router.push("/EmployerDashboard");
      } else {
        alert(result.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-fit">
      <Navbar />
      <div className="flex items-center justify-center py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        {/* Flex container with responsive behavior */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl w-full mx-auto">
          {/* "New to VFind" Section (Left side) */}
          <div
            className="hidden md:flex flex-col justify-between w-full lg:w-[627px] p-8 md:p-10 rounded-2xl shadow-md
        order-2 lg:order-1
bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]"
          >
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Find & hire the right talent with us
              </h2>
              <ul className="space-y-4 md:space-y-5 text-[#474D6A]">
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 rounded-full" />
                  <span className="text-sm md:text-base text-black">
                    Post jobs and reach verified healthcare professionals.
                  </span>
                </li>

                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 rounded-full" />
                  <span className="text-sm md:text-base text-black">
                    View detailed nurse profiles and credentials.
                  </span>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 rounded-full" />
                  <span className="text-sm md:text-base text-black">
                    Connect directly with top nursing talent.
                  </span>
                </li>
                <li className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 rounded-full" />
                  <span className="text-sm md:text-base text-black">
                    Build your trusted employer brand.
                  </span>
                </li>
              </ul>
              <button
                onClick={() => router.push("/foremployer")}
                className="group mt-8 h-10 md:h-[42px] w-full sm:w-[225px] text-white bg-[#4A90E2] rounded-lg shadow transition-all duration-300 overflow-hidden flex items-center justify-center font-medium hover:bg-blue-500"
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

          {/* Login Section (Right side) */}
          <div className="border-1 border-gray-300 lg:order-1 w-full lg:w-[480px] h-auto bg-white shadow-md rounded-2xl p-6 sm:p-8 md:p-10">
            {step === 1 && (
              <>
                <h2 className="text-xl sm:text-2xl font-medium text-[#121224] mb-6">
                  Sign In to Your Employer Account
                </h2>

                {emailError && (
                  <p className="text-red-500 text-sm mb-4">{emailError}</p>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm md:text-base mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm md:text-base"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        setEmailError(
                          validateEmail(value)
                            ? ""
                            : "Please enter a valid email address"
                        );
                      }}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium text-sm md:text-base mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-[#4A90E2] font-medium text-sm"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <a
                      href="/forgot-password-employer"
                      className="text-sm text-[#4A90E2] hover:underline float-right mt-2 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !!emailError || !email || !password}

                  className="group w-full  h-[40px] bg-[#61A6FA] text-white rounded-lg font-medium transition-all duration-300 mt-8 block overflow-hidden flex items-center justify-center"
                >
                    <span className="transition-all duration-300 group-hover:-translate-x-1">
                      {isLoading ? "Processing..." : "Login"}
                    </span>
                    {!isLoading && (
                      <ArrowRight
                        className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        strokeWidth={3}
                      />
                    )}
                </button>

                <div className="block text-center mt-6 text-sm md:text-base text-gray-600">
                  Don&apos;t have an account?
                  <button
                    onClick={() => router.push("/foremployer")}
                    className="text-[#4A90E2] font-medium ml-1 hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl sm:text-2xl font-medium text-[#121224] mb-4">
                  Enter the OTP sent to your email
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-2 break-all">
                  <strong>{email}</strong>
                </p>

                <div className="mt-6">
                  <label className="block text-gray-700 font-medium text-sm md:text-base mb-3">
                    OTP Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-lg text-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        ref={(el) => {
                          if (el) inputRefs.current[index] = el;
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend OTP Section */}
                <div className="mt-4 text-right">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-sm md:text-base text-[#4A90E2] hover:underline font-medium disabled:opacity-50 transition"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <p className="text-sm md:text-base text-gray-500">
                      Resend OTP in {resendCooldown}s
                    </p>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || timeLeft === 0}
                  className="w-full sm:w-[328px] h-10 md:h-11 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-blue-500 transition mt-8 mx-auto block disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>

                {timeLeft === 0 && (
                  <p className="mt-4 text-center text-red-600 text-sm md:text-base">
                    OTP expired. Please login again to request a new OTP.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#1F3C88]">
        <Footer />
      </div>
    </div>
  );
};

export default EmployerLoginPage;