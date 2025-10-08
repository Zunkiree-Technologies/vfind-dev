"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import { CheckCircle } from "lucide-react";
import Footer from "../../../components/footer-section";

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

  // Format seconds to MM:SS

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

      // console.log(loginData)


      const authToken = loginData.authToken;
      // console.log(authToken)

      if (!authToken) {
        alert("Login failed: no auth token returned");
        setIsLoading(false);
        return;
      }

      // Store the token
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
    const authToken = localStorage.getItem("authToken");
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

    const authToken = localStorage.getItem("authToken");
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
    <div>
      <Navbar />
      <div className="min-h-fit flex items-center justify-center   py-10  px-4 sm:px-6">

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 max-w-7xl w-full">
          {/* Left section - Hidden on mobile and small tablets */}


          <div
            className="hidden md:flex flex-col justify-between w-full lg:w-[627px] lg:h-[480px] p-10 rounded-2xl shadow-md 
        
bg-[linear-gradient(to_top,#61A6FA_0%,#AAD0FD_20%,#F4F9FF_100%)]
"
          >
            <div className="mt-5 ml-10">
              <h2 className="text-2xl font-bold text-center text-gray-800 ">
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
                className="mt-6 h-[38px] w-[225px] text-white bg-[#4A90E2] rounded-[8px] shadow hover:bg-blue-500 hover:text-white transition font-medium"
              >
                Register for Free
              </button>
            </div>

          </div>

          {/* Right section - Responsive form with matching height */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md h-auto lg:h-[420px] xl:h-[481px] mx-auto xl:mx-0 flex flex-col justify-center">
            {step === 1 && (
              <>
                <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] mt-2">
                  Sign In to Your Employer Account
                </h2>
                <div className="mt-5">
                  <label className="block text-sm text-[#091E42] mb-1">Email</label>
                  <input
                    type="email"
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
                    className="w-full rounded-md px-3 py-2.5 outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
                <div className="mt-5">
                  <label className="block text-sm text-[#091E42] mb-1">
                    Password
                  </label>
                  <div className="flex items-center rounded-md px-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full py-2.5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-400 text-sm whitespace-nowrap pl-3 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <a
                      href="/forgot-password-employer"
                      className="text-sm text-blue-400 hover:underline transition-all"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !!emailError || !email || !password}
                  className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all ${!emailError && email && password
                    ? "bg-blue-400 text-white hover:bg-blue-500 active:bg-blue-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {isLoading ? "Processing..." : "Login"}
                </button>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Did not have an account?{" "}
                    <a
                      href="/foremployer"
                      className="text-blue-400 font-medium hover:underline transition-all"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] mt-2">
                  Enter the OTP sent to your email
                </h2>
                <p className="text-sm text-gray-500 mt-2 break-all">
                  <strong>{email}</strong>
                </p>
                <div className="mt-5">
                  <label className="block text-sm text-[#091E42] mb-1">OTP</label>
                  <div className="flex gap-2 justify-between max-w-xs mx-auto sm:mx-0">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-md text-lg sm:text-xl outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
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
                <div className="mt-4 text-end">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-blue-600 text-sm hover:underline disabled:opacity-50 transition-all"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {resendCooldown}s
                    </p>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || timeLeft === 0}
                  className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all ${!isLoading && timeLeft > 0
                    ? "bg-blue-400 text-white hover:bg-blue-500 active:bg-blue-800"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                {timeLeft === 0 && (
                  <p className="mt-2 text-center text-red-600 text-sm">
                    OTP expired. Please login again to request a new OTP.
                  </p>
                )}
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
};

export default EmployerLoginPage;