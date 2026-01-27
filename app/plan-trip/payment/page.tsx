"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripMetaBar from "@/components/TripMetaBar";
import { useRouter, useSearchParams } from "next/navigation";
import { allNhaTrangPlaces, extraPlaces, allNhaTrangHotels } from "@/app/data/nhaTrangData";

// Helper to parse price variations
const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;

    // Handle "Miễn phí" or "Free"
    if (priceStr.toLowerCase().includes("miễn phí") || priceStr.toLowerCase().includes("free")) return 0;

    // Normalize: "420k" -> "420000", "920.000" -> "920000"
    let clean = priceStr.toLowerCase();

    // Handle ranges: take the first number "30k-50k" -> "30k"
    if (clean.includes("-")) {
        clean = clean.split("-")[0];
    }

    // Remove non-numeric except 'k'
    clean = clean.replace(/[^0-9k]/g, "");

    if (clean.endsWith("k")) {
        return parseInt(clean.replace("k", "")) * 1000;
    }

    return parseInt(clean) || 0;
};

// Flatten all attractions for lookup
const allAttractions = [...allNhaTrangPlaces, ...extraPlaces];

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Params
    const placeIds = searchParams.get("places")?.split(",") || [];
    const hotelId = searchParams.get("hotel");
    const destination = searchParams.get("destination") || "Nha Trang";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    // const peopleParam = searchParams.get("people"); // Future use

    // Defaults
    const peopleCount = 2; // Default for demo

    // 2. Derive Duration
    let durationString = "2N1Đ";
    let nights = 1;
    let days = 2;

    if (startDateParam && endDateParam) {
        const start = new Date(startDateParam);
        const end = new Date(endDateParam);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
            nights = diffDays;
            days = diffDays + 1;
            durationString = `${days}N${nights}Đ`;
        }
    }

    // 3. Lookup & Calculate
    const selectedHotel = allNhaTrangHotels.find(h => h.id === hotelId);
    // Filter out restaurants as they are usually paid on-site and not pre-booked
    const selectedAttractions = allAttractions
        .filter(p => placeIds.includes(p.id))
        .filter(p => p.type !== 'RESTAURANT');

    const hotelPrice = parsePrice(selectedHotel?.price);
    const hotelTotal = hotelPrice * nights;

    const attractionCosts = selectedAttractions.map(p => ({
        ...p,
        unitPrice: parsePrice(p.price),
        total: parsePrice(p.price) * peopleCount
    }));

    const attractionsTotal = attractionCosts.reduce((acc, curr) => acc + curr.total, 0);
    const grandTotal = hotelTotal + attractionsTotal;

    const formattedBudget = new Intl.NumberFormat('vi-VN').format(grandTotal);

    // Filter out free items for cleaner view or separate them? Let's show all but highlight free.

    const handlePay = () => {
        alert(`Thanh toán thành công ${formattedBudget} VND!`);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] overflow-hidden">
            <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
                <Header />
            </div>

            <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 pb-24 flex flex-col gap-8">

                {/* Meta Bar */}
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-sm">
                    <TripMetaBar
                        destination={destination}
                        duration={durationString}
                        placeCount={placeIds.length}
                        budget={formattedBudget}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Summary Details */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h1 className="text-3xl font-black uppercase tracking-wide">Chi tiết thanh toán</h1>

                        {/* Hotel Section */}
                        {selectedHotel && (
                            <div className="bg-white p-6 rounded-[24px] shadow-sm">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🏨</span> Lưu trú ({nights} đêm)
                                </h3>
                                <div className="flex gap-4 items-start border-b border-gray-100 pb-4 mb-4">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0">
                                        <Image src={selectedHotel.image} alt={selectedHotel.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{selectedHotel.name}</h4>
                                        <p className="text-sm text-gray-500">{selectedHotel.address}</p>
                                        <div className="mt-2 text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-lg inline-block font-medium">
                                            {selectedHotel.price}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-[#1B4D3E]">
                                            {new Intl.NumberFormat('vi-VN').format(hotelTotal)} ₫
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            x {nights} đêm
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attractions Section */}
                        {selectedAttractions.length > 0 && (
                            <div className="bg-white p-6 rounded-[24px] shadow-sm">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🎡</span> Hoạt động ({peopleCount} người)
                                </h3>
                                <div className="space-y-4">
                                    {attractionCosts.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-base">{item.name}</h4>
                                                <p className="text-xs text-gray-400">{item.price}</p>
                                            </div>
                                            <div className="text-right">
                                                {item.total > 0 ? (
                                                    <>
                                                        <div className="font-bold text-[#1B4D3E]">
                                                            {new Intl.NumberFormat('vi-VN').format(item.total)} ₫
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            x {peopleCount} người
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">Miễn phí</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Total Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1B4D3E] text-white p-8 rounded-[32px] shadow-xl sticky top-24">
                            <h3 className="text-xl font-bold mb-6 opacity-90">Tổng cộng chuyến đi</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-white/80">
                                    <span>Lưu trú</span>
                                    <span>{new Intl.NumberFormat('vi-VN').format(hotelTotal)} ₫</span>
                                </div>
                                <div className="flex justify-between items-center text-white/80">
                                    <span>Vé tham quan</span>
                                    <span>{new Intl.NumberFormat('vi-VN').format(attractionsTotal)} ₫</span>
                                </div>
                                <div className="flex justify-between items-center text-white/80">
                                    <span>Phí dịch vụ</span>
                                    <span>0 ₫</span>
                                </div>
                                <div className="h-px bg-white/20 my-4"></div>
                                <div className="flex justify-between items-center text-2xl font-black">
                                    <span>Tổng</span>
                                    <span>{formattedBudget} ₫</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                className="w-full py-4 bg-[#EF4444] rounded-2xl font-bold text-lg hover:bg-[#DC2626] transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 flex justify-center items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                Thanh toán ngay
                            </button>

                            <p className="text-center text-xs mt-4 opacity-60">
                                Thanh toán an toàn và bảo mật bởi TravelPath Secure
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
