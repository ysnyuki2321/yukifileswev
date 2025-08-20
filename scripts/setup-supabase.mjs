#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://whnwnshkyavvqldovaci.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indobnduc2hreWF2dnFsZG92YWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTY1MzMsImV4cCI6MjA3MTE5MjUzM30.p7q4AmPcHfdKIY8vZ0-KtMMxh36OKK-TnPhqpfbmf2E'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('🚀 Setting up Supabase database...')

async function setupDatabase() {
  try {
    // Test connection
    console.log('📡 Testing connection...')
    const { data, error } = await supabase.from('admin_settings').select('*').limit(1)
    
    if (error) {
      console.log('⚠️  Database not initialized yet. Creating tables...')
      await createTables()
    } else {
      console.log('✅ Database connection successful!')
      await insertDefaultSettings()
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

async function createTables() {
  console.log('📋 Creating database tables...')
  
  // Note: We can't create tables via client, need to use SQL editor
  console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:')
  console.log('')
  console.log(`
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  supabase_id UUID REFERENCES auth.users(id),
  subscription_type TEXT DEFAULT 'free',
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 2147483648,
  is_admin BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  auth_provider TEXT DEFAULT 'email',
  device_fingerprint TEXT,
  registration_ip TEXT,
  last_ip TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES 
  ('brand_name', 'YukiFiles'),
  ('debug_mode', 'false'),
  ('auth_auto_verify', 'false')
ON CONFLICT (setting_key) DO NOTHING;
  `)
  console.log('')
  console.log('📝 After running the SQL, run this script again to verify setup.')
}

async function insertDefaultSettings() {
  console.log('⚙️  Inserting default settings...')
  
  const { error } = await supabase
    .from('admin_settings')
    .upsert([
      { setting_key: 'brand_name', setting_value: 'YukiFiles' },
      { setting_key: 'debug_mode', setting_value: 'false' },
      { setting_key: 'auth_auto_verify', setting_value: 'false' },
      { setting_key: 'site_url', setting_value: 'http://localhost:3000' }
    ])
  
  if (error) {
    console.error('❌ Failed to insert settings:', error.message)
  } else {
    console.log('✅ Default settings inserted!')
  }
}

async function testAuth() {
  console.log('🔐 Testing authentication...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@yukifiles.com',
      password: 'test123456'
    })
    
    if (error) {
      console.log('⚠️  Auth test result:', error.message)
    } else {
      console.log('✅ Authentication working!')
    }
  } catch (error) {
    console.log('⚠️  Auth test failed:', error.message)
  }
}

async function main() {
  await setupDatabase()
  await testAuth()
  
  console.log('')
  console.log('🎉 Setup completed!')
  console.log('')
  console.log('📋 Next steps:')
  console.log('1. Run the SQL commands in Supabase SQL Editor')
  console.log('2. Get your service role key from Settings > API')
  console.log('3. Add environment variables to Vercel')
  console.log('4. Deploy your application!')
}

main()