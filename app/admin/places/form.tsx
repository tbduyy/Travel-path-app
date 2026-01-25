
'use client'

import { useActionState, useState } from 'react'
import { savePlace } from './actions'
import { Place } from '@prisma/client'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import ImageUpload from '@/components/ui/image-upload'

const initialState = {
    error: '',
}

export default function PlaceForm({ place }: { place?: Place | null }) {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        const res = await savePlace(formData)
        return res || { error: '' }
    }, initialState)

    // Local state for interactive fields
    const [image, setImage] = useState(place?.image || '')
    const [description, setDescription] = useState(place?.description || '')
    const [jsonError, setJsonError] = useState('')

    const handleDescriptionImageUpload = (url: string) => {
        const imageMarkdown = `\n![Image Description](${url})\n`
        setDescription(prev => prev + imageMarkdown)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/places" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </Link>
                <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">
                    {place ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
                </h2>
            </div>

            <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                {place && <input type="hidden" name="id" value={place.id} />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold border-b pb-2">Thông tin cơ bản</h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tên địa điểm</label>
                            <input name="name" defaultValue={place?.name} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Loại hình</label>
                                <select name="type" defaultValue={place?.type || 'ATTRACTION'} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]">
                                    <option value="ATTRACTION">Điểm tham quan</option>
                                    <option value="HOTEL">Khách sạn</option>
                                    <option value="RESTAURANT">Nhà hàng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Giá tham khảo</label>
                                <input name="price" defaultValue={place?.price || ''} placeholder="VD: 100.000 VND" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Thành phố</label>
                            <input name="city" defaultValue={place?.city || ''} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ chi tiết</label>
                            <input name="address" defaultValue={place?.address || ''} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Mô tả</label>
                                <div className="scale-90 origin-right">
                                    {/* Reuse ImageUpload for description */}
                                    <ImageUpload onUpload={handleDescriptionImageUpload} label="Chèn ảnh vào mô tả" />
                                </div>
                            </div>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]"
                            />
                        </div>
                    </div>

                    {/* Media & Coords */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold border-b pb-2">Hình ảnh & Vị trí</h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh chính</label>
                            <div className="space-y-3">
                                {image && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        name="image"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-sm"
                                    />
                                </div>
                                <ImageUpload onUpload={setImage} label="Upload Ảnh chính" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Vĩ độ (Lat)</label>
                                <input name="lat" type="number" step="any" defaultValue={place?.lat || ''} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kinh độ (Lng)</label>
                                <input name="lng" type="number" step="any" defaultValue={place?.lng || ''} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <input name="rating" type="number" step="0.1" max="5" defaultValue={place?.rating || ''} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Metadata (JSON)</label>
                            <p className="text-xs text-gray-500 mb-2">Dữ liệu bổ sung dạng JSON (ví dụ: tags, relatedTo...)</p>
                            <textarea
                                name="metadata"
                                defaultValue={place?.metadata ? JSON.stringify(place.metadata, null, 2) : '{}'}
                                rows={6}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] font-mono text-sm"
                                onChange={(e) => {
                                    try {
                                        JSON.parse(e.target.value)
                                        setJsonError('')
                                    } catch (err) {
                                        setJsonError('Invalid JSON format')
                                    }
                                }}
                            />
                            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
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
                        disabled={isPending || !!jsonError}
                        className="flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a2f] transition-all disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Lưu địa điểm
                    </button>
                </div>
            </form>
        </div>
    )
}
