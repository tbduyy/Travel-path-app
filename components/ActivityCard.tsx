"use client";

import React, { useState } from 'react';
import Image from 'next/image';

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
            address: string | null;
        };
    };
    onViewDetails?: () => void;
    onDelete?: () => void;
    readOnly?: boolean;
}

export default function ActivityCard({ activity, onViewDetails, onDelete, readOnly }: ActivityCardProps) {
    const [imageError, setImageError] = useState(false);
    
    // Calculate mock travel time (in real app, would use distance API)
    const travelTime = activity.place ? `${Math.floor(Math.random() * 20) + 5} phút` : null;
    const distance = activity.place ? `${(Math.random() * 10 + 1).toFixed(1)}km` : null;

    // Get emoji based on activity title/place name
    const getActivityEmoji = () => {
        const text = (activity.title + (activity.place?.name || '')).toLowerCase();
        if (text.includes('ăn') || text.includes('nhà hàng') || text.includes('quán') || text.includes('cơm') || text.includes('phở')) return '🍜';
        if (text.includes('biển') || text.includes('beach') || text.includes('bãi')) return '🏖️';
        if (text.includes('núi') || text.includes('thác') || text.includes('rừng')) return '🏔️';
        if (text.includes('chùa') || text.includes('đền') || text.includes('miếu')) return '🛕';
        if (text.includes('bảo tàng') || text.includes('museum')) return '🏛️';
        if (text.includes('café') || text.includes('coffee') || text.includes('cà phê')) return '☕';
        if (text.includes('chợ') || text.includes('market')) return '🛒';
        if (text.includes('spa') || text.includes('massage')) return '💆';
        if (text.includes('hotel') || text.includes('khách sạn')) return '🏨';
        if (text.includes('check-in') || text.includes('nghỉ ngơi')) return '🛏️';
        return '📍';
    };

    const hasValidImage = activity.place?.image && !imageError;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#1B4D3E]/10 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="flex gap-4 p-4">
                {/* Left: Image or Fallback */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    {hasValidImage ? (
                        <>
                            <Image
                                src={activity.place!.image!}
                                alt={activity.place?.name || activity.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={() => setImageError(true)}
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2E968C] to-[#1B4D3E] flex items-center justify-center">
                            <span className="text-4xl drop-shadow-lg">{getActivityEmoji()}</span>
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
                        {activity.place?.name && activity.place.name !== activity.title && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {activity.place.name}</p>
                        )}
                    </div>

                    {/* Bottom: Actions */}
                    <div className="flex items-center gap-2 mt-2">
                        {travelTime && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E0F2F1] text-[#1B4D3E] rounded-lg text-[10px] font-bold">
                                🚗 {travelTime} | {distance}
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
                                        if (confirm('Bạn có chắc muốn xóa hoạt động này?')) {
                                            onDelete();
                                        }
                                    }}
                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

