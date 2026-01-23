import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bit.ly",
      },
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "vinwonders.com",
      },
      {
        protocol: "https",
        hostname: "cdn3.ivivu.com",
      },
      {
        protocol: "https",
        hostname: "statics.vinpearl.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "nhatrangtourist.com.vn",
      },
      {
        protocol: "https",
        hostname: "znews-photo.zingcdn.me",
      },
      {
        protocol: "https",
        hostname: "vtv1.mediacdn.vn",
      },
      {
        protocol: "https",
        hostname: "cdn.vntrip.vn",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "media.vneconomy.vn",
      },
      {
        protocol: "https",
        hostname: "vcdn1-dulich.vnecdn.net",
      },
      {
        protocol: "https",
        hostname: "khanhhoatrip.net",
      },
      {
        protocol: "https",
        hostname: "cdn.nttravel.vn",
      },
      {
        protocol: "https",
        hostname: "sunworld.vn",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
    ],
  },
};

export default nextConfig;
