const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('./mock-trips-output.json', 'utf-8'));

function mapMockTrip(tripId, tripDays, dest, aiSchedule, defaultImage) {
    const activities = {};

    for (let d = 1; d <= tripDays; d++) {
        activities[d] = { morning: [], afternoon: [], evening: [] };
    }

    aiSchedule.forEach(daySchedule => {
        const dayNum = daySchedule.day;
        if (dayNum > tripDays) return;

        daySchedule.activities.forEach((act, idx) => {
            const hour = parseInt(act.time_slot?.split(':')[0] || '12');
            let period = 'morning';
            if (hour >= 17) period = 'evening';
            else if (hour >= 12) period = 'afternoon';

            const actId = `mock-${dest.replace(' ', '')}-${dayNum}-${period}-${idx}`;

            let img = act.image;
            if (!img || img.startsWith('/images/')) {
                img = defaultImage;
            }

            activities[dayNum][period].push({
                id: actId,
                title: act.activity || act.location_name,
                time: act.time_slot,
                period: period,
                place: {
                    name: act.location_name,
                    address: act.location_name,
                    image: img,
                    lat: dest === "Nha Trang" ? 12.238 : 11.940,
                    lng: dest === "Nha Trang" ? 109.196 : 108.435
                }
            });
        });
    });

    return {
        tripDays,
        destination: dest,
        activities
    };
}

const ntDefaultImage = "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-le-soleil/nt-le-soleil-1.jpg";
const dlDefaultImage = "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thien-vien-truc-lam/dl-thien-vien-truc-lam-1.jpg";

const finalOutput = {
    1: mapMockTrip(1, 4, "Nha Trang", rawData.NhaTrang.schedule, ntDefaultImage),
    2: mapMockTrip(2, 3, "Đà Lạt", rawData.DaLat.schedule, dlDefaultImage),
    101: mapMockTrip(101, 3, "Đà Lạt", rawData.DaLat.schedule, dlDefaultImage)
};

fs.writeFileSync('./mock-transformed.json', JSON.stringify(finalOutput, null, 2));
console.log("Transformed!");
