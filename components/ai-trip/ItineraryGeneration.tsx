"use client";

import { useState } from "react";

interface ItineraryGenerationProps {
    selectedHotel: any;
    onItineraryGenerated: (itinerary: any) => void;
    onBack: () => void;
    itinerary: any;
    setItinerary: (itinerary: any) => void;
}

export default function ItineraryGeneration({
    selectedHotel,
    onItineraryGenerated,
    onBack,
    itinerary,
    setItinerary,
}: ItineraryGenerationProps) {
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        budget: "10000000",
        numPeople: "2",
        travelStyle: "relaxation",
        startTime: "08:00",
        endTime: "22:00",
        mandatorySpots: "",
        wishlistSpots: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const mandatoryArray = formData.mandatorySpots
                .split(",")
                .filter((s) => s.trim())
                .map((name) => ({ name: name.trim(), lat: null, lng: null }));

            const wishlistArray = formData.wishlistSpots
                .split(",")
                .filter((s) => s.trim())
                .map((name) => ({ name: name.trim(), lat: null, lng: null }));

            const response = await fetch("http://localhost:8000/api/v1/planning/itinerary/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotel_location: {
                        name: selectedHotel.name,
                        lat: null,
                        lng: null,
                    },
                    mandatory_spots: mandatoryArray,
                    wishlist_spots: wishlistArray,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    budget: parseFloat(formData.budget),
                    num_people: parseInt(formData.numPeople),
                    travel_style: formData.travelStyle,
                    start_time: formData.startTime,
                    end_time: formData.endTime,
                }),
            });

            const data = await response.json();
            setItinerary(data);
        } catch (error) {
            console.error("Error generating itinerary:", error);
            alert("Không thể kết nối tới server. Vui lòng kiểm tra backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Form - Horizontal Layout */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-[#1B4D3E]">Tạo lịch trình</h2>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#1B4D3E] transition-colors"
                    >
                        ← Quay lại
                    </button>
                </div>

                {/* Selected Hotel Info */}
                <div className="mb-6 p-4 bg-[#E0F2F1] rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Khách sạn đã chọn</p>
                    <p className="font-bold text-[#1B4D3E]">{selectedHotel.name}</p>
                    <p className="text-sm text-gray-600">{selectedHotel.address}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Dates + Time Range */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Bắt đầu lúc
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Kết thúc lúc
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>
                    </div>

                    {/* Row 2: Budget + Num People + Travel Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Tổng ngân sách (VND)
                            </label>
                            <input
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Số người</label>
                            <input
                                type="number"
                                value={formData.numPeople}
                                onChange={(e) => setFormData({ ...formData, numPeople: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Phong cách du lịch
                            </label>
                            <select
                                value={formData.travelStyle}
                                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            >
                                <option value="relaxation">Thư giãn</option>
                                <option value="adventure">Phiêu lưu</option>
                                <option value="cultural">Văn hóa</option>
                                <option value="budget">Tiết kiệm</option>
                                <option value="luxury">Sang trọng</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Mandatory + Wishlist Spots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Địa điểm bắt buộc
                            </label>
                            <textarea
                                value={formData.mandatorySpots}
                                onChange={(e) =>
                                    setFormData({ ...formData, mandatorySpots: e.target.value })
                                }
                                placeholder="VD: Hồ Xuân Hương, Chợ Đà Lạt, Dinh Bảo Đại (cách nhau bằng dấu phẩy)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 h-24 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Địa điểm mong muốn (tùy chọn)
                            </label>
                            <textarea
                                value={formData.wishlistSpots}
                                onChange={(e) =>
                                    setFormData({ ...formData, wishlistSpots: e.target.value })
                                }
                                placeholder="VD: Thiền viện Trúc Lâm, Quảng trường Lâm Viên (cách nhau bằng dấu phẩy)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-12 py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#2C6E5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang tạo lịch trình..." : "Tạo lịch trình"}
                    </button>
                </form>
            </div>

            {/* Results - Below Form */}
            {loading && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">AI đang lập kế hoạch...</p>
                    </div>
                </div>
            )}

            {!loading && !itinerary && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-gray-400 font-medium">
                            Điền thông tin và nhấn "Tạo lịch trình" để bắt đầu
                        </p>
                    </div>
                </div>
            )}

            {itinerary && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-[#E0F2F1] rounded-3xl p-6 border border-white/50">
                        <h3 className="text-lg font-black text-[#1B4D3E] mb-3">Tổng quan</h3>
                        <p className="text-sm leading-relaxed text-[#1B4D3E]/80 mb-4">
                            {itinerary.summary}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Tổng chi phí</p>
                                <p className="font-bold text-[#1B4D3E] text-lg">
                                    {itinerary.total_estimated_cost?.toLocaleString()} đ
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tổng quãng đường</p>
                                <p className="font-bold text-[#1B4D3E] text-lg">
                                    {itinerary.total_distance_km} km
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Daily Schedule */}
                    {itinerary.schedule?.map((day: any) => (
                        <div
                            key={day.day}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-[#1B4D3E]">
                                        Ngày {day.day}
                                    </h3>
                                    <p className="text-sm text-gray-500">{day.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Chi phí</p>
                                    <p className="font-bold text-[#1B4D3E]">
                                        {day.total_cost_day?.toLocaleString()} đ
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {day.activities?.map((activity: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="shrink-0">
                                            <div className="w-16 h-16 bg-[#1B4D3E] text-white rounded-xl flex items-center justify-center font-bold text-sm">
                                                {activity.time_slot}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1B4D3E] mb-1">
                                                {activity.location_name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {activity.activity}
                                            </p>
                                            {activity.notes && (
                                                <p className="text-xs text-gray-500 italic">
                                                    {activity.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold text-[#1B4D3E]">
                                                {activity.estimated_cost?.toLocaleString()} đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Action Button */}
                    <button
                        onClick={() => onItineraryGenerated(itinerary)}
                        className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#2C6E5A] transition-colors"
                    >
                        Lưu lịch trình và tiếp tục
                    </button>
                </div>
            )}
        </div>
    );
}
