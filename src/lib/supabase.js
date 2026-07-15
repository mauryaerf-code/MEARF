import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xviktwxpipewopxsveab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XDCc33wq1BkJYROt5BlBuw_d9OYcODB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
