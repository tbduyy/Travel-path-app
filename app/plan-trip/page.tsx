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
    const router = useRouter();

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setHasSearched(true);
            // Trigger fetch
            // In a real app we would use the searchTerm. 
            // For this demo we just fetch "Đà Lạt" or all.
            const result = await searchPlaces({ destination: searchTerm || "Đà Lạt" });
            if (result.success && result.data) {
                setPlaces(result.data);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative font-sans text-[#1B4D3E] bg-[#BBD9D9]">

            {/* Standard Header (Home Page Style) */}
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            {/* Background Image under top bar */}
            <div className="relative w-full max-w-7xl mx-auto mt-2 h-64">
                <Image src="/assets/plan-trip/rectangle-7.png" alt="Background" fill className="object-cover rounded-2xl shadow-lg" />
                {/* Sub-Header: Arrow Left & Search Right */}
                <div className="absolute inset-0 flex justify-between items-start px-6 py-6 bg-white/50 backdrop-blur-sm rounded-2xl md:bg-transparent md:backdrop-filter-none">
                    {/* Left: Back Arrow */}
                    <div className="cursor-pointer hover:scale-110 transition-transform group" onClick={() => router.push('/')}>
                        <Image src="/assets/plan-trip/arrow-long.png" alt="Back" width={42} height={42} className="object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Center Text */}
                    <div className="hidden md:block flex-1 text-center px-4"><p className="text-xl font-bold text-[#1B4D3E] tracking-wide uppercase drop-shadow-sm">CHỌN ĐỊA ĐIỂM BẠN MUỐN TỚI</p></div>
                    {/* Right: Search Bar */}
                    <div className="relative w-80 h-12 bg-white rounded-full flex items-center px-5 shadow-sm hover:shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-[#1B4D3E]/10 transition-all">
                        <input type="text" placeholder="nhập điểm đến nơi bạn muốn tới" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearch} className="flex-1 bg-transparent border-none outline-none text-[#1B4D3E] font-medium text-base pr-2 placeholder:text-gray-400 placeholder:font-normal" />
                        <div className="w-6 h-6 relative shrink-0 opacity-80"><Image src="/assets/plan-trip/step-bg.png" alt="Search" fill className="object-contain" /></div>
                    </div>
                </div>
            </div>

            {/* Empty State / Prompt */}
            {!hasSearched && (
                <div className="flex-1 w-full flex flex-col items-center justify-center -mt-20 pointer-events-none">
                    <p className="text-2xl font-medium text-gray-400 tracking-wide">Nhập điểm đến để bắt đầu hành trình...</p>
                </div>
            )}

            {/* Main Content - Only shown after search */}
            {hasSearched && (
                <main className="flex-1 w-full p-4 md:p-8 relative z-10 flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center">

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
                            {/* Left Column (Step 1 Card) */}
                            <div className="md:col-span-4 bg-white rounded-3xl shadow-2xl min-h-[500px] relative overflow-hidden group border border-white/40 ring-1 ring-black/5 hover:ring-black/10 transition-shadow">
                                {/* Background Image 16 */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src="/assets/plan-trip/step-bg.png"
                                        alt="Step Background"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                </div>

                                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                                    <div className="space-y-2">
                                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
                                            <p className="text-white text-sm font-semibold tracking-wider uppercase">Bước 1</p>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-sm">
                                            Chọn <br />
                                            <span className="text-[#D8F3DC]">Điểm Đến</span> <br />
                                            Của Bạn
                                        </h2>
                                    </div>

                                    {/* Arrow 1 */}
                                    <div className="self-end cursor-pointer hover:translate-x-3 transition-transform pt-10">
                                        <Image
                                            src="/assets/plan-trip/arrow-long.png"
                                            alt="Next Step"
                                            width={80}
                                            height={30}
                                            className="object-contain invert brightness-0 hover:brightness-100 drop-shadow-lg opacity-90 hover:opacity-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column area - Destination List */}
                            <div className="md:col-span-8 h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {places.map((place) => (
                                        <div key={place.id} className="bg-white rounded-2xl p-3 shadow-md hover:scale-[1.02] transition-transform cursor-pointer group border border-gray-100">
                                            <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                                                <Image
                                                    src={place.image || "/placeholder.png"}
                                                    alt={place.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>⭐</span> {place.rating}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-[#1B4D3E] truncate">{place.name}</h3>
                                            <p className="text-xs text-gray-600 line-clamp-2 mt-1 min-h-[2.5em]">{place.description}</p>
                                        </div>
                                    ))}
                                    {places.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center text-gray-400 h-full">
                                            <p>Chưa tìm thấy địa điểm nào với tên "{searchTerm}".</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}
