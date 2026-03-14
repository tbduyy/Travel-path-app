import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login/", "/signup/"],
    },
    sitemap: "https://www.travelpath.io.vn/sitemap.xml",
  };
}
