import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const SITE_URL = "https://www.travelpath.io.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { isHidden: false },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug.replace(/^\//, "")}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogEntries,
  ];
}
