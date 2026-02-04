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
    console.error("saveTrip: No user found");
    return { success: false, error: "Unauthorized" };
  }

  console.log("saveTrip: User found, starting save.", user.id);

  try {
    // 1. Ensure User exists in Prisma DB
    console.log("saveTrip: Upserting user...");
    const dbUser = await prisma.user.upsert({
      where: { email: user.email! },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name || user.email?.split("@")[0],
      },
    });
    console.log("saveTrip: DB User upserted/found:", dbUser.id);

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
              // Handle image/images mapping
              let imageList: string[] = [];
              if (Array.isArray(item.place.images) && item.place.images.length > 0) {
                imageList = item.place.images;
              } else if (item.place.image) {
                imageList = [item.place.image];
              }

              placesToUpsert.set(item.place.id, {
                id: item.place.id,
                name: item.place.name,
                description: item.place.description || item.place.address || "",
                type: item.place.type || "ATTRACTION",
                images: imageList, // Map to 'images' array
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
    console.log("saveTrip: Creating trip record with items count:", tripItems.length);
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

    console.log("saveTrip: SUCCESS! Trip ID:", newTrip.id);
    return { success: true, data: newTrip };
  } catch (error) {
    console.error("Failed to save trip:", error);
    return { success: false, error: "Failed to save trip: " + (error as any).message };
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
    console.log("Fetching trips for user:", user.id, user.email);

    // Fix: Find DB user by email first to match saveTrip behavior
    // (Auth ID might differ from DB ID if user was created manually or migrated)
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { id: true }
    });

    const targetUserId = dbUser ? dbUser.id : user.id;
    console.log("Using Target DB User ID:", targetUserId);

    const trips = await prisma.trip.findMany({
      where: { userId: targetUserId },
      include: {
        items: {
          include: {
            place: {
              select: {
                id: true,
                name: true,
                images: true, // Select 'images' array
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

    console.log("Trips found:", trips.length);
    return { success: true, data: trips };
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return { success: false, error: "Failed to fetch trips: " + (error as any).message };
  }
}
