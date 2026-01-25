
'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

// --- DATA SOURCE ---
// Copied from data/blog-posts.ts
const BLOG_POSTS = [
    {
        id: "1",
        slug: "meo-du-lich-ngau-hung",
        title: "MẸO DU LỊCH CHO NHỮNG NGÀY MUỐN ĐI LÀ ĐI",
        excerpt: "Du lịch tự túc không cần quá cầu kỳ, chỉ cần đủ thoải mái. Dưới đây là vài thói quen nhỏ mình rút ra sau nhiều chuyến đi kiểu “muốn đi là đi”.",
        coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
        author: "Travel Path Team",
        tags: ["Tips", "Kinh nghiệm"],
        content: [
            "Mình bắt đầu quen với du lịch tự túc từ một suy nghĩ rất đơn giản: nếu cứ chờ đủ điều kiện hoàn hảo thì chắc sẽ chẳng bao giờ đi đâu cả. Thế là có thời gian rảnh là đi, không cần chuẩn bị quá lâu, không cần mọi thứ phải thật chỉn chu. Càng đi nhiều, mình càng nhận ra: du lịch không cần quá cầu kỳ, chỉ cần đủ thoải mái. Dưới đây là vài thói quen nhỏ mình rút ra sau nhiều chuyến đi kiểu “muốn đi là đi”.",
            "1. Lên khung, đừng lên lịch quá chi tiết",
            "Thay vì lên lịch chi tiết từng giờ, mình chỉ xác định trước vài thứ cơ bản: – Mình muốn đi đâu – Ở khu nào cho tiện – Có món gì nhất định phải thử. Còn lại thì để đó. Có những ngày mình đi đúng plan, nhưng cũng có ngày rẽ ngang chỉ vì thấy một con đường đẹp hay một quán cà phê nhìn hợp vibe. Thật ra, nhiều kỷ niệm mình nhớ lâu nhất lại đến từ những lúc… chẳng có trong kế hoạch ban đầu.",
            "2. Chọn chỗ ở dựa trên “nhịp sống”",
            "Chỗ ở ảnh hưởng rất nhiều đến cảm giác của chuyến đi. Mình không còn chọn chỗ chỉ vì rẻ hay vì đẹp trên ảnh nữa, mà hay tự hỏi: mình muốn những ngày đó sống nhanh hay sống chậm? Có chuyến mình chọn ở gần khu dân cư để sáng nghe tiếng xe, tiếng người. Có chuyến lại chọn homestay yên tĩnh để tối về chỉ muốn nghỉ. Ở đúng “nhịp” của mình, tự nhiên chuyến đi cũng dễ chịu hơn hẳn.",
            "3. Luôn chừa tiền cho những thứ không nằm trong kế hoạch",
            "Mình hay gọi vui đó là “chi phí cho cảm xúc”. Có thể là một ly cà phê hơi đắt nhưng ngồi rất lâu. Một chuyến xe chạy vòng vòng không mục đích. Hay một bữa ăn ngon hơn dự tính ban đầu. Những khoản đó không phải lúc nào cũng cần thiết, nhưng nếu có, chuyến đi thường vui hơn. Du lịch mà lúc nào cũng đắn đo từng chút thì hơi mệt, nên mình luôn chừa sẵn một khoản để… chiều bản thân.",
            "4. Mang ít đồ hơn bạn nghĩ",
            "Đây là bài học mình rút ra sau rất nhiều lần mang theo vali đầy mà cuối cùng chỉ dùng vài món. Thực tế là mình không cần nhiều đồ như mình tưởng. Mang gọn lại, nhẹ hơn, di chuyển cũng thoải mái hơn. Tâm lý vì thế cũng nhẹ theo. Đi chơi mà lúc nào cũng lo đồ đạc thì khó mà tận hưởng được.",
            "5. Đi chậm lại một chút",
            "Du lịch tự túc không phải để check-in cho đủ, mà để cảm nhận. Có những nơi mình chỉ ngồi cả buổi chiều, không làm gì đặc biệt, chỉ nhìn xung quanh và nghĩ ngợi linh tinh. Và lạ là những khoảnh khắc đó lại khiến mình thấy chuyến đi rất trọn. Không cần quá nhiều điểm đến, chỉ cần mình thật sự có mặt ở nơi mình đang đứng."
        ]
    },
    {
        id: "2",
        slug: "ha-noi-mot-minh",
        title: "HÀ NỘI - ĐI 1 CHUYẾN ĐỂ Ở LẠI VỚI CHÍNH MÌNH",
        excerpt: "Chuyến đi Hà Nội một mình cho mình nhận ra một điều rất rõ: khi có một lịch trình được sắp xếp hợp lý từ trước, mình không bị áp lực phải “đi cho đủ”, mà có nhiều không gian hơn để cảm nhận.",
        coverImage: "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=2070&auto=format&fit=crop",
        author: "Minh Anh",
        tags: ["Hà Nội", "Solo Travel"],
        content: [
            "Mình đến Hà Nội trong một quyết định rất ngẫu hứng. Không phải vì có kỳ nghỉ dài, cũng chẳng vì ai rủ rê. Chỉ là có một giai đoạn thấy mình hơi mệt với nhịp sống quen thuộc, nên muốn đổi không gian. Muốn ở một nơi đủ đông để không thấy trống trải, nhưng cũng đủ chậm để không bị cuốn đi.",
            "Trước chuyến đi, mình đã chuẩn bị sẵn một khung lịch trình khá gọn: những khu vực nên đi bộ, vài quán ăn nhất định phải thử, và những khoảng thời gian để nghỉ ngơi xen kẽ. Không phải để ép bản thân phải đi cho đủ, mà để khi đặt chân đến nơi, mình không cần loay hoay suy nghĩ quá nhiều. Hà Nội đón mình bằng cái lạnh nhẹ, mình dành nhiều thời gian đi bộ quanh phố cổ. Các điểm tham quan đã được sắp xếp gần nhau nên mình không phải di chuyển quá nhiều. Giữa những chặng đi, mình dừng lại ở những quán nước nhỏ, vài chiếc ghế nhựa thấp, người dân ngồi nói chuyện rì rầm. Mình ngồi đó uống trà đá, không mở điện thoại, không vội vàng. Cảm giác rất nhẹ, vì mình biết mình không bỏ lỡ điều gì quan trọng trong ngày.",
            "Buổi sáng của mình thường bắt đầu bằng phở hoặc bún, đúng những quán đã được note sẵn từ trước. Mình ăn chậm, không cần canh giờ. Buổi trưa thì nghỉ trong những quán cà phê cũ, ánh sáng vàng, nhạc mở rất nhỏ. Khoảng nghỉ này vốn đã được tính trước, nên mình không thấy áy náy vì “ngồi lâu quá” hay “chưa đi đủ chỗ”.",
            "Buổi tối, mình hay ra Hồ Gươm. Đi một vòng theo đúng khung giờ mát mẻ nhất, rồi ngồi xuống ghế đá. Xung quanh là người chạy bộ, mấy nhóm bạn trẻ đàn hát, vài cặp đôi nói chuyện rất khẽ. Mình không quen ai, nhưng cũng không thấy lạc lõng. Hà Nội lúc đó giống như một người bạn trầm tính, không hỏi nhiều, chỉ ngồi cạnh.",
            "Chuyến đi Hà Nội một mình cho mình nhận ra một điều rất rõ: khi có một lịch trình được sắp xếp hợp lý từ trước, mình không bị áp lực phải “đi cho đủ”, mà có nhiều không gian hơn để cảm nhận. Đi một mình không đáng sợ như mình từng nghĩ. Ngược lại, nó giúp mình ở gần bản thân hơn, lắng nghe mình rõ hơn. Và có lẽ, đó là điều mình cần nhất trong chuyến đi này."
        ]
    },
    {
        id: "3",
        slug: "nha-trang-thanh-thoi",
        title: "NHA TRANG - BIỂN, BẠN BÈ VÀ NHỮNG NGÀY THẢNH THƠI",
        excerpt: "Nha Trang là kiểu chuyến đi mà chỉ cần đủ người là thấy vui hơn phân nửa. Tụi mình quyết định đi khá nhanh, nhưng vẫn dành chút thời gian thống nhất với nhau vài điểm ăn chơi chính.",
        coverImage: "https://images.unsplash.com/photo-1565529452814-2c638680c2f3?q=80&w=2070&auto=format&fit=crop",
        author: "Team Chill",
        tags: ["Nha Trang", "Biển", "Bạn bè"],
        content: [
            "Nha Trang là kiểu chuyến đi mà chỉ cần đủ người là thấy vui hơn phân nửa. Tụi mình quyết định đi khá nhanh, nhưng vẫn dành chút thời gian thống nhất với nhau vài điểm ăn chơi chính, để khi tới nơi không phải bàn cãi quá nhiều.",
            "Ngày đầu ở Nha Trang, tụi mình bắt đầu khá chậm. Buổi sáng cả đám ghé bún cá sứa Yersin. Một tô bún nóng, nước trong, cá ngọt – vừa ăn xong là tỉnh táo hẳn, sẵn sàng cho cả buổi dài trên bãi cát Trần Phú.",
            "Biển buổi sáng đông nhưng vui. Cả nhóm thay nhau bơi, thay nhau chụp hình. Không cần tạo dáng cầu kỳ, chỉ cần ánh nắng đúng góc là ảnh đã đẹp. Khi mặt trời đứng bóng, cả đám rút về Thanh Sương (Tháp Bà). Hải sản ở đây tươi, nêm nếm vừa miệng, ăn xong chỉ muốn ngả lưng nghỉ trưa.",
            "Chiều xuống, tụi mình không vội. Chạy xe dọc theo con đường ven biển, ghé Hòn Chồng để nhìn thành phố từ trên cao. Gió mát, biển xanh, đứng yên cũng thấy đủ. Có những khoảnh khắc chẳng cần nói gì, chỉ cần đứng cạnh nhau.",
            "Tối đến, thành phố bắt đầu lên đèn. Bờ Kè là điểm dừng quen thuộc cho những bữa hải sản rôm rả. Tiếng sóng, mùi đồ nướng, câu chuyện cũ được kể lại lần nữa nhưng vẫn thấy vui. Đêm khép lại ở Skylight Rooftop Bar, nơi cả nhóm ngồi nhìn Nha Trang từ trên cao, nhạc vừa đủ nghe, không ai muốn về sớm.",
            "Ngày hôm sau, biển vẫn ở đó, nhưng tụi mình chọn ra đảo. Hòn Mun – Hòn Tằm cho một buổi lặn biển, chơi trò dưới nước và mang về làn da rám nắng. Trở về thành phố trong trạng thái mệt nhưng rất đã.",
            "Nha Trang với bạn bè là vậy. Không cần lịch trình dày đặc. Chỉ cần biển, vài chỗ ăn ngon, và những người sẵn sàng cười cùng mình đến cuối ngày."
        ]
    },
    {
        id: "4",
        slug: "da-lat-hoa-no",
        title: "ĐÀ LẠT NHỮNG NGÀY HOA NỞ",
        excerpt: "Lễ hội Hoa Đà Lạt là sự kiện văn hóa – du lịch tiêu biểu của thành phố Đà Lạt, thường được tổ chức 2 năm một lần.",
        coverImage: "https://images.unsplash.com/photo-1519830869695-442a58b291d9?q=80&w=1974&auto=format&fit=crop",
        author: "Admin",
        tags: ["Đà Lạt", "Lễ hội hoa"],
        content: [
            "Lễ hội Hoa Đà Lạt là sự kiện văn hóa – du lịch tiêu biểu của thành phố Đà Lạt, thường được tổ chức 2 năm một lần (vào khoảng cuối năm). Lễ hội không chỉ tôn vinh nghề trồng hoa truyền thống mà còn góp phần xây dựng hình ảnh Đà Lạt như một thành phố xanh – thân thiện – sáng tạo.",
            "Ý nghĩa của Lễ hội Hoa Đà Lạt",
            "Lễ hội được tổ chức nhằm: Tôn vinh giá trị của hoa và người trồng hoa Đà Lạt; Quảng bá hình ảnh thành phố đến du khách trong và ngoài nước; Kết nối văn hóa – du lịch – nông nghiệp công nghệ cao. Thông qua lễ hội, Đà Lạt khẳng định vị thế là trung tâm sản xuất hoa lớn của Việt Nam và là điểm đến du lịch đặc trưng gắn liền với thiên nhiên.",
            "Các hoạt động chính trong lễ hội",
            "Lễ hội Hoa Đà Lạt bao gồm nhiều hoạt động đa dạng, diễn ra ở các địa điểm trung tâm của thành phố:",
            "Không gian trưng bày hoa: Các tuyến đường như quanh Hồ Xuân Hương, Vườn hoa Đà Lạt, Quảng trường Lâm Viên được trang trí bằng hàng nghìn loài hoa khác nhau, sắp đặt theo chủ đề từng năm.",
            "Triển lãm và giới thiệu hoa – nông sản: Giới thiệu các giống hoa đặc trưng, hoa mới lai tạo, cùng sản phẩm nông nghiệp công nghệ cao của địa phương.",
            "Chương trình nghệ thuật và diễu hành: Bao gồm biểu diễn âm nhạc, nghệ thuật dân gian, trình diễn đường phố và các chương trình khai mạc – bế mạc quy mô lớn.",
            "Hoạt động giao lưu văn hóa: Kết hợp quảng bá văn hóa Tây Nguyên, làng nghề truyền thống và đời sống bản địa.",
            "Thời điểm lý tưởng để tham gia lễ hội",
            "Lễ hội thường diễn ra vào mùa khô, thời tiết mát mẻ, ít mưa, thuận lợi cho việc tham quan và tham gia các hoạt động ngoài trời. Đây cũng là thời điểm Đà Lạt đón lượng khách lớn nhất trong năm.",
            "Vai trò của lễ hội đối với du lịch Đà Lạt",
            "Lễ hội Hoa không chỉ là sự kiện ngắn hạn mà còn: Tạo điểm nhấn du lịch theo mùa; Kích thích nhu cầu lưu trú, ẩm thực và trải nghiệm địa phương; Góp phần xây dựng hình ảnh Đà Lạt gắn với phát triển bền vững."
        ]
    }
];

// Copied from app/actions/search.ts
const NHA_TRANG_ATTRACTIONS = [
    {
        id: "nt-attr-1",
        name: "VinWonders Nha Trang",
        description: "Công viên VinWonders Nha Trang tọa lạc trên đảo Hòn Tre, được xem là thiên đường vui chơi – giải trí hàng đầu với hệ thống cáp treo vượt biển độc đáo và quần thể giải trí đẳng cấp quốc tế. Nơi đây hội tụ đa dạng trải nghiệm từ các trò chơi cảm giác mạnh, công viên nước sôi động, thủy cung kỳ thú đến khu vui chơi gia đình và những màn trình diễn ấn tượng.",
        image: "https://ik.imagekit.io/tvlk/blog/2022/09/vinwonders-nha-trang-1.jpg",
        rating: 4.9,
        priceLevel: 3,
        price: "880.000 VND/người",
        address: "Đảo Hòn Tre, Nha Trang",
        lat: 12.2215,
        lng: 109.2458,
        duration: "12-13 tiếng",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Ngoài trời", "#Khám phá", "#Giải trí"] }
    },
    {
        id: "nt-attr-2",
        name: "Tour 3 đảo Nha Trang",
        description: "Tour 3 đảo Nha Trang đưa du khách khám phá Hòn Mun – làng chài – Mini Beach, mang đến trải nghiệm trọn vẹn giữa thiên nhiên biển xanh trong lành. Bạn sẽ được tắm biển, lặn ngắm san hô rực rỡ tại Hòn Mun, tìm hiểu đời sống mộc mạc của ngư dân làng chài và thưởng thức hải sản tươi ngon.",
        image: "https://statics.vinpearl.com/tour-3-dao-nha-trang-1_1629887556.jpg",
        rating: 4.7,
        priceLevel: 2,
        price: "450.000 VND/người",
        address: "Cảng Cầu Đá, Nha Trang",
        lat: 12.2023,
        lng: 109.2140,
        duration: "8-9 tiếng",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Biển đảo", "#Lặn biển", "#Thiên nhiên"] }
    },
    {
        id: "nt-attr-3",
        name: "Quảng trường 2/4",
        description: "Quảng trường 2/4 tọa lạc tại trung tâm thành phố Nha Trang, là biểu tượng du lịch sôi động và trái tim văn hóa của thành phố biển. Nổi bật với tháp Trầm Hương độc đáo, nơi đây là điểm dừng chân không thể bỏ qua để dạo bộ, thưởng thức ẩm thực, và tham gia các sự kiện.",
        image: "https://local.vn/wp-content/uploads/2020/04/quang-truong-2-4-nha-trang-5.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Đường Trần Phú, Nha Trang",
        lat: 12.2388,
        lng: 109.1967,
        duration: "15-30 phút",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Văn hóa", "#Check-in", "#Trung tâm"] }
    },
    {
        id: "nt-attr-4",
        name: "Nem Nướng Đặng Văn Quyên",
        description: "Nem nướng Đặng Văn Quyên là địa chỉ ẩm thực quen thuộc tại Nha Trang, nổi tiếng với các món đặc sản mang đậm hương vị địa phương. Nhờ hương vị đặc trưng, khó quên, quán luôn thu hút đông đảo thực khách ghé thưởng thức.",
        image: "https://mia.vn/media/uploads/blog-du-lich/nem-nuong-dang-van-quyen-diem-den-am-thuc-quen-thuoc-cua-nguoi-dan-nha-trang-04-1647416399.jpg",
        rating: 4.6,
        priceLevel: 2,
        price: "50.000 - 150.000 VND",
        address: "16A Lãn Ông, Nha Trang",
        lat: 12.2475,
        lng: 109.1920,
        duration: "30-45 phút",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Ẩm thực", "#Đặc sản"] }
    },
    {
        id: "nt-attr-5",
        name: "Hải sản Thanh Sương",
        description: "Hải sản Thanh Sương là quán hải sản nổi tiếng tại Nha Trang, được nhiều thực khách yêu thích nhờ hải sản tươi ngon, chế biến nhanh và chỉ sử dụng nguyên liệu trong ngày. Với mức giá hợp lý, đây là địa điểm lý tưởng để tụ họp bạn bè.",
        image: "https://reviewnao.com/wp-content/uploads/2019/07/Hai-san-Thanh-Suong-Nha-Trang.jpg",
        rating: 4.4,
        priceLevel: 2,
        price: "100.000 - 300.000 VND",
        address: "21 Trần Phú, Nha Trang",
        lat: 12.2081,
        lng: 109.2150,
        duration: "30-45 phút",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Hải sản", "#Ăn uống"] }
    },
    {
        id: "nt-attr-6",
        name: "Bảo Tàng Hải Dương Học",
        description: "Viện Hải dương học Nha Trang là điểm đến thú vị dành cho du khách yêu thích khám phá thế giới đại dương, nổi bật với Bảo tàng Hải dương học trưng bày nhiều mẫu vật quý và sinh vật biển sống.",
        image: "https://vinwonders.com/wp-content/uploads/2023/04/vien-hai-duong-hoc-nha-trang-3.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "10.000 VND - 40.000 VND",
        address: "1 Cầu Đá, Nha Trang",
        lat: 12.2078,
        lng: 109.2144,
        duration: "1-2 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Bảo tàng", "#Khám phá"] }
    },
    {
        id: "nt-attr-7",
        name: "Đập Thủy Điện Am Chúa",
        description: "Hồ Am Chúa là một điểm đến thiên nhiên yên bình và thơ mộng của Nha Trang, mang vẻ đẹp rất khác so với những bãi biển hay hòn đảo quen thuộc. Nằm lặng lẽ giữa núi rừng và trời mây.",
        image: "https://tuyendaikhanhhoa.vn/Portals/0/A%20HINH%20TIN%20BAI/THANG%204%20NAM%202022/am%20chua%202.jpg",
        rating: 4.3,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Diên Điền, Diên Khánh, Nha Trang",
        lat: 12.2687,
        lng: 109.0763,
        duration: "3-4 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Thiên nhiên", "#Yên bình"] }
    },
    {
        id: "nt-attr-8",
        name: "Nhà Hát Đó (Vega City)",
        description: "Lấy cảm hứng từ cái đó – nông cụ dân gian quen thuộc của người Việt, Nhà hát Đó (Đó Theatre) được thiết kế như một chiếc đó khổng lồ, nổi bật trên bờ biển Bãi Tiên. Nơi diễn ra show diễn 'Rối Mơ' đẳng cấp quốc tế.",
        image: "https://vcdn1-dulich.vnecdn.net/2023/04/02/nha-hat-do-nha-trang-1-1680410046.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=K7P4l9Xyq2z5l5Xyq2z5l5",
        rating: 4.8,
        priceLevel: 3,
        price: "420.000 VND - 630.000 VND",
        address: "Vega City, Bãi Tiên, Nha Trang",
        lat: 12.2959,
        lng: 109.2135,
        duration: "3-4 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Nghệ thuật", "#Kiến trúc"] }
    },
    {
        id: "nt-attr-9",
        name: "Cơm gà Núi Một",
        description: "Cơm gà Núi Một Nha Trang là địa chỉ ẩm thực quen thuộc với thực khách nhờ sử dụng nguồn gà sạch, chất lượng cao. Các món ăn được chế biến đậm đà, tròn vị.",
        image: "https://cdn.justfly.vn/1200x630/media/f5/63/0d/17-09-2022/com-ga-nui-mot-2.jpg",
        rating: 4.4,
        priceLevel: 2,
        price: "30.000 VND - 450.000 VND",
        address: "Nha Trang",
        lat: 12.2470,
        lng: 109.1915,
        duration: "30-45 phút",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Ăn uống", "#Đặc sản"] }
    },
    {
        id: "nt-attr-10",
        name: "Bánh căn 51",
        description: "Bánh căn 51 là một trong những địa chỉ nức tiếng dành cho “tín đồ” bánh căn tại Nha Trang. Dù chỉ là quán bình dân nhưng hương vị thơm ngon, chất lượng ổn định.",
        image: "https://mia.vn/media/uploads/blog-du-lich/banh-can-51-to-hien-thanh-01-1636534289.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "20.000 VND - 150.000 VND",
        address: "51 Tô Hiến Thành, Nha Trang",
        lat: 12.2380,
        lng: 109.1930,
        duration: "20-30 phút",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Ăn uống", "#Bình dân"] }
    },
    {
        id: "nt-attr-11",
        name: "Z Beach Nha Trang",
        description: "Z-Beach là điểm hẹn “cực chill” quen thuộc của giới trẻ Nha Trang, sở hữu không gian mở ngay trên bãi biển với quầy bar nhỏ, ghế lười sắc cam nổi bật.",
        image: "https://reviewnao.com/wp-content/uploads/2021/04/Z-Beach-Nha-Trang-1.jpg",
        rating: 4.6,
        priceLevel: 2,
        price: "40.000 VND - 2.400.000 VND",
        address: "Trần Phú, Nha Trang",
        lat: 12.2356,
        lng: 109.1970,
        duration: "1-2 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Bar", "#Beach Club"] }
    }
];

const NHA_TRANG_HOTELS = [
    { id: "h1", name: "Vinpearl Beachfront Nha Trang", price: "3.700.000 VND", description: "Bao gồm 2 vé VinWonders. Khách sạn 5 sao tiện nghi bậc nhất.", address: "Trần Phú", lat: 12.236, lng: 109.196, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/176949038.jpg?k=f8b2d8c3c1e2d4e8f8c8c8c8c8c8c8c8", rating: 5, note: "Giá hơi cao nhưng đã bao gồm vé VinWonders 2N1Đ nên rất hời.", distance: "4.5 km", time: "11 phút" },
    { id: "h2", name: "Khách sạn Dendro beachfront", price: "348.000 VND", description: "Khách sạn đối diện biển, giá bình dân.", address: "Trần Phú", lat: 12.234, lng: 109.197, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/187974018.jpg?k=987654321", rating: 3.5, note: "Nằm giữa trung tâm và VinWonders, hơi bất tiện đi dạo nhưng view đẹp.", distance: "3.6 km", time: "7 phút" },
    { id: "h3", name: "Khách sạn Dubai Nha Trang", price: "280.000 VND", description: "Khách sạn giá rẻ trong trung tâm.", address: "Trung tâm", lat: 12.240, lng: 109.192, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/123456789.jpg?k=111", rating: 3, note: "Vị trí khá xa VinWonders, phù hợp tiết kiệm chi phí.", distance: "5 km", time: "15 phút" },
    { id: "h4", name: "Khách sạn Dolphin Bay", price: "257.000 VND", description: "Gần trung tâm, giá ưu đãi.", address: "Gần trung tâm", lat: 12.230, lng: 109.198, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/dolphin.jpg", rating: 3, note: "Thường nhanh hết phòng, chất lượng phòng chưa đồng nhất.", distance: "1.7 km", time: "7 phút" },
    { id: "h5", name: "Khách sạn Brilliant Bay Nha Trang", price: "300.000 VND", description: "View biển đối diện thoáng đẹp.", address: "Phạm Văn Đồng", lat: 12.270, lng: 109.200, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/brilliant.jpg", rating: 3.5, note: "Hơi xa trung tâm, bù lại view đẹp.", distance: "3 km", time: "10 phút" },
    { id: "h6", name: "Khách sạn Palm Beach", price: "347.000 VND", description: "Gần trung tâm, thuận tiện.", address: "Biệt Thự", lat: 12.232, lng: 109.197, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/palm.jpg", rating: 3.5, note: "Giá không quá nổi bật nhưng vị trí thuận tiện.", distance: "1.8 km", time: "6 phút" },
    { id: "h7", name: "Khách sạn Sun City", price: "338.000 VND", description: "Đối diện biển, gần quảng trường.", address: "Tôn Đản", lat: 12.239, lng: 109.196, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/suncity.jpg", rating: 3.5, note: "Cần đặt trước vì rất hot, vị trí đẹp.", distance: "250m", time: "1 phút" },
    { id: "h8", name: "Khách sạn LE SOLEIL", price: "360.000 VND", description: "Gần trung tâm, kèm bữa sáng.", address: "Hùng Vương", lat: 12.237, lng: 109.195, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/lesoleil.jpg", rating: 3.5, note: "Giá không rẻ nhưng tiện nghi, gần trung tâm.", distance: "350m", time: "1 phút" },
    { id: "h9", name: "Khách sạn Nắng Biển - Sunny Sea", price: "266.000 VND", description: "Đối diện biển, giá rẻ.", address: "Trần Phú", lat: 12.230, lng: 109.198, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/sunnysea.jpg", rating: 3, note: "Chất lượng cơ bản, bù lại vị trí tốt.", distance: "950m", time: "3 phút" },
    { id: "h10", name: "Khách sạn Mangolia", price: "245.000 VND", description: "Gần khu ăn uống và chợ.", address: "Hùng Vương", lat: 12.246, lng: 109.193, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/mangolia.jpg", rating: 3, note: "Không có view biển nhưng thuận tiện ăn uống.", distance: "210m", time: "1 phút" },
    { id: "h11", name: "Khách sạn CKD Nha Trang", price: "500.000 VND", description: "Giá trung bình cao, tiện nghi.", address: "Pasteur", lat: 12.248, lng: 109.192, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/ckd.jpg", rating: 4, note: "Gần khu ăn uống, dễ dàng đi bộ.", distance: "140m", time: "1 phút" },
    { id: "h12", name: "Khách sạn Maika", price: "344.000 VND", description: "Gần điểm checkin, ăn uống.", address: "Biệt Thự", lat: 12.240, lng: 109.195, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/maika.jpg", rating: 3, note: "Không view biển, bù lại vị trí trẻ trung.", distance: "1km", time: "3 phút" },
    { id: "h13", name: "Khách sạn Vạn Kim", price: "285.000 VND", description: "Giá ưu đãi, xa trung tâm.", address: "Dã Tượng", lat: 12.210, lng: 109.210, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/vankim.jpg", rating: 2.5, note: "Xa trung tâm, nhưng giá rẻ.", distance: "3.2km", time: "8 phút" },
    { id: "h14", name: "Khách sạn Ruby Luxury", price: "391.000 VND", description: "Chất lượng tốt, giá hợp lý.", address: "Hoàng Diệu", lat: 12.215, lng: 109.208, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/ruby.jpg", rating: 3.5, note: "Vị trí hơi xa tham quan, nhưng chất lượng ổn.", distance: "2.1km", time: "4 phút" },
    { id: "h15", name: "Khách sạn Pearl City", price: "334.000 VND", description: "Gần điểm khám phá, xa biển.", address: "Phước Long", lat: 12.205, lng: 109.200, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/pearl.jpg", rating: 3, note: "Không sát biển, nhưng thuận tiện khám phá.", distance: "3.6km", time: "8 phút" },
];

export async function migrateData() {
    let stats = { posts: 0, places: 0, errors: [] as string[] }

    // Migrate Posts
    for (const post of BLOG_POSTS) {
        try {
            const existing = await prisma.post.findUnique({ where: { slug: post.slug } })
            if (!existing) {
                await prisma.post.create({
                    data: {
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        coverImage: post.coverImage,
                        author: post.author,
                        tags: post.tags,
                        content: post.content, // Arrays are compatible with Json type
                        createdAt: new Date() // Or parse post.date if needed
                    }
                })
                stats.posts++
            }
        } catch (e: any) {
            stats.errors.push(`Post ${post.slug}: ${e.message}`)
        }
    }

    // Migrate Attractions
    for (const attr of NHA_TRANG_ATTRACTIONS) {
        try {
            // Check by name to avoid dupes if running multiple times (since IDs are new UUIDs usually, or we can use the old ID if valid UUID. But old IDs are 'nt-attr-1' not UUID)
            // We'll trust NAME uniqueness for migration or just create.
            // Better: Check if name exists.
            const existing = await prisma.place.findFirst({ where: { name: attr.name } })
            if (!existing) {
                await prisma.place.create({
                    data: {
                        name: attr.name,
                        description: attr.description,
                        type: 'ATTRACTION',
                        rating: attr.rating,
                        priceLevel: attr.priceLevel,
                        address: attr.address,
                        image: attr.image,
                        lat: attr.lat,
                        lng: attr.lng,
                        city: attr.city,
                        price: attr.price,
                        duration: attr.duration,
                        metadata: attr.metadata,
                    }
                })
                stats.places++
            }
        } catch (e: any) {
            stats.errors.push(`Attr ${attr.name}: ${e.message}`)
        }
    }

    // Migrate Hotels
    for (const hotel of NHA_TRANG_HOTELS) {
        try {
            const existing = await prisma.place.findFirst({ where: { name: hotel.name } })
            if (!existing) {
                await prisma.place.create({
                    data: {
                        name: hotel.name,
                        description: hotel.description,
                        type: 'HOTEL',
                        rating: hotel.rating,
                        priceLevel: 3, // Default or estimate
                        address: hotel.address,
                        image: hotel.image,
                        lat: hotel.lat,
                        lng: hotel.lng,
                        city: 'Nha Trang',
                        price: hotel.price,
                        metadata: {
                            relatedTo: hotel.relatedTo,
                            note: hotel.note,
                            distance: hotel.distance,
                            time: hotel.time
                        }
                    }
                })
                stats.places++
            }
        } catch (e: any) {
            stats.errors.push(`Hotel ${hotel.name}: ${e.message}`)
        }
    }

    revalidatePath('/admin')
    return { success: true, stats }
}
