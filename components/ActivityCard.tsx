"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageSlideshow from "./ui/ImageSlideshow";

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    time: string;
    cost?: string;
    place?: {
      id: string;
      name: string;
      image: string | null;
      images?: string[]; // Add images support
      address: string | null;
    };
    transportation?: {
      vehicle_type: string;
      icon: string;
      duration_minutes: number;
      estimated_cost: number;
      distance_km: number;
    } | null;
    distance_km?: number;
    duration_minutes?: number;
  };
  onViewDetails?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

export default function ActivityCard({
  activity,
  onViewDetails,
  onDelete,
  readOnly,
}: ActivityCardProps) {
  const [imageError, setImageError] = useState(false);

  // Use transportation data from activity if available
  const transportation = activity.transportation;
  const hasTransportation = !!transportation;

  // Get emoji based on activity title/place name
  const getActivityEmoji = () => {
    const text = (activity.title + (activity.place?.name || "")).toLowerCase();
    if (
      text.includes("ăn") ||
      text.includes("nhà hàng") ||
      text.includes("quán") ||
      text.includes("cơm") ||
      text.includes("phở")
    )
      return "🍜";
    if (text.includes("biển") || text.includes("beach") || text.includes("bãi"))
      return "🏖️";
    if (text.includes("núi") || text.includes("thác") || text.includes("rừng"))
      return "🏔️";
    if (text.includes("chùa") || text.includes("đền") || text.includes("miếu"))
      return "🛕";
    if (text.includes("bảo tàng") || text.includes("museum")) return "🏛️";
    if (
      text.includes("café") ||
      text.includes("coffee") ||
      text.includes("cà phê")
    )
      return "☕";
    if (text.includes("chợ") || text.includes("market")) return "🛒";
    if (text.includes("spa") || text.includes("massage")) return "💆";
    if (text.includes("hotel") || text.includes("khách sạn")) return "🏨";
    if (text.includes("check-in") || text.includes("nghỉ ngơi")) return "🛏️";
    return "📍";
  };

  // Determine images to show
  const images = activity.place?.images?.length
    ? activity.place.images
    : activity.place?.image
      ? [activity.place.image]
      : [];

  const hasValidImage = images.length > 0 && !imageError;

  return (
    <div className="space-y-2">
      {/* Transportation Info - Show before activity if exists */}
      {hasTransportation && (
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <span className="text-2xl">{transportation.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#1B4D3E]">
              {transportation.vehicle_type}
            </p>
            <p className="text-xs text-gray-600">
              {transportation.distance_km.toFixed(1)} km •{" "}
              {transportation.duration_minutes} phút
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#1B4D3E]">
              {transportation.estimated_cost > 0
                ? `${transportation.estimated_cost.toLocaleString()} đ`
                : "Miễn phí"}
            </p>
          </div>
        </div>
      )}

      {/* Activity Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#1B4D3E]/10 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="flex gap-4 p-4">
          {/* Left: Image Slideshow or Emoji */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
            {hasValidImage ? (
              <ImageSlideshow
                images={images}
                alt={activity.place?.name || activity.title}
                className="w-full h-full"
                interval={4000}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2E968C] to-[#1B4D3E] flex items-center justify-center">
                <span className="text-4xl drop-shadow-lg">
                  {getActivityEmoji()}
                </span>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top: Time & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#1B4D3E] text-white text-xs font-bold rounded-full">
                  {activity.time}
                </span>
                {activity.cost && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">
                    💰 {activity.cost}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-[#1B4D3E] text-base leading-tight line-clamp-2">
                {activity.title}
              </h4>
              {activity.place?.name &&
                activity.place.name !== activity.title && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    📍 {activity.place.name}
                  </p>
                )}
            </div>

            {/* Bottom: Actions */}
            <div className="flex items-center gap-2 mt-2">
              {activity.duration_minutes && activity.duration_minutes > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E0F2F1] text-[#1B4D3E] rounded-lg text-[10px] font-bold">
                  ⏱️ {activity.duration_minutes} phút
                </span>
              )}

              <div className="flex gap-1.5 ml-auto">
                <button
                  onClick={onViewDetails}
                  className="px-3 py-1 border border-[#1B4D3E] text-[#1B4D3E] rounded-full text-[10px] font-bold hover:bg-[#1B4D3E] hover:text-white transition-colors"
                >
                  Chi tiết
                </button>
                {onDelete && !readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Bạn có chắc muốn xóa hoạt động này?")) {
                        onDelete();
                      }
                    }}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
