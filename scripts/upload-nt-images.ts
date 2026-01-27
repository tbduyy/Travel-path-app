

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv(filePath: string) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv('.env');
loadEnv('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. url:", supabaseUrl, "key present:", !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_DIR = "e:/TP/TRAVEL PATH/Ảnh địa điểm/NHA TRANG";

const MAPPING = {
    // Top Level Folders
    "nt-vinwonders": "ĐỊA ĐIỂM THAM QUAN/VINWONDERS NHA TRANG",
    "nt-tour3dao": "ĐỊA ĐIỂM THAM QUAN/TOUR 3 ĐẢO",
    "nt-quangtruong": "ĐỊA ĐIỂM THAM QUAN/QUẢNG TRƯỜNG 2-4",
    "nt-baotang": "ĐỊA ĐIỂM THAM QUAN/BẢO TÀNG HẢI DƯƠNG HỌC",
    "nt-amchua": "ĐỊA ĐIỂM THAM QUAN/ĐẬP AM CHÚA",
    "nt-nhahatdo": "ĐỊA ĐIỂM THAM QUAN/NHÀ HÁT ĐÓ",

    // Hotels
    "nt-hotel-vinpearl": "KHÁCH SẠN/Vinpearl Beachfront",
    "nt-hotel-dendro": "KHÁCH SẠN/DENDRO",
    "nt-hotel-dubai": "KHÁCH SẠN/DUBAI HOTEL",
    "nt-hotel-dolphin": "KHÁCH SẠN/DOLPHIN BAY",
    "nt-hotel-brilliant": "KHÁCH SẠN/Brilliant Bay",
    "nt-hotel-palm": "KHÁCH SẠN/PALM BEACH",
    "nt-hotel-suncity": "KHÁCH SẠN/SUN CITY",
    "nt-hotel-lesoleil": "KHÁCH SẠN/ LE SOLEIL", // Space in folder name? Yes, checked ls output
    "nt-hotel-nangbien": "KHÁCH SẠN/NẮNG BIỂN SUNNY SEA",
    "nt-hotel-mangolia": "KHÁCH SẠN/Mangolia",
    "nt-hotel-ckd": "KHÁCH SẠN/CKD Nha Trang",
    "nt-hotel-maika": "KHÁCH SẠN/MAIKA",
    "nt-hotel-vankim": "KHÁCH SẠN/VẠN KIM",
    "nt-hotel-ruby": "KHÁCH SẠN/Ruby Luxury",
    "nt-hotel-pearl": "KHÁCH SẠN/Pearl City",

    // Food/Drink
    "nt-nemnuong": "QUÁN ĂN/NEM NƯỚNG ĐẶNG VĂN QUYÊN",
    "nt-haisan": "QUÁN ĂN/HẢI SẢN THANH SƯƠNG",
    "nt-comga": "QUÁN ĂN/CƠM GÀ NÚI MỘT",
    "nt-banhcan": "QUÁN ĂN/BÁNH CĂN 51",
    "nt-zbeach": "QUÁN ĂN/Z BEACH",
};

async function uploadImage(id: string, folderRelPath: string) {
    const fullPath = path.join(BASE_DIR, folderRelPath);
    if (!fs.existsSync(fullPath)) {
        console.warn(`[WARN] Folder not found: ${fullPath}`);
        return null;
    }

    const files = fs.readdirSync(fullPath);
    const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    if (!imageFile) {
        console.warn(`[WARN] No image found in: ${fullPath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(path.join(fullPath, imageFile));
    const ext = path.extname(imageFile);
    const storagePath = `nha-trang/${id}${ext}`;

    const { data, error } = await supabase.storage
        .from('places')
        .upload(storagePath, fileBuffer, {
            upsert: true,
            contentType: `image/${ext.replace('.', '')}`
        });

    if (error) {
        console.error(`[ERROR] Failed to upload ${id}:`, error.message);
        return null;
    }

    const { data: publicData } = supabase.storage
        .from('places')
        .getPublicUrl(storagePath);

    return publicData.publicUrl;
}

async function main() {
    console.log("Starting upload...");
    const results: Record<string, string> = {};

    for (const [id, folder] of Object.entries(MAPPING)) {
        console.log(`Processing ${id}...`);
        const url = await uploadImage(id, folder);
        if (url) {
            results[id] = url;
            console.log(`  -> Uploaded: ${url}`);
        }
    }

    console.log("\n--- RESULT MAP ---");
    console.log(JSON.stringify(results, null, 2));
}

main();
