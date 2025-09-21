"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Briefcase, Clock } from "lucide-react";
import Loader from "../../../../components/loading";
import Link from "next/link";

interface NurseProfile {
  id: number;
  fullName: string;
  email: string;
  qualification?: string;
  currentResidentialLocation?: string;
  jobTypes?: string;
  maxWorkHours?: string;
  profileImage?: { path: string } | null;
}

const BASE_IMAGE_URL = "https://x76o-gnx4-xrav.a2.xano.io";

export default function WishlistNurses() {
  const [nurses, setNurses] = useState<NurseProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:P9j60cGD/getWishlistForSpecificEmployer",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        // console.log("Full Wishlist Data:", data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nurseList: NurseProfile[] = data.map((item: any) => item._nurse_profiles_2);
        // console.log("Nurse Profiles:", nurseList);

        setNurses(nurseList);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch nurses.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="p-6 min-h-screen mx-auto container">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Wishlist Nurses</h1>
      {nurses.length === 0 ? (
        <p className="text-gray-500">No nurses in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nurses.map((nurse) => {
            const profileImageUrl = nurse.profileImage
              ? BASE_IMAGE_URL + nurse.profileImage.path
              : null;

            return (
              <div
                key={nurse.id}
                className="relative rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="absolute top-6 right-6 h-20 w-20 bg-gray-200 rounded-lg overflow-hidden">
                  {profileImageUrl ? (
                    <Image
                    priority
                      src={profileImageUrl}
                      alt={nurse.fullName}
                      className="h-full w-full object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300" />
                  )}
                </div>

                <h2 className="font-bold text-xl mb-1 text-blue-700">{nurse.fullName}</h2>
                <p className="text-gray-600 mb-4">
                  {nurse.qualification || "Qualification not specified"}
                </p>

                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    <span>
                      {nurse.currentResidentialLocation || "Location not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    <span>{nurse.jobTypes || "Job type not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <span>
                      {nurse.maxWorkHours
                        ? `${nurse.maxWorkHours}/hr Per Week`
                        : "Hourly pay not specified"}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/EmployerDashboard/Candidatelist/${nurse.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-full inline-block text-center"
                >
                  View details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
