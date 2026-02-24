// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import { seedPlaces } from '../app/data/seedPlaces'
import { extraDaLatPlaces } from '../app/data/daLatData'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data
    await prisma.tripItem.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.place.deleteMany({})

    const allPlacesToSeed = [...seedPlaces, ...extraDaLatPlaces]
    console.log(`Seeding ${allPlacesToSeed.length} places (including Da Lat attractions)...`)

    for (const place of allPlacesToSeed) {
        // Ensure lat/lng are present (random if missing from seedPlaces generator)
        // My generate script didn't add lat/lng! I need to add them or defaults.
        // Prisma schema likely requires Float? No, looking at schema earlier...
        // Place model:
        // lat Float
        // lng Float
        // The generate script didn't include lat/lng. I must add them.

        // Quick fix: Add random lat/lng near the city center if missing
        let finalCity = place.city || 'Đà Lạt';
        let lat = place.lat;
        let lng = place.lng;

        if (!lat || !lng) {
            let baseLat = 0;
            let baseLng = 0;

            if (finalCity === 'Hà Nội') { baseLat = 21.0285; baseLng = 105.8542; }
            else if (finalCity === 'Thành phố Hồ Chí Minh') { baseLat = 10.8231; baseLng = 106.6297; }
            else if (finalCity === 'Đà Nẵng') { baseLat = 16.0544; baseLng = 108.2022; }
            else if (finalCity === 'Đà Lạt') { baseLat = 11.9404; baseLng = 108.4583; }
            else if (finalCity === 'Nha Trang') { baseLat = 12.2388; baseLng = 109.1967; }

            // Add small random jitter
            lat = baseLat + (Math.random() - 0.5) * 0.05;
            lng = baseLng + (Math.random() - 0.5) * 0.05;
        }

        // Convert string priceLevel to Int
        let finalPriceLevel = 2;
        if (typeof place.priceLevel === 'string') {
            if (place.priceLevel.toLowerCase() === 'free') {
                finalPriceLevel = 0;
            } else if (place.priceLevel.includes('$')) {
                finalPriceLevel = place.priceLevel.replace(/[^$]/g, '').length || 1;
            } else {
                finalPriceLevel = parseInt(place.priceLevel) || 2;
            }
        } else if (typeof place.priceLevel === 'number') {
            finalPriceLevel = place.priceLevel;
        }

        await prisma.place.create({
            data: {
                ...place,
                city: finalCity,
                priceLevel: finalPriceLevel,
                lat,
                lng,
                rating: place.rating || 4.5
            }
        })
    }

    // --- USER ---
    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'user-demo',
            email: 'demo@example.com',
            name: 'Demo User',
        }
    })

    // --- PROFILE (Required for Role Check) ---
    const profile = await prisma.profile.upsert({
        where: { email: 'demo@example.com' },
        update: { role: 'admin' },
        create: {
            id: 'user-demo',
            email: 'demo@example.com',
            role: 'admin',
        }
    })

    // --- REAL ADMIN (Requested by User) ---
    const realAdminUser = await prisma.user.upsert({
        where: { email: 'admin@travelpath.io.vn' },
        update: {},
        create: {
            id: 'user-real-admin',
            email: 'admin@travelpath.io.vn',
            name: 'Admin',
        }
    })

    const realAdminProfile = await prisma.profile.upsert({
        where: { email: 'admin@travelpath.io.vn' },
        update: { role: 'admin' },
        create: {
            id: 'user-real-admin',
            email: 'admin@travelpath.io.vn',
            role: 'admin',
        }
    })

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
