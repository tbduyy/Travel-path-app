"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  notifyBlogUrlDeleted,
  notifyBlogUrlUpdated,
} from "@/lib/services/google-indexing";

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from("Profile")
    .select("role")
    .eq("email", user.email)
    .single();
  return profile?.role === "admin";
}

export async function deletePost(formData: FormData) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch {
    return { error: "Failed to delete" };
  }
}
export async function toggleHidePost(formData: FormData) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const isHiddenStr = formData.get("isHidden") as string;
  const isHidden = isHiddenStr === "true";

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isHidden: !isHidden }, // Toggle the status
      select: { slug: true, isHidden: true },
    });

    if (updatedPost.isHidden) {
      await notifyBlogUrlDeleted(updatedPost.slug);
    } else {
      await notifyBlogUrlUpdated(updatedPost.slug);
    }

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost.slug.replace(/^\//, "")}`);
    return { success: true };
  } catch {
    return { error: "Failed to update visibility" };
  }
}

export async function savePost(formData: FormData) {
  if (!(await checkAdmin())) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const isEdit = !!id;

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const coverImage = formData.get("coverImage") as string;
  const author = formData.get("author") as string;

  // Content key handling
  // We assume the form sends a bunch of paragraphs joined by newlines, or we parse it.
  // For simplicity, let's say we have a text area "Content" and we split by double newline.
  const rawContent = formData.get("content") as string;
  const contentArray = rawContent.split("\n\n").filter((p) => p.trim() !== "");

  // Tags
  const hashtags = formData.get("tags") as string; // "#travel, #vietnam"
  const tags = hashtags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  try {
    let updatedSlug = slug;
    let isHiddenPost = false;

    if (isEdit) {
      // Get old slug before update so we can revalidate it
      const oldPost = await prisma.post.findUnique({
        where: { id },
        select: { slug: true, isHidden: true },
      });
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt,
          coverImage,
          author,
          tags,
          content: contentArray, // stored as Json (array of strings)
        },
        select: { slug: true, isHidden: true },
      });

      updatedSlug = updatedPost.slug;
      isHiddenPost = updatedPost.isHidden;

      // Revalidate old slug path if slug changed
      if (oldPost && oldPost.slug !== slug) {
        revalidatePath(`/blog/${oldPost.slug.replace(/^\//, "")}`);

        if (!oldPost.isHidden) {
          await notifyBlogUrlDeleted(oldPost.slug);
        }
      }
    } else {
      const createdPost = await prisma.post.create({
        data: {
          title,
          slug,
          excerpt,
          coverImage,
          author,
          tags,
          content: contentArray,
        },
        select: { slug: true, isHidden: true },
      });

      updatedSlug = createdPost.slug;
      isHiddenPost = createdPost.isHidden;
    }

    if (!isHiddenPost) {
      await notifyBlogUrlUpdated(updatedSlug);
    }
  } catch (e) {
    console.error(e);
    return { error: `Failed to ${isEdit ? "update" : "create"} post` };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug.replace(/^\//, "")}`);
  redirect("/admin/blog");
}
