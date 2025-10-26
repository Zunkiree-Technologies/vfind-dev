"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/navbar";
import { ArrowRight, CheckCircle } from "lucide-react";
import Footer from "../../../components/footer-section";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Google Sign-In
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      // Use localhost for dev, Vercel for production
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_APP_URL + "/oauth/callback"
      );

      // Call Xano init endpoint
      const response = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:U0aE1wpF/oauth/google/init?redirect_uri=${redirectUri}`
      );
      const data = await response.json();

      if (data.authUrl) {
        // Redirect browser to Google login
        window.location.href = data.authUrl;
      } else {
        console.error("No authUrl returned from Xano:", data);
        setError("Unable to start Google login.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again or use email/password.");
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
      const response = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: "Nurse" }),
        }
      );

      const data = await response.json();
      // console.log("Xano authToken:", data.authToken);
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.authToken) {
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("email", email);

        // console.log("Token saved:", localStorage.getItem("token"));
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
    <div className="h-fit ">
      <Navbar />
      <div className="flex items-center justify-center min-h-fit py-10  px-4 mt-10">
        {/* Flex container with responsive behavior */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-6 max-w-5xl w-full">
          {/* "New to VFind" Section (Now on the Left) */}
          <div
            className="hidden md:flex flex-col justify-between w-full lg:w-[627px] lg:h-[480px] p-10 rounded-2xl shadow-md 
        order-2 lg:order-1
bg-[linear-gradient(to_top,#BEDCFD_0%,#E5F1FF_40%,#FCFEFF_100%)]

"
          >
            <div className="mt-10 ml-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                New to VFind?
              </h2>
              <ul className="space-y-3 text-[#474D6A] font-weight-medium text-sm  ">

                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0  rounded-full" />
                  <span className=" font-regular text-[14px]  text-black " >One click apply using VFind profile.</span>
                </li>

                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0  rounded-full" />
                  <span className=" font-regular text-[14px]  text-black "  > Get relevant job recommendations.</span>
                </li>
                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0  rounded-full" />
                  <span className=" font-regular text-[14px]  text-black "  >  Showcase profile to top companies and consultants.</span>
                </li>
                <li className="flex items-start gap-4 mt-5">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0  rounded-full" />
                  <span className=" font-regular text-[14px]  text-black " >  Get connection request from top companies.</span>
                </li>

              </ul>
              <button
                onClick={() => router.push("/signup")}
                className="group mt-6 h-[38px] w-[225px] text-white bg-[#61A6FA] rounded-[8px] shadow transition-all duration-300
                 overflow-hidden flex items-center justify-center"
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

          {/* Login Section (Now on the Right) */}
          <div className="border-1 border-gray-300 lg:order-1 w-full lg:w-[448px] h-auto lg:h-[477px] bg-white shadow-md rounded-2xl p-10">


            <h2 className="text-xl sm:text-[22px] font-medium text-[#121224] ">
              Sign In to Your Nurse Account
            </h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-3">{success}</p>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium text-sm mt-3 ">
                  Email Address{" "}
                </label>
                <input
                  type="email"
                  className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#717B9E] h-[40] w-[328]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#717B9E] h-[40] w-[328]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-[#4A90E2] "
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <a
                  href="/forgot_password_nurse"
                  className="text-sm text-[#4A90E2] hover:underline float-right mt-2 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full sm:w-[328px] h-[40px] bg-[#61A6FA] text-white rounded-lg font-medium transition-all duration-300 mt-12 mx-auto block overflow-hidden flex items-center justify-center"
              >
                <span className="flex items-center gap-2">
                  <span className="transition-all duration-300 group-hover:-translate-x-1">
                    {loading ? "Logging in..." : "Login"}
                  </span>
                  {!loading && (
                    <ArrowRight
                      className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      strokeWidth={3}
                    />
                  )}
                </span>
              </button>

            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div>
              <button
                onClick={loginWithGoogle}
                className="w-full sm:w-[328px] h-[40px] border border-gray-300 bg-white text-[#717B9E] rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2 mx-auto"
              >
                <Image
                  src="/icons/google.png"
                  alt="Google Icon"
                  width={20}
                  height={20}
                />
                <span>Sign in with Google</span>
              </button>

            </div>
            <div className="block text-center mt-4 text-sm text-gray-600">
              Don’t have an account?
              <button
                onClick={() => router.push("/signup")}
                className="text-[#4A90E2] font-medium ml-1"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1F3C88] ">
        <Footer />
      </div>

    </div>
  );
}