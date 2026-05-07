const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wxclazvmrxyyyiuvvhjw.supabase.co',
  'sb_publishable_Jk6dDG_TUg7gBeh-zMI4dA_e1f2-qLB'
);

// We'll use the service role key if we had it, but we only have anon key.
// But profiles has a policy:
// create policy "Public profiles are viewable by users."
//   on profiles for select
//   using ( auth.role() = 'authenticated' );
// So anon can't see profiles!

// Wait! How does the frontend login work?
// In ManageUsers.tsx, it queries profiles. 
// Let's just create a quick JWT by logging in.

async function test() {
  // Let's try to fetch an article to make sure it works
  const { data: articles } = await supabase.from('articles').select('*').limit(1);
  console.log('Articles found:', articles?.length);
}

test();
