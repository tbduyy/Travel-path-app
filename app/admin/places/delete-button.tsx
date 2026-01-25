'use client'

import { Trash2 } from 'lucide-react'
import { deletePlace } from './actions'

export default function DeletePlaceButton({ id }: { id: string }) {
    return (
        <form
            action={async (formData) => {
                await deletePlace(formData)
            }}
            onSubmit={(e) => { if (!confirm('Xóa địa điểm này?')) e.preventDefault() }}
        >
            <input type="hidden" name="id" value={id} />
            <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={18} />
            </button>
        </form>
    )
}
