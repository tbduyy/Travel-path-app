import Header from "@/components/layout/Header";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function AboutPage() {
  // Safety check: accessing prisma.siteContent might fail if client isn't generated
  const vision = prisma.siteContent
    ? await prisma.siteContent.findUnique({ where: { key: "vision" } })
    : null;
  const mission = prisma.siteContent
    ? await prisma.siteContent.findUnique({ where: { key: "mission" } })
    : null;

  const visionContent =
    vision?.content ||
    "Travel Path hướng đến việc trở thành một nền tảng xây dựng hành trình du lịch cá nhân hóa từ những ý tưởng ban đầu đến một lộ trình tối ưu phù hợp với sở thích, nhu cầu và phong cách du lịch cá nhân.";
  const missionContent =
    mission?.content ||
    "Travel Path mang đến một hệ sinh thái thông minh nhằm cung cấp các lựa chọn về địa điểm tham quan, vui chơi giải trí đến nơi lưu trú và tiện ích về phương tiện di chuyển cho người dùng. Không chỉ dừng lại ở việc lên kế hoạch, công nghệ mà Travel Path mang lại còn giúp người dùng tận hưởng trọn vẹn chuyến đi thông qua người bạn đồng hành - Hướng dẫn viên AI hỗ trợ xuyên suốt hành trình của bạn.";

  return (
    <main className="min-h-screen bg-[#BBD9D9] relative font-sans text-[#1B4D3E]">
      <Header />

      <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
        {/* Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#1B4D3E]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#2E968C]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 md:p-16 shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-16">
            <span className="text-[#2E968C] font-bold tracking-widest uppercase text-sm mb-2 block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase text-[#1B4D3E]">
              Về Travel Path
            </h1>
            <div className="w-24 h-1.5 bg-[#F4A261] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Tầm nhìn */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-[#E8F1F0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B4D3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold uppercase text-[#1B4D3E]">
                Tầm nhìn
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 font-medium whitespace-pre-line">
                {visionContent}
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-[#FFF4E6] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F4A261"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold uppercase text-[#1B4D3E]">
                Sứ mệnh
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 font-medium text-justify whitespace-pre-line">
                {missionContent}
              </p>
            </div>
          </div>

          {/* Quote / Conclusion */}
          <div className="mt-16 bg-[#1B4D3E] text-white rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Image
                src="/assets/plan-trip/rectangle-7.png"
                alt="Pattern"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-4 italic">
                “Một cú chạm, vạn hành trình”
              </h3>
              <p className="text-lg md:text-xl font-medium text-white/90 max-w-2xl mx-auto leading-relaxed">
                Travel Path là cầu nối giúp mỗi chuyến đi không chỉ là một hành
                trình thông thường, mà còn là trải nghiệm được thiết kế riêng,
                đúng với nhu cầu và chạm đến cảm xúc của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="w-full h-32 relative mt-auto"></div>
    </main>
  );
}
