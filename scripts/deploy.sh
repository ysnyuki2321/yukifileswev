#!/bin/bash

# 🚀 YukiFiles Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting YukiFiles deployment to Vercel..."

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

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm i -g vercel"
        exit 1
    fi
    print_success "Vercel CLI is installed"
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    if ! vercel whoami &> /dev/null; then
        print_warning "You are not logged in to Vercel. Please login:"
        vercel login
    fi
    print_success "Logged in to Vercel"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
        exit 1
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        print_error "SUPABASE_SERVICE_ROLE_KEY is not set"
        exit 1
    fi
    
    print_success "Environment variables are set"
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    pnpm install
    
    # Build the project
    print_status "Building with Next.js..."
    pnpm build
    
    print_success "Project built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if project is already linked
    if [ -f ".vercel/project.json" ]; then
        print_status "Project is already linked to Vercel"
        vercel --prod
    else
        print_status "Linking project to Vercel..."
        vercel --prod --yes
    fi
    
    print_success "Deployment completed!"
}

# Post-deployment setup
post_deployment() {
    print_status "Post-deployment setup..."
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        print_success "Deployment URL: $DEPLOYMENT_URL"
        echo ""
        echo "🔧 Next steps:"
        echo "1. Update Supabase Auth settings with URL: $DEPLOYMENT_URL"
        echo "2. Add redirect URLs:"
        echo "   - $DEPLOYMENT_URL/auth/callback"
        echo "   - $DEPLOYMENT_URL/dashboard"
        echo "3. Test the application"
        echo "4. Configure custom domain (optional)"
    fi
}

# Main deployment function
main() {
    echo "🎯 YukiFiles Deployment Script"
    echo "================================"
    echo ""
    
    # Run checks
    check_vercel_cli
    check_vercel_auth
    check_env_vars
    
    # Build and deploy
    build_project
    deploy_to_vercel
    post_deployment
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📚 For more information, see DEPLOYMENT.md"
}

# Run the main function
main "$@"