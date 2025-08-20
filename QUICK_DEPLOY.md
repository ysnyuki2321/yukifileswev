# 🚀 Quick Deploy to Vercel

## ✅ Code đã sẵn sàng deploy!

Ứng dụng YukiFiles đã được sửa lỗi và build thành công. Bây giờ bạn có thể deploy lên Vercel.

## 📋 Deploy Steps

### 1. Truy cập Vercel
- Vào [vercel.com](https://vercel.com)
- Đăng nhập hoặc tạo tài khoản

### 2. Import Repository
- Click "New Project"
- Import Git repository: `ysnyuki2321/yukifileswev`
- Chọn branch: `cursor/fix-user-account-and-home-page-issues-96ce`

### 3. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `pnpm build` (auto-detected)
- **Install Command**: `pnpm install` (auto-detected)

### 4. Environment Variables
Thêm các environment variables sau:

```env
# Supabase Configuration (Bắt buộc)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Optional: Debug Mode
DEBUG_MODE=false
```

### 5. Deploy
- Click "Deploy"
- Chờ build hoàn tất (khoảng 2-3 phút)

## 🔧 Setup Supabase (Nếu chưa có)

### 1. Tạo Supabase Project
- Vào [supabase.com](https://supabase.com)
- Click "New Project"
- Chọn organization và database password
- Chọn region gần nhất

### 2. Lấy Credentials
- Vào **Settings > API**
- Copy **Project URL** và **anon public key**
- Vào **Settings > API > service_role** để lấy service role key

### 3. Setup Database
Chạy SQL sau trong **SQL Editor**:

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

## 🔗 Post-Deployment Setup

### 1. Configure Supabase Auth
- Vào Supabase Dashboard > **Authentication > Settings**
- Thêm domain Vercel vào **Site URL**: `https://your-app.vercel.app`
- Thêm redirect URLs:
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-app.vercel.app/dashboard`

### 2. Test Application
- Truy cập `https://your-app.vercel.app`
- Test đăng ký tài khoản mới
- Test đăng nhập
- Test upload files

## 🎯 Repository Info

- **Repository**: `https://github.com/ysnyuki2321/yukifileswev`
- **Branch**: `cursor/fix-user-account-and-home-page-issues-96ce`
- **Build Status**: ✅ Success
- **TypeScript**: ✅ No errors
- **Dependencies**: ✅ All installed

## 🚨 Troubleshooting

### Build Errors
- Kiểm tra environment variables đã được set đúng chưa
- Đảm bảo Supabase project đã được tạo và credentials đúng

### Runtime Errors
- Kiểm tra Supabase Auth settings
- Đảm bảo database tables đã được tạo
- Xem logs trong Vercel Dashboard

### Database Issues
- Chạy SQL setup trong Supabase SQL Editor
- Kiểm tra RLS policies đã được enable

## 📞 Support

Nếu gặp vấn đề:
1. Check Vercel build logs
2. Check Supabase logs
3. Review environment variables
4. Test locally với `pnpm dev`

---

🎉 **Chúc mừng!** Ứng dụng YukiFiles đã sẵn sàng deploy lên Vercel!