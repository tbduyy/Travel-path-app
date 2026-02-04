
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    // Get redirect URL from form (defaults to '/')
    const redirectTo = (formData.get('redirectTo') as string) || '/'

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Check if locked
    const { data: profile } = await supabase.from('Profile').select('isLocked').eq('email', email).single()
    if (profile?.isLocked) {
        await supabase.auth.signOut()
        return { error: 'Tài khoản của bạn đã bị khóa.' }
    }

    revalidatePath('/', 'layout')
    // Return success instead of redirecting on server
    return { success: true, redirectTo }
}
