"use client";

import React from 'react';
import Link from 'next/link';

export default function SearchWidget() {
    // Step 25: "only the plan trip" works -> Link to /plan-trip
    return (
        <div className="w-[94.44%] mx-auto mt-12 relative z-20">
            {/* Aspect Ratio 1360/173 */}
            <div className="w-full aspect-[1360/173] flex items-center justify-center relative font-sans">

                {/* 1. Container Wrapper (Rec 1) */}
                <div className="relative w-full h-full flex items-center px-[2%] py-[1%]">
                    <img
                        src="/assets/search-bar/rectangle-1.png"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    />

                    {/* Inner Content */}
                    <div className="relative z-10 w-full h-full flex items-center justify-between gap-[1.5%]">

                        {/* Rectangle 2 (Input Area container) */}
                        <div className="relative flex-1 h-[70%] flex items-center">
                            {/* Rec 2 Background */}
                            <img
                                src="/assets/search-bar/rectangle-2.png"
                                alt="Input Area"
                                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                            />

                            {/* Content Overlay */}
                            <div className="relative z-10 w-full h-full flex items-center px-[2%] justify-between">

                                {/* Section 1: "Chọn điểm đến" */}
                                <div className="flex-[1.8] h-full flex items-center justify-center cursor-pointer hover:opacity-80">
                                    <img src="/assets/search-bar/chon-diem-den.png" alt="Destination" className="h-[24%] w-auto object-contain" />
                                </div>

                                <img src="/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 2: "Thời gian đi - về" */}
                                <div className="flex-[2.2] h-full flex items-center justify-center cursor-pointer hover:opacity-80">
                                    <img src="/assets/search-bar/thoi-gian.png" alt="Time" className="h-[24%] w-auto object-contain" />
                                </div>

                                <img src="/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 3: "Số người" */}
                                <div className="flex-[1.2] h-full flex items-center justify-center cursor-pointer hover:opacity-80">
                                    <img src="/assets/search-bar/so-nguoi.png" alt="People" className="h-[21%] w-auto object-contain" />
                                </div>

                                <img src="/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 4: "Ngân sách" */}
                                <div className="flex-[1.3] h-full flex items-center justify-center cursor-pointer hover:opacity-80">
                                    <img src="/assets/search-bar/ngan-sach.png" alt="Budget" className="h-[20%] w-auto object-contain" />
                                </div>

                                <img src="/assets/search-bar/line-4.png" alt="|" className="h-[60%] w-auto object-contain opacity-50" />

                                {/* Section 5: "Phong cách" */}
                                <div className="flex-[2.3] h-full flex items-center justify-center cursor-pointer hover:opacity-80">
                                    <img src="/assets/search-bar/phong-cach.png" alt="Style" className="h-[21%] w-auto object-contain" />
                                </div>

                                {/* Search Icon */}
                                <div className="relative w-[5%] h-full flex items-center justify-center ml-[1%] border-l border-gray-200/50">
                                    <img
                                        src="/assets/search-bar/search-icon.png"
                                        alt="Search"
                                        className="h-[28%] w-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rectangle 3 (Right Button) - Wrapped in Link to /plan-trip */}
                        <Link href="/plan-trip" className="relative w-[16%] h-[70%] flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                            <img
                                src="/assets/search-bar/rectangle-3.png"
                                alt="Background"
                                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                            />
                            {/* The Label/Icon */}
                            <img
                                src="/assets/search-bar/tao-lich-trinh.png"
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
