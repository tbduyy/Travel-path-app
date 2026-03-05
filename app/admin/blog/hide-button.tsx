'use client'

import { Eye, EyeOff } from 'lucide-react'
import { toggleHidePost } from './actions'

export default function HidePostButton({ id, isHidden }: { id: string, isHidden: boolean }) {
    return (
        <form
            action={async (formData) => {
                await toggleHidePost(formData)
            }}
        >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="isHidden" value={isHidden.toString()} />
            <button
                type="submit"
                className={`p-2 rounded-lg transition-colors ${isHidden
                        ? 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                        : 'hover:bg-orange-50 text-gray-500 hover:text-orange-600'
                    }`}
                title={isHidden ? "Hiện bài viết" : "Ẩn bài viết"}
            >
                {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </form>
    )
}
