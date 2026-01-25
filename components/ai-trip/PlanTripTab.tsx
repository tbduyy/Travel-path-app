"use client";

import HotelRecommendation from "./HotelRecommendation";
import ItineraryGeneration from "./ItineraryGeneration";

type StepType = "hotel" | "itinerary" | "simulation";

interface PlanTripTabProps {
    currentStep: StepType;
    setCurrentStep: (step: StepType) => void;
    selectedHotel: any;
    setSelectedHotel: (hotel: any) => void;
    itinerary: any;
    setItinerary: (itinerary: any) => void;
    hotelRecommendations: any;
    setHotelRecommendations: (recommendations: any) => void;
    itineraryResult: any;
    setItineraryResult: (result: any) => void;
}

export default function PlanTripTab({
    currentStep,
    setCurrentStep,
    selectedHotel,
    setSelectedHotel,
    itinerary,
    setItinerary,
    hotelRecommendations,
    setHotelRecommendations,
    itineraryResult,
    setItineraryResult,
}: PlanTripTabProps) {
    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-4">
                    {/* Step 1: Hotel */}
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                                currentStep === "hotel"
                                    ? "bg-[#1B4D3E] text-white shadow-lg"
                                    : selectedHotel
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                            }`}
                            onClick={() => setCurrentStep("hotel")}
                        >
                            {selectedHotel && currentStep !== "hotel" ? "✓" : "1"}
                        </div>
                        <span
                            className={`font-bold cursor-pointer ${
                                currentStep === "hotel" ? "text-[#1B4D3E]" : "text-gray-400"
                            }`}
                            onClick={() => setCurrentStep("hotel")}
                        >
                            Chọn khách sạn
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full" />

                    {/* Step 2: Itinerary */}
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                                currentStep === "itinerary"
                                    ? "bg-[#1B4D3E] text-white shadow-lg"
                                    : itinerary
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                            }`}
                            onClick={() => selectedHotel && setCurrentStep("itinerary")}
                        >
                            {itinerary && currentStep !== "itinerary" ? "✓" : "2"}
                        </div>
                        <span
                            className={`font-bold cursor-pointer ${
                                currentStep === "itinerary" ? "text-[#1B4D3E]" : "text-gray-400"
                            }`}
                            onClick={() => selectedHotel && setCurrentStep("itinerary")}
                        >
                            Tạo lịch trình
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gray-200 rounded-full" />

                    {/* Step 3: Simulation */}
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                                currentStep === "simulation"
                                    ? "bg-[#1B4D3E] text-white shadow-lg"
                                    : "bg-gray-200 text-gray-400"
                            }`}
                            onClick={() => itinerary && setCurrentStep("simulation")}
                        >
                            3
                        </div>
                        <span
                            className={`font-bold cursor-pointer ${
                                currentStep === "simulation" ? "text-[#1B4D3E]" : "text-gray-400"
                            }`}
                            onClick={() => itinerary && setCurrentStep("simulation")}
                        >
                            Mô phỏng chuyến đi
                        </span>
                    </div>
                </div>

                {/* Clear Data Button */}
                {(selectedHotel || itinerary || hotelRecommendations || itineraryResult) && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => {
                                if (confirm("Bạn có chắc muốn xóa tất cả dữ liệu và bắt đầu lại?")) {
                                    setSelectedHotel(null);
                                    setItinerary(null);
                                    setHotelRecommendations(null);
                                    setItineraryResult(null);
                                    setCurrentStep("hotel");
                                }
                            }}
                            className="px-6 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            🗑️ Xóa và bắt đầu lại
                        </button>
                    </div>
                )}
            </div>

            {/* Step Content */}
            <div className="min-h-[600px]">
                {currentStep === "hotel" && (
                    <HotelRecommendation
                        onHotelSelected={(hotel) => {
                            setSelectedHotel(hotel);
                            setCurrentStep("itinerary");
                        }}
                        recommendations={hotelRecommendations}
                        setRecommendations={setHotelRecommendations}
                    />
                )}

                {currentStep === "itinerary" && (
                    <ItineraryGeneration
                        selectedHotel={selectedHotel}
                        onItineraryGenerated={(data) => {
                            setItinerary(data);
                            setCurrentStep("simulation");
                        }}
                        onBack={() => setCurrentStep("hotel")}
                        itinerary={itineraryResult}
                        setItinerary={setItineraryResult}
                    />
                )}

                {currentStep === "simulation" && (
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
                                Chức năng mô phỏng video POV của chuyến đi đang được hoàn thiện.
                                <br />
                                Vui lòng quay lại sau!
                            </p>
                            <button
                                onClick={() => setCurrentStep("itinerary")}
                                className="px-8 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors"
                            >
                                Quay lại lịch trình
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
