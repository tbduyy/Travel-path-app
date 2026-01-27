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
    // Normalize destination
    let searchTerm = params.destination || "";
    const termLower = searchTerm.toLowerCase().trim();

    // Auto-map common slugs/variations to DB City Names
    if (
      termLower.includes("da lat") ||
      termLower.includes("đà lạt") ||
      termLower.includes("da-lat")
    ) {
      searchTerm = "Đà Lạt";
    } else if (
      termLower.includes("nha trang") ||
      termLower.includes("nha-trang")
    ) {
      searchTerm = "Nha Trang";
    } else if (
      termLower.includes("da nang") ||
      termLower.includes("đà nẵng") ||
      termLower.includes("da-nang")
    ) {
      searchTerm = "Đà Nẵng";
    } else if (
      termLower.includes("ho chi minh") ||
      termLower.includes("hồ chí minh") ||
      termLower.includes("sai gon")
    ) {
      searchTerm = "Hồ Chí Minh";
    }

    const destLower = searchTerm.toLowerCase();
    const filters: any = {};

    // --- STANDARD LOGIC (DA LAT & OTHERS) ---
    if (params.type) {
      filters.type = params.type;
    }

    if (searchTerm !== "") {
      filters.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Also try to find by city specifically if mapped
    if (
      ["Đà Lạt", "Nha Trang", "Đà Nẵng", "Hồ Chí Minh"].includes(searchTerm)
    ) {
      filters.OR.push({ city: { equals: searchTerm } });
    }

    // --- NHA TRANG STATIC DATA OVERRIDE ---
    if (destLower.includes("nha trang")) {
      const { allNhaTrangPlaces, allNhaTrangHotels } =
        await import("@/app/data/nhaTrangData");

      if (params.type === "HOTEL") {
        let resultHotels = allNhaTrangHotels;

        // 1. FILTER BY SELECTED PLACES (Context-Aware)
        const placeIdsString = (params as any).places;
        let relatedPlaces: any[] = [];

        if (placeIdsString) {
          const placeIds = placeIdsString.split(",");
          resultHotels = resultHotels.filter(
            (h) => h.relatedPlaceId && placeIds.includes(h.relatedPlaceId),
          );
          relatedPlaces = allNhaTrangPlaces.filter((p) =>
            placeIds.includes(p.id),
          );
        }

        // 2. SCORING & SORTING (Budget & Style)
        const budget = params.budget?.toLowerCase() || "";
        // const style = params.style?.toLowerCase() || "";

        if (budget) {
          resultHotels = resultHotels.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            const priceToScore = (pLevel: string) => {
              if (pLevel === "$") return 1;
              if (pLevel === "$$") return 2;
              if (pLevel === "$$$") return 3;
              if (pLevel === "$$$$") return 4;
              return 2;
            };

            const valA = priceToScore(a.priceLevel);
            const valB = priceToScore(b.priceLevel);

            // Target Values
            let target = 2; // Default Medium
            if (
              budget.includes("cheap") ||
              budget.includes("thấp") ||
              budget.includes("tiết kiệm")
            )
              target = 1;
            if (
              budget.includes("high") ||
              budget.includes("cao") ||
              budget.includes("luxury") ||
              budget.includes("sang")
            )
              target = 4;
            if (budget.includes("medium") || budget.includes("trung"))
              target = 2;

            // Closer to target is better (smaller diff is better)
            const diffA = Math.abs(valA - target);
            const diffB = Math.abs(valB - target);

            return diffA - diffB; // Ascending diff (0 is best)
          });
        }

        return { success: true, data: resultHotels, relatedPlaces };
      } else {
        // Return Places (Attractions + Restaurants)
        // potentially filter by name if searchTerm is specific
        let resultPlaces = allNhaTrangPlaces;
        if (params.type) {
          resultPlaces = resultPlaces.filter((p) => p.type === params.type);
        }
        return { success: true, data: resultPlaces };
      }
    }

    // --- DB FALLBACK FOR OTHER CITIES ---
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
          !p.name.toLowerCase().includes("vinwonders"),
      );
    }

    return { success: true, data: fixedPlaces, tripId };
  } catch (error) {
    console.error("Search error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPlaceById(id: string) {
  try {
    // 1. Static Data Check (Nha Trang)
    const { allNhaTrangPlaces, allNhaTrangHotels } =
      await import("@/app/data/nhaTrangData");
    const allStatic = [...allNhaTrangPlaces, ...allNhaTrangHotels];
    const staticPlace = allStatic.find((p) => p.id === id);
    if (staticPlace) return { success: true, data: staticPlace };

    // 2. DB Check
    const dbPlace = await prisma.place.findUnique({
      where: { id },
    });

    if (dbPlace) return { success: true, data: dbPlace };

    return { success: false, error: "Place not found" };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getPlacesByIds(ids: string[]) {
  try {
    if (!ids || ids.length === 0) {
      return { success: true, data: [] };
    }

    // 1. Static Data Check (Nha Trang)
    const { allNhaTrangPlaces, allNhaTrangHotels } =
      await import("@/app/data/nhaTrangData");
    const allStatic = [...allNhaTrangPlaces, ...allNhaTrangHotels];

    const results: any[] = [];
    const notFoundIds: string[] = [];

    for (const id of ids) {
      const staticPlace = allStatic.find((p) => p.id === id);
      if (staticPlace) {
        results.push(staticPlace);
      } else {
        notFoundIds.push(id);
      }
    }

    // 2. DB Check for remaining IDs
    if (notFoundIds.length > 0) {
      const dbPlaces = await prisma.place.findMany({
        where: { id: { in: notFoundIds } },
      });
      results.push(...dbPlaces);
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("getPlacesByIds error:", error);
    return { success: false, error: "Internal server error" };
  }
}
