-- 1. Create a helper function that bypasses RLS to check a user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Drop the recursive policy from the profiles table
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;

-- 3. Recreate the policy using the helper function (preventing recursion)
CREATE POLICY "Super admins can manage all profiles" 
  ON public.profiles FOR ALL
  USING ( public.get_user_role() = 'super_admin' );

-- 4. Also update the contact_messages policy to use the secure helper function, allowing ALL admin tiers to view messages
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;

CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (
    public.get_user_role() IN ('super_admin', 'admin', 'sub_admin')
  );
