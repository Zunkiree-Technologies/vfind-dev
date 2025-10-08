"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";


export default function CongratsScreen() {
  const router = useRouter();

 
    

  return (
    <div className="flex items-center justify-center min-h-screen ">
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[560px] max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Image src="/icons/check.png" alt="Success" width={115} height={72} />
        </div>
        {/* Title */}
        <h1 className="text-[32px] font-bold text-gray-800 mb-2">
          Congratulations
        </h1>
        {/* Subtext */}
        <p className="text-[#6B7794] text-regular text-sm mt-4">
          You’re VFind employer account is created
        </p>
        <p className="text-[#6B7794] ext-regular text-sm mb-6 ">
          You can post a job and explore the suitable candidates now.
        </p>

        {/* Button */}
        <button
          onClick={() => router.push("/employerloginpage")}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-[#007EE6] transition"
        >
          Explore
        </button>
      </div>
    </div>
  );
}