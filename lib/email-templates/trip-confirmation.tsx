import * as React from "react";

interface TripEmailProps {
  userName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalAmount: string;
  hotelName?: string;
  attractionsCount: number;
}

export function TripConfirmationEmail({
  userName,
  destination,
  startDate,
  endDate,
  duration,
  totalAmount,
  hotelName,
  attractionsCount,
}: TripEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1B4D3E",
          padding: "32px",
          textAlign: "center" as const,
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "28px",
            margin: "0",
            fontWeight: "bold",
          }}
        >
          Thanh toán thành công!
        </h1>
        <p
          style={{
            color: "#A7D7C5",
            fontSize: "16px",
            margin: "8px 0 0 0",
          }}
        >
          Chuyến đi của bạn đã được xác nhận
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "32px" }}>
        <p
          style={{
            fontSize: "16px",
            color: "#333333",
            lineHeight: "1.6",
          }}
        >
          Xin chào <strong>{userName}</strong>,
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#333333",
            lineHeight: "1.6",
          }}
        >
          Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của{" "}
          <strong style={{ color: "#1B4D3E" }}>Travel Path</strong>! Chúng tôi
          rất vui được đồng hành cùng bạn trong chuyến hành trình sắp tới.
        </p>

        {/* Trip Summary Card */}
        <div
          style={{
            backgroundColor: "#E8F5F3",
            borderRadius: "16px",
            padding: "24px",
            margin: "24px 0",
          }}
        >
          <h2
            style={{
              color: "#1B4D3E",
              fontSize: "20px",
              margin: "0 0 16px 0",
              borderBottom: "2px solid #2E968C",
              paddingBottom: "8px",
            }}
          >
            {destination}
          </h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#666666",
                    fontSize: "14px",
                  }}
                >
                  Thời gian:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#1B4D3E",
                    fontWeight: "bold",
                    textAlign: "right" as const,
                  }}
                >
                  {startDate} - {endDate} ({duration})
                </td>
              </tr>
              {hotelName && (
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#666666",
                      fontSize: "14px",
                    }}
                  >
                    Khách sạn:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#1B4D3E",
                      fontWeight: "bold",
                      textAlign: "right" as const,
                    }}
                  >
                    {hotelName}
                  </td>
                </tr>
              )}
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#666666",
                    fontSize: "14px",
                  }}
                >
                  Hoạt động:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#1B4D3E",
                    fontWeight: "bold",
                    textAlign: "right" as const,
                  }}
                >
                  {attractionsCount} địa điểm
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    borderTop: "1px dashed #2E968C",
                    paddingTop: "12px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#1B4D3E", fontWeight: "bold" }}>
                      Tổng thanh toán:
                    </span>
                    <span
                      style={{
                        color: "#EF4444",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      {totalAmount} ₫
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PDF Attachment Notice */}
        <div
          style={{
            backgroundColor: "#FEF3C7",
            borderRadius: "12px",
            padding: "16px",
            margin: "24px 0",
            border: "1px solid #F59E0B",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "14px",
              color: "#92400E",
            }}
          >
            <strong>Lịch trình chi tiết</strong> được đính kèm trong file PDF.
            Hãy lưu lại để tiện theo dõi nhé!
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" as const, margin: "32px 0" }}>
          <a
            href="https://www.travelpath.io.vn/my-journey"
            style={{
              backgroundColor: "#1B4D3E",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
              display: "inline-block",
            }}
          >
            Xem chuyến đi của tôi →
          </a>
        </div>

        {/* Support */}
        <p
          style={{
            fontSize: "14px",
            color: "#666666",
            lineHeight: "1.6",
          }}
        >
          Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với đội ngũ hỗ
          trợ của chúng tôi qua email{" "}
          <a href="mailto:support@travelpath.io.vn" style={{ color: "#2E968C" }}>
            support@travelpath.io.vn
          </a>
          .
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#333333",
            lineHeight: "1.6",
            marginTop: "24px",
          }}
        >
          Chúc bạn có một chuyến đi thật vui và đáng nhớ! 🌴✨
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#1B4D3E",
            fontWeight: "bold",
            margin: "24px 0 0 0",
          }}
        >
          — Đội ngũ Travel Path 🧭
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#F3F4F6",
          padding: "24px",
          textAlign: "center" as const,
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#9CA3AF",
            margin: "0",
          }}
        >
          © 2026 Travel Path. Tất cả quyền được bảo lưu.
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#9CA3AF",
            margin: "8px 0 0 0",
          }}
        >
          Email này được gửi tự động, vui lòng không trả lời trực tiếp.
        </p>
      </div>
    </div>
  );
}

// Plain text version for email clients that don't support HTML
export function getPlainTextEmail(props: TripEmailProps): string {
  return `
THANH TOÁN THÀNH CÔNG!

Xin chào ${props.userName},

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Travel Path!

📍 THÔNG TIN CHUYẾN ĐI
━━━━━━━━━━━━━━━━━━━━━━━━
Điểm đến: ${props.destination}
Thời gian: ${props.startDate} - ${props.endDate} (${props.duration})
${props.hotelName ? `🏨 Khách sạn: ${props.hotelName}` : ""}
Hoạt động: ${props.attractionsCount} địa điểm
Tổng thanh toán: ${props.totalAmount} ₫
━━━━━━━━━━━━━━━━━━━━━━━━

Lịch trình chi tiết được đính kèm trong file PDF.

Xem chuyến đi: https://www.travelpath.io.vns/my-journey

Chúc bạn có một chuyến đi thật vui và đáng nhớ!

— Đội ngũ Travel Path 🧭

---
© 2026 Travel Path
Email này được gửi tự động, vui lòng không trả lời trực tiếp.
Liên hệ hỗ trợ: support@travelpath.vn
  `.trim();
}
