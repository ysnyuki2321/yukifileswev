import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigrations() {
  console.log('🚀 Starting database migrations...')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const migrations = [
    '01-create-database-schema.sql',
    '02-auth-columns.sql', 
    '03-plans-and-flags.sql',
    '04-seed-demo-user.sql'
  ]

  console.log(`📋 Found ${migrations.length} migration files`)

  for (const migration of migrations) {
    try {
      console.log(`⏳ Running migration: ${migration}`)
      
      const sqlPath = join(__dirname, migration)
      const sql = await readFile(sqlPath, 'utf8')
      
      // Split SQL by semicolons and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)
      
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement.trim() })
        if (error) {
          console.error(`❌ Error in ${migration}:`, error.message)
          // Continue with other statements
        }
      }
      
      console.log(`✅ Completed migration: ${migration}`)
    } catch (error) {
      console.error(`❌ Failed to run migration ${migration}:`, error.message)
      console.log('💡 You may need to run this SQL manually in Supabase SQL editor')
    }
  }

  console.log('🎉 Database migrations completed!')
  console.log('💡 If any migrations failed, please run them manually in Supabase SQL editor')
}

// Run migrations
runMigrations().catch(console.error)

