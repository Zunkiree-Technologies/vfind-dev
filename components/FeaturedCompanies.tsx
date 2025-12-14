"use client";
import React from "react";
import Image from "next/image";

// Healthcare companies with logos
const companies = [
    { name: "Regis Healthcare", logo: "/assets/logos/regis.svg" },
    { name: "Bupa Health", logo: "/assets/logos/bupa.svg" },
    { name: "Silver Chain", logo: "/assets/logos/silverchain.png" },
    { name: "Healthscope", logo: "/assets/logos/healthscope.jpg" },
    { name: "Estia Health", logo: "/assets/logos/estia.svg" },
];

export const FeaturedCompanies = () => {
    return (
        <section className="py-16 sm:py-20 bg-[#f5f5f7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
                    {/* Left side - Title */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            <span className="font-secondary text-sm text-gray-500">Healthcare leaders</span>
                        </div>
                        <h2 className="font-primary text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                            Trusted by
                            <br />
                            <span className="text-gray-400">Leading Employers</span>
                        </h2>
                    </div>

                    {/* Right side - Statement */}
                    <div className="flex items-center">
                        <div>
                            <p className="font-primary text-xl sm:text-2xl font-semibold mb-3">
                                <span className="text-orange-500">Because </span>
                                <span className="text-gray-900">talent </span>
                                <span className="text-pink-500">deserves </span>
                                <span className="text-blue-500">visibility.</span>
                            </p>
                            <p className="font-secondary text-gray-500">
                                From hospitals to aged care — top employers discover nurses on VFind.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Company logos in cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl py-6 px-4 flex items-center justify-center h-24"
                        >
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={120}
                                height={40}
                                className="object-contain max-h-10 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
