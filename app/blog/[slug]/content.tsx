
"use client";

import Header from "@/components/layout/Header";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Calendar, User, Clock, ArrowLeft, Image as ImageIcon, Plus, Loader } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogPostContent({ post, canEdit = false }: { post: any, canEdit?: boolean }) {
    // Local State
    const [contentBlocks, setContentBlocks] = useState<{ type: 'text' | 'image', content: string }[]>([]);
    const [isEditMode, setIsEditMode] = useState(canEdit);
    const [isUploading, setIsUploading] = useState(false);
    const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (post) {
            const savedContent = localStorage.getItem(`blog_${post.slug}`);
            if (savedContent) {
                setContentBlocks(JSON.parse(savedContent));
            } else {
                // Handle both array of strings (from DB Json) or string (if not parsed)
                const contentSrc = Array.isArray(post.content) ? post.content : [String(post.content)];
                setContentBlocks(contentSrc.map((text: string) => ({ type: 'text', content: text })));
            }
        }
    }, [post]);

    const handleAddImageClick = (index: number) => {
        setActiveBlockIndex(index);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || activeBlockIndex === null) return;

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `blog/${Date.now()}.${fileExt}`;

            // Upload to Supabase 'blog' bucket
            const { data, error } = await supabase.storage
                .from('blog')
                .upload(fileName, file);

            if (error) {
                alert('Lỗi khi tải ảnh lên: ' + error.message);
                console.error(error);
                return;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('blog')
                .getPublicUrl(fileName);

            const newBlocks = [...contentBlocks];
            newBlocks.splice(activeBlockIndex + 1, 0, { type: 'image', content: publicUrl });
            setContentBlocks(newBlocks);
            localStorage.setItem(`blog_${post.slug}`, JSON.stringify(newBlocks));

        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi không mong muốn khi tải ảnh');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            setActiveBlockIndex(null);
        }
    };

    const handleRemoveBlock = (index: number) => {
        const newBlocks = [...contentBlocks];
        newBlocks.splice(index, 1);
        setContentBlocks(newBlocks);
        localStorage.setItem(`blog_${post.slug}`, JSON.stringify(newBlocks));
    };

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

                {/* Intro Tooltip */}
                {isEditMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-4 items-start animate-in fade-in slide-in-from-top-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                            <ImageIcon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-800">Chế độ Chèn Hình Ảnh (Supabase Upload)</h3>
                            <p className="text-sm text-blue-600 mt-1">
                                Bạn có thể tải hình ảnh từ máy lên bằng cách nhấn vào nút
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full mx-1 align-middle border border-dashed border-gray-400"><Plus size={12} /></span>
                                . Ảnh sẽ được lưu trữ tự động trên đám mây.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-8 text-lg leading-relaxed text-gray-800">
                    {contentBlocks.map((block, index) => (
                        <div key={index} className="relative group">

                            {/* Render Block */}
                            {block.type === 'text' ? (
                                <p className={block.content.length < 100 && block.content.includes(":") ? "font-bold text-xl text-[#1B4D3E] mt-8 mb-4" : ""}>
                                    {block.content}
                                </p>
                            ) : (
                                <figure className="my-8 relative rounded-2xl overflow-hidden shadow-lg aspect-video w-full bg-gray-100">
                                    <Image
                                        src={block.content}
                                        alt="Blog Content"
                                        fill
                                        className="object-cover"
                                    />
                                    {isEditMode && (
                                        <button
                                            onClick={() => handleRemoveBlock(index)}
                                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                            title="Xóa ảnh này"
                                        >
                                            <Plus size={20} className="rotate-45" />
                                        </button>
                                    )}
                                </figure>
                            )}

                            {/* Add Image Control (After every block) */}
                            {isEditMode && block.type === 'text' && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full h-8 opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center justify-center">
                                    <button
                                        onClick={() => handleAddImageClick(index)}
                                        disabled={isUploading}
                                        className="bg-white border-2 border-dashed border-[#2E968C] text-[#2E968C] hover:bg-[#E0F2F1] rounded-full px-4 py-1.5 flex items-center gap-2 text-sm font-bold shadow-sm scale-90 hover:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading && activeBlockIndex === index ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
                                        {isUploading && activeBlockIndex === index ? "Đang tải ảnh..." : "Thêm ảnh từ máy"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                    <p className="font-bold text-[#1B4D3E] text-xl mb-4 italic">"Hãy đi khi đôi chân còn khỏe và trái tim còn trẻ"</p>
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
