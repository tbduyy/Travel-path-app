
'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState, Suspense } from 'react'
import { login } from './actions'
import Header from '../../components/layout/Header'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

// Initial state for the form
const initialState = {
    error: '',
}

function LoginForm() {
    const [state, formAction, isPending] = useActionState(async (_prevState: any, formData: FormData) => {
        const result = await login(formData);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState);

    const searchParams = useSearchParams();
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    useEffect(() => {
        if (searchParams.get('reason') === 'auth_required') {
            setShowAuthPopup(true);
        }
    }, [searchParams]);

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#F0FDFD] rounded-full flex items-center justify-center mb-4 text-[#1B4D3E]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#1B4D3E] mb-2">Đăng nhập để tiếp tục</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Bạn cần có tài khoản để sử dụng tính năng <span className="font-bold text-[#2E968C]">Tạo lịch trình</span>. Hãy đăng nhập ngay nhé!
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
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-[#1B4D3E]">
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
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#1B4D3E]">
                                    Mật khẩu
                                </label>
                                <div className="text-sm">
                                    <Link href="#" className="font-semibold text-[#2E968C] hover:text-[#1B4D3E]">
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

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Chưa có tài khoản?{' '}
                        <Link href="/signup" className="font-semibold leading-6 text-[#2E968C] hover:text-[#1B4D3E]">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
