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
    order?: number;
}

interface MapComponentProps {
    markers: MapMarker[];
    defaultCenter?: [number, number];
    isStatic?: boolean;
    showRoutes?: boolean;
    sequentialRoute?: boolean;
}

export default function MapComponent({
    markers,
    defaultCenter = [11.9404, 108.4583],
    isStatic = false,
    showRoutes = false,
    sequentialRoute = false
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

            if (marker.order) {
                // Numbered Marker
                const numberedIcon = L.divIcon({
                    className: 'custom-numbered-marker',
                    html: `
                        <div style="position: relative;">
                            <div style="
                                background-color: ${marker.order === 1 ? '#F59E0B' : (marker.order % 2 === 0 ? '#10B981' : '#8B5CF6')}; 
                                color: white; 
                                width: 32px; 
                                height: 32px; 
                                border-radius: 50% 50% 50% 0; 
                                transform: rotate(-45deg); 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                border: 3px solid white; 
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
                            ">
                                <span style="transform: rotate(45deg); font-weight: 900; font-size: 14px;">${marker.order}</span>
                            </div>
                            <div style="
                                position: absolute; 
                                top: -40px; 
                                left: 50%; 
                                transform: translateX(-50%); 
                                background: white; 
                                padding: 4px 8px; 
                                border-radius: 6px; 
                                font-weight: bold; 
                                font-size: 11px; 
                                white-space: nowrap; 
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                                color: #1F2937;
                                opacity: 0.9;
                            ">
                                ${marker.name}
                            </div>
                        </div>
                    `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                });
                L.marker(latLng, { icon: numberedIcon, zIndexOffset: 1000 - (marker.order || 0) }).addTo(markersLayerRef.current!);
            } else {
                const isHotel = marker.isViewed;
                if (isHotel) {
                    // Hotel Marker (Red Pin) - existing code preserved but simplified for this view
                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `
                            <div style="width: 30px; height: 30px; background: #EF4444; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
                        `,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
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
                    return { coordinates };
                }
            } catch (error) {
                console.error("Routing error:", error);
            }
            return null; // Fallback
        };

        const processMap = async () => {
            const validLatLngs: { latLng: L.LatLng, order?: number }[] = [];

            // 1. Resolve Marker Positions
            for (const marker of markers) {
                let lat = 0;
                let lon = 0;
                let found = false;

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
                            await delay(800);
                            const query2 = encodeURIComponent(`${marker.name} ${marker.city || "Việt Nam"}`);
                            const res2 = res.ok ? await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query2}&limit=1`) : { ok: false, json: async () => [] };
                            const data2 = res2.ok ? await res2.json() : [];
                            if (data2.length > 0) {
                                lat = parseFloat(data2[0].lat);
                                lon = parseFloat(data2[0].lon);
                                found = true;
                            }
                        }
                    } catch (e) { console.error(e); }
                }

                if (found) {
                    // Jitter slightly if duplicate to avoid stacking exact same points
                    const isDuplicate = validLatLngs.some(p => Math.abs(p.latLng.lat - lat) < 0.0001 && Math.abs(p.latLng.lng - lon) < 0.0001);
                    if (isDuplicate) {
                        lat += (Math.random() - 0.5) * 0.002;
                        lon += (Math.random() - 0.5) * 0.002;
                    }

                    const resultLatLng = addMarkerToMap(lat, lon, marker);
                    if (resultLatLng) {
                        bounds.extend(resultLatLng);
                        validLatLngs.push({ latLng: resultLatLng, order: marker.order });
                    }

                    if (!marker.lat || !marker.lng) await delay(800);
                }
            }

            // 2. Draw Routes
            if (showRoutes && validLatLngs.length > 1) {
                // Determine pairs based on mode
                let pairs: { start: L.LatLng, end: L.LatLng }[] = [];

                if (sequentialRoute) {
                    // Sequential: 1->2, 2->3, etc.
                    // Sort by order just in case
                    validLatLngs.sort((a, b) => (a.order || 0) - (b.order || 0));

                    for (let i = 0; i < validLatLngs.length - 1; i++) {
                        pairs.push({ start: validLatLngs[i].latLng, end: validLatLngs[i + 1].latLng });
                    }
                } else {
                    // Classic Hub-and-Spoke (first one is hub, rest are spokes - simplified logic for now)
                    // Currently Step 1 logic is handled outside map component mostly, but if needed:
                    const hub = validLatLngs.find(p => p.order === undefined && validLatLngs[0]) || validLatLngs[0];
                    // ... avoiding this complex logic for now as Step 2 is the priority
                }

                // Draw segments
                for (const pair of pairs) {
                    const routeData = await fetchRoute(pair.start, pair.end);
                    const color = sequentialRoute ? '#8B5CF6' : '#3B82F6'; // Purple for sequence, Blue for explore

                    if (routeData) {
                        L.polyline(routeData.coordinates as L.LatLngExpression[], {
                            color: color,
                            weight: 4,
                            opacity: 0.8,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }).addTo(routesLayerRef.current!);

                        // Decorate with arrows if sequential
                        if (sequentialRoute) {
                            // Advanced: Leaflet doesn't support arrows on polylines natively without plugins
                            // So we just rely on numbers to show direction
                        }
                    } else {
                        // Fallback straight line
                        L.polyline([pair.start, pair.end], {
                            color: color,
                            weight: 2,
                            dashArray: '5, 10',
                            opacity: 0.6
                        }).addTo(routesLayerRef.current!);
                    }
                    await delay(300);
                }
            }

            // 3. Fit Bounds / Adjust View
            if (mapRef.current) {
                const shouldFitBounds = showRoutes || (validLatLngs.length > 0);

                if (shouldFitBounds && bounds.isValid()) {
                    mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                }
            }
        };

        processMap();

    }, [markers, showRoutes, sequentialRoute]);

    return (
        <div
            id="map-container"
            className="w-full h-full rounded-3xl overflow-hidden bg-white"
            style={{ minHeight: "500px" }}
        />
    );
}
