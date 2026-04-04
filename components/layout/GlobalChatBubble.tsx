"use client";

import { useState } from "react";
import Image from "next/image";
import ContextualChat from "@/components/ai-trip/ContextualChat";

export default function GlobalChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] md:h-[600px] shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in border border-gray-200">
          <ContextualChat />
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
      >
        {/* Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-[#1B4D3E] opacity-20 animate-ping" />

        {/* Button BG */}
        <div className="absolute inset-0 rounded-full bg-white border-4 border-[#1B4D3E] overflow-hidden">
          <Image
            src="/assets/plan-trip/new_ai-chatbot-ver2.png"
            alt="AI Assistant"
            fill
            className="object-cover"
          />
        </div>

        {/* Close Icon (Overlay) */}
        {isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#1B4D3E]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}
