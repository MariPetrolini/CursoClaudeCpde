import { createClient } from '@/lib/supabase/server'

export type DailyStat = { day: string; total: number }

export async function getLeadsDailyStats(): Promise<DailyStat[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leads_daily_stats')
      .select('day, total')
      .order('day', { ascending: true })
    if (error) throw error
    return (data ?? []) as DailyStat[]
  } catch {
    return []
  }
}
