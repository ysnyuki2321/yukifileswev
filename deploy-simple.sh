#!/bin/bash

echo "🚀 Deploying YukiFiles to Vercel..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Building project...${NC}"
pnpm build

echo -e "${BLUE}Step 2: Preparing for deployment...${NC}"

# Create a simple deployment package
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp package.json deploy/
cp pnpm-lock.yaml deploy/
cp vercel.json deploy/
cp next.config.mjs deploy/

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps for deployment:${NC}"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Vercel will automatically detect Next.js"
echo "   - Click 'Deploy'"
echo ""
echo "3. Or use Vercel CLI (if you have access):"
echo "   vercel --prod"
echo ""
echo -e "${GREEN}🎉 Your application is ready for deployment!${NC}"