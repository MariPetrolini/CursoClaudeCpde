import { createClient } from '@/lib/supabase/server'
import { Lead, LeadStatus, ServiceType, LeadsPage } from '@/types/database'

export type GetLeadsParams = {
  status?:    LeadStatus
  service?:   ServiceType
  date_from?: string
  date_to?:   string
  page?:      number
  per_page?:  number
}

export async function getLeads(params: GetLeadsParams = {}): Promise<LeadsPage> {
  const { status, service, date_from, date_to, page = 1, per_page = 20 } = params
  const from = (page - 1) * per_page
  const to   = from + per_page - 1

  try {
    const supabase = await createClient()
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status)    query = query.eq('status', status)
    if (service)   query = query.eq('service', service)
    if (date_from) query = query.gte('created_at', date_from)
    if (date_to)   query = query.lte('created_at', date_to + 'T23:59:59')

    const { data, error, count } = await query
    if (error) throw error
    const total = count ?? 0
    return { data: (data ?? []) as Lead[], total, page, pages: Math.ceil(total / per_page) }
  } catch {
    return { data: [], total: 0, page: 1, pages: 0 }
  }
}
