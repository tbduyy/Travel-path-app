import { createClient } from '@/utils/supabase/server'
import PostForm from '../form'

export default async function NewPostPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let role = ''
    if (user) {
        const { data: profile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
        role = profile?.role || ''
    }

    return <PostForm role={role} />
}
