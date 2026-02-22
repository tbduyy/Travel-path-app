const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'places';
const BASE_LOCAL_PATH = 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\ĐÀ LẠT';
const PREFIX = 'dl';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function generateId(prefix, name) {
    let clean = name.replace(/^[\d\.\s]+/, '');
    clean = clean.replace(/\.[^/.]+$/, "");
    const slug = clean.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${prefix}-${slug}`;
}

async function uploadFile(filePath, destinationPath) {
    const fileContent = fs.readFileSync(filePath);
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(destinationPath, fileContent, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (error) {
        console.error(`Failed to upload ${filePath}:`, error.message);
        return null;
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(destinationPath);

    return data.publicUrl;
}

function getFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

async function processPlace(placeId, dirPath, results) {
    if (results[placeId]) return;
    results[placeId] = [];
    console.log(`  Processing Place: ${placeId} ...`);

    const images = getFiles(dirPath);
    for (let i = 0; i < images.length; i++) {
        const ext = path.extname(images[i]);
        const destPath = `places/${PREFIX}/${placeId}/${placeId}-${i + 1}${ext}`;
        const url = await uploadFile(images[i], destPath);
        if (url) results[placeId].push(url);
    }
}

async function main() {
    console.log('Starting Da Lat upload exactly as described (places/dl/dl-name-place)...');
    const results = {};

    if (!fs.existsSync(BASE_LOCAL_PATH)) {
        console.warn(`Path not found: ${BASE_LOCAL_PATH}`);
        return;
    }

    // Top level Da Lat categories (e.g., ĐỊA ĐIỂM THAM QUAN, NHÀ HÀNG)
    const categories = fs.readdirSync(BASE_LOCAL_PATH);

    for (const category of categories) {
        const catPath = path.join(BASE_LOCAL_PATH, category);
        if (!fs.statSync(catPath).isDirectory()) continue;

        console.log(`\nProcessing Category: ${category}`);

        // Inside categories are the actual places (e.g., Chợ Đà Lạt, Hồ Xuân Hương)
        const places = fs.readdirSync(catPath);

        for (const placeOrFile of places) {
            const placePath = path.join(catPath, placeOrFile);

            // If it's a directory (like in Nha Trang format), process as a folder of images
            if (fs.statSync(placePath).isDirectory()) {
                const placeId = generateId(PREFIX, placeOrFile);
                await processPlace(placeId, placePath, results);
            }
            // If it's a direct image file in the category folder
            else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(placeOrFile)) {
                const placeId = generateId(PREFIX, placeOrFile);
                if (!results[placeId]) results[placeId] = [];
                console.log(`  Processing File: ${placeId} ...`);

                const ext = path.extname(placeOrFile);
                const destPath = `places/${PREFIX}/${placeId}/${placeId}-1${ext}`;
                const url = await uploadFile(placePath, destPath);
                if (url) results[placeId].push(url);
            }
        }
    }

    console.log('\n--- Writing Results ---');
    fs.writeFileSync('uploaded_images_dalat.json', JSON.stringify(results, null, 2));
    console.log('Saved to uploaded_images_dalat.json');
}

main().catch(console.error);
