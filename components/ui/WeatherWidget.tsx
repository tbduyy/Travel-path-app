"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudLightning,
  CloudSnow,
  MapPin,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  locationName: string;
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key + TTL (10 minutes)
  const CACHE_KEY = "travel_path_weather_cache";
  const TTL_MS = 10 * 60 * 1000; // 10 minutes

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    // If cached and fresh, use it
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed?.timestamp &&
          Date.now() - parsed.timestamp < TTL_MS &&
          parsed?.data
        ) {
          setData(parsed.data as WeatherData);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    // Define the content fetching logic as a reusable function
    const getWeatherData = async (
      lat: number,
      lon: number,
      locationFallback?: string
    ) => {
      try {
        // 1. Get Weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherJson = await weatherRes.json();

        // 2. Get Location Name (if not provided)
        let locationName = locationFallback;
        if (!locationName) {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const geoJson = await geoRes.json();
          locationName =
            geoJson.address.city ||
            geoJson.address.town ||
            geoJson.address.municipality ||
            "My Location";
        }

        setData({
          temperature: Math.round(weatherJson.current.temperature_2m),
          weatherCode: weatherJson.current.weather_code,
          locationName: locationName || "Local Area", // Fallback string
        });
        // Cache the result
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: {
                temperature: Math.round(weatherJson.current.temperature_2m),
                weatherCode: weatherJson.current.weather_code,
                locationName: locationName || "Local Area",
              },
            })
          );
        } catch (e) {
          // ignore storage errors
        }
        setLoading(false);
      } catch (err: any) {
        setError(`Data Error: ${err.message}`);
        setLoading(false);
      }
    };

    // Fallback: IP-based Location
    const fetchByIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP Service Unavailable");
        const json = await res.json();
        await getWeatherData(json.latitude, json.longitude, json.city);
      } catch (err) {
        // Final Fallback: Default to Ho Chi Minh City if everything fails
        console.warn("IP Geo failed, using default.");
        // Ho Chi Minh City Coordinates
        await getWeatherData(10.8231, 106.6297, "Ho Chi Minh City");
      }
    };

    if (!navigator.geolocation) {
      fetchByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherData(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.warn("Geo denied, trying IP...", err);
        // If denied or failed, try IP fallback automatically
        fetchByIP();
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Helper to get icon based on weather code
  const getWeatherInfo = (code: number) => {
    if (code === 0 || code === 1)
      return {
        icon: <Sun className="w-12 h-12 text-yellow-400" />,
        label: "Sunny",
      };
    if (code >= 2 && code <= 48)
      return {
        icon: <Cloud className="w-12 h-12 text-gray-200" />,
        label: "Cloudy",
      };
    if (code >= 51 && code <= 67)
      return {
        icon: <CloudRain className="w-12 h-12 text-blue-200" />,
        label: "Rainy",
      };
    if (code >= 71 && code <= 77)
      return {
        icon: <CloudSnow className="w-12 h-12 text-white" />,
        label: "Snowy",
      };
    if (code >= 95)
      return {
        icon: <CloudLightning className="w-12 h-12 text-yellow-200" />,
        label: "Stormy",
      };
    return {
      icon: <Sun className="w-12 h-12 text-yellow-400" />,
      label: "Clear",
    };
  };

  if (loading)
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-blue-500 animate-pulse border border-white/20 shadow-2xl flex items-center justify-center text-white font-medium tracking-wider">
        Getting Location...
      </div>
    );

  // Permission Denied / No Data View
  if (error || !data)
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-center items-center text-center group border border-white/10 font-sans">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
          <MapPin className="w-8 h-8 text-white/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">Notice</h3>
        <p className="text-sm opacity-70 leading-relaxed px-4 mb-6">
          {error || "Unknown error occurred."}
        </p>

        <button
          onClick={fetchWeather}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold transition-colors shadow-lg"
        >
          Try Again
        </button>

        {/* Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      </div>
    );

  const isDay = data?.weatherCode !== undefined ? true : true; // Simplified for now

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-gradient-to-b from-[#2E80C3] to-[#1A5F95] p-6 text-white shadow-2xl overflow-hidden flex flex-col justify-between group hover:scale-105 transition-transform duration-300 font-sans">
      {/* Top Section */}
      <div className="flex justify-between items-start z-10 w-full">
        <div className="flex flex-col max-w-[70%]">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest opacity-80">
            <MapPin className="w-3 h-3" /> Current
          </span>
          <h2 className="text-xl font-bold leading-tight drop-shadow-sm mt-1 line-clamp-2">
            {data?.locationName}
          </h2>
        </div>
        {/* Weather Icon (Glass Circle) */}
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/10 shrink-0">
          <div className="scale-75">
            {getWeatherInfo(data?.weatherCode || 0).icon}
          </div>
        </div>
      </div>

      {/* Middle Section: Temp with Diagonal Line Style */}
      <div className="relative z-10 flex flex-col items-center justify-center -mt-2">
        <div className="relative">
          <span className="text-[5rem] md:text-[6.5rem] font-thin leading-none tracking-tighter drop-shadow-2xl">
            {data?.temperature}
          </span>
          <span className="absolute top-2 -right-4 text-3xl font-light opacity-80">
            °
          </span>

          {/* Decorative Diagonal Line (Clean separator style) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 transform origin-center" />
        </div>

        <div className="flex flex-col items-center mt-1">
          <p className="text-lg font-medium opacity-90 capitalize">
            {getWeatherInfo(data?.weatherCode || 0).label}
          </p>
          <p className="text-xs font-medium opacity-70 mt-0.5">
            H:{data?.temperature! + 2}° L:{data?.temperature! - 2}°
          </p>
        </div>
      </div>

      {/* Bottom Glass Card (Forecast Placeholder) - Simplified/Clean */}
      <div className="relative z-10 w-full bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex justify-between items-center text-center">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] opacity-70">{18 + i}:00</span>
            <div className="opacity-90 scale-75">
              {i % 2 === 0 ? (
                <Cloud className="w-4 h-4" />
              ) : (
                <CloudRain className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-semibold">
              {data?.temperature! - i}°
            </span>
          </div>
        ))}

        {/* Visual indicator that this is a forecast */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
    </div>
  );
}
