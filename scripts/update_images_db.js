const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    console.log("Loading mapping...");
    const dlMap = JSON.parse(fs.readFileSync('scripts/dl_new_images.json', 'utf8'));

    for (const [id, urls] of Object.entries(dlMap)) {
        if (!urls || urls.length === 0) continue;

        try {
            // First check if it exists in DB
            const place = await prisma.place.findUnique({ where: { id } });

            if (place) {
                await prisma.place.update({
                    where: { id },
                    data: {
                        images: urls
                    }
                });
                console.log(`✅ Updated DB: ${id} with ${urls.length} images`);
            } else {
                console.log(`⚠️ ID not found in DB: ${id}. Might be completely static in daLatData.ts`);
            }
        } catch (e) {
            console.error(`❌ Error updating ${id}:`, e.message);
        }
    }
}

run().then(() => console.log('Done')).catch(console.error);
