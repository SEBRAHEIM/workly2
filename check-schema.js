
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

const supabase = createClient(
    url,
    serviceKey
)

async function checkSchema() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error fetching profiles:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Columns in profiles:', Object.keys(data[0]))
    } else {
        console.log('No data in profiles, attempting to fetch a single row by common ID if exists...')
        // Try another way to get columns if table is empty
        const { data: cols, error: colError } = await supabase.rpc('get_column_names', { table_name: 'profiles' })
        if (colError) {
            console.log('Table might be empty. Columns cannot be inferred from data.')
        } else {
            console.log('Columns:', cols)
        }
    }
}

checkSchema()
