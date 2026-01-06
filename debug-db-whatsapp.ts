
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function debug() {
    console.log('Checking database connection...')

    // Check Columns
    const { data: cols, error: colError } = await supabase.rpc('get_columns_debug', { table_name: 'profiles' })
    if (colError) {
        console.log('RPC check failed (expected if not exists), trying raw query')
        // Alternate check: select one record
        const { data: test, error: testError } = await supabase.from('profiles').select('*').limit(1).single()
        if (testError) {
            console.error('Test query failed:', testError.message)
        } else {
            console.log('Table columns found:', Object.keys(test))
            if ('whatsapp_phone' in test) {
                console.log('✅ whatsapp_phone column exists!')
            } else {
                console.log('❌ whatsapp_phone column IS MISSING!')
            }
        }
    } else {
        console.log('Columns:', cols)
    }

    // Check specific creator if possible
    // We don't have the ID easily here, but we can list all with phones
    const { data: creators, error: creatorError } = await supabase.from('profiles').select('id, full_name, whatsapp_phone').not('whatsapp_phone', 'is', null)
    if (creatorError) {
        console.error('Error fetching profiles with phones:', creatorError.message)
    } else {
        console.log('Profiles with WhatsApp phones:', creators)
    }
}

debug()
