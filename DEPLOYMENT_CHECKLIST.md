# 🚀 Deployment Checklist - YukiFiles

## ✅ Pre-Deployment Checks

### 1. Code Quality
- [x] Build successful (`pnpm build`)
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] All imports resolved
- [x] Theme switcher working properly
- [x] Site URL issues fixed

### 2. Branch & Repository
- [x] Branch created: `fix-theme-switcher-and-site-url-issues`
- [x] Branch pushed to GitHub
- [x] All changes committed
- [x] No uncommitted files

### 3. Configuration Files
- [x] `package.json` - All dependencies listed
- [x] `next.config.mjs` - Build configuration
- [x] `vercel.json` - Vercel deployment config
- [x] `tsconfig.json` - TypeScript config
- [x] `postcss.config.mjs` - PostCSS config
- [x] `components.json` - UI components config

### 4. Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://whnwnshkyavvqldovaci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indobnduc2hreWF2dnFsZG92YWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTY1MzMsImV4cCI6MjA3MTE5MjUzM30.p7q4AmPcHfdKIY8vZ0-KtMMxh36OKK-TnPhqpfbmf2E
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
DEBUG_MODE=false
```

### 5. Database Setup Required
- [ ] Run SQL migration in Supabase
- [ ] Create users table
- [ ] Create files table
- [ ] Create admin_settings table
- [ ] Insert default settings

## 🚀 Vercel Deployment Steps

### 1. Import Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository: `ysnyuki2321/yukifileswev`
4. Select branch: `fix-theme-switcher-and-site-url-issues`

### 2. Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### 3. Environment Variables
Add all required environment variables from section 4 above.

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Note the deployment URL

## 🔧 Post-Deployment Setup

### 1. Supabase Configuration
1. Go to Supabase Dashboard
2. Navigate to Authentication > Settings
3. Set Site URL to your Vercel domain
4. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`

### 2. Database Migration
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

## ✅ Post-Deployment Testing

### 1. Basic Functionality
- [ ] Home page loads
- [ ] Navigation works
- [ ] Theme switching works
- [ ] Responsive design

### 2. Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Email verification
- [ ] Password reset
- [ ] Logout works

### 3. Dashboard & Files
- [ ] Dashboard accessible
- [ ] File upload works
- [ ] File management
- [ ] File sharing
- [ ] Storage quota

### 4. Admin Features
- [ ] Admin panel accessible
- [ ] User management
- [ ] Settings management
- [ ] Debug mode

### 5. Payment Integration
- [ ] PayPal integration
- [ ] Crypto payment
- [ ] Subscription upgrade

## 🔗 Important Links

- **Repository**: https://github.com/ysnyuki2321/yukifileswev
- **Branch**: `fix-theme-switcher-and-site-url-issues`
- **Supabase Project**: https://supabase.com/dashboard/project/whnwnshkyavvqldovaci
- **Vercel Dashboard**: https://vercel.com/dashboard

## 📝 Notes

- All theme switcher issues have been resolved
- Site URL detection is now dynamic
- Auth actions use current site URL
- Payment service uses current site URL
- File manager handles edge cases
- Build is successful and ready for deployment