const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'places';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

async function main() {
    console.log('Starting Yang Bay upload...');

    const placeId = 'nt-yangbay';
    const PREFIX = 'nha-trang'; // Atraction images should probably be in nha-trang folder

    const image1 = 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\NHA TRANG\\ĐỊA ĐIỂM THAM QUAN\\THÁC YANG BAY\\thac-Yang-Bay-Nha-Trang-hinh-anh14_1627981128.jpg';
    const image2 = 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\NHA TRANG\\ĐỊA ĐIỂM THAM QUAN\\THÁC YANG BAY\\yang-bay-nha-trang.jpg';

    const url1 = await uploadFile(image1, `places/${PREFIX}/${placeId}/${placeId}-1.jpg`);
    console.log(url1);

    const url2 = await uploadFile(image2, `places/${PREFIX}/${placeId}/${placeId}-2.jpg`);
    console.log(url2);

}

main().catch(console.error);
