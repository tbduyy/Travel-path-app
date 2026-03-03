
import { notFound } from "next/navigation";
import BlogPostContent from "./content";
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

// Allow on-demand rendering for new blog slugs created after build
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
}

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
