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
