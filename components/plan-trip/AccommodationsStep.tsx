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
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel, index) => {
              const isTop = index === 0; // Mock "Tối ưu nhất" badge
              return (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
            >
              <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden mb-4">
                 <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    unoptimized
                 />
                 {isTop && (
                     <div className="absolute top-0 left-0">
                         {/* Mock badge, assume SVG or image */}
                         <div className="bg-yellow-400 text-[#1B4D3E] text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                             TỐI ƯU NHẤT
                         </div>
                     </div>
                 )}
                 <div className="absolute bottom-4 left-4 right-4">
                      {/* Optional Overlay Info */}
                 </div>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-[#1B4D3E]">{hotel.name}</h3>
                   {renderStars(hotel.rating)}
                </div>

                <div className="space-y-1 mb-4 text-sm text-[#1B4D3E]/80">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Khoảng cách đến trung tâm: ~2km</span>
                    </div>
                     <div className="flex items-center gap-2">
                         <Bed size={14} />
                         <span>Loại phòng: Tiêu chuẩn</span>
                     </div>
                     <div className="flex items-start gap-2 text-orange-500 text-xs mt-2">
                         <Info size={14} className="mt-0.5 flex-shrink-0" />
                         <span>Phù hợp cho chuyến đi ngắn ngày</span>
                     </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="px-4 py-2 border border-[#1B4D3E] rounded-l-full rounded-r-none flex-1 font-bold text-[#1B4D3E] text-center">
                        {formatPrice(hotel.price)}
                    </div>
                    <button
                        onClick={() => handleSelect(hotel)}
                        className="bg-[#1B4D3E] text-white px-8 py-2.5 rounded-r-full rounded-l-none font-bold hover:bg-[#153a2f] transition-colors"
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
