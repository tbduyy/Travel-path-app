import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";
import WeatherWidget from "@/components/ui/WeatherWidget";
import CableCarAnimation from "@/components/home/CableCarAnimation";
import Image from "next/image";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center bg-[#BBD9D9]">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0 rounded-b-[3rem] overflow-hidden">
        <Image
          src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/hero-bg.png"
          alt="Hero Background"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-white/20" />
      </div>

      <Header />

      {/* Hero Content */}
      <div className="relative z-10 w-full items-center max-w-7xl mx-auto px-8 flex flex-col justify-center min-h-screen pb-10">
        {/* Top Section: Title (Left) and Widget (Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-8">
          {/* Left: Title Image */}
          <div className="flex-1 flex justify-start items-center">
            <div className="relative w-full max-w-6xl h-[70vh]">
              <Image
                src="hero-title.png"
                alt="Make Your Dream Trip"
                fill
                className="object-contain object-left"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Right: Weather Widget */}
          <div className="flex-1 flex justify-end items-start md:-mt-12">
            <WeatherWidget />
          </div>
        </div>

        {/* Bottom Section: Search Widget & Badges */}
        <div className="w-[85vw] -translate-y-1/2 flex flex-col gap-8">
          <SearchWidget />
          {/* Floating Badges/Partnerships */}
        </div>
      </div>

      {/* SECTION: Cable Car Animation */}
      <div className="mx-auto w-full pointer-events-none">
        <CableCarAnimation />
      </div>

      {/* SECTION: Partnership */}
      <section className="w-full bg-[#E0F2F1] relative z-10 py-16 -mt-10 rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-center mb-12">
            <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
              Đối tác
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Grab Card */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="w-full md:w-1/3 h-48 relative bg-white/30 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Placeholder for Grab illustration */}
                <Image
                  src="https://placehold.co/220x220?text=Ảnh"
                  alt="Placeholder 1"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="relative z-10 font-bold text-2xl text-[#00B14F]"></span>
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2"></h3>
                <p className="text-sm leading-relaxed font-medium opacity-80"></p>
              </div>
            </div>

            {/* Hotel Colline */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="flex-1 order-2 md:order-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2"></h3>
                <p className="text-sm leading-relaxed font-medium opacity-80"></p>
              </div>
              <div className="w-full md:w-1/3 h-48 relative bg-gray-200 rounded-2xl overflow-hidden order-1 md:order-2">
                <Image
                  src="https://placehold.co/220x220?text=Ảnh"
                  alt="Placeholder 2"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Le Rabelais */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="w-full md:w-1/3 h-48 relative bg-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src="https://placehold.co/220x220?text=Ảnh"
                  alt="Placeholder 3"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2"></h3>
                <p className="text-sm leading-relaxed font-medium opacity-80"></p>
              </div>
            </div>
          </div>

          {/* Carousel Arrows (Visual) */}
          <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-left.png"
                alt="Previous"
                width={40}
                height={40}
              />
            </div>
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-right.png"
                alt="Next"
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Feedback */}
      <section className="w-full bg-[#E0F2F1] relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-center mb-12">
            <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
              Phản hồi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#B7E4C7] h-64 rounded-3xl shadow-sm border border-white/30"
              />
            ))}
          </div>

          {/* Carousel Arrows (Visual) */}
          <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-left.png"
                alt="Previous"
                width={40}
                height={40}
              />
            </div>
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/arrow-right.png"
                alt="Next"
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white relative z-20 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto pl-2 px-8 flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-6 flex items-center">
            <div className="pl-4 mt-4">
              {/* Logo Icon */}
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo.png"
                alt="Travel Path Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              {/* Logo Name */}
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/logo-name.png"
                alt="Travel Path"
                width={200}
                height={50}
                className="object-contain"
              />
              <Image
                src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/tagline.png"
                alt="Your real adventures start here"
                width={200}
                height={20}
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-8 md:mt-0 flex flex-col items-end gap-8 text-[#1B4D3E]">
            {/* Contact Section */}
            <div className="flex flex-col items-end gap-3">
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Liên hệ chúng tôi (Contact Us)
              </h3>
              <a
                href="mailto:partnership@travelpath.io.vn"
                className="flex flex-row-reverse items-center gap-3 font-medium hover:text-[#00B14F] transition-colors group"
              >
                <span className="group-hover:translate-x-[-2px] transition-transform">
                  partnership@travelpath.io.vn
                </span>
                <Mail size={20} />
              </a>
              <a
                href="tel:+83846427816"
                className="flex flex-row-reverse items-center gap-3 font-medium hover:text-[#00B14F] transition-colors group"
              >
                <span className="group-hover:translate-x-[-2px] transition-transform">
                  +83 846 427 816
                </span>
                <Phone size={20} />
              </a>
            </div>

            {/* Social Section */}
            <div className="flex flex-col items-end gap-3">
              <h3 className="text-lg font-extrabold uppercase tracking-wide">
                Theo dõi chúng tôi trên
              </h3>
              <a
                href="#"
                className="flex flex-row-reverse items-center gap-3 font-medium hover:text-[#00B14F] transition-colors group"
              >
                <span className="group-hover:translate-x-[-2px] transition-transform">
                  Facebook
                </span>
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="flex flex-row-reverse items-center gap-3 font-medium hover:text-[#00B14F] transition-colors group"
              >
                <span className="group-hover:translate-x-[-2px] transition-transform">
                  Instagram
                </span>
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
