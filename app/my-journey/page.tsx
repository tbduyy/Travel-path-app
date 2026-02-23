"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import ItineraryView from "@/components/ItineraryView";
import { useRouter, useSearchParams } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";
import { extraPlaces, allNhaTrangHotels } from "@/app/data/nhaTrangData";
import {
  useRequireAuth,
  AuthRequiredPopup,
  AuthLoadingScreen,
} from "@/lib/hooks/useRequireAuth";
import { useTripStore, type ActivitiesMap } from "@/lib/store/trip-store";
import ImageSlideshow from "@/components/ui/ImageSlideshow";

// Mock Weather Generator (Reused)
const getWeather = (dateStr: string, destination: string = "") => {
  let hash = 0;
  const combined = dateStr + destination;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  const conditions = [
    { name: "Nắng đẹp", icon: "☀️", baseTemp: 28 },
    { name: "Có mây", icon: "⛅", baseTemp: 26 },
    { name: "Mưa rào", icon: "🌧️", baseTemp: 24 },
    { name: "Trong xanh", icon: "🌤️", baseTemp: 29 },
  ];
  let tempModifier = 0;
  if (destination.includes("Đà Lạt") || destination.includes("Da Lat"))
    tempModifier = -8;
  const index = Math.abs(hash) % conditions.length;
  const weather = conditions[index];
  const tempVar = hash % 3;
  return {
    condition: weather.name,
    icon: weather.icon,
    temp: weather.baseTemp + tempModifier + tempVar,
    low: weather.baseTemp + tempModifier + tempVar - 4,
    high: weather.baseTemp + tempModifier + tempVar + 3,
    date: dateStr,
  };
};

// Empty Trip Popup Component
function EmptyTripPopup({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const [shouldShow, setShouldShow] = useState(false);

  // Logic tối ưu: Không cần "else { setShouldShow(false) }" trong Effect
  useEffect(() => {
    if (!isOpen) return; // Nếu không mở thì không làm gì cả

    const timer = setTimeout(() => setShouldShow(true), 1000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Khi render, check cả 2 biến
  const actuallyShow = isOpen && shouldShow;

  if (!actuallyShow) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
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

        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#2E968C] to-[#1B4D3E] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
          <span className="text-5xl">✈️</span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-black text-[#1B4D3E] mb-3 text-center">
          Bắt đầu lên kế hoạch nào!
        </h3>

        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          Bạn chưa có lịch trình nào. Hãy để{" "}
          <strong className="text-[#2E968C]">Hướng dẫn viên AI</strong> giúp bạn lên
          kế hoạch cho chuyến đi hoàn hảo!
        </p>

        {/* Features */}
        <div className="bg-[#E8F5F3] rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>AI gợi ý địa điểm phù hợp với bạn</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Tự động sắp xếp lịch trình tối ưu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Đề xuất khách sạn & nhà hàng</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Ước tính chi phí chuyến đi</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onNavigate}
            className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#113D38] transition-colors shadow-lg flex items-center justify-center gap-2"
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            Lên lịch trình ngay
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Để sau
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Chỉ mất 5 phút để có lịch trình hoàn hảo! 🚀
        </p>
      </div>
    </div>
  );
}

function MyJourneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Zustand Store ---
  const {
    destination: storeDestination,
    startDate: storeStartDate,
    endDate: storeEndDate,
    activities: storeActivities,
    placesData: storePlacesData,
    hotelData: storeHotelData,
    selectedPlaceIds: storeSelectedPlaceIds,
    selectedHotelId: storeSelectedHotelId,
    setActivities: setStoreActivities,
    setTripInfo,
  } = useTripStore();

  // --- State ---
  const [mainTab, setMainTab] = useState<"my_trips" | "my_plans">("my_trips");
  const [subTab, setSubTab] = useState<string>("upcoming"); // upcoming, past, favorite, reference
  const [showEmptyTripPopup, setShowEmptyTripPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<any>(null);

  // --- Data: Prioritize Store, fallback to URL params ---
  const placeIds =
    storeSelectedPlaceIds.length > 0
      ? storeSelectedPlaceIds
      : searchParams.get("places")?.split(",") || [];
  const hotelId = storeSelectedHotelId || searchParams.get("hotel");
  const destination = storeDestination || searchParams.get("destination");
  const startDateParam = storeStartDate || searchParams.get("startDate");
  const endDateParam = storeEndDate || searchParams.get("endDate");

  // Check if store has any trip data
  const hasStoreActivities =
    Object.keys(storeActivities).length > 0 &&
    Object.values(storeActivities).some((day) =>
      Object.values(day).some((period) => period.length > 0),
    );
  const hasStoreTripData =
    storeDestination || hasStoreActivities || storeSelectedPlaceIds.length > 0;

  // Derived Dates
  const tripDays = React.useMemo(() => {
    if (startDateParam && endDateParam) {
      const start = new Date(startDateParam);
      const end = new Date(endDateParam);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 2;
  }, [startDateParam, endDateParam]);

  const [selectedDay, setSelectedDay] = useState(1);
  const selectedDayDate = React.useMemo(() => {
    if (startDateParam) {
      const start = new Date(startDateParam);
      start.setDate(start.getDate() + (selectedDay - 1));
      return start.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
    return "31/01";
  }, [startDateParam, selectedDay]);

  const currentWeather = React.useMemo(
    () => getWeather(selectedDayDate, destination || ""),
    [selectedDayDate, destination],
  );

  // Places Data
  const [allPlaces, setAllPlaces] = useState<any[]>([]);
  const [activities, setActivities] = useState<
    Record<number, Record<string, any[]>>
  >({});

  // Show popup if store is empty (no trip planned) - only on initial load for 'upcoming' tab
  useEffect(() => {
    if (mainTab === "my_trips" && subTab === "upcoming" && !hasStoreTripData) {
      // Delay popup to let page render first
      const timer = setTimeout(() => {
        setShowEmptyTripPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-close popup once activities are loaded (e.g. DB fetch completed after mount)
  useEffect(() => {
    if (Object.keys(activities).length > 0) {
      setShowEmptyTripPopup(false);
    }
  }, [activities]);

  // Sync store activities to local state when available
  useEffect(() => {
    if (hasStoreActivities) {
      setActivities(storeActivities as Record<number, Record<string, any[]>>);
    }
  }, [storeActivities, hasStoreActivities]);

  // Load User Trips from DB (only if store is empty)
  useEffect(() => {
    const fetchMyTrips = async () => {
      // Skip if store already has activities or local state has activities
      if (hasStoreActivities || Object.keys(activities).length > 0) return;

      try {
        const { getUserTrips } = await import("@/app/actions/trip");
        const result = await getUserTrips(currentPage, 10); // 10 trips per page

        if (result.success && result.data && result.data.length > 0) {
          // Store pagination data for UI controls
          if (result.pagination) {
            setPaginationData(result.pagination);
          }

          const latestTrip: any = result.data[0];
          console.log("MyJourney: Syncing trip to store...", latestTrip.id, "Page:", currentPage);

          // Sync Trip Metadata to Store (Fixes Date/Day Calculation)
          setTripInfo({
            destination: latestTrip.destination,
            startDate: latestTrip.startDate,
            endDate: latestTrip.endDate
          });

          const dbActivities: any = {};
          const tStart = new Date(latestTrip.startDate);
          const tEnd = new Date(latestTrip.endDate);
          const diffDays =
            Math.ceil(
              Math.abs(tEnd.getTime() - tStart.getTime()) /
              (1000 * 60 * 60 * 24),
            ) + 1;

          for (let d = 1; d <= diffDays; d++) {
            dbActivities[d] = { morning: [], afternoon: [], evening: [] };
          }

          latestTrip.items.forEach((item: any) => {
            const day = item.dayIndex + 1;
            let period = "morning";
            const startHour = item.startTime
              ? parseInt(item.startTime.split(":")[0])
              : 9;
            if (startHour >= 12) period = "afternoon";
            if (startHour >= 18) period = "evening";

            if (!dbActivities[day])
              dbActivities[day] = { morning: [], afternoon: [], evening: [] };

            dbActivities[day][period].push({
              id: item.id,
              title: item.title,
              time:
                item.startTime && item.endTime
                  ? `${item.startTime} - ${item.endTime}`
                  : item.transitDuration || "",
              place: {
                ...item.place,
                image: item.place.images?.[0] || item.place.image || "/placeholder.jpg",
                images: item.place.images // Pass detailed images
              },
              period: period,
            });
          });

          setActivities(dbActivities);
          // Sync back to Zustand store so re-mounts don't need to re-fetch from DB
          setStoreActivities(dbActivities);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    if (mainTab === "my_trips" && subTab === "upcoming") {
      fetchMyTrips();
    }
  }, [mainTab, subTab, currentPage]);

  // Modal State
  const [viewedActivity, setViewedActivity] = useState<any>(null);

  // Fetch Places Data (for context)
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await searchPlaces({ destination: destination || "" });
        const hotelResult = await searchPlaces({
          destination: destination || "",
          type: "HOTEL",
        });
        let fetchedPlaces = [
          ...(result.data || []),
          ...(hotelResult.data || []),
        ];

        if (hotelId) {
          const staticHotel = allNhaTrangHotels.find((h) => h.id === hotelId);
          if (staticHotel) fetchedPlaces.push(staticHotel);
        }
        if (destination?.includes("Nha Trang")) {
          fetchedPlaces = [...extraPlaces, ...fetchedPlaces];
          const uniqueMap = new Map();
          fetchedPlaces.forEach((p) => uniqueMap.set(p.id, p));
          fetchedPlaces = Array.from(uniqueMap.values());
        }
        setAllPlaces(fetchedPlaces);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, [destination, hotelId]);

  // Map Markers
  const mapMarkers = React.useMemo(() => {
    const dayActivities = activities[selectedDay] || {};
    const orderedItems: any[] = [];
    ["morning", "afternoon", "evening"].forEach((period) => {
      if (dayActivities[period]) orderedItems.push(...dayActivities[period]);
    });
    return orderedItems
      .filter((item) => item.place)
      .map((item, index) => ({
        id: item.place.id,
        name: item.place.name,
        lat: item.place.lat,
        lng: item.place.lng,
        description: item.place.address,
        order: index + 1,
      }));
  }, [activities, selectedDay]);

  // Handle navigate to plan-trip
  const handleNavigateToPlanTrip = () => {
    setShowEmptyTripPopup(false);
    router.push("/plan-trip");
  };

  // Render Helpers
  const renderSubTabButton = (value: string, label: string) => (
    <button
      onClick={() => setSubTab(value)}
      className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${subTab === value
        ? "bg-[#CFE0E0] border-[#CFE0E0] text-[#1B4D3E]"
        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#F0FDFD]">
      <Header />

      <div className="flex-1 w-full max-w-[1500px] mx-auto p-4 md:p-6 pb-24">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-[#1B4D3E] ml-4">
              HÀNH TRÌNH CỦA TÔI
            </h1>
          </div>

          {/* Main Tabs Toggle */}
          <div className="flex bg-white/50 p-1 rounded-full border border-[#1B4D3E]/10">
            <button
              onClick={() => {
                setMainTab("my_trips");
                setSubTab("upcoming");
              }}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mainTab === "my_trips" ? "bg-[#1B4D3E] text-white shadow-md" : "text-[#1B4D3E] hover:bg-[#1B4D3E]/5"}`}
            >
              Chuyến đi của tôi
            </button>
            <button
              onClick={() => {
                setMainTab("my_plans");
                setSubTab("favorite");
              }}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mainTab === "my_plans" ? "bg-[#1B4D3E] text-white shadow-md" : "text-[#1B4D3E] hover:bg-[#1B4D3E]/5"}`}
            >
              Kế hoạch của tôi
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-3 mb-6">
          {mainTab === "my_trips" ? (
            <>
              {renderSubTabButton("upcoming", "Lịch trình sắp tới")}
              {renderSubTabButton("past", "Lịch trình đã đi")}
            </>
          ) : (
            <>
              {renderSubTabButton("favorite", "Lịch trình yêu thích")}
              {renderSubTabButton("reference", "Tham khảo")}
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {mainTab === "my_trips" && subTab === "upcoming" && paginationData && paginationData.totalPages > 1 && (
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#113D38] transition-colors"
            >
              ← Trước
            </button>
            <span className="text-sm font-medium text-[#1B4D3E]">
              Trang {currentPage} / {paginationData.totalPages} ({paginationData.totalCount} chuyến đi)
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
              disabled={currentPage === paginationData.totalPages}
              className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#113D38] transition-colors"
            >
              Tiếp → 
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white/40 rounded-[40px] border border-[#1B4D3E]/5 min-h-[600px] p-1 relative">
          {/* 1. Upcoming Trips */}
          {mainTab === "my_trips" && subTab === "upcoming" && (
            <div className="min-h-[800px] p-4">
              {Object.keys(activities).length > 0 ? (
                <ItineraryView
                  destination={destination || "Đà Lạt"}
                  selectedDay={selectedDay}
                  tripDays={tripDays}
                  selectedDayDate={selectedDayDate}
                  activities={activities}
                  currentWeather={currentWeather}
                  mapMarkers={mapMarkers}
                  onPreviousDay={() =>
                    selectedDay > 1 && setSelectedDay((d) => d - 1)
                  }
                  onNextDay={() =>
                    selectedDay < tripDays && setSelectedDay((d) => d + 1)
                  }
                  onEditActivity={(activity) => setViewedActivity(activity)}
                  onDeleteActivity={() => { }}
                  onAddActivity={() => { }}
                  onUpdateSchedule={(suggestion) => {
                    console.log("DEBUG: onUpdateSchedule called", suggestion);
                    // Handle Full Itinerary Replacement (Re-plan)
                    if (suggestion.newItinerary) {
                      const newDaySchedule = suggestion.newItinerary;
                      // Convert backend 'DailyActivity' to frontend structure (morning/afternoon/evening)
                      // Simplified classification based on time
                      const morning: any[] = [];
                      const afternoon: any[] = [];
                      const evening: any[] = [];

                      newDaySchedule.activities.forEach((act: any) => {
                        const hour = parseInt(act.time_slot.split(':')[0]);
                        const item = {
                          id: Date.now().toString() + Math.random(),
                          title: act.activity,
                          time: act.time_slot,
                          cost: act.estimated_cost ? `${(act.estimated_cost > 1000 ? act.estimated_cost / 1000 : act.estimated_cost).toLocaleString()}k` : undefined,
                          place: {
                            id: "ai-" + Math.random(),
                            name: act.location_name,
                            address: act.location_name + " (AI Suggestion)"
                          }
                        };

                        if (hour < 12) morning.push({ ...item, period: 'morning' });
                        else if (hour < 18) afternoon.push({ ...item, period: 'afternoon' });
                        else evening.push({ ...item, period: 'evening' });
                      });

                      setActivities(prev => {
                        const newActivities = {
                          ...prev,
                          [selectedDay]: {
                            morning,
                            afternoon,
                            evening
                          }
                        };
                        // Persist
                        if (typeof window !== "undefined") {
                          localStorage.setItem("mytrip_activities", JSON.stringify(newActivities));
                        }
                        setStoreActivities(newActivities);
                        return newActivities;
                      });
                      return;
                    }

                    // Handle Single Place Suggestion (Old logic)
                    if (!suggestion.suggestedPlace) {
                      console.log("DEBUG: Invalid suggestion data");
                      return;
                    }

                    const newPlace = suggestion.suggestedPlace;

                    setActivities(prev => {
                      const currentDayActs = prev[selectedDay] || { morning: [], afternoon: [], evening: [] };

                      let targetPeriod = 'morning';
                      if (currentDayActs.morning.length === 0 && currentDayActs.afternoon.length > 0) {
                        targetPeriod = 'afternoon';
                      } else if (currentDayActs.morning.length > 0) {
                        targetPeriod = 'morning';
                      }

                      const list = [...(currentDayActs[targetPeriod] || [])];
                      console.log("DEBUG: Target period", targetPeriod, "List length:", list.length);

                      if (list.length > 0) {
                        // Replace first item
                        list[0] = {
                          ...list[0],
                          title: newPlace.name,
                          place: {
                            ...list[0].place,
                            id: newPlace.id,
                            name: newPlace.name,
                            address: newPlace.address
                          }
                        };
                      } else {
                        // Add new if empty
                        list.push({
                          id: Date.now().toString(),
                          title: newPlace.name,
                          time: "14:00",
                          period: targetPeriod,
                          place: newPlace
                        });
                      }

                      const newActivities = {
                        ...prev,
                        [selectedDay]: {
                          ...currentDayActs,
                          [targetPeriod]: list
                        }
                      };

                      console.log("DEBUG: New activities state", newActivities);

                      if (typeof window !== "undefined") {
                        localStorage.setItem("mytrip_activities", JSON.stringify(newActivities));
                      }

                      // Also sync to global store
                      setStoreActivities(newActivities);

                      return newActivities;
                    });
                  }}
                  isReadOnly={false}
                />
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    {/* Animated Icon */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2E968C]/20 to-[#1B4D3E]/20 rounded-full animate-pulse"></div>
                      <div
                        className="absolute inset-2 bg-gradient-to-br from-[#2E968C]/30 to-[#1B4D3E]/30 rounded-full animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-5xl">🗺️</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-black text-[#1B4D3E] mb-3">
                      Chưa có lịch trình sắp tới
                    </h2>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                      Bạn chưa lên kế hoạch cho chuyến đi nào. Hãy bắt đầu khám
                      phá và tạo lịch trình đầu tiên của bạn!
                    </p>

                    <button
                      onClick={handleNavigateToPlanTrip}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#1B4D3E] text-white rounded-2xl font-bold text-lg hover:bg-[#113D38] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      Lên lịch trình ngay
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                      Sử dụng AI để tạo lịch trình trong vài phút ✨
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty Trip Popup */}
          <EmptyTripPopup
            isOpen={showEmptyTripPopup}
            onClose={() => setShowEmptyTripPopup(false)}
            onNavigate={handleNavigateToPlanTrip}
          />

          {/* 2. Past Trips */}
          {mainTab === "my_trips" && subTab === "past" && (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
              <div className="text-6xl mb-4">🕰️</div>
              <p className="font-bold">Chưa có lịch trình đã đi</p>
            </div>
          )}

          {/* 3. Favorite Plans */}
          {mainTab === "my_plans" && subTab === "favorite" && (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
              <div className="text-6xl mb-4">❤️</div>
              <p className="font-bold">Chưa có lịch trình yêu thích</p>
            </div>
          )}

          {/* 4. Reference Plans */}
          {mainTab === "my_plans" && subTab === "reference" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative h-48 rounded-xl bg-gray-200 mb-4 overflow-hidden">
                    <Image
                      src={`/placeholder.jpg`}
                      alt="Trip"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#1B4D3E]">
                      4N3Đ
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-[#1B4D3E] mb-1">
                    Khám phá Nha Trang - Hòn Ngọc Biển Đông
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative"></span>
                    <span>bởi TravelLover{i}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1">👁️ 1.2k</span>
                    <span className="flex items-center gap-1">❤️ 342</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETAIL MODAL */}
        {viewedActivity && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setViewedActivity(null)}
          >
            <div
              className="bg-white m-0 max-h-[90vh] rounded-[32px] overflow-y-auto p-6 scrollbar-thin shadow-2xl z-20 w-[90%] md:w-[60%] lg:w-[45%] border border-[#1B4D3E]/5 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewedActivity(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-50 transition-colors"
                aria-label="Close"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="w-full aspect-video rounded-2xl overflow-hidden relative mb-4">
                {(viewedActivity.place?.images?.length || viewedActivity.place?.image) ? (
                  <ImageSlideshow
                    images={viewedActivity.place.images || [viewedActivity.place.image]}
                    alt={viewedActivity.place.name || viewedActivity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">
                    📍
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-black text-[#1B4D3E] mb-2">
                {viewedActivity.place?.name || viewedActivity.title}
              </h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {viewedActivity.place?.description || "Chưa có mô tả chi tiết."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase">Thời gian</p>
                  <p className="text-[#1B4D3E] font-bold">
                    {viewedActivity.time}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase">Địa chỉ</p>
                  <p className="text-[#1B4D3E] font-bold text-sm truncate">
                    {viewedActivity.place?.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Transportation Info if exists */}
              {viewedActivity.place?.metadata?.transportation && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-[#1B4D3E] mb-2 text-sm">🚗 Di chuyển ước tính</h3>
                  <p className="text-sm text-gray-600">
                    Khoảng {viewedActivity.place.metadata.transportation.distance_km} km ({viewedActivity.place.metadata.transportation.duration_minutes} phút)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyJourneyPage() {
  const { isLoading, isAuthenticated, showAuthPopup } = useRequireAuth();

  // Show loading while checking auth
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Show auth popup if not authenticated
  if (!isAuthenticated) {
    return <AuthRequiredPopup show={showAuthPopup} />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyJourneyContent />
    </Suspense>
  );
}
