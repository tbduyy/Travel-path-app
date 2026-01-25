'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Image as ImageIcon, Upload } from 'lucide-react'

type ImageUploadProps = {
    bucket?: string
    onUpload: (url: string) => void
    label?: string
}

export default function ImageUpload({ bucket = 'blog', onUpload, label = 'Upload Image' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setError('')

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const supabase = createClient()

            // 1. Upload file
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // 2. Get Public URL
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            onUpload(data.publicUrl)

        } catch (error: any) {
            console.error('Upload Error:', error)
            setError('Upload failed: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors w-fit">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                <span className="font-medium text-sm">{uploading ? 'Uploading...' : label}</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}
