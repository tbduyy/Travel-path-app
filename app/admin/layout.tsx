
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, Users, MapPin, FileText, Info, Home } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check role
    const { data: profile } = await supabase.from('Profile').select('role').eq('email', user.email).single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    const navItems = [
        { name: 'Trang chủ', href: '/', icon: Home },
        { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
        { name: 'Người dùng', href: '/admin/users', icon: Users },
        { name: 'Địa điểm', href: '/admin/places', icon: MapPin },
        { name: 'Bài viết', href: '/admin/blog', icon: FileText },
        { name: 'Về chúng tôi', href: '/admin/about', icon: Info },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans text-[#1B4D3E]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1B4D3E] text-white flex flex-col fixed h-full z-50 shadow-xl">
                <div className="p-6 border-b border-[#2C6E5A]">
                    <Link href="/" className="block hover:opacity-80 transition-opacity">
                        <h1 className="text-2xl font-black uppercase tracking-widest">Travel Path</h1>
                    </Link>
                    <span className="text-xs text-[#00B14F] font-bold uppercase tracking-wider">Admin Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2C6E5A] transition-all group font-medium"
                        >
                            <item.icon size={20} className="text-[#00B14F] group-hover:text-white transition-colors" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#2C6E5A]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B14F] flex items-center justify-center text-xs font-bold">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.email}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
