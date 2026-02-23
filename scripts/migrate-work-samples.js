const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const slugMapping = {
    'strategy-reports': 'reports-essays',
    'visual-presentations': 'presentations-ppt',
    'group-projects': 'group-projects',
    'math-data': 'excel-data',
    'programming-tech': 'programming-tech'
};

async function migrateWorkSamples() {
    console.log('Fetching portfolio items...');
    const { data: items, error } = await supabase
        .from('portfolio_items')
        .select('id, category_slug');

    if (error) {
        console.error('Error fetching portfolio items:', error);
        return;
    }

    console.log(`Found ${items.length} work samples. Starting migration...`);

    for (const item of items) {
        const newSlug = slugMapping[item.category_slug];

        if (newSlug && newSlug !== item.category_slug) {
            console.log(`Updating item ${item.id}: ${item.category_slug} -> ${newSlug}`);
            const { error: updateError } = await supabase
                .from('portfolio_items')
                .update({ category_slug: newSlug })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Error updating item ${item.id}:`, updateError);
            }
        } else {
            console.log(`Skipping item ${item.id} (slug: ${item.category_slug})`);
        }
    }

    console.log('Migration complete.');
}

migrateWorkSamples();
