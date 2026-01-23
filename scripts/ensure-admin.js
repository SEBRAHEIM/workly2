const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensureAdmin() {
    const email = 'workly.day@outlook.com';
    const password = 'Emirates385.';

    console.log(`Ensuring admin user exists: ${email}`);

    // 1. Check if user exists in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    let user = users.find(u => u.email === email);

    if (!user) {
        console.log('Creating new admin user in Auth...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });

        if (createError) {
            console.error('Error creating user:', createError);
            return;
        }
        user = newUser.user;
        console.log('User created successfully.');
    } else {
        console.log('User already exists in Auth. Updating password and metadata...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });
        if (updateError) {
            console.error('Error updating user:', updateError);
        } else {
            console.log('User updated successfully.');
        }
    }

    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            role: 'admin',
            full_name: 'Workly Admin',
            is_verified: true,
            status: 'active'
        });

    if (upsertError) {
        console.error('Error upserting profile:', upsertError);
    } else {
        console.log('Profile successfully configured as admin.');
    }
}

ensureAdmin().catch(console.error);
