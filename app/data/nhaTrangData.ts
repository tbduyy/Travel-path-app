
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

// Master Lists
export const allNhaTrangPlaces = [
    vinWonders, tour3Dao, quangTruong, nemNuong, haiSan
    //, ...extraPlaces (Removed as requested: only 5 main places for the primary selection flow)
];

export const allNhaTrangHotels = [
    ...vinWondersHotels,
    ...tour3DaoHotels,
    ...quangTruongHotels,
    ...nemNuongHotels,
    ...haiSanHotels
];
