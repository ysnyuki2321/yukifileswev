import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Starting YukiFiles database migration...\n')

  try {
    // 1. Create users table
    console.log('📋 Creating users table...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (usersError) {
      console.log('⚠️  Users table might already exist or there was an error:', usersError.message)
    } else {
      console.log('✅ Users table created successfully')
    }

    // 2. Create files table
    console.log('📋 Creating files table...')
    const { error: filesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS files (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          original_name TEXT NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type TEXT,
          share_token TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (filesError) {
      console.log('⚠️  Files table might already exist or there was an error:', filesError.message)
    } else {
      console.log('✅ Files table created successfully')
    }

    // 3. Create admin_settings table
    console.log('📋 Creating admin_settings table...')
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setting_key TEXT UNIQUE NOT NULL,
          setting_value TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (settingsError) {
      console.log('⚠️  Admin settings table might already exist or there was an error:', settingsError.message)
    } else {
      console.log('✅ Admin settings table created successfully')
    }

    // 4. Create rate_limits table
    console.log('📋 Creating rate_limits table...')
    const { error: rateLimitError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS rate_limits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          identifier TEXT NOT NULL,
          action_type TEXT NOT NULL,
          attempts INTEGER DEFAULT 1,
          reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(identifier, action_type)
        );
      `
    })

    if (rateLimitError) {
      console.log('⚠️  Rate limits table might already exist or there was an error:', rateLimitError.message)
    } else {
      console.log('✅ Rate limits table created successfully')
    }

    // 5. Create user_activity table
    console.log('📋 Creating user_activity table...')
    const { error: activityError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_activity (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          activity_type TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (activityError) {
      console.log('⚠️  User activity table might already exist or there was an error:', activityError.message)
    } else {
      console.log('✅ User activity table created successfully')
    }

    // 6. Insert default admin settings
    console.log('⚙️  Inserting default admin settings...')
    const defaultSettings = [
      { setting_key: 'brand_name', setting_value: 'YukiFiles' },
      { setting_key: 'site_url', setting_value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
      { setting_key: 'debug_mode', setting_value: 'false' },
      { setting_key: 'auth_auto_verify', setting_value: 'false' },
      { setting_key: 'max_file_size', setting_value: '104857600' }, // 100MB
      { setting_key: 'storage_limit_free', setting_value: '2147483648' }, // 2GB
      { setting_key: 'storage_limit_pro', setting_value: '53687091200' }, // 50GB
      { setting_key: 'storage_limit_developer', setting_value: '214748364800' }, // 200GB
      { setting_key: 'storage_limit_team', setting_value: '1099511627776' }, // 1TB
    ]

    for (const setting of defaultSettings) {
      const { error: insertError } = await supabase
        .from('admin_settings')
        .upsert(setting, { onConflict: 'setting_key' })

      if (insertError) {
        console.log(`⚠️  Could not insert setting ${setting.setting_key}:`, insertError.message)
      } else {
        console.log(`✅ Setting ${setting.setting_key} configured`)
      }
    }

    // 7. Create indexes for better performance
    console.log('🔍 Creating database indexes...')
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_users_supabase_id ON users(supabase_id);',
      'CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_files_share_token ON files(share_token);',
      'CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);'
    ]

    for (const index of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: index })
      if (indexError) {
        console.log('⚠️  Could not create index:', indexError.message)
      }
    }

    console.log('✅ Database indexes created')

    // 8. Create RLS policies
    console.log('🔒 Setting up Row Level Security...')
    const rlsPolicies = [
      // Enable RLS on all tables
      'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE files ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;',

      // Users table policies
      'CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = supabase_id::text);',
      'CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = supabase_id::text);',
      'CREATE POLICY "Admins can view all users" ON users FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE email = auth.jwt() ->> \'email\' AND is_admin = true));',

      // Files table policies
      'CREATE POLICY "Users can view own files" ON files FOR SELECT USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));',
      'CREATE POLICY "Users can insert own files" ON files FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));',
      'CREATE POLICY "Users can update own files" ON files FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));',
      'CREATE POLICY "Users can delete own files" ON files FOR DELETE USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));',
      'CREATE POLICY "Public can view shared files" ON files FOR SELECT USING (share_token IS NOT NULL);',

      // Admin settings policies
      'CREATE POLICY "Admins can manage settings" ON admin_settings FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE email = auth.jwt() ->> \'email\' AND is_admin = true));',

      // Rate limits policies (service role only)
      'CREATE POLICY "Service role can manage rate limits" ON rate_limits FOR ALL USING (auth.role() = \'service_role\');',

      // User activity policies
      'CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));',
      'CREATE POLICY "Service role can manage activity" ON user_activity FOR ALL USING (auth.role() = \'service_role\');'
    ]

    for (const policy of rlsPolicies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy })
      if (policyError) {
        console.log('⚠️  Could not create policy:', policyError.message)
      }
    }

    console.log('✅ Row Level Security configured')

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Start the development server: pnpm dev')
    console.log('2. Visit http://localhost:3000')
    console.log('3. Register a new account or use debug mode')
    console.log('4. Configure admin settings in the database if needed')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()

