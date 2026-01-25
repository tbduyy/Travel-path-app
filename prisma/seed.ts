// @ts-nocheck
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data
    await prisma.tripItem.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.place.deleteMany({})

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

        // --- NHA TRANG: NOTABLE ATTRACTIONS ---
        {
            name: 'VinWonders Nha Trang',
            city: 'Nha Trang',
            description: 'Công viên VinWonders Nha Trang tọa lạc trên đảo Hòn Tre, được xem là thiên đường vui chơi – giải trí hàng đầu với hệ thống cáp treo vượt biển độc đáo và quần thể giải trí đẳng cấp quốc tế.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: 'https://vinwonders.com/wp-content/uploads/2022/03/vinwonders-nha-trang-1.jpg',
            priceLevel: 4,
            price: '880.000 VND/vé',
            duration: '12-13 tiếng',
            address: 'Đảo Hòn Tre, Nha Trang',
        },
        {
            name: 'Tour 3 đảo Nha Trang (Hòn Mun - Làng Chài - Mini Beach)',
            city: 'Nha Trang',
            description: 'Tour 3 đảo Nha Trang đưa du khách khám phá Hòn Mun – làng chài – Mini Beach, mang đến trải nghiệm trọn vẹn giữa thiên nhiên biển xanh trong lành.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: 'https://ik.imagekit.io/tvlk/blog/2022/10/dao-yen-nha-trang-1.jpg',
            priceLevel: 3,
            price: '450.000 VND/người',
            duration: '8-9 tiếng',
            address: 'Cảng Vĩnh Trường, Nha Trang',
        },
        {
            name: 'Quảng trường 2/4',
            city: 'Nha Trang',
            description: 'Quảng trường 2/4 tọa lạc tại trung tâm thành phố Nha Trang, là biểu tượng du lịch sôi động và trái tim văn hóa của thành phố biển.',
            type: 'ATTRACTION',
            rating: 4.7,
            image: 'https://static-images.vnncdn.net/files/publish/2023/1/14/thap-tram-huong-nha-trang-1.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            duration: '15-30 phút',
            address: 'Trần Phú, Lộc Thọ, Nha Trang',
        },
        {
            name: 'Nem Nướng Đặng Văn Quyên',
            city: 'Nha Trang',
            description: 'Địa chỉ ẩm thực quen thuộc tại Nha Trang, nổi tiếng với các món đặc sản mang đậm hương vị địa phương.',
            type: 'RESTAURANT',
            rating: 4.5,
            image: 'https://vcdn1-travel.vnecdn.net/2022/01/18/nem-nuong-8316-1642499119.jpg',
            priceLevel: 2,
            price: '50.000 - 150.000 VND',
            duration: '30-45 phút',
            address: '16A Lãn Ông, Nha Trang',
        },
        {
            name: 'Hải sản Thanh Sương',
            city: 'Nha Trang',
            description: 'Quán hải sản nổi tiếng tại Nha Trang, được nhiều thực khách yêu thích nhờ hải sản tươi ngon, chế biến nhanh.',
            type: 'RESTAURANT',
            rating: 4.6,
            image: 'https://vcdn1-travel.vnecdn.net/2022/06/10/hai-san-6302-1654854345.jpg',
            priceLevel: 3,
            price: '100.000 - 500.000 VND',
            duration: '30-45 phút',
            address: '21 Trần Phú, Nha Trang',
        },

        // --- NHA TRANG: HOTELS (Linked to Attractions) ---
        {
            name: 'Vinpearl Beachfront Nha Trang',
            city: 'Nha Trang',
            description: 'Khách sạn 5 sao tiện nghi hàng đầu. Bao gồm 2 vé vào VinWonders.',
            type: 'HOTEL',
            rating: 4.8,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/164789125.jpg',
            priceLevel: 5,
            price: '3.700.000 VND/phòng/ngày',
            address: '78-80 Trần Phú, Nha Trang',
            metadata: {
                distance: "4.5 km",
                time: "11 phút",
                note: "Giá hơi cao hơn mặt bằng chung nhưng đã bao gồm vé VinWonders 2N1Đ nên vẫn hợp lý, đồng thời thuộc nhóm khách sạn 5 sao tiện nghi hàng đầu tại Nha Trang.",
                relatedTo: ['VinWonders Nha Trang']
            }
        },
        {
            name: 'Dendro beachfront',
            city: 'Nha Trang',
            description: 'Khách sạn đối diện biển, không gian thoáng và giá khá bình dân.',
            type: 'HOTEL',
            rating: 4.1,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/33716611.jpg',
            priceLevel: 2,
            price: '348.000 VND/ngày',
            address: '90-92 Trần Phú, Nha Trang',
            metadata: {
                distance: "3.6 km",
                time: "7 phút",
                note: "Khách sạn nằm giữa trung tâm và VinWonders nên hơi bất tiện đi dạo trong trung tâm, bù lại đối diện biển, không gian thoáng và giá khá bình dân.",
                relatedTo: ['VinWonders Nha Trang']
            }
        },
        {
            name: 'Dubai Nha Trang',
            city: 'Nha Trang',
            description: 'Nằm trong trung tâm thành phố, phù hợp với du khách ưu tiên tiết kiệm chi phí.',
            type: 'HOTEL',
            rating: 3.9,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/178553535.jpg',
            priceLevel: 2,
            price: '280.000 VND/ngày',
            address: '04 Tôn Đản, Lộc Thọ, Nha Trang',
            metadata: {
                distance: "5 km",
                time: "15 phút",
                note: "Vị trí khá xa VinWonders nên việc di chuyển chưa thật sự thuận tiện, bù lại khách sạn có mức giá rẻ và nằm trong trung tâm thành phố, phù hợp với du khách ưu tiên tiết kiệm chi phí.",
                relatedTo: ['VinWonders Nha Trang']
            }
        },
        {
            name: 'Dolphin Bay Hotel',
            city: 'Nha Trang',
            description: 'Gần trung tâm và có mức giá ưu đãi.',
            type: 'HOTEL',
            rating: 4.0,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/414533038.jpg',
            priceLevel: 2,
            price: '257.000 VND/ngày',
            address: 'Trần Quang Khải, Nha Trang',
            metadata: {
                distance: "1.7 km",
                time: "7 phút",
                note: "Khách sạn gần trung tâm và có mức giá ưu đãi nên thường nhanh hết phòng; bên cạnh đó, đánh giá của khách hàng về chất lượng phòng vẫn còn chưa đồng nhất.",
                relatedTo: ['Tour 3 đảo Nha Trang (Hòn Mun - Làng Chài - Mini Beach)']
            }
        },
        {
            name: 'Brilliant Bay Nha Trang',
            city: 'Nha Trang',
            description: 'Sở hữu view biển đối diện thoáng đẹp.',
            type: 'HOTEL',
            rating: 4.2,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/395150893.jpg',
            priceLevel: 2,
            price: '300.000 VND/ngày',
            address: 'Phạm Văn Đồng, Nha Trang',
            metadata: {
                distance: "3 km",
                time: "10 phút",
                note: "Vị trí hơi xa trung tâm, bù lại sở hữu view biển đối diện thoáng đẹp.",
                relatedTo: ['Tour 3 đảo Nha Trang (Hòn Mun - Làng Chài - Mini Beach)']
            }
        },
        {
            name: 'Palm Beach Hotel',
            city: 'Nha Trang',
            description: 'Nằm gần trung tâm và thuận tiện di chuyển.',
            type: 'HOTEL',
            rating: 4.1,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822556.jpg',
            priceLevel: 2,
            price: '347.000 VND/ngày',
            address: '04 Biệt Thự, Nha Trang',
            metadata: {
                distance: "1.8 km",
                time: "6 phút",
                note: "Mức giá không quá nổi bật so với mặt bằng phân khúc, nhưng bù lại nằm gần trung tâm và thuận tiện di chuyển đến các điểm du lịch.",
                relatedTo: ['Tour 3 đảo Nha Trang (Hòn Mun - Làng Chài - Mini Beach)']
            }
        },
        {
            name: 'Sun City Hotel',
            city: 'Nha Trang',
            description: 'Đối diện biển and nằm gần quảng trường.',
            type: 'HOTEL',
            rating: 4.3,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822457.jpg',
            priceLevel: 3,
            price: '338.000 VND/ngày',
            address: '18 Tôn Đản, Nha Trang',
            metadata: {
                distance: "250m",
                time: "1 phút",
                note: "Giá hơi nhỉnh so với mặt bằng chung and cần đặt trước (không hoàn hủy do phòng rất hot, nhanh kín), bù lại khách sạn đối diện biển and nằm gần quảng trường cùng các điểm du lịch.",
                relatedTo: ['Quảng trường 2/4']
            }
        },
        {
            name: 'LE SOLEIL Nha Trang',
            city: 'Nha Trang',
            description: 'Có kèm bữa sáng miễn phí and vị trí gần trung tâm.',
            type: 'HOTEL',
            rating: 4.4,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/228153457.jpg',
            priceLevel: 3,
            price: '360.000 VND/ngày',
            address: 'Phan Bội Châu, Nha Trang',
            metadata: {
                distance: "350m",
                time: "1 phút",
                note: "Mức giá không quá ưu đãi, nhưng có kèm bữa sáng miễn phí and vị trí gần trung tâm, thuận tiện di chuyển.",
                relatedTo: ['Quảng trường 2/4']
            }
        },
        {
            name: 'Nắng Biển - Sunny Sea Hotel',
            city: 'Nha Trang',
            description: 'Vị trí đối diện biển and gần các điểm du lịch.',
            type: 'HOTEL',
            rating: 3.8,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/195150893.jpg',
            priceLevel: 2,
            price: '266.000 VND/ngày',
            address: 'Phạm Văn Đồng, Nha Trang',
            metadata: {
                distance: "950m",
                time: "3 phút",
                note: "Do mức giá rẻ nên chất lượng chỉ ở mức cơ bản so với phân khúc, bù lại khách sạn có vị trí đối diện biển and gần các điểm du lịch.",
                relatedTo: ['Quảng trường 2/4']
            }
        },
        {
            name: 'Mangolia Hotel',
            city: 'Nha Trang',
            description: 'Gần các khu ăn uống and chợ, thuận tiện đi lại.',
            type: 'HOTEL',
            rating: 4.0,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822657.jpg',
            priceLevel: 2,
            price: '245.000 VND/ngày',
            address: 'Ngô Gia Tự, Nha Trang',
            metadata: {
                distance: "210m",
                time: "1 phút",
                note: "Không nằm sát biển and không có view hướng biển, bù lại gần các khu ăn uống and chợ, thuận tiện đi lại.",
                relatedTo: ['Nem Nướng Đặng Văn Quyên']
            }
        },
        {
            name: 'CKD Nha Trang Hotel',
            city: 'Nha Trang',
            description: 'Nằm gần khu ăn uống and có thể dễ dàng đi bộ.',
            type: 'HOTEL',
            rating: 4.1,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822757.jpg',
            priceLevel: 3,
            price: '500.000 VND/ngày',
            address: 'Lê Đại Hành, Nha Trang',
            metadata: {
                distance: "140m",
                time: "1 phút",
                note: "Mức giá ở mức trung bình–cao, bù lại nằm gần khu ăn uống and có thể dễ dàng đi bộ.",
                relatedTo: ['Nem Nướng Đặng Văn Quyên']
            }
        },
        {
            name: 'Maika Hotel',
            city: 'Nha Trang',
            description: 'Gần các địa điểm checkin, ăn uống hot trend.',
            type: 'HOTEL',
            rating: 3.9,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822957.jpg',
            priceLevel: 3,
            price: '344.000 VND/ngày',
            address: 'Hồng Bàng, Nha Trang',
            metadata: {
                distance: "1km",
                time: "3 phút",
                note: "Không nằm sát biển and không có view hướng biển, bù lại gần các địa điểm checkin, ăn uống hot trend.",
                relatedTo: ['Nem Nướng Đặng Văn Quyên']
            }
        },
        {
            name: 'Vạn Kim Hotel',
            city: 'Nha Trang',
            description: 'Mức giá khá ưu đãi so with chất lượng.',
            type: 'HOTEL',
            rating: 3.8,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32823057.jpg',
            priceLevel: 2,
            price: '285.000 VND/ngày',
            address: 'Nguyễn Thị Minh Khai, Nha Trang',
            metadata: {
                distance: "3.2km",
                time: "8 phút",
                note: "Không nằm sát biển and trung tâm thành phố, bù lại mức giá khá ưu đãi so with chất lượng.",
                relatedTo: ['Hải sản Thanh Sương']
            }
        },
        {
            name: 'Ruby Luxury Hotel',
            city: 'Nha Trang',
            description: 'Chất lượng tương đối tốt with mức giá hợp lý.',
            type: 'HOTEL',
            rating: 4.2,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32822857.jpg',
            priceLevel: 3,
            price: '391.000 VND/ngày',
            address: 'Trấn Phú, Nha Trang',
            metadata: {
                distance: "2.1km",
                time: "4 phút",
                note: "Khách sạn có chất lượng tương đối tốt with mức giá hợp lý, tuy nhiên vị trí hơi xa trung tâm and các điểm tham quan nên việc di chuyển chưa thật sự thuận tiện.",
                relatedTo: ['Hải sản Thanh Sương']
            }
        },
        {
            name: 'Pearl City Hotel',
            city: 'Nha Trang',
            description: 'Gần các địa điểm khám phá du lịch.',
            type: 'HOTEL',
            rating: 4.0,
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/32823157.jpg',
            priceLevel: 3,
            price: '334.000 VND/ngày',
            address: 'Lê Thánh Tôn, Nha Trang',
            metadata: {
                distance: "3.6km",
                time: "8 phút",
                note: "Không nằm sát biển and xa trung tâm thành phố, bù lại gần các địa điểm khám phá du lịch.",
                relatedTo: ['Hải sản Thanh Sương']
            }
        },

        // --- NHA TRANG: ADDITIONAL PLACES ---
        {
            name: 'Bảo Tàng Hải Dương Học',
            city: 'Nha Trang',
            description: 'Viện Hải dương học Nha Trang là điểm đến thú vị dành cho du khách yêu thích khám phá thế giới đại dương.',
            type: 'ATTRACTION',
            rating: 4.6,
            image: 'https://vcdn-dulich.vnecdn.net/2022/07/25/vien-hai-duong-hoc-1658714652.jpg',
            priceLevel: 1,
            price: '10.000 VND - 40.000 VND',
            duration: '1-2 tiếng',
            address: '01 Cầu Đá, Nha Trang',
        },
        {
            name: 'Đập Thủy Điện Am Chúa',
            city: 'Nha Trang',
            description: 'Hồ Am Chúa là một điểm đến thiên nhiên yên bình and thơ mộng của Nha Trang.',
            type: 'ATTRACTION',
            rating: 4.4,
            image: 'https://static2.yan.vn/Ads/202104/ee2b1b3b-8c8c-4a1b-9b4c-8c8c4a1b9b4c.jpg',
            priceLevel: 1,
            price: 'Miễn phí',
            duration: '3-4 tiếng',
            address: 'Diên Điền, Diên Khánh, Nha Trang',
        },
        {
            name: 'Nhà Hát Đó',
            city: 'Nha Trang',
            description: 'Lấy cảm hứng from cái đó – nông cụ dân gian Việt Nam, Nhà hát Đó là một kiệt tác kiến trúc hiện đại.',
            type: 'ATTRACTION',
            rating: 4.8,
            image: 'https://vcdn1-dulich.vnecdn.net/2023/04/17/nha-hat-do-1681711714.jpg',
            priceLevel: 4,
            price: '420.000 VND - 630.000 VND',
            duration: '3-4 tiếng',
            address: 'Bãi Tiên, Nha Trang',
        },
        {
            name: 'Cơm gà Núi Một',
            city: 'Nha Trang',
            description: 'Sử dụng nguồn gà sạch, chất lượng cao, mang đến hương vị đậm đà tròn vị.',
            type: 'RESTAURANT',
            rating: 4.4,
            image: 'https://vcdn1-travel.vnecdn.net/2022/01/18/com-ga-8316-1642499119.jpg',
            priceLevel: 2,
            price: '30.000 VND - 450.000 VND',
            duration: '30-45 phút',
            address: '01 Núi Một, Nha Trang',
        },
        {
            name: 'Bánh căn 51',
            city: 'Nha Trang',
            description: 'Địa chỉ nức tiếng dành for tín đồ bánh căn tại Nha Trang.',
            type: 'RESTAURANT',
            rating: 4.7,
            image: 'https://vcdn1-travel.vnecdn.net/2022/01/18/banh-can-8316-1642499119.jpg',
            priceLevel: 2,
            price: '20.000 VND - 150.000 VND',
            duration: '20-30 phút',
            address: '51 Tô Hiến Thành, Nha Trang',
        },
        {
            name: 'Z Beach Nha Trang',
            city: 'Nha Trang',
            description: 'Không gian mở ngay trên bãi biển with quầy bar nhỏ and ghế lười sắc cam.',
            type: 'RESTAURANT',
            rating: 4.5,
            image: 'https://vcdn1-travel.vnecdn.net/2022/06/10/z-beach-6302-1654854345.jpg',
            priceLevel: 3,
            price: '40.000 VND - 2.400.000 VND',
            duration: '1-2 tiếng',
            address: 'Trần Phú, Nha Trang',
        },

        // --- DA NANG ---
        {
            name: 'Sun World Bà Nà Hills',
            city: 'Đà Nẵng',
            description: 'Đường lên tiên cảnh with Làng Pháp, Cầu Vàng.',
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
            image: 'https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/dalat/hotel-colline.jpg',
            priceLevel: 4,
            price: '1.500.000 VND',
            address: '10 Phan Bội Châu, Đà Lạt',
        },
    ]

    console.log('Creating Places...')
    const createdPlaces = []
    for (const place of places) {
        const p = await prisma.place.create({
            data: place,
        })
        createdPlaces.push(p)
    }

    // --- USER ---
    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'user-demo',
            email: 'demo@example.com',
            name: 'Demo User',
        }
    })

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
