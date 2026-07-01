import { createClient } from '@/lib/supabase/server'
import { Lead } from '@/types/database'

export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leads').select('*').eq('id', id).single()
    if (error) throw error
    return data as Lead
  } catch {
    return null
  }
}
