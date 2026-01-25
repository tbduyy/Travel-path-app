
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

export async function saveAboutContent(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const vision = formData.get('vision') as string
    const mission = formData.get('mission') as string

    try {
        await prisma.siteContent.upsert({
            where: { key: 'vision' },
            create: { key: 'vision', content: vision },
            update: { content: vision }
        })
        await prisma.siteContent.upsert({
            where: { key: 'mission' },
            create: { key: 'mission', content: mission },
            update: { content: mission }
        })
    } catch (e) {
        return { error: 'Failed to save content' }
    }

    revalidatePath('/about')
    revalidatePath('/admin/about')
    return { success: true }
}
