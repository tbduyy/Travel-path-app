"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Map Component
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center">
            <p className="text-[#1B4D3E]/40 font-bold">Đang tải bản đồ...</p>
        </div>
    ),
});

function PlacesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]); // For checkbox/selection
    const [viewedPlace, setViewedPlace] = useState<any>(null); // For Detail View
    const [destinationName, setDestinationName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const destinationParam = searchParams.get("destination");

    useEffect(() => {
        const dest = destinationParam || "";
        setDestinationName(dest);
        performSearch(dest);

        // Load pre-selected
        const existingPlaces = searchParams.get("places");
        if (existingPlaces) {
            setSelectedPlaceIds(existingPlaces.split(","));
        }
    }, [destinationParam]);

    const performSearch = async (term: string) => {
        setLoading(true);
        try {
            const result = await searchPlaces({
                destination: term,
                // type: "ATTRACTION", // Removed to show all types (Restaurants included)
            });
            if (result.success && result.data) {
                setPlaces(result.data);
                // If we have results, maybe select the first one as viewed? 
                // User request: "when you choose 1..." implys click to view. 
                // Image shows list + map. Let's stick to Grid -> 3 Col logic.
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectPlace = (e: React.MouseEvent, place: any) => {
        e.stopPropagation();
        const placeId = place.id;
        if (selectedPlaceIds.includes(placeId)) {
            setSelectedPlaceIds((prev) => prev.filter((id) => id !== placeId));
        } else {
            setSelectedPlaceIds((prev) => [...prev, placeId]);
            setViewedPlace(place); // Auto-open detail and center map on selection
        }
    };

    const handleCardClick = (place: any) => {
        setViewedPlace(place);
    };

    const handleContinue = () => {
        if (selectedPlaceIds.length === 0) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("places", selectedPlaceIds.join(","));
        router.push(`/plan-trip/hotels?${params.toString()}`);
    };

    const handleBack = () => {
        // If in view mode, maybe go back to grid? 
        if (viewedPlace) {
            setViewedPlace(null);
        } else {
            router.push('/');
        }
    }

    // Derived
    const getMapMarkers = () => {
        if (!places.length) return [];
        const markers = places.map(p => ({
            ...p,
            isViewed: p.id === viewedPlace?.id
        }));
        return markers;
    }

    const mapCenter: [number, number] = viewedPlace
        ? [viewedPlace.lat, viewedPlace.lng]
        : places.length > 0
            ? [places[0].lat, places[0].lng]
            : [11.9404, 108.4583]; // Da Lat Default

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#E8F1F0] overflow-hidden">
            <div className="sticky top-0 z-50 bg-[#E8F1F0]/90 backdrop-blur-md border-b border-[#1B4D3E]/5">
                <Header />
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col h-[calc(100vh-80px)]">
                {/* Top Bar */}
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div className="flex items-start gap-4">
                        <button onClick={handleBack} className="mt-1 p-2 hover:bg-[#1B4D3E]/10 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1B4D3E] uppercase flex items-center gap-2">
                                Các địa điểm nổi bật tại {destinationName || "Đà Lạt"}
                            </h1>
                            <p className="text-[#2E968C] font-medium text-sm md:text-base italic">
                                Chọn ít nhất 1 nơi mà bạn muốn đến
                            </p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-4 pr-10 py-2.5 rounded-full border border-[#1B4D3E]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-[#1B4D3E] placeholder:text-[#1B4D3E]/40"
                            defaultValue={destinationName}
                        />
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1B4D3E]/60" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-hidden relative flex gap-4 p-4">

                    {/* LEFT COLUMN: List */}
                    <motion.div
                        layout
                        className={clsx(
                            "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#1B4D3E]/20 hover:scrollbar-thumb-[#1B4D3E]/40 z-10 rounded-[32px] border border-[#1B4D3E]/5 shadow-sm transition-all duration-500",
                            viewedPlace ? "w-1/4 min-w-[300px] bg-[#F5F9F9] p-4" : "w-full lg:w-[60%] bg-[#E8F1F0] p-6"
                        )}
                    >
                        <div className={clsx(
                            "grid gap-4 transition-all",
                            viewedPlace ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        )}>
                            {places.map((place) => {
                                const isSelected = selectedPlaceIds.includes(place.id);
                                const isViewed = viewedPlace?.id === place.id;

                                if (viewedPlace) {
                                    // COMPACT HORIZONTAL CARD (For Side List)
                                    return (
                                        <motion.div
                                            layout
                                            key={place.id}
                                            onClick={() => handleCardClick(place)}
                                            className={clsx(
                                                "bg-white rounded-2xl p-3 shadow-sm border transition-all cursor-pointer flex gap-3 group items-center",
                                                isViewed ? "border-[#1B4D3E] ring-1 ring-[#1B4D3E] bg-[#E0F2F1] shadow-md" : "border-transparent hover:border-[#1B4D3E]/20"
                                            )}
                                        >
                                            <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                                                <Image src={place.image || "/placeholder.jpg"} alt={place.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#1B4D3E] text-sm truncate group-hover:text-[#2E968C]">{place.name}</h3>
                                                <button
                                                    onClick={(e) => toggleSelectPlace(e, place)}
                                                    className={clsx(
                                                        "text-xs px-3 py-1.5 rounded-full font-bold transition-all mt-1 block",
                                                        isSelected
                                                            ? "bg-[#1B4D3E] text-white"
                                                            : "bg-gray-100 text-gray-600 hover:bg-[#1B4D3E]/10"
                                                    )}
                                                >
                                                    {isSelected ? "Đã chọn" : "Chọn"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                }

                                // STANDARD GRID CARD
                                return (
                                    <motion.div
                                        layout
                                        key={place.id}
                                        onClick={() => handleCardClick(place)}
                                        className={clsx(
                                            "bg-white rounded-[24px] p-3 shadow-sm border border-transparent hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-3 relative",
                                            isViewed ? "ring-2 ring-[#1B4D3E] bg-[#F2F9F8]" : "hover:scale-[1.01] duration-300"
                                        )}
                                    >
                                        {/* Image */}
                                        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                                            <Image src={place.image || "/placeholder.jpg"} alt={place.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm text-[#1B4D3E]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            </div>
                                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur rounded-lg px-2 py-1 text-white text-xs font-bold">
                                                {place.rating} ⭐
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-1 flex flex-col gap-1">
                                            <h3 className="font-bold text-[#1B4D3E] text-lg leading-tight group-hover:text-[#2E968C] transition-colors">{place.name}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(place.metadata?.tags || ["#ThamQuan"]).slice(0, 2).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] uppercase font-bold text-[#1B4D3E]/60 bg-[#1B4D3E]/5 px-2 py-1 rounded-md">{tag.replace("#", "")}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => toggleSelectPlace(e, place)}
                                            className={clsx(
                                                "w-full py-3 rounded-xl font-bold text-sm transition-all text-center mt-auto flex items-center justify-center gap-2",
                                                isSelected
                                                    ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20"
                                                    : "bg-gray-50 text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white"
                                            )}
                                        >
                                            {isSelected ? (
                                                <><span>✓</span> Đã chọn</>
                                            ) : "Chọn điểm này"}
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* CENTER COLUMN: Detail View */}
                    <AnimatePresence mode="popLayout">
                        {viewedPlace && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white m-0 h-full rounded-[32px] overflow-y-auto p-6 scrollbar-thin shadow-2xl z-20 w-[40%] min-w-[380px] hidden md:block border border-[#1B4D3E]/5 relative"
                            >
                                <button
                                    onClick={() => setViewedPlace(null)}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>

                                <div className="flex flex-col gap-6">
                                    <div className="relative w-full aspect-video rounded-[24px] overflow-hidden shadow-lg group">
                                        <Image src={viewedPlace.image || "/placeholder.jpg"} alt={viewedPlace.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                    </div>

                                    <div>
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-3xl font-black text-[#1B4D3E] mb-2 leading-tight">{viewedPlace.name}</h2>
                                            <div className="bg-[#1B4D3E]/10 p-2 rounded-full text-[#1B4D3E]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 font-medium">
                                            <span className="flex text-yellow-500 text-base">{"⭐".repeat(Math.round(viewedPlace.rating))}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{viewedPlace.rating} (100+ đánh giá)</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-base font-light">
                                            {viewedPlace.description || "Một địa điểm tuyệt vời để khám phá tại Đà Lạt. Tận hưởng không khí trong lành và cảnh quan thiên nhiên đẹp mắt."}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-[#1B4D3E] bg-[#F2F9F8] p-4 rounded-[20px]">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">📍</div>
                                            <div>
                                                <p className="text-xs text-[#1B4D3E]/60 font-bold uppercase tracking-wider">Địa chỉ</p>
                                                <p className="text-sm font-semibold">{viewedPlace.address || "Đà Lạt, Lâm Đồng"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#1B4D3E] bg-[#F2F9F8] p-4 rounded-[20px]">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">⏰</div>
                                            <div>
                                                <p className="text-xs text-[#1B4D3E]/60 font-bold uppercase tracking-wider">Thời gian</p>
                                                <p className="text-sm font-semibold">{viewedPlace.duration || "2-3 tiếng"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#1B4D3E] bg-[#F2F9F8] p-4 rounded-[20px]">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">💵</div>
                                            <div>
                                                <p className="text-xs text-[#1B4D3E]/60 font-bold uppercase tracking-wider">Giá vé</p>
                                                <p className="text-sm font-semibold">{viewedPlace.price || "Miễn phí"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8">
                                        <button
                                            onClick={(e) => toggleSelectPlace(e, viewedPlace)}
                                            className={clsx(
                                                "w-full py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3",
                                                selectedPlaceIds.includes(viewedPlace.id)
                                                    ? "bg-[#1B4D3E] text-white"
                                                    : "bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white"
                                            )}
                                        >
                                            {selectedPlaceIds.includes(viewedPlace.id)
                                                ? <><span className="text-xl">✓</span> <span>Đã thêm vào lịch trình</span></>
                                                : <span>Thêm vào lịch trình</span>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RIGHT COLUMN: Map */}
                    <motion.div
                        layout
                        className={clsx(
                            "h-full relative overflow-hidden transition-all duration-500 z-0 rounded-[32px] border border-[#1B4D3E]/10 shadow-sm flex-1 hidden lg:block"
                        )}
                    >
                        <div className="w-full h-full bg-gray-200">
                            <MapComponent
                                markers={getMapMarkers()}
                                defaultCenter={mapCenter}
                                showRoutes={false}
                                isStatic={false}
                            />
                        </div>
                        {/* Map Overlay Title */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-md text-xs font-bold text-[#1B4D3E] border border-[#1B4D3E]/10 z-10">
                            BẢN ĐỒ
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Footer / Floating Button */}
            <div className={clsx(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500",
                selectedPlaceIds.length > 0 ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            )}>
                <button
                    onClick={handleContinue}
                    className="bg-[#113D38] text-white px-12 py-3.5 rounded-full font-bold text-lg shadow-2xl hover:bg-[#1B4D3E] hover:scale-105 transition-all flex items-center gap-3 border-2 border-[#2E968C]/50"
                >
                    <span>Tiếp tục ({selectedPlaceIds.length})</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>

            {/* Chatbot Bubble */}
            <div className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform cursor-pointer">
                <div className="w-16 h-16 relative">
                    <Image src="/assets/plan-trip/ai-chatbot.png" alt="AI" fill className="object-contain drop-shadow-xl" />
                </div>
            </div>

        </div>
    );
}

export default function PlacesPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <PlacesContent />
        </Suspense>
    );
}
