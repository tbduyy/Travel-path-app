const fs = require("fs");
const targetUrl = "https://huynhtrungkiet09032005-travel-path-ai-backend.hf.space/api/v1/planning/itinerary/generate";

async function generateTrip(dest, days, endDate) {
    console.log(`Sending request for ${dest}...`);
    try {
        const res = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                destination: dest,
                days: days,
                theme: "Thư giãn",
                budget: 5000000,
                preferences: "Gợi ý tự động",
                start_date: "2026-03-01",
                end_date: endDate,
                start_time: "08:00",
                hotel_location: dest === "Nha Trang"
                    ? { lat: 12.238, lng: 109.196, name: "Nha Trang", address: "Trần Phú" }
                    : { lat: 11.940, lng: 108.435, name: "Đà Lạt", address: "Trung tâm" },
                mandatory_spots: [],
                wishlist_spots: [],
                num_people: 2,
                travel_style: "relaxation"
            })
        });
        console.log(`Response status for ${dest}:`, res.status);
        const data = await res.json();
        if (!res.ok) {
            fs.writeFileSync("./mock-err.json", JSON.stringify(data, null, 2));
            return null;
        }
        return data;
    } catch (err) {
        console.error(`Error for ${dest}:`, err);
        return null;
    }
}

async function main() {
    const nt = await generateTrip("Nha Trang", 4, "2026-03-04");
    const dl = await generateTrip("Đà Lạt", 3, "2026-03-03");

    const output = {};
    if (nt) output.NhaTrang = nt;
    if (dl) output.DaLat = dl;

    fs.writeFileSync("./mock-trips-output.json", JSON.stringify(output, null, 2));
    console.log("Done");
}

main();
