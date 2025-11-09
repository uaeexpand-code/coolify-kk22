
import { createClient } from '@supabase/supabase-js';
import { Expense } from '../types';

// These variables are expected to be set in the environment (e.g., by Coolify)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient<{[k:string]: any}>(supabaseUrl, supabaseAnonKey);
