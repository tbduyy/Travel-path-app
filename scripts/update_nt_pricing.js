const fs = require('fs');
const path = require('path');

const updates = [
    {
        id: "nt-vinwonders",
        price: "920.000 VND/người",
        duration: "12-13 tiếng",
        description: "Công viên VinWonders Nha Trang tọa lạc trên đảo Hòn Tre, được xem là thiên đường vui chơi – giải trí hàng đầu với hệ thống cáp treo vượt biển độc đáo và quần thể giải trí đẳng cấp quốc tế. Nơi đây hội tụ đa dạng trải nghiệm từ các trò chơi cảm giác mạnh, công viên nước sôi động, thủy cung kỳ thú đến khu vui chơi gia đình và những màn trình diễn ấn tượng. Phù hợp với mọi độ tuổi, VinWonders là điểm đến không thể bỏ qua trong hành trình khám phá Nha Trang."
    },
    {
        id: "nt-hotel-vinpearl",
        price: "3.700.000 VND/phòng/ngày",
        note: "Giá hơi cao hơn mặt bằng chung nhưng đã bao gồm vé VinWonders 2N1Đ nên vẫn hợp lý, đồng thời thuộc nhóm khách sạn 5 sao tiện nghi hàng đầu tại Nha Trang."
    },
    {
        id: "nt-hotel-dendro",
        price: "348.000 VND/ngày",
        note: "Khách sạn nằm giữa trung tâm và VinWonders nên hơi bất tiện đi dạo trong trung tâm, bù lại đối diện biển, không gian thoáng và giá khá bình dân."
    },
    {
        id: "nt-hotel-dubai",
        price: "280.000 VND/ngày",
        note: "Vị trí khá xa VinWonders nên việc di chuyển chưa thật sự thuận tiện, bù lại khách sạn có mức giá rẻ và nằm trong trung tâm thành phố, phù hợp với du khách ưu tiên tiết kiệm chi phí."
    },
    {
        id: "nt-cliff-house",
        price: "400.000 VND/ngày",
        note: "Vị trí gần VinWonders giúp việc di chuyển thuận tiện; tuy nhiên, do cách xa trung tâm nên chi phí di chuyển giữa các điểm tham quan trong khu vực trung tâm khá cao."
    },
    {
        id: "nt-ba-sao",
        price: "220.000 VND/ngày",
        note: "Giá phòng rẻ, phù hợp lưu trú ngắn ngày; nhưng không nằm gần VinWonders, cần cân nhắc chi phí di chuyển."
    },
    {
        id: "nt-aqua-seaview",
        price: "405.000 VND/ngày",
        note: "Gần biển, phù hợp nghỉ dưỡng; cách VinWonders không xa nhưng chi phí lưu trú cao hơn so với các khách sạn giá rẻ."
    },
    {
        id: "nt-tour3dao",
        price: "700.000 VND/người",
        duration: "8-9 tiếng",
        description: "Tour 3 đảo Nha Trang đưa du khách khám phá Hòn Mun – làng chài – Mini Beach, mang đến trải nghiệm trọn vẹn giữa thiên nhiên biển xanh trong lành. Bạn sẽ được tắm biển, lặn ngắm san hô rực rỡ tại Hòn Mun, tìm hiểu đời sống mộc mạc của ngư dân làng chài và thưởng thức hải sản tươi ngon. Hành trình kết thúc tại Mini Beach yên bình, nơi lý tưởng để thư giãn và tận hưởng nắng gió biển. Tour có hướng dẫn viên đồng hành và hỗ trợ đưa đón tận khách sạn, giúp chuyến đi thêm thuận tiện và thoải mái."
    },
    {
        id: "nt-hotel-dolphin",
        price: "257.000 VND/ngày",
        note: "Khách sạn gần trung tâm và có mức giá ưu đãi nên thường nhanh hết phòng; bên cạnh đó, đánh giá của khách hàng về chất lượng phòng vẫn còn chưa đồng nhất."
    },
    {
        id: "nt-hotel-brilliant",
        price: "300.000 VND/ngày",
        note: "Vị trí hơi xa trung tâm, bù lại sở hữu view biển đối diện thoáng đẹp."
    },
    {
        id: "nt-hotel-palm",
        price: "347.000 VND/ngày",
        note: "Mức giá không quá nổi bật so với mặt bằng phân khúc, nhưng bù lại nằm gần trung tâm và thuận tiện di chuyển đến các điểm du lịch."
    },
    {
        id: "nt-vitamin-sea-homestay",
        price: "320.000 VND/ngày",
        note: "Vị trí gần trung tâm thành phố, thuận tiện di chuyển; tuy nhiên không đối diện biển."
    },
    {
        id: "nt-sen-vang-luxury",
        price: "265.000 VND/ngày",
        note: "Giá rẻ, gần trung tâm thành phố; tuy nhiên không đối diện biển."
    },
    {
        id: "nt-nha-trang-prince",
        price: "540.000 VND/ngày",
        note: "Gần trung tâm thành phố, khách sạn tiêu chuẩn 5 sao; tuy nhiên mức giá cao hơn so với các lựa chọn lưu trú bình dân."
    },
    {
        id: "nt-quangtruong",
        price: "Miễn phí",
        duration: "15-30 phút",
        description: "Quảng trường 2/4 tọa lạc tại trung tâm thành phố Nha Trang, Khánh Hòa, là biểu tượng du lịch sôi động và trái tim văn hóa của thành phố biển. Nổi bật với tháp Trầm Hương độc đáo, nơi đây là điểm dừng chân không thể bỏ qua để dạo bộ, thưởng thức ẩm thực, và tham gia các sự kiện, lễ hội lớn."
    },
    {
        id: "nt-hotel-suncity",
        price: "338.000 VND/ngày",
        note: "Giá hơi nhỉnh so với mặt bằng chung và cần đặt trước (không hoàn hủy do phòng rất hot, nhanh kín), bù lại khách sạn đối diện biển và nằm gần quảng trường cùng các điểm du lịch."
    },
    {
        id: "nt-hotel-lesoleil",
        price: "360.000 VND/ngày",
        note: "Mức giá không quá ưu đãi, nhưng có kèm bữa sáng miễn phí và vị trí gần trung tâm, thuận tiện di chuyển."
    },
    {
        id: "nt-hotel-nangbien",
        price: "266.000 VND/ngày",
        note: "Do mức giá rẻ nên chất lượng chỉ ở mức cơ bản so với phân khúc, bù lại khách sạn có vị trí đối diện biển và gần các điểm du lịch."
    },
    {
        id: "nt-corgi-house-central",
        price: "630.000 VND/ngày",
        note: "Phòng rộng, đầy đủ tiện nghi; vị trí trung tâm thuận tiện di chuyển, nhưng giá lưu trú cao hơn các lựa chọn bình dân."
    },
    {
        id: "nt-anna-beach",
        price: "490.000 VND/ngày",
        note: "Phòng đẹp, rộng và thiết kế sang trọng; tuy nhiên không có view biển và mức giá khá cao."
    },
    {
        id: "nt-golden",
        price: "320.000 VND/ngày",
        note: "Có view biển, phòng rộng và thiết kế sang trọng trong khi mức giá khá cạnh tranh ở phân khúc hạng trung."
    }
];

const file = path.join(__dirname, '../app/data/nhaTrangData.ts');
let content = fs.readFileSync(file, 'utf8');

updates.forEach(update => {
    const idIndex = content.indexOf(`id: "${update.id}"`);
    if (idIndex === -1) {
        console.log(`Could not find ${update.id}`);
        return;
    }

    const startIndex = content.lastIndexOf('{', idIndex);
    const endIndex = content.indexOf('}', idIndex + 200); // approximate

    // Using a safer block extraction since } can appear in tags
    let blockEnd = idIndex;
    let braceCount = 0;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                blockEnd = i;
                break;
            }
        }
    }

    let block = content.substring(startIndex, blockEnd + 1);

    if (update.price) {
        block = block.replace(/price:\s*"[^"]*",/g, `price: "${update.price}",`);
    }
    if (update.duration) {
        if (block.includes('duration:')) {
            block = block.replace(/duration:\s*"[^"]*",/g, `duration: "${update.duration}",`);
        } else {
            block = block.replace(/price:\s*"[^"]*",\n/, `$&    duration: "${update.duration}",\n`);
        }
    }
    if (update.description) {
        // Careful with description as it can be long and have commas
        block = block.replace(/description:\s*"[^"]*",/g, `description: "${update.description}",`);
    }
    if (update.note) {
        block = block.replace(/note:\s*"[^"]*"/g, `note: "${update.note}"`);
    }

    content = content.substring(0, startIndex) + block + content.substring(blockEnd + 1);
    console.log(`Updated ${update.id}`);
});

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully updated nhaTrangData");
