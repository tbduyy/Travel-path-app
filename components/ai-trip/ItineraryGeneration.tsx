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
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#E0F2F1] rounded-2xl p-5 border border-[#1B4D3E]/10">
                            <p className="text-gray-500 text-sm font-medium mb-1">Tổng chi phí</p>
                            <p className="text-2xl font-black text-[#1B4D3E]">
                                {itinerary.total_estimated_cost?.toLocaleString()} đ
                            </p>
                        </div>
                        <div className="bg-[#E0F2F1] rounded-2xl p-5 border border-[#1B4D3E]/10">
                            <p className="text-gray-500 text-sm font-medium mb-1">Tổng quãng đường</p>
                            <p className="text-2xl font-black text-[#1B4D3E]">
                                {itinerary.total_distance_km} km
                            </p>
                        </div>
                        <div className="bg-[#E0F2F1] rounded-2xl p-5 border border-[#1B4D3E]/10 flex flex-col justify-center">
                             <p className="text-sm text-gray-600 italic line-clamp-3">
                                "{itinerary.summary}"
                            </p>
                        </div>
                    </div>

                    {/* Timeline Schedule */}
                    <div className="space-y-8">
                        {itinerary.schedule?.map((day: any) => (
                            <div key={day.day} className="relative">
                                {/* Day Header */}
                                <div className="sticky top-20 z-10 bg-[#F8FAF9] py-4 mb-4 flex items-center justify-between border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#1B4D3E] text-white px-4 py-1.5 rounded-full font-bold shadow-md">
                                            Ngày {day.day}
                                        </div>
                                        <span className="text-gray-500 font-medium">{day.date}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Chi phí ngày</span>
                                        <span className="font-bold text-[#1B4D3E]">{day.total_cost_day?.toLocaleString()} đ</span>
                                    </div>
                                </div>

                                {/* Timeline Items */}
                                <div className="space-y-0 relative pl-4 md:pl-0">
                                    {/* Vertical Line (Hidden on mobile for simplicity, or adjusted) */}
                                    <div className="hidden md:block absolute left-[120px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

                                    {day.activities?.map((activity: any, idx: number) => (
                                        <div key={idx} className="relative flex flex-col md:flex-row gap-6 group mb-8 last:mb-0">
                                            
                                            {/* Time Column */}
                                            <div className="flex md:flex-col items-center md:items-end md:w-[100px] shrink-0 pt-2 z-10">
                                                <div className="font-bold text-[#1B4D3E] text-lg bg-[#F8FAF9] md:px-0 pr-4 z-20">
                                                    {activity.time_slot}
                                                </div>
                                            </div>

                                            {/* Dot on Line */}
                                            <div className="hidden md:block absolute left-[113px] top-3 w-4 h-4 bg-white border-4 border-[#1B4D3E] rounded-full z-20 shadow-sm group-hover:scale-110 transition-transform"></div>

                                            {/* Card Content */}
                                            <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                                 {/* Decorative stripe */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1B4D3E] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-[#1B4D3E] mb-2">
                                                            {activity.location_name}
                                                        </h4>
                                                        <p className="text-gray-600 mb-3 leading-relaxed">
                                                            {activity.activity}
                                                        </p>
                                                        {activity.notes && (
                                                            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-500 italic">
                                                                <span className="shrink-0">📝</span>
                                                                <span>{activity.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="shrink-0 text-right">
                                                        <span className="block text-lg font-bold text-[#1B4D3E] text-right">
                                                            {activity.estimated_cost == 0 ? "Miễn phí" : `${activity.estimated_cost?.toLocaleString()} đ`}
                                                        </span>
                                                        <span className="text-xs text-gray-400">Dự kiến</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

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
