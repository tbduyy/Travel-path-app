"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
    placeName?: string;
    address?: string;
    defaultCenter?: [number, number];
}

export default function MapComponent({ placeName, address, defaultCenter = [11.9404, 108.4583] }: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        // Initialize map only once
        if (!mapRef.current) {
            mapRef.current = L.map("map-container", {
                center: defaultCenter,
                zoom: 13,
                zoomControl: true,
            });

            // Add OpenStreetMap tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapRef.current);
        }

        return () => {
            // Cleanup on unmount
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Remove existing marker
        if (markerRef.current) {
            markerRef.current.remove();
        }

        // If we have a place name, try to geocode it
        if (placeName && address) {
            const query = encodeURIComponent(`${placeName}, ${address}`);

            // Use Nominatim geocoding service (free OpenStreetMap geocoder)
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);

                        // Update map center
                        mapRef.current?.setView([lat, lon], 15);

                        // Add marker
                        markerRef.current = L.marker([lat, lon])
                            .addTo(mapRef.current!)
                            .bindPopup(`<b>${placeName}</b><br>${address}`)
                            .openPopup();
                    }
                })
                .catch(err => console.error("Geocoding error:", err));
        }
    }, [placeName, address]);

    return (
        <div
            id="map-container"
            className="w-full h-full rounded-3xl overflow-hidden"
            style={{ minHeight: "500px" }}
        />
    );
}
