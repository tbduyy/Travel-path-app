"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Image from "next/image";
import PlanTripTab from "@/components/ai-trip/PlanTripTab";

type StepType = "hotel" | "itinerary" | "simulation";

export default function AITripPage() {
    // Plan Trip State - giữ khi chuyển tab, mất khi refresh
    const [currentStep, setCurrentStep] = useState<StepType>("hotel");
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [itinerary, setItinerary] = useState<any>(null);
    const [hotelRecommendations, setHotelRecommendations] = useState<any>(null);
    const [itineraryResult, setItineraryResult] = useState<any>(null);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
            {/* Header */}
            <div className="sticky top-0 z-50">
                <Header />
            </div>

            {/* Hero Section */}
            <div className="relative w-full bg-[#BBD9D9] py-12">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between">
                        {/* Title */}
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-black text-[#1B4D3E] mb-2 tracking-tight">
                                AI Travel Planner
                            </h1>
                            <p className="text-lg text-[#2C6E5A] font-medium">
                                Lên kế hoạch thông minh, Du lịch tối ưu
                            </p>
                        </div>

                        {/* AI Icon */}
                        <div className="hidden md:block relative w-32 h-32">
                            <Image
                                src="/assets/plan-trip/new_ai-chatbot.png"
                                alt="AI Assistant"
                                fill
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 w-full">
                <PlanTripTab
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    selectedHotel={selectedHotel}
                    setSelectedHotel={setSelectedHotel}
                    itinerary={itinerary}
                    setItinerary={setItinerary}
                    hotelRecommendations={hotelRecommendations}
                    setHotelRecommendations={setHotelRecommendations}
                    itineraryResult={itineraryResult}
                    setItineraryResult={setItineraryResult}
                />
            </div>
        </div>
    );
}
