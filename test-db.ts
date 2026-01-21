import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Verification ---')

    const userCount = await prisma.user.count()
    console.log(`Users: ${userCount}`)

    const places = await prisma.place.findMany()
    console.log(`Places: ${places.length}`)
    places.forEach((p: { name: string; type: string }) => console.log(` - ${p.name} (${p.type})`))

    const trips = await prisma.trip.findMany({
        include: { items: true }
    })
    console.log(`Trips: ${trips.length}`)
    trips.forEach((t: { destination: string; items: any[] }) => {
        console.log(` - Trip to ${t.destination} (${t.items.length} items)`)
    })

    console.log('--- End Verification ---')
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
