"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveTrip(tripData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
                name: user.user_metadata.full_name || user.email?.split('@')[0],
            },
        });

        // 2. Prepare Trip Items & Upsert Places
        const tripItems: any[] = [];

        // Loop through days
        for (const dayStr of Object.keys(tripData.activities)) {
            const day = parseInt(dayStr);
            const dayActivities = tripData.activities[day];

            // Loop through periods
            for (const period of ['morning', 'afternoon', 'evening']) {
                const items = dayActivities[period] || [];
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    if (item.place) {

                        // IMPORTANT: Ensure Place exists in DB before linking
                        // Use upsert to create if missing (e.g. from static data)
                        await prisma.place.upsert({
                            where: { id: item.place.id },
                            update: {},
                            create: {
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
                                metadata: item.place.metadata || undefined
                            }
                        });

                        tripItems.push({
                            placeId: item.place.id,
                            dayIndex: day - 1,
                            startTime: item.time ? item.time.split(' - ')[0] : undefined,
                            endTime: item.time ? item.time.split(' - ')[1] : undefined,
                            title: item.title,
                            description: item.place.address,
                            order: index,
                        });
                    }
                }
            }
        }

        // 3. Create Trip
        const newTrip = await prisma.trip.create({
            data: {
                userId: dbUser.id,
                destination: tripData.destination || "Unknown",
                startDate: new Date(tripData.startDate),
                endDate: new Date(tripData.endDate),
                budget: tripData.budget,
                items: {
                    create: tripItems.map(item => ({
                        place: { connect: { id: item.placeId } },
                        dayIndex: item.dayIndex,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        title: item.title,
                        description: item.description,
                        order: item.order
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return { success: true, data: newTrip };

    } catch (error) {
        console.error("Failed to save trip:", error);
        return { success: false, error: "Failed to save trip" };
    }
}

export async function getUserTrips() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const trips = await prisma.trip.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        place: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: {
                startDate: 'desc'
            }
        });

        return { success: true, data: trips };

    } catch (error) {
        console.error("Failed to fetch trips:", error);
        return { success: false, error: "Failed to fetch trips" };
    }
}
