import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const places = await prisma.place.findMany({
        where: {
            city: 'Đà Lạt'
        },
        select: {
            name: true,
            address: true
        },
        take: 5
    })

    console.log('--- Places in Đà Lạt ---')
    console.log(JSON.stringify(places, null, 2))
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
