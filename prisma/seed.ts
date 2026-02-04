// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import { seedPlaces } from '../app/data/seedPlaces'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data
    await prisma.tripItem.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.place.deleteMany({})

    console.log(`Seeding ${seedPlaces.length} places...`)

    for (const place of seedPlaces) {
        // Ensure lat/lng are present (random if missing from seedPlaces generator)
        // My generate script didn't add lat/lng! I need to add them or defaults.
        // Prisma schema likely requires Float? No, looking at schema earlier...
        // Place model:
        // lat Float
        // lng Float
        // The generate script didn't include lat/lng. I must add them.

        // Quick fix: Add random lat/lng near the city center.
        let baseLat = 0;
        let baseLng = 0;

        if (place.city === 'Hà Nội') { baseLat = 21.0285; baseLng = 105.8542; }
        else if (place.city === 'Thành phố Hồ Chí Minh') { baseLat = 10.8231; baseLng = 106.6297; }
        else if (place.city === 'Đà Nẵng') { baseLat = 16.0544; baseLng = 108.2022; }
        else if (place.city === 'Đà Lạt') { baseLat = 11.9404; baseLng = 108.4583; }
        else if (place.city === 'Nha Trang') { baseLat = 12.2388; baseLng = 109.1967; }

        // Add small random jitter
        const lat = baseLat + (Math.random() - 0.5) * 0.05;
        const lng = baseLng + (Math.random() - 0.5) * 0.05;

        await prisma.place.create({
            data: {
                ...place,
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
