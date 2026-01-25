
'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signup } from './actions'
import Header from '../../components/layout/Header'
import { Loader2 } from 'lucide-react'

// Initial state for the form
const initialState = {
    error: '',
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(async (_prevState: any, formData: FormData) => {
        const result = await signup(formData);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState);

    return (
        <main className="min-h-screen bg-[#F0F9F9]">
            <Header />
            <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-3xl font-black leading-9 tracking-tight text-[#1B4D3E] uppercase">
                        Đăng ký tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Tham gia cùng chúng tôi để thiết kế hành trình của bạn
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action={formAction}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-[#1B4D3E]">
                                Họ tên
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#2E968C] sm:text-sm sm:leading-6 px-3"
                                />
                            </div>
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#1B4D3E]">
                                Mật khẩu
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
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
                                {isPending ? <Loader2 className="animate-spin" /> : "Đăng ký"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="font-semibold leading-6 text-[#2E968C] hover:text-[#1B4D3E]">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}
