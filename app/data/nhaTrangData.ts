
export interface PlaceData {
    id: string;
    name: string;
    description: string;
    rating: number;
    priceLevel: string;
    images: string[];
    address: string;
    price?: string;
    duration?: string;
    type: "ATTRACTION" | "HOTEL" | "RESTAURANT";
    lat: number;
    lng: number;
    metadata?: any;
    relatedPlaceId?: string; // For hotels, which place they belong to
    image?: any;
    city?: string | null;
}

// 1. VinWonders
export const vinWonders: PlaceData = {
    id: "nt-vinwonders",
    name: "VinWonders Nha Trang",
    type: "ATTRACTION",
    rating: 4.8,
    priceLevel: "$$$",
    price: "920.000 VND/người",
    duration: "12-13 tiếng",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-vinwonders/nt-vinwonders-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-vinwonders/nt-vinwonders-2.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-vinwonders/nt-vinwonders-3.jpg"
    ],
    address: "Đảo Hòn Tre, Nha Trang",
    description: "Công viên VinWonders Nha Trang tọa lạc trên đảo Hòn Tre, được xem là thiên đường vui chơi – giải trí hàng đầu với hệ thống cáp treo vượt biển độc đáo.",
    lat: 12.2146,
    lng: 109.2458,
    metadata: { tags: ["#NgoàiTrời", "#KhámPhá", "#VuiChơi"] }
};

export const vinWondersHotels: PlaceData[] = [
    {
        id: "nt-hotel-vinpearl",
        name: "Vinpearl Beachfront Nha Trang",
        type: "HOTEL",
        rating: 5.0,
        priceLevel: "$$$$",
        price: "3.700.000 VND/đêm",
        address: "Trần Phú, Nha Trang",
        description: "Khách sạn 5 sao tiện nghi hàng đầu. Bao gồm 2 vé VinWonders 2 ngày.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-vinpearl/nt-hotel-vinpearl-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-vinpearl/nt-hotel-vinpearl-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-vinpearl/nt-hotel-vinpearl-3.jpg"
        ],
        lat: 12.235,
        lng: 109.196,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "4.5 km", time: "11 phút", note: "Giá cao nhưng bao gồm vé VinWonders" }
    },
    {
        id: "nt-hotel-dendro",
        name: "Khách sạn Dendro Beachfront",
        type: "HOTEL",
        rating: 4.2,
        priceLevel: "$$",
        price: "348.000 VND/đêm",
        address: "Trần Phú, Nha Trang",
        description: "Đối diện biển, không gian thoáng và giá khá bình dân.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dendro/nt-hotel-dendro-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dendro/nt-hotel-dendro-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dendro/nt-hotel-dendro-3.jpg"
        ],
        lat: 12.231,
        lng: 109.197,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "3.6 km", time: "7 phút", note: "Đối diện biển, giá bình dân" }
    },
    {
        id: "nt-hotel-dubai",
        name: "Khách sạn Dubai Nha Trang",
        type: "HOTEL",
        rating: 4.0,
        priceLevel: "$",
        price: "280.000 VND/đêm",
        address: "Trung tâm Nha Trang",
        description: "Khách sạn có mức giá rẻ và nằm trong trung tâm thành phố.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dubai/nt-hotel-dubai-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dubai/nt-hotel-dubai-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dubai/nt-hotel-dubai-3.jpg"
        ],
        lat: 12.240,
        lng: 109.195,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "5 km", time: "15 phút", note: "Giá rẻ, trung tâm phố" }
    },
    {
        id: "nt-cliff-house",
        name: "Khách sạn CLIFFHOUSE",
        type: "HOTEL",
        rating: 4.2,
        priceLevel: "$$",
        price: "400.000 VND",
        address: "12c Đường Trần Phú, Phường Vĩnh Nguyên",
        description: "Gần VinWonders giúp việc di chuyển thuận tiện; tuy nhiên cách xa trung tâm.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-cliff-house/nt-cliff-house-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-cliff-house/nt-cliff-house-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-cliff-house/nt-cliff-house-3.jpeg"
        ],
        lat: 12.210,
        lng: 109.208,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "500m", time: "1 phút", note: "Gần VinWonders, xa trung tâm" }
    },
    {
        id: "nt-ba-sao",
        name: "Khách sạn Ba Sao",
        type: "HOTEL",
        rating: 3.8,
        priceLevel: "$",
        price: "220.000 VND",
        address: "37 Đường Thích Quảng Đức, Phước Trung",
        description: "Giá phòng rẻ, phù hợp lưu trú ngắn ngày; nhưng không nằm gần VinWonders.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-ba-sao/nt-ba-sao-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-ba-sao/nt-ba-sao-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-ba-sao/nt-ba-sao-3.jpg"
        ],
        lat: 12.235,
        lng: 109.185,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "4.3km", time: "9 phút", note: "Giá rẻ, cân nhắc chi phí di chuyển" }
    },
    {
        id: "nt-aqua-seaview",
        name: "Khách sạn AQUA Seaview",
        type: "HOTEL",
        rating: 4.5,
        priceLevel: "$$",
        price: "405.000 VND",
        address: "Hẻm 9C, Số 11D, Đường Trần Phú, Vĩnh Nguyên",
        description: "Gần biển, phù hợp nghỉ dưỡng; cách VinWonders không xa.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-aqua-seaview/nt-aqua-seaview-1.webp",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-aqua-seaview/nt-aqua-seaview-2.webp",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-aqua-seaview/nt-aqua-seaview-3.webp"
        ],
        lat: 12.215,
        lng: 109.205,
        relatedPlaceId: "nt-vinwonders",
        metadata: { distance: "3.5km", time: "7 phút", note: "Gần biển, giá cao hơn bình dân" }
    }
];

// 2. Tour 3 đảo
export const tour3Dao: PlaceData = {
    id: "nt-tour3dao",
    name: "Tour 3 đảo Nha Trang",
    type: "ATTRACTION",
    rating: 4.7,
    priceLevel: "$$",
    price: "700.000 VND/người",
    duration: "8-9 tiếng",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-tour3dao/nt-tour3dao-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-tour3dao/nt-tour3dao-2.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-tour3dao/nt-tour3dao-3.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-tour3dao/nt-tour3dao-4.jpg"
    ],
    address: "Cảng Nha Trang",
    description: "Khám phá Hòn Mun – làng chài – Mini Beach, lặn ngắm san hô và thưởng thức hải sản.",
    lat: 12.2023,
    lng: 109.214,
    metadata: { tags: ["#BiểnĐảo", "#LặnNgắm", "#HảiSản"] }
};

export const tour3DaoHotels: PlaceData[] = [
    {
        id: "nt-hotel-dolphin",
        name: "Khách sạn Dolphin Bay",
        type: "HOTEL",
        rating: 3.8,
        priceLevel: "$",
        price: "257.000 VND/đêm",
        address: "Gần trung tâm",
        description: "Khách sạn gần trung tâm và có mức giá ưu đãi.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dolphin/nt-hotel-dolphin-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dolphin/nt-hotel-dolphin-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-dolphin/nt-hotel-dolphin-3.jpg"
        ],
        lat: 12.230,
        lng: 109.194,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "1.7 km (từ TT)", time: "7 phút", note: "Giá ưu đãi, nhanh hết phòng" }
    },
    {
        id: "nt-hotel-brilliant",
        name: "Khách sạn Brilliant Bay",
        type: "HOTEL",
        rating: 4.0,
        priceLevel: "$",
        price: "300.000 VND/đêm",
        address: "Phía Bắc Nha Trang",
        description: "Sở hữu view biển đối diện thoáng đẹp.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-brilliant/nt-hotel-brilliant-1.jpg"
        ],
        lat: 12.250,
        lng: 109.198,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "3 km (từ TT)", time: "10 phút", note: "View biển đẹp, hơi xa trung tâm" }
    },
    {
        id: "nt-hotel-palm",
        name: "Khách sạn Palm Beach",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$$",
        price: "347.000 VND/đêm",
        address: "Khu phố Tây",
        description: "Nằm gần trung tâm và thuận tiện di chuyển đến các điểm du lịch.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-palm/nt-hotel-palm-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-palm/nt-hotel-palm-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-palm/nt-hotel-palm-3.jpg"
        ],
        lat: 12.23439,
        lng: 109.1966,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "1.8 km (từ TT)", time: "6 phút", note: "Thuận tiện di chuyển" }
    },
    {
        id: "nt-vitamin-sea-homestay",
        name: "Vitamin Sea Homestay",
        type: "HOTEL",
        rating: 4.3,
        priceLevel: "$$",
        price: "320.000 VND",
        address: "Số 35/4D Tô Hiến Thành, Phường Tân Lập",
        description: "Vị trí gần trung tâm thành phố, thuận tiện di chuyển; tuy nhiên không đối diện biển.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-vitamin-sea-homestay/nt-vitamin-sea-homestay-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-vitamin-sea-homestay/nt-vitamin-sea-homestay-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-vitamin-sea-homestay/nt-vitamin-sea-homestay-3.jpg"
        ],
        lat: 12.240,
        lng: 109.192,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "1km", time: "4 phút", note: "Gần trung tâm, không đối diện biển" }
    },
    {
        id: "nt-sen-vang-luxury",
        name: "Khách sạn Sen Vàng Luxury",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$",
        price: "265.000 VND",
        address: "Số 12 Biệt Thự, Phường Lộc Thọ",
        description: "Giá rẻ, gần trung tâm thành phố; tuy nhiên không đối diện biển.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-sen-vang-luxury/nt-sen-vang-luxury-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-sen-vang-luxury/nt-sen-vang-luxury-2.webp",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-sen-vang-luxury/nt-sen-vang-luxury-3.jpg"
        ],
        lat: 12.238,
        lng: 109.195,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "1.3km", time: "4 phút", note: "Giá rẻ, gần trung tâm" }
    },
    {
        id: "nt-nha-trang-prince",
        name: "Khách sạn Nha Trang Prince",
        type: "HOTEL",
        rating: 5.0,
        priceLevel: "$$$",
        price: "540.000 VND",
        address: "Số 02-04 Phan Bội Châu, Phường Xương Huân",
        description: "Gần trung tâm thành phố, tiêu chuẩn 5 sao; mức giá cao hơn bình dân.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-prince/nt-nha-trang-prince-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-prince/nt-nha-trang-prince-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-prince/nt-nha-trang-prince-3.jpg"
        ],
        lat: 12.250,
        lng: 109.195,
        relatedPlaceId: "nt-tour3dao",
        metadata: { distance: "2km", time: "6 phút", note: "Khách sạn sao, giá cao" }
    }
];

// 3. Quảng trường 2/4
export const quangTruong: PlaceData = {
    id: "nt-quangtruong",
    name: "Quảng trường 2/4",
    type: "ATTRACTION",
    rating: 4.6,
    priceLevel: "Free",
    price: "Miễn phí",
    duration: "15-30 phút",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-quangtruong/nt-quangtruong-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-quangtruong/nt-quangtruong-2.jpg"
    ],
    address: "Trung tâm Nha Trang",
    description: "Biểu tượng du lịch sôi động và trái tim văn hóa của thành phố biển với tháp Trầm Hương.",
    lat: 12.2388,
    lng: 109.1967,
    metadata: { tags: ["#VănHóa", "#CheckIn", "#ThànhPhố"] }
};

export const quangTruongHotels: PlaceData[] = [
    {
        id: "nt-hotel-suncity",
        name: "Khách sạn Sun City",
        type: "HOTEL",
        rating: 4.3,
        priceLevel: "$$",
        price: "338.000 VND/đêm",
        address: "Gần Quảng trường",
        description: "Khách sạn đối diện biển và nằm gần quảng trường cùng các điểm du lịch.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-suncity/nt-hotel-suncity-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-suncity/nt-hotel-suncity-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-suncity/nt-hotel-suncity-3.jpg"
        ],
        lat: 12.239,
        lng: 109.196,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "250m", time: "1 phút", note: "Gần sát quảng trường, cần đặt trước" }
    },
    {
        id: "nt-hotel-lesoleil",
        name: "Khách sạn LE SOLEIL",
        type: "HOTEL",
        rating: 4.4,
        priceLevel: "$$",
        price: "360.000 VND/đêm",
        address: "Gần Quảng trường",
        description: "Có kèm bữa sáng miễn phí và vị trí gần trung tâm.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-lesoleil/nt-hotel-lesoleil-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-lesoleil/nt-hotel-lesoleil-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-lesoleil/nt-hotel-lesoleil-3.jpg"
        ],
        lat: 12.240,
        lng: 109.196,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "350m", time: "1 phút", note: "Kèm bữa sáng, tiện di chuyển" }
    },
    {
        id: "nt-hotel-nangbien",
        name: "Khách sạn Nắng Biển - Sunny Sea",
        type: "HOTEL",
        rating: 3.5,
        priceLevel: "$",
        price: "266.000 VND/đêm",
        address: "Đường Trần Phú",
        description: "Khách sạn có vị trí đối diện biển và gần các điểm du lịch.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-nangbien/nt-hotel-nangbien-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-nangbien/nt-hotel-nangbien-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-nangbien/nt-hotel-nangbien-3.jpg"
        ],
        lat: 12.235,
        lng: 109.197,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "950m", time: "3 phút", note: "Giá rẻ, đối diện biển" }
    },
    {
        id: "nt-corgi-house-central",
        name: "Homestay Corgi House Central",
        type: "HOTEL",
        rating: 4.6,
        priceLevel: "$$$",
        price: "630.000 VND",
        address: "Số 105/9A Hoàng Hoa Thám, Phường Lộc Thọ",
        description: "Phòng rộng, đầy đủ tiện nghi; vị trí trung tâm thuận tiện di chuyển.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-corgi-house-central/nt-corgi-house-central-1.avif",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-corgi-house-central/nt-corgi-house-central-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-corgi-house-central/nt-corgi-house-central-3.avif"
        ],
        lat: 12.245,
        lng: 109.195,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "850m", time: "4 phút", note: "Giá tương đối cao, tiện nghi" }
    },
    {
        id: "nt-anna-beach",
        name: "Khách sạn ANNA Beach",
        type: "HOTEL",
        rating: 4.4,
        priceLevel: "$$$",
        price: "490.000 VND",
        address: "Số 37/10 Hoàng Diệu, Phường Vĩnh Nguyên",
        description: "Phòng đẹp, rộng và thiết kế sang trọng; tuy nhiên không có view biển và mức giá khá cao.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-anna-beach/nt-anna-beach-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-anna-beach/nt-anna-beach-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-anna-beach/nt-anna-beach-3.jpg"
        ],
        lat: 12.220,
        lng: 109.198,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "600m", time: "4 phút", note: "Không view biển, giá cao" }
    },
    {
        id: "nt-golden",
        name: "Khách sạn Golden",
        type: "HOTEL",
        rating: 4.2,
        priceLevel: "$$",
        price: "320.000 VND",
        address: "Số 82 Hùng Vương, Phường Lộc Thọ",
        description: "Có view biển, phòng rộng và thiết kế sang trọng trong khi mức giá khá cạnh tranh.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-golden/nt-golden-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-golden/nt-golden-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-golden/nt-golden-3.jpeg"
        ],
        lat: 12.240,
        lng: 109.196,
        relatedPlaceId: "nt-quangtruong",
        metadata: { distance: "700m", time: "3 phút", note: "View biển đẹp, giá cạnh tranh" }
    }
];

// 4. Nem nướng
export const nemNuong: PlaceData = {
    id: "nt-nemnuong",
    name: "Nem Nướng Đặng Văn Quyên",
    type: "RESTAURANT",
    rating: 4.5,
    priceLevel: "$",
    price: "50-70k/người",
    duration: "30-45 phút",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nemnuong/nt-nemnuong-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nemnuong/nt-nemnuong-2.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nemnuong/nt-nemnuong-3.jpg"
    ],
    address: "Lê Lợi / Phan Bội Châu",
    description: "Địa chỉ ẩm thực quen thuộc tại Nha Trang, nổi tiếng với các món đặc sản mang đậm hương vị địa phương.",
    lat: 12.2475,
    lng: 109.192,
    metadata: { tags: ["#ẨmThực", "#ĐặcSản"] }
};

export const nemNuongHotels: PlaceData[] = [
    {
        id: "nt-hotel-mangolia",
        name: "Khách sạn Mangolia",
        type: "HOTEL",
        rating: 3.9,
        priceLevel: "$",
        price: "245.000 VND/đêm",
        address: "Trung tâm",
        description: "Gần các khu ăn uống và chợ, thuận tiện đi lại.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-mangolia/nt-hotel-mangolia-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-mangolia/nt-hotel-mangolia-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-mangolia/nt-hotel-mangolia-3.jpg"
        ],
        lat: 12.247,
        lng: 109.192,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "210m", time: "1 phút", note: "Gần khu ăn uống, không sát biển" }
    },
    {
        id: "nt-hotel-ckd",
        name: "Khách sạn CKD Nha Trang",
        type: "HOTEL",
        rating: 4.5,
        priceLevel: "$$$",
        price: "500.000 VND/đêm",
        address: "Trung tâm",
        description: "Nằm gần khu ăn uống và có thể dễ dàng đi bộ.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-ckd/nt-hotel-ckd-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-ckd/nt-hotel-ckd-2.jpg"
        ],
        lat: 12.248,
        lng: 109.1925,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "140m", time: "1 phút", note: "Tiện nghi tốt, ngay trung tâm" }
    },
    {
        id: "nt-hotel-maika",
        name: "Khách sạn Maika",
        type: "HOTEL",
        rating: 4.0,
        priceLevel: "$$",
        price: "344.000 VND/đêm",
        address: "Nguyễn Thiện Thuật",
        description: "Gần các địa điểm checkin, ăn uống hot trend.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-maika/nt-hotel-maika-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-maika/nt-hotel-maika-2.jpg"
        ],
        lat: 12.240,
        lng: 109.194,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "1km", time: "3 phút", note: "Gần phố Tây, ăn uống" }
    },
    {
        id: "nt-yen-vang",
        name: "Khách sạn Yến Vàng",
        type: "HOTEL",
        rating: 3.9,
        priceLevel: "$$",
        price: "320.000 VND",
        address: "Số 01 Nguyễn Chính, Phường Xương Huân",
        description: "Không gần biển, không có view biển; sát phố ẩm thực nổi tiếng.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-yen-vang/nt-yen-vang-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-yen-vang/nt-yen-vang-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-yen-vang/nt-yen-vang-3.jpg"
        ],
        lat: 12.248,
        lng: 109.192,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "120m", time: "1 phút", note: "Gần phố đi bộ, không view biển" }
    },
    {
        id: "nt-nha-trang-pearl",
        name: "Khách sạn Nha Trang Pearl",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$",
        price: "295.000 VND",
        address: "Số 22 Phan Bội Châu, Phường Xương Huân",
        description: "Vị trí rất gần khu ăn uống nổi tiếng, thuận tiện di chuyển; tuy nhiên không nằm sát biển.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-pearl/nt-nha-trang-pearl-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-pearl/nt-nha-trang-pearl-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-trang-pearl/nt-nha-trang-pearl-3.jpg"
        ],
        lat: 12.249,
        lng: 109.192,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "26m", time: "1 phút", note: "Rất sát khu ăn uống" }
    },
    {
        id: "nt-doimoi-family",
        name: "Khách sạn Domoi Family",
        type: "HOTEL",
        rating: 4.3,
        priceLevel: "$$$",
        price: "500.000 VND",
        address: "Số 55 Hai Bà Trưng, Phường Xương Huân",
        description: "Vị trí gần ăn uống, phù hợp đi theo nhóm hoặc gia đình. Mức giá khá cao.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-doimoi-family/nt-doimoi-family-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-doimoi-family/nt-doimoi-family-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-doimoi-family/nt-doimoi-family-3.jpg"
        ],
        lat: 12.247,
        lng: 109.191,
        relatedPlaceId: "nt-nemnuong",
        metadata: { distance: "130m", time: "1 phút", note: "Phù hợp nhóm, gia đình" }
    }
];

// 5. Hải sản Thanh Sương
export const haiSan: PlaceData = {
    id: "nt-haisan",
    name: "Hải sản Thanh Sương",
    type: "RESTAURANT",
    rating: 4.4,
    priceLevel: "$$",
    price: "300-400k/người",
    duration: "45-60 phút",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-haisan/nt-haisan-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-haisan/nt-haisan-2.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-haisan/nt-haisan-3.jpg"
    ],
    address: "Vĩnh Nguyên",
    description: "Hải sản tươi ngon, chế biến nhanh và chỉ sử dụng nguyên liệu trong ngày.",
    lat: 12.2081,
    lng: 109.215,
    metadata: { tags: ["#HảiSản", "#Nhậu", "#TươiSống"] }
};

export const haiSanHotels: PlaceData[] = [
    {
        id: "nt-hotel-vankim",
        name: "Khách sạn Vạn Kim",
        type: "HOTEL",
        rating: 3.5,
        priceLevel: "$",
        price: "285.000 VND/đêm",
        address: "Bình Tân",
        description: "Mức giá khá ưu đãi so với chất lượng.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-vankim/nt-hotel-vankim-1.jpg"
        ],
        lat: 12.215,
        lng: 109.200,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "3.2km", time: "8 phút", note: "Giá rẻ" }
    },
    {
        id: "nt-hotel-ruby",
        name: "Khách sạn Ruby Luxury",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$$",
        price: "391.000 VND/đêm",
        address: "Khu vực cảng",
        description: "Chất lượng tương đối tốt với mức giá hợp lý.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-ruby/nt-hotel-ruby-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-ruby/nt-hotel-ruby-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-ruby/nt-hotel-ruby-3.jpg"
        ],
        lat: 12.210,
        lng: 109.205,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "2.1km", time: "4 phút", note: "Gần cảng và hải sản" }
    },
    {
        id: "nt-hotel-pearl",
        name: "Khách sạn Pearl City",
        type: "HOTEL",
        rating: 3.8,
        priceLevel: "$$",
        price: "334.000 VND/đêm",
        address: "Phước Long",
        description: "Gần các địa điểm khám phá du lịch.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-pearl/nt-hotel-pearl-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-hotel-pearl/nt-hotel-pearl-2.jpg"
        ],
        lat: 12.218,
        lng: 109.198,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "3.6km", time: "8 phút", note: "Yên tĩnh" }
    },
    {
        id: "nt-coral-boutique-2",
        name: "Homestay Coral Boutique 2",
        type: "HOTEL",
        rating: 4.4,
        priceLevel: "$$$",
        price: "450.000 VND",
        address: "Số 28 Võ Thị Sáu, Phường Vĩnh Trường",
        description: "Phòng rộng, thiết kế đẹp; tuy nhiên vị trí xa trung tâm thành phố.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-coral-boutique-2/nt-coral-boutique-2-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-coral-boutique-2/nt-coral-boutique-2-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-coral-boutique-2/nt-coral-boutique-2-3.jpg"
        ],
        lat: 12.205,
        lng: 109.205,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "2.7km", time: "5 phút", note: "Thiết kế đẹp, xa trung tâm" }
    },
    {
        id: "nt-an-binh-tan",
        name: "Khách sạn An Bình Tân",
        type: "HOTEL",
        rating: 4.2,
        priceLevel: "$$$",
        price: "560.000 VND",
        address: "Lô L31-01 Đường số 1, Khu đô thị An Bình Tân",
        description: "Phòng đẹp, sạch sẽ; nhưng khoảng cách đến điểm ăn hải sản khá xa.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-an-binh-tan/nt-an-binh-tan-1.avif",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-an-binh-tan/nt-an-binh-tan-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-an-binh-tan/nt-an-binh-tan-3.jpg"
        ],
        lat: 12.225,
        lng: 109.180,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "4.8km", time: "10 phút", note: "Sạch sẽ, xa khu ăn" }
    },
    {
        id: "nt-hao-phat",
        name: "Khách sạn Hào Phát",
        type: "HOTEL",
        rating: 3.8,
        priceLevel: "$$",
        price: "340.000 VND",
        address: "Số 11 Phạm Văn Đồng, Phường Vĩnh Hải",
        description: "Mức giá hợp lý, phù hợp ngân sách; nhưng khoảng cách xa Thanh Sương.",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-hao-phat/nt-hao-phat-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-hao-phat/nt-hao-phat-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-hao-phat/nt-hao-phat-3.webp"
        ],
        lat: 12.260,
        lng: 109.198,
        relatedPlaceId: "nt-haisan",
        metadata: { distance: "3.1km", time: "6 phút", note: "Giá hợp lý, vị trí hơi xa" }
    }
];

// Additional Places
export const extraPlaces: PlaceData[] = [
    {
        id: "nt-baotang",
        name: "Bảo Tàng Hải Dương Học",
        type: "ATTRACTION",
        rating: 4.5,
        priceLevel: "$",
        price: "40.000 VND",
        duration: "1-2 tiếng",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-baotang/nt-baotang-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-baotang/nt-baotang-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-baotang/nt-baotang-3.jpg"
        ],
        address: "Cầu Đá",
        description: "Trưng bày nhiều mẫu vật quý và sinh vật biển sống.",
        lat: 12.2078,
        lng: 109.2144,
        metadata: { tags: ["#GiáoDục", "#BảoTàng"] }
    },
    {
        id: "nt-amchua",
        name: "Đập Thủy Điện Am Chúa",
        type: "ATTRACTION",
        rating: 4.2,
        priceLevel: "Free",
        price: "Miễn phí",
        duration: "3-4 tiếng",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-amchua/nt-amchua-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-amchua/nt-amchua-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-amchua/nt-amchua-3.jpg"
        ],
        address: "Diên Khánh",
        description: "Điểm đến thiên nhiên yên bình và thơ mộng.",
        lat: 12.2687,
        lng: 109.0763,
        metadata: { tags: ["#ThiênNhiên", "#YênBình"] }
    },
    {
        id: "nt-nhahatdo",
        name: "Nhà Hát Đó",
        type: "ATTRACTION",
        rating: 4.7,
        priceLevel: "$$$",
        price: "420k - 630k",
        duration: "3-4 tiếng",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nhahatdo/nt-nhahatdo-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nhahatdo/nt-nhahatdo-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-nhahatdo/nt-nhahatdo-3.jpg"
        ],
        address: "Bãi Tiên",
        description: "Nhà hát được thiết kế như một chiếc đó khổng lồ, điểm đến nghệ thuật.",
        lat: 12.2959,
        lng: 109.2135,
        metadata: { tags: ["#NghệThuật", "#CheckIn"] }
    },
    {
        id: "nt-comga",
        name: "Cơm gà Núi Một",
        type: "RESTAURANT",
        rating: 4.3,
        priceLevel: "$",
        price: "30k-50k",
        duration: "30-45 phút",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-comga/nt-comga-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-comga/nt-comga-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-comga/nt-comga-3.jpg"
        ],
        address: "Núi Một",
        description: "Cơm gà ngon đậm đà, tròn vị.",
        lat: 12.247,
        lng: 109.1915,
        metadata: { tags: ["#ĂnTrưa", "#Gà"] }
    },
    {
        id: "nt-banhcan",
        name: "Bánh căn 51",
        type: "RESTAURANT",
        rating: 4.2,
        priceLevel: "$",
        price: "20k-50k",
        duration: "20-30 phút",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-banhcan/nt-banhcan-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-banhcan/nt-banhcan-2.jpg"
        ],
        address: "Tô Hiến Thành",
        description: "Quán bánh căn ngon nổi tiếng.",
        lat: 12.238,
        lng: 109.193,
        metadata: { tags: ["#ĂnVặt", "#ĐặcSản"] }
    },
    {
        id: "nt-zbeach",
        name: "Z Beach Nha Trang",
        type: "RESTAURANT", // Bar/Pub
        rating: 4.6,
        priceLevel: "$$",
        price: "40k+",
        duration: "1-2 tiếng",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-zbeach/nt-zbeach-1.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-zbeach/nt-zbeach-2.jpg",
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/nha-trang/nt-zbeach/nt-zbeach-3.jpg"
        ],
        address: "Trần Phú",
        description: "Bar bãi biển cực chill.",
        lat: 12.2356,
        lng: 109.197,
        metadata: { tags: ["#Chill", "#Bar", "#Biển"] }
    }
];

// 6. Thác Yang Bay
export const yangBay: PlaceData = {
    id: "nt-yangbay",
    name: "Thác Yang Bay",
    type: "ATTRACTION",
    rating: 4.4,
    priceLevel: "$$",
    price: "140.000 - 200.000 VND/ng",
    duration: "4-5 tiếng",
    images: [
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nha-trang/nt-yangbay/nt-yangbay-1.jpg",
        "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nha-trang/nt-yangbay/nt-yangbay-2.jpg"
    ],
    address: "Khánh Phú, Khánh Vĩnh",
    description: "Thác hùng vĩ, bao quanh bởi rừng núi, có suối nước nóng tự nhiên.",
    lat: 12.181,
    lng: 108.918,
    metadata: { tags: ["#ThiênNhiên"] }
};

export const yangBayHotels: PlaceData[] = [
    {
        id: "nt-van-anh",
        name: "Nhà nghỉ Vân Anh",
        type: "HOTEL",
        rating: 3.5,
        priceLevel: "$",
        price: "296.000 VND",
        address: "Khánh Phú, Khánh Vĩnh",
        description: "Gần Yang Bay, xa trung tâm Nha Trang.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-van-anh/nt-van-anh-1.jpg"],
        lat: 12.190,
        lng: 108.920,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "26.2km", time: "35 phút", note: "Giá rẻ, tiện khám phá" }
    },
    {
        id: "nt-vung-vinh",
        name: "Khách sạn Vùng Vịnh",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$$$",
        price: "490.000 VND",
        address: "Vĩnh Hòa, Nha Trang",
        description: "Không gian đẹp, xa Thác Yang Bay.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-vung-vinh/nt-vung-vinh-1.jpg"],
        lat: 12.270,
        lng: 109.198,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "29km", time: "40 phút", note: "Đẹp, hơi xa" }
    },
    {
        id: "nt-timi-homestay",
        name: "Homestay Timi",
        type: "HOTEL",
        rating: 4.0,
        priceLevel: "$$",
        price: "390.000 VND",
        address: "Nguyễn Thiện Thuật",
        description: "Khoảng cách đến Thác Yang Bay chấp nhận được.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-timi-homestay/nt-timi-homestay-1.jpg"],
        lat: 12.238,
        lng: 109.195,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "23.2km", time: "32 phút", note: "Vị trí trung tâm" }
    },
    {
        id: "nt-thanh-binh",
        name: "Homestay Thanh Bình",
        type: "HOTEL",
        rating: 4.1,
        priceLevel: "$",
        price: "300.000 VND",
        address: "Nguyễn Chánh",
        description: "Thiết kế đẹp; khoảng cách trung bình.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-thanh-binh/nt-thanh-binh-1.jpg"],
        lat: 12.240,
        lng: 109.196,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "27.6km", time: "37 phút", note: "Phòng đẹp, xa Yang Bay" }
    },
    {
        id: "nt-misa",
        name: "Nhà nghỉ Misa",
        type: "HOTEL",
        rating: 3.3,
        priceLevel: "$",
        price: "250.000 VND",
        address: "Tô Hiến Thành",
        description: "Giá rẻ, thuận tiện di chuyển trong phố.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-misa/nt-misa-1.jpg"],
        lat: 12.235,
        lng: 109.192,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "27.7km", time: "38 phút", note: "Giá sinh viên" }
    },
    {
        id: "nt-nha-nghi-nhu-y",
        name: "Nhà nghỉ Như Ý 2",
        type: "HOTEL",
        rating: 3.0,
        priceLevel: "$",
        price: "180.000 VND",
        address: "Hùng Vương",
        description: "Giá siêu rẻ, tiết kiệm. Cách xa Yang Bay.",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/nt/nt-nha-nghi-nhu-y/nt-nha-nghi-nhu-y-1.webp"],
        lat: 12.238,
        lng: 109.196,
        relatedPlaceId: "nt-yangbay",
        metadata: { distance: "30km", time: "40 phút", note: "Phòng cơ bản, siêu rẻ" }
    }
];

export const allNhaTrangPlaces = [
    vinWonders, tour3Dao, quangTruong, nemNuong, haiSan, yangBay
];

export const allNhaTrangHotels = [
    ...vinWondersHotels,
    ...tour3DaoHotels,
    ...quangTruongHotels,
    ...nemNuongHotels,
    ...haiSanHotels,
    ...yangBayHotels
];
