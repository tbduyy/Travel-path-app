"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin, Bed, Check } from "lucide-react";

interface Accommodation {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  price: number;
}

interface AccommodationsStepProps {
  city: string;
  hotels: Accommodation[];
  onFinish: (selectedHotel: Accommodation) => void;
  onBack: () => void;
}

export default function AccommodationsStep({
  city,
  hotels,
  onFinish,
  onBack,
}: AccommodationsStepProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(6);

  const handleSelect = (id: string) => {
      setSelectedId(prev => prev === id ? "" : id);
  };

  const handleContinue = () => {
      const selectedHotel = hotels.find(h => h.id === selectedId);
      if (selectedHotel) {
          onFinish(selectedHotel);
      }
  };
  
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Ensure we don't exceed the list length
  const safeVisibleCount = Math.min(visibleCount, hotels.length);
  const displayedHotels = hotels.slice(0, safeVisibleCount);

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

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
            Các nơi lưu trú tại {city}
          </h2>
          <p className="text-[#1B4D3E]/70 text-sm">
            Chọn 1 nơi lưu trú phù hợp nhất
          </p>
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

       {/* Search Bar */}
       <div className="flex justify-between items-center px-4 mb-4">
            <div className="relative w-full max-w-xs ml-auto">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm khách sạn" 
                    className="w-full pl-4 pr-10 py-1.5 rounded-full border border-[#1B4D3E]/30 text-sm focus:outline-none focus:border-[#1B4D3E] bg-white text-[#1B4D3E]"
                 />
                 <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4D3E]/50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
       </div>

      {/* Main Content: List of Cards */}
      <div className="w-full px-4 overflow-y-auto">
        {displayedHotels && displayedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedHotels.map((hotel, index) => {
                const isSelected = selectedId === hotel.id;
                const isTop = index === 0;

                return (
                <div
                    key={hotel.id}
                    className={`bg-white rounded-[24px] p-4 shadow-sm border flex flex-col gap-3 hover:shadow-md transition-all duration-300 ${
                        isSelected ? "border-[#1B4D3E] ring-1 ring-[#1B4D3E]" : "border-gray-100"
                    }`}
                >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden">
                        <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        {isTop && (
                             <div className="absolute top-0 left-0">
                                 <div className="bg-yellow-400 text-[#1B4D3E] text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm">
                                     TỐI ƯU NHẤT
                                 </div>
                             </div>
                         )}
                         {isSelected && (
                             <div className="absolute inset-0 bg-[#1B4D3E]/20 flex items-center justify-center backdrop-blur-[1px]">
                                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                                     <Check size={24} className="text-[#1B4D3E]" strokeWidth={3} />
                                 </div>
                             </div>
                         )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 flex-1">
                        {/* Title Row */}
                        <div className="flex justify-between items-start gap-2">
                             <h3 className="text-lg font-bold text-[#1B4D3E] line-clamp-2 leading-tight">{hotel.name}</h3>
                             <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md">
                                {renderStars(hotel.rating)}
                                <span className="text-[10px] text-gray-500 font-bold ml-1">{hotel.rating.toFixed(1)}</span>
                             </div>
                        </div>
                        
                        {/* Price */}
                         <div className="text-xl font-bold text-[#1B4D3E] mt-1">
                             {formatPrice(hotel.price)}
                             <span className="text-xs font-normal text-gray-500 ml-1">/ đêm</span>
                         </div>

                        {/* Details */}
                         <div className="flex flex-col gap-1 text-[11px] text-[#1B4D3E]/70 font-medium mt-1">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} />
                                <span>Cách trung tâm ~2km</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Bed size={12} />
                                <span>Phòng Tiêu chuẩn • Wifi miễn phí</span>
                            </div>
                         </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => handleSelect(hotel.id)}
                        className={`w-full py-2.5 rounded-full font-bold text-sm transition-all duration-200 mt-1 ${
                            isSelected
                            ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20"
                            : "bg-white text-[#1B4D3E] border border-[#1B4D3E] hover:bg-[#E0F2F1]"
                        }`}
                        >
                        {isSelected ? "ĐÃ CHỌN" : "Chọn phòng này"}
                    </button>
                </div>
                );
            })}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500">
                Không tìm thấy nơi lưu trú nào.
            </div>
        )}
      </div>

       {/* Floating Continue Footer */}
       <div className="absolute bottom-0 left-0 right-0 bg-[#F8FDFB]/90 backdrop-blur-sm p-4 z-50 rounded-b-[40px]">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
            {/* Show "See More" only if there are more items */}
            <div className="w-24"> 
                {visibleCount < hotels.length && (
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
                disabled={!selectedId}
                className={`absolute left-1/2 -translate-x-1/2 px-12 py-3 rounded-full font-bold text-white text-lg shadow-xl transition-all ${
                selectedId
                    ? "bg-[#1B4D3E] hover:bg-[#153a2f] hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
                Hoàn tất
            </button>
            
            {/* Empty Spacer */}
            <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
}
