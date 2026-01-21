import Header from "@/components/layout/Header";
import SearchWidget from "@/components/ui/SearchWidget";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center">

      {/* Hero Background */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
          alt="Nature Landscape"
          fill
          className="object-cover brightness-75"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
      </div>

      <Header />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col items-center justify-center min-h-[85vh] text-center pt-20">

        <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tight drop-shadow-2xl mb-6 max-w-4xl leading-[1.1]">
          MAKE YOUR <br />
          <span className="text-secondary font-medium italic drop-shadow-lg">Dream Trip</span>
        </h1>

        <p className="text-white/90 text-xl font-medium mb-12 max-w-lg drop-shadow-md">
          Discover the most beautiful places in Dalat and create your perfect itinerary in seconds.
        </p>

        <SearchWidget />

        {/* Floating Badges/Partnerships (Visual Polish) */}
        <div className="absolute bottom-12 left-8 hidden md:flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs font-semibold border border-white/20">
            Trusted by 50k+ travelers
          </div>
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
            <div className="bg-[#B7E4C7] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="w-full md:w-1/3 h-48 relative bg-white/30 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Placeholder for Grab illustration */}
                <Image
                  src="https://images.unsplash.com/photo-1616077303039-4d642db4d343?q=80&w=2669&auto=format&fit=crop"
                  alt="Grab Service"
                  fill
                  className="object-cover opacity-80"
                  unoptimized
                />
                <span className="relative z-10 font-bold text-2xl text-[#00B14F]">Grab</span>
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Grab</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Grab là ứng dụng du lịch đa dịch vụ hàng đầu tại Việt Nam... (Grab is the leading multi-service app in Vietnam).
                  Book rides easily to move between locations.
                </p>
              </div>
            </div>

            {/* Hotel Colline */}
            <div className="bg-[#D8F3DC] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white/50">
              <div className="flex-1 order-2 md:order-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Hotel Colline</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Hotel Colline là khách sạn 4 sao nổi bật... (Hotel Colline is a prominent 4-star hotel in the center of Dalat).
                  Located right at Dalat Market.
                </p>
              </div>
              <div className="w-full md:w-1/3 h-48 relative bg-gray-200 rounded-2xl overflow-hidden order-1 md:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
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
                  src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2670&auto=format&fit=crop"
                  alt="Le Rabelais"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 text-[#1B4D3E]">
                <h3 className="text-2xl font-bold mb-2">Nhà Hàng Le Rabelais</h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  Le Rabelais là nhà hàng sang trọng... (Le Rabelais is a luxury French restaurant at Dalat Palace).
                  Experience fine dining with a view.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Arrows (Visual) */}
          <div className="flex justify-center gap-4 mt-8 text-[#1B4D3E]">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-current border-b-[10px] border-b-transparent transform rotate-180 opacity-50 cursor-pointer" />
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-current border-b-[10px] border-b-transparent cursor-pointer hover:scale-110 transition-transform" />
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
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-current border-b-[10px] border-b-transparent transform rotate-180 cursor-pointer hover:scale-110" />
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-current border-b-[10px] border-b-transparent cursor-pointer hover:scale-110" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white relative z-20 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Logo Icon Placeholder */}
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <span className="text-2xl font-bold text-primary tracking-tight">TRAVEL PATH</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest ml-10">Your real adventures start here</p>
          </div>

          <div className="mt-8 md:mt-0 space-y-2 text-sm text-[#1B4D3E] font-medium">
            <p><span className="font-bold">Địa chỉ:</span> FPT University</p>
            <p><span className="font-bold">Hotline:</span> 090 123 4567</p>
            <p><span className="font-bold">Email:</span> travelpath.vn@gmail.com</p>
            <p><span className="font-bold">Website:</span> click to view</p>
          </div>
        </div>
      </footer>

    </main >
  );
}
