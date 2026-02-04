"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripMetaBar from "@/components/TripMetaBar";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlacesByIds } from "@/app/actions/search";
import { useTripStore, type ActivitiesMap } from "@/lib/store/trip-store";
import { useShallow } from "zustand/react/shallow";
import { Loader2, Check, CreditCard, Wallet, QrCode, Tag, ChevronDown, ChevronUp, X, Gift, Percent, Sparkles, Ticket } from "lucide-react";
import {
  useAuth,
  useRequireAuthFromContext,
} from "@/lib/context/AuthContext";
import {
  AuthRequiredPopup,
  AuthLoadingScreen,
} from "@/lib/hooks/useRequireAuth";
import { exportTripToPDF } from "@/lib/export-pdf";
import { sendTripConfirmationEmail } from "@/app/actions/email";
import { 
  getPrefetchedPaymentData, 
  clearPrefetchedPaymentData 
} from "@/lib/utils/prefetch-payment";

// Voucher Types and Data
interface Voucher {
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number; // For percentage discounts
  minOrderValue?: number; // Minimum order value to apply
  icon: "gift" | "percent" | "sparkles" | "ticket" | "tag";
  color: string; // Tailwind color class
}

// Mock vouchers data
const VOUCHERS: Voucher[] = [
  {
    code: "BANMOI",
    name: "BANMOI",
    description: "Giảm 20% cho đơn hàng đầu tiên",
    discountType: "percentage",
    discountValue: 20,
    icon: "gift",
    color: "bg-red-500",
  },
  {
    code: "HANHTRINHVUI",
    name: "HANHTRINHVUI",
    description: "Giảm 15% tối đa 300K",
    discountType: "percentage",
    discountValue: 15,
    maxDiscount: 300000,
    icon: "sparkles",
    color: "bg-purple-500",
  },
  {
    code: "MUNGXUAN26",
    name: "MUNGXUAN26",
    description: "Giảm 100.000đ cho đơn từ 1 triệu",
    discountType: "fixed",
    discountValue: 100000,
    minOrderValue: 1000000,
    icon: "ticket",
    color: "bg-orange-500",
  },
  {
    code: "FREESHIP",
    name: "FREESHIP",
    description: "Miễn phí dịch vụ đặt chỗ",
    discountType: "fixed",
    discountValue: 50000,
    icon: "tag",
    color: "bg-blue-500",
  },
  {
    code: "SUMMER2026",
    name: "SUMMER2026",
    description: "Giảm 10% mùa hè 2026",
    discountType: "percentage",
    discountValue: 10,
    icon: "percent",
    color: "bg-yellow-500",
  },
  {
    code: "NEWUSER",
    name: "NEWUSER",
    description: "Giảm 50.000đ cho người dùng mới",
    discountType: "fixed",
    discountValue: 50000,
    icon: "gift",
    color: "bg-green-500",
  },
];

// Helper to get icon component
function VoucherIcon({ icon, className }: { icon: Voucher["icon"]; className?: string }) {
  switch (icon) {
    case "gift":
      return <Gift className={className} />;
    case "percent":
      return <Percent className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "ticket":
      return <Ticket className={className} />;
    case "tag":
      return <Tag className={className} />;
    default:
      return <Tag className={className} />;
  }
}

// Calculate discount amount based on voucher
function calculateDiscount(voucher: Voucher | null, subtotal: number): number {
  if (!voucher) return 0;
  
  // Check minimum order value
  if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
    return 0;
  }
  
  if (voucher.discountType === "percentage") {
    let discount = (subtotal * voucher.discountValue) / 100;
    // Apply max discount cap if exists
    if (voucher.maxDiscount && discount > voucher.maxDiscount) {
      discount = voucher.maxDiscount;
    }
    return Math.round(discount);
  } else {
    // Fixed discount
    return Math.min(voucher.discountValue, subtotal);
  }
}

// Types
interface PlaceData {
  id: string;
  name: string;
  description?: string;
  type: string;
  rating?: number;
  address?: string;
  image: string;
  price?: string;
  duration?: string;
  priceLevel?: string;
  lat?: number;
  lng?: number;
  metadata?: any;
}

// Helper to parse price variations
const parsePrice = (priceStr?: string): number => {
  if (!priceStr) return 0;
  if (
    priceStr.toLowerCase().includes("miễn phí") ||
    priceStr.toLowerCase().includes("free")
  )
    return 0;
  let clean = priceStr.toLowerCase();
  if (clean.includes("-")) {
    clean = clean.split("-")[0];
  }
  clean = clean.replace(/[^0-9k]/g, "");
  if (clean.endsWith("k")) {
    return parseInt(clean.replace("k", "")) * 1000;
  }
  return parseInt(clean) || 0;
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Protected Route - uses shared AuthContext (no duplicate auth calls!)
  const {
    isLoading: authLoading,
    isAuthenticated,
    showAuthPopup,
  } = useRequireAuthFromContext();
  
  // Get user info from shared AuthContext (no extra server action call!)
  const { userEmail, userName } = useAuth();

  // Zustand Store - SINGLE subscription with useShallow to prevent re-renders
  // Previously: 9 separate subscriptions causing multiple re-renders
  const {
    selectedPlaceIds,
    selectedHotelId,
    destination: storeDestination,
    startDate: storeStartDate,
    endDate: storeEndDate,
    people: storePeople,
    activities: storeActivities,
    clearTrip,
    budget: storeBudget,
  } = useTripStore(
    useShallow((state) => ({
      selectedPlaceIds: state.selectedPlaceIds,
      selectedHotelId: state.selectedHotelId,
      destination: state.destination,
      startDate: state.startDate,
      endDate: state.endDate,
      people: state.people,
      activities: state.activities,
      clearTrip: state.clearTrip,
      budget: state.budget,
    }))
  );

  // State for fetched data
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<PlaceData | null>(null);
  const [selectedAttractions, setSelectedAttractions] = useState<PlaceData[]>(
    [],
  );
  const budgetParam = searchParams.get("budget") || storeBudget;

  // Selection state - which items user wants to pay for
  // Key format: "hotel" or "attraction-{id}"
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Voucher state
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);

  // Auto-apply BANMOI voucher on mount
  useEffect(() => {
    const banmoiVoucher = VOUCHERS.find((v) => v.code === "BANMOI");
    if (banmoiVoucher) {
      setSelectedVoucher(banmoiVoucher);
    }
  }, []);

  // Toggle selection for an item
  const toggleItemSelection = useCallback((key: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("momo");

  // Payment processing state (20s delay logic)
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [emailStatus, setEmailStatus] = useState<
    "pending" | "sending" | "sent" | "failed"
  >("pending");

  // User info is now from AuthContext - no server action call needed!
  const userInfo = { email: userEmail, name: userName };

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

  // 1. Params - prioritize store, fallback to URL
  const placeIds =
    selectedPlaceIds.length > 0
      ? selectedPlaceIds
      : searchParams.get("places")?.split(",").filter(Boolean) || [];
  const hotelId = selectedHotelId || searchParams.get("hotel");
  const destination =
    storeDestination || searchParams.get("destination") || "Điểm đến";
  const startDateParam = storeStartDate || searchParams.get("startDate");
  const endDateParam = storeEndDate || searchParams.get("endDate");
  const peopleParam = searchParams.get("people");
  const peopleCount = storePeople || (peopleParam ? parseInt(peopleParam) : 2);

  // Memoize placeIds key to prevent unnecessary useEffect re-runs
  const placeIdsKey = placeIds.join(",");

  // 2. Derive Duration
  let durationString = "2N1Đ";
  let nights = 1;
  let days = 2;

  if (startDateParam && endDateParam) {
    const start = new Date(startDateParam);
    const end = new Date(endDateParam);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      nights = diffDays;
      days = diffDays + 1;
      durationString = `${days}N${nights}Đ`;
    }
  }

  // 3. Fetch data on mount - USE PREFETCHED DATA IF AVAILABLE
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // PERFORMANCE: Check for prefetched data first (set by demo page before navigation)
        const prefetched = getPrefetchedPaymentData();
        
        if (prefetched) {
          console.log("[Payment] Using prefetched data - INSTANT load");
          const hotel = prefetched.hotelData;
          const attractions = prefetched.attractionsData.filter(
            (p: PlaceData) =>
              placeIds.includes(p.id) &&
              p.type !== "RESTAURANT" &&
              p.type !== "HOTEL",
          );
          setSelectedHotel(hotel || null);
          setSelectedAttractions(attractions);
          clearPrefetchedPaymentData(); // Clear after use
          setLoading(false);
          return;
        }

        // FALLBACK: Fetch from server if no prefetched data
        console.log("[Payment] No prefetch, fetching from server");
        const allIds = [...placeIds];
        if (hotelId) allIds.push(hotelId);

        if (allIds.length === 0) {
          setLoading(false);
          return;
        }

        const result = await getPlacesByIds(allIds);

        if (result.success && result.data) {
          const places = result.data as PlaceData[];
          const hotel = places.find(
            (p) => p.id === hotelId && p.type === "HOTEL",
          );
          const attractions = places.filter(
            (p) =>
              placeIds.includes(p.id) &&
              p.type !== "RESTAURANT" &&
              p.type !== "HOTEL",
          );
          setSelectedHotel(hotel || null);
          setSelectedAttractions(attractions);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [placeIdsKey, hotelId]);

  // 4. Payment countdown effect - redirect to /farewell after 20s + send email
  useEffect(() => {
    if (!isProcessing) return;

    if (countdown <= 0) {
      // Send email with PDF before redirecting
      const sendEmailWithPDF = async () => {
        if (!userInfo.email) {
          console.log("No user email, skipping email send");
          clearTrip();
          router.push("/farewell");
          return;
        }

        setEmailStatus("sending");

        try {
          // Generate PDF
          const pdfBlob = await exportTripToPDF({
            destination: destination,
            startDate: startDateParam,
            endDate: endDateParam,
            duration: durationString,
            budget: formattedBudget_forPDF,
            people: peopleCount,
            activities: storeActivities as ActivitiesMap,
            hotelData: selectedHotel,
          });

          // Convert blob to base64
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

          // Format dates for email
          const formatDate = (dateStr: string | null) => {
            if (!dateStr) return "Chưa xác định";
            return new Date(dateStr).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          };

          // Send email
          const result = await sendTripConfirmationEmail({
            to: userInfo.email,
            userName: userInfo.name || "Quý khách",
            destination: destination,
            startDate: formatDate(startDateParam),
            endDate: formatDate(endDateParam),
            duration: durationString,
            totalAmount: new Intl.NumberFormat("vi-VN").format(grandTotal),
            hotelName: selectedHotel?.name,
            attractionsCount: selectedAttractions.filter((a) =>
              selectedItems.has(`attraction-${a.id}`),
            ).length,
            pdfBase64,
            pdfFilename: `Lich-trinh-${destination.replace(/\s+/g, "-")}.pdf`,
          });

          if (result.success) {
            setEmailStatus("sent");
            console.log("Email sent successfully!");
          } else {
            setEmailStatus("failed");
            console.error("Email failed:", result.error);
          }
        } catch (error) {
          console.error("Error sending email:", error);
          setEmailStatus("failed");
        }

        // Clear and redirect regardless of email status
        clearTrip();
        router.push("/farewell");
      };

      sendEmailWithPDF();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, countdown, router]);

  // 5. Calculate prices - ONLY for selected items
  const hotelPrice = parsePrice(selectedHotel?.price);
  const hotelTotal = hotelPrice * nights;
  const isHotelSelected = selectedItems.has("hotel");

  const attractionCosts = selectedAttractions.map((p) => ({
    ...p,
    unitPrice: parsePrice(p.price),
    total: parsePrice(p.price) * peopleCount,
    isSelected: selectedItems.has(`attraction-${p.id}`),
  }));

  // Only sum selected items
  const selectedHotelTotal = isHotelSelected ? hotelTotal : 0;
  const selectedAttractionsTotal = attractionCosts
    .filter((item) => item.isSelected)
    .reduce((acc, curr) => acc + curr.total, 0);
  
  // Subtotal before discount (always calculated for voucher preview)
  const subtotalBeforeDiscount = hotelTotal + attractionCosts.reduce((acc, curr) => acc + curr.total, 0);
  
  // Calculate discount based on selected voucher (applies to ALL items, not just selected)
  const discountAmount = calculateDiscount(selectedVoucher, subtotalBeforeDiscount);
  
  // Discount percentage for display on items
  const discountPercentage = selectedVoucher?.discountType === "percentage" ? selectedVoucher.discountValue : 0;
  
  // Calculate discounted prices for individual items (for display)
  const getDiscountedPrice = (originalPrice: number): number => {
    if (!selectedVoucher || subtotalBeforeDiscount === 0) return originalPrice;
    // Calculate proportional discount for this item
    const itemRatio = originalPrice / subtotalBeforeDiscount;
    const itemDiscount = Math.round(discountAmount * itemRatio);
    return originalPrice - itemDiscount;
  };
  
  // Grand total = selected items subtotal - discount applied to selected portion
  const selectedSubtotal = selectedHotelTotal + selectedAttractionsTotal;
  const selectedDiscountAmount = calculateDiscount(selectedVoucher, selectedSubtotal);
  const grandTotal = selectedSubtotal - selectedDiscountAmount;
  
  const formattedBudget_forPDF = new Intl.NumberFormat("vi-VN").format(grandTotal);

  // Count selected items
  const selectedCount = selectedItems.size;

  // 6. Handle Payment - starts 20s countdown
  const handlePay = useCallback(() => {
    if (selectedCount === 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ để thanh toán!");
      return;
    }
    setIsProcessing(true);
    setCountdown(20);
  }, [selectedCount]);

  // Auth loading state - only while actually checking auth
  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  // Not authenticated - show popup and redirect (hook handles redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BBD9D9]">
        <AuthRequiredPopup show={true} />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9]">
        <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1B4D3E]/30 border-t-[#1B4D3E] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-[#1B4D3E]/70">
              Đang tải thông tin thanh toán...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!selectedHotel && selectedAttractions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9]">
        <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">
              Nơi này hơi trống trải...
            </h2>
            <p className="text-[#1B4D3E]/70 mb-6">
              Bạn chưa chọn địa điểm hoặc khách sạn nào. Hãy quay lại để chọn
              các hoạt động cho chuyến đi của bạn.
            </p>
            <button
              onClick={() => router.push("/plan-trip")}
              className="px-6 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#2E968C] transition-colors"
            >
              Bắt đầu lên kế hoạch
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing state - 20s countdown overlay
  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9]">
        <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
            {emailStatus === "sending" ? (
              <>
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-2xl font-bold mb-2 text-[#1B4D3E]">
                  Đang gửi email xác nhận
                </h2>
                <p className="text-[#1B4D3E]/70 mb-4">
                  Lịch trình PDF đang được gửi đến {userInfo.email}
                </p>
                <Loader2 className="w-8 h-8 animate-spin text-[#2E968C] mx-auto" />
              </>
            ) : (
              <>
                <Loader2 className="w-16 h-16 animate-spin text-[#2E968C] mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-2 text-[#1B4D3E]">
                  Đang xử lý thanh toán
                </h2>
                <p className="text-[#1B4D3E]/70 mb-4">{currentMessage}</p>
                <div className="text-5xl font-black text-[#2E968C] mb-4">
                  {countdown}s
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-[#2E968C] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                  ></div>
                </div>
                {userInfo.email && (
                  <p className="text-xs text-[#2E968C] mb-2">
                    📧 Email xác nhận sẽ được gửi đến: {userInfo.email}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Vui lòng không đóng trang này
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9] overflow-hidden">
      <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
        <Header />
      </div>

      <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 pb-24 flex flex-col gap-8">
        {/* Meta Bar */}
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-sm">
          <TripMetaBar
            destination={destination}
            duration={durationString}
            placeCount={placeIds.length}
            budget={new Intl.NumberFormat("vi-VN").format(parseInt(budgetParam || "0") - grandTotal)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Summary Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h1 className="text-3xl font-black uppercase tracking-wide">
              Chi tiết thanh toán
            </h1>

            {/* Hotel Section */}
            {selectedHotel && (
              <div
                className={`bg-white p-6 rounded-[24px] shadow-sm transition-all relative ${isHotelSelected ? "ring-2 ring-[#2E968C]" : ""}`}
              >
                {/* Discount Badge */}
                {selectedVoucher && discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    -{discountPercentage}%
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏨</span> Lưu trú ({nights} đêm)
                </h3>
                <div className="flex gap-4 items-start border-b border-gray-100 pb-4 mb-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                    {selectedHotel.image && (
                      <Image
                        src={selectedHotel.image}
                        alt={selectedHotel.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{selectedHotel.name}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedHotel.address}
                    </p>
                    <div className="mt-2 text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-lg inline-block font-medium">
                      {selectedHotel.price || "Liên hệ"}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    {/* Show original price with strikethrough if discount */}
                    {selectedVoucher && discountAmount > 0 && (
                      <div className="text-sm text-gray-400 line-through">
                        {new Intl.NumberFormat("vi-VN").format(hotelTotal)} ₫
                      </div>
                    )}
                    <div className="font-bold text-xl text-[#2E968C]">
                      {new Intl.NumberFormat("vi-VN").format(getDiscountedPrice(hotelTotal))} ₫
                    </div>
                    <div className="text-xs text-gray-400">x {nights} đêm</div>
                    <button
                      type="button"
                      onClick={() => toggleItemSelection("hotel")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 mt-2 ${
                        isHotelSelected
                          ? "bg-[#1B4D3E] text-white"
                          : "bg-[#E8F5E9] text-[#1B4D3E] hover:bg-[#D0EBD0]"
                      }`}
                    >
                      {isHotelSelected && <Check className="w-4 h-4" />}
                      {isHotelSelected ? "Đã chọn" : "Chọn chỗ này"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Attractions Section */}
            {attractionCosts.length > 0 && (
              <div className="bg-white p-6 rounded-[24px] shadow-sm relative">
                {/* Discount Badge */}
                {selectedVoucher && discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    -{discountPercentage}%
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎡</span> Hoạt động ({peopleCount}{" "}
                  người)
                </h3>
                <div className="space-y-4">
                  {attractionCosts.map((item) => {
                    const itemKey = `attraction-${item.id}`;
                    const isItemSelected = selectedItems.has(itemKey);
                    const itemDiscountedPrice = getDiscountedPrice(item.total);
                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 items-center p-3 rounded-xl transition-all ${
                          isItemSelected
                            ? "bg-[#E8F5E9] ring-2 ring-[#2E968C]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base">{item.name}</h4>
                          <p className="text-xs text-gray-400">
                            {item.price || "Miễn phí"}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          {item.total > 0 ? (
                            <>
                              {/* Show original price with strikethrough if discount */}
                              {selectedVoucher && discountAmount > 0 && (
                                <div className="text-sm text-gray-400 line-through">
                                  {new Intl.NumberFormat("vi-VN").format(item.total)} ₫
                                </div>
                              )}
                              <div className="font-bold text-xl text-[#2E968C]">
                                {new Intl.NumberFormat("vi-VN").format(itemDiscountedPrice)} ₫
                              </div>
                              <div className="text-xs text-gray-400">
                                x {peopleCount} người
                              </div>
                            </>
                          ) : (
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">
                              Miễn phí
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleItemSelection(itemKey)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                              isItemSelected
                                ? "bg-[#1B4D3E] text-white"
                                : "bg-[#E8F5E9] text-[#1B4D3E] hover:bg-[#D0EBD0]"
                            }`}
                          >
                            {isItemSelected && <Check className="w-3 h-3" />}
                            {isItemSelected ? "Đã chọn" : "Thêm vào"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Total Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1B4D3E] text-white p-8 rounded-[32px] shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-2 opacity-90">Thanh toán</h3>
              <p className="text-sm opacity-60 mb-6">
                Đã chọn: {selectedCount} /{" "}
                {(selectedHotel ? 1 : 0) + attractionCosts.length} mục
              </p>

              <div className="space-y-4 mb-6">
                {selectedHotel && isHotelSelected && (
                  <div className="flex justify-between items-center text-white/80">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      Lưu trú
                    </span>
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(isHotelSelected ? getDiscountedPrice(hotelTotal) : hotelTotal)} ₫
                    </span>
                  </div>
                )}
                {attractionCosts.filter((item) =>
                  selectedItems.has(`attraction-${item.id}`),
                ).length > 0 && (
                  <div className="flex justify-between items-center text-white/80">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      Vé tham quan (
                      {
                        attractionCosts.filter((item) =>
                          selectedItems.has(`attraction-${item.id}`),
                        ).length
                      }
                      )
                    </span>
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        selectedAttractionsTotal - (selectedVoucher ? calculateDiscount(selectedVoucher, selectedAttractionsTotal) : 0),
                      )}{" "}
                      ₫
                    </span>
                  </div>
                )}
                {selectedCount === 0 && (
                  <p className="text-white/50 text-sm text-center py-4">
                    Chưa chọn dịch vụ nào
                  </p>
                )}
                <div className="flex justify-between items-center text-white/80">
                  <span>Phí dịch vụ</span>
                  <span>0 ₫</span>
                </div>
              </div>

              {/* Voucher Section */}
              <div className="mb-6">
                <div 
                  className="flex items-center gap-2 cursor-pointer mb-3"
                  onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
                >
                  <Tag className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-sm text-white/90">Mã giảm giá</span>
                  {showVoucherDropdown ? (
                    <ChevronUp className="w-4 h-4 text-white/60 ml-auto" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/60 ml-auto" />
                  )}
                </div>

                {/* Selected Voucher Display */}
                {selectedVoucher && (
                  <div className="bg-[#2E968C] rounded-xl p-3 mb-3 flex items-center gap-3">
                    <div className={`w-10 h-10 ${selectedVoucher.color} rounded-lg flex items-center justify-center`}>
                      <VoucherIcon icon={selectedVoucher.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{selectedVoucher.code}</p>
                      <p className="text-xs text-white/70">{selectedVoucher.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVoucher(null);
                      }}
                      className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Voucher Dropdown */}
                {showVoucherDropdown && (
                  <div className="bg-white/10 rounded-xl overflow-hidden">
                    <p className="text-xs text-white/60 px-3 py-2 border-b border-white/10">
                      Chọn voucher có sẵn ({VOUCHERS.length})
                    </p>
                    <div className="max-h-48 overflow-y-auto">
                      {VOUCHERS.map((voucher) => {
                        const isSelected = selectedVoucher?.code === voucher.code;
                        const isDisabled = voucher.minOrderValue && subtotalBeforeDiscount < voucher.minOrderValue;
                        
                        return (
                          <button
                            key={voucher.code}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedVoucher(isSelected ? null : voucher);
                              }
                            }}
                            className={`w-full flex items-center gap-3 p-3 transition-all border-b border-white/5 last:border-0 ${
                              isSelected 
                                ? "bg-[#2E968C]" 
                                : isDisabled 
                                  ? "opacity-50 cursor-not-allowed" 
                                  : "hover:bg-white/5"
                            }`}
                          >
                            <div className={`w-9 h-9 ${voucher.color} rounded-lg flex items-center justify-center shrink-0`}>
                              <VoucherIcon icon={voucher.icon} className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-bold text-sm">{voucher.code}</p>
                              <p className="text-xs text-white/60">{voucher.description}</p>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-green-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Display */}
              {selectedVoucher && selectedDiscountAmount > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center text-green-400">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Giảm giá ({selectedVoucher.code})
                    </span>
                    <span>-{new Intl.NumberFormat("vi-VN").format(selectedDiscountAmount)} ₫</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-white/20 my-4"></div>
              <div className="flex justify-between items-center text-2xl font-black mb-6">
                <span>Tổng</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(grandTotal)} ₫
                </span>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-sm mb-3">
                  Phương thức thanh toán
                </h4>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      paymentMethod === "momo"
                        ? "bg-white text-[#A50064] border-[#A50064]"
                        : "bg-transparent border-white/20 text-white/70 hover:bg-white/5"
                    }`}
                    onClick={() => setPaymentMethod("momo")}
                  >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                      {paymentMethod === "momo" && (
                        <div className="w-3 h-3 rounded-full bg-[#A50064]" />
                      )}
                    </div>
                    <Wallet className="w-5 h-5" />
                    <span className="font-bold text-sm">Ví MoMo</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      paymentMethod === "vnpay"
                        ? "bg-white text-[#005BAA] border-[#005BAA]"
                        : "bg-transparent border-white/20 text-white/70 hover:bg-white/5"
                    }`}
                    onClick={() => setPaymentMethod("vnpay")}
                  >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                      {paymentMethod === "vnpay" && (
                        <div className="w-3 h-3 rounded-full bg-[#005BAA]" />
                      )}
                    </div>
                    <QrCode className="w-5 h-5" />
                    <span className="font-bold text-sm">VNPay QR</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      paymentMethod === "card"
                        ? "bg-white text-[#1B4D3E] border-[#1B4D3E]"
                        : "bg-transparent border-white/20 text-white/70 hover:bg-white/5"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                      {paymentMethod === "card" && (
                        <div className="w-3 h-3 rounded-full bg-[#1B4D3E]" />
                      )}
                    </div>
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-sm">Thẻ Quốc tế</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={selectedCount === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${
                  selectedCount === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#EF4444] hover:bg-[#DC2626] hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                {selectedCount === 0
                  ? "Vui lòng chọn dịch vụ"
                  : paymentMethod === "momo"
                    ? "Thanh toán qua MoMo"
                    : paymentMethod === "vnpay"
                      ? "Thanh toán qua VNPay"
                      : "Thanh toán ngay"}
              </button>

              <p className="text-center text-xs mt-4 opacity-60">
                Thanh toán an toàn và bảo mật bởi TravelPath Secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#BBD9D9]">
          <div className="w-12 h-12 border-4 border-[#1B4D3E]/30 border-t-[#1B4D3E] rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
