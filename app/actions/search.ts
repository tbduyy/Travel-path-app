"use server";

import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

export type SearchParams = {
  destination?: string;
  dates?: string;
  people?: string;
  budget?: string;
  style?: string;
  type?: string; // HOTEL, ATTRACTION, RESTAURANT
};

// MOCK DATA REMOVED - Migrated to DB

export async function searchPlaces(params: SearchParams) {
  try {
    const filters: any = {};
    const destLower = params.destination
      ? params.destination.toLowerCase()
      : "";

    // --- NHA TRANG LOGIC REMOVED (Migrated to DB) ---

    // --- STANDARD LOGIC (DA LAT & OTHERS) ---
    if (params.type) {
      filters.type = params.type;
    }

    if (params.destination && params.destination.trim() !== "") {
      filters.OR = [
        { name: { contains: params.destination, mode: "insensitive" } },
        { description: { contains: params.destination, mode: "insensitive" } },
        { address: { contains: params.destination, mode: "insensitive" } },
        { city: { contains: params.destination, mode: "insensitive" } },
      ];
    }

    const places = await prisma.place.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        rating: true,
        priceLevel: true,
        address: true,
        price: true,
        metadata: true,
        city: true,
        duration: true,
        lat: true,
        lng: true,
      },
      take: 50,
    });

    let tripId = null;
    if (params.destination) {
      const trip = await prisma.trip.findFirst({
        where: {
          destination: { contains: params.destination, mode: "insensitive" },
        },
        select: { id: true },
      });
      if (trip) tripId = trip.id;
    }

    // Fix coordinates for demo/mock places to ensure map looks good
    let fixedPlaces = places.map((p) => {
      const nameLower = p.name.toLowerCase();
      let lat = p.lat;
      let lng = p.lng;

      // DA LAT FIXES
      if (nameLower.includes("mountain nest villa")) {
        lat = 11.9542;
        lng = 108.444;
      } else if (nameLower.includes("ttc hotel premium")) {
        lat = 11.9423;
        lng = 108.4375;
      } else if (nameLower.includes("đà lạt thiên vương")) {
        lat = 11.9556;
        lng = 108.4651;
      } else if (nameLower.includes("thanh tước farm")) {
        lat = 12.0901;
        lng = 108.4752;
      } else if (nameLower.includes("zoodoo")) {
        lat = 12.1324;
        lng = 108.4813;
      } else if (nameLower.includes("puppy farm")) {
        lat = 11.9329;
        lng = 108.4067;
      } else if (nameLower.includes("điêu khắc")) {
        lat = 11.8906;
        lng = 108.419;
      } else if (nameLower.includes("datanla")) {
        lat = 11.9038;
        lng = 108.4485;
      } else if (nameLower.includes("langbiang")) {
        lat = 12.0435;
        lng = 108.4354;
      } else if (nameLower.includes("hồ xuân hương")) {
        lat = 11.9404;
        lng = 108.4583;
      } else if (
        nameLower.includes("chợ đà lạt") ||
        nameLower.includes("night market")
      ) {
        lat = 11.9416;
        lng = 108.4367;
      }

      // NHA TRANG FIXES
      else if (nameLower.includes("vinwonders")) {
        lat = 12.2215;
        lng = 109.2458;
      } else if (nameLower.includes("tour 3 đảo")) {
        lat = 12.2023;
        lng = 109.214;
      } else if (nameLower.includes("quảng trường 2/4")) {
        lat = 12.2388;
        lng = 109.1967;
      } else if (nameLower.includes("nem nướng đặng văn quyên")) {
        lat = 12.2475;
        lng = 109.192;
      } else if (nameLower.includes("hải sản thanh sương")) {
        lat = 12.2081;
        lng = 109.215;
      } else if (nameLower.includes("bảo tàng hải dương học")) {
        lat = 12.2078;
        lng = 109.2144;
      } else if (
        nameLower.includes("đập thủy điện am chúa") ||
        nameLower.includes("hồ am chúa")
      ) {
        lat = 12.2687;
        lng = 109.0763;
      } else if (
        nameLower.includes("nhà hát đó") ||
        nameLower.includes("vega city")
      ) {
        lat = 12.2959;
        lng = 109.2135;
      } else if (nameLower.includes("cơm gà núi một")) {
        lat = 12.247;
        lng = 109.1915;
      } else if (nameLower.includes("bánh căn 51")) {
        lat = 12.238;
        lng = 109.193;
      } else if (
        nameLower.includes("z beach") ||
        nameLower.includes("z-beach")
      ) {
        lat = 12.2356;
        lng = 109.197;
      }

      return { ...p, lat, lng };
    });

    if (destLower.includes("đà lạt")) {
      fixedPlaces = fixedPlaces.filter(
        (p) =>
          !p.name.toLowerCase().includes("nha trang") &&
          !p.name.toLowerCase().includes("vinwonders")
      );
    }

    return { success: true, data: fixedPlaces, tripId };
  } catch (error) {
    console.error("Search error:", error);
    return { success: false, error: "Internal server error" };
  }
}
