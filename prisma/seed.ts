// @ts-nocheck
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data
    await prisma.tripItem.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.place.deleteMany({})
    // We should also ensure we don't duplicate user or if we delete users we might break references if other things existed, but here it's dev.
    // However, I'll just upsert the user later.

    const places = [
        // --- HA NOI ---
        {
            name: 'Hồ Gươm (Hồ Hoàn Kiếm)',
            city: 'Hà Nội',
            description: 'Trái tim của thủ đô, nổi bật với Tháp Rùa cổ kính.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1599839519808-16e53063f739',
            priceLevel: 1,
            price: 'Miễn phí',
            address: 'Hàng Trống, Hoàn Kiếm, Hà Nội',
        },
        {
            name: 'Lăng Chủ tịch Hồ Chí Minh',
            city: 'Hà Nội',
            description: 'Nơi an nghỉ của Chủ tịch Hồ Chí Minh.',
            type: 'ATTRACTION',
            rating: 4.9,
            image: 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/lang-chu-tich-ho-chi-minh-1.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: '2 Hùng Vương, Ba Đình, Hà Nội',
        },
        {
            name: 'Sofitel Legend Metropole Hà Nội',
            city: 'Hà Nội',
            description: 'Khách sạn lâu đời và sang trọng bậc nhất Hà Nội.',
            type: 'HOTEL',
            rating: 4.9,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/49716631.jpg',
            priceLevel: 5,
            price: '5.000.000 VND',
            address: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
        },

        // --- HO CHI MINH ---
        {
            name: 'Chợ Bến Thành',
            city: 'Thành phố Hồ Chí Minh',
            description: 'Biểu tượng giao thương sầm uất của Sài Gòn.',
            type: 'ATTRACTION',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482',
            priceLevel: 2,
            price: 'Miễn phí',
            address: 'Lê Lợi, Q1, TP. HCM',
        },
        {
            name: 'The Reverie Saigon',
            city: 'Thành phố Hồ Chí Minh',
            description: 'Khách sạn xa hoa bậc nhất Sài Gòn.',
            type: 'HOTEL',
            rating: 4.8,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/44122822.jpg',
            priceLevel: 5,
            price: '6.500.000 VND',
            address: '22-36 Nguyễn Huệ, Q1, TP. HCM',
        },

        // --- NHA TRANG (Existing + Needed for Itinerary) ---
        {
            name: 'VinWonders Nha Trang',
            city: 'Nha Trang',
            description: 'Công viên giải trí đẳng cấp quốc tế trên đảo Hòn Tre.',
            type: 'ATTRACTION',
            rating: 4.7,
            image: 'https://vinwonders.com/wp-content/uploads/2022/03/vinwonders-nha-trang-1.jpg',
            priceLevel: 4,
            price: '880.000 VND/vé',
            address: 'Đảo Hòn Tre, Nha Trang',
        },
        {
            name: 'Chùa Long Sơn',
            city: 'Nha Trang',
            description: 'Ngôi chùa nổi tiếng với tượng Kim Thân Phật Tổ.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Long_Son_Pagoda.jpg/1200px-Long_Son_Pagoda.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: '22 Đường 23/10, Nha Trang',
        },
        {
            name: 'Tháp Bà Ponagar',
            city: 'Nha Trang',
            description: 'Quần thể kiến trúc Chăm Pa cổ kính.',
            type: 'ATTRACTION',
            rating: 4.5,
            image: 'https://ik.imagekit.io/tvlk/blog/2022/09/thap-ba-ponagar-1.jpg',
            priceLevel: 1,
            price: '30.000 VND/vé',
            address: '2 Tháng 4, Nha Trang',
        },
        {
            name: 'Bãi biển Nha Trang',
            city: 'Nha Trang',
            description: 'Bãi biển xanh ngắt ngay trung tâm thành phố.',
            type: 'ATTRACTION',
            rating: 4.5,
            image: 'https://media.vneconomy.vn/w800/images/upload/2022/06/03/nha-trang.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: 'Trần Phú, Nha Trang',
        },
        {
            name: 'Golden Hotel Nha Trang',
            city: 'Nha Trang',
            description: 'Khách sạn tiện nghi ngay trung tâm.',
            type: 'HOTEL',
            rating: 4.2,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/56281699.jpg',
            priceLevel: 3,
            price: '800.000 VND/đêm',
            address: 'Hùng Vương, Nha Trang',
        },
        {
            name: 'Chợ đêm Nha Trang',
            city: 'Nha Trang',
            description: 'Khu chợ sầm uất về đêm.',
            type: 'ATTRACTION',
            rating: 4.3,
            image: 'https://vcdn1-dulich.vnecdn.net/2022/06/03/cho-dem-nha-trang-1654246949.jpg',
            priceLevel: 2,
            price: 'Tùy món',
            address: 'Đường Trần Phú, Nha Trang',
        },
        {
            name: 'Tháp Trầm Hương',
            city: 'Nha Trang',
            description: 'Biểu tượng của thành phố biển Nha Trang.',
            type: 'ATTRACTION',
            rating: 4.4,
            image: 'https://khanhhoatrip.net/wp-content/uploads/2020/09/thap-tram-huong-nha-trang.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: 'Trần Phú, Nha Trang',
        },
        {
            name: 'Tour 4 đảo (Hòn Mun, Hòn Một, Bãi Tranh)',
            city: 'Nha Trang',
            description: 'Tour tham quan các đảo đẹp nhất vịnh Nha Trang.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: 'https://cdn.nttravel.vn/upload/tour-dao-nha-trang/tour-3-dao-vip/hon-mun.jpg',
            priceLevel: 3,
            price: '450.000 VND/người',
            address: 'Cảng Cầu Đá, Nha Trang',
        },
        {
            name: 'InterContinental Nha Trang',
            city: 'Nha Trang',
            description: 'Khách sạn 5 sao mặt biển.',
            type: 'HOTEL',
            rating: 4.7,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/29283921.jpg',
            priceLevel: 5,
            price: '3.800.000 VND',
            address: '32-34 Trần Phú, Nha Trang',
        },

        // --- DA NANG ---
        {
            name: 'Sun World Bà Nà Hills',
            city: 'Đà Nẵng',
            description: 'Đường lên tiên cảnh với Làng Pháp, Cầu Vàng.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: 'https://sunworld.vn/uploads/2022/05/26/cau-vang.jpg',
            priceLevel: 4,
            price: '900.000 VND',
            address: 'Hòa Vang, Đà Nẵng',
        },

        // --- DA LAT ---
        {
            name: 'Hotel Colline',
            city: 'Đà Lạt',
            description: 'Khách sạn 4 sao nổi bật ngay trung tâm.',
            type: 'HOTEL',
            rating: 4.5,
            image: '/assets/dalat/hotel-colline.jpg',
            priceLevel: 4,
            price: '1.500.000 VND',
            address: '10 Phan Bội Châu, Đà Lạt',
        },
        {
            name: 'Quảng Trường Lâm Viên',
            city: 'Đà Lạt',
            description: 'Biểu tượng của Đà Lạt với nụ hoa Atiso.',
            type: 'ATTRACTION',
            rating: 4.7,
            image: '/assets/dalat/quang-truong-lam-vien.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: 'Trần Quốc Toản, Đà Lạt',
        },
        {
            name: 'Chợ Đêm Đà Lạt',
            city: 'Đà Lạt',
            description: 'Điểm đến sầm uất về đêm với ẩm thực và mua sắm.',
            type: 'ATTRACTION',
            rating: 4.4,
            image: '/assets/dalat/cho-dem.jpg',
            priceLevel: 2,
            price: 'Miễn phí',
            address: 'Nguyễn Thị Minh Khai, Đà Lạt',
        },
        {
            name: 'Ga Đà Lạt',
            city: 'Đà Lạt',
            description: 'Nhà ga cổ kính và đẹp nhất Đông Dương.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: '/assets/dalat/ga-da-lat.jpg',
            priceLevel: 1,
            price: '10.000 VND/vé',
            address: 'Quang Trung, Đà Lạt',
        },
        {
            name: 'Đồi Chè Cầu Đất',
            city: 'Đà Lạt',
            description: 'Thiên đường săn mây và đồi chè xanh ngát.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: '/assets/dalat/doi-che-cau-dat.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            address: 'Cầu Đất, Đà Lạt',
        },
        {
            name: 'Tiệm Cà Phê Túi Mơ To',
            city: 'Đà Lạt',
            description: 'Quán cafe view thung lũng đèn lãng mạn.',
            type: 'RESTAURANT', // Classified as Restaurant/Cafe
            rating: 4.6,
            image: '/assets/dalat/tiem-ca-phe-tui-mo-to.jpg',
            priceLevel: 2,
            price: '40.000 - 80.000 VND',
            address: 'Hẻm 31 Sào Nam, Đà Lạt',
        },
        {
            name: 'Thác Datanla',
            city: 'Đà Lạt',
            description: 'Khu du lịch thác nước nổi tiếng với máng trượt.',
            type: 'ATTRACTION',
            rating: 4.5,
            image: '/assets/dalat/thac-datanla.jpg',
            priceLevel: 2,
            price: '50.000 VND/vé',
            address: 'Đèo Prenn, Đà Lạt',
        },
        {
            name: 'Vườn thú ZooDoo',
            city: 'Đà Lạt',
            description: 'Vườn thú thân thiện phong cách Úc giữa rừng thông.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: '/assets/dalat/zoodoo.jpg',
            priceLevel: 3,
            price: '100.000 VND/vé',
            address: 'Tiểu khu 94A, Xã Đa Nhim, Lạc Dương, Lâm Đồng',
        },

        // --- TRANSIT HUBS ---
        {
            name: 'Sân bay Tân Sơn Nhất',
            city: 'Thành phố Hồ Chí Minh',
            description: 'Sân bay quốc tế lớn nhất miền Nam.',
            type: 'TRANSIT',
            rating: 4.0,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tan_Son_Nhat_International_Airport_Terminal_2_Check-in_Counters.jpg/1200px-Tan_Son_Nhat_International_Airport_Terminal_2_Check-in_Counters.jpg',
            priceLevel: 1,
            address: 'Tân Bình, TP. HCM',
        },
        {
            name: 'Sân bay Cam Ranh',
            city: 'Nha Trang',
            description: 'Sân bay quốc tế phục vụ Nha Trang.',
            type: 'TRANSIT',
            rating: 4.5,
            image: 'https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yugn/2018_06_30/zing_san_bay_cam_ranh_1.jpg',
            priceLevel: 1,
            address: 'Cam Ranh, Khánh Hòa',
        }
    ]

    console.log('Creating Places...')
    const createdPlaces = []
    for (const place of places) {
        const p = await prisma.place.create({
            data: place,
        })
        createdPlaces.push(p)
    }

    const findPlace = (name: string) => {
        const p = createdPlaces.find(p => p.name === name)
        if (!p) throw new Error(`Place not found: ${name}`)
        return p
    }

    // --- USER ---
    console.log('Creating User...')
    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'user-demo',
            email: 'demo@example.com',
            name: 'Demo User',
        }
    })

    // --- TRIP ---
    console.log('Creating Trip...')
    const trip = await prisma.trip.create({
        data: {
            userId: user.id,
            destination: 'Nha Trang',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            budget: '5.000.000 VND',
            pax: 2,
            style: 'Khám phá',
        }
    })

    const items = [
        // DAY 1
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '06:00',
            endTime: '08:30',
            title: 'Bay HCM → Cam Ranh -> Di chuyển về trung tâm',
            description: 'Sân bay Tân Sơn Nhất → Cam Ranh -> Nha Trang.',
            transitDuration: '1h10p',
            placeId: findPlace('Sân bay Cam Ranh').id,
            order: 1,
            cost: "Vé máy bay ~ 1.200.000 VND"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '09:00',
            endTime: '10:00',
            title: 'Tham quan Chùa Long Sơn',
            description: 'Viếng chùa, ngắm tượng Phật trắng.',
            placeId: findPlace('Chùa Long Sơn').id,
            order: 2,
            cost: "Miễn phí",
            transitDuration: "10p"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '10:15',
            endTime: '11:15',
            title: 'Tham quan Tháp Bà Ponagar',
            description: 'Tham quan di tích Chăm.',
            placeId: findPlace('Tháp Bà Ponagar').id,
            order: 3,
            cost: "30.000 VND/vé",
            transitDuration: "15p"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '11:30',
            endTime: '13:00',
            title: 'Ăn trưa & Nghỉ ngơi',
            description: 'Ăn trưa tại bãi biển Nha Trang.',
            placeId: findPlace('Bãi biển Nha Trang').id,
            order: 4,
            cost: "Tự túc",
            transitDuration: "10p"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '14:00',
            endTime: '15:00',
            title: 'Check-in khách sạn',
            description: 'Nhận phòng tại Golden Hotel Nha Trang.',
            placeId: findPlace('Golden Hotel Nha Trang').id,
            order: 5,
            cost: "",
            transitDuration: "1h"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '15:00',
            endTime: '18:00',
            title: 'Vui chơi VinWonders',
            description: 'Trải nghiệm cáp treo và các trò chơi.',
            placeId: findPlace('VinWonders Nha Trang').id,
            order: 6,
            cost: "880.000 VND/vé",
            transitDuration: "25p"
        },
        {
            tripId: trip.id,
            dayIndex: 1,
            startTime: '19:00',
            endTime: '21:00',
            title: 'Ăn tối, dạo chợ đêm',
            description: 'Thưởng thức ẩm thực Phố Biển.',
            placeId: findPlace('Chợ đêm Nha Trang').id,
            order: 7,
            cost: "Tự túc",
            transitDuration: "10p"
        },

        // DAY 2
        {
            tripId: trip.id,
            dayIndex: 2,
            startTime: '07:30',
            endTime: '09:00',
            title: 'Ăn sáng, trả phòng',
            description: 'Ăn sáng tại khách sạn.',
            placeId: findPlace('Golden Hotel Nha Trang').id,
            order: 1,
            transitDuration: "1h30p"
        },
        {
            tripId: trip.id,
            dayIndex: 2,
            startTime: '09:00',
            endTime: '12:00',
            title: 'Tour 4 đảo',
            description: 'Hòn Mun, Hòn Một, Bãi Tranh.',
            placeId: findPlace('Tour 4 đảo (Hòn Mun, Hòn Một, Bãi Tranh)').id,
            order: 2,
            transitDuration: "15p ra bến"
        },
        {
            tripId: trip.id,
            dayIndex: 2,
            startTime: '15:00',
            endTime: '16:00',
            title: 'Ra sân bay',
            description: 'Nha Trang → Cam Ranh.',
            placeId: findPlace('Sân bay Cam Ranh').id,
            order: 3,
            transitDuration: "45–60p"
        },
        {
            tripId: trip.id,
            dayIndex: 2,
            startTime: '19:00',
            endTime: '20:10',
            title: 'Bay về HCM',
            description: 'Cam Ranh → Tân Sơn Nhất.',
            placeId: findPlace('Sân bay Tân Sơn Nhất').id,
            order: 4,
            transitDuration: "1h10p"
        },
    ]

    for (const item of items) {
        await prisma.tripItem.create({
            data: item
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
