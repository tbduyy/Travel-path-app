"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";
import dynamic from "next/dynamic";
import clsx from "clsx";
import SearchWidget from "@/components/ui/SearchWidget";

// Dynamically import MapComponent
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center">
      <p className="text-[#1B4D3E]/40 font-bold">Đang tải bản đồ...</p>
    </div>
  ),
});

function PlanTripContent() {
  const [step, setStep] = useState(1);
  const [places, setPlaces] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [viewedPlace, setViewedPlace] = useState<any>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default Da Lat logic if no results
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    11.9404, 108.4583,
  ]);

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) {
      performSearch(dest);
    }
  }, [searchParams]);

  // Update map center when places change
  useEffect(() => {
    if (places.length > 0) {
      // Find first place with valid coordinates to use as city center proxy
      const validPlace = places.find((p) => p.lat && p.lng);
      if (validPlace) {
        setMapCenter([validPlace.lat, validPlace.lng]);
      }
    }
  }, [places]);

  const performSearch = async (term: string) => {
    setHasSearched(true);
    setSearchTerm(term);
    const result = await searchPlaces({
      destination: term,
      type: "ATTRACTION",
    });
    if (result.success && result.data) {
      setPlaces(result.data);
      setTripId(result.tripId);
      setStep(1);
      setVisibleCount(5); // Show top 5 highlighted places
      setViewedPlace(null);
    }
  };

  const fetchHotels = async () => {
    const result = await searchPlaces({
      destination: searchTerm,
      type: "HOTEL",
    });
    if (result.success && result.data) {
      const selectedPlaceNames = places
        .filter((p) => selectedPlaceIds.includes(p.id))
        .map((p) => p.name);

      const filteredHotels = result.data.filter((hotel: any) => {
        const relatedTo = hotel.metadata?.relatedTo as string[] | undefined;
        if (!relatedTo) return false;
        return relatedTo.some((name) => selectedPlaceNames.includes(name));
      });

      setHotels(filteredHotels);
      setStep(2);
      setVisibleCount(5);
      if (filteredHotels.length > 0) {
        setViewedPlace(filteredHotels[0]);
      } else {
        setViewedPlace(null);
      }
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchTerm || "Đà Lạt");
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      fetchHotels();
    } else {
      if (tripId) {
        router.push(`/trip/${tripId}`);
      } else {
        alert("Tính năng chi tiết đang phát triển!");
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setHotels([]);
      if (places.length > 0) setViewedPlace(places[0]);
    } else if (step === 1) {
      window.location.href = "/";
    }
  };

  const togglePlaceSelection = (place: any) => {
    const isSelected = selectedPlaceIds.includes(place.id);
    if (isSelected) {
      setSelectedPlaceIds((prev) => prev.filter((id) => id !== place.id));
    } else {
      setSelectedPlaceIds((prev) => [...prev, place.id]);
    }
    setViewedPlace(place);
  };

  const getMapMarkers = () => {
    const markers: any[] = [];
    places
      .filter((p) => selectedPlaceIds.includes(p.id))
      .forEach((p) => {
        markers.push({ ...p, isViewed: p.id === viewedPlace?.id });
      });
    if (viewedPlace && !markers.some((m) => m.id === viewedPlace.id)) {
      markers.push({ ...viewedPlace, isViewed: true });
    }
    return markers;
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const displayPlaces = step === 1 ? places : hotels;
  const visiblePlaces = displayPlaces.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col relative font-sans text-[#1B4D3E] bg-[#BBD9D9]">
      <div className="sticky top-0 z-50 mb-8">
        <Header />
      </div>

      {/* Search Widget & Badges */}
      <div className="w-[85vw] mx-auto md:mt-0 flex flex-col gap-8">
        <SearchWidget />
        {/* Floating Badges/Partnerships */}
      </div>

      {/* <div className="relative w-full max-w-7xl mx-auto mt-2 h-24 shrink-0 transition-all duration-500 ease-in-out">
        <Image
          src="/assets/plan-trip/rectangle-7.png"
          alt="Background"
          fill
          className="object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-black/10 rounded-2xl">
          <div className="flex justify-between items-center w-full">
            <div
              className="cursor-pointer hover:scale-110 transition-transform group"
              onClick={handleBack}
            >
              <Image
                src="/assets/plan-trip/arrow-long.png"
                alt="Back"
                width={64}
                height={38}
                className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex-1 h-12 flex flex-col items-center justify-center px-4">
              {hasSearched && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 text-center">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#113D38] uppercase drop-shadow-md mb-1 line-clamp-1">
                    {step === 1
                      ? `Các địa điểm nổi bật tại ${searchTerm || "Đà Lạt"}`
                      : `Các nơi lưu trú tại ${searchTerm || "Đà Lạt"}`}
                  </h1>
                  <p className="text-[#2E968C] text-lg font-medium tracking-wide drop-shadow-sm">
                    {step === 1
                      ? "Chọn ít nhất 1 nơi bạn muốn đến"
                      : "Chọn option bạn thấy tối ưu nhất"}
                  </p>
                </div>
              )}
            </div>
            <div className="relative w-64 h-12 bg-white rounded-full flex items-center px-5 shadow-lg border border-white/20 focus-within:ring-2 focus-within:ring-[#1B4D3E]/20 transition-all">
              <input
                type="text"
                placeholder="Nhập tên thành phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="flex-1 bg-transparent border-none outline-none text-[#1B4D3E] font-medium text-base pr-2 placeholder:text-gray-400 placeholder:font-normal"
              />
              <div className="w-6 h-6 relative shrink-0 opacity-60">
                <Image
                  src="/assets/plan-trip/step-bg.png"
                  alt="Search"
                  fill
                  className="object-contain grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {!hasSearched && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700">
          <div className="w-48 h-48 relative mb-6 opacity-40">
            <Image
              src="/assets/plan-trip/ai-chatbot.png"
              alt="Travel"
              fill
              className="object-contain grayscale"
            />
          </div>
          <h2 className="text-4xl font-black text-[#1B4D3E]/30 mb-2 uppercase tracking-tighter">
            Bắt đầu chuyến đi của bạn
          </h2>
          <p className="text-2xl font-medium text-gray-400 tracking-wide">
            Nhập tên thành phố nơi bạn muốn đến...
          </p>
        </div>
      )}

      {hasSearched && (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 items-start">
          {/* List Container */}
          <div
            className={clsx(
              "md:col-span-12 flex flex-col gap-6 transition-all duration-500 ease-in-out",
              viewedPlace ? "lg:col-span-6" : "lg:col-span-12"
            )}
          >
            <div
              className={clsx(
                "w-full transition-all",
                !viewedPlace
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              )}
            >
              {visiblePlaces.map((place, index) => {
                const isSelected =
                  step === 1
                    ? selectedPlaceIds.includes(place.id)
                    : selectedHotelId === place.id;
                const isOptimal = step === 2 && index === 0;

                return (
                  <div
                    key={place.id}
                    className={clsx(
                      "bg-white rounded-[24px] p-4 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 group cursor-pointer relative animate-in fade-in slide-in-from-left duration-500",
                      (step === 1 && viewedPlace?.id === place.id) ||
                        (step === 2 && selectedHotelId === place.id)
                        ? "ring-2 ring-[#1B4D3E] scale-[1.01]"
                        : "",
                      isOptimal ? "ring-2 ring-orange-400" : ""
                    )}
                    onClick={() => {
                      if (step === 1) {
                        setViewedPlace(place);
                      } else {
                        setSelectedHotelId(place.id);
                        setViewedPlace(place);
                      }
                    }}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Optimal Label */}
                    {isOptimal && (
                      <div className="absolute -top-3 -left-3 z-10">
                        <div className="bg-orange-400 text-white text-[10px] font-black px-3 py-1.5 rounded-lg rotate-[-10deg] shadow-lg flex flex-col items-center leading-none">
                          <span>TỐI ƯU</span>
                          <span>NHẤT</span>
                        </div>
                      </div>
                    )}

                    {/* Image Header */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                      <Image
                        src={place.image || "/placeholder.jpg"}
                        alt={place.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {step === 1 && (
                        <>
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-black text-[#1B4D3E] shadow-sm flex items-center gap-1.5">
                            <span>⭐ {place.rating}</span>
                          </div>
                          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="px-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-[#1B4D3E] group-hover:text-[#2E968C] transition-colors">
                          {place.name}{" "}
                          {step === 2 && (
                            <span className="text-yellow-400">
                              {"⭐".repeat(Math.round(place.rating))}
                            </span>
                          )}
                        </h3>
                      </div>

                      {step === 1 ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#2E968C]">
                              {place.price || "Miễn phí"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <span className="bg-[#E8F1F0] text-[#1B4D3E] px-2 py-0.5 rounded-md text-xs font-bold">
                              # Địa điểm tham quan
                            </span>
                            <span className="bg-[#E8F1F0] text-[#1B4D3E] px-2 py-0.5 rounded-md text-xs font-bold">
                              # Ngoài trời
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm italic mt-1">
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
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Dành khoảng {place.duration || "3-4 tiếng"}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-600 space-y-1">
                          {place.metadata?.distance && (
                            <p className="flex items-center gap-1">
                              📍 Khoảng cách đến{" "}
                              {place.metadata?.relatedTo?.[0] ||
                                "địa điểm tham quan"}
                              : <b>{place.metadata.distance}</b>
                            </p>
                          )}
                          <p className="flex items-center gap-1">
                            🛏️ Loại phòng: <b>Villa/phòng lớn cho 4 người</b>
                          </p>
                          {place.metadata?.note && (
                            <p className="text-orange-500 text-xs font-bold italic mt-2">
                              ✨ {place.metadata.note}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {step === 1 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlaceSelection(place);
                        }}
                        className={clsx(
                          "w-full py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 transform active:scale-[0.98]",
                          isSelected
                            ? "bg-[#1B4D3E] text-white shadow-[#1B4D3E]/30 hover:bg-[#153A2F]"
                            : "bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#E8F1F0]"
                        )}
                      >
                        {isSelected ? "ĐÃ CHỌN" : "Chọn điểm này"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="px-4 py-2 rounded-full border border-[#1B4D3E] text-[#1B4D3E] font-bold text-sm bg-white">
                          {place.price || "1.200.000 VND"}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHotelId(place.id);
                          }}
                          className={clsx(
                            "flex-1 py-3 rounded-full font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98]",
                            isSelected
                              ? "bg-[#1B4D3E]"
                              : "bg-[#113D38] hover:bg-[#1B4D3E]"
                          )}
                        >
                          {isSelected ? "Đã đặt chỗ" : "Book chỗ này"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {displayPlaces.length > visibleCount && (
              <button
                onClick={handleLoadMore}
                className="w-full py-4 rounded-2xl bg-white border-2 border-dashed border-[#1B4D3E]/20 text-[#1B4D3E] font-bold hover:bg-white/80 transition-all active:scale-[0.98] text-sm opacity-60 hover:opacity-100"
              >
                Xem thêm các lựa chọn khác
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: Map */}
          {viewedPlace && (
            <div className="hidden lg:block lg:col-span-6 sticky top-28 h-[calc(100vh-160px)] animate-in fade-in slide-in-from-right duration-700">
              <div className="w-full h-full bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative shadow-[#1B4D3E]/10">
                <MapComponent
                  markers={getMapMarkers()}
                  defaultCenter={mapCenter}
                  isStatic={false}
                  showRoutes={step === 2}
                />
                <div className="absolute inset-0 pointer-events-none border-t border-t-white/40 border-l border-l-white/40 rounded-[24px]"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer - Only show if has searched */}
      {hasSearched && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div className="hidden md:block w-32" />
            <div className="pointer-events-auto">
              <button
                onClick={handleContinue}
                disabled={selectedPlaceIds.length === 0}
                className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform 
                                    ${
                                      selectedPlaceIds.length > 0
                                        ? "bg-[#1B4D3E] text-white hover:scale-105 hover:shadow-2xl translate-y-0"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed translate-y-4 opacity-0"
                                    }`}
              >
                Tiếp tục ({selectedPlaceIds.length})
              </button>
            </div>
            <div
              className="pointer-events-auto relative w-36 h-36 -mb-4 hover:scale-110 transition-transform cursor-pointer drop-shadow-2xl"
              onClick={() =>
                alert(
                  "Chào bạn! Tôi là trợ lý AI của TravelPath. Hãy đặt câu hỏi nếu bạn cần hỗ trợ lên kế hoạch nhé!"
                )
              }
            >
              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white z-10"></div>
              <Image
                src="/assets/plan-trip/ai-chatbot.png"
                alt="AI Chatbot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanTripPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#BBD9D9]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#1B4D3E]/20 rounded-full"></div>
            <p className="text-[#1B4D3E] font-bold">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PlanTripContent />
    </Suspense>
  );
}
