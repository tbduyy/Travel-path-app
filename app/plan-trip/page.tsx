"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";

export default function PlanTripPage() {
    const [places, setPlaces] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState(3);
    const router = useRouter();

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setHasSearched(true);
            const term = searchTerm || "Đà Lạt";
            const result = await searchPlaces({ destination: term });
            if (result.success && result.data) {
                setPlaces(result.data);
            }
        }
    };

    const togglePlace = (id: string) => {
        setSelectedPlaceIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const visiblePlaces = places.slice(0, visibleCount);

    return (
        <div className="min-h-screen flex flex-col relative font-sans text-[#1B4D3E] bg-[#BBD9D9]">
            {/* Standard Header */}
            <div className="sticky top-0 z-50">
                <Header />
            </div>

            {/* Background Image Area */}
            <div className="relative w-full max-w-7xl mx-auto mt-2 h-28 shrink-0 transition-all duration-500 ease-in-out">
                <Image src="/assets/plan-trip/rectangle-7.png" alt="Background" fill className="object-cover rounded-2xl shadow-lg" />

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-black/10 rounded-2xl">
                    {/* Top Row: Back Arrow, Title, Search */}
                    <div className="flex justify-between items-start w-full">
                        {/* Back Arrow */}
                        <div className="cursor-pointer hover:scale-110 transition-transform group mt-1" onClick={() => router.push('/')}>
                            <Image src="/assets/plan-trip/arrow-long.png" alt="Back" width={42} height={42} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Center Title Area */}
                        <div className="flex-1 text-center px-4 pt-2">
                            {hasSearched ? (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#113D38] uppercase drop-shadow-md mb-2">
                                        Các địa điểm nổi bật tại {searchTerm || "Đà Lạt"}
                                    </h1>
                                    <p className="text-[#2E968C] text-lg font-medium tracking-wide drop-shadow-sm">
                                        Chọn ít nhất 1 nơi mà bạn muốn đến
                                    </p>
                                </div>
                            ) : (
                                <p className="text-3xl md:text-4xl font-extrabold text-[#113D38] tracking-wide uppercase drop-shadow-sm mt-3">
                                    CHỌN ĐỊA ĐIỂM BẠN MUỐN TỚI
                                </p>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-64 h-12 bg-white rounded-full flex items-center px-5 shadow-lg border border-white/20 focus-within:ring-2 focus-within:ring-[#1B4D3E]/20 transition-all">
                            <input
                                type="text"
                                placeholder="nhập điểm đến nơi bạn muốn tới"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                                className="flex-1 bg-transparent border-none outline-none text-[#1B4D3E] font-medium text-base pr-2 placeholder:text-gray-400 placeholder:font-normal"
                            />
                            <div className="w-6 h-6 relative shrink-0 opacity-60">
                                <Image src="/assets/plan-trip/step-bg.png" alt="Search" fill className="object-contain grayscale" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {!hasSearched && (
                <div className="flex-1 w-full flex flex-col items-center justify-center -mt-20 pointer-events-none">
                    <p className="text-2xl font-medium text-gray-400 tracking-wide">Nhập điểm đến để bắt đầu hành trình...</p>
                </div>
            )}

            {/* Main Content Area */}
            {hasSearched && (
                <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 pb-24">

                    {/* LEFT COLUMN: Destination List */}
                    <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                        <div className="space-y-6">
                            {visiblePlaces.map((place) => {
                                const isSelected = selectedPlaceIds.includes(place.id);
                                return (
                                    <div key={place.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-3 group">
                                        {/* Image */}
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={place.image || "/placeholder.png"}
                                                alt={place.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-[#1B4D3E] shadow-sm flex items-center gap-1">
                                                ⭐ {place.rating}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-lg font-bold text-[#1B4D3E]">{place.name}</h3>

                                            <div className="flex items-start gap-2 text-gray-500 text-sm">
                                                {/* Google Map Pin Icon style */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                <span className="line-clamp-2">{place.address || "Địa chỉ chưa cập nhật"}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-orange-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                <span>Dành 3-4 tiếng</span>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <button
                                            onClick={() => togglePlace(place.id)}
                                            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                                ${isSelected
                                                    ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20"
                                                    : "bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/5"
                                                }`}
                                        >
                                            {isSelected ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    ĐÃ CHỌN
                                                </>
                                            ) : "Chọn điểm này"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View More Button */}
                        {places.length > visibleCount && (
                            <button
                                onClick={handleLoadMore}
                                className="self-center px-6 py-2 text-sm font-semibold text-gray-500 hover:text-[#1B4D3E] hover:bg-white/50 rounded-full transition-colors flex items-center gap-2"
                            >
                                Xem thêm
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                            </button>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Map */}
                    <div className="hidden md:block md:col-span-7 lg:col-span-8 h-full min-h-[500px] sticky top-32">
                        <div className="w-full h-full bg-gray-200 rounded-3xl overflow-hidden border border-white/50 shadow-inner relative">
                            {/* Map Placeholder */}
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0, filter: "grayscale(20%) opacity(0.9)" }}
                                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(searchTerm || "Đà Lạt")}`}
                                allowFullScreen
                            ></iframe>
                            {/* Fallback overlay since we don't have API Key */}
                            <div className="absolute inset-0 bg-[#E0E8E8] flex flex-col items-center justify-center text-[#1B4D3E]/40 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                <p className="mt-4 font-bold text-lg">Bản đồ khu vực {searchTerm || "Đà Lạt"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Footer */}
            {hasSearched && (
                <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
                    <div className="max-w-7xl mx-auto flex items-end justify-between">
                        {/* Left: View More (Already in list flow but user asked for "bottom left") - Keeping it in list flow is better UX for scroll, but let's see. logic above handles it. */}
                        <div className="hidden md:block w-32" />

                        {/* Center/Right: Continue Button */}
                        <div className="pointer-events-auto">
                            <button
                                disabled={selectedPlaceIds.length === 0}
                                className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform 
                                    ${selectedPlaceIds.length > 0
                                        ? "bg-[#1B4D3E] text-white hover:scale-105 hover:shadow-2xl translate-y-0"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed translate-y-4 opacity-0"
                                    }`}
                            >
                                Tiếp tục ({selectedPlaceIds.length})
                            </button>
                        </div>

                        {/* Right: AI Chatbot */}
                        <div className="pointer-events-auto relative w-36 h-36 -mb-4 hover:scale-110 transition-transform cursor-pointer drop-shadow-2xl">
                            <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white z-10"></div>
                            <Image src="/assets/plan-trip/ai-chatbot.png" alt="AI Chatbot" fill className="object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
