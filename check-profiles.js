
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

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, languages')

    if (error) {
        console.error('Error fetching profiles:', error)
        return
    }

    console.log('Profile Languages:')
    console.table(data)
}

checkProfiles()
