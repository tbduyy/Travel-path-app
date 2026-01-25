export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    content: string[]; // Splitting content by paragraphs for easier insertion
    author: string;
    date: string;
    tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        slug: "meo-du-lich-ngau-hung",
        title: "MẸO DU LỊCH CHO NHỮNG NGÀY MUỐN ĐI LÀ ĐI",
        excerpt: "Du lịch tự túc không cần quá cầu kỳ, chỉ cần đủ thoải mái. Dưới đây là vài thói quen nhỏ mình rút ra sau nhiều chuyến đi kiểu “muốn đi là đi”.",
        coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
        author: "Travel Path Team",
        date: "24/01/2026",
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
        date: "20/01/2026",
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
        date: "15/01/2026",
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
        date: "10/01/2026",
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
