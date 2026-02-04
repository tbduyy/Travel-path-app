
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { data: profile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
    return profile?.role === 'admin'
}

export async function deletePlace(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    try {
        await prisma.place.delete({ where: { id } })
        revalidatePath('/admin/places')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to delete' }
    }
}

export async function savePlace(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const id = formData.get('id') as string // If present, it's edit
    const isEdit = !!id

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const address = formData.get('address') as string
    const type = formData.get('type') as string
    const city = formData.get('city') as string
    const price = formData.get('price') as string
    const image = formData.get('image') as string

    // Parse numeric/float
    const latStr = formData.get('lat') as string
    const lngStr = formData.get('lng') as string
    const ratingStr = formData.get('rating') as string

    const lat = latStr ? parseFloat(latStr) : null
    const lng = lngStr ? parseFloat(lngStr) : null
    const rating = ratingStr ? parseFloat(ratingStr) : 0

    // Metadata (JSON)
    const metadataStr = formData.get('metadata') as string
    let metadata = {}
    try {
        metadata = JSON.parse(metadataStr)
    } catch (e) {
        // Fallback or ignore
    }

    try {
        if (isEdit) {
            await prisma.place.update({
                where: { id },
                data: {
                    name, description, address, type, city, price,
                    images: image ? [image] : [], // Map to array
                    lat, lng, rating, metadata
                }
            })
        } else {
            await prisma.place.create({
                data: {
                    name, description, address, type, city, price,
                    images: image ? [image] : [], // Map to array
                    lat, lng, rating, metadata
                }
            })
        }
    } catch (e) {
        console.error(e)
        return { error: `Failed to ${isEdit ? 'update' : 'create'} place` }
    }

    revalidatePath('/admin/places')
    redirect('/admin/places')
}
