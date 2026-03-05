"use server";

import { Resend } from "resend";
import { createElement } from "react";
import { PromoteEmail } from "@/lib/email-templates/promote";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPromoteEmailResult {
  success: boolean;
  error?: string;
}

function getPromotePlainText(customerName: string): string {
  return `Xin chào ${customerName},\n\nCảm ơn bạn đã sử dụng Travel Path. Chúng tôi xin gửi đến bạn một ưu đãi đặc biệt.\n\nTrân trọng,\nTravel Path Team`;
}

export async function sendPromoteEmail(
  _prev: SendPromoteEmailResult,
  formData: FormData,
): Promise<SendPromoteEmailResult> {
  const customerName = formData.get("customerName") as string;
  const email = formData.get("email") as string;

  if (!customerName?.trim() || !email?.trim()) {
    return { success: false, error: "Vui lòng điền đầy đủ tên và email." };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Email không hợp lệ." };
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Dịch vụ email chưa được cấu hình." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Travel Path <no-reply@travelpath.io.vn>",
      to: email,
      subject: "Du lịch thôi, việc còn lại để Travel Path lo! ✈️",
      react: createElement(PromoteEmail, { customerName: customerName.trim() }),
      text: getPromotePlainText(customerName.trim()),
    });

    if (error) {
      console.error("Resend promote error:", error);
      return { success: false, error: error.message };
    }

    console.log("Promote email sent:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending promote email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định.",
    };
  }
}

export async function sendPromoteEmailToAll(
  _prev: SendPromoteEmailResult,
): Promise<SendPromoteEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Dịch vụ email chưa được cấu hình." };
  }

  try {
    const prisma = (await import("@/lib/prisma")).default;
    const users = await prisma.profile.findMany({
      where: { isLocked: false },
      select: { email: true },
    });

    if (users.length === 0) {
      return {
        success: false,
        error: "Không có người dùng nào trong hệ thống.",
      };
    }

    let sentCount = 0;
    const errors: string[] = [];
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const name = user.email.split("@")[0];

      // Rate limit: wait 2s between each email to avoid Resend rate limits
      if (i > 0) await delay(2000);

      try {
        const { error } = await resend.emails.send({
          from: "Travel Path <no-reply@travelpath.io.vn>",
          to: user.email,
          subject: "Du lịch thôi, việc còn lại để Travel Path lo! ✈️",
          react: createElement(PromoteEmail, { customerName: name }),
          text: getPromotePlainText(name),
        });

        if (error) {
          errors.push(`${user.email}: ${error.message}`);
        } else {
          sentCount++;
        }
      } catch {
        errors.push(`${user.email}: Gửi thất bại`);
      }
    }

    if (sentCount === 0) {
      return { success: false, error: `Gửi thất bại toàn bộ. ${errors[0]}` };
    }

    const msg = `Đã gửi thành công ${sentCount}/${users.length} email.`;
    if (errors.length > 0) {
      return { success: true, error: `${msg} Lỗi: ${errors.join(", ")}` };
    }
    return { success: true, error: msg };
  } catch (error) {
    console.error("Error sending promote emails to all:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định.",
    };
  }
}
