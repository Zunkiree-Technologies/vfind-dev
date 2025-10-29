"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation";




const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(600); 
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();


  // Email validation
  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // Timer effects
  useEffect(() => {
    if (step !== 2) return;
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, timeLeft]);

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

  // Handle OTP input
  const handleOtpChange = (
    target: HTMLInputElement,
    index: number
  ): void => {
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

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP
  const sendOTP = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/reset_password_otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );

      if (!res.ok) throw new Error("Failed to send OTP");

      setStep(2);
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await sendOTP();
      setOtp(new Array(6).fill(""));
      alert("OTP has been resent to your email!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    const enteredOtp = otp.join("").trim();

    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/verify_resetPassword_otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otp_code: enteredOtp,
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStep(3);
        alert("OTP verified! Please set your new password.");
      } else {
        alert(data?.message || "Invalid OTP or email");
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Update Password
  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/update_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        // Reset everything
        setStep(1);
        setEmail("");
        setEmailError("");
        setOtp(new Array(6).fill(""));
        setNewPassword("");
        setConfirmPassword("");
        setTimeLeft(600);

        router.push("/signin");
      } else {
        alert(data?.message || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating password");
    } finally {
      setIsLoading(false);
    }
  };

 return (
  <div>
     <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 sm:px-6">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 max-w-7xl w-full">
        
        {/* Left section - Hidden on mobile and small tablets */}
        <div
          style={{
            background:
              "linear-gradient(160deg, rgba(255, 255, 255, 0.22) 0%, rgba(238, 174, 202, 0.14) 72%, rgba(39, 93, 245, 0.11) 100%)",
          }}
          className="hidden lg:flex flex-col justify-center w-full xl:w-[699px] h-auto lg:h-[420px] xl:h-[481px] rounded-2xl shadow-lg p-6 lg:p-8 xl:p-10"
        >
          <h1 className="text-3xl lg:text-4xl xl:text-[48px] font-bold text-[#121224] leading-tight">
            Reset your password <br className="hidden xl:block" /> 
            <span className="xl:hidden">securely</span>
            <span className="hidden xl:inline">securely</span>
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#474D6A]">
                       <div className="flex items-center gap-2">
                         <Image
                           src="/icons/check.png"
                           alt="Check Icon"
                           width={14}
                           height={14}
                           className="text-white flex-shrink-0"
                         />
                         <span className="text-xs lg:text-sm">Trusted by 10 Cr+ candidates | 4 Lakh+ employers</span>
                       </div>
                     </div>
                     <div className="mt-4 flex -space-x-2">
                       {[...Array(5)].map((_, i) => (
                         <Image
                           key={i}
                           width={32}
                           height={32}
                           src="/assets/profile.png"
                           className="w-7 h-7 lg:w-8 lg:h-8 rounded-full shadow-sm"
                           alt="Employer Avatar"
                         />
                       ))}
                     </div>
                     <div className="mt-auto flex justify-end">
                       <div className="w-32 lg:w-40 xl:w-48 h-32 lg:h-40 xl:h-48 rounded-full overflow-hidden">
                         <Image
                           src="/assets/profile.png"
                           alt="Login Illustration"
                           width={194}
                           height={194}
                           className="object-cover w-full h-full"
                         />
                       </div>
                     </div>
                   </div>

        {/* Right section - Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md h-fit mx-auto xl:mx-0">
          
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] mt-2">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email address and we will send you an OTP to reset your password.
              </p>
              
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
              
              <button
                onClick={sendOTP}
                disabled={isLoading || !!emailError || !email}
                className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all ${!emailError && email
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              
              
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] mt-2">
                Enter OTP
              </h2>
              <p className="text-sm text-gray-500 mt-2 break-all">
                We have sent a 6-digit OTP to <strong>{email}</strong>
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
                onClick={verifyOTP}
                disabled={isLoading || timeLeft === 0}
                className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all ${!isLoading && timeLeft > 0
                  ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              
              {timeLeft === 0 && (
                <p className="mt-2 text-center text-red-600 text-sm">
                  OTP expired. Please request a new OTP.
                </p>
              )}
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] mt-2">
                Set New Password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Create a strong password for your account.
              </p>
              
              <div className="mt-5">
                <label className="block text-sm text-[#091E42] mb-1">
                  New Password
                </label>
                <div className="flex items-center rounded-md px-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-2.5 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-blue-500 text-sm whitespace-nowrap pl-3 hover:text-blue-600 transition-colors"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              
              <div className="mt-5">
                <label className="block text-sm text-[#091E42] mb-1">
                  Confirm New Password
                </label>
                <div className="flex items-center rounded-md px-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full py-2.5 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-blue-500 text-sm whitespace-nowrap pl-3 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
              
              <button
                onClick={updatePassword}
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-all ${newPassword && confirmPassword && newPassword === confirmPassword
                  ? "bg-yellow-500 text-black hover:bg-yellow-600 active:bg-yellow-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>

  );
};

export default ForgotPassword;
