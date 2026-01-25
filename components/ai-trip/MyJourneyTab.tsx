"use client";

import { useState } from "react";
import WeatherCheck from "@/components/ai-trip/WeatherCheck";
import ContextualChat from "@/components/ai-trip/ContextualChat";
import LocationTracking from "@/components/ai-trip/LocationTracking";

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
                {activeFeature === "weather" && <WeatherCheck />}
                {activeFeature === "tracking" && <LocationTracking />}
            </div>
        </div>
    );
}
