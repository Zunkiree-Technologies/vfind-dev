"use client";

import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer-section";
import { CircleCheckBig } from "lucide-react";


export default function CongratsScreen() {
  const router = useRouter();




  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center min-h-[60vh] ">
        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-[560px] max-w-md text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <CircleCheckBig className="w-20 h-20 text-blue-400" />

          </div>
          {/* Title */}
          <h1 className="text-[32px] font-bold text-gray-800 mb-2">
            Congratulations
          </h1>
          {/* Subtext */}
          <p className="text-[#6B7794] text-regular text-sm mt-4">
            Your VFind employer account is created
          </p>
          <p className="text-[#6B7794] ext-regular text-sm mb-6 ">
            You can post a job and explore the suitable candidates now.
          </p>

          {/* Button */}
          <button
            onClick={() => router.push("/employerloginpage")}
            className="w-full py-2 bg-blue-400 text-white font-bold rounded-lg hover:bg-[#007EE6] transition"
          >
            Explore
          </button>
        </div>
      </div>
      <div className="bg-[#1F3C88] ">
        <Footer />
      </div>
    </div>

  );
}