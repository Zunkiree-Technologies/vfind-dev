"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import Loader from "../../../../components/loading";

interface ProfileImage {
    path?: string;
}

interface CandidateDetail {
    id: number;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    currentResidentialLocation?: string;
    qualification?: string;
    startTime?: string;
    profileImage?: ProfileImage | null;
}

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<CandidateDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employerId, setEmployerId] = useState<number | null>(null);

    // Load employerId from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmployerId = localStorage.getItem("employerId");
            if (storedEmployerId) setEmployerId(Number(storedEmployerId));
        }
    }, []);

    // Fetch wishlist from API
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!employerId) return;

            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Unauthorized: Please log in");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    "https://x8ki-letl-twmt.n7.xano.io/api:P9j60cGD/getWishlistForSpecificEmployer",
                    {
                        method: "GET", 
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to fetch wishlist: ${text}`);
                }

                const data: CandidateDetail[] = await res.json();
                setWishlist(data);
            } catch (err: unknown) {
                console.error(err);
                if (err instanceof Error) setError(err.message);
                else setError("Unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [employerId]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader loading={true} message="Loading wishlist..." />
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                {error}
            </div>
        );

    if (wishlist.length === 0)
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                No candidates in your wishlist.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
                My Wishlist
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((candidate) => {
                    const profileImageUrl = candidate.profileImage?.path
                        ? `https://x8ki-letl-twmt.n7.xano.io${candidate.profileImage.path}`
                        : null;

                    return (
                        <div
                            key={candidate.id}
                            className="relative rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {/* Photo */}
                            <div className="absolute top-6 right-6 h-20 w-20 bg-gray-200 rounded-lg overflow-hidden">
                                {profileImageUrl ? (
                                    <Image
                                        src={profileImageUrl}
                                        alt={candidate.fullName}
                                        width={80}
                                        height={80}
                                        className="object-cover h-full w-full"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                                        {candidate.fullName?.charAt(0) || "N"}
                                    </div>
                                )}
                            </div>

                            <h2 className="font-bold text-xl mb-1 text-blue-700">
                                {candidate.fullName}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {candidate.qualification || "Qualification not specified"}
                            </p>

                            <div className="space-y-2 text-gray-700 text-sm">
                                {candidate.currentResidentialLocation && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-blue-600" />
                                        <span>{candidate.currentResidentialLocation}</span>
                                    </div>
                                )}
                                {candidate.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} className="text-blue-600" />
                                        <span>{candidate.phoneNumber}</span>
                                    </div>
                                )}
                                {candidate.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={18} className="text-blue-600" />
                                        <span>{candidate.email}</span>
                                    </div>
                                )}
                                {candidate.startTime && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-blue-600" />
                                        <span>{candidate.startTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
