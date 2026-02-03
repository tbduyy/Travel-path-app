
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    // Get redirect URL from form (defaults to '/')
    const redirectTo = (formData.get('redirectTo') as string) || '/'

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    })

    if (error) {
        console.error("Signup Error:", error)
        return { error: error.message }
    }

    console.log("Signup successful, User ID:", data.user?.id)
    console.log("Session exists?", !!data.session)

    if (data.user) {
        try {
            await prisma.profile.create({
                data: {
                    id: data.user.id,
                    email: email,
                    role: 'user', // Default role
                }
            })
        } catch (e) {
            console.error("Failed to create profile (might already exist):", e)
        }

        // Fallback: If no session retrieved (sometimes happens even with confirm disabled), try signing in
        if (!data.session) {
            console.log("No session returned from SignUp, attempting to SignIn...")
            const signInRes = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (signInRes.error) {
                console.error("Auto-login failed:", signInRes.error)
                return { error: "Đăng ký thành công nhưng không thể tự động đăng nhập. Vui lòng đăng nhập tay." }
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect(redirectTo)
}
