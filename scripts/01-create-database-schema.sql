-- YukiFiles Database Schema
-- Create tables for file sharing system with payment integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with subscription info
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Subscription info
    subscription_type VARCHAR(20) DEFAULT 'free' CHECK (subscription_type IN ('free', 'paid')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    quota_used BIGINT DEFAULT 0, -- in bytes
    quota_limit BIGINT DEFAULT 2147483648, -- 2GB for free users
    
    -- Admin flag
    is_admin BOOLEAN DEFAULT FALSE,
    
    -- Anti-clone protection
    device_fingerprint TEXT,
    last_ip INET,
    registration_ip INET,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(500) NOT NULL,
    stored_name VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 hash for deduplication
    
    -- Sharing
    is_public BOOLEAN DEFAULT TRUE,
    share_token VARCHAR(32) UNIQUE NOT NULL,
    download_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
    
    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Transactions table for payment tracking
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment info
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('paypal', 'crypto')),
    payment_id VARCHAR(255), -- PayPal transaction ID or crypto tx hash
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    
    -- Crypto specific
    crypto_address VARCHAR(255),
    crypto_currency VARCHAR(10),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- IP logs for anti-clone protection
CREATE TABLE IF NOT EXISTS ip_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    -- VPN/Proxy detection
    is_vpn BOOLEAN DEFAULT FALSE,
    is_proxy BOOLEAN DEFAULT FALSE,
    is_residential BOOLEAN DEFAULT TRUE,
    country_code VARCHAR(2),
    
    -- Action tracking
    action VARCHAR(50) NOT NULL, -- 'login', 'register', 'upload', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_share_token ON files(share_token);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_ip_logs_user_id ON ip_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_logs_ip_address ON ip_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_logs_created_at ON ip_logs(created_at DESC);

-- Create default admin user
INSERT INTO users (email, is_admin, subscription_type, quota_limit) 
VALUES ('ysnyuki2321@outlook.jp', TRUE, 'paid', 5368709120) -- 5GB for admin
ON CONFLICT (email) DO UPDATE SET 
    is_admin = TRUE,
    subscription_type = 'paid',
    quota_limit = 5368709120;

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES
    ('paypal_client_id', ''),
    ('paypal_client_secret', ''),
    ('blockcypher_api_key', ''),
    ('btc_wallet_address', ''),
    ('ltc_wallet_address', ''),
    ('eth_wallet_address', ''),
    ('monthly_price_usd', '1.00'),
    ('free_quota_gb', '2'),
    ('paid_quota_gb', '5')
ON CONFLICT (setting_key) DO NOTHING;
