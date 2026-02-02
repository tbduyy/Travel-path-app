"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";
import PageTransition from "@/components/layout/PageTransition";
import { useTripStore } from "@/lib/store/trip-store";

export default function PlanTripLandingPage() {
  const router = useRouter();
  const { currentStep, destination, selectedPlaceIds, selectedHotelId } =
    useTripStore();

  // Auto-redirect to last progress step
  useEffect(() => {
    // Only redirect if user has started a trip (has destination)
    if (!destination) return;

    // Map step to route
    const stepRoutes: Record<string, string> = {
      search: "/plan-trip", // stay here
      places: "/plan-trip/places",
      hotels: "/plan-trip/hotels",
      trips: "/plan-trip/trips",
      demo: "/plan-trip/demo",
      payment: "/payment",
    };

    // Determine actual step based on progress
    let targetStep = currentStep;

    // If step is "search" but has places selected, move to next logical step
    if (currentStep === "search" && selectedPlaceIds.length > 0) {
      targetStep = "hotels";
    }
    // If has hotel selected, should be at trips or beyond
    if (
      selectedHotelId &&
      (currentStep === "places" || currentStep === "hotels")
    ) {
      targetStep = "trips";
    }

    const targetRoute = stepRoutes[targetStep];

    // Only redirect if not staying on current page
    if (targetRoute && targetRoute !== "/plan-trip") {
      router.replace(targetRoute);
    }
  }, [currentStep, destination, selectedPlaceIds, selectedHotelId, router]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E968C]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1B4D3E]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="sticky top-0 z-50 mb-4 md:mb-8">
        <Header />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-2 md:pt-5 relative z-10 px-3 md:px-4 pb-10 md:pb-20 gap-6 md:gap-12">
        <div className="w-full md:w-[90vw] max-w-3xl animate-in fade-in slide-in-from-top-4 duration-700 z-20">
          <SearchWidget />
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="relative w-16 md:w-22 h-16 md:h-22 mx-auto mb-3 md:mb-4">
            <Image
              src="/assets/plan-trip/new_ai-chatbot-ver2.png"
              alt="AI Travel"
              fill
              className="object-cover drop-shadow-2xl animate-bounce rounded-full overflow-hidden"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#1B4D3E] uppercase tracking-tighter mb-2">
            Bắt đầu chuyến đi
          </h1>
          <p className="text-sm md:text-xl text-[#1B4D3E]/70 font-medium max-w-2xl mx-auto px-2">
            Nhập điểm đến và sở thích của bạn, Travel Path sẽ giúp bạn lên lịch
            trình hoàn hảo trong vài giây.
          </p>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
