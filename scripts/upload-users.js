const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const text = `
nchinhtung@gmail.com	Chauu125@gmail.com	ngohan2705@gmail.com	nguyenthanhphuonngthao1303@gmail.com	adorablejinhami@gmail.com	mailinh.huyhoang412@gmail.com	huantich404@gmail.com	kimkhanh292525@gmail.com	phucnguyen.31241022636@st.ueh.edu.vn
maianhmanhh@gmail.com	Maithanhchaukatie@gmail.com	vinhtrinh.31221022962@st.ueh.edu.vn	antruc1211@gmail.com	gh296094@gmail.com	anhtu107@gmail.com	vaaythoomcum234567@gmail.com	huynhthuthuy24425@gmail.com	hungvo.31231020183@st.ueh.edu.vn
thylien.thapbaspa@gmail.com	Maithanhchau373@gmail.com	locnguyen.31221021931@st.ueh.edu.vn	tienlucc06@gmail.com	binhbinhthanhnguyen123@gmail.com	hv190193@gmail.com	thinhien326@gmail.com	in013047@gmail.com	hieunguyen.31221024179@student.ueh.edu.vn
huynhngocnhu810@gmail.com	Chaumai.31231021504@st.ueh.edu.vn	ryuhelios273@gmail.com	thanhthanh21122006@gmail.com	dangtrananhthu12a3@gmail.com	8.thienthancuatoi.8@gmail.com	thanhthat22@gmail.com	vns.thnh02@gmail.com	tranuy1919@gmail.com
anhnguyen.31231025450@st.ueh.edu.vn	Icecream0201@gmail.com	nguyenphuctue2107@gmail.com	minhtriet3006@gmail.com	uyenluu.31231024443@st.ueh.edu	ltv.tuananit@gmail.com	quockhai36@gmail.com	thanhdangchoi@gmail.com	letien2632k3@gmail.com
tongtranthieu@gmail.com	Hanguyen11@gmail.com	nobita070804@gmail.com	qduonganhanh@gmail.com	phuongquyng124@gmail.com	thaonhipx@gmail.com	huynhvan22@gmail.com	thaotran2003bt@gmail.com	nguyenngochuy593@gmail.com
huyntn2005@gmail.com	Tatdat1807@gmail.com	ttdat273@gmail.com	nhanguyen.31241025242@st.ueh.edu.vn	hanhuynh.cmo@gmail.com	letientp@gmail.com	tuanvu14@gmail.com	baohan210305@gmail.com	nguyendaihung22650621@gmail.com
nguyentuanh8297@gmail.com	Nhanha332@gmail.com	mythanhhuynh1972@gmail.com	nhantrinh.31241023606@st.ueh.edu.vn	nhucute05@gmail.com	kinhcan24@gmail.com	baongoc32@gmail.com	vibt27092003@gmail.com	vile.31241025391@st.ueh.edu.vn
minhthuy5553@gmail.com	Shirozzz@gmail.com	tuyenpham.31221025618@st.ueh.edu.vn	khavo.31241024754@st.ueh.edu.vn	august20.me@gmail.com	vietnamarch.ltd@gmail.com	anhngoc@gmail.com	phuongpham29112005@gmail.com	phantrungtrucdx@gmail.com
phuonganhlehuu5@gmail.com	youareinall@gmail.com	thanhtienst2004@gmail.com	thunguyen.31241023597@st.ueh.edu.vn	huynhnhathuyst123@gmail.com	tanbomarketing@gmail.com	tonuwxa@gmail.com	neyu0907@gmail.com	oanhdang.31241027058@st.ueh.edu.vn
hoangkimphan2812@gmail.com	Dat877@gmail.com	datb2203499@student.ctu.edu.vn	nockhanh08012005@gmail.com	nguyenthisonlan01.st@gmail.com	datmoirealty@gmail.com	tuankhang19@gmail.com	nlanh2005@gmail.com	lengoctuyen0103@gmail.com
nvthung0509@gmail.com	Annn323@gmail.com	lethanhphuc2483@gmail.com	binhnguyen.31241024682@st.ueh.edu.vn	huynhhaidmst@gmail.com	vuhonghai490@gmail.com	jaynie.alexya8888@gmail.com	tonyphan22330088@gmail.com	datnguyen.31241025560@st.ueh.edu.vn
dinhtienminh@ueh.edu.vn			hantran.31231021421@st.ueh.edu.vn	anhngstg2801@gmail.com	tuannguyentravel.com@gmail.com	thanhtan12@gmail.com		
			nguyenvo.31241028106@st.ueh.edu.vn	ngochuynh.31231024413@st.ueh.edu.vn		luongvanthanh@gmail.com
`;

const emails = text.split(/\s+/).filter(Boolean).map(e => e.trim());

async function uploadUsers() {
    let created = 0;
    let errors = 0;
    for (const email of emails) {
        if (!email) continue;

        // Check if user exists? We can just try creating
        const { data: user, error } = await supabase.auth.admin.createUser({
            email: email,
            password: '123456t@:',
            email_confirm: true,
        });

        if (error) {
            if (error.message.includes('already registered') || error.message.includes('already exists') || error.code === 'user_already_exists') {
                console.log(`[Skipped] ${email} already exists.`);
            } else {
                console.error(`[Error] Failed for ${email}:`, error.message);
                errors++;
            }
        } else {
            console.log(`[Success] Created ${email}`);
            created++;
        }
    }

    console.log(`\nFinished! Created ${created} new users. Encoutered ${errors} errors.`);
}

uploadUsers();
