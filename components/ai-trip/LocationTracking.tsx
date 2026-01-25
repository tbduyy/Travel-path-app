"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api-config";

export default function LocationTracking() {
    const [currentLocation, setCurrentLocation] = useState({
        name: "Khách sạn ABC",
        lat: 11.9404,
        lng: 108.4583,
    });

    const [nextDestination, setNextDestination] = useState({
        name: "Hồ Xuân Hương",
        time: "14:00",
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [reminder, setReminder] = useState<any>(null);
    const [rideBooking, setRideBooking] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const handleCheckReminder = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/journey/reminders/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    current_location: currentLocation,
                    next_destination: {
                        name: nextDestination.name,
                        lat: null,
                        lng: null,
                    },
                    next_start_time: nextDestination.time,
                    current_time: currentTime.toISOString(),
                }),
            });

            const data = await response.json();
            setReminder(data);
        } catch (error) {
            console.error("Error checking reminder:", error);
            alert("Không thể kết nối tới server.");
        }
    };

    const scheduleItems = [
        { time: "08:00", location: "Khách sạn", status: "completed" },
        { time: "10:00", location: "Chợ Đà Lạt", status: "completed" },
        { time: "12:00", location: "Nhà hàng", status: "current" },
        { time: "14:00", location: "Hồ Xuân Hương", status: "upcoming" },
        { time: "16:00", location: "Thiền viện Trúc Lâm", status: "upcoming" },
        { time: "18:00", location: "Khách sạn", status: "upcoming" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Current Status */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Location Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-[#1B4D3E] mb-6">Vị trí hiện tại</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                    Tên địa điểm
                                </label>
                                <input
                                    type="text"
                                    value={currentLocation.name}
                                    onChange={(e) =>
                                        setCurrentLocation({ ...currentLocation, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                        Vĩ độ
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={currentLocation.lat}
                                        onChange={(e) =>
                                            setCurrentLocation({
                                                ...currentLocation,
                                                lat: parseFloat(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                        Kinh độ
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={currentLocation.lng}
                                        onChange={(e) =>
                                            setCurrentLocation({
                                                ...currentLocation,
                                                lng: parseFloat(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                setCurrentLocation({
                                                    ...currentLocation,
                                                    lat: position.coords.latitude,
                                                    lng: position.coords.longitude,
                                                });
                                                alert("Đã cập nhật vị trí GPS!");
                                            },
                                            (error) => {
                                                alert("Không thể lấy vị trí GPS: " + error.message);
                                            }
                                        );
                                    } else {
                                        alert("Trình duyệt không hỗ trợ GPS");
                                    }
                                }}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                📍 Lấy vị trí GPS
                            </button>
                        </div>
                    </div>

                    {/* Next Destination */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-[#1B4D3E] mb-6">Điểm đến tiếp theo</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                    Tên địa điểm
                                </label>
                                <input
                                    type="text"
                                    value={nextDestination.name}
                                    onChange={(e) =>
                                        setNextDestination({ ...nextDestination, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#1B4D3E] mb-2">
                                    Thời gian dự kiến
                                </label>
                                <input
                                    type="time"
                                    value={nextDestination.time}
                                    onChange={(e) =>
                                        setNextDestination({ ...nextDestination, time: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                                />
                            </div>

                            <button
                                onClick={handleCheckReminder}
                                className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#2C6E5A] transition-colors"
                            >
                                Kiểm tra nhắc nhở
                            </button>
                        </div>
                    </div>

                    {/* Reminder Result */}
                    {reminder && (
                        <div
                            className={`rounded-3xl p-6 shadow-sm border ${
                                reminder.should_remind
                                    ? "bg-orange-50 border-orange-200"
                                    : "bg-green-50 border-green-200"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">
                                    {reminder.should_remind ? "⏰" : "✅"}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#1B4D3E] mb-2">
                                        {reminder.should_remind ? "Nhắc nhở!" : "Chưa đến giờ"}
                                    </h3>
                                    {reminder.reminder_message && (
                                        <p className="text-sm text-gray-700 mb-4">
                                            {reminder.reminder_message}
                                        </p>
                                    )}

                                    {reminder.suggest_booking && (
                                        <button
                                            onClick={() => setRideBooking(true)}
                                            className="px-6 py-2 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors"
                                        >
                                            🚗 Đặt xe ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ride Booking Modal */}
                    {rideBooking && (
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-xl font-black text-[#1B4D3E] mb-4">
                                Đặt xe đến {nextDestination.name}
                            </h3>

                            <div className="space-y-4 mb-6">
                                {[
                                    { type: "Xe máy", price: "25,000", time: "10 phút" },
                                    { type: "Grab Car", price: "65,000", time: "8 phút" },
                                    { type: "Grab Car Plus", price: "95,000", time: "8 phút" },
                                ].map((option, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#1B4D3E] transition-colors text-left"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-[#1B4D3E]">
                                                    {option.type}
                                                </p>
                                                <p className="text-xs text-gray-500">{option.time}</p>
                                            </div>
                                            <p className="text-lg font-bold text-[#1B4D3E]">
                                                {option.price} đ
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRideBooking(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Tính năng đang phát triển!");
                                        setRideBooking(false);
                                    }}
                                    className="flex-1 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Schedule Timeline */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-black text-[#1B4D3E] mb-6">Lịch trình hôm nay</h3>

                    <div className="space-y-4">
                        {scheduleItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="shrink-0">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${
                                            item.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "current"
                                                ? "bg-[#1B4D3E] text-white"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {item.time}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p
                                        className={`font-bold text-sm ${
                                            item.status === "completed"
                                                ? "text-green-700"
                                                : item.status === "current"
                                                ? "text-[#1B4D3E]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {item.location}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.status === "completed"
                                            ? "Đã hoàn thành"
                                            : item.status === "current"
                                            ? "Đang diễn ra"
                                            : "Sắp tới"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
