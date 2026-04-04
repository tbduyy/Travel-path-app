"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuth, useRequireAuthFromContext } from "@/lib/context/AuthContext";
import {
  AuthLoadingScreen,
  AuthRequiredPopup,
} from "@/lib/hooks/useRequireAuth";
import { useTripStore } from "@/lib/store/trip-store";
import {
  CalendarCheck2,
  CreditCard,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const quickActions = [
  {
    title: "Chuyến đi của tôi",
    description: "Xem lại toàn bộ lịch trình đã lưu",
    href: "/my-journey",
    icon: CalendarCheck2,
  },
  {
    title: "Lịch sử thanh toán",
    description: "Theo dõi các đơn hàng đã thanh toán",
    href: "/payment-history",
    icon: CreditCard,
  },
  {
    title: "Lên kế hoạch mới",
    description: "Bắt đầu một hành trình mới cùng AI",
    href: "/plan-trip",
    icon: Sparkles,
  },
] as const;

export default function ProfiePage() {
  const { isLoading, isAuthenticated, showAuthPopup } =
    useRequireAuthFromContext({ returnTo: "/profile" });
  const { userName, userEmail, profile, signOut } = useAuth();
  const clearTrip = useTripStore((state) => state.clearTrip);

  const handleSignOut = async () => {
    clearTrip();
    await signOut();
    window.location.href = "/";
  };

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthRequiredPopup show={showAuthPopup} />;
  }

  return (
    <main className="min-h-screen bg-[#BBD9D9] text-[#1B4D3E]">
      <div className="sticky top-0 z-50 mb-4 bg-[#BBD9D9] border-b border-[#1B4D3E]/10">
        <Header />
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 pb-14 pt-6 md:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white/90 shadow-xl border border-white/60 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#2E968C] to-[#1B4D3E] text-white shadow-lg">
                <User size={30} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-sm md:text-base text-[#1B4D3E]/70">
                  Quản lý thông tin và truy cập nhanh các tính năng của bạn.
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-bold text-red-700 transition-colors hover:bg-red-100"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F3FAF9] p-5 border border-[#D0ECE8]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]/60 mb-2">
                Tên hiển thị
              </p>
              <p className="text-xl font-extrabold wrap-break-word">
                {userName || "Người dùng Travel Path"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F3FAF9] p-5 border border-[#D0ECE8]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]/60 mb-2 flex items-center gap-2">
                <Mail size={14} />
                Email
              </p>
              <p className="text-xl font-extrabold break-all">{userEmail}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-5 border border-[#E4EFEF]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]/60 mb-2 flex items-center gap-2">
              <ShieldCheck size={14} />
              Trạng thái tài khoản
            </p>
            <p className="inline-flex items-center rounded-full bg-[#E8F5F3] px-3 py-1 text-sm font-bold text-[#1B4D3E]">
              {profile?.role === "admin" ? "Quản trị viên" : "Thành viên"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-[#D5E9E7] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5F3] text-[#1B4D3E] group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors">
                <action.icon size={20} />
              </div>
              <h2 className="text-lg font-black">{action.title}</h2>
              <p className="mt-1 text-sm text-[#1B4D3E]/70">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
