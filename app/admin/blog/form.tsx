
'use client'

import { useActionState, useState } from 'react'
import { savePost } from './actions'
import { Post } from '@prisma/client'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

import ImageUpload from '@/components/ui/image-upload'

const initialState = {
    error: '',
}

export default function PostForm({ post, role }: { post?: Post | null, role?: string }) {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        const res = await savePost(formData)
        return res || { error: '' }
    }, initialState)

    // Convert JSON content back to string for textarea
    const contentString = post?.content
        ? Array.isArray(post.content)
            ? post.content.join('\n\n')
            : JSON.stringify(post.content)
        : ''

    const [coverImage, setCoverImage] = useState(post?.coverImage || '')
    const [content, setContent] = useState(contentString)

    const handleContentImageUpload = (url: string) => {
        const imageMarkdown = `\n![Image Description](${url})\n`
        setContent(prev => prev + imageMarkdown)
    }

    const canUpload = role === 'admin'

    return (
        <div className="space-y-6">
            {/* Header ... */}
            <div className="flex items-center gap-4">
                <Link href="/admin/blog" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">
                    {post ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                </h2>
            </div>

            <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                {post && <input type="hidden" name="id" value={post.id} />}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề</label>
                            <input name="title" defaultValue={post?.title} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-lg font-bold" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Nội dung (Mỗi đoạn cách nhau bởi 2 dòng trống)</label>
                                {canUpload && (
                                    <div className="scale-90 origin-right">
                                        <ImageUpload onUpload={handleContentImageUpload} label="Chèn ảnh vào bài" />
                                    </div>
                                )}
                            </div>
                            <textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={20}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] font-serif text-lg leading-relaxed"
                                placeholder="Viết nội dung tại đây..."
                            />
                        </div>
                    </div>

                    {/* Sidebar Meta */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <h3 className="font-bold text-gray-900">Thông tin bài viết</h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
                                <input name="slug" defaultValue={post?.slug} required placeholder="bai-viet-moi" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tác giả</label>
                                <input name="author" defaultValue={post?.author} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh Bìa</label>
                                <div className="space-y-3">
                                    {coverImage && (
                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
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
                                    {canUpload && <ImageUpload onUpload={setCoverImage} label="Upload Cover" />}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tags (cách nhau dấu phẩy)</label>
                                <input name="tags" defaultValue={post?.tags?.join(', ')} placeholder="#travel, #food" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn</label>
                            <textarea name="excerpt" defaultValue={post?.excerpt} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
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
                        {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Lưu bài viết
                    </button>
                </div>
            </form>
        </div>
    )
}
