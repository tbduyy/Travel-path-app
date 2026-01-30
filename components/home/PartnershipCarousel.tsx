"use client";

import React, { useState } from "react";
import Image from "next/image";

// Partnership data - can be extended with more items
const partnershipData = [
  {
    id: 1,
    title: "Hệ thống khách sạn uy tín",
    description:
      "Travel Path hợp tác với hệ thống khách sạn uy tín trên khắp Việt Nam, từ khách sạn trung tâm thành phố đến khu nghỉ dưỡng tại các điểm du lịch nổi tiếng, mang đến lựa chọn lưu trú đa dạng, tiện nghi và đáng tin cậy cho mọi hành trình.",
    image: "https://placehold.co/600x400?text=Hotel+System",
    imagePosition: "left" as const,
  },
  {
    id: 2,
    title: "Địa điểm du lịch nổi tiếng",
    description:
      "Travel Path hợp tác với hệ thống khách sạn uy tín trên khắp cả nước, hiện diện tại nhiều điểm du lịch nổi tiếng như Đà Lạt, Đà Nẵng, Nha Trang, Phú Quốc, Hội An hay Hà Nội và TP.HCM. Các đối tác được chọn lọc kỹ lưỡng dựa trên chất lượng dịch vụ và độ tin cậy, giúp người dùng dễ dàng đặt phòng, an tâm lưu trú và tận hưởng trọn vẹn hành trình du lịch của mình.",
    image: "https://placehold.co/600x400?text=Tourist+Spots",
    imagePosition: "right" as const,
  },
  {
    id: 3,
    title: "Dịch vụ vận chuyển",
    description:
      "Travel Path kết nối với các đối tác vận chuyển uy tín, cung cấp dịch vụ đưa đón sân bay, thuê xe riêng và các phương tiện di chuyển linh hoạt, giúp bạn di chuyển thuận tiện và an toàn trong suốt hành trình.",
    image: "https://placehold.co/600x400?text=Transport",
    imagePosition: "left" as const,
  },
];

const PartnershipCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(partnershipData.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleItems = partnershipData.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section className="w-full bg-[#E0F2F1] relative z-10 py-16 -mt-10 rounded-t-[3rem]">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-center mb-6">
          <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
            Đối tác
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50 transition-all duration-500"
            >
              {item.imagePosition === "left" || idx % 2 === 0 ? (
                <>
                  <div className="w-full md:w-1/3 h-48 relative bg-white/30 rounded-2xl overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 text-[#1B4D3E]">
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed font-medium opacity-80 text-justify">
                      {item.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 order-2 md:order-1 text-[#1B4D3E]">
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed font-medium opacity-80 text-justify">
                      {item.description}
                    </p>
                  </div>
                  <div className="w-full md:w-1/3 h-48 relative bg-gray-200 rounded-2xl overflow-hidden order-1 md:order-2">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Carousel Arrows */}
        <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
          <button
            onClick={handlePrev}
            className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
            aria-label="Previous"
          >
            <Image
              src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-left.png"
              alt="Previous"
              width={40}
              height={40}
            />
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-[#1B4D3E] scale-125"
                    : "bg-[#1B4D3E]/30 hover:bg-[#1B4D3E]/50"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
            aria-label="Next"
          >
            <Image
              src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-right.png"
              alt="Next"
              width={40}
              height={40}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnershipCarousel;
