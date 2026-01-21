import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Place } from "@/lib/types";
import AddToTripButton from "./AddToTripButton";

interface PlaceCardProps {
    place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
    return (
        <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                {place.image ? (
                    <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{place.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-900 bg-secondary px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {place.rating}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{place.address}</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {place.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide border border-primary/20 px-2 py-0.5 rounded-md">
                        {place.type}
                    </span>

                    <AddToTripButton placeId={place.id} />
                </div>
            </div>
        </div>
    );
}
