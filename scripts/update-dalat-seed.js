const fs = require('fs');
const path = require('path');

const dataPath1 = path.join(__dirname, '..', 'app', 'data', 'daLatData.ts');
const dataPath2 = path.join(__dirname, '..', 'app', 'data', 'seedPlaces.ts');
const jsonPath = path.join(__dirname, '..', 'uploaded_images_dalat_v2.json');

const dalatV2Map = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function updateFile(filePath) {
    let tsContent = fs.readFileSync(filePath, 'utf8');

    for (const [id, urls] of Object.entries(dalatV2Map)) {
        // Find the first URL to anchor the search
        const firstUrl = urls[0];
        const firstUrlIndex = tsContent.indexOf(firstUrl);

        if (firstUrlIndex !== -1) {
            // Find the start of the images array
            const imagesStart = tsContent.lastIndexOf('images: [', firstUrlIndex);
            if (imagesStart !== -1) {
                // Find the end of this images array
                const imagesEnd = tsContent.indexOf('],', firstUrlIndex);
                if (imagesEnd !== -1) {
                    const newImagesStr = 'images: [\n            ' + urls.map(url => `"${url}"`).join(',\n            ') + '\n        ]';

                    // Only replace if it's within a reasonable distance
                    if (imagesEnd - imagesStart < 1500) {
                        tsContent = tsContent.substring(0, imagesStart) + newImagesStr + tsContent.substring(imagesEnd + 1);
                    }
                }
            }
        }
    }

    fs.writeFileSync(filePath, tsContent, 'utf8');
}

updateFile(dataPath1);
updateFile(dataPath2);

console.log('Update daLatData.ts and seedPlaces.ts completed.');
