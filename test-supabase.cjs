const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wxclazvmrxyyyiuvvhjw.supabase.co',
  'sb_publishable_Jk6dDG_TUg7gBeh-zMI4dA_e1f2-qLB'
);

async function test() {
  console.log('Inserting message...');
  const { error: insertError } = await supabase
    .from('contact_messages')
    .insert([{ email: 'test@admin.com', content: 'Node script test' }]);
    
  if (insertError) {
    console.error('Insert error:', insertError);
  } else {
    console.log('Insert successful!');
  }
}

test();
