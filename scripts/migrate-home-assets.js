const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Credentials from .env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'home-page';

const filesToUpload = [
    // Root public
    'hero-bg.png',
    'hero-title.png',
    'header-bg.png',
    'logo.png',
    'logo-name.png',
    'tagline.png',
    'user-avatar.png',
    'hero-bg.png', // Already listed, checking if I missed any
    // Assets Home
    'assets/home/grab.png',
    'assets/home/partner-1.png',
    'assets/home/partner-2.png',
    'assets/home/arrow-left.png',
    'assets/home/arrow-right.png',
    'assets/home/TRAVEL PATH (1) 2.png',
    // Assets Search Bar
    'assets/search-bar/rectangle-1.png',
    'assets/search-bar/rectangle-2.png',
    'assets/search-bar/line-4.png',
    'assets/search-bar/search-icon.png',
    'assets/search-bar/rectangle-3.png',
    'assets/search-bar/tao-lich-trinh.png'
];

async function migrate() {
    console.log(`Starting migration to bucket: ${BUCKET_NAME}...`);

    for (const relPath of filesToUpload) {
        const fullPath = path.join(__dirname, '../public', relPath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`File not found: ${fullPath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(fullPath);
        // We can keep the same structure or flatten. Let's keep it clean in the bucket.
        const fileName = relPath;

        console.log(`Uploading ${relPath}...`);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: relPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error(`Error uploading ${relPath}:`, error.message);
        } else {
            console.log(`Success: ${relPath}`);
        }
    }

    console.log('Migration completed!');
}

migrate().catch(console.error);
