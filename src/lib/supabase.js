import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zniwqsmenctnjtuynrxh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rcph9KKeZpsok5TbozxjOw_qJcovsu5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
