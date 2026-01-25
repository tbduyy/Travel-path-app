
import { PrismaClient } from '@prisma/client'
import { deletePost } from './actions'
import { Plus, Pencil, Trash2, Search, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'

async function getPosts() {
    return await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export default async function BlogAdminPage() {
    const posts = await getPosts()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Quản lý Bài viết</h2>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#153a2f] transition-all"
                >
                    <Plus size={20} />
                    Viết bài mới
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cover</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tiêu đề</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tác giả</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 w-32">
                                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        {post.coverImage && (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 line-clamp-2">{post.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">/{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User size={14} /> {post.author}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/blog/${post.id}`}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </Link>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Chưa có bài viết nào.
                    </div>
                )}
            </div>
        </div>
    )
}
