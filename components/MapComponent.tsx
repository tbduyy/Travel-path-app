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

interface MapMarker {
    id: string;
    name: string;
    description?: string;
    address?: string;
    city?: string;
    isViewed?: boolean;
    lat?: number;
    lng?: number;
}

interface MapComponentProps {
    markers: MapMarker[];
    defaultCenter?: [number, number];
    isStatic?: boolean;
    showRoutes?: boolean;
}

export default function MapComponent({
    markers,
    defaultCenter = [11.9404, 108.4583],
    isStatic = false,
    showRoutes = false
}: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const routesLayerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map-container", {
                center: defaultCenter,
                zoom: 13,
                zoomControl: !isStatic,
                dragging: !isStatic,
                touchZoom: !isStatic,
                doubleClickZoom: !isStatic,
                scrollWheelZoom: !isStatic,
                boxZoom: !isStatic,
                keyboard: !isStatic,
            });

            // Standard OpenStreetMap (Light Mode)
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapRef.current);

            routesLayerRef.current = L.layerGroup().addTo(mapRef.current);
            markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

        // Clear existing layers
        markersLayerRef.current.clearLayers();
        routesLayerRef.current.clearLayers();

        if (markers.length === 0) return;

        const bounds = L.latLngBounds([]);

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Helper to add marker
        const addMarkerToMap = (lat: number, lon: number, marker: MapMarker) => {
            const latLng = L.latLng(lat, lon);
            const isHotel = marker.isViewed; // In Step 2, viewed place is the hotel

            if (isHotel) {
                // Hotel Marker (Red Pin)
                const customIcon = L.divIcon({
                    className: 'custom-map-marker',
                    html: `
                        <div style="position: relative; width: 300px; transform: translate(-36%, -100%);">
                            <div style="display: flex; align-items: flex-end; gap: 8px;">
                                <div style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#EF4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3" fill="white"></circle>
                                    </svg>
                                </div>
                                <div style="background: white; padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; color: #0F172A; min-width: 200px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);">
                                    <h3 style="font-weight: 900; font-size: 14px; margin-bottom: 4px; color: #1B4D3E; font-family: sans-serif;">${marker.name}</h3>
                                    <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: sans-serif;">${marker.description || marker.address || 'Địa điểm lưu trú'}</p>
                                    <div style="margin-top: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #EF4444; letter-spacing: 0.5px; font-family: sans-serif;">Đang chọn</div>
                                </div>
                            </div>
                        </div>
                    `,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                });
                L.marker(latLng, { icon: customIcon, zIndexOffset: 1000 }).addTo(markersLayerRef.current!);
            } else {
                // Attraction Marker (Green Dot)
                const simpleIcon = L.divIcon({
                    className: 'simple-dot-marker',
                    html: `<div style="width: 14px; height: 14px; background-color: #2E968C; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                });
                L.marker(latLng, { icon: simpleIcon }).addTo(markersLayerRef.current!);
            }
            return latLng;
        };

        // Fetch route from OSRM
        const fetchRoute = async (start: L.LatLng, end: L.LatLng) => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
                );
                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
                    const duration = Math.round(route.duration / 60); // minutes
                    const distance = (route.distance / 1000).toFixed(1); // km

                    return { coordinates, duration, distance };
                }
            } catch (error) {
                console.error("Routing error:", error);
            }
            return null; // Fallback
        };

        const processMap = async () => {
            let viewedLatLng: L.LatLng | null = null;
            const attractionLatLngs: L.LatLng[] = [];
            let hasValidMarker = false;

            // 1. Resolve Marker Positions (Prioritize existing lat/lng)
            for (const marker of markers) {
                let lat = 0;
                let lon = 0;
                let found = false;

                // Check for explicit coordinates first
                if (marker.lat && marker.lng) {
                    lat = marker.lat;
                    lon = marker.lng;
                    found = true;
                } else {
                    // Fallback to Geocoding
                    try {
                        const query = encodeURIComponent(`${marker.name}, ${marker.address || ""}, ${marker.city || ""}`);
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
                        const data = res.ok ? await res.json() : [];

                        if (data.length > 0) {
                            lat = parseFloat(data[0].lat);
                            lon = parseFloat(data[0].lon);
                            found = true;
                        } else {
                            await delay(1100);
                            const query2 = encodeURIComponent(`${marker.name} ${marker.city || "Việt Nam"}`);
                            const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query2}&limit=1`);
                            const data2 = res2.ok ? await res2.json() : [];
                            if (data2.length > 0) {
                                lat = parseFloat(data2[0].lat);
                                lon = parseFloat(data2[0].lon);
                                found = true;
                            }
                        }

                        if (!found) {
                            // Ultimate fallback
                            const offsetLat = (Math.random() - 0.5) * 0.05;
                            const offsetLon = (Math.random() - 0.5) * 0.05;
                            lat = defaultCenter[0] + offsetLat;
                            lon = defaultCenter[1] + offsetLon;
                            found = true;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }

                if (found) {
                    const resultLatLng = addMarkerToMap(lat, lon, marker);
                    if (resultLatLng) {
                        bounds.extend(resultLatLng);
                        hasValidMarker = true;
                        if (marker.isViewed) viewedLatLng = resultLatLng;
                        else attractionLatLngs.push(resultLatLng);
                    }
                }

                // If we geocoded, be nice to the API. If we used cached lat/lng, no delay needed!
                if (!marker.lat || !marker.lng) {
                    await delay(1100);
                }
            }

            // 2. Draw Real Routes
            if (showRoutes && viewedLatLng && attractionLatLngs.length > 0) {
                for (const destLatLng of attractionLatLngs) {
                    const routeData = await fetchRoute(viewedLatLng, destLatLng);

                    if (routeData) {
                        const polyline = L.polyline(routeData.coordinates as L.LatLngExpression[], {
                            color: '#3B82F6',
                            weight: 6,
                            opacity: 0.8,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }).addTo(routesLayerRef.current!);

                        // User requested to remove the duration tooltip on map
                        // Just extending bounds
                        routeData.coordinates.forEach(c => bounds.extend(c as L.LatLngExpression));
                    } else {
                        L.polyline([viewedLatLng, destLatLng], {
                            color: '#3B82F6',
                            weight: 3,
                            dashArray: '10, 10',
                            opacity: 0.5
                        }).addTo(routesLayerRef.current!);
                    }
                    await delay(500);
                }
            }

            // 3. Fit Bounds / Adjust View
            if (mapRef.current) {
                const shouldFitBounds = showRoutes || (viewedLatLng && attractionLatLngs.length > 0) || (!viewedLatLng && hasValidMarker);

                if (shouldFitBounds && bounds.isValid()) {
                    mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                } else if (viewedLatLng) {
                    mapRef.current.flyTo(viewedLatLng, 15, { duration: 1.5 });
                } else if (hasValidMarker && bounds.isValid()) {
                    mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                }
            }
        };

        processMap();

    }, [markers, showRoutes]);

    return (
        <div
            id="map-container"
            className="w-full h-full rounded-3xl overflow-hidden bg-white"
            style={{ minHeight: "500px" }}
        />
    );
}
