
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import BlogPostContent from "./content";
import prisma from '@/lib/prisma'


import { createClient } from '@/utils/supabase/server'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug }
    });

    if (!post) {
        notFound();
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let canEdit = false
    if (user) {
        const { data: profile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
        canEdit = profile?.role === 'admin'
    }

    return <BlogPostContent post={post} canEdit={canEdit} />;
}
