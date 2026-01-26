"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin, Bed, Info } from "lucide-react";

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

  const handleSelect = (file: Accommodation) => {
      // Allow re-click to book if already selected? Or just select first then confirm.
      // For now, click button -> Select.
      // Let's implement immediate selection by button.
      onFinish(file);
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

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-[#1B4D3E] font-bold text-2xl">
           ←
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B4D3E]">
            Các nơi lưu trú tại {city}
          </h2>
          <p className="text-[#1B4D3E]/70 text-sm md:text-base">
            Chọn option bạn thấy tối ưu nhất
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

      {hotels && hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => {
              const isTop = index === 0;
              return (
            <div
              key={hotel.id}
              className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-3">
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
              </div>

              {/* Content Container */}
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start">
                   <h3 className="text-lg font-bold text-[#1B4D3E] line-clamp-2 leading-tight min-h-[44px]">{hotel.name}</h3>
                </div>
                
                 {/* Rating */}
                 <div className="flex items-center gap-1 mb-1">
                    {renderStars(hotel.rating)}
                    <span className="text-xs text-gray-500">({hotel.rating.toFixed(1)})</span>
                 </div>

                {/* Details */}
                <div className="space-y-1 text-[11px] text-[#1B4D3E]/80 mb-2">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#1B4D3E]/60"/>
                        <span className="truncate">Trung tâm ~2km</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                         <Bed size={12} className="text-[#1B4D3E]/60"/>
                         <span className="truncate">Phòng Tiêu chuẩn</span>
                     </div>
                </div>
                
                {/* Footer: Price & Button */}
                <div className="mt-auto pt-2 flex flex-col gap-2">
                     <div className="text-lg font-bold text-[#1B4D3E]">
                         {formatPrice(hotel.price)}
                     </div>
                    <button
                        onClick={() => handleSelect(hotel)}
                        className="w-full bg-[#1B4D3E] text-white py-2.5 rounded-full font-bold text-sm hover:bg-[#153a2f] transition-all shadow-md shadow-[#1B4D3E]/20"
                    >
                        Book chỗ này
                    </button>
                </div>
              </div>
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
  );
}
