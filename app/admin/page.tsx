
import { PrismaClient } from '@prisma/client'
import { Users, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getStats() {
    // Determine counts. Prisma might fail if Profile table not synced yet.
    // Using try-catch to be safe.
    try {
        const userCount = await prisma.profile.count()
        const placeCount = await prisma.place.count()
        const postCount = await prisma.post.count()
        return { userCount, placeCount, postCount }
    } catch (e) {
        return { userCount: 0, placeCount: 0, postCount: 0 }
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const cards = [
        { name: 'Người dùng', value: stats.userCount, icon: Users, color: 'bg-blue-500', href: '/admin/users' },
        { name: 'Địa điểm', value: stats.placeCount, icon: MapPin, color: 'bg-orange-500', href: '/admin/places' },
        { name: 'Bài viết', value: stats.postCount, icon: FileText, color: 'bg-purple-500', href: '/admin/blog' },
    ]

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Tổng quan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        href={card.href}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center gap-6 group"
                    >
                        <div className={`w-16 h-16 rounded-2xl ${card.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-8 h-8 ${card.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{card.name}</p>
                            <p className="text-4xl font-black text-[#1B4D3E] mt-1">{card.value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4">Chào mừng Administrator!</h3>
                <p className="text-gray-600">Hệ thống quản trị Travel Path. Sử dụng menu bên trái để quản lý nội dung.</p>
            </div>
        </div>
    )
}
