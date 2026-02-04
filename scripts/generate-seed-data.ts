
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync('uploaded_images_all.json', 'utf-8');
const imagesMap = JSON.parse(rawData);

const places: any[] = [];

// Helper to title case
function toTitleCase(str: string) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

for (const [id, images] of Object.entries(imagesMap)) {
    let city = '';
    let name = '';
    let type = 'ATTRACTION';
    let rating = 4.5;
    let priceLevel = '$$';
    let address = 'Vietnam';

    if (id.startsWith('hn-')) {
        city = 'Hà Nội';
        address = 'Hà Nội, Vietnam';
    } else if (id.startsWith('hcm-')) {
        city = 'Thành phố Hồ Chí Minh';
        address = 'TP.HCM, Vietnam';
    } else if (id.startsWith('dn-')) {
        city = 'Đà Nẵng';
        address = 'Đà Nẵng, Vietnam';
    } else if (id.startsWith('dl-')) {
        city = 'Đà Lạt';
        address = 'Đà Lạt, Vietnam';
    } else if (id.startsWith('nt-')) {
        city = 'Nha Trang';
        address = 'Nha Trang, Vietnam';
    }

    // Infer Name
    const slug = id.split('-').slice(1).join('-'); // Remove prefix
    name = toTitleCase(slug);

    // Infer Type
    if (id.includes('hotel') || id.includes('homestay') || id.includes('resort')) {
        type = 'HOTEL';
        priceLevel = '$$$';
    } else if (id.includes('restaurant') || id.includes('quan') || id.includes('banh') || id.includes('pho') || id.includes('com')) {
        type = 'RESTAURANT';
        priceLevel = '$';
    }

    // Specific Overrides based on known keywords in ID
    if (id.includes('nem-nuong') || id.includes('hai-san')) type = 'RESTAURANT';

    // Descriptions
    const description = `Khám phá ${name} tại ${city}. Một điểm đến tuyệt vời với trải nghiệm đáng nhớ.`;

    places.push({
        id, // Keep ID for potential reference
        name,
        city,
        description,
        type,
        rating: 4.0 + Math.random(), // Random rating 4.0 - 5.0
        images: images,
        priceLevel: priceLevel === '$$$' ? 3 : (priceLevel === '$$' ? 2 : 1),
        price: type === 'HOTEL' ? '1.500.000 VND' : 'Miễn phí',
        address,
    });
}


const content = `import { PlaceData } from './nhaTrangData';

export const seedPlaces = ${JSON.stringify(places, null, 4)};
`;

fs.writeFileSync('app/data/seedPlaces.ts', content, 'utf-8');
console.log('Generated app/data/seedPlaces.ts');

