import Image from "next/image";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="w-full bg-white relative z-20 py-8 md:py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-start gap-8 md:gap-8 items-start">
        <div className="space-y-4 md:space-y-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="md:pl-4 md:mt-4">
            {/* Logo Icon */}
            <Image
              src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo.png"
              alt="Travel Path Logo"
              width={80}
              height={80}
              className="w-16 md:w-[100px] h-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-start gap-2 md:gap-4 -ml-4 md:-ml-8 -mt-2 md:-mt-4">
            {/* Logo Name */}
            <Image
              src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo-name.png"
              alt="Travel Path"
              width={240}
              height={60}
              className="w-[150px] md:w-[240px] h-auto object-contain"
            />
          </div>
        </div>

        <div className="mt-2 md:mt-4 flex flex-col md:flex-row gap-8 md:gap-16 text-[#1B4D3E] w-full md:w-auto">
          {/* Routing Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm md:text-lg font-extrabold uppercase tracking-wide">
              Liên kết
            </h3>
            <a
              href="https://www.facebook.com/travelpath.io.vn/about"
              className="text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              Về chúng tôi
            </a>
            <a
              href="https://travelpath.io.vn/plan-trip"
              className="text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              Lịch trình chuyến đi
            </a>
            <a
              href="https://travelpath.io.vn/my-journey"
              className="text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              Chuyến đi của tôi
            </a>
            <a
              href="https://travelpath.io.vn/blog"
              className="text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              Cẩm nang
            </a>
            <a
              href="https://travelpath.io.vn/payment"
              className="text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              Thanh toán
            </a>
          </div>
          {/* Contact Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm md:text-lg font-extrabold uppercase tracking-wide">
              Liên hệ chúng tôi
            </h3>
            <a
              href="mailto:partnership@travelpath.io.vn"
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              <Mail size={16} className="md:size-[20px] flex-shrink-0" />
              <span className="group-hover:translate-x-[2px] transition-transform truncate">
                partnership@travelpath.io.vn
              </span>
            </a>
            <a
              href="tel:+84836427816"
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              <Phone size={16} className="md:size-[20px] flex-shrink-0" />
              <span className="group-hover:translate-x-[2px] transition-transform">
                +84 836 427 816
              </span>
            </a>
          </div>

          {/* Social Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm md:text-lg font-extrabold uppercase tracking-wide">
              Theo dõi chúng tôi
            </h3>
            <a
              href="https://www.facebook.com/travelpath.io.vn/"
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              <Facebook size={16} className="md:size-[20px] flex-shrink-0" />
              <span className="group-hover:translate-x-[2px] transition-transform">
                Facebook
              </span>
            </a>
            <a
              href="https://www.instagram.com/travelpath.io.vn/"
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium hover:text-[#00B14F] transition-colors group"
            >
              <Instagram size={16} className="md:size-[20px] flex-shrink-0" />
              <span className="group-hover:translate-x-[2px] transition-transform">
                Instagram
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
