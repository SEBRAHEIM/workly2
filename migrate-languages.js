
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        env[match[1]] = value
    }
})

const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY
const url = env.NEXT_PUBLIC_SUPABASE_URL

const supabase = createClient(url, serviceKey)

async function migrateLanguages() {
    console.log('Fetching profiles with "Arabic" language...')

    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, languages')
        .contains('languages', ['Arabic'])

    if (fetchError) {
        console.error('Error fetching profiles:', fetchError)
        return
    }

    console.log(`Found ${profiles.length} profiles to update.`)

    for (const profile of profiles) {
        const newLanguages = profile.languages.map(lang => lang === 'Arabic' ? 'العربية' : lang)

        // Ensure no duplicates if they already have العربية
        const uniqueLanguages = [...new Set(newLanguages)]

        console.log(`Updating profile ${profile.id}: [${profile.languages.join(', ')}] -> [${uniqueLanguages.join(', ')}]`)

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ languages: uniqueLanguages })
            .eq('id', profile.id)

        if (updateError) {
            console.error(`Error updating profile ${profile.id}:`, updateError)
        }
    }

    console.log('Migration complete.')
}

migrateLanguages()
