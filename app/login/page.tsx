"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, Suspense } from "react";
import { login } from "./actions";
import { signInWithGoogle } from "./oauth-actions";
import Header from "../../components/layout/Header";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

// Initial state for the form
const initialState = {
  error: "",
  success: false,
  redirectTo: "",
};

function LoginForm() {
  const { refreshAuth } = useAuth();
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const result = await login(formData);
      if (result?.error) {
        return { error: result.error, success: false, redirectTo: "" };
      }
      return { error: "", success: true, redirectTo: result.redirectTo };
    },
    initialState,
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      const handleLoginSuccess = async () => {
        await refreshAuth(); // Update auth context immediately
        router.refresh(); // Refresh server components
        router.replace(state.redirectTo); // Client-side redirect
      };
      handleLoginSuccess();
    }
  }, [state.success, state.redirectTo, refreshAuth, router]);

  const searchParams = useSearchParams();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get redirect URL from query params
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (searchParams.get("reason") === "auth_required") {
      setShowAuthPopup(true);
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle(redirectTo);
      if (result?.error) {
        console.error("Google sign in error:", result.error);
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to Google
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F9F9]">
      <Header />

      {/* Pop-up Notification */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAuthPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F0FDFD] rounded-full flex items-center justify-center mb-4 text-[#1B4D3E]">
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1B4D3E] mb-2">
                Đăng nhập để tiếp tục
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Bạn cần có tài khoản để sử dụng tính năng{" "}
                <span className="font-bold text-[#2E968C]">Tạo lịch trình</span>
                . Hãy đăng nhập ngay nhé!
              </p>
              <button
                onClick={() => setShowAuthPopup(false)}
                className="w-full py-3 bg-[#1B4D3E] text-white rounded-xl font-bold hover:bg-[#113D38] transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-black leading-9 tracking-tight text-[#1B4D3E] uppercase">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chào mừng bạn quay trở lại với Travel Path
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            {/* Hidden field to pass redirect URL to server action */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-[#1B4D3E]"
              >
                Địa chỉ Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#2E968C] sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-[#1B4D3E]"
                >
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-semibold text-[#2E968C] hover:text-[#1B4D3E]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#2E968C] sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
                {state.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-md bg-[#1B4D3E] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#153a2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Đăng nhập"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#F0F9F9] px-2 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>
                {isGoogleLoading ? "Đang kết nối..." : "Đăng nhập với Google"}
              </span>
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              href={redirectTo !== '/' ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
              className="font-semibold leading-6 text-[#2E968C] hover:text-[#1B4D3E]"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
