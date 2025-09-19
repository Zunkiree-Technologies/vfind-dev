"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

// Fake company data
const companies = [
    { id: 1, name: "Regis Healthcare", initials: "RH" },
    { id: 2, name: "Bupa Health", initials: "BH" },
    { id: 3, name: "Silver Chain", initials: "SC" },
    { id: 4, name: "Healthscope", initials: "HS" },
    { id: 5, name: "Aveo Group", initials: "AG" },
    { id: 6, name: "Estia Health", initials: "EH" },
];

export const FeaturedCompanies = () => {
    return (
        <section className="min-h-[646px] bg-white flex items-center justify-center">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Featured Companies Actively Hiring
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Top healthcare employers looking for talented nurses
                    </p>
                </div>

                {/* Slider Wrapper */}
                <div className="relative mt-5">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        loop={true}
                        pagination={{
                            clickable: true,
                            el: ".custom-pagination", 
                        }}
                        className="pb-16"
                    >

                        <div className="custom-pagination flex justify-center mt-20" />

                        {companies.map((company) => (
                            <SwiperSlide key={company.id}>
                                <div className="border border-gray-200 rounded-xl p-8 h-48 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition bg-white">
                                    {/* Circle with initials */}
                                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-semibold mb-4">
                                        {company.initials}
                                    </div>
                                    <p className="text-gray-900 font-medium text-lg">
                                        {company.name}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};
