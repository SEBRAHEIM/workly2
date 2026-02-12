
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
        env[match[1]] = value.trim()
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
        .select('*')
        .limit(1)

    if (data && data.length > 0) {
        console.log('Columns in projects:', Object.keys(data[0]))
        console.log('Revision tracking present:',
            'revisions_total' in data[0] && 'revisions_used' in data[0]
        )
    }
    if (error) console.log('Error:', error)
}

checkProject()
