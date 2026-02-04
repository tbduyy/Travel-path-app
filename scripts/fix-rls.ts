
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Applying RLS policies...');

    try {
        // Enable RLS
        await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;`);
        console.log('RLS Enabled.');

        // GRANT SCHEMA PERMISSIONS (Often overlooked)
        await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;`);

        // GRANT Basic Permissions (Critical Step)
        await prisma.$executeRawUnsafe(`GRANT ALL ON "Profile" TO authenticated;`);
        await prisma.$executeRawUnsafe(`GRANT SELECT ON "Profile" TO anon;`);
        console.log('Granted Table Permissions.');

        // Drop existing policies
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view own profile" ON "Profile";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update own profile" ON "Profile";`);

        // Create SELECT policy
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can view own profile" 
            ON "Profile" 
            FOR SELECT 
            USING (auth.uid()::text = id);
        `);
        console.log('SELECT policy created.');

        // Create UPDATE policy
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can update own profile" 
            ON "Profile" 
            FOR UPDATE 
            USING (auth.uid()::text = id);
        `);
        console.log('UPDATE policy created.');

        console.log('SUCCESS: RLS policies applied.');
    } catch (error) {
        console.error('Error applying policies:', error);
    }
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
