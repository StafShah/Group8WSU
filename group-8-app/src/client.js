import { createClient } from '@supabase/supabase-js'

// Client for web session
export const supabase = createClient(
    'https://fdkyxlscsxrqjowsxoqm.supabase.co',
    import.meta.env.VITE_SUPABASE_KEY
)