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
                theme: "Khám phá và thư giãn",
                budget: "Trung bình",
                preferences: "Gợi ý tự động",
                start_date: "2026-03-01",
                end_date: endDate,
                start_time: "08:00",
                end_time: "21:00"
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
    if (nt) {
        fs.writeFileSync("./mock-trips-output.json", JSON.stringify({ NhaTrang: nt }, null, 2));
    }
    console.log("Done");
}

main();
