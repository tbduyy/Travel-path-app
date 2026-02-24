"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface UseRequireAuthOptions {
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = "/login" } = options;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setShowAuthPopup(true);
        // Delay redirect to show popup
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [redirectTo, router]);

  return { isLoading, isAuthenticated, showAuthPopup };
}

// Component to show auth required popup
export function AuthRequiredPopup({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
      <div className="bg-white border border-red-200 rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
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
            className="text-red-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-gray-900">Yêu cầu đăng nhập</p>
          <p className="text-sm text-gray-500">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading component while checking auth
export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BBD9D9]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1B4D3E]/30 border-t-[#1B4D3E] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-[#1B4D3E]/70">
          Đang kiểm tra đăng nhập...
        </p>
      </div>
    </div>
  );
}

// Hook to check auth status without redirecting (for feature gates like PDF export)
export function useAuthStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email || null);
        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            null,
        );
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { isLoading, isAuthenticated, userEmail, userName };
}

// Login prompt modal for features that require auth
export function LoginPromptModal({
  isOpen,
  onClose,
  onLogin,
  feature,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  feature: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#2E968C] to-[#1B4D3E] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-black text-[#1B4D3E] mb-3 text-center">
          Đăng nhập để {feature}
        </h3>

        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          Tạo tài khoản <strong className="text-[#2E968C]">miễn phí</strong> để
          lưu lịch trình, xuất PDF và nhận email xác nhận booking của bạn!
        </p>

        {/* Benefits */}
        <div className="bg-[#E8F5F3] rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Lưu và quản lý tất cả chuyến đi</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Xuất lịch trình PDF chuyên nghiệp</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Nhận email xác nhận & nhắc nhở</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1B4D3E]">
            <span className="text-green-500">✓</span>
            <span>Đồng bộ lịch trình trên mọi thiết bị</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#113D38] transition-colors shadow-lg flex items-center justify-center gap-2"
            title="Zustand store state sẽ tự động được giữ lại (persist middleware)"
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Đăng nhập ngay
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Để sau
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => {
              const currentPath = typeof window !== "undefined"
                ? window.location.pathname + window.location.search
                : "/";
              window.location.href = `/signup?redirect=${encodeURIComponent(currentPath)}`;
            }}
            className="text-[#2E968C] font-semibold hover:text-[#1B4D3E] hover:underline transition-colors"
          >
            Đăng ký chỉ mất 30 giây!
          </button>{" "}
          🚀
        </p>
      </div>
    </div>
  );
}
