
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'places';
const BASE_LOCAL_PATH = 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper to normalize keys
const normalize = (str: string) => str.trim();

// City Configurations
interface CityConfig {
    name: string;
    prefix: string; // Prefix for IDs (e.g., 'hn', 'hcm')
    mode: 'nhatrang' | 'flat-categories' | 'direct-places' | 'mixed-hanoi';
}

const cities: CityConfig[] = [
    { name: 'NHA TRANG', prefix: 'nt', mode: 'nhatrang' },
    { name: 'HÀ NỘI', prefix: 'hn', mode: 'mixed-hanoi' },
    { name: 'TP.HCM', prefix: 'hcm', mode: 'direct-places' },
    { name: 'ĐÀ NẴNG', prefix: 'dn', mode: 'direct-places' },
    { name: 'ĐÀ LẠT', prefix: 'dl', mode: 'flat-categories' },
];

async function uploadFile(filePath: string, destinationPath: string) {
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

function getFiles(dir: string, fileList: string[] = []) {
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

// Generate ID from name
function generateId(prefix: string, name: string): string {
    // Remove numbers like "1.1." at start
    let clean = name.replace(/^[\d\.\s]+/, '');
    // Remove file extension if present
    clean = clean.replace(/\.[^/.]+$/, "");

    // Slugify
    const slug = clean.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${prefix}-${slug}`;
}

async function main() {
    console.log('Starting multi-city upload...');
    const results: Record<string, string[]> = {};

    for (const city of cities) {
        console.log(`\nProcessing City: ${city.name} (${city.mode})`);
        const cityPath = path.join(BASE_LOCAL_PATH, city.name);

        if (!fs.existsSync(cityPath)) {
            console.warn(`Path not found: ${cityPath}`);
            continue;
        }

        const items = fs.readdirSync(cityPath);

        // --- NHA TRANG MODE (Category/Place/Images) ---
        if (city.mode === 'nhatrang') {
            for (const category of items) {
                const catPath = path.join(cityPath, category);
                if (!fs.statSync(catPath).isDirectory()) continue;

                const places = fs.readdirSync(catPath);
                for (const placeName of places) {
                    const placePath = path.join(catPath, placeName);
                    if (!fs.statSync(placePath).isDirectory()) continue;

                    // Manual mappings for Nha Trang legacy support (optional, or just generate new IDs)
                    // We'll use generateId for consistency on new runs, or we can keep the map if vital.
                    // For now, let's use generated IDs to ensure we cover *everything*, 
                    // reusing the logic. BUT we must match existing data if possible.
                    // Let's stick to generating consistent IDs.
                    const placeId = generateId(city.prefix, placeName);

                    // Special override for known IDs to match existing nhaTrangData.ts if needed
                    // But mostly we are doing a fresh sync for other cities.
                    // Let's keep existing logic for Nha Trang if we wanted to preserve exact IDs,
                    // but generateId should be close enough or we update seed.

                    await processPlace(placeId, placePath, results, city.prefix);
                }
            }
        }

        // --- DIRECT PLACES MODE (Place/Images) ---
        // Used by HCM, Da Nang
        if (city.mode === 'direct-places') {
            for (const placeName of items) {
                const placePath = path.join(cityPath, placeName);
                if (fs.statSync(placePath).isDirectory()) {
                    const placeId = generateId(city.prefix, placeName);
                    await processPlace(placeId, placePath, results, city.prefix);
                }
            }
        }

        // --- FLAT CATEGORIES MODE (Category/ImageIsPlace) ---
        // Used by Da Lat
        if (city.mode === 'flat-categories') {
            for (const category of items) {
                const catPath = path.join(cityPath, category);
                if (!fs.statSync(catPath).isDirectory()) continue;

                const files = fs.readdirSync(catPath);
                for (const file of files) {
                    if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
                        const placeId = generateId(city.prefix, file);
                        const filePath = path.join(catPath, file);
                        await processSingleImagePlace(placeId, filePath, results, city.prefix);
                    }
                }
            }
        }

        // --- MIXED HANOI MODE ---
        if (city.mode === 'mixed-hanoi') {
            for (const item of items) {
                const itemPath = path.join(cityPath, item);
                if (!fs.statSync(itemPath).isDirectory()) continue;

                if (item === 'KHÁCH SẠN') {
                    // Treat contents as List of Places (Images)
                    const files = fs.readdirSync(itemPath);
                    for (const file of files) {
                        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
                            const placeId = generateId(city.prefix, file);
                            const filePath = path.join(itemPath, file);
                            await processSingleImagePlace(placeId, filePath, results, city.prefix);
                        }
                    }
                } else {
                    // Treat folder as a Place
                    const placeId = generateId(city.prefix, item);
                    await processPlace(placeId, itemPath, results, city.prefix);
                }
            }
        }
    }

    console.log('\n--- Writing Results ---');
    fs.writeFileSync('uploaded_images_all.json', JSON.stringify(results, null, 2));
    console.log('Saved to uploaded_images_all.json');
}

async function processPlace(placeId: string, dirPath: string, results: any, prefix: string) {
    if (results[placeId]) return; // Skip if done
    results[placeId] = [];
    console.log(`  Processing Place: ${placeId} ...`);

    const images = getFiles(dirPath);
    for (let i = 0; i < images.length; i++) {
        const ext = path.extname(images[i]);
        const destPath = `places/${prefix}/${placeId}/${placeId}-${i + 1}${ext}`;
        const url = await uploadFile(images[i], destPath);
        if (url) results[placeId].push(url);
    }
}

async function processSingleImagePlace(placeId: string, filePath: string, results: any, prefix: string) {
    if (results[placeId]) return;
    results[placeId] = [];
    console.log(`  Processing File-Place: ${placeId} ...`);

    const ext = path.extname(filePath);
    const destPath = `places/${prefix}/${placeId}/${placeId}-1${ext}`;
    const url = await uploadFile(filePath, destPath);
    if (url) results[placeId].push(url);
}

main().catch(console.error);
