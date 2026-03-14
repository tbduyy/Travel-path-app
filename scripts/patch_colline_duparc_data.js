const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    console.log("Loading recent images map...");
    const uploadedMap = JSON.parse(fs.readFileSync('scripts/recent_uploaded_images.json', 'utf8'));

    // 1. Update Database
    for (const [id, urls] of Object.entries(uploadedMap)) {
        if (!urls || urls.length === 0) continue;

        try {
            const place = await prisma.place.findUnique({ where: { id } });
            if (place) {
                await prisma.place.update({
                    where: { id },
                    data: { images: urls }
                });
                console.log(`✅ Updated DB: ${id} with ${urls.length} images`);
            } else {
                console.log(`⚠️ DB: ID not found: ${id}`);
            }
        } catch (e) {
            console.error(`❌ DB Error updating ${id}:`, e.message);
        }
    }

    // 2. Update Static files
    const staticFiles = ['app/data/daLatData.ts', 'app/data/seedPlaces.ts'];

    for (const file of staticFiles) {
        if (!fs.existsSync(file)) continue;
        let content = fs.readFileSync(file, 'utf8');
        let fileUpdated = false;

        for (const [id, urls] of Object.entries(uploadedMap)) {
            if (!urls || urls.length === 0) continue;
            const strUrls = JSON.stringify(urls, null, 12).replace(/\n/g, '\n      ');

            const idIndex = content.indexOf(`id: "${id}"`);
            if (idIndex !== -1) {
                const imagesIndex = content.indexOf('images: [', idIndex);
                if (imagesIndex !== -1 && imagesIndex < idIndex + 500) {
                    const endImagesIndex = content.indexOf(']', imagesIndex);
                    if (endImagesIndex !== -1) {
                        content = content.substring(0, imagesIndex) + `images: ${strUrls}` + content.substring(endImagesIndex + 1);
                        console.log(`✅ Updated Static ${file}: ${id}`);
                        fileUpdated = true;
                    }
                }
            }
        }

        if (fileUpdated) {
            fs.writeFileSync(file, content);
            console.log(`✅ Saved changes to ${file}`);
        }
    }
}

run().then(() => console.log('Done')).catch(console.error);
