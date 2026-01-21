const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Cleanup existing data
    await prisma.tripItem.deleteMany()
    await prisma.trip.deleteMany()
    await prisma.place.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create a Default User
    const user = await prisma.user.create({
        data: {
            email: 'demo@travelpath.com',
            name: 'Traveler',
        }
    })

    // 2. Create Places (From UI Mockups)
    const zoodoo = await prisma.place.create({
        data: {
            name: 'Vườn Thú ZooDoo',
            description: 'ZooDoo Garden style cafe & zoo in the forest.',
            type: 'ATTRACTION',
            rating: 4.5,
            address: 'Dalat, Lam Dong',
            image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?q=80&w=2525&auto=format&fit=crop',
            priceLevel: 2,
            lat: 11.9,
            lng: 108.4,
        }
    })

    const cauDat = await prisma.place.create({
        data: {
            name: 'Đồi Chè Cầu Đất',
            description: 'Famous green tea hill with wind turbines.',
            type: 'ATTRACTION',
            rating: 4.8,
            address: 'Cau Dat, Dalat',
            image: 'https://images.unsplash.com/photo-1570643758362-e617d3d52f6d?q=80&w=2574&auto=format&fit=crop',
            priceLevel: 1,
            lat: 11.9,
            lng: 108.5,
        }
    })

    const choDem = await prisma.place.create({
        data: {
            name: 'Chợ Đêm Đà Lạt',
            description: 'Night market with street food and clothes.',
            type: 'ATTRACTION',
            rating: 4.2,
            address: 'City Center',
            image: 'https://images.unsplash.com/photo-1569389397653-c03532cb39bf?q=80&w=2670&auto=format&fit=crop',
            priceLevel: 1,
            lat: 11.94,
            lng: 108.43,
        }
    })

    const colline = await prisma.place.create({
        data: {
            name: 'Hotel Colline',
            description: '4-star hotel in the heart of Dalat with modern architecture.',
            type: 'HOTEL',
            rating: 4.6,
            address: '10 Phan Boi Chau',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop',
            priceLevel: 4,
        }
    })

    const rabelais = await prisma.place.create({
        data: {
            name: 'Nhà Hàng Le Rabelais',
            description: 'Luxury French dining experience.',
            type: 'RESTAURANT',
            rating: 4.9,
            address: 'Dalat Palace',
            image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2670&auto=format&fit=crop',
            priceLevel: 5,
        }
    })

    // 3. Create a Demo Trip
    const trip = await prisma.trip.create({
        data: {
            userId: user.id,
            destination: 'Đà Lạt',
            startDate: new Date('2026-01-31'),
            endDate: new Date('2026-02-02'),
            budget: '5,000,000 VND',
            pax: 2,
            style: 'Healing',
            items: {
                create: [
                    {
                        placeId: zoodoo.id,
                        dayIndex: 0,
                        startTime: '08:00',
                        order: 1,
                        notes: 'Visit the alpacas'
                    },
                    {
                        placeId: cauDat.id,
                        dayIndex: 0,
                        startTime: '14:00',
                        order: 2,
                    },
                    {
                        placeId: colline.id,
                        dayIndex: 1,
                        startTime: '14:00',
                        order: 1,
                        notes: 'Check-in time'
                    }
                ]
            }
        }
    })

    console.log('Seeding finished.')
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
