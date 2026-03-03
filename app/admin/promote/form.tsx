"use client";

import { useActionState, useTransition } from "react";
import { sendPromoteEmail, sendPromoteEmailToAll } from "./actions";
import { Loader2, Send, Mail, User, Users } from "lucide-react";

const initialState = {
  success: false,
  error: "",
};

export default function PromoteForm() {
  const [state, formAction, isPending] = useActionState(
    sendPromoteEmail,
    initialState
  );

  const [allState, allFormAction, isAllPending] = useActionState(
    sendPromoteEmailToAll,
    initialState
  );

  const [isTransitioning, startTransition] = useTransition();

  return (
    <form
      action={formAction}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-bold text-[#1B4D3E] mb-2">
            Tên khách hàng
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Tên sẽ hiển thị trong email gửi đến khách hàng.
          </p>
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="customerName"
              required
              placeholder="Nguyễn Văn A"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-[#1B4D3E] mb-2">
            Email
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Địa chỉ email nhận thông tin khuyến mãi.
          </p>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="example@email.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-base"
            />
          </div>
        </div>
      </div>

      {(state?.error || allState?.error) && (
        <div className={`text-sm font-medium text-center p-3 rounded-xl ${
          allState?.success ? 'text-yellow-700 bg-yellow-50' : 'text-red-500 bg-red-50'
        }`}>
          {state?.error || allState?.error}
        </div>
      )}

      {(state?.success || allState?.success) && !allState?.error && (
        <div className="text-green-600 text-sm font-medium text-center bg-green-50 p-3 rounded-xl">
          {allState?.success ? 'Gửi email cho tất cả người dùng thành công! 🎉' : 'Gửi email khuyến mãi thành công! ✨'}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending || isAllPending}
          className="flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a2f] transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
          {isPending ? "Đang gửi..." : "Gửi email"}
        </button>
        <button
          type="button"
          disabled={isPending || isAllPending}
          onClick={() => {
            if (!confirm("⚠️ Bạn chắc chắn muốn gửi email đến TẤT CẢ người dùng không?")) return;
            startTransition(() => allFormAction());
          }}
          className="flex items-center gap-2 bg-[#00B14F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#009a43] transition-all disabled:opacity-50"
        >
          {isAllPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Users size={20} />
          )}
          {isAllPending ? "Đang gửi..." : "Gửi tất cả người dùng"}
        </button>
      </div>
    </form>
  );
}
