"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripStepper from "@/components/ui/TripStepper";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchPlaces, getPlaceById } from "@/app/actions/search";
import dynamic from "next/dynamic";
import { extraPlaces, allNhaTrangHotels } from "@/app/data/nhaTrangData";
import AddActivityModal from "@/components/AddActivityModal";
import ActivityCard from "@/components/ActivityCard";
import TripMetaBar from "@/components/TripMetaBar";
import {
  useTripStore,
  type ActivitiesMap,
  type PlaceData,
} from "@/lib/store/trip-store";
import { API_BASE_URL } from "@/lib/api-config";
import { exportAndDownloadTripPDF } from "@/lib/export-pdf";
import { useAuthStatus, LoginPromptModal } from "@/lib/hooks/useRequireAuth";

// Dynamically import MapComponent
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center rounded-3xl">
      <p className="text-[#1B4D3E]/40 font-bold">Đang tải bản đồ...</p>
    </div>
  ),
});

// Mock Weather Generator
const getWeather = (dateStr: string, destination: string = "") => {
  // Simple hash to make weather deterministic for a date
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

  // Adjust base temp for Da Lat
  let tempModifier = 0;
  if (destination.includes("Đà Lạt") || destination.includes("Da Lat")) {
    tempModifier = -8; // Cooler
  }

  const index = Math.abs(hash) % conditions.length;
  const weather = conditions[index];

  // Variance
  const tempVar = hash % 3;
  const isToday =
    dateStr ===
    new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });

  return {
    condition: weather.name,
    icon: weather.icon,
    temp: weather.baseTemp + tempModifier + tempVar,
    low: weather.baseTemp + tempModifier + tempVar - 4,
    high: weather.baseTemp + tempModifier + tempVar + 3,
    date: dateStr,
  };
};

function TripsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand Store
  const {
    setStep: setFlowStep,
    completeStep,
    setActivities: setStoreActivities,
    activities: storeActivities,
    destination: storeDestination,
    startDate: storeStartDate,
    endDate: storeEndDate,
    selectedPlaceIds: storePlaceIds,
    selectedHotelId: storeHotelId,
    budget: storeBudget,
    people: storePeople,
  } = useTripStore();

  // Track current step on mount
  useEffect(() => {
    setFlowStep("trips");
  }, [setFlowStep]);

  // Use Zustand store as primary source, URL params as fallback for backward compatibility
  const placeIds =
    storePlaceIds.length > 0
      ? storePlaceIds
      : searchParams.get("places")?.split(",") || [];
  const hotelId = storeHotelId || searchParams.get("hotel");
  const destination = storeDestination || searchParams.get("destination");
  const startDateParam = storeStartDate || searchParams.get("startDate");
  const endDateParam = storeEndDate || searchParams.get("endDate");
  const people = storePeople || parseInt(searchParams.get("people") || "2");
  const budgetParam = storeBudget || searchParams.get("budget");

  // Derived Data
  let dateRangeStr = "31/01/2026";
  let durationString = "2N1Đ";

  if (startDateParam) {
    const start = new Date(startDateParam);
    dateRangeStr = start.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    if (endDateParam) {
      const end = new Date(endDateParam);
      dateRangeStr += ` - ${end.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}`;

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        durationString = `${diffDays + 1}N${diffDays}Đ`;
      }
    }
  }

  const formattedBudget = budgetParam
    ? new Intl.NumberFormat("vi-VN").format(parseInt(budgetParam))
    : destination?.includes("Nha Trang")
      ? "2.500.000"
      : "8.000.000";

  // Calculate trip days from date range
  const tripDays = React.useMemo(() => {
    if (startDateParam && endDateParam) {
      const start = new Date(startDateParam);
      const end = new Date(endDateParam);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end day
    }
    return 2; // Default 2 days
  }, [startDateParam, endDateParam]);

  // State
  const [allPlaces, setAllPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedPlace, setViewedPlace] = useState<any>(null);
  const [viewStep, setViewStep] = useState(1); // 1 = List, 2 = Schedule
  const [selectedDay, setSelectedDay] = useState(1); // Current day being edited (1-indexed)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "morning" | "afternoon" | "evening"
  >("morning");
  const [editingActivity, setEditingActivity] = useState<any>(null); // New state for editing
  const [viewingActivityDetails, setViewingActivityDetails] =
    useState<any>(null); // State for viewing activity details
  const [isGenerating, setIsGenerating] = useState(false); // AI generation loading state
  const [isAiSuggestion, setIsAiSuggestion] = useState(false); // Track if current activities are AI-generated (not yet confirmed)
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null); // Budget analysis from AI

  // Activity form state
  const [activityName, setActivityName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activityCost, setActivityCost] = useState("");

  // Activities organized by day and period - initialize from store
  const [activities, setActivities] = useState<
    Record<number, Record<string, any[]>>
  >(() => {
    // Use store activities if available
    if (Object.keys(storeActivities).length > 0) {
      return storeActivities;
    }
    return {};
  });

  // Sync activities to store when they change - ONLY if user has confirmed (not AI suggestion)
  useEffect(() => {
    // Only sync to store if:
    // 1. There are activities
    // 2. It's NOT an AI suggestion waiting for confirmation
    if (Object.keys(activities).length > 0 && !isAiSuggestion) {
      setStoreActivities(activities as ActivitiesMap);
    }
  }, [activities, isAiSuggestion, setStoreActivities]);

  // Handler to confirm AI suggestion and sync to store
  const handleConfirmAiItinerary = () => {
    setIsAiSuggestion(false); // Mark as confirmed
    setStoreActivities(activities as ActivitiesMap); // Sync to store now
  };

  // Auth status for PDF export gate
  const { isAuthenticated } = useAuthStatus();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // PDF Export handler - requires authentication
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const handleExportPDF = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsExportingPDF(true);
    try {
      await exportAndDownloadTripPDF({
        destination: destination || "Chuyến đi",
        startDate: startDateParam,
        endDate: endDateParam,
        duration: durationString,
        budget: formattedBudget,
        people: people,
        activities: activities as ActivitiesMap,
        hotelData: selectedHotel,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Có lỗi khi xuất PDF. Vui lòng thử lại.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleLoginRedirect = () => {
    // Save current URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  // Calculate date for selected day
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

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch ALL places for the destination
        const result = await searchPlaces({ destination: destination || "" });
        // Also fetch hotels
        const hotelResult = await searchPlaces({
          destination: destination || "",
          type: "HOTEL",
        });

        let fetchedPlaces = [
          ...(result.data || []),
          ...(hotelResult.data || []),
        ];

        // If specific hotel is selected, ensure it's loaded using multiple fallbacks
        if (hotelId) {
          const existing = fetchedPlaces.find((p) => p.id === hotelId);
          if (!existing) {
            // 1. Try Client-Side Static Data (Fastest & Most Reliable for Nha Trang)
            const staticHotel = allNhaTrangHotels.find((h) => h.id === hotelId);
            if (staticHotel) {
              fetchedPlaces.push(staticHotel);
            } else {
              // 2. Try Server-Side Lookup (For DB/Dynamic places)
              const specificHotel = await getPlaceById(hotelId);
              if (specificHotel.success && specificHotel.data) {
                fetchedPlaces.push(specificHotel.data);
              }
            }
          }
        }

        // Use Extra Places from local data if Nha Trang
        if (destination?.includes("Nha Trang")) {
          // Combine them
          fetchedPlaces = [...extraPlaces, ...fetchedPlaces];

          // Deduplicate by ID
          const uniqueMap = new Map();
          fetchedPlaces.forEach((p) => uniqueMap.set(p.id, p));
          fetchedPlaces = Array.from(uniqueMap.values());
        }

        setAllPlaces(fetchedPlaces);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [destination, hotelId]);

  const handleBack = () => {
    if (viewStep === 2) {
      setViewStep(1);
    } else {
      router.back();
    }
  };

  const handlePreviousDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDay < tripDays) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const handleAddActivity = (activityData: {
    title: string;
    time: string;
    cost?: string;
    period: "morning" | "afternoon" | "evening";
    place?: {
      id: string;
      name: string;
      image: string | null;
      address: string | null;
    };
    startTime?: string;
    endTime?: string;
  }) => {
    if (editingActivity) {
      // Update existing activity
      setActivities((prev) => {
        const dayActivities = prev[selectedDay] || {};

        // If period changed, remove from old period and add to new
        if (editingActivity.period !== activityData.period) {
          const oldPeriodActivities = (
            dayActivities[editingActivity.period] || []
          ).filter((a) => a.id !== editingActivity.id);
          const newPeriodActivities = [
            ...(dayActivities[activityData.period] || []),
            { ...editingActivity, ...activityData },
          ];

          return {
            ...prev,
            [selectedDay]: {
              ...dayActivities,
              [editingActivity.period]: oldPeriodActivities,
              [activityData.period]: newPeriodActivities,
            },
          };
        } else {
          // Same period, just update
          const periodActivities = (
            dayActivities[activityData.period] || []
          ).map((a) =>
            a.id === editingActivity.id ? { ...a, ...activityData } : a,
          );

          return {
            ...prev,
            [selectedDay]: {
              ...dayActivities,
              [activityData.period]: periodActivities,
            },
          };
        }
      });
      setEditingActivity(null);
    } else {
      // Add new activity
      const newActivity = {
        id: Date.now().toString(),
        type: "ACTIVITY",
        ...activityData,
      };

      setActivities((prev) => {
        const dayActivities = prev[selectedDay] || {};
        const periodActivities = dayActivities[activityData.period] || [];

        return {
          ...prev,
          [selectedDay]: {
            ...dayActivities,
            [activityData.period]: [...periodActivities, newActivity],
          },
        };
      });
    }

    setShowAddActivityModal(false);
  };

  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setShowAddActivityModal(true);
  };

  const handleViewActivityDetails = (activity: any) => {
    setViewingActivityDetails(activity);
  };

  // Handler to generate AI itinerary
  const generateAiItinerary = async () => {
    setIsGenerating(true);
    try {
      const selectedPlacesData = selectedPlaces.map((p) => ({
        name: p.name,
        address: p.address || destination || "",
      }));

      const requestBody = {
        hotel_location: {
          name: selectedHotel?.name || "Khách sạn trung tâm",
          address: selectedHotel?.address || destination || "",
        },
        mandatory_spots: selectedPlacesData,
        wishlist_spots: [],
        budget: budgetParam
          ? parseFloat(budgetParam.replace(/[^0-9]/g, ""))
          : 5000000,
        num_people:
          typeof people === "number" ? people : parseInt(people || "2"),
        travel_style: "cultural",
        start_date: startDateParam || new Date().toISOString().split("T")[0],
        end_date:
          endDateParam ||
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        start_time: "08:00",
        end_time: "21:00",
        destination: destination || "",
      };

      console.log("AI Itinerary Request:", requestBody);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/planning/itinerary/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) throw new Error("Failed to generate itinerary");

      const aiData = await response.json();
      console.log("AI Itinerary Response:", aiData);

      // Convert AI response to activities format
      const newActivities: Record<number, Record<string, any[]>> = {};

      aiData.schedule?.forEach((daySchedule: any, dayIdx: number) => {
        const dayNum = dayIdx + 1;
        newActivities[dayNum] = { morning: [], afternoon: [], evening: [] };

        daySchedule.activities?.forEach((act: any) => {
          const hour = parseInt(act.time_slot?.split(":")[0] || "12");
          let period: "morning" | "afternoon" | "evening" = "morning";
          if (hour >= 17) period = "evening";
          else if (hour >= 12) period = "afternoon";

          newActivities[dayNum][period].push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: "ACTIVITY",
            title: act.activity || act.location_name,
            time: act.time_slot,
            cost: act.estimated_cost
              ? `${act.estimated_cost.toLocaleString()} VND`
              : undefined,
            period,
            place: {
              id: act.location_name,
              name: act.location_name,
              image: act.image || null,
              address: destination || null,
            },
            // Add transportation info
            transportation: act.transportation || null,
            distance_km: act.distance_km || 0,
            duration_minutes: act.duration_minutes || 0,
            description: act.description || null, // Add description from AI
            notes: act.notes || null,
          });
        });
      });

      setActivities(newActivities);
      setIsAiSuggestion(true); // Mark as AI suggestion - waiting for user confirmation

      // Store budget analysis for display
      if (aiData.budget_analysis) {
        setBudgetAnalysis(aiData.budget_analysis);
      }
    } catch (error) {
      console.error("Error generating AI itinerary:", error);
      alert(
        "Có lỗi khi tạo lịch trình AI. Bạn có thể thêm hoạt động thủ công!",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler to reject AI suggestion and regenerate
  const handleRejectAiItinerary = async () => {
    setActivities({});
    setBudgetAnalysis(null);
    setIsAiSuggestion(false);
    // Regenerate itinerary
    await generateAiItinerary();
  };

  const handleNext = async () => {
    if (viewStep === 1) {
      setViewStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Call AI to generate itinerary
      await generateAiItinerary();
    } else {
      // User confirmed - ensure isAiSuggestion is false before proceeding
      if (isAiSuggestion) {
        setIsAiSuggestion(false);
      }

      completeStep("trips"); // Mark trips step as complete

      // Save current activities to localStorage to persist them to My Journey
      if (typeof window !== "undefined") {
        localStorage.setItem("mytrip_activities", JSON.stringify(activities));
      }

      // Also sync to Zustand store
      setStoreActivities(activities as ActivitiesMap);

      // Navigate using Zustand store - no URL params needed
      router.push(`/plan-trip/demo`);
    }
  };

  const handleAddPlace = (place: any) => {
    const newPlaceIds = [...placeIds, place.id];
    // Dedupe
    const uniqueIds = Array.from(new Set(newPlaceIds));

    const params = new URLSearchParams(searchParams.toString());
    params.set("places", uniqueIds.join(","));

    // Update URL
    router.replace(`?${params.toString()}`, { scroll: false });

    // Close modal
    setViewedPlace(null);
  };

  // Weather Data Calculation
  const currentWeather = React.useMemo(() => {
    return getWeather(selectedDayDate, destination || "");
  }, [selectedDayDate, destination]);

  const forecastDays = React.useMemo(() => {
    const days = [];
    if (startDateParam) {
      const start = new Date(startDateParam);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        // Get Day Name (T2, T3...)
        const dayName = d
          .toLocaleDateString("vi-VN", { weekday: "short" })
          .replace("Th ", "T")
          .replace("CN", "CN");

        days.push({
          ...getWeather(dateStr, destination || ""),
          dayName,
          fullDate: d,
        });
      }
    }
    return days;
  }, [startDateParam, destination]);

  // Derived Lists
  const selectedPlaces = allPlaces.filter((p) => placeIds.includes(p.id));

  // Robust Hotel Selection: Check allPlaces first, then fall back to static data import
  let selectedHotel: PlaceData | null = null;
  if (hotelId) {
    selectedHotel = allPlaces.find((p) => p.id === hotelId) || null;
    if (!selectedHotel) {
      // Fallback for Nha Trang
      selectedHotel = allNhaTrangHotels.find((h) => h.id === hotelId) || null;
    }
  }

  const allSelectedLocations = selectedHotel
    ? [...selectedPlaces, selectedHotel]
    : selectedPlaces; // Combined for activity modal

  // Directions for Suggestions: Only from extraPlaces
  const extraPlaceIds = extraPlaces.map((e) => e.id);
  // Hotels are not in extraPlaces, so we just filter them by type
  const availableHotels = allPlaces.filter(
    (p) => !placeIds.includes(p.id) && p.type === "HOTEL",
  );

  const availablePlaces = allPlaces.filter((p) => !placeIds.includes(p.id));

  // Suggestions are filtered to be ONLY items that exist in extraPlaces (as requested)
  // AND are strictly of the correct Type
  const availableAttractions = availablePlaces.filter(
    (p) => p.type === "ATTRACTION" && extraPlaceIds.includes(p.id),
  );
  const availableRestaurants = availablePlaces.filter(
    (p) => p.type === "RESTAURANT" && extraPlaceIds.includes(p.id),
  );

  // Debug: If destination is Nha Trang but availableAttractions is empty, it might be due to IDs
  // But this logic ensures `selectedPlaces` draws from ALL, while `suggestions` draws from Extra.

  // Map Markers logic
  const mapMarkers = React.useMemo(() => {
    if (viewStep === 2) {
      // Detailed Itinerary Mode: Sequential ordered markers
      const dayActivities = activities[selectedDay] || {};
      const orderedItems: any[] = [];

      // Flatten morning -> afternoon -> evening
      ["morning", "afternoon", "evening"].forEach((period) => {
        if (dayActivities[period]) {
          orderedItems.push(...dayActivities[period]);
        }
      });

      // Filter items that have a place
      const validItems = orderedItems.filter((item) => item.place);

      // Add Hotel as starting point (Optional, but good for context) - making it index 0 or treating activities as 1..N
      // User requested "added locations numbered 1, 2, 3".
      // Let's stick to the activities themselves.

      return validItems.map((item, index) => ({
        id: item.place.id,
        name: item.place.name,
        lat: item.place.lat, // Assuming place object has lat/lng, checking below
        lng: item.place.lng,
        description: item.place.address,
        order: index + 1, // 1-based numbering
      }));
    } else {
      // Step 1: Browse Mode (Red id selected, Green is available)
      return [
        ...selectedPlaces.map((p) => ({ ...p, isViewed: true })), // Selected -> Show as Viewed (Red)
        ...availablePlaces.map((p) => ({ ...p, isViewed: false })), // Available -> Show as Standard (Green)
      ].map((p) => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        description: p.address,
        isViewed: p.isViewed || viewedPlace?.id === p.id, // Also highlight if viewed
      }));
    }
  }, [
    viewStep,
    selectedDay,
    activities,
    selectedPlaces,
    availablePlaces,
    viewedPlace,
  ]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] overflow-hidden">
      {/* Login Prompt Modal for PDF Export */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginRedirect}
        feature="xuất lịch trình PDF"
      />

      <div className="sticky top-0 z-50 mb-0 md:mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
        <Header />
        <TripStepper />
      </div>

      <div className="flex-1 w-full max-w-[1500px] mx-auto p-4 md:p-6 pb-24 md:pb-6 h-[calc(100vh-140px)] flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col mb-4 gap-6 shrink-0">
          {/* 1. Meta Info Row */}
          <TripMetaBar
            destination={destination || "Đà Lạt"}
            duration={durationString}
            placeCount={selectedPlaces.length}
            budget={formattedBudget}
          />

          {/* 2. Main Title Row + Actions */}
          <div className="flex items-center justify-between">
            {/* Title Badge */}
            <div className="bg-[#3C6E64] text-white px-8 py-3 rounded-2xl shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide">
                LỊCH TRÌNH {destination || "ĐÀ LẠT"}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Share Button (Outline) */}
              <button className="p-3 rounded-xl border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/5 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
              </button>

              {/* Save Button (Solid) - Export PDF */}
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="flex items-center gap-2 px-6 py-3 bg-[#113D38] text-white rounded-full font-bold hover:bg-[#0D2F2B] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExportingPDF ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
                {isExportingPDF ? "Đang xuất..." : "Xuất PDF"}
              </button>
            </div>
          </div>

          {/* 3. Navigation Tabs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewStep(1)}
              className={`px-8 py-2.5 rounded-full font-bold text-lg transition-all border-2 ${
                viewStep === 1
                  ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-md"
                  : "bg-transparent border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/5"
              }`}
            >
              Danh sách du lịch
            </button>
            <button
              onClick={() => setViewStep(2)}
              className={`px-8 py-2.5 rounded-full font-bold text-lg transition-all border-2 hidden ${
                viewStep === 2
                  ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-md"
                  : "bg-transparent border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E]/5"
              }`}
            >
              Lịch trình cụ thể
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-h-0 relative">
          {/* Step 1: Travel List (Split View: List vs Map) */}
          {viewStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left: Scrollable List (50%) */}
              <div className="h-full flex flex-col">
                <div className="bg-[#F0F5F5] p-6 rounded-[32px] border border-[#1B4D3E]/5 shadow-sm h-full flex flex-col overflow-hidden relative">
                  <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-[#1B4D3E]/20 hover:scrollbar-thumb-[#1B4D3E]/40 space-y-8 pb-10">
                    {/* 1. Available Attractions */}
                    {availableAttractions.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#F0F5F5] z-10 py-2">
                          <span className="text-red-500 text-xl">📍</span>
                          <h3 className="text-xl font-black text-[#1B4D3E] tracking-tight">
                            Địa điểm tham quan ({availableAttractions.length})
                          </h3>
                        </div>

                        <div className="flex flex-col gap-4">
                          {availableAttractions.map((place) => (
                            <div
                              key={place.id}
                              onClick={() => setViewedPlace(place)}
                              className="bg-white rounded-[24px] p-3 shadow-sm border border-transparent hover:shadow-xl transition-all cursor-pointer group flex gap-4 hover:scale-[1.01] duration-300"
                            >
                              {/* Image Left */}
                              <div className="relative w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={place.image || "/placeholder.jpg"}
                                  alt={place.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              </div>

                              {/* Content Right */}
                              <div className="flex-1 flex flex-col justify-start py-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <h3 className="font-bold text-[#1B4D3E] text-lg leading-tight line-clamp-2">
                                    {place.name}
                                  </h3>
                                  <button className="text-[#1B4D3E] hover:bg-[#1B4D3E]/10 p-1 rounded-full transition-colors flex-shrink-0">
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
                                      <circle cx="12" cy="12" r="10" />
                                      <line x1="12" y1="8" x2="12" y2="16" />
                                      <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                  </button>
                                </div>

                                <p className="text-xs text-gray-500 font-medium mt-1 mb-1 truncate">
                                  {place.type === "ATTRACTION"
                                    ? "Điểm tham quan"
                                    : "Nhà hàng"}{" "}
                                  - Thời lượng: {place.duration || "1 - 2 giờ"}
                                </p>

                                {/* Google Rating Mock */}
                                <div className="flex items-center gap-1 mb-3">
                                  <div className="w-4 h-4 relative">
                                    <Image
                                      src="/google-icon.png"
                                      alt="G"
                                      fill
                                    />
                                  </div>
                                  <div className="flex text-yellow-400 text-sm">
                                    {"★".repeat(Math.round(place.rating))}
                                  </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-col gap-2 mt-auto">
                                  <div className="inline-flex items-center gap-2 bg-[#CFE0E0] px-3 py-1.5 rounded-full w-fit">
                                    <svg
                                      className="w-3.5 h-3.5 text-[#5A7A7A]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span className="text-[10px] font-bold text-[#3C5757]">
                                      Cách Khách sạn:{" "}
                                      {place.metadata?.distance ||
                                        (Math.random() * 5 + 1).toFixed(1) +
                                          " km"}
                                    </span>
                                  </div>
                                  <div className="inline-flex items-center gap-2 bg-[#CFE0E0] px-3 py-1.5 rounded-full w-fit">
                                    <svg
                                      className="w-3.5 h-3.5 text-[#5A7A7A]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-[10px] font-bold text-[#3C5757] truncate max-w-[150px]">
                                      {place.price || "Miễn phí"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button className="w-fit px-6 py-2.5 rounded-full bg-[#113D38] text-white text-sm font-bold hover:bg-[#0D2F2B] transition-colors flex items-center gap-2 mt-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Thêm điểm tham quan
                        </button>
                      </div>
                    )}

                    {/* 2. Available Restaurants */}
                    {availableRestaurants.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2 sticky top-0 bg-[#F0F5F5] z-10 py-2">
                          <span className="text-xl">🍽️</span>
                          <div className="flex items-baseline justify-between w-full">
                            <h3 className="text-xl font-black text-[#1B4D3E] tracking-tight">
                              Địa điểm ăn uống ({availableRestaurants.length})
                            </h3>
                            <div className="flex text-xs font-bold gap-3 text-gray-400">
                              <span className="text-[#2E968C] flex items-center gap-1 cursor-pointer">
                                ◉ Hot
                              </span>
                              <span className="cursor-pointer hover:text-[#1B4D3E]">
                                ○ Local
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          {availableRestaurants.map((place) => (
                            <div
                              key={place.id}
                              onClick={() => setViewedPlace(place)}
                              className="bg-white rounded-[24px] p-3 shadow-sm border border-transparent hover:shadow-xl transition-all cursor-pointer group flex gap-4 hover:scale-[1.01] duration-300"
                            >
                              {/* Image Left */}
                              <div className="relative w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={place.image || "/placeholder.jpg"}
                                  alt={place.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              </div>

                              {/* Content Right */}
                              <div className="flex-1 flex flex-col justify-start py-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <h3 className="font-bold text-[#1B4D3E] text-lg leading-tight line-clamp-2">
                                    {place.name}
                                  </h3>
                                  <button className="text-[#1B4D3E] hover:bg-[#1B4D3E]/10 p-1 rounded-full transition-colors flex-shrink-0">
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
                                      <circle cx="12" cy="12" r="10" />
                                      <line x1="12" y1="8" x2="12" y2="16" />
                                      <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                  </button>
                                </div>

                                <p className="text-xs text-gray-500 font-medium mt-1 mb-1 truncate">
                                  Nhà hàng - Thời lượng:{" "}
                                  {place.duration || "1 - 2 giờ"}
                                </p>

                                {/* Google Rating Mock */}
                                <div className="flex items-center gap-1 mb-3">
                                  <div className="w-4 h-4 relative">
                                    <Image
                                      src="/google-icon.png"
                                      alt="G"
                                      fill
                                    />
                                  </div>
                                  <div className="flex text-yellow-400 text-sm">
                                    {"★".repeat(Math.round(place.rating))}
                                  </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-col gap-2 mt-auto">
                                  <div className="inline-flex items-center gap-2 bg-[#CFE0E0] px-3 py-1.5 rounded-full w-fit">
                                    <svg
                                      className="w-3.5 h-3.5 text-[#5A7A7A]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span className="text-[10px] font-bold text-[#3C5757]">
                                      Cách Khách sạn:{" "}
                                      {place.metadata?.distance ||
                                        (Math.random() * 5 + 1).toFixed(1) +
                                          " km"}
                                    </span>
                                  </div>
                                  <div className="inline-flex items-center gap-2 bg-[#CFE0E0] px-3 py-1.5 rounded-full w-fit">
                                    <svg
                                      className="w-3.5 h-3.5 text-[#5A7A7A]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-[10px] font-bold text-[#3C5757] truncate max-w-[150px]">
                                      {place.price || "Miễn phí"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-fit px-6 py-2.5 rounded-full bg-[#113D38] text-white text-sm font-bold hover:bg-[#0D2F2B] transition-colors flex items-center gap-2 mt-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Thêm quán ăn
                        </button>
                      </div>
                    )}

                    {availableAttractions.length === 0 &&
                      availableRestaurants.length === 0 && (
                        <div className="text-center py-10 text-gray-500 italic">
                          Tất cả địa điểm đã được thêm vào lịch trình!
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Right: Map (50%) */}
              <div className="hidden lg:block h-full rounded-[32px] overflow-hidden shadow-lg border border-[#1B4D3E]/10 relative z-0">
                <MapComponent markers={mapMarkers} />
              </div>
            </div>
          )}

          {/* Step 2: Schedule Editor */}
          {viewStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 h-full">
              {/* Left: Schedule Editor */}
              <div className="flex flex-col gap-4 h-full">
                {/* Day Picker */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#1B4D3E]/10">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePreviousDay}
                      disabled={selectedDay === 1}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 font-medium">
                        Ngày {selectedDay} | {destination || "Đà Lạt"}
                      </span>
                      <span className="text-lg font-black text-[#1B4D3E]">
                        {selectedDayDate}
                      </span>
                    </div>
                    <button
                      onClick={handleNextDay}
                      disabled={selectedDay === tripDays}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* AI Loading Indicator */}
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm">
                    <div className="w-16 h-16 border-4 border-[#1B4D3E]/20 border-t-[#1B4D3E] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#1B4D3E] font-bold text-lg">
                      AI đang tạo lịch trình...
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Vui lòng chờ trong giây lát
                    </p>
                  </div>
                )}

                {/* AI Suggestion Confirmation Banner */}
                {isAiSuggestion &&
                  !isGenerating &&
                  Object.keys(activities).length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                          <h3 className="font-bold text-[#1B4D3E]">
                            AI đã tạo lịch trình cho bạn!
                          </h3>
                          <p className="text-sm text-gray-600">
                            Xem qua lịch trình bên dưới và xác nhận nếu bạn hài
                            lòng.
                          </p>
                        </div>
                      </div>

                      {/* Budget Analysis */}
                      {budgetAnalysis && (
                        <div
                          className={`mb-3 p-4 rounded-xl ${budgetAnalysis.is_within_budget ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                        >
                          {/* Header - Note about number of people */}
                          <div className="mb-3 pb-2 border-b border-gray-300">
                            <p className="text-xs font-bold text-gray-700 flex items-center gap-2">
                              👥 Chi phí dưới đây đã tính cho{" "}
                              <span className="text-[#1B4D3E] text-sm">
                                {people} người
                              </span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Ngân sách:</p>
                              <p className="font-bold text-[#1B4D3E]">
                                {budgetAnalysis.total_budget?.toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tổng chi phí:</p>
                              <p
                                className={`font-bold ${budgetAnalysis.is_within_budget ? "text-green-600" : "text-red-600"}`}
                              >
                                {budgetAnalysis.total_estimated_cost?.toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Chi phí hoạt động:
                              </p>
                              <p className="font-semibold">
                                {budgetAnalysis.total_activities_cost?.toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Chi phí di chuyển:
                              </p>
                              <p className="font-semibold">
                                {budgetAnalysis.total_transportation_cost?.toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            {budgetAnalysis.is_within_budget ? (
                              <p className="text-green-700 font-semibold flex items-center gap-2">
                                ✅ Còn thừa{" "}
                                {budgetAnalysis.budget_difference?.toLocaleString()}{" "}
                                VND (
                                {(
                                  100 - budgetAnalysis.budget_percentage_used
                                ).toFixed(1)}
                                %)
                              </p>
                            ) : (
                              <p className="text-red-700 font-semibold flex items-center gap-2">
                                ⚠️ Vượt{" "}
                                {Math.abs(
                                  budgetAnalysis.budget_difference,
                                )?.toLocaleString()}{" "}
                                VND (
                                {(
                                  budgetAnalysis.budget_percentage_used - 100
                                ).toFixed(1)}
                                %)
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleConfirmAiItinerary}
                          className="flex-1 py-2.5 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#113D38] transition-colors flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Đồng ý lịch trình này
                        </button>
                        <button
                          onClick={handleRejectAiItinerary}
                          className="px-6 py-2.5 border-2 border-red-400 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors"
                        >
                          Tạo lại
                        </button>
                      </div>
                    </div>
                  )}

                {/* Schedule Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white/40 p-6 rounded-[32px] border border-[#1B4D3E]/5 shadow-sm space-y-6">
                  {/* Morning Period */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">☀️</span>
                      <h3 className="text-lg font-black text-[#1B4D3E]">
                        BUỔI SÁNG
                      </h3>
                    </div>

                    {(activities[selectedDay]?.["morning"] || []).length > 0 ? (
                      <div className="space-y-4">
                        {activities[selectedDay]["morning"].map((item, idx) => (
                          <ActivityCard
                            key={item.id}
                            activity={item}
                            onViewDetails={() =>
                              handleViewActivityDetails(item)
                            }
                            onDelete={() => {
                              const newActivities = { ...activities };
                              newActivities[selectedDay]["morning"] =
                                newActivities[selectedDay]["morning"].filter(
                                  (i) => i.id !== item.id,
                                );
                              setActivities(newActivities);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 italic">
                        Chưa có hoạt động nào
                      </div>
                    )}
                  </div>

                  {/* Afternoon Period */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🌤️</span>
                      <h3 className="text-lg font-black text-[#1B4D3E]">
                        BUỔI TRƯA
                      </h3>
                    </div>

                    {(activities[selectedDay]?.["afternoon"] || []).length >
                    0 ? (
                      <div className="space-y-4">
                        {activities[selectedDay]["afternoon"].map(
                          (item, idx) => (
                            <ActivityCard
                              key={item.id}
                              activity={item}
                              onViewDetails={() =>
                                handleViewActivityDetails(item)
                              }
                              onDelete={() => {
                                const newActivities = { ...activities };
                                newActivities[selectedDay]["afternoon"] =
                                  newActivities[selectedDay][
                                    "afternoon"
                                  ].filter((i) => i.id !== item.id);
                                setActivities(newActivities);
                              }}
                            />
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 italic">
                        Chưa có hoạt động nào
                      </div>
                    )}
                  </div>

                  {/* Evening Period */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🌙</span>
                      <h3 className="text-lg font-black text-[#1B4D3E]">
                        BUỔI TỐI
                      </h3>
                    </div>

                    {(activities[selectedDay]?.["evening"] || []).length > 0 ? (
                      <div className="space-y-4">
                        {activities[selectedDay]["evening"].map((item, idx) => (
                          <ActivityCard
                            key={item.id}
                            activity={item}
                            onViewDetails={() =>
                              handleViewActivityDetails(item)
                            }
                            onDelete={() => {
                              const newActivities = { ...activities };
                              newActivities[selectedDay]["evening"] =
                                newActivities[selectedDay]["evening"].filter(
                                  (i) => i.id !== item.id,
                                );
                              setActivities(newActivities);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 italic">
                        Chưa có hoạt động nào
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex gap-3 pt-4 relative z-20">
                    <button
                      onClick={() =>
                        alert("Chức năng chỉnh sửa đang được phát triển")
                      }
                      className="flex-1 py-3 text-[#1B4D3E] border-2 border-[#1B4D3E] rounded-full font-bold hover:bg-[#1B4D3E]/5 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setShowAddActivityModal(true)}
                      className="flex-1 py-3 bg-[#1B4D3E] text-white rounded-full font-bold hover:bg-[#113D38] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Thêm hoạt động
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Widgets */}
              <div className="hidden lg:flex flex-col gap-6 h-full">
                {/* Weather Widget Placeholder */}
                {/* Weather Widget */}
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-[32px] p-6 text-white shadow-lg transition-all duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {destination || "Đà Lạt"}
                      </h3>
                      <p className="text-sm opacity-90 font-medium">
                        {selectedDayDate} - {currentWeather.condition}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black flex items-center justify-end gap-2">
                        <span>{currentWeather.icon}</span>
                        {currentWeather.temp}°
                      </div>
                      <p className="text-xs opacity-75 font-bold">
                        H:{currentWeather.high}° L:{currentWeather.low}°
                      </p>
                    </div>
                  </div>

                  {/* 7-day forecast */}
                  <div className="grid grid-cols-7 gap-1 mt-6 text-center text-xs">
                    {forecastDays.map((day, idx) => {
                      const isSelected = idx + 1 === selectedDay;
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl py-2 transition-all cursor-pointer ${isSelected ? "bg-white/20 ring-1 ring-white/50 font-bold scale-110" : "opacity-80 hover:bg-white/10"}`}
                          onClick={() => {
                            if (idx + 1 <= tripDays) setSelectedDay(idx + 1);
                          }}
                        >
                          <div className="font-bold mb-1">{day.dayName}</div>
                          <div className="text-lg">{day.icon}</div>
                          <div className="mt-1">{day.temp}°</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map Widget */}
                <div className="flex-1 rounded-[32px] overflow-hidden shadow-lg border border-[#1B4D3E]/10 bg-[#E0E8E8] relative z-10">
                  <MapComponent
                    markers={mapMarkers}
                    showRoutes={viewStep === 2} // Show routes only in detailed view
                    sequentialRoute={viewStep === 2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Add Activity Modal */}
          <AddActivityModal
            isOpen={showAddActivityModal}
            onClose={() => setShowAddActivityModal(false)}
            onAdd={handleAddActivity}
            selectedPlaces={allSelectedLocations}
          />

          {/* DETAIL OVERLAY */}
          {viewedPlace && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setViewedPlace(null)}
            >
              <div
                className="bg-white m-0 max-h-[90vh] rounded-[32px] overflow-y-auto p-6 scrollbar-thin shadow-2xl z-20 w-[90%] md:w-[60%] lg:w-[45%] border border-[#1B4D3E]/5 relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setViewedPlace(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
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
                  <Image
                    src={viewedPlace.image || "/placeholder.jpg"}
                    alt={viewedPlace.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-black text-[#1B4D3E] mb-2">
                  {viewedPlace.name}
                </h2>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {viewedPlace.description || "Mô tả đang cập nhật..."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Giờ mở cửa
                    </p>
                    <p className="text-[#1B4D3E] font-bold">
                      {viewedPlace.duration || "08:00 - 17:00"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Giá vé
                    </p>
                    <p className="text-[#1B4D3E] font-bold">
                      {viewedPlace.price || "Miễn phí"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddPlace(viewedPlace)}
                  className="w-full py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 bg-[#1B4D3E] text-white hover:scale-[1.02]"
                >
                  <span>Thêm vào lịch trình</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-[#BBD9D9] to-transparent pointer-events-none">
          <div className="max-w-[1400px] mx-auto flex justify-center pointer-events-auto">
            <button
              onClick={handleNext}
              className="bg-[#1B4D3E] text-white px-10 py-4 rounded-full font-black text-lg hover:bg-[#113D38] transition-colors shadow-2xl active:scale-95 transform flex items-center gap-2"
            >
              <span>{viewStep === 1 ? "Tạo lịch trình" : "Hoàn tất"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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

        <AddActivityModal
          isOpen={showAddActivityModal}
          onClose={() => {
            setShowAddActivityModal(false);
            setEditingActivity(null);
          }}
          onAdd={handleAddActivity}
          selectedPlaces={selectedPlaces}
          initialData={editingActivity}
        />

        {/* Activity Details Modal */}
        {viewingActivityDetails && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewingActivityDetails(null)}
          >
            <div
              className="bg-white m-0 max-h-[85vh] rounded-[32px] overflow-y-auto p-6 scrollbar-thin shadow-2xl w-[90%] md:w-[60%] lg:w-[50%] border border-[#1B4D3E]/10 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setViewingActivityDetails(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
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

              {/* Image */}
              {viewingActivityDetails.place?.image && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden relative mb-4">
                  <Image
                    src={viewingActivityDetails.place.image}
                    alt={
                      viewingActivityDetails.place.name ||
                      viewingActivityDetails.title
                    }
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-black text-[#1B4D3E] mb-2">
                {viewingActivityDetails.place?.name ||
                  viewingActivityDetails.title}
              </h2>

              {/* Time & Cost */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#1B4D3E] text-white text-sm font-bold rounded-full">
                  🕐 {viewingActivityDetails.time}
                </span>
                {viewingActivityDetails.cost && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                    💰 {viewingActivityDetails.cost}
                  </span>
                )}
                {viewingActivityDetails.duration_minutes && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                    ⏱️ {viewingActivityDetails.duration_minutes} phút
                  </span>
                )}
              </div>

              {/* Description */}
              {viewingActivityDetails.description && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-[#1B4D3E] mb-2 flex items-center gap-2">
                    📖 Giới thiệu
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {viewingActivityDetails.description}
                  </p>
                </div>
              )}

              {/* Activity Description */}
              {viewingActivityDetails.title && (
                <div className="mb-4">
                  <h3 className="font-bold text-[#1B4D3E] mb-2 flex items-center gap-2">
                    ✨ Hoạt động
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {viewingActivityDetails.title}
                  </p>
                </div>
              )}

              {/* Transportation Info */}
              {viewingActivityDetails.transportation && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-[#1B4D3E] mb-3 flex items-center gap-2">
                    🚗 Di chuyển đến đây
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Phương tiện</p>
                      <p className="font-semibold text-[#1B4D3E]">
                        {viewingActivityDetails.transportation.icon}{" "}
                        {viewingActivityDetails.transportation.vehicle_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Khoảng cách</p>
                      <p className="font-semibold text-[#1B4D3E]">
                        {viewingActivityDetails.transportation.distance_km.toFixed(
                          1,
                        )}{" "}
                        km
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Thời gian</p>
                      <p className="font-semibold text-[#1B4D3E]">
                        {viewingActivityDetails.transportation.duration_minutes}{" "}
                        phút
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Chi phí</p>
                      <p className="font-semibold text-[#1B4D3E]">
                        {viewingActivityDetails.transportation.estimated_cost >
                        0
                          ? `${viewingActivityDetails.transportation.estimated_cost.toLocaleString()} đ`
                          : "Miễn phí"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingActivityDetails.notes && (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Lưu ý:</strong> {viewingActivityDetails.notes}
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

export default function TripsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#BBD9D9] flex items-center justify-center text-[#1B4D3E] font-bold">
          Đang tải...
        </div>
      }
    >
      <TripsContent />
    </Suspense>
  );
}
