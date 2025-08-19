-- Seed a demo account for plan review (read-only / non-usable in prod)
INSERT INTO users (email, is_admin, subscription_type, quota_limit, plan, is_active, is_verified)
VALUES (
  'demo@yukifile.shockbyte.me',
  TRUE,
  'paid',
  1099511627776, -- 1TB just for demo illusion
  'team',
  TRUE,
  TRUE
) ON CONFLICT (email) DO UPDATE SET
  is_admin=TRUE,
  subscription_type='paid',
  quota_limit=1099511627776,
  plan='team',
  is_active=TRUE,
  is_verified=TRUE;

-- Ensure dev admin user exists and is admin, without verification requirement
INSERT INTO users (email, is_admin, subscription_type, quota_limit, plan, is_active, is_verified)
VALUES (
  'ysnyuki2321@outlook.jp',
  TRUE,
  'paid',
  5368709120,
  'paid',
  TRUE,
  TRUE
) ON CONFLICT (email) DO UPDATE SET
  is_admin=TRUE,
  subscription_type='paid',
  quota_limit=5368709120,
  plan='paid',
  is_active=TRUE,
  is_verified=TRUE;

