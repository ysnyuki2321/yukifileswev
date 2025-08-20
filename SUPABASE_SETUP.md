# Supabase Setup Guide

## Overview
YukiFiles uses Supabase for user authentication and data storage. This guide will help you set up Supabase for the application.

## Prerequisites
- A Supabase account (free tier available)
- Node.js and npm/pnpm installed
- Basic knowledge of environment variables

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `yukifiles` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  device_fingerprint TEXT,
  registration_ip INET,
  last_ip INET,
  is_admin BOOLEAN DEFAULT FALSE,
  auth_provider TEXT DEFAULT 'email',
  is_verified BOOLEAN DEFAULT FALSE,
  quota_used BIGINT DEFAULT 0,
  quota_limit BIGINT DEFAULT 2147483648, -- 2GB in bytes
  files_count INTEGER DEFAULT 0,
  subscription_type TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  file_hash TEXT,
  share_token TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  first_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action_type)
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_share_token ON files(share_token);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Files policies
CREATE POLICY "Users can view own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Public files can be viewed by anyone
CREATE POLICY "Public files are viewable by all" ON files
  FOR SELECT USING (is_public = true);

-- Rate limits and activities are managed by the application
CREATE POLICY "Service role can manage rate limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage activities" ON user_activities
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Save the settings

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Visit `http://localhost:3000`
3. You should see the connection status showing "Database connected"
4. Try registering a new account
5. Try logging in with the registered account

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure the database tables were created successfully

### Authentication Issues
- Verify redirect URLs are configured correctly
- Check that RLS policies are in place
- Ensure the users table has the correct structure

### File Upload Issues
- Check that the storage directory exists and is writable
- Verify file size limits in your plan configuration
- Check database connection for file metadata storage

## Production Deployment

For production deployment:

1. Update environment variables with production URLs
2. Configure proper redirect URLs in Supabase
3. Set up proper CORS settings
4. Configure email templates in Supabase Auth settings
5. Set up proper backup and monitoring

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong database passwords
- Regularly rotate API keys
- Monitor rate limits and suspicious activities
- Keep Supabase and dependencies updated

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the application logs
3. Verify all environment variables are set correctly
4. Test with a fresh Supabase project if needed