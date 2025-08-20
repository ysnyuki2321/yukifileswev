# YukiFiles Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended)

1. **Fork/Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd yukifiles
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
     ```

### Option 2: Deploy to Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Set Environment Variables**
   - Add the same environment variables as above

3. **Deploy**
   - Railway will automatically deploy on push

### Option 3: Deploy to Netlify

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Set Environment Variables**
   - Add the same environment variables in Netlify dashboard

## 🔧 Manual Deployment Steps

### 1. Prepare Your Environment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the build locally
npm start
```

### 2. Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Migrations**
   ```sql
   -- Copy and run the SQL from SUPABASE_SETUP.md
   ```

3. **Configure Authentication**
   - Set redirect URLs in Supabase Auth settings
   - Add your production domain

### 3. Environment Variables

Create a `.env.local` file (for local development):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

For production, set these in your hosting platform's environment variables.

### 4. File Storage Setup

The application uses local file storage by default. For production, consider:

- **AWS S3**: For scalable file storage
- **Cloudflare R2**: For cost-effective storage
- **Supabase Storage**: For integrated storage

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to project settings
   - Add your custom domain
   - Update DNS records

2. **Update Supabase Settings**
   - Add your domain to allowed redirect URLs
   - Update site URL in Supabase Auth settings

3. **SSL Certificate**
   - Vercel automatically provides SSL
   - For other platforms, ensure SSL is enabled

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate keys regularly

### CORS Configuration
- Configure CORS in Supabase for your domain
- Restrict API access to your domain

### Rate Limiting
- The app includes built-in rate limiting
- Consider additional CDN-level protection

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Error Monitoring
- Set up Sentry or similar error tracking
- Monitor Supabase logs

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

3. **Database Connection**
   - Verify Supabase project is active
   - Check network connectivity
   - Verify RLS policies

4. **File Upload Issues**
   - Check storage directory permissions
   - Verify file size limits
   - Check quota settings

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize image formats

2. **Bundle Size**
   - Monitor bundle size with `@next/bundle-analyzer`
   - Remove unused dependencies

3. **Caching**
   - Implement proper caching headers
   - Use CDN for static assets

## 📈 Scaling Considerations

### Horizontal Scaling
- Vercel automatically scales
- Consider database connection pooling
- Implement proper session management

### Vertical Scaling
- Monitor resource usage
- Optimize database queries
- Use efficient file storage

## 🔧 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security advisories
- Backup database regularly
- Review and rotate API keys

### Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track performance metrics
- Monitor storage usage

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check Supabase status page
4. Review application logs

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database migrations run
- [ ] Authentication configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Performance optimized
- [ ] Security measures implemented