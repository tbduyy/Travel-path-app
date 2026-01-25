
import { PrismaClient } from '@prisma/client'
import { deletePlace } from './actions'
import { Plus, Pencil, Trash2, MapPin, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import DeletePlaceButton from './delete-button'

async function getPlaces(query?: string) {
    const where = query ? {
        OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { city: { contains: query, mode: 'insensitive' as const } }
        ]
    } : {}

    return await prisma.place.findMany({
        where,
        orderBy: { name: 'asc' },
        take: 50 // Limit for perf
    })
}

export default async function PlacesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const query = q || ''
    const places = await getPlaces(query)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Quản lý Địa điểm</h2>
                <Link
                    href="/admin/places/new"
                    className="flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#153a2f] transition-all"
                >
                    <Plus size={20} />
                    Thêm địa điểm
                </Link>
            </div>

            {/* Search Bar */}
            <form className="relative">
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="Tìm kiếm địa điểm..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hình ảnh</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tên địa điểm</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Loại</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Thành phố</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {places.map((place) => (
                            <tr key={place.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 w-24">
                                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                                        {place.image && (
                                            <Image
                                                src={place.image}
                                                alt={place.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    {place.name}
                                    <div className="text-xs font-normal text-gray-500 flex items-center gap-1 mt-0.5">
                                        <MapPin size={12} /> {place.address}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
                                        {place.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {place.city}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/places/${place.id}`}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </Link>

                                        <DeletePlaceButton id={place.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {places.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Chưa có dữ liệu địa điểm.
                        <br />
                        <span className="text-xs">Hãy đảm bảo bạn đã chạy Migration Data.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
