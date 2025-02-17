import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://fdkyxlscsxrqjowsxoqm.supabase.co',
    import.meta.env.VITE_SUPABASE_KEY
  )
}