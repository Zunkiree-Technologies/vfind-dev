"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loginNurse } from "@/lib/supabase-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // Google Sign-In (TODO: Implement with Supabase OAuth)
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      setError("Google Sign-In coming soon. Please use email/password.");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await loginNurse(email, password);

      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }

      if (result.authToken) {
        login(result.authToken, "Nurse", email);
        localStorage.setItem("token", result.authToken);
        localStorage.setItem("email", email);
      }

      setSuccess("Login successful!");
      router.push("/nurseProfile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Decorative Background Blobs - Larger and more prominent */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/70 to-pink-300/50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-100/60 to-amber-100/40 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-100/50 to-rose-100/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gradient-to-tr from-orange-100/40 to-pink-100/30 rounded-full blur-2xl translate-y-1/3" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[2rem] shadow-sm border border-gray-100 px-10 py-10 sm:px-12 sm:py-12">

        {/* Circular Logo with Gradient Ring and Outer Glow */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer golden glow ring */}
            <div className="absolute inset-0 w-[88px] h-[88px] -m-1 rounded-full border-2 border-orange-200/60"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-orange-400 p-[3px]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-orange-50 flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-500 font-bold text-3xl">V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Heading - with colored period */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 mb-2">
            Welcome to VFind<span className="text-orange-400">.</span>
          </h1>
          <p className="text-gray-500 text-[15px]">
            Your nursing career starts here
          </p>
        </div>

        {/* Social Login Buttons - Pill shaped, taller */}
        <div className="space-y-4 mb-6">
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full h-14 border border-gray-200 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <Image
              src="/icons/google.png"
              alt="Google"
              width={22}
              height={22}
            />
            <span className="text-[15px]">Log in with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter password"
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
            <div className="flex justify-end mt-2">
              <Link
                href="/forgot_password_nurse"
                className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors"
              >
                Trouble logging in?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-500 text-[15px]">
          New to VFind?{" "}
          <Link
            href="/signup"
            className="text-pink-500 hover:text-pink-600 font-semibold transition-colors"
          >
            Join us
          </Link>
        </p>

        {/* Help Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-sm">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
