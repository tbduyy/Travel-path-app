"use client";

import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripStepper from "@/components/ui/TripStepper";
import TripMetaBar from "@/components/TripMetaBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useTripStore } from "@/lib/store/trip-store";

function DemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand Store
  const {
    setStep,
    completeStep,
    destination: storeDestination,
    startDate: storeStartDate,
    endDate: storeEndDate,
    selectedPlaceIds: storePlaceIds,
    budget: storeBudget,
    activities: storeActivities,
  } = useTripStore();

  // Track current step on mount
  useEffect(() => {
    setStep("demo");
  }, [setStep]);

  // Params - fallback to store if not in URL
  const placeIds = searchParams.get("places")?.split(",") || storePlaceIds;
  const destination =
    searchParams.get("destination") || storeDestination || "Nha Trang";
  const startDateParam = searchParams.get("startDate") || storeStartDate;
  const endDateParam = searchParams.get("endDate") || storeEndDate;
  const budgetParam = searchParams.get("budget") || storeBudget;
  const placeCount = placeIds.length;

  // Derived Data & State
  const [showPaymentRequirementModal, setShowPaymentRequirementModal] =
    useState(false);
  const [daysUntilTrip, setDaysUntilTrip] = useState<number>(10); // Default safe buffer
  const [isSaving, setIsSaving] = useState(false);

  // Calculate duration string
  let durationString = "2N1Đ";
  if (startDateParam && endDateParam) {
    const start = new Date(startDateParam);
    const end = new Date(endDateParam);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      durationString = `${diffDays + 1}N${diffDays}Đ`;
    }
  }

  // Server Action Import (Dynamic to avoid build issues if not set up yet, but we just made it)
  // We'll import it at top level in real code, but here inside I'll add the import line or assume it's added.
  // Wait, I need to add the import to the top of the file.

  const saveTripToSupabase = async (redirectPath: string) => {
    setIsSaving(true);
    try {
      if (typeof window !== "undefined") {
        const savedActivities = localStorage.getItem("mytrip_activities");
        if (savedActivities) {
          const activities = JSON.parse(savedActivities);
          const { saveTrip } = await import("@/app/actions/trip");

          const result = await saveTrip({
            activities,
            destination,
            startDate: startDateParam || new Date().toISOString(),
            endDate: endDateParam || new Date().toISOString(),
            budget: budgetParam || "0",
          });

          if (result.success) {
            // Clear local storage after successful save?
            // Maybe keep it for backup or if user navigates back?
            // localStorage.removeItem('mytrip_activities');
            router.push(redirectPath);
          } else {
            alert("Có lỗi khi lưu lịch trình: " + result.error);
            setIsSaving(false); // Only stop if error, otherwise we redirect
          }
        } else {
          // No activities found, just redirect (fallback)
          router.push(redirectPath);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối");
      setIsSaving(false);
    }
  };

  const handleProceedToPayment = () => {
    completeStep("demo"); // Mark demo step as complete
    // Navigate using Zustand store - no URL params needed
    saveTripToSupabase(`/payment`);
  };

  const handleSkipPayment = () => {
    completeStep("demo"); // Mark demo step as complete
    // Navigate using Zustand store - no URL params needed
    saveTripToSupabase(`/my-journey`);
  };

  // Calculate days until trip
  useEffect(() => {
    if (startDateParam) {
      const start = new Date(startDateParam);
      const today = new Date();
      // Reset time part for accurate day diff
      start.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = start.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilTrip(diffDays);
    }
  }, [startDateParam]);

  const formattedBudget = budgetParam
    ? new Intl.NumberFormat("vi-VN").format(parseInt(budgetParam))
    : destination?.includes("Nha Trang")
      ? "2.500.000"
      : "8.000.000";

  const handleComplete = () => {
    // Show validation modal instead of direct checkout
    setShowPaymentRequirementModal(true);
  };

  const handleCancelTrip = () => {
    if (confirm("Bạn có chắc muốn hủy chuyến đi này không?")) {
      router.push("/plan-trip");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] overflow-hidden">
      <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
        <Header />
        <TripStepper />
      </div>

      {/* Payment Requirement Modal */}
      {showPaymentRequirementModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#F0FDFD] rounded-full flex items-center justify-center mb-6 text-[#1B4D3E] mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#1B4D3E] mb-3 text-center">
              Thanh toán dịch vụ
            </h3>

            {daysUntilTrip > 5 ? (
              <>
                <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
                  Để đảm bảo dịch vụ tốt nhất, bạn cần hoàn tất thanh toán trước
                  ngày khởi hành <strong>5 ngày</strong>.<br />
                  <br />
                  Hiện tại còn{" "}
                  <strong className="text-[#2E968C]">
                    {daysUntilTrip} ngày
                  </strong>{" "}
                  nữa mới đến ngày đi. Bạn có muốn thanh toán ngay bây giờ
                  không?
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#113D38] transition-colors shadow-lg"
                  >
                    Thanh toán ngay
                  </button>
                  <button
                    onClick={handleSkipPayment}
                    className="w-full py-3 bg-white text-[#1B4D3E] border-2 border-[#1B4D3E] rounded-xl font-bold hover:bg-[#1B4D3E]/5 transition-colors"
                  >
                    Tạm bỏ qua (Lưu vào My Journey)
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-red-600 text-sm mb-6 text-center leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100">
                  <strong>Chú ý:</strong> Thời gian đến ngày khởi hành chỉ còn{" "}
                  <strong>{daysUntilTrip} ngày</strong> (dưới 5 ngày).
                  <br />
                  Bạn <strong>bắt buộc phải thanh toán ngay</strong> để giữ chỗ
                  và lưu lịch trình này.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#113D38] transition-colors shadow-lg"
                  >
                    Thanh toán ngay để lưu Trip
                  </button>
                  <button
                    onClick={handleCancelTrip}
                    className="w-full py-3 bg-white text-red-500 border-2 border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors"
                  >
                    Hủy chuyến đi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 w-full max-w-[1500px] mx-auto p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-8">
        {/* Header Section (Matching trips page) */}
        <div className="flex flex-col mb-4 gap-6 shrink-0">
          {/* 1. Meta Info Row */}
          <TripMetaBar
            destination={destination}
            duration={durationString}
            placeCount={placeCount}
            budget={formattedBudget}
          />

          {/* Title Section */}
          <div className="flex items-center justify-between">
            {/* Title Badge - Tweaked for Demo Page Context */}
            <div className="bg-[#3C6E64] text-white px-8 py-3 rounded-2xl shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide">
                Mô phỏng lịch trình
              </h1>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-[#1B4D3E] font-bold hover:text-[#113D38] transition-colors p-3 rounded-xl border-2 border-[#1B4D3E]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
              <button className="bg-[#113D38] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#0D2F2B] shadow-sm transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
                <span>Lưu lịch trình</span>
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Video Placeholder */}
        <div className="w-full aspect-video bg-black/20 rounded-[32px] overflow-hidden relative shadow-2xl group cursor-pointer border-4 border-white/50">
          {/* Background Image (Static fallback) */}
          <Image
            src="/placeholder.jpg"
            alt="Background"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-2 border border-white/40 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h2 className="text-white text-3xl font-black mt-6 uppercase tracking-widest drop-shadow-lg">
              Xem mô phỏng chuyến đi
            </h2>
            <p className="text-white/80 mt-2 font-medium">
              Thời lượng ước tính: 1:30
            </p>
          </div>

          {/* Chatbot Icon Overlay */}
          <div className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-full shadow-xl border-4 border-[#41C7D6] overflow-hidden flex items-center justify-center">
            <Image
              src="/chatbot-icon.png"
              alt="Bot"
              fill
              className="object-cover scale-150 object-right"
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleComplete}
            className="bg-[#EF4444] text-white px-10 py-4 rounded-full font-black text-xl hover:bg-[#DC2626] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3"
          >
            <span>Hoàn thành</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoContent />
    </Suspense>
  );
}
