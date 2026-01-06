
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        env[key.trim()] = value.trim()
    }
})

const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY
const url = env.NEXT_PUBLIC_SUPABASE_URL

console.log('Using Key:', serviceKey ? 'SERVICE_ROLE (Hidden)' : 'ANON (Public)')

const supabase = createClient(
    url,
    serviceKey || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkProject() {
    const { data, error } = await supabase
        .from('projects')
        .select('id, status, current_price, creator_id, funds_status')
        .eq('id', '79834a35-b67e-4f7e-9151-a6bc3df4f4d4')
        .single()

    console.log('Project Status:', data)
    if (error) console.log('Error:', error)
}

checkProject()
