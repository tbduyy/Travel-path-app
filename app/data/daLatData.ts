import { PlaceData } from "./nhaTrangData";

// Temporary images for Da Lat places
const dlPlaceholderImages = [
    "https://images.unsplash.com/photo-1559592413-7efec6e68ba9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628169222409-5d469a9e34cb?q=80&w=600&auto=format&fit=crop"
];

export const extraDaLatPlaces: PlaceData[] = [
    {
        id: "dl-comnieunhungoc",
        name: "Cơm niêu Như Ngọc",
        type: "RESTAURANT",
        rating: 4.5,
        priceLevel: "$$",
        price: "200.000 – 300.000 VNĐ",
        duration: "60 – 90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-comnieunhungoc/dl-comnieunhungoc-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-comnieunhungoc/dl-comnieunhungoc-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-comnieunhungoc/dl-comnieunhungoc-3.jpg"
      ],
        address: "Số 19 Hồ Tùng Mậu, Phường 3, TP. Đà Lạt",
        description: "Cơm niêu Như Ngọc là địa chỉ quen thuộc dành cho những ai muốn thưởng thức bữa cơm gia đình đúng chất Việt giữa lòng Đà Lạt. Quán nổi tiếng với cơm niêu nóng giòn đáy, ăn kèm các món truyền thống như cá kho, thịt kho, canh rau và cà pháo.",
        lat: 11.9385,
        lng: 108.4442,
        metadata: { tags: ["#ĂnUống", "#ẨmThựcĐịaPhương"] }
    },
    {
        id: "dl-ancafe",
        name: "An Cafe Đà Lạt",
        type: "RESTAURANT", // Can be cafe/restaurant
        rating: 4.6,
        priceLevel: "$",
        price: "20.000 – 60.000 VNĐ",
        duration: "45 – 90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-ancafe/dl-ancafe-1.webp",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-ancafe/dl-ancafe-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-ancafe/dl-ancafe-3.webp"
      ],
        address: "Số 63 Bis Ba Tháng Hai, Phường 1, TP. Đà Lạt",
        description: "An Cafe là không gian cà phê mang phong cách mộc mạc, gần gũi với thiên nhiên, nổi bật với nhiều góc ngồi ngoài trời dưới tán cây xanh. Yên tĩnh, nhẹ nhàng.",
        lat: 11.9445,
        lng: 108.4385,
        metadata: { tags: ["#CàPhê", "#ThưGiãn"] }
    },
    {
        id: "dl-langhoavanthanh",
        name: "Làng hoa Vạn Thành",
        type: "ATTRACTION",
        rating: 4.4,
        priceLevel: "$",
        price: "50.000 VNĐ",
        duration: "60 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-langhoavanthanh/dl-langhoavanthanh-1.webp",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-langhoavanthanh/dl-langhoavanthanh-2.jpg"
      ],
        address: "Đường Vạn Thành, Phường 5, TP. Đà Lạt",
        description: "Làng hoa Vạn Thành là một trong những làng hoa lâu đời và lớn nhất Đà Lạt, nổi tiếng với các vườn hoa và nhà kính trải dài.",
        lat: 11.9367,
        lng: 108.4208,
        metadata: { tags: ["#NgoạiCảnh", "#ChụpẢnh"] }
    },
    {
        id: "dl-freshgarden",
        name: "Fresh Garden Đà Lạt",
        type: "ATTRACTION",
        rating: 4.3,
        priceLevel: "$$",
        price: "120.000 VNĐ",
        duration: "75 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-freshgarden/dl-freshgarden-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-freshgarden/dl-freshgarden-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-freshgarden/dl-freshgarden-3.jpg"
      ],
        address: "90B Vạn Thành, Phường 5, TP. Đà Lạt",
        description: "Khu du lịch sinh thái nổi bật với vườn hoa nhiều màu sắc, cối xay gió, cổng trời và các tiểu cảnh thiết kế theo phong cách châu Âu.",
        lat: 11.9360,
        lng: 108.4215,
        metadata: { tags: ["#CheckIn", "#SinhThái"] }
    },
    {
        id: "dl-thacvoi",
        name: "Thác Voi",
        type: "ATTRACTION",
        rating: 4.5,
        priceLevel: "$",
        price: "20.000 – 30.000 VNĐ",
        duration: "70 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thacvoi/dl-thacvoi-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thacvoi/dl-thacvoi-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thacvoi/dl-thacvoi-3.jpg"
      ],
        address: "Xã Gia Lâm, Huyện Lâm Hà, Tỉnh Lâm Đồng",
        description: "Thác Voi là thác nước tự nhiên hùng vĩ nằm giữa không gian núi rừng hoang sơ. Dòng thác đổ mạnh tạo nên khung cảnh ấn tượng.",
        lat: 11.8228,
        lng: 108.3344,
        metadata: { tags: ["#ThiênNhiên", "#HùngVĩ"] }
    },
    {
        id: "dl-dinhbaodai3",
        name: "Dinh Bảo Đại III",
        type: "ATTRACTION",
        rating: 4.2,
        priceLevel: "$",
        price: "40.000 VNĐ",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-dinhbaodai3/dl-dinhbaodai3-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-dinhbaodai3/dl-dinhbaodai3-2.jpg"
      ],
        address: "Số 01 Triệu Việt Vương, Phường 4, TP. Đà Lạt",
        description: "Dinh thự nghỉ dưỡng của vị vua cuối cùng triều Nguyễn, mang phong cách kiến trúc Pháp cổ điển, trang nhã.",
        lat: 11.9304,
        lng: 108.4299,
        metadata: { tags: ["#LịchSử", "#KiếnTrúc"] }
    },
    {
        id: "dl-thienvientruclam",
        name: "Thiền viện Trúc Lâm",
        type: "ATTRACTION",
        rating: 4.7,
        priceLevel: "Free",
        price: "Miễn phí",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thienvientruclam/dl-thienvientruclam-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thienvientruclam/dl-thienvientruclam-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-thienvientruclam/dl-thienvientruclam-3.jpg"
      ],
        address: "Núi Phụng Hoàng, Phường 4, TP. Đà Lạt",
        description: "Một trong những thiền viện lớn và đẹp nhất Việt Nam, tọa lạc trên núi Phụng Hoàng, nhìn ra Hồ Tuyền Lâm.",
        lat: 11.9048,
        lng: 108.4354,
        metadata: { tags: ["#TâmLinh", "#VãnCảnh"] }
    },
    {
        id: "dl-legudabuffet",
        name: "Léguda Buffet Rau",
        type: "RESTAURANT",
        rating: 4.4,
        priceLevel: "$$",
        price: "250.000 – 300.000 VNĐ",
        duration: "90 phút",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-lesguda-buffet-rau/dl-lesguda-buffet-rau-1.jpg"
        ],
        address: "Số 02 Trần Quang Diệu, Phường 10, TP. Đà Lạt",
        description: "Nổi tiếng với thực đơn buffet rau xanh đặc trưng của Đà Lạt, kết hợp lẩu và các món ăn kèm thanh đạm.",
        lat: 11.9367,
        lng: 108.4552,
        metadata: { tags: ["#Buffet", "#ẨmThực"] }
    },
    {
        id: "dl-hoxuanhuong",
        name: "Hồ Xuân Hương",
        type: "ATTRACTION",
        rating: 4.8,
        priceLevel: "Free",
        price: "Miễn phí",
        duration: "60 – 90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoxuanhuong/dl-hoxuanhuong-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoxuanhuong/dl-hoxuanhuong-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoxuanhuong/dl-hoxuanhuong-3.webp",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoxuanhuong/dl-hoxuanhuong-4.webp"
      ],
        address: "Phường 1 & Phường 10, TP. Đà Lạt",
        description: "Biểu tượng trung tâm của Đà Lạt với mặt nước phẳng lặng, hàng thông và không khí mát mẻ. Phù hợp dạo bộ, ngắm cảnh.",
        lat: 11.9416,
        lng: 108.4452,
        metadata: { tags: ["#DạoBộ", "#NgắmCảnh"] }
    },
    {
        id: "dl-langbiang",
        name: "Khu du lịch Núi Langbiang",
        type: "ATTRACTION",
        rating: 4.5,
        priceLevel: "$$",
        price: "50.000 - 170.000 VNĐ",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-langbiang/dl-langbiang-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-langbiang/dl-langbiang-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-langbiang/dl-langbiang-3.jpg"
      ],
        address: "Thị trấn Lạc Dương, Tỉnh Lâm Đồng",
        description: "Khám phá ngọn núi biểu tượng của Đà Lạt, tham quan chân núi hoặc trải nghiệm xe Jeep lên đỉnh Radar ngắm trọn thành phố.",
        lat: 12.0463,
        lng: 108.4284,
        metadata: { tags: ["#ThiênNhiên", "#ToànCảnh"] }
    },
    {
        id: "dl-latvillage",
        name: "Làng dân tộc K’Ho (Lát Village)",
        type: "ATTRACTION",
        rating: 4.3,
        priceLevel: "$",
        price: "30.000 – 50.000 VNĐ",
        duration: "75 phút",
        images: [
            "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-lang-dan-toc-k-ho-lat-village/dl-lang-dan-toc-k-ho-lat-village-1.jpg"
        ],
        address: "Xã Lát, Huyện Lạc Dương, Tỉnh Lâm Đồng",
        description: "Tìm hiểu văn hóa đồng bào bản địa K'Ho dưới chân Langbiang, nhà sàn truyền thống, nghề dệt thổ cẩm và giao lưu văn hóa.",
        lat: 12.0354,
        lng: 108.4201,
        metadata: { tags: ["#VănHóa", "#BảnĐịa"] }
    },
    {
        id: "dl-vuonhoathanhpho",
        name: "Vườn hoa Thành phố Đà Lạt",
        type: "ATTRACTION",
        rating: 4.2,
        priceLevel: "$",
        price: "70.000 – 80.000 VNĐ",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-vuonhoathanhpho/dl-vuonhoathanhpho-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-vuonhoathanhpho/dl-vuonhoathanhpho-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-vuonhoathanhpho/dl-vuonhoathanhpho-3.jpg"
      ],
        address: "Đường Trần Quốc Toản, Phường 8, TP. Đà Lạt",
        description: "Điểm đến quen thuộc với hàng trăm loài hoa đặc trưng của Đà Lạt được trưng bày rực rỡ theo mùa.",
        lat: 11.9472,
        lng: 108.4526,
        metadata: { tags: ["#Hoa", "#CheckIn"] }
    },
    {
        id: "dl-horizoncoffee",
        name: "Horizon Coffee",
        type: "RESTAURANT",
        rating: 4.5,
        priceLevel: "$$",
        price: "60.000 – 120.000 VNĐ",
        duration: "60 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-horizoncoffee/dl-horizoncoffee-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-horizoncoffee/dl-horizoncoffee-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-horizoncoffee/dl-horizoncoffee-3.jpg"
      ],
        address: "Số 31/6 đường 3 Tháng 4, Phường 3, TP. Đà Lạt",
        description: "Nổi tiếng với không gian mở và tầm nhìn cao, bao quát rừng thông và thung lũng. Quán thiết kế tối giản, nhiều góc sống ảo.",
        lat: 11.9312,
        lng: 108.4411,
        metadata: { tags: ["#CàPhê", "#ViewĐẹp"] }
    },
    {
        id: "dl-nhahangmemory",
        name: "Nhà hàng Memory",
        type: "RESTAURANT",
        rating: 4.4,
        priceLevel: "$$",
        price: "250.000 – 350.000 VNĐ",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-nhahangmemory/dl-nhahangmemory-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-nhahangmemory/dl-nhahangmemory-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-nhahangmemory/dl-nhahangmemory-3.webp"
      ],
        address: "Số 24B Hùng Vương, Phường 10, TP. Đà Lạt",
        description: "Mang phong cách lãng mạn, ấm cúng. Thực đơn đa dạng từ món Việt đến món Âu, không gian yên tĩnh.",
        lat: 11.9416,
        lng: 108.4688,
        metadata: { tags: ["#ĂnTối", "#LãngMạn"] }
    },
    {
        id: "dl-mongoland",
        name: "Mongo Land Đà Lạt",
        type: "ATTRACTION",
        rating: 4.4,
        priceLevel: "$$",
        price: "100.000 – 120.000 VNĐ",
        duration: "90 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-mongoland/dl-mongoland-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-mongoland/dl-mongoland-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-mongoland/dl-mongoland-3.png"
      ],
        address: "Tổ 16, Thôn 1, Xã Tà Nung, TP. Đà Lạt",
        description: "Phong cách thảo nguyên Mông Cổ thu nhỏ với lều trại, trang phục và tiểu cảnh độc đáo để chụp ảnh trải nghiệm.",
        lat: 11.9056,
        lng: 108.3562,
        metadata: { tags: ["#CheckIn", "#TrảiNghiệm"] }
    },
    {
        id: "dl-hoasondientrang",
        name: "Hoa Sơn Điền Trang",
        type: "ATTRACTION",
        rating: 4.3,
        priceLevel: "$$",
        price: "100.000 VNĐ",
        duration: "75 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoasondientrang/dl-hoasondientrang-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-hoasondientrang/dl-hoasondientrang-2.jpg"
      ],
        address: "Tiểu khu 159, Phường 5, TP. Đà Lạt",
        description: "Nổi bật với các điểm check-in như Cổng Trời, Bàn tay Phật và rừng thông xanh mát thiên nhiên yên bình.",
        lat: 11.9216,
        lng: 108.3842,
        metadata: { tags: ["#SốngẢo", "#KhámPhá"] }
    },
    {
        id: "dl-tanungxua",
        name: "Nhà hàng Tà Nung Xưa",
        type: "RESTAURANT",
        rating: 4.2,
        priceLevel: "$$",
        price: "180.000 – 250.000 VNĐ",
        duration: "60 phút",
        images: [
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-tanungxua/dl-tanungxua-1.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-tanungxua/dl-tanungxua-2.jpg",
                "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-tanungxua/dl-tanungxua-3.jpg"
      ],
        address: "Thôn 1, Xã Tà Nung, TP. Đà Lạt",
        description: "Phục vụ các món địa phương đặc trưng như gà nướng, cơm lam và lẩu. Không gian thiên nhiên mát mẻ.",
        lat: 11.9051,
        lng: 108.3610,
        metadata: { tags: ["#ĂnTrưa", "#ĐặcSản"] }
    }
];

export const extraDaLatHotels: PlaceData[] = [
    {
        id: "dl-duparchotel",
        name: "Du Parc Hotel Dalat",
        type: "HOTEL",
        rating: 4.5,
        priceLevel: "$$",
        price: "350.000 VNĐ/đêm",
        duration: "N/A",
        images: ["https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/places/places/dl/dl-duparchotel-1.jpg"],
        address: "15 Trần Phú, Phường 3, TP. Đà Lạt",
        description: "Khách sạn phong cách cổ điển, yên tĩnh. Cách Dinh Bảo Đại III khoảng 1.5 km (6-8 phút di chuyển).",
        lat: 11.9392,
        lng: 108.4385,
        relatedPlaceId: "dl-dinhbaodai3",
        metadata: { distance: "1.5km", time: "6-8 phút", note: "Gần Dinh III, phong cách cổ điển" }
    }
];
