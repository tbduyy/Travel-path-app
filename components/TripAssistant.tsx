"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center rounded-[32px]">
      Loading Map...
    </div>
  ),
});

interface TripAssistantProps {
  destination: string;
  selectedDayDate: string;
  currentWeather: any;
  mapMarkers: any[];
  activities: any[]; // Activities for the current day to analyze
  onUpdateSchedule: (suggestion: any) => void;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  type?: "text" | "suggestion" | "weather" | "update_confirm";
  data?: any; // For structured data like suggested places
}

export default function TripAssistant({
  destination,
  selectedDayDate,
  currentWeather,
  mapMarkers,
  activities,
  onUpdateSchedule,
}: TripAssistantProps) {
  const [activeTab, setActiveTab] = useState<"map" | "ai">("map");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Xin chào! Tôi là trợ lý AI cho chuyến đi ${destination} của bạn. Hôm nay bạn cảm thấy thế nào?`,
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      type: "text",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate AI Processing
    setTimeout(() => {
      processUserMessage(userMsg.text);
    }, 1000);
  };

  const processUserMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    let aiResponse: Message;

    if (lowerText.includes("mệt") || lowerText.includes("nghỉ")) {
      // Suggesting a break
      aiResponse = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Bạn có vẻ đang mệt. Hay mình đổi địa điểm tiếp theo sang một quán Cafe thư giãn nhé?",
        type: "suggestion",
        data: {
          suggestionType: "relax",
          targetActivityIndex: findNextActivityIndex(),
          suggestedPlace: {
            id: "coffee-1",
            name: "Highlands Coffee & Chill",
            type: "CAFE",
            address: "Trung tâm thành phố",
            image: "/placeholder.jpg" // In real app, fetch real data
          }
        }
      };
    } else if (lowerText.includes("thời tiết")) {
      aiResponse = {
        id: Date.now().toString(),
        sender: "ai",
        text: `Dự báo thời tiết ${selectedDayDate} tại ${destination}: ${currentWeather?.condition || "Đẹp"}, ${currentWeather?.temp || 25}°C.`,
        type: "weather",
      };
    } else {
      aiResponse = {
        id: Date.now().toString(),
        sender: "ai",
        text: "Tôi chưa hiểu rõ ý bạn. Bạn có thể nói rõ hơn về cảm xúc hoặc nhu cầu hiện tại không?",
        type: "text",
      };
    }

    setMessages((prev) => [...prev, aiResponse]);
  };

  const findNextActivityIndex = () => {
    // Logic to find the next pending activity
    // For now, just return 0 or the first one available
    return 0; 
  };

  const handleAcceptSuggestion = (msg: Message) => {
      console.log("DEBUG: handleAcceptSuggestion triggered", msg);
      // Call parent to update schedule
      if (onUpdateSchedule) {
          onUpdateSchedule(msg.data);
      } else {
          console.error("DEBUG: onUpdateSchedule is safely missing or undefined!");
      }
      
      // Add confirmation message
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: "ai",
          text: "Đã cập nhật lịch trình! Bạn nhớ nghỉ ngơi nhé.",
          type: "text"
      }]);
  };

  const handleQuickCurrentFeeling = (feeling: string) => {
      const userMsg: Message = {
          id: Date.now().toString(),
          sender: "user",
          text: feeling,
          type: "text"
      };
      setMessages(prev => [...prev, userMsg]);
      // Switch tab to AI if not already
      setActiveTab("ai");
      
      setTimeout(() => {
          processUserMessage(feeling);
      }, 800);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 1. Controller / Header */}
      <div className="bg-white p-2 rounded-[24px] shadow-sm border border-[#1B4D3E]/10 flex justify-between items-center px-4">
        <div className="flex bg-gray-100 p-1 rounded-full w-full max-w-[300px]">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "map"
                ? "bg-[#1B4D3E] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Bản đồ
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "ai"
                ? "bg-[#2E968C] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span>🤖</span> Trợ lý AI
          </button>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 rounded-[32px] overflow-hidden shadow-lg border border-[#1B4D3E]/10 bg-white relative">
        {activeTab === "map" ? (
          <div className="w-full h-full bg-[#E0E8E8]">
            <MapComponent
              markers={mapMarkers}
              showRoutes={true}
              sequentialRoute={true}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-[#F2F7F7]">
            {/* Weather Header within Chat */}
            <div className="p-4 bg-gradient-to-r from-[#2E968C] to-[#1B4D3E] text-white shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs opacity-80">Thời tiết hôm nay</p>
                        <div className="flex items-center gap-2">
                             <span className="text-2xl">{currentWeather?.icon}</span>
                             <span className="text-xl font-bold">{currentWeather?.temp}°C</span>
                             <span className="text-sm opacity-90">{currentWeather?.condition}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#1B4D3E] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {msg.text}

                    {/* Suggestion Action */}
                    {msg.type === "suggestion" && msg.data && (
                       <div className="mt-3 bg-[#F0FDFD] p-3 rounded-xl border border-[#2E968C]/20">
                           <div className="flex items-start gap-3 mb-2">
                               <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                   {/* Placeholder image for suggestion */}
                                   <div className="w-full h-full bg-[#2E968C]/20 flex items-center justify-center text-[#2E968C]">
                                       ☕
                                   </div>
                               </div>
                               <div>
                                   <p className="font-bold text-[#1B4D3E]">{msg.data.suggestedPlace.name}</p>
                                   <p className="text-xs text-gray-500">{msg.data.suggestedPlace.address}</p>
                               </div>
                           </div>
                           <button 
                                onClick={() => handleAcceptSuggestion(msg)}
                                className="w-full py-2 bg-[#2E968C] text-white rounded-lg font-bold text-xs hover:bg-[#257A72] transition-colors shadow-sm"
                           >
                               Đồng ý thay đổi lịch trình
                           </button>
                       </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Mind Reading) */}
            <div className="p-2 overflow-x-auto flex gap-2 no-scrollbar bg-white/50 border-t border-gray-100">
                {["Tôi thấy mệt 😓", "Đói bụng quá 🍜", "Muốn đi dạo 🚶", "Trời mưa rồi ☔"].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => handleQuickCurrentFeeling(action)}
                        className="whitespace-nowrap px-4 py-2 bg-white text-[#1B4D3E] border border-[#1B4D3E]/10 rounded-full text-xs font-bold hover:bg-[#1B4D3E] hover:text-white transition-all shadow-sm"
                    >
                        {action}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Bạn cảm thấy thế nào?"
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E968C]/50"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#1B4D3E] text-white rounded-full hover:bg-[#113D38] transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
