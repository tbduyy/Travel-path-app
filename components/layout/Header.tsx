"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: "About Us", href: "#" },
        { name: "Plan Trip", href: "/plan-trip" },
        { name: "My Journey", href: "#" },
        { name: "Blog", href: "#" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full flex justify-center mt-4 px-4 pointer-events-none">

            {/* Background Image Container (Rectangle 4) */}
            <div className="relative w-full max-w-7xl h-24 flex items-center justify-between px-8 pointer-events-auto filter drop-shadow-xl">

                {/* The Background Shape */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/header-bg.png"
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
                                src="/logo.png"
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
                                    src="/logo-name.png"
                                    alt="Travel Path"
                                    fill
                                    className="object-contain object-left"
                                    unoptimized
                                />
                            </div>
                            {/* Tagline Text */}
                            <div className="relative w-44 h-4">
                                <Image
                                    src="/tagline.png"
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

                    {/* Right: Authorized Section (No Search, Just Avatar) */}
                    <div className="flex items-center">
                        {/* User Profile Avatar (No border, larger) */}
                        <div className="relative cursor-pointer group">
                            <div className="w-12 h-12 rounded-full overflow-hidden relative hover:opacity-90 transition-opacity">
                                <Image
                                    src="/user-avatar.png"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            {/* Active Dot */}
                            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
}
