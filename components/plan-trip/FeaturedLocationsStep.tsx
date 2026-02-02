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
    <div className="w-full h-full flex flex-col relative pb-20 md:pb-24">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2 md:mb-4 px-2 md:px-4 gap-2">
        <button onClick={onBack} className="text-[#1B4D3E] hover:bg-[#E0F2F1] p-2 rounded-full transition-colors flex-shrink-0">
            {/* Arrow Left Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-lg md:text-2xl font-bold text-[#1B4D3E]">
            Các địa điểm nổi bật tại {city}
          </h2>
          <p className="text-[#1B4D3E]/70 text-xs md:text-sm">
            Chọn ít nhất 1 nơi mà bạn muốn đến
          </p>
        </div>
        <div className="w-8 flex-shrink-0"></div> {/* Spacer for alignment */}
      </div>

       {/* Search and Map Toggle Row (based on design typically having search here) */}
       <div className="flex justify-between items-center px-2 md:px-4 mb-3 md:mb-4">
            <div className="relative w-full max-w-xs ml-auto">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm" 
                    className="w-full pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 rounded-full border border-[#1B4D3E]/30 text-xs md:text-sm focus:outline-none focus:border-[#1B4D3E] bg-white text-[#1B4D3E]"
                 />
                 <svg className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-[#1B4D3E]/50" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
       </div>

      {/* Main Content: List of Cards */}
      <div className="w-full px-2 md:px-4 overflow-y-auto">
      {displayedAttractions && displayedAttractions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {displayedAttractions.map((attraction) => {
            const isSelected = selectedIds.has(attraction.id);
            return (
              <div
                key={attraction.id}
                className="bg-white rounded-[20px] md:rounded-[24px] p-3 md:p-4 shadow-sm border border-gray-100 flex flex-col gap-2 md:gap-3 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9] rounded-[16px] md:rounded-[20px] overflow-hidden">
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
                    <div className="flex items-center gap-1 md:gap-2">
                      <h3 className="text-sm md:text-lg font-bold text-[#1B4D3E] truncate">
                        {attraction.name}
                      </h3>
                      {/* Google G Icon Mock */}
                      <span className="flex items-center justify-center w-3 md:w-4 h-3 md:h-4 rounded-full bg-white shadow-sm border border-gray-100 text-[8px] md:text-[10px] font-bold flex-shrink-0">
                        <span className="text-blue-500">G</span>
                      </span>
                      {renderStars(attraction.rating)}
                    </div>
                    
                    {/* Tags */}
                    <div className="text-[9px] md:text-[11px] text-[#1B4D3E]/70 font-medium">
                        # Địa điểm tham quan, Thiên nhiên, Ngoài trời
                    </div>
                    
                    {/* Time */}
                     <div className="flex items-center gap-1 text-[9px] md:text-[11px] text-[#1B4D3E]/80 font-medium">
                         <Clock size={10} className="md:size-[12px]" />
                         <span>Dành khoảng 3-4 tiếng</span>
                     </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => toggleSelection(attraction.id)}
                  className={`w-full py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-200 mt-1 ${
                    isSelected
                      ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20"
                      : "bg-white text-[#1B4D3E] border border-[#1B4D3E] hover:bg-[#E0F2F1]"
                  }`}
                >
                  {isSelected ? "ĐÃ CHỌN" : "Chọn điểm"}
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
      <div className="absolute bottom-0 left-0 right-0 bg-[#F8FDFB]/90 backdrop-blur-sm p-3 md:p-4 z-50 rounded-b-[40px]">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative flex-col md:flex-row gap-3">
            {/* Show "See More" only if there are more items */}
            <div className="w-full md:w-24 text-center md:text-left"> 
                {visibleCount < attractions.length && (
                    <button 
                        onClick={handleLoadMore}
                        className="text-[#2E968C] text-xs md:text-sm font-semibold hover:underline"
                    >
                        *Xem thêm
                    </button>
                )}
            </div>
            
            <button
                onClick={handleContinue}
                disabled={selectedIds.size === 0}
                className={`w-full md:w-auto px-8 md:px-12 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-lg text-white shadow-xl transition-all ${
                selectedIds.size > 0
                    ? "bg-[#1B4D3E] hover:bg-[#153a2f] hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
                Tiếp tục
            </button>
            
            {/* Empty Spacer to balance layout */}
            <div className="w-full md:w-24"></div>
        </div>
      </div>
    </div>
  );
}
