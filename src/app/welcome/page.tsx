"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get user name from localStorage
    if (typeof window !== "undefined") {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          // Get first name only
          const fullName = profile.fullName || profile.full_name || "";
          const firstName = fullName.split(" ")[0];
          setUserName(firstName);
        } catch (e) {
          console.error("Error parsing user profile:", e);
        }
      }
    }
  }, []);

  const handleCompleteProfile = () => {
    router.push("/nurseProfile/complete-profile");
  };

  const handleSkip = () => {
    router.push("/nurseProfile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/70 to-pink-300/50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-100/60 to-amber-100/40 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-100/50 to-rose-100/40 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gradient-to-tr from-orange-100/40 to-pink-100/30 rounded-full blur-2xl translate-y-1/3" />

      {/* Welcome Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-white rounded-[2rem] shadow-sm border border-gray-100 px-10 py-12 sm:px-14 sm:py-14 text-center">

        {/* Avatar with Gradient Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 w-[120px] h-[120px] -m-2 rounded-full bg-gradient-to-br from-pink-200/50 to-orange-200/50 blur-md"></div>
            {/* Avatar ring */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-orange-400 p-[3px]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-orange-50 flex items-center justify-center overflow-hidden">
                {/* Default avatar icon */}
                <Image
                  src="/icons/nurse-avatar.png"
                  alt="Welcome"
                  width={60}
                  height={60}
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span class="text-4xl">👋</span>';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Heading */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-[32px] font-bold text-gray-900 mb-2">
            Yay{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-gray-500 text-lg">
            Welcome aboard!
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gray-200 mx-auto mb-8"></div>

        {/* Message */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Your journey begins now.
          </h2>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto">
            Your account is ready. Let&apos;s add a few more details to help employers discover you and match you with the perfect nursing opportunities.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleCompleteProfile}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
          >
            Complete My Profile
          </button>

          <button
            onClick={handleSkip}
            className="w-full h-12 text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors underline underline-offset-4"
          >
            Skip for now
          </button>
        </div>

        {/* Benefits hint */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-sm">
            A complete profile helps you stand out to employers
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Get discovered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Better matches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
