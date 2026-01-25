"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api-config";

export default function WeatherCheck() {
    const [formData, setFormData] = useState({
        currentSchedule: "Tham quan Hồ Xuân Hương",
        currentLocation: "Hồ Xuân Hương",
        weatherCondition: "cloudy",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCheck = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/journey/weather/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    current_schedule_item: formData.currentSchedule,
                    current_location: {
                        name: formData.currentLocation,
                        lat: null,
                        lng: null,
                    },
                    weather_condition: formData.weatherCondition,
                }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error checking weather:", error);
            alert("Không thể kết nối tới server. Vui lòng kiểm tra backend.");
        } finally {
            setLoading(false);
        }
    };

    const weatherOptions = [
        { value: "sunny", label: "☀️ Nắng", color: "bg-yellow-100 border-yellow-300" },
        { value: "cloudy", label: "☁️ Nhiều mây", color: "bg-gray-100 border-gray-300" },
        { value: "raining", label: "🌧️ Mưa", color: "bg-blue-100 border-blue-300" },
        { value: "stormy", label: "⛈️ Bão", color: "bg-purple-100 border-purple-300" },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-[#1B4D3E] mb-6">
                        Kiểm tra thời tiết
                    </h2>

                    <div className="space-y-6">
                        {/* Current Schedule */}
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Hoạt động hiện tại
                            </label>
                            <input
                                type="text"
                                value={formData.currentSchedule}
                                onChange={(e) =>
                                    setFormData({ ...formData, currentSchedule: e.target.value })
                                }
                                placeholder="VD: Tham quan Hồ Xuân Hương"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>

                        {/* Current Location */}
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Vị trí hiện tại
                            </label>
                            <input
                                type="text"
                                value={formData.currentLocation}
                                onChange={(e) =>
                                    setFormData({ ...formData, currentLocation: e.target.value })
                                }
                                placeholder="VD: Hồ Xuân Hương"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>

                        {/* Weather Condition */}
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-3">
                                Tình trạng thời tiết
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {weatherOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                weatherCondition: option.value,
                                            })
                                        }
                                        className={`py-3 px-4 rounded-xl font-medium text-sm border-2 transition-all ${
                                            formData.weatherCondition === option.value
                                                ? "border-[#1B4D3E] bg-[#1B4D3E]/5"
                                                : option.color
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#2C6E5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang kiểm tra..." : "Kiểm tra & Gợi ý"}
                        </button>
                    </div>
                </div>

                {/* Right: Result */}
                <div className="space-y-6">
                    {loading && (
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">
                                    Đang phân tích thời tiết...
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && !result && (
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🌤️</div>
                                <p className="text-gray-400 font-medium">
                                    Nhập thông tin và nhấn "Kiểm tra & Gợi ý"
                                </p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div
                                className={`rounded-3xl p-8 shadow-sm border ${
                                    result.needs_change
                                        ? "bg-orange-50 border-orange-200"
                                        : "bg-green-50 border-green-200"
                                }`}
                            >
                                <div className="text-center mb-4">
                                    <div className="text-6xl mb-2">
                                        {result.needs_change ? "⚠️" : "✅"}
                                    </div>
                                    <h3 className="text-2xl font-black text-[#1B4D3E] mb-2">
                                        {result.needs_change
                                            ? "Nên thay đổi kế hoạch"
                                            : "Giữ nguyên kế hoạch"}
                                    </h3>
                                </div>

                                <div
                                    className={`p-4 rounded-xl ${
                                        result.needs_change ? "bg-white" : "bg-white"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed text-gray-700">
                                        {result.message}
                                    </p>
                                </div>
                            </div>

                            {/* Suggestion */}
                            {result.suggested_alternative && (
                                <div className="bg-[#E0F2F1] rounded-3xl p-6 border border-white/50">
                                    <h3 className="text-lg font-black text-[#1B4D3E] mb-3">
                                        💡 Gợi ý thay thế
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[#1B4D3E]/80">
                                        {result.suggested_alternative}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {result.needs_change && (
                                    <button className="flex-1 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors">
                                        Chấp nhận gợi ý
                                    </button>
                                )}
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Kiểm tra lại
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-[#1B4D3E] mb-3">
                    Cách hoạt động
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="shrink-0">1.</span>
                        <span>AI phân tích thời tiết và hoạt động hiện tại của bạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="shrink-0">2.</span>
                        <span>
                            Đánh giá xem thời tiết có phù hợp với hoạt động đã lên kế hoạch không
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="shrink-0">3.</span>
                        <span>
                            Đề xuất các hoạt động thay thế nếu thời tiết không phù hợp
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
