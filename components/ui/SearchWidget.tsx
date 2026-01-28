"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchPlaces } from "@/app/actions/search";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/lib/store/trip-store";

// Danh sách điểm đến
const destinations = [
  { value: "Đà Lạt", label: "Đà Lạt", icon: "🏔️" },
  { value: "Nha Trang", label: "Nha Trang", icon: "🏖️" },
  { value: "Phú Quốc", label: "Phú Quốc", icon: "🌴" },
  { value: "Hà Nội", label: "Hà Nội", icon: "🏛️" },
  { value: "Hồ Chí Minh", label: "TP. Hồ Chí Minh", icon: "🌆" },
  { value: "Đà Nẵng", label: "Đà Nẵng", icon: "🌉" },
  { value: "Hội An", label: "Hội An", icon: "🏮" },
  { value: "Sa Pa", label: "Sa Pa", icon: "🌄" },
];

// Danh sách phong cách
const travelStyles = [
  { value: "relaxation", label: "Thư giãn - Nghỉ dưỡng", icon: "🧘" },
  { value: "adventure", label: "Khám phá - Trải nghiệm", icon: "🏄" },
  { value: "cultural", label: "Văn hóa", icon: "🏛️" },
  { value: "foodie", label: "Ẩm thực", icon: "🍜" },
  { value: "romantic", label: "Mua sắm - Giải trí", icon: "💕" },
];

export default function SearchWidget() {
  const router = useRouter();
  const { setTripInfo, completeStep } = useTripStore();

  // State for filters
  const [destination, setDestination] = useState("");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [styleLabel, setStyleLabel] = useState("");
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isPeopleExpanded, setIsPeopleExpanded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const peopleDropdownRef = useRef<HTMLDivElement>(null);

  // Chuyển số thành chuỗi có dấu chấm: 4000000 -> "4.000.000"
  const formatNumber = (val) => {
    if (!val) return "";
    const number = val.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  // Chuyển chuỗi định dạng ngược lại số để lưu state: "4.000.000" -> "4000000"
  const rawNumber = (val) => val.replace(/\./g, "");

  // Derived total people count
  const totalPeople = adults + children;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
      if (
        styleDropdownRef.current &&
        !styleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStyleDropdownOpen(false);
      }
      if (
        peopleDropdownRef.current &&
        !peopleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPeopleExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDestination = (dest: (typeof destinations)[0]) => {
    setDestination(dest.value);
    setDestinationLabel(dest.label);
    setIsDropdownOpen(false);
  };

  const handleSelectStyle = (s: (typeof travelStyles)[0]) => {
    setStyle(s.value);
    setStyleLabel(s.label);
    setIsStyleDropdownOpen(false);
  };

  const incrementAdults = () => {
    setAdults(adults + 1);
  };
  const decrementAdults = () => {
    setAdults(Math.max(adults - 1, 0));
  };

  const incrementChildren = () => {
    setChildren(children + 1);
  };

  const decrementChildren = () => {
    setChildren(Math.max(children - 1, 0));
  };

  // Format date range for display
  const getDateDisplayText = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      const end = new Date(endDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      return `${start} - ${end}`;
    }
    if (startDate) {
      return new Date(startDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
    return "";
  };

  const handleSearch = () => {
    console.log("Redirecting to plan-trip with:", {
      destination,
      startDate,
      endDate,
      people: totalPeople,
      budget,
      style,
    });

    // Save trip info to Zustand store
    setTripInfo({
      destination: destination,
      startDate: startDate || null,
      endDate: endDate || null,
      people: totalPeople,
      budget: budget,
      style: style,
    });

    // Mark search step as complete
    completeStep("search");

    // Navigate without URL params - Zustand handles the state
    router.push(`/plan-trip/places`);
  };

  return (
    <div className="w-[94.44%] mx-auto relative z-20">
      {/* Aspect Ratio 1360/173 */}
      <div className="w-full aspect-[1360/173] flex items-center justify-center relative font-sans">
        {/* 1. Container Wrapper (Rec 1) */}
        <div className="relative w-full h-full flex items-center px-[2%] py-[1%]">
          <Image
            src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-1.png"
            alt="Background"
            fill
            className="object-fill pointer-events-none"
            unoptimized
          />

          {/* Inner Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-between gap-[1.5%]">
            {/* Rectangle 2 (Input Area container) */}
            <div className="relative flex-1 h-[70%] flex items-center">
              {/* Rec 2 Background */}
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-2.png"
                alt="Input Area"
                fill
                className="object-fill pointer-events-none"
                unoptimized
              />

              {/* Content Overlay */}
              <div className="relative z-10 w-full h-full flex items-center px-[2%] justify-between">
                {/* Section 1: "Chọn điểm đến" - DROPDOWN */}
                <div
                  className="flex-[2.5] basis-0 h-full flex items-center justify-center px-2 relative"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-full flex items-center justify-center gap-2 bg-transparent border-none outline-none cursor-pointer group"
                  >
                    <MapPin
                      size={16}
                      className="text-[#1B4D3E]/60 group-hover:text-[#1B4D3E] transition-colors"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${
                        destinationLabel
                          ? "text-[#1B4D3E]"
                          : "text-[#1B4D3E]/60"
                      }`}
                    >
                      {destinationLabel || "Chọn điểm đến"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#1B4D3E]/60 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="max-h-[280px] overflow-y-auto">
                          {destinations.map((dest) => (
                            <button
                              key={dest.value}
                              type="button"
                              onClick={() => handleSelectDestination(dest)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E0F2F1] transition-colors text-left ${
                                destination === dest.value
                                  ? "bg-[#E0F2F1] text-[#1B4D3E] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="text-sm md:text-base">
                                {dest.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png"
                  alt="|"
                  width={2}
                  height={40}
                  className="h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 2: "Thời gian đi - về" - CALENDAR POPUP */}
                <div
                  className="flex-[2.5] basis-0 h-full flex items-center justify-center px-2 relative"
                  ref={calendarRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full h-full flex items-center justify-center gap-2 bg-transparent border-none outline-none cursor-pointer group"
                  >
                    <Calendar
                      size={16}
                      className="text-[#1B4D3E]/60 group-hover:text-[#1B4D3E] transition-colors"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${
                        getDateDisplayText()
                          ? "text-[#1B4D3E]"
                          : "text-[#1B4D3E]/60"
                      }`}
                    >
                      {getDateDisplayText() || "Thời gian đi - về"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#1B4D3E]/60 transition-transform duration-200 ${
                        isCalendarOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Calendar Popup */}
                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-4"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">
                              Ngày đi
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-[#1B4D3E]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">
                              Ngày về
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              min={startDate}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 text-[#1B4D3E]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCalendarOpen(false)}
                            className="w-full py-2 bg-[#1B4D3E] text-white rounded-xl font-medium hover:bg-[#153a2f] transition-colors"
                          >
                            Xác nhận
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png"
                  alt="|"
                  width={2}
                  height={40}
                  className="h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 3: "Số người" - UI cũ + nút expand */}
                <div
                  className="flex-[1.5] basis-0 h-full flex items-center justify-center px-2 relative"
                  ref={peopleDropdownRef}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(adults - 1, 1))}
                      className="p-1 rounded-full hover:bg-[#E0F2F1] transition-colors group"
                    >
                      <ChevronDown
                        size={18}
                        className="text-[#1B4D3E]/60 group-hover:text-[#1B4D3E] transition-colors"
                      />
                    </button>
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-[#1B4D3E]/60" />
                      <span className="font-medium text-[#1B4D3E] text-sm lg:text-base min-w-[20px] text-center">
                        {totalPeople}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="p-1 rounded-full hover:bg-[#E0F2F1] transition-colors group"
                    >
                      <ChevronUp
                        size={18}
                        className="text-[#1B4D3E]/60 group-hover:text-[#1B4D3E] transition-colors"
                      />
                    </button>
                    {/* Nút "+" để mở rộng chọn Người lớn / Trẻ em */}
                    <button
                      type="button"
                      onClick={() => setIsPeopleExpanded(!isPeopleExpanded)}
                      className="ml-1 w-6 h-6 rounded-full bg-[#1B4D3E]/10 hover:bg-[#1B4D3E]/20 flex items-center justify-center transition-colors"
                      title="Chi tiết số người"
                    >
                      <span className="text-[#1B4D3E] font-bold text-sm">
                        {isPeopleExpanded ? "−" : "+"}
                      </span>
                    </button>
                  </div>

                  {/* Dropdown: Người lớn & Trẻ em */}
                  <AnimatePresence>
                    {isPeopleExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-4 min-w-[200px]"
                      >
                        <div className="space-y-4">
                          {/* Người lớn */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1B4D3E]">
                              Người lớn
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={decrementAdults}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#1B4D3E] font-bold">
                                  −
                                </span>
                              </button>
                              <span className="font-semibold text-[#1B4D3E] min-w-[24px] text-center">
                                {adults}
                              </span>
                              <button
                                type="button"
                                onClick={incrementAdults}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#1B4D3E] font-bold">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Trẻ em */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1B4D3E]">
                              Trẻ em
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={decrementChildren}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#1B4D3E] font-bold">
                                  −
                                </span>
                              </button>
                              <span className="font-semibold text-[#1B4D3E] min-w-[24px] text-center">
                                {children}
                              </span>
                              <button
                                type="button"
                                onClick={incrementChildren}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#1B4D3E] font-bold">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsPeopleExpanded(false)}
                            className="w-full py-2 bg-[#1B4D3E] text-white rounded-xl font-medium hover:bg-[#153a2f] transition-colors text-sm"
                          >
                            Xác nhận
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png"
                  alt="|"
                  width={2}
                  height={40}
                  className="h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 4: "Ngân sách" */}
                <div className="flex-[4.5] basis-0 min-w-0 h-full flex items-center justify-center px-2">
                  {/* Icon mới ở đây */}
                  <Wallet size={18} className="text-[#1B4D3E]/60 shrink-0" />
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Ngân sách"
                      value={formatNumber(budget)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Chỉ lưu các ký tự số vào state để dễ tính toán sau này
                        const onlyNums = value.replace(/\D/g, "");
                        setBudget(onlyNums);
                      }}
                      className="w-full pr-16 text-right bg-transparent border-none outline-none placeholder-[#1B4D3E]/60 text-[#1B4D3E] font-medium text-xs md:text-sm lg:text-base truncate"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1B4D3E]/80 font-semibold">
                      VND
                    </span>
                  </div>
                </div>

                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png"
                  alt="|"
                  width={2}
                  height={40}
                  className="h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 5: "Phong cách" - DROPDOWN */}
                <div
                  className="flex-[3] basis-0 h-full flex items-center justify-center px-2 relative"
                  ref={styleDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                    className="w-full h-full flex items-center justify-center gap-2 bg-transparent border-none outline-none cursor-pointer group"
                  >
                    <Sparkles
                      size={16}
                      className="text-[#1B4D3E]/60 group-hover:text-[#1B4D3E] transition-colors"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${
                        styleLabel ? "text-[#1B4D3E]" : "text-[#1B4D3E]/60"
                      }`}
                    >
                      {styleLabel || "Phong cách"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#1B4D3E]/60 transition-transform duration-200 ${
                        isStyleDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isStyleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="max-h-[280px] overflow-y-auto">
                          {travelStyles.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => handleSelectStyle(s)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E0F2F1] transition-colors text-left ${
                                style === s.value
                                  ? "bg-[#E0F2F1] text-[#1B4D3E] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="text-sm md:text-base">
                                {s.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Icon */}
                <div
                  className="relative w-[5%] h-full flex items-center justify-center border-l border-gray-200/50 cursor-pointer hover:scale-110 transition-transform"
                  onClick={handleSearch}
                >
                  <Image
                    src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/search-icon.png"
                    alt="Search"
                    width={24}
                    height={24}
                    className="h-[28%] w-auto object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Rectangle 3 (Right Button) - Wrapped in Link to /plan-trip */}
            {/* Rectangle 3 (Right Button) - Trigger Search */}
            <div
              onClick={handleSearch}
              className="relative w-[16%] h-[70%] flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-3.png"
                alt="Background"
                fill
                className="object-fill pointer-events-none"
                unoptimized
              />
              {/* The Label/Icon */}
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/tao-lich-trinh.png"
                alt="Tạo lịch trình"
                width={120}
                height={30}
                className="relative z-10 h-[25%] w-auto object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
