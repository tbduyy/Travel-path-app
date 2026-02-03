import type { Metadata } from "next";
import { Quicksand } from "next/font/google"; // Rounded sans-serif from design
import GlobalChatBubble from "@/components/layout/GlobalChatBubble";
import { AuthStateListener } from "@/components/auth/AuthStateListener";
import { AuthProvider } from "@/lib/context/AuthContext";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Path",
  description: "Một cú chạm, vạn hành trình",
  icons: {
    icon: '/favicon.ico', // Đảm bảo file này nằm trong thư mục public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <PageTransition>
            {children}
          </PageTransition>
          <GlobalChatBubble />
        </AuthProvider>
      </body>
    </html>
  );
}
