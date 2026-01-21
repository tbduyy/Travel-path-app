import { prisma } from "@/lib/db";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

export default async function ItineraryView() {
    // Fetch latest trip and its items
    const trip = await prisma.trip.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: { place: true },
                orderBy: { order: "asc" }
            }
        }
    });

    if (!trip || trip.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 opacity-50" />
                </div>
                <p>Your itinerary is empty.</p>
                <p className="text-xs">Add places from the list to start planning!</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 text-white overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-primary-light px-2 py-1 rounded-md text-sm">Day 1</span>
                {trip.destination}
            </h2>

            <div className="relative pl-6 border-l-2 border-dashed border-white/20 space-y-8">
                {trip.items.map((item, index) => (
                    <div key={item.id} className="relative group">
                        {/* Timestamp Dot */}
                        <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-secondary border-4 border-zinc-900 shadow-sm" />

                        {/* Time Label */}
                        <div className="absolute -left-[85px] top-0 text-xs font-mono text-white/60 w-12 text-right">
                            0{8 + index}:00
                        </div>

                        {/* Card */}
                        <div className="bg-zinc-800/80 backdrop-blur border border-white/10 rounded-xl p-3 hover:bg-zinc-800 transition-colors flex gap-3">
                            <div className="relative w-16 h-16 bg-zinc-700 rounded-lg overflow-hidden shrink-0">
                                {item.place.image && (
                                    <Image src={item.place.image} alt={item.place.name} fill className="object-cover" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.place.name}</h4>
                                <p className="text-xs text-white/50 truncate mb-2">{item.place.type}</p>

                                <div className="flex items-center gap-2 text-[10px] text-secondary font-medium">
                                    <Clock className="w-3 h-3" />
                                    <span>60 mins</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}

                {/* End Point */}
                <div className="relative">
                    <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-zinc-800 border-2 border-white/20" />
                    <div className="text-sm text-white/40 italic">End of Day 1</div>
                </div>
            </div>

        </div>
    );
}
