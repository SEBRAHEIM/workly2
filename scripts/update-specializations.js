const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for migration

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const slugMapping = {
    'strategy-reports': 'reports-essays',
    'visual-presentations': 'presentations-ppt',
    'corporate-group-projects': 'group-projects',
    'advanced-data-analytics': 'excel-data',
    'full-stack-development': 'programming-tech',
    'custom-creative-solutions': 'other-tasks',
};

async function migrateSpecializations() {
    console.log('Fetching profiles...');
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, display_name, specializations')
        .eq('role', 'creator');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} creators. Starting migration...`);

    for (const profile of profiles) {
        if (!profile.specializations || profile.specializations.length === 0) continue;

        const newSpecializations = profile.specializations.map(slug => slugMapping[slug] || slug);

        // Only update if something changed
        if (JSON.stringify(newSpecializations) !== JSON.stringify(profile.specializations)) {
            console.log(`Updating ${profile.display_name}: [${profile.specializations}] -> [${newSpecializations}]`);
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ specializations: newSpecializations })
                .eq('id', profile.id);

            if (updateError) {
                console.error(`Error updating ${profile.display_name}:`, updateError);
            }
        }
    }

    console.log('Migration complete.');
}

migrateSpecializations();
