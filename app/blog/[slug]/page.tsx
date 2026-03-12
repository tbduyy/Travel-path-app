import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostContent from "./content";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const SITE_URL = "https://www.travelpath.io.vn";

// Allow on-demand rendering for new blog slugs created after build
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug.replace(/^\//, "") }));
}

async function getPost(slug: string) {
  let post = await prisma.post.findUnique({ where: { slug } });
  if (!post) {
    post = await prisma.post.findUnique({ where: { slug: `/${slug}` } });
  }
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || post.isHidden) {
    return { title: "Bài viết không tồn tại" };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug.replace(/^\//, "")}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: "Travel Path",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [],
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let canEdit = false;
  if (user) {
    const { data: profile } = await supabase
      .from("Profile")
      .select("role")
      .eq("email", user.email)
      .single();
    canEdit = profile?.role === "admin";
  }

  if (post.isHidden && !canEdit) {
    notFound();
  }

  // JSON-LD structured data for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Travel Path",
      url: SITE_URL,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug.replace(/^\//, "")}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent post={post} canEdit={canEdit} />
    </>
  );
}
