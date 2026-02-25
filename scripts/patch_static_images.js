const fs = require('fs');

async function run() {
    let dlContent = fs.readFileSync('app/data/daLatData.ts', 'utf8');
    const dlMap = JSON.parse(fs.readFileSync('scripts/dl_new_images.json', 'utf8'));

    for (const [id, urls] of Object.entries(dlMap)) {
        if (!urls || urls.length === 0) continue;
        const strUrls = JSON.stringify(urls, null, 12).replace(/\n/g, '\n      ');

        // Find the place block
        const idIndex = dlContent.indexOf(`id: "${id}"`);
        if (idIndex !== -1) {
            // Find images array inside this block
            const imagesIndex = dlContent.indexOf('images: [', idIndex);
            if (imagesIndex !== -1 && imagesIndex < idIndex + 500) {
                const endImagesIndex = dlContent.indexOf(']', imagesIndex);
                if (endImagesIndex !== -1) {
                    dlContent = dlContent.substring(0, imagesIndex) + `images: ${strUrls}` + dlContent.substring(endImagesIndex + 1);
                    console.log(`Updated ${id}`);
                }
            }
        }
    }
    fs.writeFileSync('app/data/daLatData.ts', dlContent);
    console.log("Updated daLatData");
}
run();
