"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import TripStepper from "@/components/ui/TripStepper";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/lib/store/trip-store";

// Map Component
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center">
      <p className="text-[#1B4D3E]/40 font-bold">Đang tải bản đồ...</p>
    </div>
  ),
});

function HotelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand Store
  const {
    selectedHotelId,
    setHotel,
    selectedPlaceIds: storePlaceIds,
    destination: storeDestination,
    budget: storeBudget,
    style: storeStyle,
    people: storePeople,
    setStep,
    completeStep,
  } = useTripStore();

  // Track current step on mount
  useEffect(() => {
    setStep("hotels");
  }, [setStep]);

  // State
  const [hotels, setHotels] = useState<any[]>([]);
  const [relatedPlaces, setRelatedPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewedHotel, setViewedHotel] = useState<any>(null); // For Detail View
  const [destinationName, setDestinationName] = useState("");

  // URL params for backward compatibility only
  const destinationParam = searchParams.get("destination");
  const placesParam = searchParams.get("places");
  const budgetParam = searchParams.get("budget");
  const styleParam = searchParams.get("style");
  const peopleParam = searchParams.get("people");

  // Use store as primary, URL as fallback
  const effectiveDestination = storeDestination || destinationParam || "";
  const effectiveBudget = storeBudget || budgetParam || "";
  const effectiveStyle = storeStyle || styleParam || "";
  const effectivePeople = storePeople || parseInt(peopleParam || "2");

  useEffect(() => {
    setDestinationName(effectiveDestination);
    if (effectiveDestination) {
      fetchHotels(effectiveDestination);
    }

    // Check for pre-selected hotel from URL (backward compatibility)
    const existingHotel = searchParams.get("hotel");
    if (existingHotel && !selectedHotelId) {
      setHotel(existingHotel);
    }
  }, [effectiveDestination, effectiveBudget]); // Re-fetch if destination or budget changes

  const fetchHotels = async (term: string) => {
    setLoading(true);
    try {
      // Use store places as primary
      const placesToUse =
        storePlaceIds.length > 0 ? storePlaceIds.join(",") : placesParam || "";
      const result = await searchPlaces({
        destination: term,
        type: "HOTEL",
        places: placesToUse,
        budget: effectiveBudget,
        style: effectiveStyle,
        people: String(effectivePeople),
      } as any);
      if (result.success && result.data) {
        setHotels(result.data);
        if ((result as any).relatedPlaces) {
          setRelatedPlaces((result as any).relatedPlaces);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Haversine Distance Helper
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleSelectHotel = (e: React.MouseEvent, hotel: any) => {
    e.stopPropagation();
    // If clicking "Book", we select it. If it was already selected, maybe deselect?
    // Usually hotels are single selection for a trip leg.
    if (selectedHotelId === hotel.id) {
      setHotel(null);
    } else {
      setHotel(hotel.id, hotel);
      setViewedHotel(hotel); // Also view it
    }
  };

  const handleCardClick = (hotel: any) => {
    setViewedHotel(hotel);
  };

  const handleContinue = () => {
    if (!selectedHotelId) return;
    completeStep("hotels"); // Mark hotels step as complete
    // Navigate using Zustand store - minimal URL params for backward compatibility
    router.push(`/plan-trip/trips`);
  };

  const handleBack = () => {
    if (viewedHotel) {
      setViewedHotel(null);
    } else {
      router.back();
    }
  };

  // Derived Map Markers
  const getMapMarkers = () => {
    if (!hotels.length) return [];
    return hotels.map((h) => ({
      ...h,
      isViewed: h.id === viewedHotel?.id,
    }));
  };

  const mapCenter: [number, number] = viewedHotel
    ? [viewedHotel.lat, viewedHotel.lng]
    : hotels.length > 0
      ? [hotels[0].lat, hotels[0].lng]
      : [11.9404, 108.4583];

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#E8F1F0] overflow-hidden">
      <div className="sticky top-0 z-50 bg-[#E8F1F0]/90 backdrop-blur-md border-b border-[#1B4D3E]/5">
        <Header />
        <TripStepper />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-[calc(100vh-140px)]">
        {/* Top Bar */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4">
            <button
              onClick={handleBack}
              className="mt-1 p-2 hover:bg-[#1B4D3E]/10 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#1B4D3E] uppercase flex items-center gap-2">
                Các nơi lưu trú tại {destinationName || "Đà Lạt"}
              </h1>
              <p className="text-[#2E968C] font-medium text-sm md:text-base italic">
                Chọn option bạn thấy tối ưu nhất
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm khách sạn..."
              className="w-full pl-4 pr-10 py-2.5 rounded-full border border-[#1B4D3E]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-[#1B4D3E] placeholder:text-[#1B4D3E]/40"
              defaultValue={destinationName}
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1B4D3E]/60"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden relative flex gap-4 p-4">
          {/* LEFT COLUMN: List */}
          <motion.div
            layout
            className={clsx(
              "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#1B4D3E]/20 hover:scrollbar-thumb-[#1B4D3E]/40 z-10 rounded-[32px] border border-[#1B4D3E]/5 shadow-sm transition-all duration-500",
              viewedHotel
                ? "w-1/4 min-w-[300px] bg-[#F5F9F9] p-4"
                : "w-full lg:w-[60%] bg-[#E8F1F0] p-6",
            )}
          >
            <div
              className={clsx(
                "grid gap-4 transition-all",
                viewedHotel
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {hotels.map((hotel, index) => {
                const isSelected = selectedHotelId === hotel.id;
                const isViewed = viewedHotel?.id === hotel.id;
                const matchedPlace = relatedPlaces.find(
                  (p) => p.id === hotel.relatedPlaceId,
                );

                if (viewedHotel) {
                  // COMPACT SIDE CARD
                  return (
                    <motion.div
                      layout
                      key={hotel.id}
                      onClick={() => handleCardClick(hotel)}
                      className={clsx(
                        "bg-white rounded-2xl p-3 shadow-sm border transition-all cursor-pointer flex gap-3 group items-center",
                        isViewed
                          ? "border-[#1B4D3E] ring-1 ring-[#1B4D3E] bg-[#E0F2F1] shadow-md"
                          : "border-transparent hover:border-[#1B4D3E]/20",
                      )}
                    >
                      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                        <Image
                          src={hotel.image || "/placeholder.jpg"}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1B4D3E] text-sm truncate group-hover:text-[#2E968C]">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-[#1B4D3E]/60 font-bold">
                          {hotel.price || "Liên hệ"}
                        </p>
                        <button
                          onClick={(e) => handleSelectHotel(e, hotel)}
                          className={clsx(
                            "text-xs px-3 py-1.5 rounded-full font-bold transition-all mt-1 block",
                            isSelected
                              ? "bg-[#1B4D3E] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-[#1B4D3E]/10",
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
                    key={hotel.id}
                    onClick={() => handleCardClick(hotel)}
                    className={clsx(
                      "bg-white rounded-[24px] p-4 shadow-sm border border-transparent hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-3 relative",
                      isViewed
                        ? "ring-2 ring-[#1B4D3E] bg-[#F2F9F8]"
                        : "hover:scale-[1.01] duration-300",
                    )}
                  >
                    {/* OPTIMAL BADGE (Index 0) */}
                    {index === 0 && (
                      <>
                        <div className="absolute -top-3 -left-3 z-30 drop-shadow-md">
                          <div className="relative w-14 h-14 flex items-center justify-center">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-full h-full text-yellow-400"
                            >
                              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                            </svg>
                            <span className="absolute text-white font-black text-xl translate-y-0.5">
                              1
                            </span>
                          </div>
                        </div>
                        <div className="absolute -top-4 left-10 z-20 bg-[#FF5A5F] text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-sm tracking-wider transform rotate-2">
                          TỐI ƯU NHẤT
                        </div>
                      </>
                    )}

                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                      <Image
                        src={hotel.image || "/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-[#1B4D3E]"></div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur rounded-lg px-2 py-1 text-white text-xs font-bold">
                        {hotel.rating || 4.5} ⭐
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-1 flex flex-col gap-1">
                      <h3 className="font-bold text-[#1B4D3E] text-lg leading-tight group-hover:text-[#2E968C] transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {hotel.address}
                      </p>

                      {/* Metadata Details (Distance & Notes) */}
                      {hotel.metadata && (
                        <div className="mt-2 flex flex-col gap-2">
                          {(hotel.metadata.distance || hotel.metadata.time) && (
                            <div className="flex items-center gap-2 text-xs text-[#1B4D3E]/80 font-medium bg-[#1B4D3E]/5 p-1.5 rounded-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span className="text-[#1B4D3E] font-bold">
                                Khoảng cách đến{" "}
                                {matchedPlace?.name || "điểm đến"}:{" "}
                                {hotel.metadata.distance}
                              </span>
                            </div>
                          )}
                          {hotel.metadata.note && (
                            <div className="flex items-start gap-2 text-[11px] text-orange-700 bg-orange-50 p-2 rounded-lg border border-orange-100/50">
                              <svg
                                className="shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" x2="12" y1="8" y2="12" />
                                <line x1="12" x2="12.01" y1="16" y2="16" />
                              </svg>
                              <span className="font-medium leading-tight italic">
                                "{hotel.metadata.note}"
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Bar: Price Left, Button Right */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Giá từ
                        </span>
                        <span className="text-lg font-black text-[#1B4D3E]">
                          {hotel.price || "Liên hệ"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleSelectHotel(e, hotel)}
                        className={clsx(
                          "px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg",
                          isSelected
                            ? "bg-[#1B4D3E] text-white shadow-[#1B4D3E]/20"
                            : "bg-[#2E968C] text-white hover:bg-[#1B4D3E]",
                        )}
                      >
                        {isSelected ? "✓ Đã chọn" : "Chọn chỗ này"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CENTER COLUMN: Detail View */}
          <AnimatePresence mode="popLayout">
            {viewedHotel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white m-0 h-full rounded-[32px] overflow-y-auto p-6 scrollbar-thin shadow-2xl z-20 w-[40%] min-w-[380px] hidden md:block border border-[#1B4D3E]/5 relative"
              >
                <button
                  onClick={() => setViewedHotel(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>

                <div className="flex flex-col gap-6">
                  <div className="relative w-full aspect-video rounded-[24px] overflow-hidden shadow-lg group">
                    <Image
                      src={viewedHotel.image || "/placeholder.jpg"}
                      alt={viewedHotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-[#1B4D3E] mb-2 leading-tight">
                      {viewedHotel.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 font-medium">
                      <span className="flex text-yellow-500 text-base">
                        {"⭐".repeat(Math.round(viewedHotel.rating || 5))}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{viewedHotel.rating || 4.5} (50+ đánh giá)</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-base font-light">
                      {viewedHotel.description ||
                        "Khách sạn đầy đủ tiện nghi với view đẹp, gần trung tâm và thuận tiện di chuyển. Đội ngũ nhân viên chuyên nghiệp, tận tình."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* DYNAMIC DISTANCE MATRIX */}
                    <div className="bg-[#F2F9F8] p-4 rounded-[24px]">
                      <h4 className="text-xs font-bold text-[#1B4D3E]/60 uppercase mb-3 tracking-wider flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Khoảng cách đến các điểm
                      </h4>
                      <div className="space-y-2">
                        {relatedPlaces.map((place) => {
                          const dist = getDistance(
                            viewedHotel.lat,
                            viewedHotel.lng,
                            place.lat,
                            place.lng,
                          );
                          return (
                            <div
                              key={place.id}
                              className="flex items-center justify-between text-sm border-b border-[#1B4D3E]/10 pb-2 last:border-0 last:pb-0"
                            >
                              <div className="flex items-center gap-2 font-medium text-[#1B4D3E]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2E968C]"></div>
                                {place.name}
                              </div>
                              <span className="font-bold text-[#1B4D3E]">
                                {dist} km
                              </span>
                            </div>
                          );
                        })}
                        {relatedPlaces.length === 0 && (
                          <p className="text-xs italic text-gray-500">
                            Chưa có địa điểm nào được chọn.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Warning Note */}
                    {viewedHotel.metadata?.note && (
                      <div className="flex items-start gap-3 text-orange-700 bg-orange-50 p-4 rounded-[20px] border border-orange-100">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                          ⚠️
                        </div>
                        <div>
                          <p className="text-xs text-orange-700/60 font-bold uppercase tracking-wider">
                            Lưu ý quan trọng
                          </p>
                          <p className="text-sm font-medium italic mt-0.5">
                            "{viewedHotel.metadata.note}"
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[#1B4D3E] bg-[#F2F9F8] p-4 rounded-[20px]">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                        💵
                      </div>
                      <div>
                        <p className="text-xs text-[#1B4D3E]/60 font-bold uppercase tracking-wider">
                          Giá phòng
                        </p>
                        <p className="text-sm font-semibold">
                          {viewedHotel.price || "Liên hệ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <button
                      onClick={(e) => handleSelectHotel(e, viewedHotel)}
                      className={clsx(
                        "w-full py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3",
                        selectedHotelId === viewedHotel.id
                          ? "bg-[#1B4D3E] text-white"
                          : "bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white",
                      )}
                    >
                      {selectedHotelId === viewedHotel.id ? (
                        <>
                          <span className="text-xl">✓</span>{" "}
                          <span>Đã chọn khách sạn này</span>
                        </>
                      ) : (
                        <span>Chọn chỗ này</span>
                      )}
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
              "h-full relative overflow-hidden transition-all duration-500 z-0 rounded-[32px] border border-[#1B4D3E]/10 shadow-sm flex-1 hidden lg:block",
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-md text-xs font-bold text-[#1B4D3E] border border-[#1B4D3E]/10 z-10">
              BẢN ĐỒ LƯU TRÚ
            </div>
          </motion.div>
        </div>

        {/* Footer Continue Button (Floating) */}
        <div
          className={clsx(
            "fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500",
            selectedHotelId
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0",
          )}
        >
          <button
            onClick={handleContinue}
            className="bg-[#113D38] text-white px-12 py-3.5 rounded-full font-bold text-lg shadow-2xl hover:bg-[#1B4D3E] hover:scale-105 transition-all flex items-center gap-3 border-2 border-[#2E968C]/50"
          >
            <span>Tiếp tục (1)</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  );
}
