"use client";

import { useState } from "react";
// import WeatherCheck from "@/components/ai-trip/WeatherCheck";
import ContextualChat from "@/components/ai-trip/ContextualChat";
// import LocationTracking from "@/components/ai-trip/LocationTracking";

type FeatureType = "weather" | "chat" | "tracking";

export default function MyJourneyTab() {
    const [activeFeature, setActiveFeature] = useState<FeatureType>("chat");

    const features = [
        { id: "chat" as FeatureType, name: "Chat AI", icon: "💬" },
        { id: "weather" as FeatureType, name: "Thời tiết", icon: "🌤️" },
        { id: "tracking" as FeatureType, name: "Theo dõi vị trí", icon: "📍" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Feature Selector */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-4 bg-white rounded-3xl p-2 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveFeature(feature.id)}
                            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeFeature === feature.id
                                    ? "bg-[#1B4D3E] text-white shadow-lg"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <span className="text-xl">{feature.icon}</span>
                            <span>{feature.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Feature Content */}
            <div className="min-h-[600px]">
                <div className={activeFeature === "chat" ? "block" : "hidden"}>
                    <ContextualChat />
                </div>

                {/* {activeFeature === "weather" && <WeatherCheck />} */}
                {/* {activeFeature === "tracking" && <LocationTracking />} */}
                
                {(activeFeature === "weather" || activeFeature === "tracking") && (
                     <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                        <div className="text-center">
                            <div className="relative w-48 h-48 mx-auto mb-8 opacity-30">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                >
                                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-[#1B4D3E] mb-4">
                                Tính năng đang phát triển
                            </h2>
                            <p className="text-gray-500 text-lg mb-8">
                                {activeFeature === "weather" 
                                    ? "Chức năng xem thời tiết chi tiết đang được hoàn thiện." 
                                    : "Chức năng theo dõi vị trí thực tế đang được hoàn thiện."}
                                <br />
                                Vui lòng sử dụng tính năng Chat AI để được hỗ trợ.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
