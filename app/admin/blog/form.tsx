"use client";

import { useActionState, useMemo, useState, useRef } from "react";
import { savePost } from "./actions";
import { Post } from "@prisma/client";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

import ImageUpload from "@/components/ui/image-upload";
import WysiwygEditor from "@/components/admin/RichTextToolbar";

const initialState = {
  error: "",
};

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TocDisplayItem = TocItem & {
  indexLabel: string;
};

function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown) return [];

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const hashes = match[1];
    const rawText = match[2].trim();

    if (!rawText) continue;

    const normalizedText = rawText
      .replace(/[*_~`>#\[\]()]/g, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalizedText) continue;

    toc.push({
      id: `${toc.length + 1}-${normalizedText.toLowerCase().replace(/\s+/g, "-")}`,
      text: normalizedText,
      level: Math.min(hashes.length, 6),
    });
  }

  return toc;
}

function buildTocDisplayItems(toc: TocItem[]): TocDisplayItem[] {
  const counters = [0, 0, 0, 0, 0, 0];

  return toc.map((item) => {
    const depth = Math.max(1, Math.min(item.level, 6));
    counters[depth - 1] += 1;

    for (let i = depth; i < counters.length; i += 1) {
      counters[i] = 0;
    }

    const indexLabel = counters.slice(0, depth).filter(Boolean).join(".");

    return {
      ...item,
      indexLabel,
    };
  });
}

export default function PostForm({
  post,
  role,
}: {
  post?: Post | null;
  role?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: any, formData: FormData) => {
      const res = await savePost(formData);
      return res || { error: "" };
    },
    initialState,
  );

  // Convert JSON content back to string for textarea
  const contentString = post?.content
    ? Array.isArray(post.content)
      ? post.content.join("\n\n")
      : JSON.stringify(post.content)
    : "";

  const [title, setTitle] = useState(post?.title || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [content, setContent] = useState(contentString);
  const contentRef = useRef(contentString);
  const tableOfContents = useMemo(
    () => extractTableOfContents(content),
    [content],
  );
  const tableOfContentsDisplay = useMemo(
    () => buildTocDisplayItems(tableOfContents),
    [tableOfContents],
  );

  // Keep ref in sync for form submission
  const handleMarkdownChange = (md: string) => {
    contentRef.current = md;
    setContent(md);
  };

  const canUpload = role === "admin";

  return (
    <div className="space-y-6">
      {/* Header ... */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">
          {post ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </h2>
      </div>

      <form
        action={formAction}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8"
      >
        {post && <input type="hidden" name="id" value={post.id} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tiêu đề
              </label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nội dung bài viết
              </label>
              {/* Hidden input carries markdown for form submission */}
              <input type="hidden" name="content" value={content} />
              <WysiwygEditor
                initialMarkdown={contentString}
                onMarkdownChange={handleMarkdownChange}
                canUpload={canUpload}
              />
            </div>
          </div>

          {/* Sidebar Meta */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="font-bold text-xl text-gray-900">Xem trước</div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Tiêu đề hiển thị
                </p>
                <p className="text-lg font-extrabold text-[#1B4D3E] leading-snug wrap-break-word">
                  {title.trim() || "Bài viết chưa có tiêu đề"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Mục lục bài viết
                </p>
                {tableOfContentsDisplay.length > 0 ? (
                  <ul className="space-y-1.5 max-h-60 overflow-auto pr-1">
                    {tableOfContentsDisplay.map((item) => (
                      <li
                        key={item.id}
                        className="text-sm text-gray-700 leading-relaxed"
                        style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                      >
                        <span className="font-semibold text-[#1B4D3E] mr-1.5">
                          {item.indexLabel}.
                        </span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Thêm heading trong nội dung (ví dụ H1, H2) để hiển thị mục
                    lục.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-gray-900">Thông tin bài viết</h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  name="slug"
                  defaultValue={post?.slug}
                  required
                  placeholder="bai-viet-moi"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tác giả
                </label>
                <input
                  name="author"
                  defaultValue={post?.author}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Ảnh Bìa
                </label>
                <div className="space-y-3">
                  {coverImage && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      name="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-xs"
                      placeholder="URL hoặc Upload"
                    />
                  </div>
                  {canUpload && (
                    <ImageUpload
                      onUpload={setCoverImage}
                      label="Upload Cover"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tags (cách nhau dấu phẩy)
                </label>
                <input
                  name="tags"
                  defaultValue={post?.tags?.join(", ")}
                  placeholder="#travel, #food"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                name="excerpt"
                defaultValue={post?.excerpt}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
              />
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
            {state.error}
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a2f] transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Lưu bài viết
          </button>
        </div>
      </form>
    </div>
  );
}
