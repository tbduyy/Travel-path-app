"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ActivitiesMap, PlaceData } from "./store/trip-store";

interface TripPDFData {
  destination: string;
  startDate: string | null;
  endDate: string | null;
  duration: string;
  budget: string;
  people: number;
  activities: ActivitiesMap;
  hotelData?: PlaceData | null;
}

// Vietnamese day names
const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// Period labels
const periodLabels: Record<string, string> = {
  morning: "🌅 BUỔI SÁNG",
  afternoon: "☀️ BUỔI CHIỀU",
  evening: "🌙 BUỔI TỐI",
};

// Format date to Vietnamese
function formatDateVN(dateStr: string | null): string {
  if (!dateStr) return "Chưa xác định";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const dayName = dayNames[date.getDay()];
  return `${dayName}, ${day}/${month}/${year}`;
}

// Format currency
function formatCurrency(amount: string | number | undefined): string {
  if (!amount) return "Miễn phí";
  const num =
    typeof amount === "string" ? parseInt(amount.replace(/\D/g, "")) : amount;
  if (isNaN(num) || num === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN").format(num) + " VND";
}

// ... (Các import và interface giữ nguyên như cũ)

// Thêm hàm helper để tải font (đặt bên ngoài exportTripToPDF)
async function loadFont(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  // Chuyển arrayBuffer sang base64 an toàn cho trình duyệt
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function exportTripToPDF(data: TripPDFData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // --- PHẦN THÊM MỚI: NẠP FONT TIẾNG VIỆT ---
  // Sử dụng font Roboto (Regular và Bold) từ CDN
  const fontRegularUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
  const fontBoldUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf";

  try {
    const [fontRegular, fontBold] = await Promise.all([
      loadFont(fontRegularUrl),
      loadFont(fontBoldUrl),
    ]);

    // Add font vào hệ thống ảo của jsPDF
    doc.addFileToVFS("Roboto-Regular.ttf", fontRegular);
    doc.addFileToVFS("Roboto-Bold.ttf", fontBold);

    // Đăng ký font
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    // Set font mặc định ngay lập tức
    doc.setFont("Roboto", "normal");
  } catch (error) {
    console.error("Lỗi tải font tiếng Việt, sẽ dùng font mặc định:", error);
  }
  // ---------------------------------------------

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Colors
  const primaryColor: [number, number, number] = [27, 77, 62];
  const accentColor: [number, number, number] = [46, 150, 140];
  const lightBg: [number, number, number] = [232, 241, 240];

  // ===== HEADER =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  // ĐỔI FONT: thay "helvetica" thành "Roboto"
  doc.setFont("Roboto", "bold");
  doc.text(`LICH TRINH ${data.destination.toUpperCase()}`, pageWidth / 2, 20, {
    align: "center",
  });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("Roboto", "normal"); // ĐỔI FONT
  doc.text(
    `${formatDateVN(data.startDate)} - ${formatDateVN(data.endDate)} | ${data.duration}`,
    pageWidth / 2,
    32,
    { align: "center" },
  );

  yPos = 55;

  // ===== TRIP INFO BOX =====
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, "F");

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold"); // ĐỔI FONT

  const infoY = yPos + 10;
  const colWidth = (pageWidth - margin * 2) / 4;

  // Destination
  doc.text("Diem den:", margin + 5, infoY);
  doc.setFont("Roboto", "normal"); // ĐỔI FONT
  doc.text(data.destination, margin + 5, infoY + 6);

  // Duration
  doc.setFont("Roboto", "bold"); // ĐỔI FONT
  doc.text("Thoi gian:", margin + colWidth + 5, infoY);
  doc.setFont("Roboto", "normal"); // ĐỔI FONT
  doc.text(data.duration, margin + colWidth + 5, infoY + 6);

  // People
  doc.setFont("Roboto", "bold"); // ĐỔI FONT
  doc.text("So nguoi:", margin + colWidth * 2 + 5, infoY);
  doc.setFont("Roboto", "normal"); // ĐỔI FONT
  doc.text(`${data.people} nguoi`, margin + colWidth * 2 + 5, infoY + 6);

  // Budget
  doc.setFont("Roboto", "bold"); // ĐỔI FONT
  doc.text("Ngan sach:", margin + colWidth * 3 + 5, infoY);
  doc.setFont("Roboto", "normal"); // ĐỔI FONT
  doc.text(
    data.budget || "Chua xac dinh",
    margin + colWidth * 3 + 5,
    infoY + 6,
  );

  yPos += 35;

  // ===== HOTEL INFO (if available) =====
  if (data.hotelData) {
    doc.setFillColor(...accentColor);
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("Roboto", "bold"); // ĐỔI FONT
    doc.text("KHACH SAN LUU TRU", margin + 5, yPos + 5.5);

    yPos += 10;

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold"); // ĐỔI FONT
    doc.text(data.hotelData.name, margin + 5, yPos + 5);

    doc.setFontSize(9);
    doc.setFont("Roboto", "normal"); // ĐỔI FONT
    doc.setTextColor(100, 100, 100);
    doc.text(
      data.hotelData.address || "Dia chi: Chua cap nhat",
      margin + 5,
      yPos + 11,
    );

    yPos += 18;
  }

  // ===== ITINERARY BY DAY =====
  const sortedDays = Object.keys(data.activities)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const dayActivities = data.activities[day];
    if (!dayActivities) continue;

    // Check if need new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    // Calculate day date
    let dayDateStr = "";
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      startDate.setDate(startDate.getDate() + day - 1);
      dayDateStr = ` - ${startDate.getDate().toString().padStart(2, "0")}/${(startDate.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    // Day header
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold"); // ĐỔI FONT
    doc.text(
      `NGAY ${day}${dayDateStr} | ${data.destination}`,
      margin + 5,
      yPos + 7,
    );

    yPos += 14;

    // Periods
    const periods = ["morning", "afternoon", "evening"];

    for (const period of periods) {
      const activities = dayActivities[period];
      if (!activities || activities.length === 0) continue;

      // Check if need new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      // Period label
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - margin * 2, 7, "F");
      doc.setTextColor(...accentColor);
      doc.setFontSize(10);
      doc.setFont("Roboto", "bold"); // ĐỔI FONT
      doc.text(
        periodLabels[period] || period.toUpperCase(),
        margin + 5,
        yPos + 5,
      );

      yPos += 10;

      // Activities table
      const tableData = activities.map((act) => [
        act.time || act.startTime || "-",
        act.title || act.place?.name || "Hoat dong",
        act.place?.address || act.place?.name || "-",
        formatCurrency(act.cost || act.place?.price),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Gio", "Hoat dong", "Dia diem", "Chi phi"]],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
          font: "Roboto", // QUAN TRỌNG: Cấu hình font cho bảng
          fontSize: 9,
          cellPadding: 3,
          textColor: [50, 50, 50],
        },
        headStyles: {
          fillColor: lightBg,
          textColor: primaryColor,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
        },
        theme: "grid",
      });

      yPos = (doc as any).lastAutoTable.finalY + 5;
    }

    yPos += 5;
  }

  // ===== FOOTER =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("Roboto", "normal"); // ĐỔI FONT
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Tao boi Travel Path | Trang ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
    );
  }

  return doc.output("blob");
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convenience function to export and download
export async function exportAndDownloadTripPDF(
  data: TripPDFData,
): Promise<void> {
  const blob = await exportTripToPDF(data);
  const filename = `Lich-trinh-${data.destination.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
  downloadPDF(blob, filename);
}
