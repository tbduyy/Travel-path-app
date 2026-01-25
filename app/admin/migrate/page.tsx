
'use client'

import { useActionState } from 'react'
import { migrateData } from './actions'
import { Loader2, Database } from 'lucide-react'

const initialState = {
    success: false,
    stats: null as any,
}

export default function MigratePage() {
    const [state, formAction, isPending] = useActionState(async (_prev: any) => {
        const res = await migrateData()
        return res
    }, initialState)

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Migration Data</h2>
            <p className="text-gray-600">
                Sử dụng chức năng này để chuyển đổi dữ liệu mẫu (Nha Trang, Blog) vào Cơ sở dữ liệu chính thức.
                Hành động này an toàn để chạy nhiều lần (sẽ bỏ qua nếu dữ liệu đã tồn tại).
            </p>

            <form action={formAction}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">

                    <div className="bg-blue-50 p-6 rounded-full">
                        <Database size={48} className="text-blue-600" />
                    </div>

                    {state?.success ? (
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-green-600">Thành công!</h3>
                            <p className="text-gray-600">Đã thêm {state.stats.posts} bài viết và {state.stats.places} địa điểm.</p>
                            {state.stats.errors.length > 0 && (
                                <div className="mt-4 text-left bg-red-50 p-4 rounded-xl text-xs text-red-600 max-w-md overflow-auto max-h-40">
                                    <p className="font-bold mb-2">Lỗi:</p>
                                    {state.stats.errors.map((e: string, i: number) => <div key={i}>{e}</div>)}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sẵn sàng đồng bộ</h3>
                            <p className="text-gray-500 mb-6">Nhấn nút bên dưới để bắt đầu quá trình.</p>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-[#1B4D3E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a2f] transition-all disabled:opacity-50 flex items-center gap-3 mx-auto"
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : "Bắt đầu Migration"}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
