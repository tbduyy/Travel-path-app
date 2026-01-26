"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star, MapPin, Clock, Plus, Trash2, Utensils, Share, Save, Check, Sparkles, ChevronLeft, ChevronRight, Sun, Moon, Sunrise } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";

interface ScheduleStepProps {
  city: string;
  selectedAttractions: any[];
  allAttractions: any[]; // Full list available
  allDining: any[]; // Full dining list from data
  selectedHotel: any;
  startDate?: string;
  endDate?: string;
  people?: string;
  budget?: string;
  travelStyle?: string;
  onFinish: () => void;
  onBack: () => void;
}

// Fallback dining data when no dining data from JSON
const DEFAULT_DINING: any[] = [
  { id: "def1", name: "Nhà hàng Địa phương", image: "/images/destinations/ha_noi/attractions/pho_co_hn.jpg", rating: 4.5, price: "100.000 - 300.000 VND", distance: "2 km", type: "Dining", description: "Nhà hàng địa phương với ẩm thực đặc trưng" }
];

// Helper to categorize activities by time of day
const getTimeCategory = (timeSlot: string): "morning" | "afternoon" | "evening" => {
  const hour = parseInt(timeSlot.split(":")[0]);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

const TIME_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  morning: { label: "Buổi sáng", icon: Sunrise, color: "text-orange-500" },
  afternoon: { label: "Buổi trưa", icon: Sun, color: "text-yellow-500" },
  evening: { label: "Buổi tối", icon: Moon, color: "text-indigo-500" },
};

export default function ScheduleStep({
  city,
  selectedAttractions,
  allAttractions,
  allDining,
  selectedHotel,
  startDate,
  endDate,
  people,
  budget,
  travelStyle,
  onFinish,
  onBack,
}: ScheduleStepProps) {
  const [activeTab, setActiveTab] = useState<"list" | "specific">("list");
  
  // AI Itinerary States
  const [aiItinerary, setAiItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  
  // INITIALIZE WITH ONLY 2 ITEMS DISPLAYED (User Request)
  const [displayedAttractions, setDisplayedAttractions] = useState<any[]>(() => {
       return selectedAttractions.length > 0 ? selectedAttractions.slice(0, 2) : [];
  });
  
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  
  // Dining Setup - Use data from props, fallback to default
  const fullDiningList = (allDining && allDining.length > 0) ? allDining : DEFAULT_DINING;
  const [displayedDining, setDisplayedDining] = useState<any[]>(() => {
      return fullDiningList.slice(0, 2);
  });

  // Calculate remaining counts for button visibility
  const remainingAttractionsCount = useMemo(() => {
     const displayedIds = new Set(displayedAttractions.map(a => a.id));
     const totalHiddenSelected = selectedAttractions.filter(a => !displayedIds.has(a.id)).length;
     const totalOther = allAttractions.filter(a => !displayedIds.has(a.id)).length;
     // Note: selectedAttractions is a subset of allAttractions usually, but let's be safe.
     // Effectively: how many in 'allAttractions' are not yet displayed?
     const totalAvailable = allAttractions.filter(a => !displayedIds.has(a.id));
     return totalAvailable.length;
  }, [displayedAttractions, allAttractions]);

  const remainingDiningCount = useMemo(() => {
      const displayedIds = new Set(displayedDining.map(d => d.id));
      return fullDiningList.filter(d => !displayedIds.has(d.id)).length;
  }, [displayedDining, fullDiningList]);

  // Add Attraction Logic
  const handleAddAttraction = () => {
      if (remainingAttractionsCount === 0) return;

      const currentDisplayedIds = new Set(displayedAttractions.map(a => a.id));
      
      // Prioritize hiding selected items first
      const hiddenSelected = selectedAttractions.filter(a => !currentDisplayedIds.has(a.id));
      
      if (hiddenSelected.length > 0) {
          setDisplayedAttractions(prev => [...prev, ...hiddenSelected.slice(0, 4)]);
          return;
      }
      
      // Then others
      const candidates = allAttractions.filter(a => !currentDisplayedIds.has(a.id));
      setDisplayedAttractions(prev => [...prev, ...candidates.slice(0, 4)]);
  };

  // Add Dining Logic
  const handleAddDining = () => {
      if (remainingDiningCount === 0) return;

      const currentIds = new Set(displayedDining.map(d => d.id));
      const candidates = fullDiningList.filter(d => !currentIds.has(d.id));
      setDisplayedDining(prev => [...prev, ...candidates.slice(0, 4)]);
  };
  
  const toggleSavePlace = (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newSaved = new Set(savedIds);
      if (newSaved.has(id)) newSaved.delete(id);
      else newSaved.add(id);
      setSavedIds(newSaved);
  };
  
  // Helper: Render Stars
  const renderStars = (rating: number) => (
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

  // Generate AI Itinerary
  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    try {
      // Combine attractions and dining for comprehensive itinerary
      const allMandatorySpots = [
        ...selectedAttractions.map(a => ({
          name: a.name,
          address: a.address || city,
        })),
      ];
      
      // Add dining places as wishlist spots
      const diningSpots = displayedDining.map(d => ({
        name: d.name,
        address: d.address || city,
      }));

      const requestBody = {
        hotel_location: {
          name: selectedHotel?.name || "Khách sạn trung tâm",
          address: selectedHotel?.address || city,
        },
        mandatory_spots: allMandatorySpots,
        wishlist_spots: diningSpots,
        budget: budget ? parseFloat(budget.replace(/[^0-9]/g, "")) : 5000000,
        num_people: parseInt(people || "2"),
        travel_style: travelStyle || "cultural",
        start_date: startDate || new Date().toISOString().split("T")[0],
        end_date: endDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        start_time: "08:00",
        end_time: "21:00",
        destination: city,
      };

      console.log("AI Itinerary Request:", requestBody);

      const response = await fetch(`${API_BASE_URL}/api/v1/planning/itinerary/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to generate itinerary");

      const data = await response.json();
      setAiItinerary(data);
      setCurrentDayIndex(0);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("Có lỗi khi tạo lịch trình. Vui lòng thử lại!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Group activities by time category
  const groupActivitiesByTime = (activities: any[]) => {
    const groups: Record<string, any[]> = { morning: [], afternoon: [], evening: [] };
    activities.forEach(activity => {
      const category = getTimeCategory(activity.time_slot);
      groups[category].push(activity);
    });
    return groups;
  };

  // Format date for display
  const formatDate = (dateStr: string, dayNum: number) => {
    try {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + dayNum - 1);
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return `Ngày ${dayNum}`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative pb-24 font-sans text-[#1B4D3E] overflow-hidden">
        {/* ... Header & Tabs ... */}
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4"></div>
          <h2 className="text-xl md:text-3xl font-bold uppercase mx-auto bg-[#1B4D3E] text-white px-6 py-2 rounded-full shadow-lg">
            LỊCH TRÌNH {city}
          </h2>
           <div className="flex gap-2">
               <button className="p-2 hover:bg-gray-100 rounded-full text-[#1B4D3E]">
                   <Share size={24} />
               </button>
               <button 
                  onClick={onFinish}
                  className="bg-[#1B4D3E] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#153a2f] shadow-md transition-transform active:scale-95"
               >
                   <Save size={18} />
                   Lưu lịch trình
               </button>
           </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
          <button onClick={() => setActiveTab("list")} className={`px-8 py-2.5 rounded-full font-bold border transition-all ${activeTab === "list" ? "bg-[#BBD9D9] border-[#BBD9D9] text-[#1B4D3E] shadow-sm" : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
              Danh sách du lịch
          </button>
           <button onClick={() => setActiveTab("specific")} className={`px-8 py-2.5 rounded-full font-bold border transition-all ${activeTab === "specific" ? "bg-[#BBD9D9] border-[#BBD9D9] text-[#1B4D3E] shadow-sm" : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
              Lịch trình cụ thể
          </button>
      </div>

      {activeTab === "list" && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-20 scrollbar-thin scrollbar-thumb-gray-300">
              
              {/* Attractions Section */}
              <section>
                  <div className="flex items-center justify-between mb-4 pl-1">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-[#cc3300]">
                          <span className="w-1.5 h-6 bg-[#cc3300] rounded-full mr-1"></span>
                          Địa điểm tham quan ({displayedAttractions.length})
                      </h3>
                  </div>
                  
                  <div className="space-y-4">
                      {displayedAttractions.map((place) => (
                          <div key={place.id} className="bg-white rounded-[24px] p-3 flex gap-4 shadow-sm border border-gray-100 items-start hover:shadow-md transition-all group relative">
                              <div className="relative w-36 h-32 flex-shrink-0 rounded-[20px] overflow-hidden ml-1">
                                  <Image src={place.image} alt={place.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized/>
                              </div>
                              <div className="flex-1 py-1 mr-8">
                                  <div className="flex items-start gap-2 mb-1">
                                      <h4 className="text-xl font-bold text-[#1B4D3E] leading-tight cursor-pointer hover:text-[#2E968C] transition-colors">{place.name}</h4>
                                      <button onClick={(e) => toggleSavePlace(place.id, e)} className={`ml-2 transform transition-transform duration-300 hover:scale-110 ${savedIds.has(place.id) ? "text-[#2E968C]" : "text-[#1B4D3E]/40 hover:text-[#1B4D3E]"}`} title="Lưu vào kế hoạch AI">
                                          {savedIds.has(place.id) ? <div className="bg-[#E0F2F1] p-1 rounded-full"><Check size={20} className="text-[#2E968C]" strokeWidth={3} /></div> : <div className="bg-gray-100 p-1 rounded-full"><Plus size={20} strokeWidth={3} /></div>}
                                      </button>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2 font-medium">Điểm đến ngoài trời - Thời lượng: 1 - 3 giờ</p>
                                  <div className="flex items-center gap-2 mb-3">
                                      <Image src="/assets/google-logo.png" alt="Google" width={16} height={16} className="opacity-80" onError={(e) => {e.currentTarget.style.display='none'}} />
                                      {renderStars(place.rating || 4.5)}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <span className="bg-[#BBD9D9]/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#1B4D3E] flex items-center gap-1.5"><MapPin size={12} /> Cách Khách sạn: {place.distance || "~2km"}</span>
                                      <span className="bg-[#BBD9D9]/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#1B4D3E] flex items-center gap-1.5">
                                            <span className="text-green-600 font-black">$</span> {place.price && typeof place.price === 'number' ? new Intl.NumberFormat('vi-VN').format(place.price) + ' đ' : (place.price || "Miễn phí")}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {remainingAttractionsCount > 0 && (
                      <div className="mt-4">
                        <button onClick={handleAddAttraction} className="bg-[#1B4D3E] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 text-sm hover:bg-[#153a2f] shadow-lg transition-all active:scale-95">
                            <Plus size={18} strokeWidth={3} /> Thêm địa điểm tham quan
                        </button>
                      </div>
                  )}
              </section>

              {/* Dining Section */}
              <section className="pt-4">
                  <div className="flex items-center justify-between mb-4 pl-1">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-[#1B4D3E]">
                          <div className="border border-dashed border-[#1B4D3E] p-1 rounded text-[#1B4D3E]"><Utensils size={20} /></div>
                          Địa điểm ăn uống ({displayedDining.length})
                          <div className="flex items-center gap-3 ml-4 text-sm font-normal text-gray-400">
                              <span className="flex items-center gap-1 text-[#2E968C] font-bold bg-[#E0F2F1] px-2 py-0.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-[#2E968C]"></div> Hot</span>
                              <span className="flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div> Local</span>
                          </div>
                      </h3>
                  </div>
                  
                  <div className="space-y-4">
                      {displayedDining.map((place) => (
                          <div key={place.id} className="bg-white rounded-[24px] p-3 flex gap-4 shadow-sm border border-gray-100 items-start hover:shadow-md transition-all group">
                              <div className="relative w-36 h-32 flex-shrink-0 rounded-[20px] overflow-hidden ml-1">
                                  <div className="w-full h-full bg-gray-100 absolute flex items-center justify-center text-gray-300">Loading...</div>
                                  <Image src={place.image} alt={place.name} fill className="object-cover relative z-10 transition-transform duration-500 group-hover:scale-110" unoptimized onError={(e) => {e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('bg-gray-200');}}/>
                              </div>
                              <div className="flex-1 py-1 mr-8">
                                   <div className="flex items-start gap-2 mb-1">
                                      <h4 className="text-xl font-bold text-[#1B4D3E] cursor-pointer hover:text-[#2E968C] transition-colors">{place.name}</h4>
                                       <button onClick={(e) => toggleSavePlace(place.id, e)} className={`ml-2 transform transition-transform duration-300 hover:scale-110 ${savedIds.has(place.id) ? "text-[#2E968C]" : "text-[#1B4D3E]/40 hover:text-[#1B4D3E]"}`}>
                                            {savedIds.has(place.id) ? <div className="bg-[#E0F2F1] p-1 rounded-full"><Check size={20} className="text-[#2E968C]" strokeWidth={3} /></div> : <div className="bg-gray-100 p-1 rounded-full"><Plus size={20} strokeWidth={3} /></div>}
                                       </button>
                                   </div>
                                  <p className="text-xs text-gray-500 mb-2 font-medium">{place.type} - Thời lượng: 2 giờ</p>
                                  <div className="flex items-center gap-2 mb-3">
                                      <Image src="/assets/google-logo.png" alt="Google" width={16} height={16} className="opacity-80" onError={(e) => {e.currentTarget.style.display='none'}} />
                                      {renderStars(place.rating)}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <span className="bg-[#BBD9D9]/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#1B4D3E] flex items-center gap-1.5"><MapPin size={12} /> Cách Khách sạn: {place.distance}</span>
                                      <span className="bg-[#BBD9D9]/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#1B4D3E] flex items-center gap-1.5">{place.price}</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  {remainingDiningCount > 0 && (
                      <div className="mt-4">
                           <button onClick={handleAddDining} className="bg-[#1B4D3E] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 text-sm hover:bg-[#153a2f] shadow-lg transition-all active:scale-95">
                               <Plus size={18} strokeWidth={3} /> Thêm quán ăn
                           </button>
                      </div>
                  )}
              </section>

              {/* Next Button - Switch to specific tab */}
              <div className="pt-6 border-t border-gray-200 mt-8">
                <button 
                  onClick={() => setActiveTab("specific")}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#1B4D3E] to-[#2E968C] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
                >
                  <Sparkles size={22} />
                  Tiếp theo - Tạo lịch trình AI
                </button>
              </div>
          </div>
      )}


      {activeTab === "specific" && (
          <div className="flex-1 overflow-y-auto pr-2 pb-20">
            {!aiItinerary ? (
              // No itinerary yet - show generate button
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-48 h-48 bg-gradient-to-br from-[#1B4D3E]/10 to-[#2E968C]/10 rounded-full mb-8 flex items-center justify-center animate-pulse">
                  <Sparkles size={80} className="text-[#1B4D3E]" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-[#1B4D3E]">Tạo lịch trình thông minh</h3>
                <p className="max-w-lg mx-auto text-gray-500 mb-8 text-lg">
                  AI sẽ tự động sắp xếp lịch trình chi tiết theo từng khung giờ dựa trên {selectedAttractions.length} địa điểm bạn đã chọn và khách sạn {selectedHotel?.name || "của bạn"}!
                </p>
                <button 
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating}
                  className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl transition-all transform active:scale-95 ${
                    isGenerating 
                      ? "bg-gray-300 text-gray-500 cursor-wait" 
                      : "bg-gradient-to-r from-[#1B4D3E] to-[#2E968C] text-white hover:shadow-2xl hover:scale-105"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang tạo lịch trình...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      AI Tạo Lịch Trình
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Has itinerary - show timeline
              <div className="space-y-6">
                {/* Day Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                    disabled={currentDayIndex === 0}
                    className={`p-2 rounded-full transition-all ${currentDayIndex === 0 ? "text-gray-300" : "text-[#1B4D3E] hover:bg-[#BBD9D9]"}`}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <div className="bg-white px-8 py-3 rounded-full shadow-md border border-gray-100 font-bold text-[#1B4D3E]">
                    Ngày {currentDayIndex + 1} | {city} {startDate ? formatDate(startDate, currentDayIndex + 1) : ""}
                  </div>
                  <button 
                    onClick={() => setCurrentDayIndex(Math.min(aiItinerary.schedule.length - 1, currentDayIndex + 1))}
                    disabled={currentDayIndex >= aiItinerary.schedule.length - 1}
                    className={`p-2 rounded-full transition-all ${currentDayIndex >= aiItinerary.schedule.length - 1 ? "text-gray-300" : "text-[#1B4D3E] hover:bg-[#BBD9D9]"}`}
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>

                {/* Activities Timeline */}
                {aiItinerary.schedule[currentDayIndex] && (
                  <div className="space-y-6">
                    {Object.entries(groupActivitiesByTime(aiItinerary.schedule[currentDayIndex].activities)).map(([timeKey, activities]) => {
                      if ((activities as any[]).length === 0) return null;
                      const timeInfo = TIME_LABELS[timeKey];
                      const TimeIcon = timeInfo.icon;
                      
                      return (
                        <div key={timeKey} className="space-y-3">
                          {/* Time Section Header */}
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 font-bold ${timeInfo.color}`}>
                            <TimeIcon size={18} />
                            {timeInfo.label}
                          </div>
                          
                          {/* Activities */}
                          <div className="relative pl-4 border-l-2 border-dashed border-[#BBD9D9] space-y-4 ml-3">
                            {(activities as any[]).map((activity: any, idx: number) => (
                              <div key={idx} className="relative">
                                {/* Timeline dot */}
                                <div className="absolute -left-[21px] top-4 w-3 h-3 rounded-full bg-[#1B4D3E] border-2 border-white shadow"></div>
                                
                                {/* Activity Card */}
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all ml-4">
                                  <div className="flex gap-4">
                                    {/* Activity Image */}
                                    {activity.image && (
                                      <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                                        <img
                                          src={activity.image}
                                          alt={activity.location_name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    
                                    <div className="flex-1">
                                      {/* Time & Location */}
                                      <p className="text-sm text-gray-500 mb-1">{activity.time_slot} | {activity.location_name}</p>
                                      <h4 className="text-lg font-bold text-[#1B4D3E] mb-2">{activity.activity}</h4>
                                      
                                      {/* Badges */}
                                      <div className="flex flex-wrap gap-2">
                                        {activity.duration_minutes && (
                                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F2F1] text-[#1B4D3E] rounded-full text-xs font-medium">
                                            🕐 {activity.duration_minutes} phút
                                          </span>
                                        )}
                                        {activity.distance_km && activity.distance_km > 0 && (
                                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F2F1] text-[#1B4D3E] rounded-full text-xs font-medium">
                                            📍 {activity.distance_km} km
                                          </span>
                                        )}
                                        {activity.estimated_cost > 0 && (
                                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-medium">
                                            💰 {activity.estimated_cost?.toLocaleString()} đ
                                          </span>
                                        )}
                                        <button className="inline-flex items-center gap-1 px-3 py-1 bg-[#1B4D3E]/10 text-[#1B4D3E] rounded-full text-xs font-medium hover:bg-[#1B4D3E]/20 transition-colors">
                                          Xem chi tiết
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => { setAiItinerary(null); handleGenerateItinerary(); }}
                    disabled={isGenerating}
                    className="flex-1 py-3 rounded-full border-2 border-[#1B4D3E] text-[#1B4D3E] font-bold hover:bg-[#E0F2F1] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    {isGenerating ? "Đang tạo..." : "Tạo lại lịch trình"}
                  </button>
                  <button className="flex-1 py-3 rounded-full bg-[#1B4D3E] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#153a2f] transition-all">
                    <Plus size={18} /> Thêm hoạt động
                  </button>
                </div>
              </div>
            )}
          </div>
      )}
    </div>
  );
}
