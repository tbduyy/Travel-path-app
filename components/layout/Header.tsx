"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import UserDropdown from "../auth/UserDropdown";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Về TRAVEL PATH", href: "/about" },
        { name: "Lịch trình chuyến đi", href: "/plan-trip" },
        { name: "Chuyến đi của tôi", href: "#" },
        { name: "Cẩm nang", href: "/blog" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full flex justify-center mt-4 px-4 pointer-events-none">

            {/* Background Image Container (Rectangle 4) */}
            <div className="relative w-full max-w-7xl h-24 flex items-center justify-between px-8 pointer-events-auto filter drop-shadow-xl">

                {/* The Background Shape */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/header-bg.png"
                        alt="Background"
                        fill
                        className="object-fill"
                        unoptimized
                        priority
                    />
                </div>

                {/* Content Layer (z-10) */}
                <div className="relative z-10 flex items-center justify-between w-full h-full">

                    {/* Left: Logo + Name + Tagline */}
                    <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                        {/* Icon */}
                        <div className="relative w-12 h-12">
                            <Image
                                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        {/* Name & Tagline Column */}
                        <div className="flex flex-col justify-center gap-1">
                            {/* Name Text (Larger Ratio) */}
                            <div className="relative w-40 h-7">
                                <Image
                                    src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo-name.png"
                                    alt="Travel Path"
                                    fill
                                    className="object-contain object-left"
                                    unoptimized
                                />
                            </div>
                            {/* Tagline Text */}
                            <div className="relative w-44 h-4">
                                <Image
                                    src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/tagline.png"
                                    alt="Your next adventures start here"
                                    fill
                                    className="object-contain object-left"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Center: Navigation Links */}
                    <nav className="hidden md:flex items-center gap-16">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-base font-bold transition-colors tracking-normal capitalize ${isActive
                                        ? "text-[#00B14F] brightness-125"
                                        : "text-[#1B4D3E] hover:text-[#2C6E5A]"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Authorized Section */}
                    <div className="flex items-center pointer-events-auto">
                        <UserDropdown />
                    </div>
                </div>
            </div>

        </header>
    );
}
