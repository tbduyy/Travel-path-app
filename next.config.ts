import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Skip type checking during build - faster builds
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      // Khi chạy qua Port Forwarding, bạn cần thêm hostname vào đây để tránh lỗi "Invalid Server Actions request"
      // LƯU Ý: Chỉ điền hostname (ví dụ: 'abc-123.app.github.dev'), KHÔNG điền 'https://'
      allowedOrigins: [
        "localhost:3000",
        // Thêm các domain forwarding phổ biến hoặc domain cụ thể của bạn vào dưới đây:
        // "*.app.github.dev",
        "*.devtunnels.ms",
        "travelpath.lt.id.vn",
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "bit.ly" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "vinwonders.com" },
      { protocol: "https", hostname: "cdn3.ivivu.com" },
      { protocol: "https", hostname: "statics.vinpearl.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "nhatrangtourist.com.vn" },
      { protocol: "https", hostname: "znews-photo.zingcdn.me" },
      { protocol: "https", hostname: "vtv1.mediacdn.vn" },
      { protocol: "https", hostname: "cdn.vntrip.vn" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "media.vneconomy.vn" },
      { protocol: "https", hostname: "vcdn1-dulich.vnecdn.net" },
      { protocol: "https", hostname: "khanhhoatrip.net" },
      { protocol: "https", hostname: "cdn.nttravel.vn" },
      { protocol: "https", hostname: "sunworld.vn" },
      { protocol: "https", hostname: "unpkg.com" },
      { protocol: "https", hostname: "cwlovgpnraogycqfbwvx.supabase.co" },
      { protocol: "https", hostname: "static2.yan.vn" },
      { protocol: "https", hostname: "reviewvilla.vn" },
      { protocol: "https", hostname: "ticovilla.com" },
      { protocol: "https", hostname: "www.vntrip.vn" },
      { protocol: "https", hostname: "mia.vn" },
      { protocol: "https", hostname: "gody.vn" },
      { protocol: "https", hostname: "digiticket.vn" },
      { protocol: "https", hostname: "halotravel.vn" },
      { protocol: "https", hostname: "statics.vntrip.vn" },
      { protocol: "https", hostname: "disantrangan.vn" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "static-images.vnncdn.net" },
      { protocol: "https", hostname: "vcdn-dulich.vnecdn.net" },
      { protocol: "https", hostname: "vcdn1-travel.vnecdn.net" },
      // New domains for Nha Trang mock data
      { protocol: "https", hostname: "local.vn" },
      { protocol: "https", hostname: "reviewnao.com" },
      { protocol: "https", hostname: "tuyendaikhanhhoa.vn" },
      { protocol: "https", hostname: "cdn.justfly.vn" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "cdn.mediacdn.vn" },
      { protocol: "https", hostname: "cdn.daynauan.info.vn" },
      { protocol: "https", hostname: "dulichkhampha24.com" },
    ],
  },
};

export default nextConfig;
