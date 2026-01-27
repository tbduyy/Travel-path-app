"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripMetaBar from "@/components/TripMetaBar";
import { useRouter, useSearchParams } from "next/navigation";

function DemoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Params
    const placeIds = searchParams.get("places")?.split(",") || [];
    const hotelId = searchParams.get("hotel");
    const destination = searchParams.get("destination") || "Nha Trang";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const budgetParam = searchParams.get("budget");
    const placeCount = placeIds.length;

    // Derived Data
    let durationString = "2N1Đ";
    if (startDateParam && endDateParam) {
        const start = new Date(startDateParam);
        const end = new Date(endDateParam);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
            durationString = `${diffDays + 1}N${diffDays}Đ`;
        }
    }

    const formattedBudget = budgetParam
        ? new Intl.NumberFormat('vi-VN').format(parseInt(budgetParam))
        : (destination?.includes("Nha Trang") ? "2.500.000" : "8.000.000");

    const handleCheckout = () => {
        // Navigate to payment page with all current params
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/plan-trip/payment?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] overflow-hidden">
            <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
                <Header />
            </div>

            <div className="flex-1 w-full max-w-[1500px] mx-auto p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-8">

                {/* Header Section (Matching trips page) */}
                <div className="flex flex-col mb-4 gap-6 shrink-0">

                    {/* 1. Meta Info Row */}
                    <TripMetaBar
                        destination={destination}
                        duration={durationString}
                        placeCount={placeCount}
                        budget={formattedBudget}
                    />

                    {/* Title Section */}
                    <div className="flex items-center justify-between">
                        {/* Title Badge - Tweaked for Demo Page Context */}
                        <div className="bg-[#3C6E64] text-white px-8 py-3 rounded-2xl shadow-sm">
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide">Mô phỏng lịch trình</h1>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-[#1B4D3E] font-bold hover:text-[#113D38] transition-colors p-3 rounded-xl border-2 border-[#1B4D3E]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                            </button>
                            <button className="bg-[#113D38] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#0D2F2B] shadow-sm transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                <span>Lưu lịch trình</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Simulation Video Placeholder */}
                <div className="w-full aspect-video bg-black/20 rounded-[32px] overflow-hidden relative shadow-2xl group cursor-pointer border-4 border-white/50">
                    {/* Background Image (Static fallback) */}
                    <Image
                        src="/placeholder.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-2 border border-white/40 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                        <h2 className="text-white text-3xl font-black mt-6 uppercase tracking-widest drop-shadow-lg">Xem mô phỏng chuyến đi</h2>
                        <p className="text-white/80 mt-2 font-medium">Thời lượng ước tính: 1:30</p>
                    </div>

                    {/* Chatbot Icon Overlay */}
                    <div className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-full p-2 shadow-xl border-4 border-[#41C7D6]">
                        <Image src="/logo.png" alt="Bot" width={64} height={64} className="object-contain" />
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleCheckout}
                        className="bg-[#EF4444] text-white px-10 py-4 rounded-full font-black text-xl hover:bg-[#DC2626] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3"
                    >
                        <span>Hoàn thành và Thanh toán</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DemoPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DemoContent />
        </Suspense>
    );
}
