# 🌈 YukiFiles - Beautiful File Sharing Platform

A modern, secure, and beautiful file sharing platform built with Next.js, Supabase, and Tailwind CSS. Features rainbow gradient backgrounds, advanced authentication, and multiple pricing tiers.

![YukiFiles](https://img.shields.io/badge/YukiFiles-File%20Sharing%20Platform-purple?style=for-the-badge&logo=next.js)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Rainbow Gradient Backgrounds**: Animated moving rainbow gradients
- **Modern Design**: Clean, responsive interface with smooth animations
- **Dark Theme**: Beautiful dark mode with purple/pink accents
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### 🔐 Advanced Authentication
- **Supabase Auth**: Secure user authentication and management
- **Anti-Clone Protection**: Advanced fraud detection and prevention
- **Rate Limiting**: Built-in protection against abuse
- **Device Fingerprinting**: Enhanced security with device tracking

### 📁 File Management
- **Secure Upload**: Compressed file storage with deduplication
- **File Sharing**: Generate shareable links for files
- **Storage Quotas**: Plan-based storage limits
- **File Analytics**: Track upload/download statistics

### 💎 Multiple Pricing Tiers
- **Free**: 2GB storage, basic features
- **Pro**: 5GB storage, premium UI, priority support
- **Developer**: 8GB storage, API access, E2E encryption
- **Team**: 10GB storage, team management, 4K support
- **Enterprise**: Unlimited storage, custom solutions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yukifiles
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Follow the guide in `SUPABASE_SETUP.md`
   - Run the database migrations
   - Configure authentication settings

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Quick Deploy (Recommended)

Use our automated deployment script:

```bash
# Deploy to Vercel (recommended)
./scripts/deploy.sh vercel

# Deploy to Railway
./scripts/deploy.sh railway

# Deploy to Netlify
./scripts/deploy.sh netlify
```

### Manual Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ Project Structure

```
yukifiles/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── pricing/           # Pricing page
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── pricing/          # Pricing components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase configuration
│   ├── actions/          # Server actions
│   └── services/         # Business logic
├── scripts/              # Build and deployment scripts
├── storage/              # File storage (local)
└── public/               # Static assets
```

## 🎨 Customization

### Colors and Themes

The application uses a sophisticated color system:

- **Primary**: Purple to Pink gradients
- **Secondary**: Blue, Green, Orange variations
- **Rainbow**: 12-color animated gradients
- **Dark Theme**: Black backgrounds with transparency

### Styling

Built with Tailwind CSS and custom components:

```bash
# Customize colors in tailwind.config.js
# Modify components in components/ui/
# Update animations in globals.css
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

### Supabase Setup

1. Create a Supabase project
2. Run database migrations (see `SUPABASE_SETUP.md`)
3. Configure authentication settings
4. Set up storage buckets (optional)

## 📊 Performance

### Optimizations

- **Next.js 15**: Latest features and optimizations
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Built-in caching strategies
- **CDN**: Global content delivery

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Core Web Vitals tracking

## 🔒 Security

### Features

- **Row Level Security**: Database-level access control
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security
- **HTTPS Only**: Secure communication

### Best Practices

- Environment variables for secrets
- Regular dependency updates
- Security headers configuration
- Input sanitization
- Error message sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component reusability
- Write clear commit messages
- Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [API Documentation](./docs/API.md)

### Getting Help

- Check the troubleshooting section in deployment guide
- Review Supabase documentation
- Open an issue on GitHub
- Check application logs

## 🎯 Roadmap

### Upcoming Features

- [ ] Real-time file collaboration
- [ ] Advanced file preview
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Custom branding
- [ ] Webhook integrations
- [ ] Multi-language support

### Performance Improvements

- [ ] Edge caching
- [ ] Database optimization
- [ ] Image processing pipeline
- [ ] CDN integration
- [ ] Progressive Web App

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ and 🌈 by the YukiFiles team
