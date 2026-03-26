"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Feedback data - placeholder for now, can be replaced with real data
const feedbackData = [
  {
    id: 1,
    title: "Nguyễn Hoàng Phúc",
    subtitle:
      "Giao diện dễ dùng, mình có thể lên lịch trình rất nhanh mà không cần chuyển qua nhiều app khác.",
    image:
      "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1XKlV7.img?w=768&h=512&m=6&x=513&y=337&s=144&d=144",
  },
  {
    id: 2,
    title: "Trần Thị Hồng Nhung",
    subtitle:
      "Tính năng AI gợi ý khá sát với nhu cầu, nhưng mình mong hệ thống cập nhật thông tin địa điểm theo thời gian thực tốt hơn.",
    image:
      "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1YAFvM.img?w=768&h=1364&m=6&x=613&y=941&s=126&d=126",
  },
  {
    id: 3,
    title: "Trần Đốc Đam",
    subtitle:
      "Rất tiện khi có thể vừa lên kế hoạch vừa điều chỉnh trong chuyến đi, cảm giác như có một trợ lý du lịch đi cùng.",
    image:
      "https://cdn-img.thethao247.vn/origin_640x0/storage/files/haibui/2025/06/09/chrome_oiegmvpz97-1-684691595c2e2.png",
  },
  {
    id: 4,
    title: "Potential Writer",
    subtitle:
      "App này giúp mình tiết kiệm thời gian lên lịch trình rất nhiều, mách nước các địa điểm hay mà mình chưa biết.",
    image:
      "https://static.wikia.nocookie.net/lookback/images/d/da/Author_Tatsuki_Fujimoto_icon.webp/revision/latest?cb=20240226014910",
  },
  {
    id: 5,
    title: "Ẩn danh",
    subtitle:
      "Rất hài lòng với tính năng sắp xếp tối ưu, giúp mình đi thăm nhiều nơi mà vẫn không mệt mỏi.",
    image:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
  {
    id: 6,
    title: "Selina Lin",
    subtitle:
      "Tấm ảnh du lịch được lưu lại lịch sử, gợi ý thêm điểm thú vị khác rất sáng tạo.",
    image: "fb9.jpg",
  },
];

const FeedbackCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(feedbackData.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleItems = feedbackData.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage,
  );

  return (
    <section className="w-full bg-[#E0F2F1] relative z-10 pb-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-center mb-12">
          <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
            Phản hồi
          </h2>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-[#1B4D3E] hover:bg-[#2C6E5A] text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
            {visibleItems.map((feedback) => (
              <div
                key={feedback.id}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-[1.02]"
              >
                {/* Background Image */}
                <Image
                  src={feedback.image}
                  alt={feedback.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-500"
                  unoptimized
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D3E] via-[#1B4D3E]/40 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h4 className="font-bold text-lg uppercase tracking-wide mb-1">
                    {feedback.title}
                  </h4>
                  <p className="text-sm text-white/80 font-medium">
                    {feedback.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-[#1B4D3E] hover:bg-[#2C6E5A] text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-[#1B4D3E] scale-125"
                  : "bg-[#1B4D3E]/30 hover:bg-[#1B4D3E]/50"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackCarousel;
