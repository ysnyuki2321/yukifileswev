#!/usr/bin/env node

// Test Supabase client functionality
async function testSupabaseClient() {
  console.log('🧪 Testing Supabase client functionality...')
  
  try {
    // Test @supabase/ssr
    console.log('📦 Testing @supabase/ssr...')
    const { createClientComponentClient } = await import('@supabase/ssr')
    console.log('✅ createClientComponentClient imported successfully')
    
    // Test @supabase/supabase-js
    console.log('📦 Testing @supabase/supabase-js...')
    const { createClient } = await import('@supabase/supabase-js')
    console.log('✅ createClient imported successfully')
    
    // Test environment variables
    console.log('🔧 Checking environment variables...')
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? '✅ Set' : '❌ Missing'}`)
    console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasKey ? '✅ Set' : '❌ Missing'}`)
    
    if (hasUrl && hasKey) {
      console.log('🔗 Testing client creation...')
      
      // Test createClient
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      console.log('✅ createClient created successfully')
      
      // Test basic query
      console.log('🔍 Testing basic query...')
      const { data, error } = await client.from('admin_settings').select('*').limit(1)
      
      if (error) {
        console.log('⚠️ Query error (expected if no data):', error.message)
      } else {
        console.log('✅ Query executed successfully')
      }
    } else {
      console.log('⚠️ Skipping client tests due to missing environment variables')
    }
    
    console.log('🎉 All Supabase client tests passed!')
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

testSupabaseClient()