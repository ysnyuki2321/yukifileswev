#!/usr/bin/env node

// Test Supabase connection and setup
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 Testing Supabase Connection...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file contains:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://whnwnshkyavvqldovaci.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log(`📍 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...`)

// Test connection with anon key
const supabase = createClient(supabaseUrl, supabaseKey)

try {
  console.log('\n🔍 Testing basic connection...')
  
  // Test basic connection
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1)
  
  if (error) {
    console.log('⚠️  Table "users" might not exist yet, which is normal for a new setup')
    console.log('Error:', error.message)
  } else {
    console.log('✅ Successfully connected to Supabase!')
    console.log('📊 Users table accessible')
  }
  
  // Test auth
  console.log('\n🔐 Testing authentication...')
  const { data: authData, error: authError } = await supabase.auth.getSession()
  
  if (authError) {
    console.log('⚠️  Auth error (normal if no session):', authError.message)
  } else {
    console.log('✅ Auth service accessible')
  }
  
  // Test with service role key if available
  if (serviceRoleKey) {
    console.log('\n🛡️  Testing service role key...')
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey)
    
    const { data: adminData, error: adminError } = await adminSupabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (adminError) {
      console.log('⚠️  Service role test failed:', adminError.message)
    } else {
      console.log('✅ Service role key working')
    }
  }
  
  console.log('\n🎉 Supabase connection test completed!')
  console.log('\n📋 Next steps:')
  console.log('1. Run database migrations: npm run migrate:db')
  console.log('2. Start the development server: npm run dev')
  console.log('3. Visit the demo: http://localhost:3000/demo')
  
} catch (error) {
  console.error('❌ Connection test failed:', error.message)
  process.exit(1)
}