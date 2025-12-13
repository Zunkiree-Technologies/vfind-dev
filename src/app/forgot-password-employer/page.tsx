"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation";
import Footer from "../../../components/footer-section";
import { supabase } from "@/lib/supabase";




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
      const normalizedEmail = email.trim().toLowerCase();

      // Check if employer exists
      const { data: employer, error: fetchError } = await supabase
        .from('employers')
        .select('id, email')
        .eq('email', normalizedEmail)
        .single();

      if (fetchError || !employer) {
        alert("No account found with this email address");
        setIsLoading(false);
        return;
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      // Store OTP in database
      const { error: otpError } = await supabase
        .from('otp_tokens')
        .upsert({
          email: normalizedEmail,
          otp_code: otpCode,
          expires_at: expiresAt,
          user_type: 'employer',
        }, { onConflict: 'email' });

      if (otpError) throw new Error("Failed to generate OTP");

      // TODO: Send email with OTP (for now, we'll just show it in the console for testing)
      console.log("OTP for testing:", otpCode);

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
      const normalizedEmail = email.trim().toLowerCase();

      // Get OTP from database
      const { data: otpRecord, error: otpError } = await supabase
        .from('otp_tokens')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('otp_code', enteredOtp)
        .eq('user_type', 'employer')
        .single();

      if (otpError || !otpRecord) {
        alert("Invalid OTP");
        setIsLoading(false);
        return;
      }

      // Check if OTP is expired
      if (new Date(otpRecord.expires_at) < new Date()) {
        alert("OTP has expired. Please request a new one.");
        setIsLoading(false);
        return;
      }

      setStep(3);
      alert("OTP verified! Please set your new password.");
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
      const normalizedEmail = email.trim().toLowerCase();

      // Hash the new password (simple hash for demonstration - in production use bcrypt on server)
      // For now, we'll store a simple hash or use Supabase Auth
      const { error: updateError } = await supabase
        .from('employers')
        .update({ password: newPassword }) // In production, this should be hashed
        .eq('email', normalizedEmail);

      if (updateError) {
        throw new Error("Failed to update password");
      }

      // Delete the OTP token
      await supabase
        .from('otp_tokens')
        .delete()
        .eq('email', normalizedEmail);

      alert("Password updated successfully!");
      // Reset everything
      setStep(1);
      setEmail("");
      setEmailError("");
      setOtp(new Array(6).fill(""));
      setNewPassword("");
      setConfirmPassword("");
      setTimeLeft(600);

      router.push("/employerloginpage");
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
    <div className="min-h-fit lg:py-10 flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 max-w-7xl w-full mx-auto">

        {/* Left section - Hidden on mobile and small tablets */}
        <div
          className="hidden lg:flex flex-col justify-between w-full xl:w-[699px] h-auto lg:h-[420px] xl:h-[481px] rounded-2xl shadow-lg p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl xl:text-[40px] font-bold text-[#121224] leading-tight mb-8">
              Reset your password easily
            </h1>

            {/* Instructions with checkmarks */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#60A5FA" fillOpacity="0.2"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#474D6A] text-sm lg:text-base">
                  Enter your registered email address.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#60A5FA" fillOpacity="0.2"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#474D6A] text-sm lg:text-base">
                  Check your inbox for a one-time OTP.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#60A5FA" fillOpacity="0.2"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#474D6A] text-sm lg:text-base">
                  Use the OTP to create a new password.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#60A5FA" fillOpacity="0.2"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#474D6A] text-sm lg:text-base">
                  Regain secure access to your account.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <button
            onClick={() => router.push("/employerloginpage")}
            className="flex items-center gap-2 text-blue-400 border border-blue-400 w-fit px-4 py-4  font-medium transition-colors mt-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Login
          </button>
        </div>

        {/* Right section - Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md h-fit mx-auto xl:mx-0">

          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-semibold text-[#121224] mt-2">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email address and we will send you an OTP to reset your password.
              </p>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#091E42] mb-2">Email Address</label>
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
                  className="w-full rounded-lg px-4 py-3 outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <button
                onClick={sendOTP}
                disabled={isLoading || !!emailError || !email}
                className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${!emailError && email
                  ? "bg-blue-400 text-white hover:bg-blue-400 active:bg-blue-400"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>

              {/* Back to Login - Mobile */}
              <button
                onClick={() => router.push("/employerloginpage")}
                className="lg:hidden flex items-center justify-center gap-2 text-blue-400 hover:text-blue-400 font-medium transition-colors mt-4 w-full"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Login
              </button>


            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-semibold text-[#121224] mt-2">
                Enter OTP
              </h2>
              <p className="text-sm text-gray-500 mt-2 break-all">
                We have sent a 6-digit OTP to <strong>{email}</strong>
              </p>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#091E42] mb-2">OTP</label>
                <div className="flex gap-2 justify-between max-w-xs mx-auto sm:mx-0">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-lg text-lg sm:text-xl outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
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
                className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${!isLoading && timeLeft > 0
                  ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
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

              {/* Back to Login - Mobile */}
              <button
                onClick={() => router.push("/employerloginpage")}
                className="lg:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors mt-4 w-full"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Login
              </button>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <>
              <h2 className="text-xl sm:text-[22px] font-semibold text-[#121224] mt-2">
                Set New Password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Create a strong password for your account.
              </p>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#091E42] mb-2">
                  New Password
                </label>
                <div className="flex items-center rounded-lg px-4 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-3 outline-none"
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
                <label className="block text-sm font-medium text-[#091E42] mb-2">
                  Confirm New Password
                </label>
                <div className="flex items-center rounded-lg px-4 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full py-3 outline-none"
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
                className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${newPassword && confirmPassword && newPassword === confirmPassword
                  ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>

              {/* Back to Login - Mobile */}
              <button
                onClick={() => router.push("/employerloginpage")}
                className="lg:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors mt-4 w-full"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
     <Footer />
  </div>

  );
};

export default ForgotPassword;
