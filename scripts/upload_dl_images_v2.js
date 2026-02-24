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
    // 1. Remove numbering prefixes like "1.1 ", "1.2. "
    let clean = name.replace(/^[\d\.\s]+/, '');
    // 2. Remove file extension
    clean = clean.replace(/\.[^/.]+$/, "");
    // 3. Remove "(1)" or " (1)" suffixes often caused by duplicates
    clean = clean.replace(/\s*\(\d+\)$/, "");
    // 4. Slugify
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
            contentType: 'image/jpeg', // It will serve as the actual format but use this as default generic
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

async function main() {
    console.log('Starting Da Lat upload v2 (Grouping multiple images)...');
    const results = {}; // { placeId: [url1, url2] }

    if (!fs.existsSync(BASE_LOCAL_PATH)) {
        console.warn(`Path not found: ${BASE_LOCAL_PATH}`);
        return;
    }

    const categories = fs.readdirSync(BASE_LOCAL_PATH);

    // Step 1: Group files by placeId
    const placeGroups = {}; // { placeId: [filePath1, filePath2] }

    for (const category of categories) {
        const catPath = path.join(BASE_LOCAL_PATH, category);
        if (!fs.statSync(catPath).isDirectory()) continue;

        const files = fs.readdirSync(catPath);

        for (const file of files) {
            const filePath = path.join(catPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                // If it's a directory, all files inside belong to this place
                const subFiles = fs.readdirSync(filePath);
                for (const subFile of subFiles) {
                    if (/\.(jpg|jpeg|png|webp|avif)$/i.test(subFile)) {
                        const placeId = generateId(PREFIX, file); // ID based on folder name
                        if (!placeGroups[placeId]) placeGroups[placeId] = new Set();
                        placeGroups[placeId].add(path.join(filePath, subFile));
                    }
                }
            } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
                // Normal file
                const placeId = generateId(PREFIX, file);
                if (!placeGroups[placeId]) placeGroups[placeId] = new Set();
                placeGroups[placeId].add(filePath);
            }
        }
    }

    // Step 2: Upload grouped files sequentially
    for (const [placeId, filePathsSet] of Object.entries(placeGroups)) {
        const filePaths = Array.from(filePathsSet);
        results[placeId] = [];
        console.log(`\nProcessing Place: ${placeId} (${filePaths.length} images)`);

        let fileIndex = 1;
        for (const filePath of filePaths) {
            const ext = path.extname(filePath);
            const destPath = `places/${PREFIX}/${placeId}/${placeId}-${fileIndex}${ext}`;
            console.log(`  -> Uploading: ${destPath}`);
            const url = await uploadFile(filePath, destPath);
            if (url) {
                results[placeId].push(url);
                fileIndex++;
            }
        }
    }

    // Step 3: Save results
    console.log('\n--- Writing Results ---');
    fs.writeFileSync('uploaded_images_dalat_v2.json', JSON.stringify(results, null, 2));
    console.log('Saved to uploaded_images_dalat_v2.json');
}

main().catch(console.error);
