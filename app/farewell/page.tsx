"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";

export default function FarewellPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <main className="min-h-screen bg-[#F0F9F9] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-[#1B4D3E]" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl font-black text-[#1B4D3E] mb-4 uppercase">
          Cảm ơn bạn!
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <p className="text-lg text-gray-700 mb-4">
            {/* PLACEHOLDER: Thêm nội dung cảm ơn tại đây */}
            Thanh toán của bạn đã được xử lý thành công. Chúng tôi rất vui được
            đồng hành cùng bạn trong chuyến hành trình sắp tới!
          </p>

          <p className="text-base text-gray-600 mb-4">
            {/* PLACEHOLDER: Thêm thông tin bổ sung tại đây */}
            Một email xác nhận đã được gửi đến địa chỉ email của bạn với đầy đủ
            thông tin chi tiết về lịch trình và các điểm đến đã đặt.
          </p>

          <p className="text-sm text-gray-500">
            {/* PLACEHOLDER: Thêm ghi chú hoặc hướng dẫn tại đây */}
            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email
            hoặc hotline hỗ trợ 24/7.
          </p>
        </div>

        {/* Countdown Redirect */}
        <div className="bg-[#E8F5E9] p-6 rounded-xl">
          <p className="text-[#1B4D3E] font-medium mb-3">
            Bạn sẽ được chuyển về trang chủ trong
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-black text-[#1B4D3E]">
              {countdown}
            </span>
            <span className="text-xl text-[#1B4D3E] font-semibold">giây</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/50 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-[#1B4D3E] rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((10 - countdown) / 10) * 100}%` }}
            />
          </div>

          {/* Manual redirect button */}
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2E968C] transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ ngay
          </button>
        </div>
      </div>
    </main>
  );
}
