import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PromoteEmailProps {
  customerName: string;
}

const IMG = "https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/email";

export function PromoteEmail({ customerName = "Khách hàng" }: PromoteEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            @media (max-width: 600px) {
              .mobile-column { width: 100% !important; display: block !important; }
              .mobile-stack { flex-direction: column !important; }
              .mobile-center { text-align: center !important; }
              .mobile-hide { display: none !important; }
            }
          `}
        </style>
      </Head>
      <Preview>Ưu đãi đặc biệt từ Travel Path dành cho bạn</Preview>
      
      <Body style={main}>
        <Container style={container}>
          
          {/* HEADER: Ghi chú - Email không hỗ trợ tốt absolute, nên dùng backgroundImage */}
          <Section style={headerSection}>
            <Row>
              <Column align="center" style={{ padding: "30px 0" }}>
                <Img src={`${IMG}/logo.png`} alt="Logo" width={40} height="auto" style={{ display: "inline-block", verticalAlign: "middle" }} />
                <Img src={`${IMG}/logo-name.png`} alt="Travel Path" width={100} height="auto" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "12px" }} />
              </Column>
            </Row>
          </Section>

          {/* HERO IMAGE */}
          <Section>
            <Img src={`${IMG}/hero-section.png`} alt="Hero" width="100%" height="auto" style={{ display: "block" }} />
          </Section>

          {/* GREETING */}
          <Section style={{ textAlign: "center", padding: "20px 0" }}>
            <Text style={greetingText}>BẠN {customerName.toUpperCase()} THÂN MẾN,</Text>
          </Section>

          {/* INTRO BLOCK (DU LỊCH THÔI) */}
          <Section style={{ padding: "0 8px 40px" }}>
            <Row>
              <Column style={{ width: "50%", paddingRight: "4px" }} className="mobile-column">
                <Img src={`${IMG}/du-lich-thoi.png`} alt="Du lịch thôi" width="100%" height="auto" />
                <Img src={`${IMG}/time-to-travel.png`} alt="Time to travel" width="60%" height="auto" style={{ margin: "0 auto" }} />
              </Column>
              
              <Column style={{ width: "50%", paddingLeft: "4px" }} className="mobile-column">
                <div style={introBox}>
                  <Text style={{ ...introText, marginBottom: "16px" }}>
                    Có những chuyến đi không phải để "check-in cho đủ", mà để thật sự thở chậm lại giữa biển xanh và nắng ấm.
                  </Text>
                  <Text style={introText}>
                    Nếu bạn đang cần một kỳ nghỉ ngắn nhưng đủ "đã", <b>Travel Path</b> sẽ giúp bạn lên lịch trình thông minh, tối ưu thời gian và vẫn trọn vẹn trải nghiệm.
                  </Text>
                </div>
              </Column>
            </Row>
            {/* Mặt trời: Không dùng absolute được, nên đặt ở góc phải lưới */}
            <Row>
              <Column align="right">
                <Img src={`${IMG}/sunny.png`} alt="Mặt Trời" width={88} height="auto" style={{ marginTop: "-20px" }} />
              </Column>
            </Row>
          </Section>

          {/* DESTINATIONS (3 CỘT HÀ NỘI - ĐÀ NẴNG - SÀI GÒN) */}
          <Section style={{ padding: "0 8px 40px" }}>
            <Row>
              {/* Hà Nội */}
              <Column align="center" style={{ width: "33.33%", padding: "0 4px" }}>
                <div style={destinationImageWrapper}>
                  <Img src={`${IMG}/HaNoi.png`} alt="Hà Nội" width="100%" style={destinationImage} />
                </div>
                <Img src={`${IMG}/HaNoi-text.png`} alt="Hà Nội" width={80} style={{ margin: "8px auto 0" }} />
              </Column>
              
              {/* Đà Nẵng */}
              <Column align="center" style={{ width: "33.33%", padding: "0 4px" }}>
                <div style={destinationImageWrapper}>
                  <Img src={`${IMG}/DaNang.png`} alt="Đà Nẵng" width="100%" style={destinationImage} />
                </div>
                <Img src={`${IMG}/DaNang-text.png`} alt="Đà Nẵng" width={96} style={{ margin: "8px auto 0" }} />
              </Column>
              
              {/* Sài Gòn */}
              <Column align="center" style={{ width: "33.33%", padding: "0 4px" }}>
                <div style={destinationImageWrapper}>
                  <Img src={`${IMG}/SaiGon.png`} alt="Sài Gòn" width="100%" style={destinationImage} />
                </div>
                <Img src={`${IMG}/SaiGon-text.png`} alt="Sài Gòn" width={96} style={{ margin: "8px auto 0" }} />
              </Column>
            </Row>
          </Section>

          {/* ABOUT SECTION */}
          <Section style={aboutSection}>
            <Row>
              <Column style={{ width: "45%", verticalAlign: "top", paddingRight: "8px" }} className="mobile-column">
                <Img src={`${IMG}/chung-toi-la-ai.png`} alt="Chúng tôi là ai" width="100%" style={{ marginBottom: "16px" }} />
                
                <div style={checkboxWrapper}>
                  <Img src={`${IMG}/checkbox.png`} width={24} style={checkboxIcon} />
                  <Text style={checkboxText}>Lịch trình tối ưu nhất</Text>
                </div>
                <div style={checkboxWrapper}>
                  <Img src={`${IMG}/checkbox.png`} width={24} style={checkboxIcon} />
                  <Text style={checkboxText}>Đảm bảo giá tốt nhất</Text>
                </div>
                <div style={checkboxWrapper}>
                  <Img src={`${IMG}/checkbox.png`} width={24} style={checkboxIcon} />
                  <Text style={checkboxText}>Hỗ trợ xuyên suốt</Text>
                </div>
              </Column>

              <Column style={{ width: "55%", verticalAlign: "top", paddingLeft: "8px" }} className="mobile-column">
                <div style={aboutTextBox}>
                  <Text style={{ ...aboutText, marginBottom: "16px" }}>
                    <b>Travel Path</b> bắt đầu từ một ý tưởng nhỏ bé: Biến mỗi chuyến đi thành một hành trình được thiết kế riêng cho bạn. Chỉ một cú chạm, cả hành trình dần hiện ra - thông minh hơn, tối ưu hơn, và luôn có chúng tôi đồng hành xuyên suốt.
                  </Text>
                  <Text style={aboutText}>
                    Một cú chạm - vạn hành trình. Để mỗi chuyến đi không chỉ là điểm đến, mà là cảm xúc được gọi tên.
                  </Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* DỊCH VỤ & CTA */}
          <Section style={{ padding: "0 28px 40px" }}>
            <Img src={`${IMG}/dich-vu.png`} width="75%" style={{ marginBottom: "12px" }} />
            <Img src={`${IMG}/dich-vu-icon.png`} width="90%" style={{ marginBottom: "24px" }} />
            
            <Img src={`${IMG}/truy-cap.png`} width="85%" style={{ marginBottom: "8px" }} />
            <div style={ctaBox}>
              <Link href="https://www.travelpath.io.vn/" target="_blank">
                <Img src={`${IMG}/cto.png`} width="100%" alt="Travel Path Website" />
              </Link>
            </div>
          </Section>

          {/* FOOTER */}
          <Section style={footerSection}>
            <Row>
              <Column style={{ width: "50%", paddingRight: "10px", verticalAlign: "top" }}>
                <Text style={footerTitle}>LIÊN HỆ CHÚNG TÔI</Text>
                <div style={footerRow}>
                  <Img src={`${IMG}/mail.png`} width={20} style={footerIcon} />
                  <Link href="mailto:partnership@travelpath.io.vn" style={footerLink}>partnership@travelpath.io.vn</Link>
                </div>
                <div style={footerRow}>
                  <Img src={`${IMG}/phone.png`} width={20} style={footerIcon} />
                  <Link href="tel:+84836427816" style={footerLink}>+84 836 427 816</Link>
                </div>
              </Column>
              
              <Column style={{ width: "50%", paddingLeft: "10px", verticalAlign: "top" }}>
                <Text style={footerTitle}>THEO DÕI CHÚNG TÔI</Text>
                <div style={footerRow}>
                  <Img src={`${IMG}/facebook.png`} width={20} style={footerIcon} />
                  <Link href="https://www.facebook.com/travelpath.io.vn" style={footerLink}>Travel Path</Link>
                </div>
                <div style={footerRow}>
                  <Img src={`${IMG}/ig.png`} width={20} style={footerIcon} />
                  <Link href="https://www.instagram.com/travelpath.io.vn/" style={footerLink}>@travelpath.io.vn</Link>
                </div>
              </Column>
            </Row>
            
            <Row style={{ marginTop: "24px" }}>
              <Column>
                <Img src={`${IMG}/logo.png`} width={32} style={{ display: "inline-block", verticalAlign: "middle" }} />
                <Img src={`${IMG}/logo-name.png`} width={80} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "12px" }} />
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
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

// --- STYLES ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Montserrat, Trebuchet MS, Arial, sans-serif",
  WebkitFontSmoothing: "antialiased" as const,
};

const container = {
  margin: "0 auto",
  maxWidth: "500px",
  backgroundColor: "#E0F2F1",
  overflow: "hidden",
};

const headerSection = {
  backgroundColor: "#AACBCB", // Email fallback màu nền, Gmail sẽ hiển thị cái này 
  backgroundImage: `url(${IMG}/header-bg.png)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
};

const greetingText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#225E5E",
  margin: "0",
};

const introBox = {
  borderRadius: "24px",
  backgroundColor: "#AACBCB",
  padding: "16px",
};

const introText = {
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "20px",
  color: "#004339",
  margin: "0",
};

const destinationImageWrapper = {
  border: "1px solid #629F8D",
  backgroundColor: "rgba(98, 159, 141, 0.2)",
  borderRadius: "30px",
  padding: "4px",
};

const destinationImage = {
  borderRadius: "26px",
};

const aboutSection = {
  backgroundColor: "#0b4b42", // Dùng hex đặc thay vì rgba() vì email ghét rgba
  padding: "24px",
  marginBottom: "24px",
};

const checkboxWrapper = {
  backgroundColor: "#B26B6B",
  borderRadius: "12px",
  padding: "6px",
  marginBottom: "8px",
};

const checkboxIcon = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "6px",
};

const checkboxText = {
  display: "inline-block",
  verticalAlign: "middle",
  fontSize: "13px",
  color: "#FFF2E0",
  margin: "0",
};

const aboutTextBox = {
  padding: "0 8px",
};

const aboutText = {
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "20px",
  color: "#f0fffd",
  margin: "0",
  textAlign: "justify" as const,
};

const ctaBox = {
  width: "90%",
  borderRadius: "20px",
  backgroundColor: "#AACBCB",
  padding: "12px",
};

const footerSection = {
  backgroundColor: "#ffffff",
  padding: "24px 16px",
};

const footerTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#004339",
  marginBottom: "12px",
};

const footerRow = {
  marginBottom: "8px",
};

const footerIcon = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "8px",
};

const footerLink = {
  display: "inline-block",
  verticalAlign: "middle",
  fontSize: "12px",
  color: "#004339",
  textDecoration: "none",
  fontWeight: 500,
};