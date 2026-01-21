"use client";

import Link from "next/link";
import { Search, Calendar, Users, Wallet, Compass } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SearchWidget() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="w-full max-w-5xl bg-white rounded-full shadow-2xl flex items-center p-2 border border-gray-100 relative z-20">

            {/* 1. Destination */}
            <div className="flex-1 flex flex-col justify-center px-6 h-16 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group relative">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1 mb-0.5">
                    Where to?
                </label>
                <input
                    type="text"
                    placeholder="Search destinations"
                    className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder:text-gray-300 outline-none"
                />
            </div>

            <div className="w-[1px] h-8 bg-gray-200" />

            {/* 2. Dates */}
            <div className="flex-1 flex flex-col justify-center px-6 h-16 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1 mb-0.5">
                    Check in - Check out
                </label>
                <div className="text-sm font-bold text-gray-400">Add dates</div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200" />

            {/* 3. Travellers */}
            <div className="w-40 flex flex-col justify-center px-6 h-16 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1 mb-0.5">
                    Travellers
                </label>
                <div className="text-sm font-bold text-gray-400">Add guests</div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200" />

            {/* 4. Budget */}
            <div className="w-36 flex flex-col justify-center px-6 h-16 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1 mb-0.5">
                    Budget
                </label>
                <div className="text-sm font-bold text-gray-400">Any</div>
            </div>

            <div className="w-[1px] h-8 bg-gray-200" />

            {/* 5. Style */}
            <div className="w-36 flex flex-col justify-center px-6 h-16 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1 mb-0.5">
                    Style
                </label>
                <div className="text-sm font-bold text-gray-400">Any</div>
            </div>

            {/* Submit Button */}
            <Link href="/plan-trip" className="pl-2">
                <button className="bg-primary hover:bg-primary-light text-white h-14 w-14 rounded-full font-bold shadow-xl transition-all flex items-center justify-center transform hover:scale-105">
                    <Search className="w-6 h-6" />
                </button>
            </Link>

        </div>
    );
}
