
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

const filesToUpload = [
    {
        localPath: path.join(__dirname, '../public/hero-title.png'),
        storagePath: 'hero-title.png',
        contentType: 'image/png'
    },
];

async function uploadFiles() {
    console.log(`Starting upload to bucket: ${BUCKET_NAME}...`);

    for (const file of filesToUpload) {
        try {
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
