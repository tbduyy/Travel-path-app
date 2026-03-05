
"use client";

import Header from "@/components/layout/Header";
import Image from "next/image";
import { useMemo } from "react";
import { Calendar, User, Clock, ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { markdownToHtml } from "@/components/admin/RichTextToolbar";

export default function BlogPostContent({ post, canEdit = false }: { post: any, canEdit?: boolean }) {
    // Join content array back into a single markdown string (same as admin WYSIWYG does)
    // then render with markdownToHtml — identical pipeline to the editor preview
    const renderedHtml = useMemo(() => {
        if (!post?.content) return '';
        const markdown = Array.isArray(post.content)
            ? post.content.join('\n\n')
            : String(post.content);
        return markdownToHtml(markdown);
    }, [post?.content]);

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center">Bài viết không tồn tại</div>;
    }

    return (
        <main className="min-h-screen bg-white font-sans text-[#1B4D3E]">
            <Header />

            {/* Hero Cover */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} /> Quay lại Cẩm nang
                    </Link>
                    <div className="flex gap-4 mb-6">
                        {post.tags && post.tags.map((tag: string) => (
                            <span key={tag} className="bg-[#2E968C] px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-8 text-white/90 font-medium">
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>5 phút đọc</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto px-6 py-16">

                {/* Admin edit shortcut */}
                {canEdit && (
                    <div className="flex justify-end mb-6">
                        <Link
                            href={`/admin/blog/${post.id}`}
                            className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#153a2f] transition-all text-sm shadow-sm"
                        >
                            <Pencil size={16} />
                            Chỉnh sửa bài viết
                        </Link>
                    </div>
                )}

                {/*
                  Rendered with markdownToHtml — the SAME function the WYSIWYG editor
                  uses to display content. Styles below mirror the editor's Tailwind
                  child-selectors so the output is pixel-identical (WYSIWYG).
                */}
                <div
                    className="
                        text-base leading-relaxed text-gray-800
                        [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#1B4D3E] [&_h2]:mt-8 [&_h2]:mb-3
                        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1B4D3E] [&_h3]:mt-6 [&_h3]:mb-2
                        [&_blockquote]:border-l-4 [&_blockquote]:border-[#2E968C] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-3
                        [&_a]:text-[#2E968C] [&_a]:underline [&_a]:cursor-pointer
                        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
                        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
                        [&_li]:my-1
                        [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full [&_img]:shadow-md
                        [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-6
                        [&_p]:my-2 [&_p]:leading-relaxed
                        [&_b]:font-bold [&_strong]:font-bold
                    "
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />

                <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                    <p className="font-bold text-[#1B4D3E] text-xl mb-4 italic">&ldquo;Hãy đi khi đôi chân còn khỏe và trái tim còn trẻ&rdquo;</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-[#1877F2] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                            Chia sẻ lên Facebook
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
