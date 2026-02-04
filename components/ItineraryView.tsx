import ActivityCard from "@/components/ActivityCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import TripAssistant from "./TripAssistant";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#E0E8E8] flex items-center justify-center rounded-[32px]">Loading Map...</div>
});

interface ItineraryViewProps {
    destination: string;
    selectedDay: number;
    tripDays: number;
    selectedDayDate: string;
    activities: Record<number, Record<string, any[]>>;
    currentWeather: any;
    mapMarkers: any[];
    onPreviousDay: () => void;
    onNextDay: () => void;
    onEditActivity: (activity: any) => void;
    onDeleteActivity: (day: number, period: string, id: string) => void;
    onAddActivity: () => void;
    isReadOnly?: boolean;
}

export default function ItineraryView({
    destination,
    selectedDay,
    tripDays,
    selectedDayDate,
    activities,
    currentWeather,
    mapMarkers,
    onPreviousDay,
    onNextDay,
    onEditActivity,
    onDeleteActivity,
    onAddActivity,
    onUpdateSchedule, // New Prop
    isReadOnly = false
}: ItineraryViewProps & { onUpdateSchedule?: (data: any) => void }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 h-full">
            {/* Left: Schedule Editor */}
            <div className="flex flex-col gap-4 h-full">
                {/* Day Picker */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#1B4D3E]/10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onPreviousDay}
                            disabled={selectedDay === 1}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-gray-500 font-medium">Ngày {selectedDay} | {destination || "Đà Lạt"}</span>
                            <span className="text-lg font-black text-[#1B4D3E]">{selectedDayDate}</span>
                        </div>
                        <button
                            onClick={onNextDay}
                            disabled={selectedDay === tripDays}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Schedule Content - Grows with content */}
                <div className="flex-1 bg-white/40 p-6 rounded-[32px] border border-[#1B4D3E]/5 shadow-sm space-y-6">

                    {/* Morning Period */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">☀️</span>
                            <h3 className="text-lg font-black text-[#1B4D3E]">BUỔI SÁNG</h3>
                        </div>

                        {(activities[selectedDay]?.['morning'] || []).length > 0 ? (
                            <div className="space-y-4">
                                {(activities[selectedDay]['morning']).map((item, idx) => (
                                    <ActivityCard
                                        key={item.id}
                                        activity={item}
                                        onViewDetails={() => onEditActivity(item)}
                                        onDelete={!isReadOnly ? () => onDeleteActivity(selectedDay, 'morning', item.id) : undefined}
                                        readOnly={isReadOnly}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 italic">
                                Chưa có hoạt động nào
                            </div>
                        )}
                    </div>

                    {/* Afternoon Period */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🌤️</span>
                            <h3 className="text-lg font-black text-[#1B4D3E]">BUỔI TRƯA</h3>
                        </div>

                        {(activities[selectedDay]?.['afternoon'] || []).length > 0 ? (
                            <div className="space-y-4">
                                {(activities[selectedDay]['afternoon']).map((item, idx) => (
                                    <ActivityCard
                                        key={item.id}
                                        activity={item}
                                        onViewDetails={() => onEditActivity(item)}
                                        onDelete={!isReadOnly ? () => onDeleteActivity(selectedDay, 'afternoon', item.id) : undefined}
                                        readOnly={isReadOnly}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 italic">
                                Chưa có hoạt động nào
                            </div>
                        )}
                    </div>

                    {/* Evening Period */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🌙</span>
                            <h3 className="text-lg font-black text-[#1B4D3E]">BUỔI TỐI</h3>
                        </div>

                        {(activities[selectedDay]?.['evening'] || []).length > 0 ? (
                            <div className="space-y-4">
                                {(activities[selectedDay]['evening']).map((item, idx) => (
                                    <ActivityCard
                                        key={item.id}
                                        activity={item}
                                        onViewDetails={() => onEditActivity(item)}
                                        onDelete={!isReadOnly ? () => onDeleteActivity(selectedDay, 'evening', item.id) : undefined}
                                        readOnly={isReadOnly}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 italic">
                                Chưa có hoạt động nào
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Buttons */}
                    {!isReadOnly && (
                        <div className="flex gap-3 pt-4 relative z-20">
                            <button
                                onClick={() => alert('Chức năng chỉnh sửa đang được phát triển')}
                                className="flex-1 py-3 text-[#1B4D3E] border-2 border-[#1B4D3E] rounded-full font-bold hover:bg-[#1B4D3E]/5 transition-colors"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={onAddActivity}
                                className="flex-1 py-3 bg-[#1B4D3E] text-white rounded-full font-bold hover:bg-[#113D38] transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm hoạt động
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: AI Trip Assistant (Sticky) */}
            <div className="hidden lg:block h-[calc(100vh-120px)] sticky top-24">
                <TripAssistant
                    destination={destination}
                    selectedDayDate={selectedDayDate}
                    currentWeather={currentWeather}
                    mapMarkers={mapMarkers}
                    activities={[
                        ...(activities[selectedDay]?.morning || []),
                        ...(activities[selectedDay]?.afternoon || []),
                        ...(activities[selectedDay]?.evening || [])
                    ]}
                    onUpdateSchedule={onUpdateSchedule || (() => { })}
                />
            </div>
        </div>
    );
}


