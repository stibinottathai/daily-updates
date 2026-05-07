-- This script finds any users in auth.users that don't have a profile yet
-- and creates a profile for them. This fixes issues where accounts were
-- created before the database triggers were set up.

-- 1. Insert the oldest missing user as 'super_admin' (if the profiles table is empty)
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
  AND (SELECT count(*) FROM public.profiles) = 0
ORDER BY created_at ASC
LIMIT 1;

-- 2. Insert any remaining missing users as 'sub_admin'
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'sub_admin'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
