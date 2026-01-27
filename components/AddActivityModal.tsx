"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Activity {
    id: string;
    title: string;
    time: string;
    cost?: string;
    period: 'morning' | 'afternoon' | 'evening';
    place?: {
        id: string;
        name: string;
        image: string;
        address: string;
    };
    startTime?: string;
    endTime?: string;
}

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (activity: Omit<Activity, 'id'>) => void;
    selectedPlaces: any[];
    initialData?: any;
}

export default function AddActivityModal({ isOpen, onClose, onAdd, selectedPlaces = [], initialData }: AddActivityModalProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
    const [activityName, setActivityName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [activityCost, setActivityCost] = useState('');
    const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');

    // Load initial data when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen && initialData) {
            setActivityName(initialData.title || '');
            const [start, end] = (initialData.time || '').split(' - ');
            setStartTime(initialData.startTime || start || '');
            setEndTime(initialData.endTime || end || '');
            setActivityCost(initialData.cost || '');
            setSelectedPeriod(initialData.period || 'morning');
            setSelectedPlaceId(initialData.place?.id || '');
        } else if (isOpen && !initialData) {
            // Reset if adding new
            setActivityName('');
            setStartTime('');
            setEndTime('');
            setActivityCost('');
            setSelectedPlaceId('');
            setSelectedPeriod('morning');
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        if (!activityName.trim() || !startTime || !endTime) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        const selectedPlace = selectedPlaces.find(p => p.id === selectedPlaceId);

        onAdd({
            title: activityName,
            time: `${startTime} - ${endTime}`,
            cost: activityCost || undefined,
            period: selectedPeriod,
            place: selectedPlace ? {
                id: selectedPlace.id,
                name: selectedPlace.name,
                image: selectedPlace.image,
                address: selectedPlace.address
            } : undefined,
            startTime,
            endTime
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-[#1B4D3E]">{initialData ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Time Period Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1B4D3E] mb-3">Chọn buổi *</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedPeriod('morning')}
                            className={`p-4 border-2 rounded-2xl transition-colors text-center ${selectedPeriod === 'morning'
                                ? 'border-[#1B4D3E] bg-[#1B4D3E]/5'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="text-2xl mb-1">☀️</div>
                            <div className="font-bold text-sm">Buổi sáng</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedPeriod('afternoon')}
                            className={`p-4 border-2 rounded-2xl transition-colors text-center ${selectedPeriod === 'afternoon'
                                ? 'border-[#1B4D3E] bg-[#1B4D3E]/5'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="text-2xl mb-1">🌤️</div>
                            <div className="font-bold text-sm">Buổi trưa</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedPeriod('evening')}
                            className={`p-4 border-2 rounded-2xl transition-colors text-center ${selectedPeriod === 'evening'
                                ? 'border-[#1B4D3E] bg-[#1B4D3E]/5'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="text-2xl mb-1">🌙</div>
                            <div className="font-bold text-sm">Buổi tối</div>
                        </button>
                    </div>
                </div>

                {/* Activity Name */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Tên hoạt động *</label>
                    <input
                        type="text"
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        placeholder="VD: Tham quan Vinwonders"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1B4D3E] focus:outline-none transition-colors"
                    />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Thời gian bắt đầu *</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1B4D3E] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Thời gian kết thúc *</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1B4D3E] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Place Selection (Optional) */}
                {selectedPlaces.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Địa điểm (không bắt buộc)</label>
                        <select
                            value={selectedPlaceId}
                            onChange={(e) => setSelectedPlaceId(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1B4D3E] focus:outline-none transition-colors"
                        >
                            <option value="">-- Không chọn địa điểm --</option>
                            {selectedPlaces.map(place => (
                                <option key={place.id} value={place.id}>{place.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Cost (Optional) */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-[#1B4D3E] mb-2">Chi phí (không bắt buộc)</label>
                    <input
                        type="text"
                        value={activityCost}
                        onChange={(e) => setActivityCost(e.target.value)}
                        placeholder="VD: 500.000 VND"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1B4D3E] focus:outline-none transition-colors"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-[#1B4D3E] text-[#1B4D3E] rounded-full font-bold hover:bg-[#1B4D3E]/5 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-[#1B4D3E] text-white rounded-full font-bold hover:bg-[#113D38] transition-colors"
                    >
                        {initialData ? 'Lưu thay đổi' : 'Thêm hoạt động'}
                    </button>
                </div>
            </div>
        </div>
    );
}
