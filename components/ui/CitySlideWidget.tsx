"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cities = [
    {
        name: "Nha Trang",
        description: "Mê hoặc du khách với biển xanh trong, nắng vàng và nhịp sống biển.",
        image: "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/cities/nhatrang.webp",
    },
    {
        name: "Đà Lạt",
        description: "Ghi dấu trong lòng du khách bởi khí trời mát dịu, cảnh sắc và vẻ yên bình.",
        image: "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/cities/dalat.jpg",
    },
    {
        name: "Hội An",
        description: "Gây thương nhớ bởi vẻ cổ kính, đèn lồng và nhịp sống chậm đầy hoài niệm.",
        image: "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/cities/hoian.jpg",
    },
    {
        name: "TP. Hồ Chí Minh",
        description: "Sôi động với nhịp sống nhanh, năng lượng và sự giao thoa hiện đại – truyền thống.",
        image: "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/cities/saigon.jpg",
    },
    {
        name: "Hà Nội",
        description: "Trầm lắng và sâu lắng, nổi bật với nét cổ kính, và văn hóa nghìn năm.",
        image: "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/cities/hanoi.jpg",
    },
];

export default function CitySlideWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cities.length);
        }, 4000); // Change every 4 seconds
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % cities.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + cities.length) % cities.length);
    };

    return (
        <div className="relative w-72 h-72 md:w-96 md:h-96 group">
            {/* Cards Stack Effect */}
            <div className="relative w-full h-full">
                {cities.map((city, index) => {
                    // Calculate relative position based on currentIndex
                    // We want to show: Current, Next, Next+1 stacking behind
                    let position = (index - currentIndex + cities.length) % cities.length;

                    // Only render visible cards to save resources and manage stacking
                    // 0 = Active
                    // 1 = Behind 1
                    // 2 = Behind 2
                    // ... rest hidden or far behind
                    if (position > 3 && position < cities.length - 1) return null;

                    const isCurrent = position === 0;
                    const isNext = position === 1;
                    const isNextNext = position === 2;
                    const isNextNextNext = position === 3;

                    let transformClass = "scale-75 opacity-0 -translate-x-16";
                    let zIndex = 0;

                    if (isCurrent) {
                        transformClass = "scale-100 opacity-100 translate-x-0 z-40";
                        zIndex = 40;
                    } else if (isNext) {
                        transformClass = "scale-90 opacity-80 translate-x-0 -translate-y-4 z-30";
                        zIndex = 30;
                    } else if (isNextNext) {
                        transformClass = "scale-80 opacity-60 translate-x-0 -translate-y-8 z-20";
                        zIndex = 20;
                    } else if (isNextNextNext) {
                        transformClass = "scale-70 opacity-40 translate-x-0 -translate-y-12 z-10";
                        zIndex = 10;
                    }

                    if (position === cities.length - 1) {
                        transformClass = "scale-110 opacity-0 translate-x-16 z-50";
                    }

                    return (
                        <div
                            key={city.name}
                            className={`absolute top-0 right-0 w-full h-full transition-all duration-700 ease-in-out ${transformClass}`}
                            style={{ zIndex }}
                        >
                            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-2 border-white/50">
                                <Image
                                    src={city.image}
                                    alt={city.name}
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-md rounded-[2rem] p-4 text-center shadow-lg border border-gray-100">
                                    <h3 className="text-[#8B4513] text-lg md:text-xl font-bold uppercase tracking-tight mb-1">
                                        {city.name}
                                    </h3>
                                    <p className="text-[#1B4D3E] text-[10px] md:text-xs font-medium leading-relaxed px-2">
                                        {city.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons (Hidden but clickable area or small indicators) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                {cities.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>

            {/* Arrow Controls */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 -left-4 -translate-y-1/2 z-50 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 -right-4 -translate-y-1/2 z-50 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors hidden md:block"
            >
                <ChevronRight size={24} />
            </button>

        </div>
    );
}
