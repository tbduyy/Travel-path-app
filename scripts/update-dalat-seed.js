const fs = require('fs');
const path = require('path');

const BASE_LOCAL_PATH = 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\ĐÀ LẠT';
const PREFIX = 'dl';
const SEED_FILE = 'app/data/seedPlaces.ts';

function generateId(prefix, name) {
    let clean = name.replace(/^[\d\.\s]+/, '');
    clean = clean.replace(/\.[^/.]+$/, '');
    const slug = clean.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${prefix}-${slug}`;
}

const placeDataMap = {};
const categories = fs.readdirSync(BASE_LOCAL_PATH);

for (const category of categories) {
    const catPath = path.join(BASE_LOCAL_PATH, category);
    if (!fs.statSync(catPath).isDirectory()) continue;

    const isHotelCategory = category.toUpperCase().includes('KHÁCH SẠN');
    const places = fs.readdirSync(catPath);

    for (const placeOrFile of places) {
        const placeId = generateId(PREFIX, placeOrFile);
        // Original name is the file/folder name without leading numbers and without extension
        const originalName = placeOrFile.replace(/^[\d\.\s]+/, '').replace(/\.[^/.]+$/, '');

        placeDataMap[placeId] = {
            name: originalName,
            type: isHotelCategory ? 'HOTEL' : 'ATTRACTION'
        };
    }
}

let seedContent = fs.readFileSync(SEED_FILE, 'utf8');

// We have the seedContent as a string. We can either parse it (hard, it's TS) or use regex.
// Regex is safer if we know the structure.
for (const [id, data] of Object.entries(placeDataMap)) {
    // Find the block for this ID.
    // E.g. "id": "dl-happy-day-2-guesthouse"
    // We want to replace "name", "type", "priceLevel", and "price" inside that block.
    // Instead of parsing the whole file, we can look for the object start and end, 
    // but the easiest is just string replacement because the values are somewhat unique.

    const idRegex = new RegExp(`"id"\\s*:\\s*"${id}"`);
    if (idRegex.test(seedContent)) {
        // Replace name
        seedContent = seedContent.replace(
            new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"name"\\s*:\\s*"[^"]+"`),
            `$1"name": "${data.name}"`
        );

        // Update the description slightly to use the new name
        seedContent = seedContent.replace(
            new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"description"\\s*:\\s*"[^"]+"`),
            `$1"description": "Khám phá ${data.name} tại Đà Lạt. Một điểm đến tuyệt vời với trải nghiệm đáng nhớ."`
        );

        // Replace type
        seedContent = seedContent.replace(
            new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"type"\\s*:\\s*"[^"]+"`),
            `$1"type": "${data.type}"`
        );

        // Replace priceLevel and price based on type
        if (data.type === 'HOTEL') {
            seedContent = seedContent.replace(
                new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"priceLevel"\\s*:\\s*\\d`),
                `$1"priceLevel": 3`
            );
            seedContent = seedContent.replace(
                new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"price"\\s*:\\s*"[^"]+"`),
                `$1"price": "1.500.000 VND"`
            );
        } else {
            seedContent = seedContent.replace(
                new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"priceLevel"\\s*:\\s*\\d`),
                `$1"priceLevel": 2`
            );
            seedContent = seedContent.replace(
                new RegExp(`("id"\\s*:\\s*"${id}"[\\s\\S]*?)"price"\\s*:\\s*"[^"]+"`),
                `$1"price": "Miễn phí"`
            );
        }
    }
}

fs.writeFileSync(SEED_FILE, seedContent);
console.log('Successfully updated seedPlaces.ts with accents and correct types!');
