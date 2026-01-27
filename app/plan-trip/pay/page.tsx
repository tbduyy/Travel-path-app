"use client";

import Header from "@/components/layout/Header";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PayPage() {
    const [paymentMethod, setPaymentMethod] = useState('momo');

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#1B4D3E] bg-[#BBD9D9]">
            <div className="sticky top-0 z-50 bg-[#BBD9D9]/80 backdrop-blur-md">
                <Header />
            </div>

            <div className="flex-1 w-full max-w-5xl mx-auto p-6 pb-24">
                <h1 className="text-4xl font-black text-[#1B4D3E] uppercase text-center mb-12">Thanh toán</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT: Summary */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl flex flex-col gap-6 h-fit">
                        <h2 className="text-2xl font-bold">Tóm tắt đơn hàng</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <div>
                                    <p className="font-bold">Vé tham quan (3 địa điểm)</p>
                                    <p className="text-sm text-gray-500">Người lớn x2</p>
                                </div>
                                <span className="font-bold">600.000 VND</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <div>
                                    <p className="font-bold">Mountain Nest Villa</p>
                                    <p className="text-sm text-gray-500">1 Đêm, 1 Phòng</p>
                                </div>
                                <span className="font-bold">1.200.000 VND</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <div>
                                    <p className="font-bold">Phí dịch vụ</p>
                                </div>
                                <span className="font-bold">50.000 VND</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-dashed border-[#1B4D3E]/20 flex justify-between items-center">
                            <span className="text-xl font-black">Tổng cộng</span>
                            <span className="text-2xl font-black text-[#2E968C]">1.850.000 VND</span>
                        </div>
                    </div>

                    {/* RIGHT: Payment Methods */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-xl">
                            <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-[#1B4D3E] has-[:checked]:bg-[#1B4D3E]/5">
                                    <input type="radio" name="payment" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-6 h-6 accent-[#1B4D3E]" />
                                    <div className="w-12 h-12 relative bg-pink-100 rounded-xl flex items-center justify-center">
                                        {/* Icon placeholder */}
                                        <span className="font-bold text-pink-600 text-xs">MOMO</span>
                                    </div>
                                    <span className="font-bold text-lg">Ví MoMo</span>
                                </label>

                                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-[#1B4D3E] has-[:checked]:bg-[#1B4D3E]/5">
                                    <input type="radio" name="payment" value="visa" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} className="w-6 h-6 accent-[#1B4D3E]" />
                                    <div className="w-12 h-12 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                        {/* Icon placeholder */}
                                        <span className="font-bold text-blue-800 text-xs">VISA</span>
                                    </div>
                                    <span className="font-bold text-lg">Thẻ quốc tế</span>
                                </label>

                                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-[#1B4D3E] has-[:checked]:bg-[#1B4D3E]/5">
                                    <input type="radio" name="payment" value="atm" checked={paymentMethod === 'atm'} onChange={() => setPaymentMethod('atm')} className="w-6 h-6 accent-[#1B4D3E]" />
                                    <div className="w-12 h-12 relative bg-green-100 rounded-xl flex items-center justify-center">
                                        {/* Icon placeholder */}
                                        <span className="font-bold text-green-700 text-xs">ATM</span>
                                    </div>
                                    <span className="font-bold text-lg">Thẻ ATM nội địa</span>
                                </label>
                            </div>

                            <button className="w-full mt-8 py-4 bg-[#1B4D3E] text-white rounded-xl font-bold text-lg hover:bg-[#113D38] transition-colors shadow-lg active:scale-98">
                                Thanh toán ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
