
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import PostForm from '../form'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await prisma.post.findUnique({
        where: { id }
    })

    if (!post) return notFound()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let role = ''
    if (user) {
        const { data: profile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
        role = profile?.role || ''
    }

    return <PostForm post={post} role={role} />
}
