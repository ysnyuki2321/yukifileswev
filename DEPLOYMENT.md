# 🚀 Deploy YukiFiles to Vercel

Hướng dẫn chi tiết để deploy ứng dụng YukiFiles lên Vercel.

## 📋 Prerequisites

- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com)
- [Supabase account](https://supabase.com)

## 🔧 Bước 1: Setup Supabase

### 1.1 Tạo Supabase Project
1. Truy cập [supabase.com](https://supabase.com)
2. Click "New Project"
3. Chọn organization và database password
4. Chọn region gần nhất
5. Click "Create new project"

### 1.2 Lấy Credentials
Sau khi project được tạo, vào **Settings > API** để lấy:
- **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
- **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 1.3 Setup Database
1. Vào **SQL Editor** trong Supabase Dashboard
2. Chạy migration script:
```bash
pnpm run migrate:db
```

Hoặc chạy SQL thủ công trong SQL Editor:

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

## 🚀 Bước 2: Deploy to Vercel

### 2.1 Connect GitHub Repository
1. Truy cập [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git repository: `ysnyuki2321/yukifileswev`
4. Chọn branch: `cursor/fix-user-account-and-home-page-issues-96ce`

### 2.2 Configure Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### 2.3 Environment Variables
Thêm các environment variables sau:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Optional: Debug Mode
DEBUG_MODE=false
```

### 2.4 Deploy
Click "Deploy" và chờ quá trình build hoàn tất.

## 🔧 Bước 3: Post-Deployment Setup

### 3.1 Configure Supabase Auth
1. Vào Supabase Dashboard > **Authentication > Settings**
2. Thêm domain Vercel vào **Site URL**:
   ```
   https://your-app.vercel.app
   ```
3. Thêm redirect URLs:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/dashboard
   ```

### 3.2 Update Admin Settings
Vào Supabase SQL Editor và chạy:

```sql
-- Update site URL
UPDATE admin_settings 
SET setting_value = 'https://your-app.vercel.app' 
WHERE setting_key = 'site_url';

-- Create admin user (optional)
INSERT INTO users (email, is_admin, is_verified, subscription_type) 
VALUES ('your-email@example.com', true, true, 'paid')
ON CONFLICT (email) DO UPDATE SET is_admin = true;
```

### 3.3 Test Application
1. Truy cập `https://your-app.vercel.app`
2. Test đăng ký tài khoản mới
3. Test đăng nhập
4. Test upload files
5. Test các tính năng khác

## 🔒 Bước 4: Security & Performance

### 4.1 Enable HTTPS
Vercel tự động cung cấp HTTPS certificate.

### 4.2 Custom Domain (Optional)
1. Vào Vercel Dashboard > **Settings > Domains**
2. Thêm custom domain
3. Cập nhật DNS records
4. Update `NEXT_PUBLIC_SITE_URL` trong environment variables

### 4.3 Monitoring
- **Vercel Analytics**: Tự động enabled
- **Error Tracking**: Xem logs trong Vercel Dashboard
- **Performance**: Monitor trong **Analytics** tab

## 🐛 Troubleshooting

### Build Errors
```bash
# Check build logs in Vercel Dashboard
# Common issues:
# 1. Missing environment variables
# 2. Supabase connection issues
# 3. TypeScript errors
```

### Runtime Errors
```bash
# Check Function Logs in Vercel Dashboard
# Common issues:
# 1. Database connection
# 2. Auth configuration
# 3. CORS issues
```

### Database Issues
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check admin settings
SELECT * FROM admin_settings;
```

## 📊 Monitoring & Analytics

### Vercel Dashboard
- **Deployments**: Xem tất cả deployments
- **Functions**: Monitor serverless functions
- **Analytics**: Traffic và performance
- **Logs**: Real-time logs

### Supabase Dashboard
- **Database**: Monitor queries và performance
- **Auth**: User management và sessions
- **Storage**: File uploads và usage
- **Logs**: API requests và errors

## 🔄 Continuous Deployment

### Automatic Deploys
- Push to `main` branch = auto deploy
- Pull requests = preview deployments
- Branch deployments = staging environment

### Environment Variables
- **Production**: Set in Vercel Dashboard
- **Preview**: Inherit from production
- **Development**: Use `.env.local`

## 📱 Mobile & PWA

### PWA Features
- Responsive design
- Offline support (cached assets)
- Install prompt
- Background sync

### Mobile Optimization
- Touch-friendly interface
- Fast loading
- Optimized images
- Smooth animations

## 🎯 Next Steps

1. **Custom Domain**: Setup custom domain
2. **Analytics**: Add Google Analytics
3. **Monitoring**: Setup error tracking (Sentry)
4. **Backup**: Setup database backups
5. **Scaling**: Monitor performance và scale khi cần

## 📞 Support

Nếu gặp vấn đề:
1. Check Vercel logs
2. Check Supabase logs
3. Review environment variables
4. Test locally với `pnpm dev`
5. Create issue trên GitHub

---

🎉 **Chúc mừng!** Ứng dụng YukiFiles đã được deploy thành công lên Vercel!