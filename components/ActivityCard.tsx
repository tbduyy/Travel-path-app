"use client";

import React from 'react';
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
            image: string;
            address: string;
        };
    };
    onViewDetails?: () => void;
    onDelete?: () => void;
    readOnly?: boolean;
}

export default function ActivityCard({ activity, onViewDetails, onDelete, readOnly }: ActivityCardProps) {
    // Calculate mock travel time (in real app, would use distance API)
    const travelTime = activity.place ? `${Math.floor(Math.random() * 20) + 5} mins (${(Math.random() * 10 + 1).toFixed(1)}km)` : null;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#1B4D3E]/10 hover:shadow-md transition-shadow">
            {/* Time and Title */}
            <div className="mb-3">
                <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-bold text-[#1B4D3E]">{activity.time}</span>
                    {activity.cost && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                            {activity.cost}
                        </span>
                    )}
                </div>
                <h4 className="font-bold text-gray-800">{activity.title}</h4>
            </div>

            {/* Place Information */}
            {activity.place && (
                <div className="mb-3">
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2">
                        <Image
                            src={activity.place.image}
                            alt={activity.place.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{activity.place.name}</p>
                </div>
            )}

            {/* Travel Time & Actions */}
            <div className="flex items-center gap-2">
                {travelTime && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                        {travelTime}
                    </span>
                )}

                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={onViewDetails}
                        className="px-4 py-1.5 border-2 border-[#1B4D3E] text-[#1B4D3E] rounded-full text-xs font-bold hover:bg-[#1B4D3E]/5 transition-colors"
                    >
                        Xem chi tiết
                    </button>
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Bạn có chắc muốn xóa hoạt động này?')) {
                                    onDelete();
                                }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
