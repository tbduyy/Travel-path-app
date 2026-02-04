
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'home-page';

// Use absolute paths as provided by the user
const filesToUpload = [
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/TRANG CHỦ.png', storagePath: 'hero-bg-new.png', contentType: 'image/png' },
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/NHA TRANG.webp', storagePath: 'cities/nhatrang.webp', contentType: 'image/webp' },
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/ĐÀ LẠT.jpg', storagePath: 'cities/dalat.jpg', contentType: 'image/jpeg' },
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/HỘI AN.jpg', storagePath: 'cities/hoian.jpg', contentType: 'image/jpeg' },
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/SÀI GÒN.jpg', storagePath: 'cities/saigon.jpg', contentType: 'image/jpeg' },
    { localPath: 'E:/TP/TRAVEL PATH/Ảnh website/HÀ NỘI.jpg', storagePath: 'cities/hanoi.jpg', contentType: 'image/jpeg' },
];

async function uploadFiles() {
    console.log(`Starting upload to bucket: ${BUCKET_NAME}...`);

    for (const file of filesToUpload) {
        try {
            // Use the absolute path directly
            const filePath = file.localPath;

            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue;
            }

            const fileBuffer = fs.readFileSync(filePath);

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(file.storagePath, fileBuffer, {
                    contentType: file.contentType,
                    upsert: true
                });

            if (error) {
                console.error(`Error uploading ${file.storagePath}:`, error.message);
            } else {
                console.log(`✅ Uploaded: ${file.storagePath}`);
            }
        } catch (err) {
            console.error(`Unexpected error for ${file.localPath}:`, err);
        }
    }
}

uploadFiles();
