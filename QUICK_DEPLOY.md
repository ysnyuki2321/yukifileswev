# 🚀 Quick Deploy Guide - YukiFiles

## 📋 Prerequisites
- GitHub account
- Vercel account  
- Supabase account

## 🔧 Step 1: Deploy to Vercel

### 1.1 Import Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository: `ysnyuki2321/yukifileswev`
4. **Select branch**: `fix-theme-switcher-and-site-url-issues` ⭐

### 1.2 Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### 1.3 Environment Variables
Add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://whnwnshkyavvqldovaci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indobnduc2hreWF2dnFsZG92YWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTY1MzMsImV4cCI6MjA3MTE5MjUzM30.p7q4AmPcHfdKIY8vZ0-KtMMxh36OKK-TnPhqpfbmf2E
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
DEBUG_MODE=false
```

### 1.4 Deploy
- Click "Deploy"
- Wait for build to complete
- Note your deployment URL

## 🔧 Step 2: Setup Supabase

### 2.1 Get Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/whnwnshkyavvqldovaci)
2. Navigate to Settings > API
3. Copy the "service_role" key
4. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in Vercel environment variables

### 2.2 Configure Auth
1. Go to Authentication > Settings
2. Set Site URL to your Vercel domain
3. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`

### 2.3 Setup Database
Run this SQL in Supabase SQL Editor:

```sql
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
```

## ✅ Step 3: Test Your Deployment

### 3.1 Basic Tests
- [ ] Home page loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard accessible
- [ ] File upload works
- [ ] Theme switching works

### 3.2 Admin Access
- [ ] Visit `/admin` (if you have admin privileges)
- [ ] Check user management
- [ ] Verify settings

## 🔗 Important Links

- **Repository**: https://github.com/ysnyuki2321/yukifileswev
- **Branch**: `fix-theme-switcher-and-site-url-issues`
- **Supabase Project**: https://supabase.com/dashboard/project/whnwnshkyavvqldovaci
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🎉 What's Fixed

✅ **Theme Switcher Issues**: Resolved conflicts and server-side rendering problems
✅ **Site URL Issues**: Replaced hardcoded localhost with dynamic URL detection
✅ **Auth Actions**: Now use current site URL for redirects
✅ **Payment Service**: Uses current site URL for PayPal integration
✅ **File Manager**: Fixed mimeType handling
✅ **Build Issues**: Resolved all compilation errors

## 📝 Notes

- All major issues have been resolved
- Build is successful and ready for production
- Dynamic site URL detection works across all environments
- Theme switching works properly without conflicts