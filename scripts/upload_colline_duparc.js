require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getMimeType = (ext) => {
    switch (ext) {
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.avif': return 'image/avif';
        default: return 'application/octet-stream';
    }
}

const foldersToUpload = [
    {
        dir: 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\ĐÀ LẠT\\KHÁCH SẠN\\KS Colline',
        id: 'dl-hotel-colline'
    },
    {
        dir: 'e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\ĐÀ LẠT\\KHÁCH SẠN\\KS Du Parc',
        id: 'dl-duparchotel'
    }
];

async function run() {
    console.log("--- STARTING UPLOADS ---");
    let allUploadedPaths = {};

    for (const folder of foldersToUpload) {
        if (!fs.existsSync(folder.dir)) {
            console.log(`Directory not found: ${folder.dir}`);
            continue;
        }

        const files = fs.readdirSync(folder.dir);
        allUploadedPaths[folder.id] = [];
        let index = 1;

        for (const file of files) {
            if (file.startsWith('.')) continue;

            const filePath = path.join(folder.dir, file);
            if (fs.statSync(filePath).isDirectory()) continue;

            const ext = path.extname(file).toLowerCase();
            const supabasePath = `places/dl/${folder.id}/${folder.id}-${index}${ext}`;

            console.log(`Uploading ${file} -> ${supabasePath}`);

            try {
                const fileBuffer = fs.readFileSync(filePath);
                const { data, error } = await supabase.storage
                    .from('places')
                    .upload(supabasePath, fileBuffer, {
                        contentType: getMimeType(ext),
                        upsert: true
                    });

                if (error) {
                    console.error(`  ❌ Error: ${error.message}`);
                } else {
                    console.log(`  ✅ Success`);
                    const { data: publicUrlData } = supabase.storage.from('places').getPublicUrl(supabasePath);
                    allUploadedPaths[folder.id].push(publicUrlData.publicUrl);
                    index++;
                }
            } catch (err) {
                console.error(`  ❌ Upload exception:`, err);
            }
        }
    }

    fs.writeFileSync('scripts/recent_uploaded_images.json', JSON.stringify(allUploadedPaths, null, 2));
    console.log("Finished uploads. Saved maps to scripts/recent_uploaded_images.json");
}

run();
