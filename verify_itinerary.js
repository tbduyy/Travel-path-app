
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Verifying User's requested data structure in DB...")
    const trip = await prisma.trip.findFirst({
        where: { destination: { contains: 'Nha Trang', mode: 'insensitive' } },
        include: { items: { include: { place: true } } }
    })

    if (!trip) {
        console.error("FAIL: Trip not found")
        process.exit(1)
    }

    console.log(`Trip found: ${trip.destination} (${trip.id})`)

    // Verify Day 1 items
    const day1 = trip.items.filter(i => i.dayIndex === 1)
    console.log(`Day 1 items: ${day1.length} (Expected around 7)`)

    // Check specific fields requested by user
    const flight = day1.find(i => i.title && i.title.includes("Bay HCM"))
    if (flight) {
        console.log(`[OK] Flight found: ${flight.startTime} - ${flight.endTime} | ${flight.title}`)
        console.log(`     Transit: ${flight.transitDuration}`)
        console.log(`     Cost: ${flight.cost}`)
    } else {
        console.error("[FAIL] Flight item not found")
    }

    const hotel = day1.find(i => i.place.type === 'HOTEL')
    if (hotel) {
        console.log(`[OK] Hotel check-in found: ${hotel.place.name}`)
    }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
