"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api-config";

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
        "👋 Chào bạn! Mình là hướng dẫn viên AI của Travel Path, sẵn sàng giúp bạn biến mọi cú chạm thành một hành trình đáng nhớ",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState("Đang khám phá");
  const [currentLocation, setCurrentLocation] = useState("Chưa cập nhật");
  const [feeling, setFeeling] = useState("");

  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate a random session ID when component mounts
    if (typeof window !== "undefined") {
      const newSessionId = window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
    }
  }, []);

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
      const response = await fetch(`${API_BASE_URL}/api/v1/journey/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_message: inputMessage,
          current_location: { name: currentLocation, lat: null, lng: null },
          trip_status: tripStatus,
          recent_feelings: feeling || null,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: "ai",
        content:
          data.ai_message || "Xin lỗi, tôi không hiểu. Vui lòng thử lại.",
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
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-[#1B4D3E] text-white">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-white/20 overflow-hidden">
            <Image
              src="/assets/plan-trip/new_ai-chatbot-ver2.png"
              alt="AI Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-sm">Hướng dẫn viên AI</h3>
            <p className="text-[10px] text-white/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Đang hoạt động
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-[#1B4D3E] text-white"
                  : "bg-white text-gray-800 border border-gray-100 shadow-sm"
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              <p
                className={`text-[10px] mt-1 text-right ${
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
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pt-2 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setInputMessage(action)}
              className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors flex-shrink-0"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Hỏi tôi bất cứ điều gì..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputMessage.trim()}
            className="px-3 py-2 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2C6E5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
