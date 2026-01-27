"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sun,
  Cloud,
  Moon,
  Clock,
  Banknote,
  Check,
  Loader2,
} from "lucide-react";

type Activity = {
  time?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  distance?: string | null;
  price?: string | null;
  type?: string | null;
};

type Period = {
  period: string;
  icon: string;
  activities: Activity[];
};

function PeriodIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "sun":
      return <Sun className="w-6 h-6 text-yellow-500" />;
    case "cloud":
      return <Cloud className="w-6 h-6 text-gray-400" />;
    case "moon":
      return <Moon className="w-6 h-6 text-indigo-400" />;
    default:
      return null;
  }
}

function TypeBadge({ type }: { type: string | null | undefined }) {
  if (!type) return null;
  const colors: Record<string, string> = {
    RESTAURANT: "bg-orange-100 text-orange-700",
    ATTRACTION: "bg-blue-100 text-blue-700",
    HOTEL: "bg-purple-100 text-purple-700",
  };
  const labels: Record<string, string> = {
    RESTAURANT: "Ẩm thực",
    ATTRACTION: "Tham quan",
    HOTEL: "Lưu trú",
  };
  return (
    <span
      className={`text-sm px-2 py-0.5 rounded-full font-medium ${
        colors[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[type] || type}
    </span>
  );
}

function parsePrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;

  // Handle price ranges (e.g., "600.000 - 900.000")
  if (priceStr.includes("-")) {
    const parts = priceStr.split("-");
    const prices = parts.map((part) => {
      // Find the first sequence of digits (possibly with dots)
      const match = part.match(/[\d.]+/);
      if (!match) return 0;
      // Remove dots to convert "600.000" -> "600000"
      const cleanStr = match[0].replace(/\./g, "");
      return parseInt(cleanStr, 10) || 0;
    });

    // Calculate average if we have 2 valid prices
    if (prices.length >= 2 && prices[0] > 0 && prices[1] > 0) {
      return (prices[0] + prices[1]) / 2;
    }
    // Fallback to the first found price if only one is valid
    return prices[0] || 0;
  }

  // Handle single price (e.g., "600.000 VND")
  const match = priceStr.match(/[\d.]+/);
  if (match) {
    const cleanStr = match[0].replace(/\./g, "");
    return parseInt(cleanStr, 10) || 0;
  }

  return 0;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString("vi-VN") + " VND";
}

export default function PaymentClient({
  itineraryData,
  exitUrl,
}: {
  itineraryData: Period[];
  exitUrl?: string;
}) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set(),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const finalExitUrl = exitUrl || "/";

  const processingMessages = [
    "Đang liên hệ với các đối tác để thanh toán...",
    "Đang xác minh thông tin thanh toán...",
    "Đang kết nối với cổng thanh toán...",
    "Đang xử lý giao dịch của bạn...",
    "Vui lòng không tắt trình duyệt...",
    "Đang hoàn tất thanh toán...",
  ];

  const currentMessage =
    processingMessages[
      Math.floor((20 - countdown) / 10) % processingMessages.length
    ];

  const handlePayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCountdown(20);
  }, []);

  // Payment countdown effect
  useEffect(() => {
    if (!isProcessing) return;

    if (countdown <= 0) {
      router.push("/farewell");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isProcessing, countdown, router]);

  // Calculate total price from selected activities
  const totalSelectedPrice = useMemo(() => {
    let total = 0;
    itineraryData.forEach((period, periodIdx) => {
      period.activities.forEach((activity, actIdx) => {
        const key = `${periodIdx}-${actIdx}`;
        if (selectedActivities.has(key)) {
          total += parsePrice(activity.price);
        }
      });
    });
    return total;
  }, [itineraryData, selectedActivities]);

  const toggleActivity = (periodIdx: number, actIdx: number) => {
    const key = `${periodIdx}-${actIdx}`;
    setSelectedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Native browser dialog for tab close / refresh / new URL
    // (Cannot show custom UI - browser security restriction)
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Bạn có chắc muốn rời trang?";
      return "Bạn có chắc muốn rời trang?";
    };

    // Intercept anchor clicks to block SPA navigation until confirmed
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // ignore hash/mailto/tel/external
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return; // external link - allow
      } catch {
        // invalid URL - allow
      }
      e.preventDefault();
      setPendingHref(href);
      setShowExitModal(true);
    };

    // Intercept browser back/forward button
    const onPopState = () => {
      // Push state back to prevent leaving, then show modal
      history.pushState(null, "", location.href);
      setPendingHref("/");
      setShowExitModal(true);
    };

    // Push initial state so popstate can detect back button
    history.pushState(null, "", location.href);

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F0F9F9]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black leading-9 tracking-tight text-[#1B4D3E] uppercase">
            Thanh toán
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-[#AF2323] leading-relaxed mx-auto">
            Vui lòng thanh toán booking trước ít nhất 5 ngày so với ngày khởi
            hành để giữ chỗ và trải nghiệm đầy đủ các tính năng nâng cao.{" "}
            <b>
              Sau thời hạn này, booking sẽ tự động hủy và hệ thống chỉ hỗ trợ
              lập lịch trình cơ bản.
            </b>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Trip Summary Timeline */}
          <div className="order-1 lg:order-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-semibold text-[#1B4D3E]">
                  Lịch trình
                </h3>
                <span className="text-base text-gray-500 font-semibold">
                  1 ngày
                </span>
              </div>

              <div className="space-y-6">
                {itineraryData.map((period, periodIdx) => (
                  <div key={periodIdx}>
                    <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#1B4D3E] px-3 py-1.5 rounded-full text-base font-semibold mb-4">
                      <PeriodIcon icon={period.icon} />
                      {period.period}
                    </div>

                    <div className="space-y-4 ml-2">
                      {period.activities.map((activity, actIdx) => {
                        const activityKey = `${periodIdx}-${actIdx}`;
                        const isSelected = selectedActivities.has(activityKey);

                        return (
                          <div key={actIdx} className="relative mb-8">
                            <div className="pl-4 border-l-2 border-[#2E968C]">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm text-gray-500 font-medium">
                                  {activity.time}
                                </p>
                                <TypeBadge type={activity.type} />
                              </div>
                              <p className="text-base font-semibold text-[#1B4D3E] mb-1">
                                {activity.title}
                              </p>
                              {activity.description && (
                                <p className="text-sm text-gray-400 mb-2 font-medium">
                                  {activity.description}
                                </p>
                              )}

                              {activity.image && (
                                <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                                  <Image
                                    src={activity.image}
                                    alt={activity.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}

                              {/* Price and Toggle Selection */}
                              {activity.price && (
                                <div className="flex items-center justify-between mt-3 mb-2">
                                  <div className="flex items-center gap-1 text-sm text-emerald-600 font-semibold">
                                    <Banknote className="w-4 h-4" />
                                    {activity.price}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleActivity(periodIdx, actIdx)
                                    }
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                      isSelected
                                        ? "bg-[#1B4D3E] text-white"
                                        : "bg-[#E8F5E9] text-[#1B4D3E] hover:bg-[#D0EBD0]"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check className="w-4 h-4" />
                                    )}
                                    {isSelected ? "Đã chọn" : "Book chỗ này"}
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2 ml-4">
                              <span className="inline-flex items-center gap-1 bg-[#E0F2F1] text-[#1B4D3E] px-3 py-1 rounded-full text-sm font-semibold">
                                <Clock className="w-3 h-3" />
                                {activity.distance}
                              </span>
                              <button className="inline-flex items-center gap-1 border border-[#2E968C] text-[#2E968C] px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#E0F2F1] transition-colors">
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="order-2 lg:order-2">
            <form className="space-y-6 bg-white p-6 rounded-2xl shadow-sm sticky top-32">
              <div>
                <label className="block text-sm font-medium leading-6 text-[#1B4D3E]">
                  Phương thức thanh toán
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="card"
                      name="payment-method"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-[#2E968C] focus:ring-[#2E968C] border-gray-300"
                      onChange={() => setPaymentMethod("card")}
                    />
                    <label
                      htmlFor="card"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Thẻ tín dụng/ghi nợ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="momo"
                      name="payment-method"
                      type="radio"
                      className="h-4 w-4 text-[#2E968C] focus:ring-[#2E968C] border-gray-300"
                      onChange={() => setPaymentMethod("momo")}
                    />
                    <label
                      htmlFor="momo"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Thanh toán MoMo
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {paymentMethod === "card" ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                      <label className="block text-sm font-medium text-[#1B4D3E]">
                        Số thẻ
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#2E968C] sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#2E968C] sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-[#2E968C] sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-4 animate-in zoom-in-95 duration-300">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#A50064] px-3 py-4 text-white hover:bg-[#82004F] transition-all shadow-md"
                    >
                      <span className="font-bold">Thanh toán với MoMo</span>
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2 italic">
                      Hệ thống sẽ chuyển hướng bạn sang đối tác MoMo để xác nhận
                      thanh toán.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-lg font-bold text-[#1B4D3E]">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalSelectedPrice)}</span>
                </div>
              </div>

              <div className="mt-6">
                {paymentMethod === "card" && (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex w-full justify-center rounded-md bg-[#1B4D3E] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2E968C] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Thanh toán ngay
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Exit modal - customizable content/design */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-[#1B4D3E] mb-2">
              Lưu ý!
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng thanh toán booking trước ít nhất 5 ngày so với ngày khởi
              hành để giữ chỗ và trải nghiệm đầy đủ các tính năng nâng cao.{" "}
              <b>
                Sau thời hạn này, booking sẽ tự động hủy và hệ thống chỉ hỗ trợ
                lập lịch trình cơ bản.
              </b>
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  const target = pendingHref
                    ? new URL(pendingHref, window.location.href).toString()
                    : finalExitUrl;
                  window.location.href = target;
                }}
                className="px-4 py-2 rounded-md bg-[#1B4D3E] text-white text-sm"
              >
                Tôi hiểu!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div className="text-center text-white">
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-[#2E968C]" />
            <p className="text-xl font-semibold mb-4 animate-pulse">
              {currentMessage}
            </p>
            <div className="w-64 h-2 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden">
              <div
                className="h-full bg-[#2E968C] rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((20 - countdown) / 20) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-300">
              Thời gian còn lại:{" "}
              <span className="font-bold text-white">{countdown}s</span>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
