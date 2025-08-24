# 🚀 YukiFiles Demo - Deployment Guide

## 📋 Overview

This guide covers deploying YukiFiles Demo to various platforms including Render, Vercel, and Docker.

## 🌐 Render Deployment

### Prerequisites
- Render account
- GitHub repository connected

### Steps
1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `yukifiles-demo`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm start`
   - **Plan**: Starter (free tier)

3. **Environment Variables**
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

### Troubleshooting Render
- **Lockfile Issues**: Ensure `pnpm-lock.yaml` is up to date
- **Build Failures**: Check build logs for dependency issues
- **Start Failures**: Verify `startCommand` uses correct package manager

## 🐳 Docker Deployment

### Local Docker Build
```bash
# Build image
docker build -t yukifiles-demo .

# Run container
docker run -p 3000:3000 yukifiles-demo
```

### Docker Compose
```yaml
version: '3.8'
services:
  yukifiles-demo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Production Docker
```bash
# Multi-stage build for production
docker build --target production -t yukifiles-demo:prod .

# Run with production settings
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --name yukifiles-demo \
  yukifiles-demo:prod
```

## ⚡ Vercel Deployment

### Prerequisites
- Vercel account
- Vercel CLI installed

### Steps
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Vercel Configuration
- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Environment File Structure
```
.env.local          # Local development
.env.production     # Production build
.env.development    # Development build
```

## 📦 Build Optimization

### Pre-build Steps
1. **Update Dependencies**
   ```bash
   pnpm install
   ```

2. **Verify Lockfile**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Clean Build**
   ```bash
   rm -rf .next
   pnpm run build
   ```

### Build Commands
```bash
# Development
pnpm run dev

# Production Build
pnpm run build

# Start Production
pnpm start

# Lint Check
pnpm run lint
```

## 🚨 Common Issues & Solutions

### 1. Lockfile Mismatch
**Problem**: `pnpm-lock.yaml` out of sync with `package.json`
**Solution**: 
```bash
rm pnpm-lock.yaml
pnpm install
```

### 2. Build Failures
**Problem**: Dependencies not installed
**Solution**:
```bash
rm -rf node_modules
pnpm install
pnpm run build
```

### 3. Start Command Issues
**Problem**: `next` command not found
**Solution**: Ensure `next` is in `dependencies`, not `devDependencies`

### 4. Port Conflicts
**Problem**: Port 3000 already in use
**Solution**: Change port in `package.json` scripts or use environment variable

## 🔍 Health Checks

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: GET
- **Expected Response**: `{ "status": "ok", "timestamp": "..." }`

### Custom Health Check
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  })
}
```

## 📊 Monitoring & Logs

### Render Logs
- **Build Logs**: Available in service dashboard
- **Runtime Logs**: Real-time logs in service view
- **Error Tracking**: Automatic error reporting

### Docker Logs
```bash
# View container logs
docker logs yukifiles-demo

# Follow logs
docker logs -f yukifiles-demo

# Logs with timestamps
docker logs -t yukifiles-demo
```

### Vercel Logs
- **Function Logs**: Available in function dashboard
- **Build Logs**: Shown during deployment
- **Analytics**: Performance and usage metrics

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### GitLab CI
```yaml
deploy:
  stage: deploy
  script:
    - curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json"
  only:
    - main
```

## 🎯 Production Checklist

### Before Deployment
- [ ] All tests pass
- [ ] Dependencies are up to date
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Health check endpoint working

### After Deployment
- [ ] Application accessible via URL
- [ ] Health check returns 200
- [ ] Demo features working
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable

### Monitoring
- [ ] Set up error tracking
- [ ] Configure performance monitoring
- [ ] Set up uptime alerts
- [ ] Monitor resource usage

## 🆘 Support

### Render Support
- [Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

### Vercel Support
- [Documentation](https://vercel.com/docs)
- [Community](https://github.com/vercel/vercel/discussions)
- [Status Page](https://vercel-status.com)

### Docker Support
- [Documentation](https://docs.docker.com)
- [Community](https://forums.docker.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/docker)

---

**Happy Deploying! 🚀**