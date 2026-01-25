"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
    role: "user" | "ai";
    content: string;
    timestamp: Date;
};

export default function ContextualChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content:
                "Xin chào! Tôi là AI Guider của bạn. Hãy cho tôi biết bạn đang ở đâu và cảm thấy thế nào trong chuyến đi nhé! 😊",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [tripStatus, setTripStatus] = useState("Đang khám phá");
    const [currentLocation, setCurrentLocation] = useState("Chưa cập nhật");
    const [feeling, setFeeling] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/v1/journey/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_message: inputMessage,
                    current_location: { name: currentLocation, lat: null, lng: null },
                    trip_status: tripStatus,
                    recent_feelings: feeling || null,
                }),
            });

            const data = await response.json();

            const aiMessage: Message = {
                role: "ai",
                content: data.ai_message || "Xin lỗi, tôi không hiểu. Vui lòng thử lại.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                role: "ai",
                content: "Không thể kết nối tới server. Vui lòng kiểm tra backend.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        "Tôi cảm thấy mệt mỏi",
        "Gợi ý địa điểm gần đây",
        "Thời tiết hiện tại như thế nào?",
        "Tôi muốn nghỉ ngơi",
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chat */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white text-xl">
                            🤖
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1B4D3E]">AI Travel Assistant</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Đang hoạt động
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    msg.role === "user"
                                        ? "bg-[#1B4D3E] text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <p
                                    className={`text-xs mt-1 ${
                                        msg.role === "user" ? "text-white/60" : "text-gray-400"
                                    }`}
                                >
                                    {msg.timestamp.toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-6 pb-3">
                    <div className="flex gap-2 flex-wrap">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInputMessage(action)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-100">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !inputMessage.trim()}
                            className="px-6 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Context Panel */}
            <div className="space-y-6">
                {/* Trip Status */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-[#1B4D3E] mb-4">Trạng thái chuyến đi</h3>
                    <select
                        value={tripStatus}
                        onChange={(e) => setTripStatus(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-sm"
                    >
                        <option value="Đang khám phá">Đang khám phá</option>
                        <option value="Tại khách sạn">Tại khách sạn</option>
                        <option value="Di chuyển">Di chuyển</option>
                        <option value="Dùng bữa">Dùng bữa</option>
                        <option value="Nghỉ ngơi">Nghỉ ngơi</option>
                    </select>
                </div>

                {/* Current Location */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-[#1B4D3E] mb-4">Vị trí hiện tại</h3>
                    <input
                        type="text"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        placeholder="VD: Hồ Xuân Hương"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-sm"
                    />
                </div>

                {/* Feeling */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-[#1B4D3E] mb-4">Cảm xúc hiện tại</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {["😊 Vui vẻ", "😌 Thư giãn", "😫 Mệt mỏi", "🤩 Phấn khích"].map(
                            (emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setFeeling(emoji)}
                                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                                        feeling === emoji
                                            ? "bg-[#1B4D3E] text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {emoji}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-[#E0F2F1] rounded-3xl p-6 border border-white/50">
                    <p className="text-xs text-[#1B4D3E]/70 leading-relaxed">
                        💡 <strong>Mẹo:</strong> Cập nhật vị trí và cảm xúc để AI có thể hỗ trợ bạn
                        tốt hơn. AI sẽ tự động đề xuất thay đổi lịch trình nếu cần thiết.
                    </p>
                </div>
            </div>
        </div>
    );
}
