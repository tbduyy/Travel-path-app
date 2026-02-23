"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import TripMetaBar from "@/components/TripMetaBar";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlacesByIds } from "@/app/actions/search";
import { useTripStore, type ActivitiesMap } from "@/lib/store/trip-store";
import { useShallow } from "zustand/react/shallow";
import { Loader2, Check, CreditCard, Wallet, QrCode } from "lucide-react";
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
import { savePaymentRecord } from "@/lib/utils/payment-history";

// Types
interface PlaceData {
  id: string;
  name: string;
  description?: string;
  type: string;
  rating?: number;
  address?: string;
  image?: string; // Optional separate field
  images?: string[]; // New array field
  price?: string;
  duration?: string;
  priceLevel?: string;
  lat?: number;
  lng?: number;
  metadata?: any;
}

interface Voucher {
  code: string;
  name: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  value: number;
  maxDiscount?: number;
  minOrder?: number;
  color: string;
}

const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: "HANHTRINHVUI",
    name: "HANHTRINHVUI",
    description: "Giảm 15% tối đa 300K",
    discountType: "PERCENT",
    value: 15,
    maxDiscount: 300000,
    color: "bg-purple-100 text-purple-700",
  },
  {
    code: "BANMOI",
    name: "BANMOI",
    description: "Giảm 20% cho đơn hàng đầu tiên",
    discountType: "PERCENT",
    value: 20,
    maxDiscount: 200000,
    minOrder: 0,
    color: "bg-red-100 text-red-700",
  },
  {
    code: "MUNGXUAN26",
    name: "MUNGXUAN26",
    description: "Giảm 100K cho đơn từ 1 triệu",
    discountType: "FIXED",
    value: 100000,
    minOrder: 1000000,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    code: "FREESHIP",
    name: "FREESHIP",
    description: "Miễn phí dịch vụ",
    discountType: "FIXED",
    value: 50000,
    color: "bg-blue-100 text-blue-700",
  },
];

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

  // VOUCHER STATE
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Auto-apply "HANHTRINHVUI" on enter
  useEffect(() => {
    const defaultVoucher = AVAILABLE_VOUCHERS.find(v => v.code === "HANHTRINHVUI");
    if (defaultVoucher) setSelectedVoucher(defaultVoucher);
  }, []);

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
          // Transform data to support new schema if needed
          const transformPlace = (p: any): PlaceData => ({
            ...p,
            image: p.images?.[0] || p.image || "/placeholder.jpg",
          });

          const hotel = places.find(
            (p) => p.id === hotelId && p.type === "HOTEL",
          );
          const attractions = places
            .filter(
              (p) =>
                placeIds.includes(p.id) &&
                p.type !== "RESTAURANT" &&
                p.type !== "HOTEL",
            )
            .map(transformPlace);

          setSelectedHotel(hotel ? transformPlace(hotel) : null);
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
        // Save payment record to localStorage for history
        try {
          savePaymentRecord({
            destination,
            startDate: startDateParam,
            endDate: endDateParam,
            duration: durationString,
            people: peopleCount,
            paymentMethod,
            voucher: selectedVoucher?.code || null,
            discountAmount,
            subTotal,
            grandTotal,
            hotel: selectedHotel && isHotelSelected ? {
              name: selectedHotel.name,
              price: selectedHotel.price || "",
              nights,
              total: hotelTotal,
              image: selectedHotel.images?.[0] || (selectedHotel as any).image,
              address: selectedHotel.address,
            } : null,
            attractions: attractionCosts
              .filter(a => a.isSelected)
              .map(a => ({
                name: a.name,
                price: a.price || "",
                unitPrice: a.unitPrice,
                total: a.total,
                image: a.images?.[0] || (a as any).image,
              })),
            userEmail: userInfo.email || null,
          });
          console.log("Payment record saved to history");
        } catch (e) {
          console.error("Failed to save payment history:", e);
        }

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

  const subTotal = selectedHotelTotal + selectedAttractionsTotal;

  // Calculate Discount
  let discountAmount = 0;
  if (selectedVoucher && subTotal >= (selectedVoucher.minOrder || 0)) {
    if (selectedVoucher.discountType === "PERCENT") {
      discountAmount = (subTotal * selectedVoucher.value) / 100;
      if (selectedVoucher.maxDiscount && discountAmount > selectedVoucher.maxDiscount) {
        discountAmount = selectedVoucher.maxDiscount;
      }
    } else {
      discountAmount = selectedVoucher.value;
    }
  }

  const grandTotal = Math.max(0, subTotal - discountAmount);
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
            <button
              onClick={() => router.push("/payment-history")}
              className="flex items-center gap-2 mx-auto mt-4 px-4 py-2 bg-white/60 hover:bg-white text-[#1B4D3E] rounded-full text-sm font-bold transition-all border border-[#1B4D3E]/10 hover:border-[#1B4D3E]/30 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M12 7v5l4 2"/>
              </svg>
              Lịch sử thanh toán
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black uppercase tracking-wide">
                Chi tiết thanh toán
              </h1>
              <button
                onClick={() => router.push("/payment-history")}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white text-[#1B4D3E] rounded-full text-sm font-bold transition-all border border-[#1B4D3E]/10 hover:border-[#1B4D3E]/30 shadow-sm hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M12 7v5l4 2"/>
                </svg>
                Lịch sử
              </button>
            </div>

            {/* Hotel Section */}
            {selectedHotel && (
              <div
                className={`bg-white p-6 rounded-[24px] shadow-sm transition-all relative ${isHotelSelected ? "ring-2 ring-[#2E968C]" : ""}`}
              >
                {/* Discount Tag */}
                {selectedVoucher && isHotelSelected && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <span className="text-[10px]">🏷️</span>
                    -{selectedVoucher.discountType === "PERCENT" ? `${selectedVoucher.value}%` : "Voucher"}
                  </div>
                )}

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏨</span> Lưu trú ({nights} đêm)
                </h3>
                <div className="flex gap-4 items-start border-b border-gray-100 pb-4 mb-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                    <Image
                      src={selectedHotel.images?.[0] || selectedHotel.image || "/placeholder.jpg"}
                      alt={selectedHotel.name}
                      fill
                      className="object-cover"
                      priority
                    />
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
                    <div className="font-bold text-lg text-[#1B4D3E]">
                      {isHotelSelected && selectedVoucher ? (
                        <div className="flex flex-col items-end">
                          <span className="text-gray-400 line-through text-sm">
                            {new Intl.NumberFormat("vi-VN").format(hotelTotal)} ₫
                          </span>
                          <span className="text-red-600">
                            {new Intl.NumberFormat("vi-VN").format(hotelTotal * (1 - (selectedVoucher.discountType === "PERCENT" ? selectedVoucher.value / 100 : 0)))} ₫
                          </span>
                        </div>
                      ) : (
                        `${new Intl.NumberFormat("vi-VN").format(hotelTotal)} ₫`
                      )}
                    </div>
                    <div className="text-xs text-gray-400">x {nights} đêm</div>
                    <button
                      type="button"
                      onClick={() => toggleItemSelection("hotel")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 mt-2 ${isHotelSelected
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
                {/* Discount Tag */}
                {selectedVoucher && attractionCosts.some(i => i.isSelected) && (
                  <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <span className="text-[10px]">🏷️</span>
                    -{selectedVoucher.discountType === "PERCENT" ? `${selectedVoucher.value}%` : "Voucher"}
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
                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 items-center p-3 rounded-xl transition-all ${isItemSelected
                          ? "bg-[#E8F5E9] ring-2 ring-[#2E968C]"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                          <Image
                            src={item.images?.[0] || item.image || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{item.name}</h4>
                          <p className="mt-1 text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-lg inline-block font-medium">
                            {item.price || "Miễn phí"}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          {item.total > 0 ? (
                            <>
                              <div className="font-bold text-lg text-[#1B4D3E]">
                                {new Intl.NumberFormat("vi-VN").format(
                                  item.total,
                                )}{" "}
                                ₫
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isItemSelected
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

              <div className="space-y-4 mb-8">
                {selectedHotel && isHotelSelected && (
                  <div className="flex justify-between items-center text-white/80">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      Lưu trú
                    </span>
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(hotelTotal)} ₫
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
                          selectedAttractionsTotal,
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

                {/* Voucher Applied */}
                {selectedVoucher && (
                  <div className="flex justify-between items-center text-green-300 animate-in slide-in-from-right-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎟️</span>
                      Mã giảm giá
                    </span>
                    <span className="font-bold">
                      - {new Intl.NumberFormat("vi-VN").format(discountAmount)} ₫
                    </span>
                  </div>
                )}

                <div className="h-px bg-white/20 my-4"></div>
                <div className="flex justify-between items-center text-2xl font-black">
                  <span>Tổng</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(grandTotal)} ₫
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-sm mb-3 text-white/90 flex items-center gap-2">
                  <span className="text-lg">🏷️</span> Mã giảm giá
                </h4>

                {/* Selected Voucher Display */}
                {selectedVoucher ? (
                  <div className="bg-[#2E4A45] p-3 rounded-lg flex items-center justify-between border border-[#4E7A75] mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
                        🎫
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase text-white">{selectedVoucher.code}</p>
                        <p className="text-[10px] text-white/70">{selectedVoucher.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVoucher(null)}
                      className="text-white/60 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  </div>
                ) : null}

                {/* Available Vouchers List */}
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
                  <p className="text-xs text-white/50 mb-2">Chọn voucher có sẵn: ({AVAILABLE_VOUCHERS.length})</p>
                  {AVAILABLE_VOUCHERS.filter(v => v.code !== selectedVoucher?.code).map(voucher => (
                    <div
                      key={voucher.code}
                      onClick={() => setSelectedVoucher(voucher)}
                      className="bg-white/5 hover:bg-white/10 p-2.5 rounded-lg border border-white/5 cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${voucher.color.replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-white ')}`}>
                        %
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs uppercase text-white group-hover:text-[#41C7D6] transition-colors">{voucher.code}</p>
                        <p className="text-[10px] text-white/60 truncate">{voucher.description}</p>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-white/30 group-hover:border-[#41C7D6] flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#41C7D6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-sm mb-3">
                  Phương thức thanh toán
                </h4>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${paymentMethod === "momo"
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
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${paymentMethod === "vnpay"
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
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${paymentMethod === "card"
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
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${selectedCount === 0
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
