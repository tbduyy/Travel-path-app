import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const places = await prisma.place.findMany();
    console.log(`Total places in DB: ${places.length}`);

    const dinhBaoDai = places.find(p => p.id === 'dl-dinhbaodai3' || p.name.includes("Bảo Đại"));
    if (dinhBaoDai) {
        console.log("Found Dinh Bao Dai in DB!");
        console.log("Images:", JSON.stringify(dinhBaoDai.images, null, 2));
        console.log("City:", dinhBaoDai.city);
    } else {
        console.log("Dinh Bao Dai not found in DB at all.");
    }
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
