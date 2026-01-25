
'use client'

import { useActionState } from 'react'
import { saveAboutContent } from './actions'
import { Loader2, Save } from 'lucide-react'

const initialState = {
    error: '',
    success: false
}

export default function AboutAdminPage({
    vision,
    mission
}: {
    vision: string,
    mission: string
}) {
    const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
        const res = await saveAboutContent(formData)
        if (res?.success) return { success: true, error: '' }
        return { success: false, error: res?.error || '' }
    }, initialState)

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Quản lý Trang Giới thiệu</h2>

            <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-bold text-[#1B4D3E] mb-2">Tầm nhìn (Vision)</label>
                        <p className="text-sm text-gray-500 mb-2">Nội dung hiển thị trong phần Tầm nhìn của trang Về chúng tôi.</p>
                        <textarea
                            name="vision"
                            defaultValue={vision}
                            rows={6}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-bold text-[#1B4D3E] mb-2">Sứ mệnh (Mission)</label>
                        <p className="text-sm text-gray-500 mb-2">Nội dung hiển thị trong phần Sứ mệnh.</p>
                        <textarea
                            name="mission"
                            defaultValue={mission}
                            rows={6}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B14F] text-base"
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="text-green-600 text-sm font-medium text-center bg-green-50 p-2 rounded">
                        Lưu nội dung thành công!
                    </div>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a2f] transition-all disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    )
}
