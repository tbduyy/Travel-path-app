
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const trip = await prisma.trip.findFirst({
        where: { destination: 'Nha Trang' },
        include: {
            items: {
                include: {
                    place: true
                },
                orderBy: {
                    order: 'asc'
                }
            }
        }
    })

    if (trip) {
        console.log('Found trip ID:', trip.id)
        console.log('Items count:', trip.items.length)
        console.log('First item:', trip.items[0])
    } else {
        console.log('No trip found')
    }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
