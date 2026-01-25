import Header from "@/components/layout/Header";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { PrismaClient, Post } from "@prisma/client";
import prisma from '@/lib/prisma'


export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-[#F0F9F9] relative font-sans text-[#1B4D3E]">
            <Header />

            <div className="w-full max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#2E968C] font-bold tracking-widest uppercase text-sm">Travel Path Blog</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-[#1B4D3E]">Cẩm Nang Du Lịch</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nơi chia sẻ những kinh nghiệm, câu chuyện và những hành trình đầy cảm hứng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                            <article className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="text-4xl font-black opacity-20">BLOG</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1B4D3E] shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-[#2E968C] transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <span className="font-bold text-[#1B4D3E] group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                                            Đọc tiếp
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
