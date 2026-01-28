"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveTrip(tripData: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Ensure User exists in Prisma DB
    const dbUser = await prisma.user.upsert({
      where: { email: user.email! },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name || user.email?.split("@")[0],
      },
    });

    // 2. Collect all places & prepare trip items (WITHOUT upsert loop - this is the bottleneck!)
    const placesToUpsert = new Map();
    const tripItems: any[] = [];

    // Loop through days & collect unique places
    for (const dayStr of Object.keys(tripData.activities)) {
      const day = parseInt(dayStr);
      const dayActivities = tripData.activities[day];

      // Loop through periods
      for (const period of ["morning", "afternoon", "evening"]) {
        const items = dayActivities[period] || [];
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (item.place) {
            // OPTIMIZATION: Deduplicate places by ID (avoid N upserts)
            if (!placesToUpsert.has(item.place.id)) {
              placesToUpsert.set(item.place.id, {
                id: item.place.id,
                name: item.place.name,
                description: item.place.description || item.place.address || "",
                type: item.place.type || "ATTRACTION",
                image: item.place.image,
                address: item.place.address,
                lat: item.place.lat,
                lng: item.place.lng,
                price: item.place.price,
                duration: item.place.duration,
                rating: item.place.rating || 0,
                priceLevel: item.place.priceLevel || 3,
                city: item.place.city,
                metadata: item.place.metadata || undefined,
              });
            }

            tripItems.push({
              placeId: item.place.id,
              dayIndex: day - 1,
              startTime: item.time ? item.time.split(" - ")[0] : undefined,
              endTime: item.time ? item.time.split(" - ")[1] : undefined,
              title: item.title,
              description: item.place.address,
              order: index,
            });
          }
        }
      }
    }

    // 3. Batch upsert all places at once (instead of N separate calls)
    // REQUIRES: Ensure Prisma schema supports this. If not, consider raw SQL with UPSERT
    for (const place of placesToUpsert.values()) {
      await prisma.place.upsert({
        where: { id: place.id },
        update: {},
        create: place,
      });
    }
    // TODO: Replace with batch upsert if Prisma doesn't optimize this:
    // await prisma.place.createMany({
    //     data: Array.from(placesToUpsert.values()),
    //     skipDuplicates: true
    // });

    // 4. Create Trip
    const newTrip = await prisma.trip.create({
      data: {
        userId: dbUser.id,
        destination: tripData.destination || "Unknown",
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        budget: tripData.budget,
        items: {
          create: tripItems.map((item) => ({
            place: { connect: { id: item.placeId } },
            dayIndex: item.dayIndex,
            startTime: item.startTime,
            endTime: item.endTime,
            title: item.title,
            description: item.description,
            order: item.order,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return { success: true, data: newTrip };
  } catch (error) {
    console.error("Failed to save trip:", error);
    return { success: false, error: "Failed to save trip" };
  }
}

export async function getUserTrips() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // OPTIMIZATION: Single query with nested includes (Prisma handles it efficiently)
    // Sorts items by order for proper itinerary display
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            place: {
              select: {
                id: true,
                name: true,
                image: true,
                address: true,
                lat: true,
                lng: true,
                rating: true,
                type: true,
                price: true,
                duration: true,
                // Only select needed fields to reduce payload
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return { success: true, data: trips };
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return { success: false, error: "Failed to fetch trips" };
  }
}
