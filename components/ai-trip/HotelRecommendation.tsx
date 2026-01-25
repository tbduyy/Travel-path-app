"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api-config";

interface HotelRecommendationProps {
    onHotelSelected: (hotel: any) => void;
    recommendations: any;
    setRecommendations: (recommendations: any) => void;
}

export default function HotelRecommendation({ 
    onHotelSelected, 
    recommendations,
    setRecommendations 
}: HotelRecommendationProps) {
    const [formData, setFormData] = useState({
        destination: "Đà Lạt",
        budget: "2000000",
        travelStyle: "relaxation",
        numPeople: "2",
        checkIn: "",
        checkOut: "",
        mandatoryLocation: "Hồ Xuân Hương",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call backend API with default weights
            const response = await fetch(`${API_BASE_URL}/api/v1/planning/hotels/suggest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination: formData.destination,
                    mandatory_location: {
                        name: formData.mandatoryLocation,
                        lat: null,
                        lng: null,
                    },
                    budget_per_night: parseFloat(formData.budget),
                    travel_style: formData.travelStyle,
                    num_people: parseInt(formData.numPeople),
                    check_in_date: formData.checkIn,
                    check_out_date: formData.checkOut,
                    price_weight: 40,      // Default value
                    distance_weight: 35,   // Default value
                    style_weight: 25,      // Default value
                }),
            });

            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching hotel recommendations:", error);
            alert("Không thể kết nối tới server. Vui lòng kiểm tra backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Form - Horizontal Layout */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-[#1B4D3E] mb-6">Tìm kiếm khách sạn</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Destination, Mandatory Location, Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Điểm đến
                            </label>
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                placeholder="VD: Đà Lạt, Nha Trang..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Địa điểm bắt buộc
                            </label>
                            <input
                                type="text"
                                value={formData.mandatoryLocation}
                                onChange={(e) =>
                                    setFormData({ ...formData, mandatoryLocation: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                placeholder="Địa điểm phải đến"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Ngân sách/đêm (VND)
                            </label>
                            <input
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>
                    </div>

                    {/* Row 2: Travel Style, Num People, Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Phong cách
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

                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Số người
                            </label>
                            <input
                                type="number"
                                value={formData.numPeople}
                                onChange={(e) => setFormData({ ...formData, numPeople: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Check-in
                            </label>
                            <input
                                type="date"
                                value={formData.checkIn}
                                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                Check-out
                            </label>
                            <input
                                type="date"
                                value={formData.checkOut}
                                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-12 py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#2C6E5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang tìm kiếm..." : "Tìm khách sạn"}
                    </button>
                </form>
            </div>

            {/* Results - Below Form */}
            {loading && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">AI đang phân tích...</p>
                    </div>
                </div>
            )}

            {!loading && !recommendations && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🏨</div>
                        <p className="text-gray-400 font-medium">
                            Điền thông tin và nhấn "Tìm khách sạn" để bắt đầu
                        </p>
                    </div>
                </div>
            )}

            {recommendations && (
                <div className="space-y-6">
                    {/* Hotel List Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {recommendations.recommendations?.map((hotel: any) => (
                            <div
                                key={hotel.rank}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-[#1B4D3E] text-white text-xs font-bold rounded-full">
                                                #{hotel.rank}
                                            </span>
                                            <span className="text-yellow-500">
                                                {"★".repeat(Math.floor(hotel.rating))}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-[#1B4D3E]">{hotel.name}</h3>
                                        <p className="text-sm text-gray-500">{hotel.address}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-[#1B4D3E]">
                                            {hotel.price_per_night.toLocaleString()} đ
                                        </p>
                                        <p className="text-xs text-gray-500">/ đêm</p>
                                    </div>
                                </div>

                                {/* Recommendation */}
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {hotel.recommendation_reason}
                                </p>

                                {/* Select Button */}
                                <button
                                    onClick={() => onHotelSelected(hotel)}
                                    className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors"
                                >
                                    Chọn khách sạn này
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
