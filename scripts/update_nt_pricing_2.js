const fs = require('fs');
const path = require('path');

const updates = [
    // Nem Nướng
    {
        id: "nt-nemnuong",
        price: "~50.000-70.000 VND/người",
        duration: "30-45 phút",
        description: "Nem nướng Đặng Văn Quyên là địa chỉ ẩm thực quen thuộc tại Nha Trang, nổi tiếng với các món đặc sản mang đậm hương vị địa phương. Nhờ hương vị đặc trưng, khó quên, quán luôn thu hút đông đảo thực khách ghé thưởng thức."
    },
    {
        id: "nt-hotel-mangolia",
        price: "245.000 VND/ngày",
        note: "Không nằm sát biển và không có view hướng biển, bù lại gần các khu ăn uống và chợ, thuận tiện đi lại."
    },
    {
        id: "nt-hotel-ckd",
        price: "500.000 VND/ngày",
        note: "Mức giá ở mức trung bình–cao, bù lại nằm gần khu ăn uống và có thể dễ dàng đi bộ."
    },
    {
        id: "nt-hotel-maika",
        price: "344.000 VND/ngày",
        note: "Không nằm sát biển và không có view hướng biển, bù lại gần các địa điểm checkin, ăn uống hot trend."
    },
    {
        id: "nt-yen-vang",
        price: "320.000 VND/ngày",
        note: "Không gần biển, không có view biển; giá chưa nổi bật nhưng gần các điểm check-in, ăn uống hot."
    },
    {
        id: "nt-nha-trang-pearl",
        price: "295.000 VND/ngày",
        note: "Vị trí rất gần khu ăn uống nổi tiếng, thuận tiện di chuyển; tuy nhiên không nằm sát biển và không có view hướng biển."
    },
    {
        id: "nt-doimoi-family",
        price: "500.000 VND/ngày",
        note: "Vị trí gần ăn uống nổi tiếng, thuận tiện di chuyển; phù hợp đi theo nhóm hoặc gia đình, tuy nhiên mức giá khá cao so với các khách sạn cùng khu vực."
    },

    // Hải Sản
    {
        id: "nt-haisan",
        price: "~ 300.000 VND - 400.000 VND/người",
        duration: "30-45 phút",
        description: "Hải sản Thanh Sương là quán hải sản nổi tiếng tại Nha Trang, được nhiều thực khách yêu thích nhờ hải sản tươi ngon, chế biến nhanh và chỉ sử dụng nguyên liệu trong ngày. Với mức giá hợp lý, đây là địa điểm lý tưởng để tụ họp bạn bè, ăn nhậu thoải mái mà không lo tốn kém."
    },
    {
        id: "nt-hotel-vankim",
        price: "285.000 VND/ngày",
        note: "Không nằm sát biển và trung tâm thành phố, bù lại mức giá khá ưu đãi so với chất lượng."
    },
    {
        id: "nt-hotel-ruby",
        price: "391.000 VND/ngày",
        note: "Khách sạn có chất lượng tương đối tốt với mức giá hợp lý, tuy nhiên vị trí hơi xa trung tâm và các điểm tham quan nên việc di chuyển chưa thật sự thuận tiện."
    },
    {
        id: "nt-hotel-pearl",
        price: "334.000 VND/ngày",
        note: "Không nằm sát biển và xa trung tâm thành phố, bù lại gần các địa điểm khám phá du lịch."
    },
    {
        id: "nt-coral-boutique-2",
        price: "450.000 VND/ngày",
        note: "Phòng rộng, thiết kế đẹp; thuận tiện di chuyển đến điểm ăn uống, tuy nhiên vị trí xa trung tâm thành phố và mức giá khá cao."
    },
    {
        id: "nt-an-binh-tan",
        price: "560.000 VND/ngày",
        note: "Phòng đẹp, sạch sẽ; tuy nhiên khoảng cách đến điểm ăn khá xa, thời gian di chuyển lâu và mức giá tương đối cao."
    },
    {
        id: "nt-hao-phat",
        price: "340.000 VND/ngày",
        note: "Mức giá hợp lý, phù hợp ngân sách; tuy nhiên khoảng cách đến Hải sản Thanh Sương khá xa."
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
