'use client'

import { Trash2 } from 'lucide-react'
import { deletePost } from './actions'

export default function DeletePostButton({ id }: { id: string }) {
    return (
        <form action={deletePost} onSubmit={(e) => { if (!confirm('Xóa bài viết này?')) e.preventDefault() }}>
            <input type="hidden" name="id" value={id} />
            <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={18} />
            </button>
        </form>
    )
}
