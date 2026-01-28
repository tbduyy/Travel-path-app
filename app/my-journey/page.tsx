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

function MyJourneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State ---
  const [mainTab, setMainTab] = useState<"my_trips" | "my_plans">("my_trips");
  const [subTab, setSubTab] = useState<string>("upcoming"); // upcoming, past, favorite, reference

  // --- Data Loading ---
  const placeIds = searchParams.get("places")?.split(",") || [];
  const hotelId = searchParams.get("hotel");
  const destination = searchParams.get("destination");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

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

  // Load User Trips from DB
  useEffect(() => {
    const fetchMyTrips = async () => {
      if (Object.keys(activities).length > 0) return;

      try {
        const { getUserTrips } = await import("@/app/actions/trip");
        const result = await getUserTrips();

        if (result.success && result.data && result.data.length > 0) {
          const latestTrip = result.data[0];

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
              place: item.place,
              period: period,
            });
          });

          setActivities(dbActivities);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    if (mainTab === "my_trips" && subTab === "upcoming") {
      fetchMyTrips();
    }
  }, [mainTab, subTab]);

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

  // Render Helpers
  const renderSubTabButton = (value: string, label: string) => (
    <button
      onClick={() => setSubTab(value)}
      className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
        subTab === value
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

        {/* Content Area */}
        <div className="bg-white/40 rounded-[40px] border border-[#1B4D3E]/5 min-h-[600px] p-1 relative">
          {/* 1. Upcoming Trips */}
          {mainTab === "my_trips" && subTab === "upcoming" && (
            <div className="h-[800px] p-4">
              {" "}
              {/* Fixed height for scroll area */}
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
                onEditActivity={() => {}}
                onDeleteActivity={() => {}}
                onAddActivity={() => {}}
                isReadOnly={false}
              />
            </div>
          )}

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
