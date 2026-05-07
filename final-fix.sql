-- Drop any problematic policies
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;

-- 1. Explicitly allow ANYONE (anon or authenticated) to insert messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT TO public
  WITH CHECK (true);

-- 2. Allow ALL authenticated users (since all logged-in users are admins in this app) to view messages
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (true);

-- 3. Allow ALL authenticated users to delete messages
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (true);
