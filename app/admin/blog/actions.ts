
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

export async function deletePost(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    try {
        await prisma.post.delete({ where: { id } })
        revalidatePath('/admin/blog')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to delete' }
    }
}

export async function savePost(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    const isEdit = !!id

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('coverImage') as string
    const author = formData.get('author') as string

    // Content key handling
    // We assume the form sends a bunch of paragraphs joined by newlines, or we parse it.
    // For simplicity, let's say we have a text area "Content" and we split by double newline.
    const rawContent = formData.get('content') as string
    const contentArray = rawContent.split('\n\n').filter(p => p.trim() !== '')

    // Tags
    const hashtags = formData.get('tags') as string // "#travel, #vietnam"
    const tags = hashtags.split(',').map(t => t.trim()).filter(t => t !== '')

    try {
        if (isEdit) {
            await prisma.post.update({
                where: { id },
                data: {
                    title, slug, excerpt, coverImage, author, tags,
                    content: contentArray // stored as Json (array of strings)
                }
            })
        } else {
            await prisma.post.create({
                data: {
                    title, slug, excerpt, coverImage, author, tags,
                    content: contentArray
                }
            })
        }
    } catch (e) {
        console.error(e)
        return { error: `Failed to ${isEdit ? 'update' : 'create'} post` }
    }

    revalidatePath('/admin/blog')
    redirect('/admin/blog')
}
