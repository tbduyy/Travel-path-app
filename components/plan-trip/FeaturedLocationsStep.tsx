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

  const [visibleCount, setVisibleCount] = useState(6);

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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Ensure we don't exceed the list length
  const safeVisibleCount = Math.min(visibleCount, attractions.length);
  const displayedAttractions = attractions.slice(0, safeVisibleCount);

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
    <div className="w-full h-full flex flex-col relative pb-24">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2 md:mb-4 px-2">
        <button onClick={onBack} className="text-[#1B4D3E] hover:bg-[#E0F2F1] p-2 rounded-full transition-colors">
            {/* Arrow Left Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#1B4D3E]">
            Các địa điểm nổi bật tại {city}
          </h2>
          <p className="text-[#1B4D3E]/70 text-sm">
            Chọn ít nhất 1 nơi mà bạn muốn đến
          </p>
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

       {/* Search and Map Toggle Row (based on design typically having search here) */}
       <div className="flex justify-between items-center px-4 mb-4">
            <div className="relative w-full max-w-xs ml-auto">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm" 
                    className="w-full pl-4 pr-10 py-1.5 rounded-full border border-[#1B4D3E]/30 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white text-[#1B4D3E]"
                 />
                 <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4D3E]/50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
       </div>

      {/* Main Content: List of Cards */}
      <div className="w-full px-4 overflow-y-auto">
      {displayedAttractions && displayedAttractions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAttractions.map((attraction) => {
            const isSelected = selectedIds.has(attraction.id);
            return (
              <div
                key={attraction.id}
                className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                    {/* Title Row */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#1B4D3E] truncate">
                        {attraction.name}
                      </h3>
                      {/* Google G Icon Mock */}
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-sm border border-gray-100 text-[10px] font-bold">
                        <span className="text-blue-500">G</span>
                      </span>
                      {renderStars(attraction.rating)}
                    </div>
                    
                    {/* Tags */}
                    <div className="text-[11px] text-[#1B4D3E]/70 font-medium">
                        # Địa điểm tham quan, Thiên nhiên, Ngoài trời
                    </div>
                    
                    {/* Time */}
                     <div className="flex items-center gap-1.5 text-[11px] text-[#1B4D3E]/80 font-medium">
                         <Clock size={12} />
                         <span>Dành khoảng 3-4 tiếng</span>
                     </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => toggleSelection(attraction.id)}
                  className={`w-full py-2.5 rounded-full font-bold text-sm transition-all duration-200 mt-1 ${
                    isSelected
                      ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20"
                      : "bg-white text-[#1B4D3E] border border-[#1B4D3E] hover:bg-[#E0F2F1]"
                  }`}
                >
                  {isSelected ? "ĐÃ CHỌN" : "Chọn điểm này"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
          <div className="text-center py-20 text-gray-500">
              Không tìm thấy địa điểm nào.
          </div>
      )}
      </div>

      {/* Floating Continue Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F8FDFB]/90 backdrop-blur-sm p-4 z-50 rounded-b-[40px]">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
            {/* Show "See More" only if there are more items */}
            <div className="w-24"> 
                {visibleCount < attractions.length && (
                    <button 
                        onClick={handleLoadMore}
                        className="text-[#2E968C] text-sm font-semibold hover:underline"
                    >
                        *Xem thêm
                    </button>
                )}
            </div>
            
            <button
                onClick={handleContinue}
                disabled={selectedIds.size === 0}
                className={`absolute left-1/2 -translate-x-1/2 px-12 py-3 rounded-full font-bold text-white text-lg shadow-xl transition-all ${
                selectedIds.size > 0
                    ? "bg-[#1B4D3E] hover:bg-[#153a2f] hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
                Tiếp tục
            </button>
            
            {/* Empty Spacer to balance layout since we removed chatbot */}
            <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
}
