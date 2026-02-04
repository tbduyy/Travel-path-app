
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

// Simulating Client (Browser)
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function main() {
    console.log('--- Checking RLS Policies ---');

    // 1. Sign In
    const email = 'admin@travelpath.io.vn';
    const password = '123456'; // User provided this

    console.log(`Attempting login for ${email}...`);
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError || !user) {
        console.error('Login Failed:', loginError?.message);
        return;
    }

    console.log(`Login Successful. User ID: ${user.id}`);

    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session Active:', !!session);
    console.log('Access Token exists:', !!session?.access_token);

    // 2. Try to read Profile
    console.log('Attempting to read own Profile (Authenticated)...');
    const { data: profile, error: profileError } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Profile Read Error (Authenticated):', profileError);

        // Try Service Role
        console.log('Attempting to read Profile (Service Role)...');
        const serviceClient = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const { data: adminProfile, error: adminError } = await serviceClient
            .from('Profile')
            .select('*')
            .eq('id', user.id)
            .single();

        if (adminError) {
            console.error('Profile Read Error (Service Role):', adminError);
        } else {
            console.log('Profile Read Success (Service Role):', adminProfile);
        }

    } else {
        console.log('Profile Read Success (Authenticated):', profile);
    }
}

main();
