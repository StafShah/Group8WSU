import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://fdkyxlscsxrqjowsxoqm.supabase.co',
    import.meta.env.VITE_SUPABASE_KEY
)