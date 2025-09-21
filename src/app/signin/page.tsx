"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
          body: JSON.stringify({ email, password,role: "Nurse", }),
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
    <div>
      <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Flex container with responsive behavior */}
      <div className="flex flex-col md:flex-col lg:flex-row gap-6 max-w-5xl w-full">
        {/* "New to VFind" Section (Now on the Left) */}
        <div
          className="hidden md:flex flex-col justify-between w-full lg:w-[627px] lg:h-[480px] p-10 rounded-2xl shadow-md 
        order-2 lg:order-1 bg-gradient-to-tr from-[rgba(238,174,202,0.15)] to-white"
        >
          <div className="mt-10 ml-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              New to VFind?
            </h2>
            <ul className="space-y-3 text-[#474D6A] font-weight-medium text-sm  ">
              <li className="flex items-start gap-4 mt-5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-200 text-green-500 text-sm font-bold">
                  ✔
                </span>
                One click apply using VFind profile.
              </li>
              <li className="flex items-start gap-4 mt-5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-200 text-green-500 text-sm font-bold">
                  ✔
                </span>
                Get relevant job recommendations.
              </li>
              <li className="flex items-start gap-4 mt-5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-200 text-green-500 text-sm font-bold">
                  ✔
                </span>
                Showcase profile to top companies and consultants.
              </li>
              <li className="flex items-start gap-4 mt-5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-200 text-green-500 text-sm font-bold">
                  ✔
                </span>
                Know application status on applied jobs.
              </li>
            </ul>
            <button
              onClick={() => router.push("/signup")}
              className="mt-6 h-[38px] w-[225px] bg-white text-[#4A90E2] rounded-[8px] shadow hover:bg-blue-500 hover:text-white transition font-medium"
            >
              Register for Free
            </button>
          </div>
          <div className="mt-auto flex justify-end">
            <div className="w-35 h-35 rounded-full overflow-hidden">
              <Image
                src="/assets/profile.png"
                alt="Login Illustration"
                width={194}
                height={194}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Login Section (Now on the Right) */}
        <div className="order-1 lg:order-2 w-full lg:w-[448px] h-auto lg:h-[477px] bg-white shadow-md rounded-2xl p-10">
          <h2 className="text-xl sm:text-2xl text-center md:text-3xl font-medium text-gray-800 mb-2 mt-10 ">
           Nurse Login
          </h2>


          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium text-sm mt-3 ">
                Email ID{" "}
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#717B9E] h-[40] w-[328]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email ID"
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
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#717B9E] h-[40] w-[328]"
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
                href="/forgot-password"
                className="text-sm text-[#4A90E2] hover:underline float-right mt-2"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-[327px] md:w-[400px] h-auto sm:h-[38px] bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-blue-500 transition mt-10 mx-auto block py-3 sm:py-0"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-300"></div>

          </div>
          <div>
            <button
              onClick={() => router.push("/signup")}
              className="w-full sm:w-[300px] h-auto sm:h-[38px] bg-white text-[#717B9E] rounded-lg font-medium hover:bg-gray-300 hover:text-white transition flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-15 py-3 sm:py-0 mx-auto"
            >
              <Image src="/icons/google.png" alt="Google Icon" width={20} height={20} />
              Sign in with Google
            </button>
          </div>
          <div className="block sm:hidden text-center mt-4 text-sm text-gray-600">
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
    </div>
  );
}
