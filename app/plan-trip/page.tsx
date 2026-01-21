import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import PlaceCard from "@/components/ui/PlaceCard";
import ItineraryView from "@/components/ui/ItineraryView";

// Disable caching for demo purposes to see direct DB updates
export const dynamic = 'force-dynamic';

export default async function PlanTripPage() {
    // Fetch places from database
    const places = await prisma.place.findMany();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Dark Header for contrast on map page, or reuse transparent if we have hero */}
            <div className="bg-primary relative z-50 h-20">
                <Header />
            </div>

            <main className="flex-1 flex h-[calc(100vh-80px)] mt-20">

                {/* Left Panel: List of Places */}
                <div className="w-[450px] shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50 flex flex-col">

                    <div className="p-6 pb-2 sticky top-0 bg-gray-50 z-10">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore Attractions</h1>
                        <p className="text-gray-500 text-sm mb-4">Found {places.length} places in Dalat</p>

                        {/* Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {['All', 'Attraction', 'Hotel', 'Restaurant', 'Cafe'].map((filter) => (
                                <button
                                    key={filter}
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 pt-0 space-y-4">
                        {places.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}

                        {places.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                No places found in database.
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Panel: Map & Itinerary */}
                <div className="flex-1 bg-zinc-900 relative flex flex-col">
                    {/* Toggle Controls (Visual Only for MVP) */}
                    <div className="absolute top-4 right-4 z-20 flex bg-zinc-800 rounded-lg p-1 border border-white/10">
                        <button className="px-4 py-1.5 rounded-md text-xs font-bold text-white bg-zinc-700 shadow-sm">Itinerary</button>
                        <button className="px-4 py-1.5 rounded-md text-xs font-bold text-white/50 hover:text-white">Map</button>
                    </div>

                    {/* Itinerary View */}
                    <ItineraryView />

                </div>

            </main>
        </div>
    );
}
