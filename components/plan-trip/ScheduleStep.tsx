"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star, MapPin, Clock, Plus, Trash2, Utensils, Share, Save, Check } from "lucide-react";

interface ScheduleStepProps {
  city: string;
  selectedAttractions: any[];
  allAttractions: any[]; // Full list available
  allDining: any[]; // Full dining list from data
  selectedHotel: any;
  onFinish: () => void;
  onBack: () => void;
}

// Fallback dining data when no dining data from JSON
const DEFAULT_DINING: any[] = [
  { id: "def1", name: "Nhà hàng Địa phương", image: "/images/destinations/ha_noi/attractions/pho_co_hn.jpg", rating: 4.5, price: "100.000 - 300.000 VND", distance: "2 km", type: "Dining", description: "Nhà hàng địa phương với ẩm thực đặc trưng" }
];

export default function ScheduleStep({
  city,
  selectedAttractions,
  allAttractions,
  allDining,
  selectedHotel,
  onFinish,
  onBack,
}: ScheduleStepProps) {
  const [activeTab, setActiveTab] = useState<"list" | "specific">("list");
  
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
          </div>
      )}


      {activeTab === "specific" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
               <div className="w-40 h-40 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
                   <Clock size={60} className="text-gray-400" />
               </div>
              <h3 className="text-2xl font-bold mb-2">Tính năng đang phát triển</h3>
              <p className="max-w-md mx-auto">
                 AI sẽ sớm có thể giúp bạn sắp xếp lịch trình chi tiết theo từng khung giờ dựa trên các địa điểm bạn đã chọn!
              </p>
          </div>
      )}
    </div>
  );
}
