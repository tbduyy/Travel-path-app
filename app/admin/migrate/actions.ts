
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
    // 5 Highlighted Attractions (Địa điểm nổi bật)
    {
        id: "nt-attr-1",
        name: "VinWonders Nha Trang",
        description: "Công viên VinWonders Nha Trang tọa lạc trên đảo Hòn Tre, được xem là thiên đường vui chơi – giải trí hàng đầu với hệ thống cáp treo vượt biển độc đáo và quần thể giải trí đẳng cấp quốc tế. Nơi đây hội tụ đa dạng trải nghiệm từ các trò chơi cảm giác mạnh, công viên nước sôi động, thủy cung kỳ thú đến khu vui chơi gia đình và những màn trình diễn ấn tượng. Phù hợp với mọi độ tuổi, VinWonders là điểm đến không thể bỏ qua trong hành trình khám phá Nha Trang.",
        image: "https://ik.imagekit.io/tvlk/blog/2022/09/vinwonders-nha-trang-1.jpg",
        rating: 4.9,
        priceLevel: 3,
        price: "880.000 VND/người",
        address: "Đảo Hòn Tre, Nha Trang",
        lat: 12.2215,
        lng: 109.2458,
        duration: "12-13 tiếng",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "nt-attr-2",
        name: "Tour 3 đảo Nha Trang",
        description: "Tour 3 đảo Nha Trang đưa du khách khám phá Hòn Mun – làng chài – Mini Beach, mang đến trải nghiệm trọn vẹn giữa thiên nhiên biển xanh trong lành. Bạn sẽ được tắm biển, lặn ngắm san hô rực rỡ tại Hòn Mun, tìm hiểu đời sống mộc mạc của ngư dân làng chài và thưởng thức hải sản tươi ngon. Hành trình kết thúc tại Mini Beach yên bình, nơi lý tưởng để thư giãn và tận hưởng nắng gió biển. Tour có hướng dẫn viên đồng hành và hỗ trợ đưa đón tận khách sạn, giúp chuyến đi thêm thuận tiện và thoải mái.",
        image: "https://statics.vinpearl.com/tour-3-dao-nha-trang-1_1629887556.jpg",
        rating: 4.7,
        priceLevel: 2,
        price: "450.000 VND/người",
        address: "Cảng Cầu Đá, Nha Trang",
        lat: 12.2023,
        lng: 109.2140,
        duration: "8-9 tiếng",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "nt-attr-3",
        name: "Quảng trường 2/4",
        description: "Quảng trường 2/4 tọa lạc tại trung tâm thành phố Nha Trang, Khánh Hòa, là biểu tượng du lịch sôi động và trái tim văn hóa của thành phố biển. Nổi bật với tháp Trầm Hương độc đáo, nơi đây là điểm dừng chân không thể bỏ qua để dạo bộ, thưởng thức ẩm thực, và tham gia các sự kiện, lễ hội lớn.",
        image: "https://local.vn/wp-content/uploads/2020/04/quang-truong-2-4-nha-trang-5.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Đường Trần Phú, Nha Trang",
        lat: 12.2388,
        lng: 109.1967,
        duration: "15-30 phút",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm", "#Văn hóa"] }
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
        metadata: { type: "NB", tags: ["#Địa điểm ẩm thực", "#Khám phá trải nghiệm"] }
    },
    {
        id: "nt-attr-5",
        name: "Hải sản Thanh Sương",
        description: "Hải sản Thanh Sương là quán hải sản nổi tiếng tại Nha Trang, được nhiều thực khách yêu thích nhờ hải sản tươi ngon, chế biến nhanh và chỉ sử dụng nguyên liệu trong ngày. Với mức giá hợp lý, đây là địa điểm lý tưởng để tụ họp bạn bè, ăn nhậu thoải mái mà không lo tốn kém.",
        image: "https://reviewnao.com/wp-content/uploads/2019/07/Hai-san-Thanh-Suong-Nha-Trang.jpg",
        rating: 4.4,
        priceLevel: 2,
        price: "100.000 - 300.000 VND",
        address: "21 Trần Phú, Nha Trang",
        lat: 12.2081,
        lng: 109.2150,
        duration: "30-45 phút",
        city: "Nha Trang",
        metadata: { type: "NB", tags: ["#Địa điểm ẩm thực", "#Khám phá trải nghiệm"] }
    },
    // Additional Attractions (Danh sách địa điểm du lịch)
    {
        id: "nt-attr-6",
        name: "Bảo Tàng Hải Dương Học",
        description: "Viện Hải dương học Nha Trang là điểm đến thú vị dành cho du khách yêu thích khám phá thế giới đại dương, nổi bật với Bảo tàng Hải dương học trưng bày nhiều mẫu vật quý và sinh vật biển sống, mang đến trải nghiệm vừa sinh động vừa giàu giá trị giáo dục, đồng thời là địa điểm check-in nổi tiếng được nhiều du khách yêu thích.",
        image: "https://vinwonders.com/wp-content/uploads/2023/04/vien-hai-duong-hoc-nha-trang-3.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "10.000 VND - 40.000 VND",
        address: "1 Cầu Đá, Nha Trang",
        lat: 12.2078,
        lng: 109.2144,
        duration: "1-2 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Điểm tham quan", "#Khám phá trải nghiệm"] }
    },
    {
        id: "nt-attr-7",
        name: "Đập Thủy Điện Am Chúa",
        description: "Hồ Am Chúa là một điểm đến thiên nhiên yên bình và thơ mộng của Nha Trang, mang vẻ đẹp rất khác so với những bãi biển hay hòn đảo quen thuộc. Nằm lặng lẽ giữa núi rừng và trời mây, hồ nước rộng lớn này đã trở thành địa điểm tham quan nổi tiếng của Khánh Hòa, thu hút du khách bởi không gian trong lành và cảnh sắc thanh bình.",
        image: "https://tuyendaikhanhhoa.vn/Portals/0/A%20HINH%20TIN%20BAI/THANG%204%20NAM%202022/am%20chua%202.jpg",
        rating: 4.3,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Diên Điền, Diên Khánh, Nha Trang",
        lat: 12.2687,
        lng: 109.0763,
        duration: "3-4 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "nt-attr-8",
        name: "Nhà Hát Đó",
        description: "Lấy cảm hứng từ cái đó – nông cụ dân gian quen thuộc của người Việt trong nghề đánh bắt cá tôm, Nhà hát Đó (Đó Theatre) được thiết kế như một chiếc đó khổng lồ, nổi bật trên bờ biển Bãi Tiên. Giữa không gian kiến trúc hiện đại xung quanh, công trình tạo nên sự giao thoa độc đáo giữa truyền thống và tương lai, mang đến những trải nghiệm nghệ thuật đ ậm bản sắc Việt nhưng vẫn hòa nhịp với nghệ thuật thế giới. Nhà hát Đó hứa hẹn trở thành điểm đến nghệ thuật không thể bỏ lỡ đối với du khách và cộng đồng nghệ sĩ trong và ngoài nước.",
        image: "https://vcdn1-dulich.vnecdn.net/2023/04/02/nha-hat-do-nha-trang-1-1680410046.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=K7P4l9Xyq2z5l5Xyq2z5l5",
        rating: 4.8,
        priceLevel: 3,
        price: "420.000 VND - 630.000 VND",
        address: "Vega City, Bãi Tiên, Nha Trang",
        lat: 12.2959,
        lng: 109.2135,
        duration: "3-4 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Điểm tham quan", "#Khám phá trải nghiệm"] }
    },
    // Dining (Địa điểm ăn uống)
    {
        id: "nt-attr-9",
        name: "Cơm gà Núi Một",
        description: "Cơm gà Núi Một Nha Trang là địa chỉ ẩm thực quen thuộc với thực khách nhờ sử dụng nguồn gà sạch, chất lượng cao. Dưới bàn tay của đội ngũ đầu bếp giàu kinh nghiệm, các món ăn được chế biến đậm đà, tròn vị, mang đến hương vị hấp dẫn và dễ gây nghiện cho người thưởng thức.",
        image: "https://cdn.justfly.vn/1200x630/media/f5/63/0d/17-09-2022/com-ga-nui-mot-2.jpg",
        rating: 4.4,
        priceLevel: 2,
        price: "30.000 VND - 450.000 VND",
        address: "Nha Trang",
        lat: 12.2470,
        lng: 109.1915,
        duration: "30-45 phút",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Nhà hàng"] }
    },
    {
        id: "nt-attr-10",
        name: "Bánh căn 51",
        description: "Bánh căn 51 là một trong những địa chỉ nức tiếng dành cho tín đồ bánh căn tại Nha Trang, tọa lạc trên đường Tô Hiến Thành. Dù chỉ là quán bình dân với vài bộ bàn ghế nhựa, không gian giản dị, nhưng lúc nào cũng đông khách. Nhờ hương vị thơm ngon, chất lượng ổn định, quán được nhiều thực khách ưu ái đánh giá là một trong những quán bánh căn ngon nhất Nha Trang.",
        image: "https://mia.vn/media/uploads/blog-du-lich/banh-can-51-to-hien-thanh-01-1636534289.jpg",
        rating: 4.5,
        priceLevel: 1,
        price: "20.000 VND - 150.000 VND",
        address: "51 Tô Hiến Thành, Nha Trang",
        lat: 12.2380,
        lng: 109.1930,
        duration: "20-30 phút",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Nhà hàng"] }
    },
    {
        id: "nt-attr-11",
        name: "Z Beach Nha Trang",
        description: "Z-Beach là điểm hẹn cực chill quen thuộc của giới trẻ Nha Trang, sở hữu không gian mở ngay trên bãi biển với quầy bar nhỏ, ghế lười sắc cam nổi bật và menu đồ uống hợp gu. Ban đêm, nơi đây trở nên sôi động với âm nhạc cuốn hút; ban ngày lại là góc sống ảo lý tưởng để chèo SUP đón bình minh hay thư thả ngắm hoàng hôn trên biển. Nhờ không gian phóng khoáng, gần gũi thiên nhiên và không khí trẻ trung, Z-Beach ngày càng được du khách trong và ngoài nước yêu thích khi ghé thăm Nha Trang.",
        image: "https://reviewnao.com/wp-content/uploads/2021/04/Z-Beach-Nha-Trang-1.jpg",
        rating: 4.6,
        priceLevel: 2,
        price: "40.000 VND - 2.400.000 VND",
        address: "Trần Phú, Nha Trang",
        lat: 12.2356,
        lng: 109.1970,
        duration: "1-2 tiếng",
        city: "Nha Trang",
        metadata: { type: "EXT", tags: ["#Bar-Pub ngoài trời"] }
    }
];

const NHA_TRANG_HOTELS = [
    // VinWonders Hotels
    { id: "h1", name: "Vinpearl Beachfront Nha Trang", price: "3.700.000 VND/phòng/ngày", description: "Bao gồm 2 vé vào Công Viên Giải Trí VinWonders cho 2 ngày", address: "Trần Phú", lat: 12.236, lng: 109.196, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/176949038.jpg?k=f8b2d8c3c1e2d4e8f8c8c8c8c8c8c8c8", rating: 5, note: "Giá hơi cao hơn mặt bằng chung nhưng đã bao gồm vé VinWonders 2N1Đ nên vẫn hợp lý, đồng thời thuộc nhóm khách sạn 5 sao tiện nghi hàng đầu tại Nha Trang.", distance: "4.5 km", time: "11 phút" },
    { id: "h2", name: "Khách sạn Dendro beachfront", price: "348.000 VND/ngày", description: "Khách sạn đối diện biển, giá bình dân", address: "Trần Phú", lat: 12.234, lng: 109.197, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/187974018.jpg?k=987654321", rating: 3.5, note: "Khách sạn nằm giữa trung tâm và VinWonders nên hơi bất tiện đi dạo trong trung tâm, bù lại đối diện biển, không gian thoáng và giá khá bình dân.", distance: "3.6 km", time: "7 phút" },
    { id: "h3", name: "Khách sạn Dubai Nha Trang", price: "280.000 VND/ngày", description: "Khách sạn giá rẻ trong trung tâm", address: "Trung tâm", lat: 12.240, lng: 109.192, relatedTo: ["VinWonders Nha Trang"], image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/123456789.jpg?k=111", rating: 3, note: "Vị trí khá xa VinWonders nên việc di chuyển chưa thật sự thuận tiện, bù lại khách sạn có mức giá rẻ và nằm trong trung tâm thành phố, phù hợp với du khách ưu tiên tiết kiệm chi phí.", distance: "5 km", time: "15 phút" },

    // Tour 3 đảo Hotels
    { id: "h4", name: "Khách sạn Dolphin Bay", price: "257.000 VND/ngày", description: "Gần trung tâm, giá ưu đãi", address: "Gần trung tâm", lat: 12.230, lng: 109.198, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/dolphin.jpg", rating: 3, note: "Khách sạn gần trung tâm và có mức giá ưu đãi nên thường nhanh hết phòng; bên cạnh đó, đánh giá của khách hàng về chất lượng phòng vẫn còn chưa đồng nhất.", distance: "1.7 km", time: "7 phút" },
    { id: "h5", name: "Khách sạn Brilliant Bay Nha Trang", price: "300.000 VND/ngày", description: "View biển đối diện thoáng đẹp", address: "Phạm Văn Đồng", lat: 12.270, lng: 109.200, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/brilliant.jpg", rating: 3.5, note: "Vị trí hơi xa trung tâm, bù lại sở hữu view biển đối diện thoáng đẹp.", distance: "3 km", time: "10 phút" },
    { id: "h6", name: "Khách sạn Palm Beach", price: "347.000 VND/ngày", description: "Gần trung tâm, thuận tiện", address: "Biệt Thự", lat: 12.232, lng: 109.197, relatedTo: ["Tour 3 đảo Nha Trang"], image: "https://example.com/palm.jpg", rating: 3.5, note: "Mức giá không quá nổi bật so với mặt bằng phân khúc, nhưng bù lại nằm gần trung tâm và thuận tiện di chuyển đến các điểm du lịch.", distance: "1.8 km", time: "6 phút" },

    // Quảng trường 2/4 Hotels
    { id: "h7", name: "Khách sạn Sun City", price: "338.000 VND/ngày", description: "Đối diện biển, gần quảng trường", address: "Tôn Đản", lat: 12.239, lng: 109.196, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/suncity.jpg", rating: 3.5, note: "Giá hơi nhỉnh so với mặt bằng chung và cần đặt trước (không hoàn hủy do phòng rất hot, nhanh kín), bù lại khách sạn đối diện biển và nằm gần quảng trường cùng các điểm du lịch.", distance: "250m", time: "1 phút" },
    { id: "h8", name: "Khách sạn LE SOLEIL", price: "360.000 VND/ngày", description: "Gần trung tâm, kèm bữa sáng", address: "Hùng Vương", lat: 12.237, lng: 109.195, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/lesoleil.jpg", rating: 3.5, note: "Mức giá không quá ưu đãi, nhưng có kèm bữa sáng miễn phí và vị trí gần trung tâm, thuận tiện di chuyển.", distance: "350m", time: "1 phút" },
    { id: "h9", name: "Khách sạn Nắng Biển - Sunny Sea", price: "266.000 VND/ngày", description: "Đối diện biển, giá rẻ", address: "Trần Phú", lat: 12.230, lng: 109.198, relatedTo: ["Quảng trường 2/4"], image: "https://example.com/sunnysea.jpg", rating: 3, note: "Do mức giá rẻ nên chất lượng chỉ ở mức cơ bản so với phân khúc, bù lại khách sạn có vị trí đối diện biển và gần các điểm du lịch.", distance: "950m", time: "3 phút" },

    // Nem Nướng Đặng Văn Quyên Hotels
    { id: "h10", name: "Khách sạn Mangolia", price: "245.000 VND/ngày", description: "Gần khu ăn uống và chợ", address: "Hùng Vương", lat: 12.246, lng: 109.193, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/mangolia.jpg", rating: 3, note: "Không nằm sát biển và không có view hướng biển, bù lại gần các khu ăn uống và chợ, thuận tiện đi lại.", distance: "210m", time: "1 phút" },
    { id: "h11", name: "Khách sạn CKD Nha Trang", price: "500.000 VND/ngày", description: "Giá trung bình cao, tiện nghi", address: "Pasteur", lat: 12.248, lng: 109.192, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/ckd.jpg", rating: 4, note: "Mức giá ở mức trung bình–cao, bù lại nằm gần khu ăn uống và có thể dễ dàng đi bộ.", distance: "140m", time: "1 phút" },
    { id: "h12", name: "Khách sạn Maika", price: "344.000 VND/ngày", description: "Gần điểm checkin, ăn uống", address: "Biệt Thự", lat: 12.240, lng: 109.195, relatedTo: ["Nem Nướng Đặng Văn Quyên"], image: "https://example.com/maika.jpg", rating: 3, note: "Không nằm sát biển và không có view hướng biển, bù lại gần các địa điểm checkin, ăn uống hot trend.", distance: "1km", time: "3 phút" },

    // Hải sản Thanh Sương Hotels
    { id: "h13", name: "Khách sạn Vạn Kim", price: "285.000 VND/ngày", description: "Giá ưu đãi, xa trung tâm", address: "Dã Tượng", lat: 12.210, lng: 109.210, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/vankim.jpg", rating: 2.5, note: "Không nằm sát biển và trung tâm thành phố, bù lại mức giá khá ưu đãi so với chất lượng.", distance: "3.2km", time: "8 phút" },
    { id: "h14", name: "Khách sạn Ruby Luxury", price: "391.000 VND/ngày", description: "Chất lượng tốt, giá hợp lý", address: "Hoàng Diệu", lat: 12.215, lng: 109.208, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/ruby.jpg", rating: 3.5, note: "Khách sạn có chất lượng tương đối tốt với mức giá hợp lý, tuy nhiên vị trí hơi xa trung tâm và các điểm tham quan nên việc di chuyển chưa thật sự thuận tiện.", distance: "2.1km", time: "4 phút" },
    { id: "h15", name: "Khách sạn Pearl City", price: "334.000 VND/ngày", description: "Gần điểm khám phá, xa biển", address: "Phước Long", lat: 12.205, lng: 109.200, relatedTo: ["Hải sản Thanh Sương"], image: "https://example.com/pearl.jpg", rating: 3, note: "Không nằm sát biển và xa trung tâm thành phố, bù lại gần các địa điểm khám phá du lịch.", distance: "3.6km", time: "8 phút" },
];

// DA NANG DATA
const DA_NANG_ATTRACTIONS = [
    // 5 Highlighted Attractions
    {
        id: "dn-attr-1",
        name: "Bà Nà Hills",
        description: "Bà Nà Hills là khu du lịch nổi tiếng nằm trên đỉnh Núi Chúa, thuộc địa phận thôn An Sơn, xã Hòa Ninh, huyện Hòa Vang, thành phố Đà Nẵng. Đây là nơi bạn sẽ tìm thấy Golden Bridge – Cầu Vàng cùng nhiều khu vui chơi, cáp treo, vườn hoa và phong cảnh đẹp như chốn bồng lai giữa trời mây",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
        rating: 4.8,
        priceLevel: 3,
        price: "Vé cáp treo riêng",
        address: "Thôn An Sơn, Hòa Ninh, Hòa Vang, Đà Nẵng",
        lat: 16.0131,
        lng: 107.9914,
        duration: "3-4 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "NB", tags: ["#Địa điểm vui chơi", "#Khám phá", "#Trải nghiệm"] }
    },
    {
        id: "dn-attr-2",
        name: "Cầu Rồng",
        description: "Cầu Rồng là một trong những biểu tượng nổi bật nhất của thành phố Đà Nẵng, bắc qua sông Hàn và nối liền trung tâm thành phố với bãi biển Mỹ Khê. Cây cầu gây ấn tượng với thiết kế hình rồng vàng uốn lượn, mang ý nghĩa thịnh vượng và phát triển. Điểm đặc biệt là vào tối cuối tuần, Cầu Rồng có màn phun lửa và phun nước, thu hút đông đảo du khách. Đây cũng là địa điểm check-in, dạo mát và ngắm cảnh sông Hàn rất được yêu thích, nhất là về đêm.",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0c4b8f?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Cầu Rồng, Sông Hàn, Đà Nẵng",
        lat: 16.0608,
        lng: 108.2271,
        duration: "30-45 phút",
        city: "Đà Nẵng",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời"] }
    },
    {
        id: "dn-attr-3",
        name: "Thìa Gỗ Restaurant",
        description: "Thìa Gỗ Restaurant là nhà hàng chuyên ẩm thực Việt Nam với phong cách mộc mạc, ấm cúng, nằm gần trung tâm thành phố Đà Nẵng. Không gian sử dụng chất liệu gỗ chủ đạo, mang lại cảm giác gần gũi và thư thái cho thực khách. Thìa Gỗ nổi bật với các món ăn thuần Việt được chế biến vừa vị, phù hợp cả du khách trong và ngoài nước. Đây là điểm dừng chân lý tưởng để trải nghiệm bữa ăn gia đình Việt giữa lòng thành phố biển.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 2,
        price: "100.000 - 300.000 VND",
        address: "Trung tâm Đà Nẵng",
        lat: 16.0544,
        lng: 108.2022,
        duration: "1 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "NB", tags: ["#Địa điểm ăn uống", "#Giải trí"] }
    },
    {
        id: "dn-attr-4",
        name: "Bãi biển Mỹ Khê",
        description: "Bãi biển Mỹ Khê là một trong những bãi biển đẹp và nổi tiếng nhất Đà Nẵng, gây ấn tượng với bờ cát trắng mịn, nước biển trong xanh và sóng êm. Bãi biển có không gian rộng rãi, sạch sẽ, phù hợp cho tắm biển, dạo mát và các hoạt động thể thao biển. Nhờ vị trí gần trung tâm thành phố, Mỹ Khê rất thuận tiện di chuyển và thu hút đông đảo du khách trong và ngoài nước.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        rating: 4.8,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Phước Mỹ, Sơn Trà, Đà Nẵng",
        lat: 16.0397,
        lng: 108.2441,
        duration: "1-2 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dn-attr-5",
        name: "Bán đảo Sơn Trà",
        description: "Bán đảo Sơn Trà là lá phổi xanh của thành phố Đà Nẵng, nổi bật với rừng nguyên sinh, núi cao và biển xanh hòa quyện. Nơi đây sở hữu nhiều điểm tham quan hấp dẫn như chùa Linh Ứng, đỉnh Bàn Cờ và các bãi biển hoang sơ. Sơn Trà không chỉ thích hợp để tham quan, ngắm cảnh mà còn là địa điểm lý tưởng cho du khách yêu thiên nhiên và trải nghiệm không gian yên bình, trong lành.",
        image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2069&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Bán đảo Sơn Trà, Đà Nẵng",
        lat: 16.1062,
        lng: 108.2703,
        duration: "4-5 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dn-attr-6",
        name: "Mì quảng Bà Mua",
        description: "Mỳ Quảng Bà Mua là quán ăn nổi tiếng tại Đà Nẵng, được nhiều người yêu thích nhờ hương vị mỳ Quảng đậm đà, chuẩn vị miền Trung. Món ăn gây ấn tượng với sợi mỳ vàng dai, nước dùng ít nhưng đậm, ăn kèm thịt, tôm, trứng và rau sống tươi ngon. Không gian quán sạch sẽ, phục vụ nhanh, phù hợp cho cả người địa phương lẫn du khách muốn trải nghiệm ẩm thực đặc trưng Đà Nẵng.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 1,
        price: "30.000 - 50.000 VND",
        address: "Đà Nẵng",
        lat: 16.0678,
        lng: 108.2208,
        duration: "30-45 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Địa điểm ăn uống"] }
    },
    // Additional attractions
    {
        id: "dn-attr-7",
        name: "Ngũ Hành Sơn",
        description: "Ngũ Hành Sơn là quần thể núi đá vôi nổi tiếng với hang động, chùa chiền và đài vọng cảnh. Đây là điểm đến hấp dẫn cho du khách yêu thích leo núi, khám phá văn hóa tâm linh và ngắm toàn cảnh thành phố từ trên cao.",
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 1,
        price: "40.000 - 60.000 VND",
        address: "Ngũ Hành Sơn, Đà Nẵng",
        lat: 16.0032,
        lng: 108.2625,
        duration: "2-4 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Điểm tham quan", "#Khám phá thiên nhiên & tâm linh"] }
    },
    {
        id: "dn-attr-8",
        name: "Hải Vân Quan",
        description: "Hải Vân Quan nằm trên đỉnh đèo Hải Vân, được mệnh danh là Thiên hạ đệ nhất hùng quan. Nơi đây gây ấn tượng với cảnh núi non hùng vĩ, biển trời giao hòa, rất được giới trẻ yêu thích chụp ảnh.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Đèo Hải Vân, Đà Nẵng",
        lat: 16.1973,
        lng: 108.1265,
        duration: "2-3 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Điểm tham quan ngoài trời", "#Check-in"] }
    },
    {
        id: "dn-attr-9",
        name: "Nhà thờ Con Gà Đà Nẵng",
        description: "Nhà thờ Con Gà là công trình kiến trúc mang phong cách Gothic châu Âu, nổi bật với gam màu hồng đặc trưng. Đây là điểm check-in quen thuộc của du khách khi tham quan trung tâm Đà Nẵng.",
        image: "https://images.unsplash.com/photo-1519217494740-66155a6da936?q=80&w=2070&auto=format&fit=crop",
        rating: 4.3,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Trung tâm Đà Nẵng",
        lat: 16.0678,
        lng: 108.2208,
        duration: "30-45 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Điểm tham quan", "#Check-in kiến trúc"] }
    },
    {
        id: "dn-attr-10",
        name: "Asia Park - Sun World Da Nang Wonders",
        description: "Asia Park là tổ hợp vui chơi hiện đại với nhiều trò giải trí, vòng quay Sun Wheel nổi tiếng và không gian phù hợp cho nhóm bạn, gia đình vào buổi chiều - tối.",
        image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2070&auto=format&fit=crop",
        rating: 4.4,
        priceLevel: 2,
        price: "Tùy trò chơi",
        address: "Đà Nẵng",
        lat: 16.0403,
        lng: 108.2252,
        duration: "3-5 tiếng",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Khu vui chơi giải trí"] }
    },
    {
        id: "dn-attr-11",
        name: "Bánh tráng cuốn thịt heo Trần",
        description: "Quán Trần nổi tiếng với món bánh tráng cuốn thịt heo hai đầu da, ăn kèm mắm nêm đậm đà. Đây là món đặc sản Đà Nẵng được nhiều du khách lựa chọn khi lần đầu ghé thăm thành phố.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 1,
        price: "50.000 - 200.000 VND",
        address: "Đà Nẵng",
        lat: 16.0544,
        lng: 108.2022,
        duration: "30-45 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Nhà hàng"] }
    },
    {
        id: "dn-attr-12",
        name: "Hải sản Bé Mặn",
        description: "Hải sản Bé Mặn là địa chỉ quen thuộc với thực đơn phong phú, hải sản tươi sống và giá cả khá bình dân. Phù hợp cho nhóm bạn hoặc gia đình muốn thưởng thức hải sản địa phương.",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2058&auto=format&fit=crop",
        rating: 4.4,
        priceLevel: 2,
        price: "100.000 - 500.000 VND",
        address: "Đà Nẵng",
        lat: 16.0544,
        lng: 108.2022,
        duration: "45-60 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Nhà hàng hải sản"] }
    },
    {
        id: "dn-attr-13",
        name: "Bún chả cá Bà Lữ",
        description: "Bún chả cá Bà Lữ là quán ăn lâu năm, nổi tiếng với nước dùng thanh ngọt và chả cá đậm vị. Đây là lựa chọn lý tưởng cho bữa ăn nhanh, đúng chất ẩm thực Đà Nẵng.",
        image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?q=80&w=2070&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 1,
        price: "25.000 - 50.000 VND",
        address: "Đà Nẵng",
        lat: 16.0678,
        lng: 108.2208,
        duration: "20-30 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Quán ăn địa phương"] }
    },
    {
        id: "dn-attr-14",
        name: "Boulevard Gelato & Coffee",
        description: "Boulevard Gelato & Coffee là quán kem – cà phê được giới trẻ yêu thích với không gian hiện đại và nhiều vị gelato mát lạnh, thích hợp nghỉ chân sau khi tham quan.",
        image: "https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?q=80&w=2072&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 2,
        price: "40.000 - 120.000 VND",
        address: "Đà Nẵng",
        lat: 16.0544,
        lng: 108.2022,
        duration: "30-60 phút",
        city: "Đà Nẵng",
        metadata: { type: "EXT", tags: ["#Quán cà phê", "#Tráng miệng"] }
    }
];

const DA_NANG_HOTELS = [
    // Bà Nà Hills Hotels
    { id: "dn-h1", name: "Ba Na Hills Sun World Family Home Villa", price: "300.000-400.000 VND/đêm", description: "Villa nằm ngay khu vực Bà Nà", address: "Bà Nà Hills", lat: 16.0131, lng: 107.9914, relatedTo: ["Bà Nà Hills"], image: "https://example.com/bana.jpg", rating: 3.5, note: "Một vài nhà nghỉ/villa nhỏ ở khu vực sát Bà Nà có phòng giá rẻ nhưng số lượng hạn chế, cần đặt sớm; nhớ kiểm tra xem giá đã gồm vé cáp treo hay chưa vì thường vé cáp treo tính riêng.", distance: "0-5 km", time: "0-15 phút" },
    { id: "dn-h2", name: "Tân Hòa Homestay", price: "400.000 VND/đêm", description: "Homestay gần Bà Nà", address: "Ngoại thành Đà Nẵng", lat: 16.0300, lng: 107.9700, relatedTo: ["Bà Nà Hills"], image: "https://example.com/tanhoa.jpg", rating: 3, note: "Giá rẻ, phòng cơ bản sạch sẽ phù hợp khách du lịch tiết kiệm; buổi tối và dịch vụ hạn chế, cần hỏi thêm về chỗ để xe nếu mang đồ lớn.", distance: "20-25 km", time: "35–50 phút" },
    { id: "dn-h3", name: "IKIGAI Dorm Hostel", price: "350.000 VND/đêm", description: "Hostel ở trung tâm Đà Nẵng", address: "Trung tâm Đà Nẵng", lat: 16.0544, lng: 108.2022, relatedTo: ["Bà Nà Hills"], image: "https://example.com/ikigai.jpg", rating: 3.5, note: "Hostel phù hợp nếu bạn đi nhóm/du lịch bụi (rẻ nhất là giường dorm). Tuy nhiên phải di chuyển quãng đường khá xa tới Bà Nà (nên tính phí/ thời gian đi lại, có thể cần dậy sớm để kịp cáp treo).", distance: "25 km", time: "40 phút" },

    // Cầu Rồng Hotels
    { id: "dn-h4", name: "Dragon View Riverfront Hotel", price: "350.000–450.000 VND/đêm", description: "Khách sạn sát sông Hàn", address: "Sông Hàn", lat: 16.0608, lng: 108.2271, relatedTo: ["Cầu Rồng"], image: "https://example.com/dragonview.jpg", rating: 3.5, note: "Khách sạn nhỏ, vị trí sát sông Hàn và Cầu Rồng, thuận tiện xem phun lửa – phun nước cuối tuần; phòng ở mức cơ bản, nên đặt sớm vào thứ 6-7.", distance: "0.3 km", time: "3-5 phút đi bộ" },
    { id: "dn-h5", name: "Satya Danang Hotel", price: "400.000–550.000 VND/đêm", description: "Khách sạn trung tâm gần chợ Hàn", address: "Trung tâm", lat: 16.0544, lng: 108.2022, relatedTo: ["Cầu Rồng", "Thìa Gỗ Restaurant"], image: "https://example.com/satya.jpg", rating: 3.5, note: "Khách sạn trung tâm, gần chợ Hàn và nhiều quán ăn; thuận tiện đi bộ ăn uống – tham quan, tuy nhiên cuối tuần giá thường cao hơn.", distance: "0.6 km", time: "7-10 phút đi bộ" },
    { id: "dn-h6", name: "Sanouva Danang Hotel", price: "350.000-500.000 VND/đêm", description: "Khách sạn trung tâm, tiết kiệm", address: "Trung tâm", lat: 16.0544, lng: 108.2022, relatedTo: ["Cầu Rồng", "Thìa Gỗ Restaurant", "Bãi biển Mỹ Khê"], image: "https://example.com/sanouva.jpg", rating: 3, note: "Phù hợp du lịch tiết kiệm nhưng vẫn ở trung tâm; phòng sạch, tiện nghi ổn, không gian yên tĩnh, tuy nhiên không có view sông.", distance: "0.8 km", time: "10 phút đi bộ" },

    // Thìa Gỗ / Bãi biển Mỹ Khê Hotels
    { id: "dn-h7", name: "Seahorse Han Market Hotel", price: "300.000-400.000 VND/đêm", description: "Gần chợ Hàn, giá mềm", address: "Chợ Hàn", lat: 16.0544, lng: 108.2022, relatedTo: ["Thìa Gỗ Restaurant", "Bãi biển Mỹ Khê"], image: "https://example.com/seahorse.jpg", rating: 3, note: "Giá mềm, gần chợ Hàn và khu ăn uống địa phương; thích hợp sinh viên/du lịch bụi, phòng nhỏ và nhanh hết vào mùa cao điểm.", distance: "0.6 km", time: "7-9 phút đi bộ" },
    { id: "dn-h8", name: "Hydra Boutique Hotel", price: "400.000-600.000 VND/đêm", description: "Khách sạn gần biển Mỹ Khê", address: "Mỹ Khê", lat: 16.0397, lng: 108.2441, relatedTo: ["Bãi biển Mỹ Khê"], image: "https://example.com/hydra.jpg", rating: 4, note: "Vị trí rất gần biển, phù hợp khách thích tắm biển mỗi sáng; giá thường cao vào cuối tuần và mùa du lịch.", distance: "0.4 km", time: "5 phút đi bộ" },
    { id: "dn-h9", name: "Memory Hotel & Apartment", price: "350.000-500.000 VND/đêm", description: "Khách sạn gần biển", address: "Mỹ Khê", lat: 16.0397, lng: 108.2441, relatedTo: ["Bãi biển Mỹ Khê"], image: "https://example.com/memory.jpg", rating: 3.5, note: "Tọa lạc gần biển và các quán ăn ven đường; phòng rộng hơn tiêu chuẩn, phù hợp gia đình hoặc nhóm nhỏ.", distance: "0.6 km", time: "7-9 phút đi bộ" },

    // Bán đảo Sơn Trà Hotels
    { id: "dn-h10", name: "Son Tra Resort & Spa", price: "1.500.000-2.500.000 VND/đêm", description: "Resort 4 sao trên Sơn Trà", address: "Bán đảo Sơn Trà", lat: 16.1062, lng: 108.2703, relatedTo: ["Bán đảo Sơn Trà"], image: "https://example.com/sontra.jpg", rating: 5, note: "Resort 4⭐ ngay trên Sơn Trà, view biển/rừng đẹp; giá cao hơn mặt bằng trung tâm Đà Nẵng nhưng rất phù hợp để nghỉ dưỡng và khám phá thiên nhiên.", distance: "0 km", time: "0 phút" },
    { id: "dn-h11", name: "Green Plaza Boutique Hotel & Spa", price: "600.000-900.000 VND/đêm", description: "Khách sạn gần Sơn Trà", address: "Khu Sơn Trà", lat: 16.1000, lng: 108.2600, relatedTo: ["Bán đảo Sơn Trà"], image: "https://example.com/greenplaza.jpg", rating: 4, note: "Vị trí gần bán đảo, dễ di chuyển tới các điểm tham quan Sơn Trà; giá hợp lý hơn resort nhưng vẫn đầy đủ tiện nghi.", distance: "3-4 km", time: "7-10 phút" },
    { id: "dn-h12", name: "The Ocean Villas & Hotel", price: "800.000-1.300.000 VND/đêm", description: "Khách sạn gần biển và Sơn Trà", address: "Sơn Trà", lat: 16.0900, lng: 108.2650, relatedTo: ["Bán đảo Sơn Trà"], image: "https://example.com/oceanvillas.jpg", rating: 4, note: "Gần bãi biển và vào bán đảo Sơn Trà; thích hợp khách muốn kết hợp tắm biển + tham quan Sơn Trà; giá trung bình, phòng rộng rãi.", distance: "2-3 km", time: "5-8 phút" },
    { id: "dn-h13", name: "Homestay Thủy Biều", price: "400.000-700.000 VND/đêm", description: "Homestay yên tĩnh gần Sơn Trà", address: "Thủy Biều", lat: 16.0850, lng: 108.2580, relatedTo: ["Bán đảo Sơn Trà"], image: "https://example.com/thuyybieu.jpg", rating: 3.5, note: "Các homestay/villa nhỏ ở Thủy Biều có giá mềm, yên tĩnh, gần bán đảo; phù hợp du khách thích trải nghiệm không gian địa phương và gần thiên nhiên.", distance: "3-5 km", time: "8-12 phút" },

    // Mì quảng Bà Mua Hotels
    { id: "dn-h14", name: "Samdi Hotel Da Nang", price: "350.000 VND/đêm", description: "Khách sạn giá rẻ", address: "Trung tâm", lat: 16.0678, lng: 108.2208, relatedTo: ["Mì quảng Bà Mua"], image: "https://example.com/samdi.jpg", rating: 3, note: "Lựa chọn giá rẻ, phòng tiện nghi cơ bản, phù hợp chuyến du lịch ngắn ngủi; nên đặt sớm vào mùa cao điểm.", distance: "1.5-2 km", time: "6-10 phút" },
    { id: "dn-h15", name: "La Maison Des Délices Hotel & Apartment", price: "450.000 VND/đêm", description: "Apartment thoáng rộng", address: "Trung tâm", lat: 16.0600, lng: 108.2150, relatedTo: ["Mì quảng Bà Mua"], image: "https://example.com/lamaison.jpg", rating: 3.5, note: "Phòng/apartment thoáng, phù hợp nhóm bạn hoặc gia đình nhỏ; vị trí gần trung tâm thành phố.", distance: "1.8 km", time: "7-10 phút" },
    { id: "dn-h16", name: "Khởi Nguồn Hostel", price: "400.000 VND/đêm", description: "Hostel giá rẻ", address: "Trung tâm", lat: 16.0650, lng: 108.2180, relatedTo: ["Mì quảng Bà Mua"], image: "https://example.com/khoinquon.jpg", rating: 3, note: "Giá rất mềm, phù hợp du lịch bụi; phòng kiểu hostel/guesthouse nên tiện nghi cơ bản.", distance: "1 km", time: "5-7 phút" }
];

// DA LAT DATA
const DA_LAT_ATTRACTIONS = [
    {
        id: "dl-attr-1",
        name: "Quảng trường Lâm Viên",
        description: "Được coi là trái tim của thành phố, nơi đây nổi bật với hai công trình kiến trúc bằng kính khổng lồ mang hình dáng nụ hoa Atiso và đóa hoa Dã Quỳ. Đây là điểm check-in không thể bỏ qua, nằm ngay cạnh Hồ Xuân Hương thơ mộng, nơi du khách có thể đi dạo hoặc đạp vịt ngắm cảnh.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Phường 10, Thành phố Đà Lạt, Lâm Đồng",
        lat: 11.9404,
        lng: 108.4383,
        duration: "45-60 phút",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dl-attr-2",
        name: "Chợ Đêm Đà Lạt",
        description: "Thiên đường ẩm thực đường phố và mua sắm sôi động nhất về đêm tại Đà Lạt. Du khách nhất định phải thử các món đặc sản như bánh tráng nướng, sữa đậu nành nóng, khoai nướng và mua sắm các sản phẩm len thủ công làm quà.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 1,
        price: "Tùy mua sắm",
        address: "Đường Nguyễn Thị Minh Khai, Phường 1, Thành phố Đà Lạt",
        lat: 11.9416,
        lng: 108.4367,
        duration: "1-2 tiếng",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Mua sắm", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dl-attr-3",
        name: "Ga Đà Lạt",
        description: "Đây là nhà ga cổ nhất tại Việt Nam và Đông Dương, mang đậm kiến trúc Pháp với ba mái hình chóp tượng trưng cho đỉnh núi Langbiang. Du khách có thể chụp ảnh cùng những toa tàu cổ màu đỏ cam và trải nghiệm chuyến tàu ngắn đến Trại Mát.",
        image: "https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?q=80&w=2070&auto=format&fit=crop",
        rating: 4.4,
        priceLevel: 1,
        price: "Vé tàu riêng",
        address: "Số 01 Quang Trung, Phường 10, Thành phố Đà Lạt",
        lat: 11.9380,
        lng: 108.4420,
        duration: "45-90 phút",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm", "#Văn hóa", "#Kiến trúc"] }
    },
    {
        id: "dl-attr-4",
        name: "Quán Lẩu Gà Lá É Tao Ngộ",
        description: "Quán ăn trứ danh mà bất kỳ du khách nào cũng muốn ghé qua để thưởng thức hương vị lẩu gà ngọt thanh hòa quyện cùng vị cay nồng của ớt hiểm và mùi thơm đặc trưng của lá é. Đây là món ăn cực kỳ phù hợp với không khí se lạnh của phố núi.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        priceLevel: 2,
        price: "150.000 - 300.000 VND",
        address: "Số 05 Ba Tháng Tư, Phường 3, Thành phố Đà Lạt",
        lat: 11.9450,
        lng: 108.4400,
        duration: "1-1.5 tiếng",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm ẩm thực", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dl-attr-5",
        name: "Đồi Chè Cầu Đất",
        description: "Không gian xanh mướt của những đồi chè trải dài tận chân trời kết hợp với các trụ điện gió hiện đại tạo nên khung cảnh như châu Âu. Đây cũng là địa điểm săn mây lý tưởng nhất Đà Lạt vào sáng sớm (khoảng 5h30 - 6h30).",
        image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=2132&auto=format&fit=crop",
        rating: 4.8,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Thôn Xuân Thọ, xã Trạm Hành, Thành phố Đà Lạt",
        lat: 11.9800,
        lng: 108.4900,
        duration: "1-2 tiếng",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dl-attr-6",
        name: "Khu du lịch Thác Datanla",
        description: "Điểm đến dành cho những người yêu thích phiêu lưu với hệ thống xe trượt (Alpine Coaster) băng qua rừng thông dài nhất Đông Nam Á. Ngoài ra, du khách còn có thể trải nghiệm đu dây mạo hiểm High Rope Course hoặc ngắm dòng thác đổ hùng vĩ.",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 2,
        price: "Vé tham quan + trò chơi",
        address: "Quốc lộ 20, Đèo Prenn, Phường 3, Thành phố Đà Lạt",
        lat: 11.9038,
        lng: 108.4485,
        duration: "1-2.5 tiếng",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Khám phá trải nghiệm"] }
    },
    {
        id: "dl-attr-7",
        name: "Tiệm Cà Phê Túi Mơ To",
        description: "Một trong những quán cà phê nổi tiếng nhất Đà Lạt với khu vườn cúc họa mi trắng muốt và ngôi nhà gỗ phong cách vintage. Quán nằm trên đồi cao, mang đến tầm nhìn bao trọn thung lũng và những nhà lồng trồng hoa lung linh về đêm.",
        image: "https://images.unsplash.com/photo-1501427708076-f5fa3c0d3e90?q=80&w=2064&auto=format&fit=crop",
        rating: 4.7,
        priceLevel: 2,
        price: "50.000 - 150.000 VND",
        address: "Hẻm 31 Sào Nam, Phường 11, Thành phố Đà Lạt",
        lat: 11.9500,
        lng: 108.4350,
        duration: "1-1.5 tiếng",
        city: "Đà Lạt",
        metadata: { type: "NB", tags: ["#Địa điểm tham quan ngoài trời", "#Ẩm thực", "#Trải nghiệm"] }
    }
];

const DA_LAT_HOTELS = [
    // Quảng trường Lâm Viên Hotels
    { id: "dl-h1", name: "S79 Khai Ngọc Hotel", price: "340.000 VND/đêm", description: "Gần trung tâm, đi bộ được", address: "Trung tâm Đà Lạt", lat: 11.9404, lng: 108.4383, relatedTo: ["Quảng trường Lâm Viên"], image: "https://example.com/s79.jpg", rating: 3.5, note: "Vị trí cực gần trung tâm, phù hợp cho người muốn đi bộ ra quảng trường. Tuy nhiên, vì gần đường lớn nên có thể hơi ồn vào giờ cao điểm.", distance: "700m", time: "2 phút" },
    { id: "dl-h2", name: "Khách sạn Anna Sương", price: "350.000 VND/đêm", description: "Gần quảng trường", address: "Trung tâm Đà Lạt", lat: 11.9380, lng: 108.4400, relatedTo: ["Quảng trường Lâm Viên"], image: "https://example.com/anna.jpg", rating: 3.5, note: "Khách sạn thoải mái gần trung tâm.", distance: "1.5km", time: "5 phút" },

    // Chợ Đêm Đà Lạt Hotels
    { id: "dl-h3", name: "Happy Day 2 Guesthouse", price: "300.000 VND/đêm", description: "Sát chợ đêm", address: "Nguyễn Thị Minh Khai", lat: 11.9416, lng: 108.4367, relatedTo: ["Chợ Đêm Đà Lạt"], image: "https://example.com/happyday.jpg", rating: 3, note: "Chỉ vài bước chân là đến chợ, cực kỳ tiện lợi để ăn đêm. Nên đặt phòng sớm vì vị trí vàng này thường nhanh hết chỗ.", distance: "150m", time: "2 phút đi bộ" },
    { id: "dl-h4", name: "QA Hotel", price: "300.000 VND/đêm", description: "Gần chợ đêm", address: "Gần chợ Đà Lạt", lat: 11.9420, lng: 108.4370, relatedTo: ["Chợ Đêm Đà Lạt"], image: "https://example.com/qa.jpg", rating: 3, note: "Khu vực này thường kẹt xe vào cuối tuần, khó bắt taxi tận cửa.", distance: "150m", time: "2 phút đi bộ" },

    // Ga Đà Lạt Hotels
    { id: "dl-h5", name: "Winterfell Hotel", price: "210.000 VND/đêm", description: "Gần ga Đà Lạt", address: "Gần ga", lat: 11.9360, lng: 108.4450, relatedTo: ["Ga Đà Lạt"], image: "https://example.com/winterfell.jpg", rating: 3, note: "Giá rẻ, tiện nghi cơ bản.", distance: "1.7km", time: "5-7 phút" },
    { id: "dl-h6", name: "Windy Hill Homestay", price: "250.000 VND/đêm", description: "Homestay view đồi", address: "Đà Lạt", lat: 11.9350, lng: 108.4480, relatedTo: ["Ga Đà Lạt"], image: "https://example.com/windyhill.jpg", rating: 3.5, note: "View đồi núi thoáng đãng. Vì là homestay nên không gian sẽ gần gũi, nhưng cần kiểm tra kỹ đường vào vì có thể có dốc cao.", distance: "2km", time: "6-8 phút" },

    // Lẩu Gà Lá É Hotels
    { id: "dl-h7", name: "Pontus Hotel", price: "340.000 VND/đêm", description: "Gần trung tâm", address: "Trung tâm Đà Lạt", lat: 11.9430, lng: 108.4390, relatedTo: ["Quán Lẩu Gà Lá É Tao Ngộ"], image: "https://example.com/pontus.jpg", rating: 3.5, note: "Khách sạn tiện nghi tốt.", distance: "1.4km", time: "5 phút" },
    { id: "dl-h8", name: "The Manor Villas", price: "500.000 VND/đêm", description: "Villa cao cấp", address: "Đà Lạt", lat: 11.9480, lng: 108.4450, relatedTo: ["Quán Lẩu Gà Lá É Tao Ngộ"], image: "https://example.com/manor.jpg", rating: 4, note: "Phân khúc cao cấp hơn, không gian sang trọng và riêng tư. Phù hợp cho khách muốn nghỉ dưỡng sau khi thưởng thức đặc sản.", distance: "2.5km", time: "8-10 phút" },

    // Đồi Chè Cầu Đất Hotels
    { id: "dl-h9", name: "Rainbow Homestay Cầu Đất", price: "240.000 VND/đêm", description: "Sát đồi chè", address: "Cầu Đất", lat: 11.9800, lng: 108.4900, relatedTo: ["Đồi Chè Cầu Đất"], image: "https://example.com/rainbow.jpg", rating: 3.5, note: "Vị trí tuyệt vời để săn mây sáng sớm.", distance: "200m", time: "3 phút đi bộ" },
    { id: "dl-h10", name: "Mộc Trà Farm", price: "450.000 VND/đêm", description: "Farm view đồi chè", address: "Cầu Đất", lat: 11.9750, lng: 108.4850, relatedTo: ["Đồi Chè Cầu Đất"], image: "https://example.com/moctra.jpg", rating: 4, note: "Không gian farm đẹp, yên tĩnh.", distance: "4km", time: "10 phút" },

    // Thác Datanla Hotels
    { id: "dl-h11", name: "Hoàng Gia Trang Homestay", price: "500.000 VND/đêm", description: "Gần thác Datanla", address: "Gần thác", lat: 11.9050, lng: 108.4500, relatedTo: ["Khu du lịch Thác Datanla"], image: "https://example.com/hoanggiatrang.jpg", rating: 4, note: "Homestay cao cấp gần thác.", distance: "1.5km", time: "5 phút" },
    { id: "dl-h12", name: "Nature Hotel", price: "490.000 VND/đêm", description: "Khách sạn gần thiên nhiên", address: "Đà Lạt", lat: 11.9000, lng: 108.4550, relatedTo: ["Khu du lịch Thác Datanla"], image: "https://example.com/nature.jpg", rating: 3.5, note: "Khách sạn yên tĩnh, gần rừng thông.", distance: "5km", time: "12-15 phút" },

    // Túi Mơ To Hotels
    { id: "dl-h13", name: "Mây Bách Đà Lạt", price: "480.000 VND/đêm", description: "View đồi cao", address: "Đà Lạt", lat: 11.9480, lng: 108.4340, relatedTo: ["Tiệm Cà Phê Túi Mơ To"], image: "https://example.com/maybach.jpg", rating: 4, note: "View đẹp, không gian thoáng đãng.", distance: "1.3km", time: "5 phút" },
    { id: "dl-h14", name: "Lê Homestay", price: "350.000 VND/đêm", description: "Homestay ấm cúng", address: "Đà Lạt", lat: 11.9470, lng: 108.4330, relatedTo: ["Tiệm Cà Phê Túi Mơ To"], image: "https://example.com/lehomestay.jpg", rating: 3.5, note: "Homestay giá tốt, view đẹp.", distance: "1.5km", time: "6-8 phút" }
];

// HO CHI MINH CITY DATA
const HCM_ATTRACTIONS = [
    {
        id: "hcm-attr-1",
        name: "Dinh Độc Lập",
        description: "Dinh Độc Lập là biểu tượng lịch sử quan trọng của Việt Nam, nơi ghi dấu nhiều sự kiện then chốt trong giai đoạn chiến tranh và thống nhất đất nước. Công trình mang kiến trúc hoài cổ, giữ nguyên nhiều không gian nội thất nguyên bản, phù hợp để tìm hiểu lịch sử và văn hóa Sài Gòn.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 1,
        price: "40.000 - 90.000 VND",
        address: "TP. Hồ Chí Minh",
        lat: 10.7769,
        lng: 106.6955,
        duration: "45-60 phút",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch văn hóa"] }
    },
    {
        id: "hcm-attr-2",
        name: "Bảo tàng Chứng tích Chiến tranh",
        description: "Bảo tàng trưng bày hình ảnh và hiện vật về chiến tranh Việt Nam với chiều sâu lịch sử và giá trị nhân văn, là điểm đến không thể bỏ qua đối với du khách muốn hiểu rõ hơn về quá khứ của đất nước.",
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        priceLevel: 1,
        price: "40.000 - 120.000 VND",
        address: "TP. Hồ Chí Minh",
        lat: 10.7797,
        lng: 106.6919,
        duration: "60 phút",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch văn hóa"] }
    },
    {
        id: "hcm-attr-3",
        name: "Chợ Bến Thành",
        description: "Chợ Bến Thành là biểu tượng lâu đời của Sài Gòn, nổi bật với hoạt động mua sắm, ẩm thực và không khí nhộn nhịp suốt cả ngày. Đây là nơi lý tưởng để trải nghiệm đời sống địa phương và mua quà lưu niệm.",
        image: "https://images.unsplash.com/photo-1578923438107-1d786e5a2555?q=80&w=2070&auto=format&fit=crop",
        rating: 4.3,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Quận 1, TP. Hồ Chí Minh",
        lat: 10.7720,
        lng: 106.6981,
        duration: "30-60 phút",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch mua sắm", "#Giải trí"] }
    },
    {
        id: "hcm-attr-4",
        name: "Nhà thờ Đức Bà Sài Gòn",
        description: "Nhà thờ Đức Bà mang kiến trúc Pháp cổ đặc trưng, là điểm tham quan và check-in nổi tiếng tại trung tâm TP. Hồ Chí Minh, thu hút đông đảo du khách trong và ngoài nước.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 1,
        price: "Miễn phí",
        address: "Quận 1, TP. Hồ Chí Minh",
        lat: 10.7797,
        lng: 106.6990,
        duration: "20-30 phút",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch khám phá", "#Trải nghiệm"] }
    },
    {
        id: "hcm-attr-5",
        name: "Phố đi bộ Bùi Viện",
        description: "Phố đi bộ Bùi Viện là trung tâm giải trí về đêm của TP. Hồ Chí Minh với quán bar, cà phê, âm nhạc đường phố và không khí sôi động, đặc biệt phù hợp với du khách trẻ.",
        image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=2073&auto=format&fit=crop",
        rating: 4.4,
        priceLevel: 2,
        price: "Miễn phí",
        address: "Quận 1, TP. Hồ Chí Minh",
        lat: 10.7676,
        lng: 106.6918,
        duration: "1-2 giờ",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch mua sắm", "#Giải trí"] }
    },
    {
        id: "hcm-attr-6",
        name: "Landmark 81",
        description: "Landmark 81 là tòa nhà cao nhất Việt Nam, nổi bật với đài quan sát SkyView, khu mua sắm, ẩm thực và giải trí cao cấp, mang đến trải nghiệm hiện đại giữa lòng thành phố.",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop",
        rating: 4.6,
        priceLevel: 3,
        price: "250.000 - 400.000 VND",
        address: "Bình Thạnh, TP. Hồ Chí Minh",
        lat: 10.7946,
        lng: 106.7218,
        duration: "1-2 giờ",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch mua sắm", "#Giải trí"] }
    },
    {
        id: "hcm-attr-7",
        name: "Vị Sài Gòn Restaurant & Café",
        description: "Vị Sài Gòn là nhà hàng Việt truyền thống nổi bật tại TP. Hồ Chí Minh, chuyên phục vụ các món ăn thuần Việt được chế biến tinh tế, giữ trọn hương vị truyền thống. Không gian mang đậm nét văn hóa Sài Gòn xưa, phù hợp cho trải nghiệm ẩm thực và tiếp khách.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        rating: 4.5,
        priceLevel: 2,
        price: "250.000 - 600.000 VND",
        address: "TP. Hồ Chí Minh",
        lat: 10.7756,
        lng: 106.7019,
        duration: "60-90 phút",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch ẩm thực"] }
    },
    {
        id: "hcm-attr-8",
        name: "Khu du lịch Suối Tiên",
        description: "Suối Tiên là khu công viên giải trí quy mô lớn, nổi bật với các khu vui chơi theo chủ đề dân gian Việt Nam kết hợp trò chơi cảm giác mạnh, khu tham quan và giải trí phù hợp cho cả gia đình, nhóm bạn.",
        image: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=2070&auto=format&fit=crop",
        rating: 4.3,
        priceLevel: 2,
        price: "150.000 - 400.000 VND",
        address: "Quận 9, TP. Hồ Chí Minh",
        lat: 10.8897,
        lng: 106.7919,
        duration: "Nửa ngày - 1 ngày",
        city: "Hồ Chí Minh",
        metadata: { type: "NB", tags: ["#Du lịch khám phá", "#Trải nghiệm"] }
    }
];

const HCM_HOTELS = [
    // Dinh Độc Lập Hotels
    { id: "hcm-h1", name: "New World Saigon Hotel", price: "3.500.000 - 4.500.000 VND/đêm", description: "Khách sạn cao cấp", address: "Quận 1", lat: 10.7750, lng: 106.6970, relatedTo: ["Dinh Độc Lập"], image: "https://example.com/newworld.jpg", rating: 5, note: "Khách sạn cao cấp, dịch vụ tốt, phù hợp nghỉ dưỡng kết hợp tham quan.", distance: "2 km", time: "7 phút" },
    { id: "hcm-h2", name: "La Siesta Premium Saigon", price: "3.000.000 VND/đêm", description: "Thiết kế sang trọng", address: "Quận 1", lat: 10.7760, lng: 106.6975, relatedTo: ["Dinh Độc Lập"], image: "https://example.com/lasiesta.jpg", rating: 4.5, note: "Thiết kế sang trọng, vị trí trung tâm.", distance: "1.8 km", time: "6 phút" },
    { id: "hcm-h3", name: "Edoya Hotel Ben Thanh", price: "1.200.000 VND/đêm", description: "Giá hợp lý", address: "Quận 1", lat: 10.7745, lng: 106.6965, relatedTo: ["Dinh Độc Lập"], image: "https://example.com/edoya.jpg", rating: 3.5, note: "Giá hợp lý, tiện tham quan nhiều điểm lịch sử.", distance: "450 m", time: "5 phút đi bộ" },

    // Bảo tàng Chứng tích Chiến tranh Hotels
    { id: "hcm-h4", name: "Silverland Sakyo Hotel & Spa", price: "3.000.000 VND/đêm", description: "Phong cách Nhật Bản", address: "Quận 1", lat: 10.7785, lng: 106.6930, relatedTo: ["Bảo tàng Chứng tích Chiến tranh"], image: "https://example.com/silverland.jpg", rating: 4.5, note: "Phong cách Nhật Bản, dịch vụ tốt.", distance: "1.5 km", time: "5 phút" },
    { id: "hcm-h5", name: "Liberty Central Saigon Riverside", price: "2.000.000 VND/đêm", description: "View sông", address: "Quận 1", lat: 10.7770, lng: 106.7010, relatedTo: ["Bảo tàng Chứng tích Chiến tranh"], image: "https://example.com/liberty.jpg", rating: 4, note: "View sông, tiện di chuyển khu trung tâm.", distance: "2 km", time: "7 phút" },
    { id: "hcm-h6", name: "Amanaki Saigon Boutique Hotel", price: "1.000.000 VND/đêm", description: "Giá mềm", address: "Quận 1", lat: 10.7730, lng: 106.6890, relatedTo: ["Bảo tàng Chứng tích Chiến tranh"], image: "https://example.com/amanaki.jpg", rating: 3.5, note: "Giá mềm, phù hợp du lịch tiết kiệm.", distance: "3 km", time: "10 phút" },

    // Chợ Bến Thành Hotels
    { id: "hcm-h7", name: "M Village Hotel Nguyen Du", price: "2.500.000 VND/đêm", description: "Thiết kế hiện đại", address: "Quận 1", lat: 10.7710, lng: 106.6995, relatedTo: ["Chợ Bến Thành"], image: "https://example.com/mvillage.jpg", rating: 4, note: "Thiết kế hiện đại, phù hợp khách trẻ.", distance: "1.2 km", time: "7 phút" },
    { id: "hcm-h8", name: "GRAND HOTEL du LAC Boutique Saigon", price: "1.500.000 VND/đêm", description: "Sát chợ", address: "Quận 1", lat: 10.7722, lng: 106.6985, relatedTo: ["Chợ Bến Thành"], image: "https://example.com/dulac.jpg", rating: 4, note: "Vị trí sát chợ, cực kỳ tiện mua sắm.", distance: "300 m", time: "3 phút đi bộ" },
    { id: "hcm-h9", name: "The Rixx Saigon Central", price: "1.500.000 VND/đêm", description: "Lưu trú ngắn ngày", address: "Quận 1", lat: 10.7718, lng: 106.6990, relatedTo: ["Chợ Bến Thành"], image: "https://example.com/rixx.jpg", rating: 3.5, note: "Phù hợp lưu trú ngắn ngày.", distance: "400 m", time: "5 phút" },

    // Nhà thờ Đức Bà Hotels
    { id: "hcm-h10", name: "InterContinental Saigon", price: "3.500.000 VND/đêm", description: "Khách sạn cao cấp", address: "Quận 1", lat: 10.7793, lng: 106.6995, relatedTo: ["Nhà thờ Đức Bà Sài Gòn"], image: "https://example.com/intercontinental.jpg", rating: 5, note: "Khách sạn cao cấp, vị trí trung tâm.", distance: "450 m", time: "5 phút đi bộ" },
    { id: "hcm-h11", name: "Caravelle Saigon", price: "3.000.000 VND/đêm", description: "Khách sạn lịch sử", address: "Quận 1", lat: 10.7785, lng: 106.7000, relatedTo: ["Nhà thờ Đức Bà Sài Gòn"], image: "https://example.com/caravelle.jpg", rating: 4.5, note: "Phù hợp khách du lịch & công tác.", distance: "550 m", time: "7 phút đi bộ" },
    { id: "hcm-h12", name: "Rex Hotel Saigon", price: "3.000.000 VND/đêm", description: "Khách sạn lâu đời", address: "Quận 1", lat: 10.7780, lng: 106.6998, relatedTo: ["Nhà thờ Đức Bà Sài Gòn"], image: "https://example.com/rex.jpg", rating: 4.5, note: "Khách sạn lâu đời, tiện tham quan.", distance: "500 m", time: "6 phút" },

    // Phố Bùi Viện Hotels
    { id: "hcm-h13", name: "Liberty Saigon Parkview Hotel", price: "1.000.000 VND/đêm", description: "Vị trí thuận tiện", address: "Quận 1", lat: 10.7670, lng: 106.6925, relatedTo: ["Phố đi bộ Bùi Viện"], image: "https://example.com/libertyparkview.jpg", rating: 3.5, note: "Khách sạn tiêu chuẩn, vị trí thuận tiện.", distance: "450 m", time: "5 phút đi bộ" },
    { id: "hcm-h14", name: "A25 Hotel", price: "900.000 VND/đêm", description: "Giá ổn", address: "Quận 1", lat: 10.7665, lng: 106.6930, relatedTo: ["Phố đi bộ Bùi Viện"], image: "https://example.com/a25.jpg", rating: 3.5, note: "Giá ổn, dễ đặt phòng.", distance: "600 m", time: "7 phút" },
    { id: "hcm-h15", name: "Phoenix Sài Gòn Hotel", price: "800.000 VND/đêm", description: "Gần nightlife", address: "Quận 1", lat: 10.7680, lng: 106.6920, relatedTo: ["Phố đi bộ Bùi Viện"], image: "https://example.com/phoenix.jpg", rating: 3, note: "Gần khu nightlife, có thể hơi ồn ban đêm.", distance: "200 m", time: "2 phút đi bộ" },

    // Landmark 81 Hotels
    { id: "hcm-h16", name: "Vinpearl Luxury Landmark 81", price: "2.700.000 VND/đêm", description: "Trong Landmark", address: "Bình Thạnh", lat: 10.7946, lng: 106.7218, relatedTo: ["Landmark 81"], image: "https://example.com/vinpearl.jpg", rating: 5, note: "Trải nghiệm cao cấp, tiện di chuyển.", distance: "0 km", time: "Ngay trong tòa nhà" },
    { id: "hcm-h17", name: "Sedona Suites Ho Chi Minh City", price: "4.000.000 VND/đêm", description: "Căn hộ dịch vụ", address: "Bình Thạnh", lat: 10.7920, lng: 106.7240, relatedTo: ["Landmark 81"], image: "https://example.com/sedona.jpg", rating: 4.5, note: "Căn hộ dịch vụ, phù hợp gia đình.", distance: "3 km", time: "10 phút" },
    { id: "hcm-h18", name: "M City Hotel Saigon", price: "1.800.000 VND/đêm", description: "Giá vừa phải", address: "Bình Thạnh", lat: 10.7900, lng: 106.7200, relatedTo: ["Landmark 81"], image: "https://example.com/mcity.jpg", rating: 4, note: "Giá vừa phải, chất lượng ổn.", distance: "4 km", time: "15 phút" },

    // Vị Sài Gòn Hotels
    { id: "hcm-h19", name: "Park Hyatt Saigon", price: "7.000.000 - 9.000.000 VND/đêm", description: "Siêu cao cấp", address: "Quận 1", lat: 10.7780, lng: 106.7015, relatedTo: ["Vị Sài Gòn Restaurant & Café"], image: "https://example.com/parkhyatt.jpg", rating: 5, note: "Khách sạn siêu cao cấp, dịch vụ chuẩn quốc tế.", distance: "3 km", time: "10 phút" },
    { id: "hcm-h20", name: "Hotel Nikko Saigon", price: "3.000.000 - 3.800.000 VND/đêm", description: "Phòng rộng", address: "Quận 1", lat: 10.7770, lng: 106.7020, relatedTo: ["Vị Sài Gòn Restaurant & Café"], image: "https://example.com/nikko.jpg", rating: 4.5, note: "Phòng rộng, phù hợp nghỉ dưỡng.", distance: "3.5 km", time: "12 phút" },
    { id: "hcm-h21", name: "Somerset Chancellor Court Ho Chi Minh City", price: "2.000.000 - 2.500.000 VND/đêm", description: "Căn hộ dịch vụ", address: "Quận 1", lat: 10.7765, lng: 106.7025, relatedTo: ["Vị Sài Gòn Restaurant & Café"], image: "https://example.com/somerset.jpg", rating: 4, note: "Căn hộ dịch vụ, tiện cho nhóm và gia đình.", distance: "3 km", time: "9 phút" },

    // Suối Tiên Hotels
    { id: "hcm-h22", name: "Binh Duong Golf Resort (Holiday Inn)", price: "1.800.000 VND/đêm", description: "Resort yên tĩnh", address: "Bình Dương", lat: 10.8950, lng: 106.7850, relatedTo: ["Khu du lịch Suối Tiên"], image: "https://example.com/binhduong.jpg", rating: 4, note: "Không gian rộng, yên tĩnh, phù hợp nghỉ dưỡng.", distance: "6 km", time: "12 phút" },
    { id: "hcm-h23", name: "Khách sạn Grand Silverland", price: "2.000.000 VND/đêm", description: "Khách sạn trung tâm", address: "Quận 1", lat: 10.7720, lng: 106.6981, relatedTo: ["Khu du lịch Suối Tiên"], image: "https://example.com/grandsilverland.jpg", rating: 4, note: "Khách sạn trung tâm, tiện kết hợp lịch trình khác.", distance: "15.5 km", time: "30 phút" },
    { id: "hcm-h24", name: "Hoang Yen Binh Thanh Hotel", price: "900.000 VND/đêm", description: "Giá rẻ", address: "Bình Thạnh", lat: 10.8100, lng: 106.7100, relatedTo: ["Khu du lịch Suối Tiên"], image: "https://example.com/hoangyen.jpg", rating: 3, note: "Giá rẻ, phù hợp du lịch tiết kiệm.", distance: "8 km", time: "18 phút" }
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

    // Migrate Attractions - ALL CITIES
    const allAttractions = [
        ...NHA_TRANG_ATTRACTIONS,
        ...DA_NANG_ATTRACTIONS,
        ...DA_LAT_ATTRACTIONS,
        ...HCM_ATTRACTIONS
    ];

    for (const attr of allAttractions) {
        try {
            const existing = await prisma.place.findFirst({ where: { name: attr.name, city: attr.city } })
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

    // Migrate Hotels - ALL CITIES
    const allHotels = [
        ...NHA_TRANG_HOTELS,
        ...DA_NANG_HOTELS,
        ...DA_LAT_HOTELS,
        ...HCM_HOTELS
    ];

    for (const hotel of allHotels) {
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
                        city: hotel.relatedTo[0]?.includes('VinWonders') ? 'Nha Trang'
                            : hotel.relatedTo[0]?.includes('Bà Nà') ? 'Đà Nẵng'
                                : hotel.relatedTo[0]?.includes('Quảng trường Lâm') ? 'Đà Lạt'
                                    : hotel.address.includes('Quận') ? 'Hồ Chí Minh'
                                        : 'Nha Trang',
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
