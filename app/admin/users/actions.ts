
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function toggleLockUser(formData: FormData) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: adminProfile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
    if (adminProfile?.role !== 'admin') return { error: 'Unauthorized' }

    const targetEmail = formData.get('email') as string
    const currentStatus = formData.get('currentStatus') === 'true'

    try {
        // Update Prisma Profile
        await prisma.profile.update({
            where: { email: targetEmail },
            data: { isLocked: !currentStatus }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to update user status' }
    }
}

export async function deleteUser(formData: FormData) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    const { data: adminProfile } = await supabase.from('Profile').select('role').eq('email', user.email).single()
    if (adminProfile?.role !== 'admin') return { error: 'Unauthorized' }

    const targetId = formData.get('id') as string // User ID (auth.users id)

    try {
        // Delete from Supabase Auth (Functionality restricted via Client usually, needs Service Role Key)
        // Since we are using standard client, we might not have permission to delete from auth.users directly without Service Role.
        // However, we can delete the Profile in DB.

        // Use Supabase Admin Client (Service Role) if available?
        // We only initialized `createClient` with Anon key in Utils.
        // We'll need to update `utils/supabase/server.ts` or create a new `admin.ts` to use Service Role for Auth deletion.
        // For now, let's just delete the Profile in DB (soft delete effectively as they can't login if we also lock them, but real delete needs Admin API).

        // Deleting Profile
        const targetEmail = formData.get('email') as string
        await prisma.profile.delete({
            where: { email: targetEmail }
        })

        // NOTE: Does NOT delete from auth.users without Service Role.
        // The user can still technically "login" to Supabase Auth, but our Login Action checks Profile.
        // So effective "ban" via deletion of profile.

        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to delete user' }
    }
}
