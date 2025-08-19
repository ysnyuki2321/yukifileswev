-- Plans and stronger anti-clone flags

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS plan VARCHAR(16) DEFAULT 'free' CHECK (plan IN ('free','paid','developer','team','enterprise')),
  ADD COLUMN IF NOT EXISTS suspended_clone_check BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS max_accounts INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS upload_limit_bytes BIGINT DEFAULT 209715200; -- 200MB default

-- Initialize plan-related quotas based on chosen plan
-- This script can be re-run; it sets defaults for NULLs only
UPDATE users SET plan = 'free' WHERE plan IS NULL;
UPDATE users SET quota_limit = 2147483648 WHERE quota_limit IS NULL; -- 2GB

