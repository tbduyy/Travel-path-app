
import { ShieldAlert, ShieldCheck, Lock, Unlock } from 'lucide-react'
import UserActions from './user-actions'
import prisma from '@/lib/prisma'

async function getUsers() {
    try {
        return await prisma.profile.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) {
        return []
    }
}

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Quản lý người dùng</h2>
                <div className="text-sm font-medium text-gray-500">
                    Tổng số: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role === 'admin' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {user.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                                        {user.isLocked ? 'Đã khóa' : 'Hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <UserActions user={user} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Chưa có người dùng nào.
                    </div>
                )}
            </div>
        </div>
    )
}
