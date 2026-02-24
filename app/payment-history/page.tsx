"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import {
  getPaymentHistory,
  clearPaymentHistory,
  type PaymentRecord,
} from "@/lib/utils/payment-history";
import { CreditCard, Wallet, QrCode, Trash2, ArrowLeft, Receipt, Calendar, MapPin, Users } from "lucide-react";

/** Format price to Vietnamese format */
function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/** Payment method display info */
function getPaymentMethodInfo(method: string) {
  switch (method) {
    case "momo":
      return { label: "MoMo", icon: <Wallet className="w-4 h-4" />, color: "bg-pink-100 text-pink-700" };
    case "vnpay":
      return { label: "VNPay", icon: <QrCode className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" };
    case "card":
      return { label: "Thẻ QT", icon: <CreditCard className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700" };
    default:
      return { label: method, icon: <CreditCard className="w-4 h-4" />, color: "bg-gray-100 text-gray-700" };
  }
}

/** Format relative time */
function timeAgo(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setRecords(getPaymentHistory());
  }, []);

  const handleClear = () => {
    clearPaymentHistory();
    setRecords([]);
    setShowClearConfirm(false);
  };

  const totalSpent = records.reduce((sum, r) => sum + r.grandTotal, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9]">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 pb-24">
        {/* Back + Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide">
                Lịch sử thanh toán
              </h1>
            </div>
          </div>

          {records.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Xóa tất cả</span>
            </button>
          )}
        </div>

        {/* Stats Bar */}
        {records.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#1B4D3E]/5">
              <p className="text-xs text-[#1B4D3E]/75 font-medium mb-1">Tổng giao dịch</p>
              <p className="text-2xl font-black">{records.length}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#1B4D3E]/5">
              <p className="text-xs text-[#1B4D3E]/75 font-medium mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-black">{formatVND(totalSpent)}</p>
            </div>
            <div className="hidden md:block bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#1B4D3E]/5">
              <p className="text-xs text-[#1B4D3E]/75 font-medium mb-1">Giao dịch gần nhất</p>
              <p className="text-2xl font-black">{timeAgo(records[0].timestamp)}</p>
            </div>
          </div>
        )}

        {/* Records List */}
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-[#1B4D3E]/30" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#1B4D3E]/70">Chưa có giao dịch nào</h2>
            <p className="text-sm text-[#1B4D3E]/50 mb-6 max-w-sm">
              Lịch sử thanh toán sẽ xuất hiện ở đây sau khi bạn hoàn tất thanh toán cho chuyến đi.
            </p>
            <button
              onClick={() => router.push("/plan-trip")}
              className="px-6 py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#113D38] transition-colors"
            >
              Lên kế hoạch ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const isExpanded = expandedId === record.id;
              const methodInfo = getPaymentMethodInfo(record.paymentMethod);

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-[24px] shadow-sm border border-[#1B4D3E]/5 overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Card Header - always visible */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                  >
                    {/* Status Icon */}
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✅</span>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base truncate">
                          {record.destination}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${methodInfo.color}`}>
                          {methodInfo.icon}
                          {methodInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#1B4D3E]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {record.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {record.people} người
                        </span>
                        <span>{timeAgo(record.timestamp)}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-[#1B4D3E]">
                        {formatVND(record.grandTotal)}
                      </p>
                      {record.discountAmount > 0 && (
                        <p className="text-[10px] text-red-500 font-medium line-through">
                          {formatVND(record.subTotal)}
                        </p>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <svg
                      className={`w-5 h-5 text-[#1B4D3E]/30 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-[#1B4D3E]/5">
                      {/* Payment ID & Date */}
                      <div className="flex items-center justify-between py-3 text-xs text-[#1B4D3E]/50">
                        <span>Mã GD: <span className="font-mono font-bold text-[#1B4D3E]/70">{record.id}</span></span>
                        <span>{new Date(record.timestamp).toLocaleString("vi-VN")}</span>
                      </div>

                      {/* Hotel */}
                      {record.hotel && (
                        <div className="bg-[#F5F9F9] rounded-xl p-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🏨</span>
                            <h4 className="font-bold text-sm">Lưu trú ({record.hotel.nights} đêm)</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            {record.hotel.image && (
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={record.hotel.image}
                                  alt={record.hotel.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{record.hotel.name}</p>
                              {record.hotel.address && (
                                <p className="text-xs text-[#1B4D3E]/50 truncate flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {record.hotel.address}
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-sm whitespace-nowrap">{formatVND(record.hotel.total)}</p>
                          </div>
                        </div>
                      )}

                      {/* Attractions */}
                      {record.attractions.length > 0 && (
                        <div className="bg-[#F5F9F9] rounded-xl p-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🎯</span>
                            <h4 className="font-bold text-sm">Vé tham quan ({record.attractions.length})</h4>
                          </div>
                          <div className="space-y-2">
                            {record.attractions.map((attr, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <p className="text-sm truncate flex-1 mr-2">{attr.name}</p>
                                <p className="text-sm font-bold whitespace-nowrap">{formatVND(attr.total)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#1B4D3E]/50">Tạm tính</span>
                          <span>{formatVND(record.subTotal)}</span>
                        </div>
                        {record.discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-red-500 flex items-center gap-1">
                              🏷️ {record.voucher || "Giảm giá"}
                            </span>
                            <span className="text-red-500">-{formatVND(record.discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-black pt-2 border-t border-[#1B4D3E]/10">
                          <span>Tổng thanh toán</span>
                          <span>{formatVND(record.grandTotal)}</span>
                        </div>
                      </div>

                      {/* Email */}
                      {record.userEmail && (
                        <p className="text-[10px] text-[#1B4D3E]/40 mt-3 text-center">
                          📧 Email xác nhận gửi đến: {record.userEmail}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Xóa toàn bộ lịch sử?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Hành động này không thể hoàn tác. Tất cả {records.length} giao dịch sẽ bị xóa vĩnh viễn.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
