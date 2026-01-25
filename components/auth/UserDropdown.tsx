
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Settings, LayoutDashboard } from "lucide-react";

export default function UserDropdown() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<{ role: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Fetch profile for role
                // We use single() because email is unique
                const { data } = await supabase.from('Profile').select('role').eq('id', user.id).single();
                setProfile(data);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) setProfile(null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // Refresh to clear server state if any
    };

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-[#1B4D3E] hover:text-[#00B14F] transition-colors">
                    Đăng nhập
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-[#1B4D3E] text-white rounded-full text-sm font-bold hover:bg-[#153a2f] transition-all shadow-md hover:shadow-lg">
                    Đăng ký
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 group outline-none"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white shadow-sm group-hover:shadow-md transition-all">
                    <Image
                        src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/user-avatar.png" // Default or user avatar
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                {profile?.role === 'admin' && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">A</span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Xin chào,</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{user.user_metadata.full_name || user.email}</p>
                        </div>

                        <div className="py-1">
                            {profile?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#00B14F] hover:bg-[#F0F9F9] font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LayoutDashboard size={16} />
                                    Admin Dashboard
                                </Link>
                            )}

                            <Link
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <UserIcon size={16} />
                                Hồ sơ cá nhân
                            </Link>

                        </div>

                        <div className="border-t border-gray-100 py-1">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                            >
                                <LogOut size={16} />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
