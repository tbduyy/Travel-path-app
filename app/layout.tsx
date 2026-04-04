import type { Metadata } from "next";
import { Quicksand } from "next/font/google"; // Rounded sans-serif from design
import GlobalChatBubble from "@/components/layout/GlobalChatBubble";
import { AuthStateListener } from "@/components/auth/AuthStateListener";
import { AuthProvider } from "@/lib/context/AuthContext";
import PageTransition from "@/components/layout/PageTransition";
import SiteFooter from "@/components/layout/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Travel Path - Một cú chạm, vạn hành trình",
    template: "%s | Travel Path",
  },
  description:
    "Travel Path hợp tác với hệ thống khách sạn uy tín trên khắp Việt Nam, giúp bạn tạo lịch trình du lịch nhanh chóng bằng AI.",
  metadataBase: new URL("https://www.travelpath.io.vn"),
  openGraph: {
    siteName: "Travel Path",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preload fonts for PDF generation - removes CDN fetch delay */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${quicksand.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AuthStateListener />
          <PageTransition>{children}</PageTransition>
          <SiteFooter />
          <GlobalChatBubble />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
