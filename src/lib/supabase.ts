import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/constants'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
  )
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
