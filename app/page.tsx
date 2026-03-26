import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";
import CitySlideWidget from "@/components/ui/CitySlideWidget"; // Updated Import
import CableCarAnimation from "@/components/home/CableCarAnimation";
import FeedbackCarousel from "@/components/home/FeedbackCarousel";
import Image from "next/image";
import PageTransition from "@/components/layout/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen relative flex flex-col items-center bg-[#BBD9D9]">
        {/* Hero Background */}
        <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[90vh] z-0 rounded-b-[1.5rem] md:rounded-b-[3rem] overflow-hidden">
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
        <div className="relative z-40 w-full items-center max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center min-h-[70vh] md:min-h-screen pb-4 md:pb-10">
          {/* Top Section: Title (Left) and Widget (Right) */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-4 md:gap-8 overflow-visible">
            {/* Left: Title Image */}
            <div className="flex-[1.5] flex justify-center md:justify-start items-center -mt-16 md:-mt-32">
              <div className="relative w-full max-w-full h-[45vh] md:h-[70vh]">
                <Image
                  src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/hero-title.png"
                  alt="Make Your Dream Trip"
                  fill
                  className="object-contain object-center md:object-left scale-95 md:scale-[1.13] origin-left transition-transform duration-500"
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Right: Slide Widget */}
            <div className="flex-[0.5] hidden md:flex justify-end items-center w-full md:pr-4 pb-20">
              <CitySlideWidget />
            </div>
          </div>

          {/* Bottom Section: Search Widget & Badges */}
          <div className="w-[95vw] md:w-full -translate-y-1 md:-translate-y-2 flex flex-col gap-4 md:gap-8 px-2 relative z-50">
            <SearchWidget />
            {/* Floating Badges/Partnerships */}
          </div>
        </div>

        {/* SECTION: Cable Car Animation */}
        <div className="mx-auto w-full relative z-10">
          <CableCarAnimation />
        </div>

        {/* SECTION: Partnership */}
        <section className="w-full bg-[#E0F2F1] relative z-0 py-8 md:py-16 -mt-4 md:-mt-10 rounded-t-[1.5rem] md:rounded-t-[3rem]">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex justify-center mb-4 md:mb-6">
              <h2 className="bg-[#3A5A40] text-white text-lg md:text-xl font-bold px-6 md:px-8 py-2 rounded-full shadow-md">
                Đối tác
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {/* Card 1: Hệ thống khách sạn uy tín (Image Left - Text Right) */}
              <div className="bg-[#D8F3DC] rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-sm border border-white/50">
                <div className="w-full md:w-1/3 h-40 md:h-48 relative bg-white/30 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="https://i.ibb.co/fz5Jq730/khach-san-ho-chi-minh-2.jpg"
                    alt="Hệ thống khách sạn"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1 text-[#1B4D3E]">
                  <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-3">
                    Hệ thống khách sạn uy tín
                  </h3>

                  <p className="text-xs md:text-base leading-relaxed font-medium opacity-80 text-justify">
                    Travel Path hợp tác với hệ thống khách sạn uy tín trên khắp
                    Việt Nam, từ khách sạn trung tâm thành phố đến khu nghỉ
                    dưỡng tại các điểm du lịch nổi tiếng, mang đến lựa chọn lưu
                    trú đa dạng, tiện nghi và đáng tin cậy cho mọi hành trình.
                  </p>
                </div>
              </div>

              {/* Card 2: Địa điểm du lịch nổi tiếng (Text Left - Image Right) */}
              <div className="bg-[#D8F3DC] rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-sm border border-white/50">
                <div className="flex-1 order-2 md:order-1 text-[#1B4D3E]">
                  <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-3">
                    Địa điểm du lịch nổi tiếng
                  </h3>

                  <p className="text-xs md:text-base leading-relaxed font-medium opacity-80 text-justify">
                    Travel Path hợp tác với hệ thống khách sạn uy tín trên khắp
                    cả nước, hiện diện tại nhiều điểm du lịch nổi tiếng như Đà
                    Lạt, Đà Nẵng, Nha Trang, Phú Quốc, Hội An hay Hà Nội và
                    TP.HCM. Các đối tác được chọn lọc kỹ lưỡng dựa trên chất
                    lượng dịch vụ và độ tin cậy, giúp người dùng dễ dàng đặt
                    phòng, an tâm lưu trú và tận hưởng trọn vẹn hành trình du
                    lịch của mình.
                  </p>
                </div>

                <div className="w-full md:w-1/3 h-40 md:h-48 relative bg-gray-200 rounded-xl md:rounded-2xl overflow-hidden order-1 md:order-2">
                  <Image
                    src="https://i.ibb.co/tW7KmSC/download-8.jpg"
                    alt="Địa điểm du lịch"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeedbackCarousel />
      </main>
    </PageTransition>
  );
}
