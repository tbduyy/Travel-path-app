"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchPlaces } from '@/app/actions/search';

export default function SearchWidget() {
    const router = useRouter();

    // State for filters
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [people, setPeople] = useState('');
    const [budget, setBudget] = useState('');
    const [style, setStyle] = useState('');

    const handleSearch = async () => {
        console.log("Searching for:", { destination });

        try {
            const result = await searchPlaces({
                destination,
                dates,
                people,
                budget,
                style
            });

            if (result.success) {
                console.log("Search Results:", result.data);
                if (result.data && result.data.length > 0) {
                    // Create a formatted list of names
                    const names = result.data.map((place: any) => `- ${place.name}`).join('\n');
                    alert(`Tìm thấy ${result.data.length} địa điểm khớp với '${destination}':\n\n${names}`);
                } else {
                    alert(`Không tìm thấy địa điểm nào khớp với '${destination}'`);
                }

                // Future: Navigate or update state
            } else {
                console.error("Search failed");
            }
        } catch (error) {
            console.error("Error calling search action:", error);
        }
    };

    return (
        <div className="w-[94.44%] mx-auto mt-12 relative z-20">
            {/* Aspect Ratio 1360/173 */}
            <div className="w-full aspect-[1360/173] flex items-center justify-center relative font-sans">

                {/* 1. Container Wrapper (Rec 1) */}
                <div className="relative w-full h-full flex items-center px-[2%] py-[1%]">
                    <img
                        src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-1.png"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    />

                    {/* Inner Content */}
                    <div className="relative z-10 w-full h-full flex items-center justify-between gap-[1.5%]">

                        {/* Rectangle 2 (Input Area container) */}
                        <div className="relative flex-1 h-[70%] flex items-center">
                            {/* Rec 2 Background */}
                            <img
                                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-2.png"
                                alt="Input Area"
                                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                            />

                            {/* Content Overlay */}
                            <div className="relative z-10 w-full h-full flex items-center px-[2%] justify-between">

                                {/* Section 1: "Chọn điểm đến" */}
                                <div className="flex-[1.8] h-full flex items-center justify-center px-2">
                                    <input
                                        type="text"
                                        placeholder="Chọn điểm đến"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full text-center bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-sm md:text-base lg:text-lg truncate"
                                    />
                                </div>

                                <img src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 2: "Thời gian đi - về" */}
                                <div className="flex-[2.2] h-full flex items-center justify-center px-2">
                                    <input
                                        type="text"
                                        placeholder="Thời gian đi - về"
                                        value={dates}
                                        onChange={(e) => setDates(e.target.value)}
                                        className="w-full text-center bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-sm md:text-base lg:text-lg truncate"
                                    />
                                </div>

                                <img src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 3: "Số người" */}
                                <div className="flex-[1.2] h-full flex items-center justify-center px-2">
                                    <input
                                        type="text"
                                        placeholder="Số người"
                                        value={people}
                                        onChange={(e) => setPeople(e.target.value)}
                                        className="w-full text-center bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-sm md:text-base lg:text-lg truncate"
                                    />
                                </div>

                                <img src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 4: "Ngân sách" */}
                                <div className="flex-[1.3] h-full flex items-center justify-center px-2">
                                    <input
                                        type="text"
                                        placeholder="Ngân sách"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full text-center bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-sm md:text-base lg:text-lg truncate"
                                    />
                                </div>

                                <img src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 5: "Phong cách" */}
                                <div className="flex-[2.3] h-full flex items-center justify-center px-2">
                                    <input
                                        type="text"
                                        placeholder="Phong cách"
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full text-center bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-sm md:text-base lg:text-lg truncate"
                                    />
                                </div>

                                {/* Search Icon */}
                                <div
                                    className="relative w-[5%] h-full flex items-center justify-center ml-[1%] border-l border-gray-200/50 cursor-pointer hover:scale-110 transition-transform"
                                    onClick={handleSearch}
                                >
                                    <img
                                        src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/search-icon.png"
                                        alt="Search"
                                        className="h-[28%] w-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rectangle 3 (Right Button) - Wrapped in Link to /plan-trip */}
                        <Link href="/plan-trip" className="relative w-[16%] h-[70%] flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                            <img
                                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-3.png"
                                alt="Background"
                                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                            />
                            {/* The Label/Icon */}
                            <img
                                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/tao-lich-trinh.png"
                                alt="Tạo lịch trình"
                                className="relative z-10 h-[25%] w-auto object-contain"
                            />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
