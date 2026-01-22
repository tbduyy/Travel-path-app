import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";
import WeatherWidget from "@/components/ui/WeatherWidget";
import CableCarAnimation from "@/components/home/CableCarAnimation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center">

      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0 rounded-b-[3rem] overflow-hidden">
        <Image
          src="/hero-bg.png"
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center min-h-screen pt-20 pb-10">

        {/* Top Section: Title (Left) and Widget (Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-8">

          {/* Left: Title Image */}
          <div className="flex-1 flex justify-start items-center">
            <div className="relative w-full max-w-2xl h-64 md:h-96">
              <Image
                src="/hero-title.png"
                alt="Make Your Dream Trip"
                fill
                className="object-contain object-left"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Right: Weather Widget */}
          <div className="flex-1 flex justify-end items-start md:-mt-20">
            <WeatherWidget />
          </div>
        </div>

        {/* Bottom Section: Search Widget & Badges */}
        <div className="w-full mt-8 md:mt-0 flex flex-col gap-8">
          <SearchWidget />

          {/* Cable Car Animation */}
          <div className="w-full pointer-events-none">
            <CableCarAnimation />
          </div>

          {/* Floating Badges/Partnerships */}

        </div>

      </div>


      {/* SECTION: Partnership */}
      <section className="w-full bg-[#E0F2F1] relative z-10 py-16 -mt-10 rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto px-8">

          <div className="flex justify-center mb-12">
            <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
              Partnership
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Grab Card */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="w-full md:w-1/3 h-48 relative bg-white/30 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Placeholder for Grab illustration */}
                <Image
                  src="/assets/home/grab.png"
                  alt="Grab Service"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="relative z-10 font-bold text-2xl text-[#00B14F]">Grab</span>
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Grab</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Grab là ứng dụng đa dịch vụ thuần Việt, cung cấp hệ sinh thái toàn diện từ gọi xe (máy, ô tô), giao đồ ăn, vận chuyển đến vé máy bay và ngân hàng số. Nhờ thấu hiểu người dùng bản địa, Grab mang đến các giải pháp di chuyển và đời sống tiện lợi, an toàn trên một nền tảng duy nhất.
                </p>
              </div>
            </div>

            {/* Hotel Colline */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="flex-1 order-2 md:order-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Hotel Colline</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Hotel Colline là khách sạn 4 sao nổi bật với kiến trúc khối nâu hiện đại ngay trung tâm Đà Lạt. Nhờ vị trí đắc địa gần Hồ Xuân Hương cùng phong cách nội thất tối giản, sang trọng, nơi đây mang đến không gian nghỉ dưỡng tiện nghi và là địa điểm check-in yêu thích của giới trẻ.
                </p>
              </div>
              <div className="w-full md:w-1/3 h-48 relative bg-gray-200 rounded-2xl overflow-hidden order-1 md:order-2">
                <Image
                  src="/assets/home/partner-1.png"
                  alt="Hotel Colline"
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
                  src="/assets/home/partner-2.png"
                  alt="Le Rabelais"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Nhà Hàng Le Rabelais</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Le Rabelais là nhà hàng mang đậm phong cách kiến trúc Pháp sang trọng, sở hữu không gian thưởng thức ẩm thực tinh tế với tầm nhìn đẹp. Nơi đây chuyên phục vụ các món Âu đa dạng như súp hành tây, beefsteak kết hợp cùng rượu vang, mang đến trải nghiệm ẩm thực thăng hoa cho thực khách.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Arrows (Visual) */}
          <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/assets/home/arrow-left.png" alt="Previous" width={40} height={40} />
            </div>
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/assets/home/arrow-right.png" alt="Next" width={40} height={40} />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: Feedback */}
      <section className="w-full bg-[#E0F2F1] relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-center mb-12">
            <h2 className="bg-[#3A5A40] text-white text-xl font-bold px-8 py-2 rounded-full shadow-md">
              Feedback
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#B7E4C7] h-64 rounded-3xl shadow-sm border border-white/30" />
            ))}
          </div>

          {/* Carousel Arrows (Visual) */}
          <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/assets/home/arrow-left.png" alt="Previous" width={40} height={40} />
            </div>
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/assets/home/arrow-right.png" alt="Next" width={40} height={40} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white relative z-20 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Logo Icon */}
              <Image
                src="/logo.png"
                alt="Travel Path Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              {/* Logo Name */}
              <Image
                src="/logo-name.png"
                alt="Travel Path"
                width={200}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="pl-2 mt-2">
              <Image
                src="/tagline.png"
                alt="Your real adventures start here"
                width={300}
                height={30}
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-8 md:mt-0 space-y-3 text-sm text-[#1B4D3E] font-medium text-right">
            <p className="text-xl font-bold mb-4">Liên hệ</p>
            <p>FPT University</p>
            <p>090 123 4567</p>
            <p>travelpath.vn@gmail.com</p>
            <p className="cursor-pointer hover:underline">www.travelpath.vn</p>
          </div>
        </div>
      </footer>

    </main >
  );
}
