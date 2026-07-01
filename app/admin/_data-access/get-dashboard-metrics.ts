import { createClient } from '@/lib/supabase/server'
import { DashboardMetrics } from '@/types/database'

export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_dashboard_metrics')
    if (error) throw error
    return data as DashboardMetrics
  } catch {
    return null
  }
}
