"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addToTrip(placeId: string) {
    try {
        // 1. Find the latest trip for the demo user
        // Ideally we pass userId, but for MVP we use the seeded one or find any
        let trip = await prisma.trip.findFirst({
            orderBy: { createdAt: "desc" },
        });

        // If no trip exists, create one
        if (!trip) {
            const user = await prisma.user.findFirst(); // Validation fallback
            if (!user) throw new Error("No user found");

            trip = await prisma.trip.create({
                data: {
                    userId: user.id,
                    destination: "My Dream Trip",
                    startDate: new Date(),
                    endDate: new Date(),
                },
            });
        }

        // 2. Add the place to the trip
        // Find highest order to append
        const lastItem = await prisma.tripItem.findFirst({
            where: { tripId: trip.id },
            orderBy: { order: "desc" },
        });
        const nextOrder = (lastItem?.order || 0) + 1;

        await prisma.tripItem.create({
            data: {
                tripId: trip.id,
                placeId: placeId,
                dayIndex: 0, // Default to Day 1
                order: nextOrder,
            },
        });

        revalidatePath("/plan-trip");
        return { success: true, message: "Added to trip!" };
    } catch (error) {
        console.error("Failed to add to trip:", error);
        return { success: false, message: "Failed to add place." };
    }
}
