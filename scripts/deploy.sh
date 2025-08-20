#!/bin/bash

# YukiFiles Deployment Script
# This script helps deploy YukiFiles to various platforms

set -e

echo "🚀 YukiFiles Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Build the application
build_app() {
    print_status "Building the application..."
    npm run build
    print_success "Application built successfully"
}

# Test the build
test_build() {
    print_status "Testing the build..."
    if npm start &> /dev/null & then
        PID=$!
        sleep 5
        if curl -s http://localhost:3000 > /dev/null; then
            print_success "Build test passed"
            kill $PID
        else
            print_error "Build test failed"
            kill $PID
            exit 1
        fi
    else
        print_error "Failed to start the application"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    vercel --prod
    print_success "Deployed to Vercel successfully"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    railway login
    railway up
    print_success "Deployed to Railway successfully"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    netlify deploy --prod --dir=.next
    print_success "Deployed to Netlify successfully"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found"
        print_status "Creating .env.local template..."
        cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Add other environment variables as needed
EOF
        print_warning "Please update .env.local with your actual values"
    else
        print_success "Environment file found"
    fi
}

# Main deployment function
main() {
    local platform=$1
    
    echo "Starting deployment process..."
    
    # Pre-deployment checks
    check_node
    check_npm
    check_env
    
    # Build process
    install_deps
    build_app
    test_build
    
    # Deploy based on platform
    case $platform in
        "vercel")
            deploy_vercel
            ;;
        "railway")
            deploy_railway
            ;;
        "netlify")
            deploy_netlify
            ;;
        *)
            print_error "Unknown platform: $platform"
            print_status "Available platforms: vercel, railway, netlify"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
    print_status "Don't forget to:"
    print_status "1. Set environment variables in your hosting platform"
    print_status "2. Configure Supabase settings"
    print_status "3. Set up custom domain (if needed)"
}

# Show usage
show_usage() {
    echo "Usage: $0 [platform]"
    echo ""
    echo "Platforms:"
    echo "  vercel   - Deploy to Vercel (recommended)"
    echo "  railway  - Deploy to Railway"
    echo "  netlify  - Deploy to Netlify"
    echo ""
    echo "Examples:"
    echo "  $0 vercel"
    echo "  $0 railway"
    echo "  $0 netlify"
}

# Check if platform is provided
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

# Run main function
main "$1"