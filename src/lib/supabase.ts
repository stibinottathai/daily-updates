import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wxclazvmrxyyyiuvvhjw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Jk6dDG_TUg7gBeh-zMI4dA_e1f2-qLB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
