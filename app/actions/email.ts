"use server";

import { Resend } from "resend";
import { createElement } from "react";
import {
  TripConfirmationEmail,
  getPlainTextEmail,
} from "@/lib/email-templates/trip-confirmation";

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTripEmailParams {
  to: string;
  userName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalAmount: string;
  hotelName?: string;
  attractionsCount: number;
  pdfBase64: string; // PDF file as base64 string
  pdfFilename: string;
}

export async function sendTripConfirmationEmail(
  params: SendTripEmailParams,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    // Validate required fields
    if (!params.to || !params.userName || !params.destination) {
      return { success: false, error: "Missing required fields" };
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return { success: false, error: "Email service not configured" };
    }

    // Create email content
    const emailProps = {
      userName: params.userName,
      destination: params.destination,
      startDate: params.startDate,
      endDate: params.endDate,
      duration: params.duration,
      totalAmount: params.totalAmount,
      hotelName: params.hotelName,
      attractionsCount: params.attractionsCount,
    };

    // Convert base64 to Buffer for attachment
    const pdfBuffer = Buffer.from(params.pdfBase64, "base64");

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: "Travel Path <no-reply@friendwithbooks.id.vn>", // Update with your verified domain
      to: params.to,
      subject: `Xác nhận thanh toán - Chuyến đi ${params.destination}`,
      react: createElement(TripConfirmationEmail, emailProps),
      text: getPlainTextEmail(emailProps),
      attachments: [
        {
          filename: params.pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper to get user email from Supabase session
export async function getUserEmailFromSession(): Promise<string | null> {
  try {
    // Dynamic import to avoid issues
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

// Get user info (name and email)
export async function getUserInfo(): Promise<{
  email: string | null;
  name: string | null;
}> {
  try {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { email: null, name: null };
    }

    // Try to get name from user metadata
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Quý khách";

    return {
      email: user.email || null,
      name,
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return { email: null, name: null };
  }
}
