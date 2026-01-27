"use client";

import Image from "next/image";
import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";

export default function PlanTripLandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E968C]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1B4D3E]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="sticky top-0 z-50 mb-8">
        <Header />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-12 relative z-10 px-4 pb-20 gap-12">
        <div className="w-[90vw] md:w-[85vw] max-w-7xl animate-in fade-in slide-in-from-top-4 duration-700 z-20">
          <SearchWidget />
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <Image
              src="/assets/plan-trip/ai-chatbot.png"
              alt="AI Travel"
              fill
              className="object-contain drop-shadow-2xl animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1B4D3E] uppercase tracking-tighter mb-2">
            Bắt đầu chuyến đi
          </h1>
          <p className="text-lg md:text-xl text-[#1B4D3E]/70 font-medium max-w-2xl mx-auto">
            Nhập điểm đến và sở thích của bạn, TravelPath sẽ giúp bạn lên lịch trình hoàn hảo trong vài giây.
          </p>
        </div>
      </div>
    </div>
  );
}
