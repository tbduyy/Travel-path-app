"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserDropdown from "../auth/UserDropdown";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Về TRAVEL PATH", href: "/about" },
    { name: "Lịch trình chuyến đi", href: "/plan-trip" },
    { name: "Chuyến đi của tôi", href: "/my-journey" },
    { name: "Cẩm nang", href: "/blog" },
    { name: "Thanh toán", href: "/payment" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center mt-2 md:mt-4 px-3 md:px-4 pointer-events-none">
      {/* Background Image Container (Rectangle 4) */}
      <div className="relative w-full max-w-7xl h-16 md:h-24 flex items-center justify-center px-3 md:px-8 pointer-events-auto filter drop-shadow-xl">
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
          <Link href="/" className="flex items-center flex-shrink-0 gap-1 md:gap-2">
            {/* Icon */}
            <div className="relative w-12 md:w-20 h-12 md:h-20 flex-shrink-0">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo.png"
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {/* Name & Tagline Column */}
            <div className="hidden sm:flex flex-col justify-center gap-1">
              {/* Name Text (Larger Ratio) */}
              <div className="relative aspect-[4/1] h-8 md:h-12">
                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo-name.png"
                  alt="Travel Path"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </div>
          </Link>

          {/* Center: Navigation Links - Desktop only */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs xl:text-base font-bold transition-colors tracking-tight uppercase whitespace-nowrap ${
                    isActive
                      ? "text-[#439B91] brightness-125"
                      : "text-[#1B4D3E] hover:text-[#2C6E5A]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center pointer-events-auto p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-[#1B4D3E]" />
            ) : (
              <Menu size={24} className="text-[#1B4D3E]" />
            )}
          </button>

          {/* Right: Authorized Section */}
          <div className="hidden lg:flex items-center pointer-events-auto">
            <UserDropdown />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-3 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
            <nav className="flex flex-col">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-bold transition-colors uppercase border-b border-gray-100 last:border-b-0 ${
                      isActive
                        ? "text-[#439B91] bg-[#E0F2F1]"
                        : "text-[#1B4D3E] hover:bg-[#F0F8F7]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="px-4 py-3 border-t border-gray-100">
                <UserDropdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
