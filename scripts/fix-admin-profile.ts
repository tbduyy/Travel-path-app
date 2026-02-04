
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@travelpath.io.vn';
    console.log(`Fixing admin profile for: ${email}`);

    // 1. Get Real User ID from Supabase
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users from Supabase:', error);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`User ${email} not found in Supabase Auth!`);
        console.log('Available users:', users.map(u => u.email));
        return;
    }

    console.log(`Found Supabase User ID: ${user.id}`);

    // 2. Check for existing Profile with this ID
    const existingProfileWithRealId = await prisma.profile.findUnique({
        where: { id: user.id }
    });

    if (existingProfileWithRealId) {
        console.log('Found existing profile with real ID. Updating role to admin...');
        await prisma.profile.update({
            where: { id: user.id },
            data: { role: 'admin' }
        });
    } else {
        // 3. Check if there is a profile with email but WRONG ID (from seed)
        const profileByEmail = await prisma.profile.findUnique({
            where: { email: email }
        });

        if (profileByEmail) {
            console.log(`Found profile by email with ID: ${profileByEmail.id}. Deleting and recreating with Real ID...`);
            // Delete old one
            await prisma.profile.delete({
                where: { email: email }
            });
        } else {
            console.log('No existing profile found. Creating new admin profile...');
        }

        // Create new correct profile
        await prisma.profile.create({
            data: {
                id: user.id, // THE CRITICAL FIX
                email: email,
                role: 'admin'
            }
        });
    }

    console.log('SUCCESS: Admin profile synced with real Supabase ID.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
