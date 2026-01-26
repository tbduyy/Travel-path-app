"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Info boards data - matching the 4 stages from the images
const infoBoards = [
  {
    title: "Trước chuyến đi",
    subtitle: "Lập kế hoạch & quyết định",
    items: [
      "Người dùng nhập nhu cầu cốt lõi (thời gian, ngân sách, số người, mục tiêu).",
      "Hệ thống đề xuất lịch trình tối ưu, cho phép chỉnh sửa linh hoạt.",
      "So sánh chi phí, thời gian và hiệu quả trải nghiệm. Đặt dịch vụ qua đối tác uy tín với giá tốt.",
      "Xem trước hành trình bằng video/mô phỏng.",
    ],
  },
  {
    title: "Trước chuyến đi (3 ngày)",
    subtitle: "Kiểm tra & tối ưu",
    items: [
      "Tự động nhắc lịch trình.",
      "Cập nhật thời tiết, đông đúc và sự kiện phát sinh.",
      "Đề xuất điều chỉnh để đảm bảo khả thi và đúng kỳ vọng.",
    ],
  },
  {
    title: "Trong hành trình",
    subtitle: "Đồng hành & thích ứng",
    items: [
      "Nhắc mốc lịch theo thời gian thực.",
      "Hỗ trợ khi phát sinh vấn đề.",
      "Điều chỉnh lịch nhanh theo thể lực, cảm xúc và thời tiết.",
      "Kết nối dịch vụ di chuyển, dẫn đường liền mạch.",
    ],
  },
  {
    title: "Sau chuyến đi",
    subtitle: "Đánh giá & tích lũy dữ liệu",
    items: [
      "Đánh giá trải nghiệm và hiệu quả của hành trình.",
      "Lưu lại lịch trình đã thực hiện.",
      "Dữ liệu được sử dụng để cải thiện các đề xuất và tối ưu hành trình cho những chuyến đi trong tương lai.",
    ],
  },
];

const CableCarAnimation = () => {
  // Configuration for the animation
  const duration = 15; // Time for one cabin to cross (increased for 4 cabins)
  const numberOfCabins = 4; // 4 cabins to match 4 boards
  const delayBetweenCabins = duration / numberOfCabins;

  // Boards appear EXACTLY at the midpoint between cabins
  // Cabin[i] delay = i * delayBetweenCabins
  // Board[i] delay = (i + 0.5) * delayBetweenCabins (exactly halfway)

  // Define the path exactly once to ensure visual line and motion path match perfectly
  // M -200,35: Start off-screen left, Y=35
  // Q 680,210: Control point at center X=680, Y=210 (pulling down)
  // 1560,105: End off-screen right, Y=105
  const pathDefinition = "M -200,35 Q 680,210 1560,105";

  return (
    <div className="relative w-full mx-auto max-w-[90vw] h-[550px] overflow-hidden z-0 pointer-events-none">
      {/* The Cable/Wire (SVG drawn) */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path
          d={pathDefinition}
          fill="transparent"
          stroke="rgba(0,0,0,0.3)" // Semi-transparent black like a real cable
          strokeWidth="2"
          // Optional: dashed line if desired, but solid is more realistic for cable car
        />
      </svg>

      {/* The Cabins */}
      {[...Array(numberOfCabins)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute left-0 top-0"
          style={{
            offsetPath: `path('${pathDefinition}')`, // Use exact same constant string
            offsetRotate: "0deg",
            offsetAnchor: "50% 16%",
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{
            offsetDistance: "100%",
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: index * delayBetweenCabins,
          }}
        >
          <Image
            src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/TRAVEL%20PATH%20(1)%202.png"
            alt="Cable Car Cabin"
            width={220}
            height={220}
            className="object-contain"
          />
        </motion.div>
      ))}

      {/* The Info Boards - traveling along the same path */}
      {infoBoards.map((board, index) => (
        <motion.div
          key={`board-${index}`}
          className="absolute left-0 top-0"
          style={{
            offsetPath: `path('${pathDefinition}')`,
            offsetRotate: "0deg",
            offsetAnchor: "50% 0%",
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{
            offsetDistance: "100%",
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            // EXACTLY at midpoint: (index + 0.5) * delayBetweenCabins
            delay: (index + 0.5) * delayBetweenCabins,
          }}
        >
          {/* Info Board Card */}
          <div className="w-[210px] bg-[#F5F5F5]/95 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-white/50 pointer-events-auto">
            {/* Title */}
            <h3 className="text-[#8B4513] font-bold text-base mb-1">
              {board.title}
            </h3>
            <p className="text-[#CC7A5C] font-semibold text-sm mb-3 border-b border-[#CC7A5C]/30 pb-2">
              {board.subtitle}
            </p>
            {/* Items */}
            <ul className="space-y-1.5">
              {board.items.map((item, i) => (
                <li
                  key={i}
                  className="text-[#5C5C5C] text-[10px] leading-relaxed flex items-start gap-2"
                >
                  <span className="text-[#CC7A5C] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CableCarAnimation;
