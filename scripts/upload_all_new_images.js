const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const getMimeType = (ext) => {
    switch (ext) {
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.avif': return 'image/avif';
        default: return 'application/octet-stream';
    }
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map human readable folder/file names to our place IDs
const mapNameToId = (filename, cityPrefix) => {
    let lower = filename.toLowerCase();

    // Da Lat mapping
    if (cityPrefix === 'dl-') {
        if (lower.includes('s79')) return 'dl-s79-khai-ngoc-hotel'; // Generate new ID
        if (lower.includes('anna')) return 'dl-anna-suong-hotel'; // Generate new ID
        if (lower.includes('happy day')) return 'dl-happy-day-2-guesthouse'; // Generate new ID
        if (lower.includes('qa hotel')) return 'dl-qa-hotel'; // Generate new ID
        if (lower.includes('winterfell')) return 'dl-winterfell-hotel'; // Generate new ID
        if (lower.includes('windy hill')) return 'dl-windy-hill-homestay'; // Generate new ID
        if (lower.includes('pontus')) return 'dl-pontus-hotel'; // Generate new ID
        if (lower.includes('manor villa')) return 'dl-the-manor-villas'; // Generate new ID
        if (lower.includes('rainbow')) return 'dl-rainbow-homestay-cau-dat'; // Generate new ID
        if (lower.includes('mộc trà') || lower.includes('moc tra')) return 'dl-moc-tra-farm'; // Generate new ID
        if (lower.includes('hoàng gia trang') || lower.includes('hoang gia trang')) return 'dl-hoang-gia-trang'; // Generate new ID
        if (lower.includes('nature hotel')) return 'dl-nature-hotel'; // Generate new ID
        if (lower.includes('mây bách') || lower.includes('may bach')) return 'dl-may-bach-da-lat';
        if (lower.includes('lê homestay') || lower.includes('le homestay')) return 'dl-le-homestay';

        // Attractions (existing)
        if (lower.includes('đồi chè') || lower.includes('cau dat')) return 'dl-doi-che-cau-dat-cau-dat-farm';
        if (lower.includes('cho dem') || lower.includes('chợ đêm')) return 'dl-cho-dem-da-lat';
        if (lower.includes('ga đà lạt') || lower.includes('ga da lat')) return 'dl-ga-da-lat';
        if (lower.includes('lẩu gà lá é') || lower.includes('lau ga')) return 'dl-quan-lau-ga-la-e-tao-ngo';
        if (lower.includes('quảng trường') || lower.includes('quang truong')) return 'dl-quang-truong-lam-vien';
        if (lower.includes('túi mơ to') || lower.includes('tui mo to')) return 'dl-tiem-ca-phe-tui-mo-to';
        if (lower.includes('thác datanla') || lower.includes('datanla')) return 'dl-khu-du-lich-thac-datanla';
        if (lower.includes('nhà thờ con gà') || lower.includes('nha tho')) return 'dl-nha-tho-con-ga'; // Generate new ID
        if (lower.includes('hotel colline') || lower.includes('colline')) return 'dl-hotel-colline';

        // Check static ones
        if (lower.includes('cơm niêu') || lower.includes('com nieu')) return 'dl-comnieunhungoc';
        if (lower.includes('an cafe')) return 'dl-ancafe';
        if (lower.includes('vạn thành') || lower.includes('van thanh')) return 'dl-langhoavanthanh';
        if (lower.includes('fresh garden')) return 'dl-freshgarden';
        if (lower.includes('thác voi') || lower.includes('thac voi')) return 'dl-thacvoi';
        if (lower.includes('dinh bảo đại') || lower.includes('dinh bao dai')) return 'dl-dinhbaodai3';
        if (lower.includes('langbiang')) return 'dl-langbiang';
        if (lower.includes('hồ xuân hương') || lower.includes('ho xuan huong')) return 'dl-hoxuanhuong';
        if (lower.includes('thiền viện') || lower.includes('thien vien')) return 'dl-thienvientruclam';
        if (lower.includes('làng k') || lower.includes('lang k')) return 'dl-langkho';
        if (lower.includes('horizon')) return 'dl-horizoncoffee';
        if (lower.includes('léguda') || lower.includes('leguda')) return 'dl-buffetleguda';
        if (lower.includes('vườn hoa thành phố') || lower.includes('vuon hoa')) return 'dl-vuonhoathanhpho';
        if (lower.includes('memory')) return 'dl-nhahangmemory';
        if (lower.includes('mongo land')) return 'dl-mongoland';
        if (lower.includes('hoa sơn') || lower.includes('hoa son')) return 'dl-hoasondientrang';
        if (lower.includes('tà nung') || lower.includes('ta nung')) return 'dl-tanungxua';
        if (lower.includes('du parc')) return 'dl-duparchotel';
    }

    // Default transformation if not matched above
    const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/\d+/g, '').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    return `${cityPrefix}${cleanName}`;
};

async function uploadFolder(baseDir, cityPrefix) {
    if (!fs.existsSync(baseDir)) {
        console.log(`Directory not found: ${baseDir}`);
        return;
    }

    const categories = fs.readdirSync(baseDir);
    let allUploadedPaths = {}; // Maps ID -> [urls]

    for (const category of categories) {
        const catPath = path.join(baseDir, category);
        if (!fs.statSync(catPath).isDirectory()) continue;

        const files = fs.readdirSync(catPath);
        for (const file of files) {
            if (file.startsWith('.')) continue;

            const filePath = path.join(catPath, file);
            if (fs.statSync(filePath).isDirectory()) continue;

            const placeId = mapNameToId(file, cityPrefix);

            // Generate sequential numbering for files of the same place
            if (!allUploadedPaths[placeId]) allUploadedPaths[placeId] = [];
            let index = allUploadedPaths[placeId].length + 1;

            const ext = path.extname(file).toLowerCase();
            const supabasePath = `places/${cityPrefix.replace('-', '')}/${placeId}/${placeId}-${index}${ext}`;

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
                    allUploadedPaths[placeId].push(publicUrlData.publicUrl);
                }
            } catch (err) {
                console.error(`  ❌ Upload exception:`, err);
            }
        }
    }

    return allUploadedPaths;
}

async function run() {
    console.log("--- STARTING UPLOADS ---");

    console.log("\\n--- DA LAT ---");
    const dlPaths = await uploadFolder('e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\ĐÀ LẠT', 'dl-');
    fs.writeFileSync('scripts/dl_new_images.json', JSON.stringify(dlPaths, null, 2));

    console.log("\\n--- NHA TRANG ---");
    // Just handling Nha trang missing ones, assuming the same ID logic
    const ntPaths = await uploadFolder('e:\\TP\\TRAVEL PATH\\Ảnh địa điểm\\NHA TRANG', 'nt-');
    fs.writeFileSync('scripts/nt_new_images.json', JSON.stringify(ntPaths, null, 2));

    console.log("Finished uploads. Saved maps to scripts/*.json");
}

run();
