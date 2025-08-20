-- YukiFiles Database Schema and Queries
-- This file contains the database structure and common queries for the YukiFiles application

-- Create database
CREATE DATABASE yukifiles_db;
USE yukifiles_db;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    storage_limit BIGINT DEFAULT 2147483648, -- 2GB in bytes
    storage_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Files table
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    size BIGINT NOT NULL,
    hash VARCHAR(64) NOT NULL,
    storage_path TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- File shares table
CREATE TABLE file_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_token VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    expires_at TIMESTAMP,
    max_downloads INTEGER,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File versions table
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    size BIGINT NOT NULL,
    hash VARCHAR(64) NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, version_number)
);

-- File tags table
CREATE TABLE file_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, tag_name)
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_files_hash ON files(hash);
CREATE INDEX idx_file_shares_token ON file_shares(share_token);
CREATE INDEX idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX idx_file_tags_file_id ON file_tags(file_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Insert sample data
INSERT INTO users (email, password_hash, first_name, last_name, is_verified, is_admin) VALUES
('admin@yukifiles.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'Admin', 'User', TRUE, TRUE),
('user@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'John', 'Doe', TRUE, FALSE),
('test@yukifiles.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'Test', 'User', TRUE, FALSE);

-- Common queries

-- Get user's files with metadata
SELECT 
    f.id,
    f.name,
    f.original_name,
    f.mime_type,
    f.size,
    f.download_count,
    f.view_count,
    f.created_at,
    f.updated_at,
    array_agg(ft.tag_name) as tags
FROM files f
LEFT JOIN file_tags ft ON f.id = ft.file_id
WHERE f.user_id = $1 AND f.is_deleted = FALSE
GROUP BY f.id
ORDER BY f.created_at DESC;

-- Get file shares for a user
SELECT 
    fs.id,
    fs.share_token,
    fs.expires_at,
    fs.max_downloads,
    fs.download_count,
    fs.is_active,
    fs.created_at,
    f.name as file_name,
    f.size as file_size
FROM file_shares fs
JOIN files f ON fs.file_id = f.id
WHERE fs.user_id = $1
ORDER BY fs.created_at DESC;

-- Get storage usage by user
SELECT 
    u.id,
    u.email,
    u.storage_limit,
    u.storage_used,
    ROUND((u.storage_used::DECIMAL / u.storage_limit) * 100, 2) as usage_percentage,
    COUNT(f.id) as file_count
FROM users u
LEFT JOIN files f ON u.id = f.user_id AND f.is_deleted = FALSE
WHERE u.id = $1
GROUP BY u.id;

-- Get recent activity for a user
SELECT 
    al.action,
    al.resource_type,
    al.details,
    al.created_at
FROM activity_logs al
WHERE al.user_id = $1
ORDER BY al.created_at DESC
LIMIT 50;

-- Search files by name or tags
SELECT 
    f.id,
    f.name,
    f.original_name,
    f.mime_type,
    f.size,
    f.created_at,
    array_agg(ft.tag_name) as tags
FROM files f
LEFT JOIN file_tags ft ON f.id = ft.file_id
WHERE f.user_id = $1 
    AND f.is_deleted = FALSE
    AND (
        f.name ILIKE $2 
        OR f.original_name ILIKE $2
        OR ft.tag_name ILIKE $2
    )
GROUP BY f.id
ORDER BY f.created_at DESC;

-- Get file statistics
SELECT 
    COUNT(*) as total_files,
    SUM(size) as total_size,
    COUNT(DISTINCT mime_type) as unique_types,
    AVG(size) as avg_file_size,
    MAX(created_at) as latest_upload
FROM files 
WHERE user_id = $1 AND is_deleted = FALSE;

-- Get popular files (most downloaded)
SELECT 
    f.id,
    f.name,
    f.original_name,
    f.download_count,
    f.view_count,
    f.created_at
FROM files f
WHERE f.user_id = $1 AND f.is_deleted = FALSE
ORDER BY f.download_count DESC, f.view_count DESC
LIMIT 10;

-- Get files by type
SELECT 
    mime_type,
    COUNT(*) as file_count,
    SUM(size) as total_size
FROM files 
WHERE user_id = $1 AND is_deleted = FALSE
GROUP BY mime_type
ORDER BY file_count DESC;

-- Clean up expired sessions
DELETE FROM user_sessions 
WHERE expires_at < CURRENT_TIMESTAMP;

-- Clean up expired shares
UPDATE file_shares 
SET is_active = FALSE 
WHERE expires_at < CURRENT_TIMESTAMP AND expires_at IS NOT NULL;

-- Get user dashboard stats
SELECT 
    (SELECT COUNT(*) FROM files WHERE user_id = u.id AND is_deleted = FALSE) as total_files,
    (SELECT COUNT(*) FROM file_shares WHERE user_id = u.id AND is_active = TRUE) as active_shares,
    (SELECT COUNT(*) FROM activity_logs WHERE user_id = u.id AND created_at > CURRENT_DATE - INTERVAL '7 days') as recent_activity,
    u.storage_used,
    u.storage_limit,
    ROUND((u.storage_used::DECIMAL / u.storage_limit) * 100, 2) as usage_percentage
FROM users u
WHERE u.id = $1;

-- Create a new file share
INSERT INTO file_shares (file_id, user_id, share_token, password_hash, expires_at, max_downloads)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, share_token;

-- Update file download count
UPDATE files 
SET download_count = download_count + 1, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Update file view count
UPDATE files 
SET view_count = view_count + 1, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- Log user activity
INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- Get file version history
SELECT 
    fv.version_number,
    fv.size,
    fv.hash,
    fv.created_at
FROM file_versions fv
WHERE fv.file_id = $1
ORDER BY fv.version_number DESC;

-- Add tags to a file
INSERT INTO file_tags (file_id, tag_name)
VALUES ($1, $2)
ON CONFLICT (file_id, tag_name) DO NOTHING;

-- Remove tags from a file
DELETE FROM file_tags 
WHERE file_id = $1 AND tag_name = ANY($2);

-- Get files by tag
SELECT 
    f.id,
    f.name,
    f.original_name,
    f.mime_type,
    f.size,
    f.created_at
FROM files f
JOIN file_tags ft ON f.id = ft.file_id
WHERE f.user_id = $1 
    AND f.is_deleted = FALSE
    AND ft.tag_name = $2
ORDER BY f.created_at DESC;