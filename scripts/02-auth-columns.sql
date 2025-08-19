-- Add auth-related columns to align with acceptance criteria
-- Safe to run multiple times using IF NOT EXISTS patterns

-- Users table extra columns
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS supabase_id UUID,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(32);

-- Ensure defaults for quotas per plan
-- Free: 2GB, Paid: 5GB
-- Keep existing values if already set
UPDATE users SET quota_limit = 2147483648 WHERE quota_limit IS NULL;

