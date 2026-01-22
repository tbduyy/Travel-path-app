import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.tripItem.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.place.deleteMany({})

    // Seed Places (Dalat Data)
    const places = [
        {
            name: 'Hotel Colline',
            description: 'Khách sạn 4 sao nổi bật với kiến trúc khối nâu hiện đại ngay trung tâm Đà Lạt. Gần Hồ Xuân Hương và Chợ Đà Lạt.',
            type: 'HOTEL',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop', // Placeholder or local asset path
            priceLevel: 4,
            address: '10 Phan Bội Châu, Phường 1, Thành phố Đà Lạt',
        },
        {
            name: 'Nhà Hàng Le Rabelais',
            description: 'Nhà hàng kiến trúc Pháp sang trọng, view đẹp nhìn ra Hồ Xuân Hương. Chuyên món Âu và rượu vang.',
            type: 'RESTAURANT',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2670&auto=format&fit=crop',
            priceLevel: 5,
            address: 'Dalat Palace Heritage Hotel',
        },
        {
            name: 'Vườn Thú ZooDoo',
            description: 'Vườn thú thân thiện phong cách Úc giữa rừng thông. Nơi tuyệt vời cho gia đình và trẻ nhỏ.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: '/assets/destinations/zoodoo.png',
            priceLevel: 3,
            address: 'Xã Đạ Nhim, Lạc Dương, Lâm Đồng',
        },
        {
            name: 'Đồi Chè Cầu Đất',
            description: 'Thiên đường săn mây với những đồi chè xanh ngát bạt ngàn. Điểm check-in sáng sớm cực phẩm.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: '/assets/destinations/cau-dat.png',
            priceLevel: 1,
            address: 'Trường Thọ, Cầu Đất, Đà Lạt',
        },
        {
            name: 'Chợ Đêm Đà Lạt',
            description: 'Trái tim của thành phố về đêm. Thiên đường ẩm thực đường phố và mua sắm đồ len.',
            type: 'ATTRACTION',
            rating: 4.5,
            image: '/assets/destinations/cho-dem.png',
            priceLevel: 2,
            address: 'Đường Nguyễn Thị Minh Khai, Phường 1, Đà Lạt',
        },
        {
            name: 'Quảng Trường Lâm Viên',
            description: 'Biểu tượng của Đà Lạt với nụ hoa Atiso và hoa Dã Quỳ khổng lồ. Điểm check-in không thể bỏ qua.',
            type: 'ATTRACTION',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=2000&auto=format&fit=crop', // Generic square/park
            priceLevel: 1,
            address: 'Đường Trần Quốc Toản, Phường 1, Đà Lạt',
        },
        {
            name: 'Tiệm Cà Phê Túi Mơ To',
            description: 'Quán cafe view thung lũng đèn lãng mạn, cúc họa mi nở rộ. Không gian yên bình đậm chất Đà Lạt.',
            type: 'RESTAURANT', // Cafe/Restaurant
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop',
            priceLevel: 2,
            address: 'Hẻm 31 Sào Nam, Phường 11, Đà Lạt',
        },
    ]

    for (const place of places) {
        await prisma.place.create({
            data: place,
        })
    }

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
