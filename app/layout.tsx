import type { Metadata } from "next";
import { Quicksand } from "next/font/google"; // Rounded sans-serif from design
import GlobalChatBubble from "@/components/layout/GlobalChatBubble";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Path",
  description: "Một cú chạm, vạn hành trình",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <GlobalChatBubble />
      </body>
    </html>
  );
}
