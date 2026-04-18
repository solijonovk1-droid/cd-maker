import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uzmjbgfusxijdirfgxpa.supabase.co'
const supabaseKey = 'sb_publishable_Kktxhl02T_YLwdYYS0YTlQ_vKKE4XXm'

export const supabase = createClient(supabaseUrl, supabaseKey)
