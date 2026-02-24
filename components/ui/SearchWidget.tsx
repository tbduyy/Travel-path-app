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
  AlertCircle,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/lib/store/trip-store";

// Danh sách điểm đến
const destinations = [
  { value: "Đà Lạt", label: "Đà Lạt", icon: "🏔️" },
  { value: "Nha Trang", label: "Nha Trang", icon: "🏖️" },
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
  const [showError, setShowError] = useState(false);
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const peopleDropdownRef = useRef<HTMLDivElement>(null);

  // Chuyển số thành chuỗi có dấu chấm: 4000000 -> "4.000.000"
  const formatNumber = (val: string) => {
    if (!val) return "";
    const number = val.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
    return new Intl.NumberFormat("vi-VN").format(Number(number));
  };

  // Chuyển chuỗi định dạng ngược lại số để lưu state: "4.000.000" -> "4000000"
  const rawNumber = (val: string) => val.replace(/\./g, "");

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
    setShowError(false);
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
    if (!destination) {
      setShowError(true);
      return;
    }

    console.log("Redirecting to plan-trip with:", {
      destination,
      startDate,
      endDate,
      people: totalPeople,
      budget,
      style,
    });

    // Clear previous trip state before starting a new one
    useTripStore.getState().clearTrip();

    // Save new trip info to Zustand store
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
    <div className="relative w-[110%] left-1/2 -translate-x-1/2 z-20">
      {/* Parent controls width (matches homepage). Keep responsive heights to match visual size */}
      <div className="w-full flex items-center justify-center relative font-sans h-[80px] md:h-[110px] lg:h-[140px]">
        {/* 1. Container Wrapper (Rec 1) */}
        <div className="relative w-full h-full flex items-center px-2 md:px-[4%] py-2 md:py-[1%]">
          <Image
            src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-1.png"
            alt="Background"
            fill
            className="object-fill pointer-events-none hidden md:block"
            unoptimized
          />
          {/* Mobile background fallback */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-r from-[#E0F2F1] to-[#D8F3DC] rounded-2xl" />

          {/* Inner Content */}
          <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-2 md:gap-[1.5%]">
            {/* Rectangle 2 (Input Area container) - Mobile: Stack layout */}
            <div className="relative flex-1 w-full h-auto md:h-[70%] flex flex-col md:flex-row items-center gap-2 md:gap-0">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-2.png"
                alt="Input Area"
                fill
                className="object-fill pointer-events-none hidden md:block"
                unoptimized
              />
              {/* Mobile background fallback */}
              <div className="absolute inset-0 md:hidden bg-white rounded-xl" />

              {/* Content Overlay */}
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center px-2 md:px-[2%] justify-between gap-2 md:gap-0">
                {/* Section 1: "Chọn điểm đến" - DROPDOWN */}
                <div
                  className="flex-1 md:flex-[2.5] md:basis-0 h-10 md:h-full flex items-center justify-center px-2 relative w-full md:w-auto"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-full flex items-center justify-center gap-1 md:gap-2 bg-transparent border border-[#E0F2F1] md:border-none rounded-lg md:rounded-none outline-none cursor-pointer group"
                  >
                    <MapPin
                      size={14}
                      className="hidden md:block text-[#003F3E]/60 group-hover:text-[#003F3E] transition-colors flex-shrink-0"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${destinationLabel
                        ? "text-[#003F3E]"
                        : "text-[#003F3E]/60"
                        }`}
                    >
                      {destinationLabel || "Chọn điểm đến"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#003F3E]/60 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""
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
                        className="absolute top-full left-0 right-0 md:left-auto md:right-auto mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-full md:w-64"
                      >
                        <div className="max-h-[280px] overflow-y-auto">
                          {destinations.map((dest) => (
                            <button
                              key={dest.value}
                              type="button"
                              onClick={() => handleSelectDestination(dest)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E0F2F1] transition-colors text-left ${destination === dest.value
                                ? "bg-[#E0F2F1] text-[#003F3E] font-semibold"
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
                  className="hidden md:block h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 2: "Thời gian đi - về" - CALENDAR POPUP */}
                <div
                  className="flex-1 md:flex-[2.5] md:basis-0 h-10 md:h-full flex items-center justify-center px-2 relative w-full md:w-auto"
                  ref={calendarRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full h-full flex items-center justify-center gap-1 md:gap-2 bg-transparent border border-[#E0F2F1] md:border-none rounded-lg md:rounded-none outline-none cursor-pointer group"
                  >
                    <Calendar
                      size={14}
                      className="hidden md:block text-[#003F3E]/60 group-hover:text-[#003F3E] transition-colors flex-shrink-0"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${getDateDisplayText()
                        ? "text-[#003F3E]"
                        : "text-[#003F3E]/60"
                        }`}
                    >
                      {getDateDisplayText() || "Ngày đi - về"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#003F3E]/60 transition-transform duration-200 flex-shrink-0 ${isCalendarOpen ? "rotate-180" : ""
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
                        className="absolute top-full right-0 w-full md:w-52 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-4 left-0 md:left-auto"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#003F3E] mb-1">
                              Ngày đi
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003F3E]/20 text-[#003F3E]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#003F3E] mb-1">
                              Ngày về
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              min={startDate}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003F3E]/20 text-[#003F3E]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCalendarOpen(false)}
                            className="w-full py-2 bg-[#003F3E] text-white rounded-xl font-medium hover:bg-[#153a2f] transition-colors"
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

                {/* Section 3: "Số người" - Mobile simplified, Desktop expanded */}
                <div
                  className="flex-1 md:flex-[1.5] md:basis-0 h-10 md:h-full flex items-center justify-center px-2 relative w-full md:w-auto"
                  ref={peopleDropdownRef}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(adults - 1, 1))}
                      className="p-1 rounded-full hover:bg-[#E0F2F1] transition-colors group"
                    >
                      <ChevronDown
                        size={14}
                        className="md:size-[18px] text-[#003F3E]/60 group-hover:text-[#003F3E] transition-colors"
                      />
                    </button>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="md:size-[16px] text-[#003F3E]/60" />
                      <span className="font-medium text-[#003F3E] text-xs md:text-sm lg:text-base min-w-[20px] text-center">
                        {totalPeople}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="p-1 rounded-full hover:bg-[#E0F2F1] transition-colors group"
                    >
                      <ChevronUp
                        size={14}
                        className="md:size-[18px] text-[#003F3E]/60 group-hover:text-[#003F3E] transition-colors"
                      />
                    </button>
                    {/* Nút "+" để mở rộng chọn Người lớn / Trẻ em */}
                    <button
                      type="button"
                      onClick={() => setIsPeopleExpanded(!isPeopleExpanded)}
                      className="ml-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#003F3E]/10 hover:bg-[#003F3E]/20 flex items-center justify-center transition-colors flex-shrink-0"
                      title="Chi tiết số người"
                    >
                      <span className="text-[#003F3E] font-bold text-xs">
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
                        className="absolute top-full w-52 right-0 md:right-auto left-0 md:left-auto mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-4 min-w-[200px]"
                      >
                        <div className="space-y-4">
                          {/* Người lớn */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#003F3E]">
                              Người lớn
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={decrementAdults}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#003F3E] font-bold">
                                  −
                                </span>
                              </button>
                              <span className="font-semibold text-[#003F3E] min-w-[24px] text-center">
                                {adults}
                              </span>
                              <button
                                type="button"
                                onClick={incrementAdults}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#003F3E] font-bold">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Trẻ em */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#003F3E]">
                              Trẻ em
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={decrementChildren}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#003F3E] font-bold">
                                  −
                                </span>
                              </button>
                              <span className="font-semibold text-[#003F3E] min-w-[24px] text-center">
                                {children}
                              </span>
                              <button
                                type="button"
                                onClick={incrementChildren}
                                className="w-8 h-8 rounded-full bg-[#E0F2F1] hover:bg-[#c8e6e3] flex items-center justify-center transition-colors"
                              >
                                <span className="text-[#003F3E] font-bold">
                                  +
                                </span>
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsPeopleExpanded(false)}
                            className="w-full py-2 bg-[#003F3E] text-white rounded-xl font-medium hover:bg-[#153a2f] transition-colors text-sm"
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
                  className="hidden md:block h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 4: "Ngân sách" - Mobile simplified */}
                <div className="flex-1 md:flex-[4.5] shrink-0 min-w-[150px] h-10 md:h-full flex items-center px-2 md:px-4 md:border-l md:border-gray-100 w-full md:w-auto border border-[#E0F2F1] md:border-none rounded-lg md:rounded-none">
                  <div className="relative w-full group">
                    <div className="flex items-center gap-1 md:gap-2">
                      {/* Icon ví tiền */}
                      <Wallet
                        size={14}
                        className="md:size-[18px] text-[#003F3E]/60 shrink-0"
                      />

                      <input
                        type="text"
                        placeholder={`Ngân sách/${totalPeople} người`}
                        value={formatNumber(budget)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const onlyNums = value.replace(/\D/g, "");
                          setBudget(onlyNums);
                        }}
                        className="w-full bg-transparent border-none outline-none font-medium placeholder-[#003F3E]/60 text-[#003F3E] text-xs md:text-base pr-8 md:pr-12 transition-all"
                      />
                    </div>

                    {/* Đơn vị tiền tệ - Cố định ở góc phải */}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs md:text-base font-medium text-[#003F3E] tracking-wider">
                      VND
                    </span>
                  </div>
                </div>

                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/line-4.png"
                  alt="|"
                  width={2}
                  height={40}
                  className="hidden md:block h-[60%] w-auto object-contain opacity-50"
                  unoptimized
                />

                {/* Section 5: "Phong cách du lịch" */}
                <div
                  className="flex-1 md:flex-[3] md:basis-0 h-10 md:h-full flex items-center justify-center px-2 relative w-full md:w-auto"
                  ref={styleDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                    className="w-full h-full flex items-center justify-center gap-1 md:gap-2 bg-transparent border border-[#E0F2F1] md:border-none rounded-lg md:rounded-none outline-none cursor-pointer group"
                  >
                    <Sparkles
                      size={14}
                      className="hidden md:block text-[#003F3E]/60 group-hover:text-[#003F3E] transition-colors flex-shrink-0"
                    />
                    <span
                      className={`font-medium text-xs md:text-sm lg:text-base truncate ${styleLabel
                        ? "text-[#003F3E]"
                        : "text-[#003F3E]/60"
                        }`}
                    >
                      {styleLabel || "Phong cách"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#003F3E]/60 transition-transform duration-200 flex-shrink-0 ${isStyleDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Style Dropdown */}
                  <AnimatePresence>
                    {isStyleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 md:left-auto md:right-auto mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-full md:w-56"
                      >
                        <div className="max-h-[280px] overflow-y-auto">
                          {travelStyles.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => handleSelectStyle(s)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#E0F2F1] transition-colors text-left ${style === s.value
                                ? "bg-[#E0F2F1] text-[#003F3E] font-semibold"
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

              </div>
            </div>

            {/* Rectangle 3 (Right Button) - Mobile: Below, Desktop: Right */}
            <div
              onClick={handleSearch}
              className="relative w-full md:w-[18%] min-w-[160px] h-10 md:h-[70%] flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform mt-2 md:mt-0"
            >
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/rectangle-3.png"
                alt="Background"
                fill
                className="object-fill pointer-events-none hidden md:block"
                unoptimized
              />
              {/* Mobile fallback background */}
              <div className="absolute inset-0 md:hidden bg-gradient-to-r from-[#1B4D3E] to-[#2C6E5A] rounded-lg" />
              {/* The Label/Icon */}
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/search-bar/tao-lich-trinh.png"
                alt="Tạo lịch trình"
                width={120}
                height={30}
                className="relative z-10 h-[60%] md:h-[25%] w-auto object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Portal for Warning Modal to ensure it covers Header */}
      {mounted && createPortal(
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-sans"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowError(false)}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#06424a]/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#E0F2F1] rounded-full blur-2xl" />

                <button
                  onClick={() => setShowError(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X size={20} className="text-gray-400" />
                </button>

                <div className="relative flex flex-col items-center text-center gap-4 pt-2">
                  <div className="w-16 h-16 rounded-full bg-[#E0F2F1] flex items-center justify-center mb-1">
                    <MapPin size={32} className="text-[#06424a]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#06424a]">
                      Chưa chọn điểm đến
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      Bạn cần chọn điểm đến trước khi lập lịch trình!
                    </p>
                    <p className="text-sm text-gray-500">
                      Vui lòng chọn một địa điểm từ danh sách để chúng tôi có thể gợi ý lịch trình phù hợp nhất cho bạn.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowError(false)}
                    className="w-full mt-4 py-3 bg-[#06424a] text-white rounded-xl font-semibold hover:bg-[#05363d] transition-all active:scale-[0.98] shadow-lg shadow-[#06424a]/20"
                  >
                    Đã hiểu
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
