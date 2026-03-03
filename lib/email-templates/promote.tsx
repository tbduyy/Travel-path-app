import * as React from "react";

interface PromoteEmailProps {
  customerName: string;
}

const IMG = "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/email";

export function PromoteEmail({ customerName }: PromoteEmailProps) {
  return (
    <div style={{ margin: 0, width: "100%", padding: 0, WebkitFontSmoothing: "antialiased", wordBreak: "break-word" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 600px) {
          .sm--bottom-4 { bottom: -16px !important; }
          .sm-mb-1 { margin-bottom: 4px !important; }
          .sm-mb-12 { margin-bottom: 48px !important; }
          .sm-mb-2 { margin-bottom: 8px !important; }
          .sm-mb-3 { margin-bottom: 12px !important; }
          .sm-mb-4 { margin-bottom: 16px !important; }
          .sm-mb-6 { margin-bottom: 24px !important; }
          .sm-ml-0 { margin-left: 0 !important; }
          .sm-h-22 { height: 88px !important; }
          .sm-h-3 { height: 12px !important; }
          .sm-h-4 { height: 16px !important; }
          .sm-w-12 { width: 48px !important; }
          .sm-w-16 { width: 64px !important; }
          .sm-w-18 { width: 72px !important; }
          .sm-w-24 { width: 96px !important; }
          .sm-w-5 { width: 20px !important; }
          .sm-w-6 { width: 24px !important; }
          .sm-grid-cols-4fr_5fr { grid-template-columns: 4fr 5fr !important; }
          .sm-gap-1 { gap: 4px !important; }
          .sm-gap-2 { gap: 8px !important; }
          .sm-gap-6 { gap: 24px !important; }
          .sm-p-1_5 { padding: 6px !important; }
          .sm-p-3 { padding: 12px !important; }
          .sm-py-3 { padding-top: 12px !important; padding-bottom: 12px !important; }
          .sm-pl-0 { padding-left: 0 !important; }
          .sm-pl-4 { padding-left: 16px !important; }
          .sm-pr-3 { padding-right: 12px !important; }
          .sm-text-10px { font-size: 10px !important; }
          .sm-text-8px { font-size: 8px !important; }
          .sm-text-9px { font-size: 9px !important; }
          .sm-text-xl { font-size: 20px !important; }
          .sm-text-xs { font-size: 12px !important; }
          .sm-leading-3 { line-height: 12px !important; }
        }
      ` }} />

      <div role="article" aria-roledescription="email" lang="en">
        <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 500, overflow: "hidden", backgroundColor: "#E0F2F1" }}>
          {/* Header with logo */}
          <div style={{ position: "relative", width: "100%" }}>
            <img src={`${IMG}/header-bg.png`} alt="" className="sm-h-22" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", height: 112, width: "100%", objectFit: "cover" }} height={112} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={`${IMG}/logo.png`} alt="Logo" className="sm-w-5" style={{ maxWidth: "100%", verticalAlign: "middle", marginTop: 8, height: "auto", width: 40 }} width={40} height="auto" />
              <img src={`${IMG}/logo-name.png`} alt="Travel Path" className="sm-h-4" style={{ maxWidth: "100%", verticalAlign: "middle", marginLeft: 12, marginTop: 8, height: 20 }} height={20} />
            </div>
          </div>

          {/* Hero image */}
          <div style={{ position: "relative", width: "100%" }}>
            <img src={`${IMG}/hero-section.png`} alt="Hero" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", height: "auto", width: "100%" }} height="auto" />
          </div>

          {/* Greeting */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="sm-text-xl" style={{ marginBottom: 20, marginTop: 20, fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 24, fontWeight: 700, color: "#225E5E" }}>
              BẠN {customerName.toUpperCase()} THÂN MẾN,
            </div>
          </div>

          {/* Du lịch thôi + intro text */}
          <div className="sm-mb-12" style={{ position: "relative", marginLeft: 8, marginRight: 8, marginBottom: 80, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 0 }}>
              <img src={`${IMG}/du-lich-thoi.png`} alt="Du lịch thôi" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", height: "auto", width: "100%" }} height="auto" />
              <img src={`${IMG}/time-to-travel.png`} alt="Time to travel" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", height: "auto", width: "60%" }} height="auto" />
            </div>
            <div className="sm-text-8px sm-p-3 sm-leading-3" style={{ borderRadius: 24, backgroundColor: "#AACBCB", padding: 16, fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 12, fontWeight: 500, lineHeight: "20px", color: "#004339" }}>
              <div className="sm-mb-2" style={{ marginBottom: 16 }}>
                Có những chuyến đi không phải để &quot;check-in cho đủ&quot;, mà để thật sự thở chậm lại giữa biển xanh và nắng ấm.
              </div>
              <div>
                Nếu bạn đang cần một kỳ nghỉ ngắn nhưng đủ &quot;đã&quot;, <b>Travel Path</b> sẽ giúp bạn lên lịch trình thông minh, tối ưu thời gian và vẫn trọn vẹn trải nghiệm.
              </div>
            </div>
            <img src={`${IMG}/sunny.png`} alt="Mặt Trời" className="sm-w-12 sm--bottom-4" style={{ maxWidth: "100%", verticalAlign: "middle", position: "absolute", bottom: -40, right: 0, display: "block", width: 88 }} width={88} />
          </div>

          {/* Destinations: Hà Nội, Đà Nẵng, Sài Gòn */}
          <div className="sm-mb-6" style={{ marginBottom: 40, display: "grid", width: "100%", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignItems: "flex-start", justifyItems: "center", paddingLeft: 4, paddingRight: 4 }}>
            {/* Hà Nội */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="sm-w-24" style={{ display: "flex", aspectRatio: "1 / 1", width: 144, alignItems: "center", justifyContent: "center", borderRadius: 30, borderWidth: 1, borderColor: "#629F8D", backgroundColor: "rgba(98, 159, 141, 0.2)" }}>
                <img src={`${IMG}/HaNoi.png`} alt="Hà Nội" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", aspectRatio: "1 / 1", width: "96%", borderRadius: 30, objectFit: "cover" }} />
              </div>
              <div>
                <img src={`${IMG}/HaNoi-text.png`} alt="Hà Nội" className="sm-w-16" style={{ maxWidth: "100%", verticalAlign: "middle", marginTop: 8, height: "auto", width: 80 }} width={80} height="auto" />
              </div>
            </div>
            {/* Đà Nẵng */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="sm-w-24" style={{ display: "flex", aspectRatio: "1 / 1", width: 144, alignItems: "center", justifyContent: "center", borderRadius: 30, borderWidth: 1, borderColor: "#629F8D", backgroundColor: "rgba(98, 159, 141, 0.2)" }}>
                <img src={`${IMG}/DaNang.png`} alt="Đà Nẵng" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", aspectRatio: "1 / 1", width: "96%", borderRadius: 30, objectFit: "cover" }} />
              </div>
              <div>
                <img src={`${IMG}/DaNang-text.png`} alt="Đà Nẵng" className="sm-w-18" style={{ maxWidth: "100%", verticalAlign: "middle", marginBottom: "auto", marginTop: 8, height: "auto", width: 96 }} width={96} height="auto" />
              </div>
            </div>
            {/* Sài Gòn */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="sm-w-24" style={{ display: "flex", aspectRatio: "1 / 1", width: 144, alignItems: "center", justifyContent: "center", borderRadius: 30, borderWidth: 1, borderColor: "#629F8D", backgroundColor: "rgba(98, 159, 141, 0.2)" }}>
                <img src={`${IMG}/SaiGon.png`} alt="Sài Gòn" style={{ maxWidth: "100%", verticalAlign: "middle", display: "block", aspectRatio: "1 / 1", width: "96%", borderRadius: 30, objectFit: "cover" }} />
              </div>
              <div>
                <img src={`${IMG}/SaiGon-text.png`} alt="Sài Gòn" className="sm-w-16" style={{ maxWidth: "100%", verticalAlign: "middle", marginTop: 8, height: "auto", width: 96 }} width={96} height="auto" />
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="sm-grid-cols-4fr_5fr sm-gap-6 sm-mb-3" style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "3fr 4fr", gap: 16, backgroundColor: "rgba(11, 75, 66, 0.8)", padding: "24px 8px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 8 }}>
              <img src={`${IMG}/chung-toi-la-ai.png`} alt="Chúng tôi là ai" style={{ maxWidth: "100%", verticalAlign: "middle", marginBottom: 16, height: "auto", width: "100%" }} height="auto" />
              <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{ marginBottom: 8, display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-start", borderRadius: 12, backgroundColor: "#B26B6B", padding: 4 }}>
                  <img src={`${IMG}/checkbox.png`} alt="" className="sm-w-5" style={{ maxWidth: "100%", verticalAlign: "middle", marginRight: 4, height: "auto", width: 28 }} width={28} height="auto" />
                  <div className="sm-text-9px" style={{ fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 14, color: "#FFF2E0" }}>
                    Lịch trình tối ưu nhất
                  </div>
                </div>
                <div style={{ marginBottom: 8, display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-start", borderRadius: 12, backgroundColor: "#B26B6B", padding: 4 }}>
                  <img src={`${IMG}/checkbox.png`} alt="" className="sm-w-5" style={{ maxWidth: "100%", verticalAlign: "middle", marginRight: 4, height: "auto", width: 28 }} width={28} height="auto" />
                  <div className="sm-text-9px" style={{ fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 14, color: "#FFF2E0" }}>
                    Đảm bảo giá tốt nhất
                  </div>
                </div>
                <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-start", borderRadius: 12, backgroundColor: "#B26B6B", padding: 4 }}>
                  <img src={`${IMG}/checkbox.png`} alt="" className="sm-w-5" style={{ maxWidth: "100%", verticalAlign: "middle", marginRight: 4, height: "auto", width: 28 }} width={28} height="auto" />
                  <div className="sm-text-9px" style={{ fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 14, color: "#FFF2E0" }}>
                    Hỗ trợ xuyên suốt
                  </div>
                </div>
              </div>
            </div>
            <div className="sm-text-10px sm-pl-0 sm-pr-3 sm-py-3 sm-leading-3" style={{ padding: 16, textAlign: "justify" as const, fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", fontSize: 12, fontWeight: 500, lineHeight: "20px", color: "#f0fffd" }}>
              <div className="sm-mb-2" style={{ marginBottom: 16 }}>
                <b>Travel Path</b> bắt đầu từ một ý tưởng nhỏ bé: Biến mỗi chuyến đi thành một hành trình được thiết kế riêng cho bạn. Chỉ một cú chạm, cả hành trình dần hiện ra - thông minh hơn, tối ưu hơn, và luôn có chúng tôi đồng hành xuyên suốt.
              </div>
              <div>
                Một cú chạm - vạn hành trình. Để mỗi chuyến đi không chỉ là điểm đến, mà là cảm xúc được gọi tên.
              </div>
            </div>
          </div>

          {/* Dịch vụ */}
          <div className="sm-pl-4 sm-mb-4" style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", justifyContent: "flex-start", paddingLeft: 28 }}>
            <img src={`${IMG}/dich-vu.png`} alt="Dịch vụ" style={{ maxWidth: "100%", verticalAlign: "middle", marginBottom: 12, width: "75%" }} />
            <img src={`${IMG}/dich-vu-icon.png`} alt="Dịch vụ icons" style={{ maxWidth: "100%", verticalAlign: "middle", width: "90%" }} />
          </div>

          {/* CTA */}
          <div className="sm-pl-4 sm-mb-6" style={{ marginBottom: 40, display: "flex", flexWrap: "wrap", justifyContent: "flex-start", paddingLeft: 28 }}>
            <img src={`${IMG}/truy-cap.png`} alt="Truy cập" style={{ maxWidth: "100%", verticalAlign: "middle", marginBottom: 4, width: "85%" }} />
            <div className="sm-p-1_5" style={{ width: "90%", borderRadius: 20, backgroundColor: "#AACBCB", padding: 12 }}>
              <a href="https://www.travelpath.io.vn/" target="_blank" style={{ display: "inline-block", width: "100%" }}>
                <img src={`${IMG}/cto.png`} alt="Travel Path Website" style={{ maxWidth: "100%", verticalAlign: "middle", height: "auto", width: "100%" }} height="auto" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: "#fffffe", paddingBottom: 16 }}>
            <div className="sm-gap-2" style={{ marginBottom: 8, marginLeft: 16, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", paddingTop: 24 }}>
              <div style={{ fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", color: "#004339" }}>
                <div className="sm-text-xs sm-mb-2" style={{ marginBottom: 16, fontSize: 14, fontWeight: 700 }}>LIÊN HỆ CHÚNG TÔI</div>
                <div className="sm-gap-1 sm-mb-1" style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, fontWeight: 500 }}>
                  <img src={`${IMG}/mail.png`} alt="" style={{ maxWidth: "100%", verticalAlign: "middle", height: "auto", width: 24 }} width={24} height="auto" />
                  <a href="mailto:partnership@travelpath.io.vn" className="sm-text-9px" style={{ marginBottom: 4, fontSize: 12, color: "inherit" }}>partnership@travelpath.io.vn</a>
                </div>
                <div className="sm-gap-1 sm-mb-1" style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, fontWeight: 500 }}>
                  <img src={`${IMG}/phone.png`} alt="" style={{ maxWidth: "100%", verticalAlign: "middle", height: "auto", width: 24 }} width={24} height="auto" />
                  <a href="tel:+84836427816" className="sm-text-9px" style={{ fontSize: 12, color: "inherit" }}>+84 836 427 816</a>
                </div>
              </div>
              <div style={{ fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif", color: "#004339" }}>
                <div className="sm-text-xs sm-mb-2" style={{ marginBottom: 16, fontSize: 14, fontWeight: 700 }}>THEO DÕI CHÚNG TÔI</div>
                <div className="sm-gap-1" style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, fontWeight: 500 }}>
                  <img src={`${IMG}/facebook.png`} alt="" style={{ maxWidth: "100%", verticalAlign: "middle", height: "auto", width: 24 }} width={24} height="auto" />
                  <a href="https://www.facebook.com/travelpath.io.vn" className="sm-text-9px" style={{ fontSize: 12, color: "inherit" }}>Travel Path</a>
                </div>
                <div className="sm-gap-1 sm-mb-1" style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, fontWeight: 500 }}>
                  <img src={`${IMG}/ig.png`} alt="" style={{ maxWidth: "100%", verticalAlign: "middle", height: "auto", width: 24 }} width={24} height="auto" />
                  <a href="https://www.instagram.com/travelpath.io.vn/" className="sm-text-9px" style={{ fontSize: 12, color: "inherit" }}>@travelpath.io.vn</a>
                </div>
              </div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <img src={`${IMG}/logo.png`} alt="Logo" className="sm-w-6" style={{ maxWidth: "100%", verticalAlign: "middle", marginTop: 8, height: "auto", width: 32 }} width={32} height="auto" />
              <img src={`${IMG}/logo-name.png`} alt="Travel Path" className="sm-h-3 sm-ml-0" style={{ maxWidth: "100%", verticalAlign: "middle", marginLeft: 12, marginTop: 8, height: 16 }} height={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getPromotePlainText(customerName: string): string {
  return `
BẠN ${customerName.toUpperCase()} THÂN MẾN,

DU LỊCH THÔI! TIME TO TRAVEL

Có những chuyến đi không phải để "check-in cho đủ", mà để thật sự thở chậm lại giữa biển xanh và nắng ấm.

Nếu bạn đang cần một kỳ nghỉ ngắn nhưng đủ "đã", Travel Path sẽ giúp bạn lên lịch trình thông minh, tối ưu thời gian và vẫn trọn vẹn trải nghiệm.

📍 HÀ NỘI - ĐÀ NẴNG - SÀI GÒN

CHÚNG TÔI LÀ AI?
Travel Path bắt đầu từ một ý tưởng nhỏ bé: Biến mỗi chuyến đi thành một hành trình được thiết kế riêng cho bạn.
✔ Lịch trình tối ưu nhất
✔ Đảm bảo giá tốt nhất
✔ Hỗ trợ xuyên suốt

👉 Truy cập ngay: https://www.travelpath.io.vn/

LIÊN HỆ CHÚNG TÔI
Email: partnership@travelpath.io.vn
Hotline: +84 836 427 816

THEO DÕI CHÚNG TÔI
Facebook: Travel Path
Instagram: @travelpath.io.vn
  `.trim();
}