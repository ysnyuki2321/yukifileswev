# YukiFiles - Secure File Sharing Platform

A modern, secure file sharing platform built with Next.js, Supabase, and TypeScript. Features enterprise-grade security, beautiful UI, and comprehensive user management.

## ✨ Features

### 🔐 Authentication & Security
- **Supabase Auth Integration** - Secure user authentication with email verification
- **Anti-Fraud Protection** - Advanced device fingerprinting and rate limiting
- **Enterprise Security** - Bank-level encryption and secure file sharing
- **Role-based Access Control** - Admin and user roles with different permissions

### 📁 File Management
- **Drag & Drop Upload** - Intuitive file upload interface
- **File Preview** - Preview images, documents, and videos directly in browser
- **Smart Sharing** - Create shareable links with password protection and expiration
- **Storage Management** - Track storage usage with visual progress indicators

### 🎨 Modern UI/UX
- **Beautiful Design** - Modern gradient design with purple/pink theme
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Hover effects and transitions for better UX
- **Dark Mode** - Eye-friendly dark theme optimized for productivity

### 💼 Pricing Plans
- **Free Plan** - 2GB storage, basic features
- **Pro Plan** - 50GB storage, advanced features ($9.99/month)
- **Developer Plan** - 200GB storage, API access ($19.99/month)
- **Team Plan** - 1TB storage, team management ($39.99/month)
- **Enterprise Plan** - Unlimited storage, custom solutions

### 🚀 Performance
- **Global CDN** - Lightning-fast file delivery worldwide
- **Optimized Loading** - Suspense and skeleton loading states
- **Caching** - Intelligent caching for better performance
- **Analytics** - Track downloads, views, and engagement

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth with email verification
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and server actions

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### 1. Clone the repository
```bash
git clone <repository-url>
cd yukifiles
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Debug Mode
DEBUG_MODE=false
```

### 4. Database Setup
Run the database migration script:

```bash
pnpm run migrate:db
```

This will create the necessary tables in your Supabase database.

### 5. Start Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  supabase_id UUID REFERENCES auth.users(id),
  subscription_type TEXT DEFAULT 'free',
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 2147483648, -- 2GB
  is_admin BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  original_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Settings Table
```sql
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration

### Admin Settings
Configure the application through the admin settings table:

```sql
-- Enable debug mode
INSERT INTO admin_settings (setting_key, setting_value) VALUES ('debug_mode', 'true');

-- Set brand name
INSERT INTO admin_settings (setting_key, setting_value) VALUES ('brand_name', 'YukiFiles');

-- Set site URL
INSERT INTO admin_settings (setting_key, setting_value) VALUES ('site_url', 'http://localhost:3000');

-- Auto-verify users (for testing)
INSERT INTO admin_settings (setting_key, setting_value) VALUES ('auth_auto_verify', 'true');
```

### Debug Mode
Debug mode allows you to:
- Access the application without Supabase configuration
- Use mock data for testing
- Bypass authentication for development

Enable debug mode by setting `DEBUG_MODE=true` in your environment variables or through admin settings.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Usage

### For Users
1. **Register** - Create a free account with email verification
2. **Upload Files** - Drag and drop files to upload
3. **Share Files** - Generate shareable links with optional password protection
4. **Manage Storage** - Monitor storage usage and upgrade plans as needed

### For Admins
1. **Access Admin Panel** - Use admin credentials to access admin features
2. **Manage Users** - View and manage user accounts
3. **Configure Settings** - Update application settings
4. **Monitor Usage** - Track platform usage and analytics

## 🔒 Security Features

- **Rate Limiting** - Prevents abuse with IP-based rate limiting
- **Device Fingerprinting** - Advanced anti-fraud protection
- **Email Verification** - Required email confirmation for new accounts
- **Secure File Storage** - Encrypted file storage with access controls
- **Session Management** - Secure session handling with automatic logout

## 🎨 Customization

### Theme Colors
Modify the color scheme by updating the gradient classes in the components:

```css
/* Primary gradient */
bg-gradient-to-r from-purple-500 to-pink-500

/* Secondary gradients for different plans */
from-blue-500 to-cyan-500    /* Free */
from-emerald-500 to-teal-500 /* Developer */
from-orange-500 to-red-500   /* Team */
from-indigo-500 to-purple-500 /* Enterprise */
```

### Branding
Update the brand name and logo in:
- `components/ui/navigation.tsx`
- `app/layout.tsx`
- Admin settings table

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@yukifiles.com
- Documentation: [docs.yukifiles.com](https://docs.yukifiles.com)

## 🔄 Changelog

### v1.0.0 (Latest)
- ✨ Complete redesign with modern UI
- 🔐 Enhanced Supabase integration
- 💼 New pricing plans (Free/Pro/Developer/Team/Enterprise)
- 🎨 Improved UX for login and registration
- 🛡️ Better security and anti-fraud protection
- 📱 Responsive design improvements
- 🚀 Performance optimizations

---

Built with ❤️ using Next.js and Supabase
