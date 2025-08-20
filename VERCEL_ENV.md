# 🔧 Vercel Environment Variables

## 📋 Copy these exact values to Vercel:

### Required Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://whnwnshkyavvqldovaci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indobnduc2hreWF2dnFsZG92YWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTY1MzMsImV4cCI6MjA3MTE5MjUzM30.p7q4AmPcHfdKIY8vZ0-KtMMxh36OKK-TnPhqpfbmf2E
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
DEBUG_MODE=false
```

## 🔑 How to get Service Role Key:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/whnwnshkyavvqldovaci
2. **Navigate to**: Settings > API
3. **Copy the "service_role" key** (not the anon key)
4. **Replace** `YOUR_SERVICE_ROLE_KEY_HERE` with the actual key

## 🗄️ Database Setup Required:

**Run this SQL in Supabase SQL Editor** (https://supabase.com/dashboard/project/whnwnshkyavvqldovaci/sql):

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

## 🔗 Supabase Auth Configuration:

After deployment, configure Supabase Auth:

1. **Go to**: Authentication > Settings
2. **Site URL**: `https://your-app.vercel.app`
3. **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`

## 🚀 Deploy Steps:

1. **Import repository**: `ysnyuki2321/yukifileswev`
2. **Select branch**: `cursor/fix-user-account-and-home-page-issues-96ce`
3. **Add environment variables** (copy from above)
4. **Deploy**

## ✅ Verification:

After deployment, test:
- ✅ Home page loads
- ✅ Registration works
- ✅ Login works
- ✅ Dashboard accessible
- ✅ File upload works

---

**Note**: Replace `https://your-app.vercel.app` with your actual Vercel domain after deployment.