"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Clock, Star, CheckCircle } from "lucide-react";

interface Attraction {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
}

interface FeaturedLocationsStepProps {
  city: string; // City name e.g. "Đà Lạt"
  attractions: Attraction[];
  onContinue: (selectedAttractions: Attraction[]) => void;
  onBack: () => void;
}

export default function FeaturedLocationsStep({
  city,
  attractions,
  onContinue,
  onBack,
}: FeaturedLocationsStepProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleContinue = () => {
    const selected = attractions.filter((a) => selectedIds.has(a.id));
    onContinue(selected);
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
            className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-[#1B4D3E] font-bold text-2xl">
          ←
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B4D3E]">
            Các địa điểm nổi bật tại {city}
          </h2>
          <p className="text-[#1B4D3E]/70 text-sm md:text-base">
            Chọn ít nhất 1 nơi mà bạn muốn đến
          </p>
        </div>
        <div className="ml-auto relative">
             {/* Search bar placeholder */}
            <div className="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-1.5 bg-white">
                <input type="text" placeholder="Tìm kiếm" className="outline-none text-sm text-gray-600 bg-transparent" />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-gray-400 ml-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
        </div>
      </div>

      {attractions && attractions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {attractions.map((attraction) => {
            const isSelected = selectedIds.has(attraction.id);
            return (
              <div
                key={attraction.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-300 flex flex-col md:flex-row gap-4 ${
                  isSelected
                    ? "border-[#1B4D3E] shadow-md ring-1 ring-[#1B4D3E]/20"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="relative w-full md:w-64 h-48 md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#1B4D3E]/10 flex items-center justify-center">
                      <div className="bg-[#1B4D3E] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ĐÃ CHỌN
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-[#1B4D3E] mb-1">
                        {attraction.name}
                      </h3>
                      {renderStars(attraction.rating)}
                    </div>
                    
                    <div className="flex items-center gap-1 text-[#1B4D3E]/70 text-xs mt-1">
                        <span># Địa điểm tham quan</span>
                        {/* Mock tags */}
                    </div>
                     <div className="flex items-center gap-1 text-[#1B4D3E]/70 text-xs mt-1">
                         <Clock size={12} />
                         <span>Dành khoảng 2-3 tiếng</span>
                     </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex justify-end md:justify-start">
                    <button
                      onClick={() => toggleSelection(attraction.id)}
                      className={`w-full md:w-auto px-6 py-2 rounded-full font-medium transition-colors border ${
                        isSelected
                          ? "bg-[#1B4D3E] text-white border-[#1B4D3E]"
                          : "bg-white text-[#1B4D3E] border-[#1B4D3E] hover:bg-[#E0F2F1]"
                      }`}
                    >
                      {isSelected ? "Bỏ chọn" : "Chọn điểm này"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
          <div className="text-center py-20 text-gray-500">
              Không tìm thấy địa điểm nào.
          </div>
      )}

      {/* Floating Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 border-t border-gray-200 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span className="text-[#1B4D3E] font-medium hidden md:block">*Xem thêm</span>
            
          <button
            onClick={handleContinue}
            disabled={selectedIds.size === 0}
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all mx-auto md:mx-0 ${
              selectedIds.size > 0
                ? "bg-[#1B4D3E] text-white hover:bg-[#153a2f] hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
