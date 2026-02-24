require('dotenv/config');
const { searchPlaces } = require('./app/actions/search');

async function test() {
    const res = await searchPlaces({ destination: 'Đà Lạt' });
    console.log("Found places:", res.data?.length);
    if (res.data && res.data.length > 0) {
        console.log("First place images:", res.data[0].images);
        // Find a place we know has multiple images, like s79 khai ngoc
        const khaiNgoc = res.data.find(p => p.id === 'dl-s79-khai-ngoc-hotel');
        console.log("Khai Ngoc images:", khaiNgoc?.images);
    }
}

test();
