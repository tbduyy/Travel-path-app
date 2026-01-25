import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const term = 'Nha Trang'
    console.log(`--- SIMULATING SEARCH FOR "${term}" ---`)
    const filters: any = {
        OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { address: { contains: term, mode: 'insensitive' } },
        ]
    }

    const places = await prisma.place.findMany({
        where: filters,
        select: { name: true, id: true },
        take: 50
    })

    console.log(`Top 50 results count: ${places.length}`)
    // places.forEach((p, i) => console.log(`${i + 1}. ${p.name}`))

    const isVinWondersPresent = places.some(p => p.name.includes('VinWonders'))
    console.log(`\nIs VinWonders present in top 50? ${isVinWondersPresent}`)
    console.log('--- END SIMULATION ---')
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
