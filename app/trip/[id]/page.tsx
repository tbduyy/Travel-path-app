import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { Calendar, Clock, MapPin, Navigation, DollarSign } from "lucide-react";

// Use a singleton prisma instance in a real app, instantiating here for simplicity in this file
const prisma = new PrismaClient();

async function getTrip(id: string) {
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    place: true,
                },
                orderBy: {
                    order: 'asc',
                },
            },
        },
    });
    return trip;
}

export default async function TripDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params; // Await params as per Next.js 15+
    const trip = await getTrip(id);

    if (!trip) {
        return <div className="p-10 text-center">Trip not found</div>;
    }

    // Group items by day
    const itemsByDay = trip.items.reduce((acc, item) => {
        const day = item.dayIndex;
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
    }, {} as Record<number, typeof trip.items>);

    const days = Object.keys(itemsByDay).map(Number).sort((a, b) => a - b);

    return (
        <div className="min-h-screen bg-[#F0F7F7] font-sans pb-20">
            <Header />

            {/* Banner / Header Info */}
            <div className="relative h-64 md:h-80 w-full">
                <Image
                    src="/assets/plan-trip/rectangle-7.png"
                    alt="Trip Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-2">Hành Trình {trip.destination}</h1>
                    <div className="flex gap-6 text-sm md:text-lg font-medium backdrop-blur-sm bg-white/20 px-6 py-2 rounded-full">
                        <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /> 3 Ngày 2 Đêm</div>
                        <div className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> {trip.budget}</div>
                        <div className="flex items-center gap-2"><Navigation className="w-5 h-5" /> {trip.style}</div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">

                {/* Timeline */}
                {days.map((day) => (
                    <div key={day} className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-[#1B4D3E] text-white px-6 py-2 rounded-r-full text-xl font-bold shadow-lg">
                                Ngày {day}
                            </div>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>

                        <div className="space-y-6">
                            {itemsByDay[day].map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                    {/* Time & Transit Column */}
                                    <div className="md:w-48 bg-[#E6F2F0] p-6 flex flex-col justify-center items-center text-center border-r border-[#D8F3DC]">
                                        <div className="text-2xl font-bold text-[#1B4D3E]">{item.startTime}</div>
                                        {item.endTime && <div className="text-sm text-gray-500 font-medium mb-2"> - {item.endTime}</div>}

                                        {item.transitDuration && (
                                            <div className="mt-3 flex flex-col items-center text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                                <Clock className="w-3 h-3 mb-1 text-[#1B4D3E]" />
                                                <span>{item.transitDuration}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#1B4D3E]">{item.title || item.place.name}</h3>
                                                    <p className="text-sm font-semibold text-[#1B4D3E]/70 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-4 h-4" /> {item.place.city}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.place.type === 'HOTEL' ? 'bg-blue-100 text-blue-700' :
                                                        item.place.type === 'TRANSIT' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-[#D8F3DC] text-[#1B4D3E]'
                                                    }`}>
                                                    {item.place.type}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed">{item.description || item.place.description}</p>

                                            {item.cost && (
                                                <div className="inline-block mt-3 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-xs font-semibold">
                                                    Chi phí: {item.cost}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2 italic flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {item.place.address}
                                            </p>
                                        </div>

                                        {/* Image */}
                                        <div className="w-full md:w-48 h-32 md:h-auto relative rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={item.place.image || "/placeholder.png"}
                                                alt={item.place.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Reference Table - Transport Options */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mt-12 mb-20">
                    <h2 className="text-2xl font-bold text-[#1B4D3E] mb-6 flex items-center gap-2">
                        <Navigation className="w-6 h-6" /> Phương tiện di chuyển (Gợi ý)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#E6F2F0] text-[#1B4D3E]">
                                    <th className="p-4 rounded-tl-xl">Chiều</th>
                                    <th className="p-4">Phương tiện</th>
                                    <th className="p-4">Thời gian</th>
                                    <th className="p-4">Khung giờ gợi ý</th>
                                    <th className="p-4 rounded-tr-xl">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-semibold">HCM → NT</td>
                                    <td className="p-4">Máy bay</td>
                                    <td className="p-4">~3h tổng</td>
                                    <td className="p-4">05:30–08:10</td>
                                    <td className="p-4 text-green-600 font-medium">Nhanh, hợp 2N1Đ</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">HCM → NT</td>
                                    <td className="p-4">Tàu hỏa</td>
                                    <td className="p-4">7–9h</td>
                                    <td className="p-4">20:00–22:00</td>
                                    <td className="p-4">Đi đêm, ngắm cảnh</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">HCM → NT</td>
                                    <td className="p-4">Xe khách</td>
                                    <td className="p-4">8–10h</td>
                                    <td className="p-4">20:00–22:00</td>
                                    <td className="p-4">Tiết kiệm</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 bg-[#F9FCFB]">
                                    <td className="p-4 font-semibold">NT → HCM</td>
                                    <td className="p-4">Máy bay</td>
                                    <td className="p-4">~3h tổng</td>
                                    <td className="p-4">18:00–20:10</td>
                                    <td className="p-4 text-green-600 font-medium">Đỡ mệt</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 bg-[#F9FCFB]">
                                    <td className="p-4">NT → HCM</td>
                                    <td className="p-4">Tàu hỏa</td>
                                    <td className="p-4">7–9h</td>
                                    <td className="p-4">20:00–22:00</td>
                                    <td className="p-4">Ngủ trên tàu</td>
                                </tr>
                                <tr className="hover:bg-gray-50 bg-[#F9FCFB]">
                                    <td className="p-4">NT → HCM</td>
                                    <td className="p-4">Xe khách</td>
                                    <td className="p-4">8–10h</td>
                                    <td className="p-4">19:00–21:00</td>
                                    <td className="p-4">Rẻ nhất</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
