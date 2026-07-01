import { Suspense } from 'react'
import { getLeads } from '../_data-access/get-leads'
import { LeadsTable } from './_components/leads-table'
import { LeadsFilters } from './_components/leads-filters'
import { LeadsPagination } from './_components/leads-pagination'
import { LeadStatus, ServiceType } from '@/types/database'

type SearchParams = { status?: string; service?: string; date_from?: string; date_to?: string; page?: string }

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const page = Number(sp.page ?? '1')

  const result = await getLeads({
    status:    sp.status  as LeadStatus | undefined,
    service:   sp.service as ServiceType | undefined,
    date_from: sp.date_from,
    date_to:   sp.date_to,
    page,
    per_page:  20,
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Leads</h1>
        <p className="font-sans text-sm text-ink-muted mt-1">Todos os agendamentos solicitados</p>
      </div>
      <Suspense><LeadsFilters /></Suspense>
      <LeadsTable leads={result.data} />
      <Suspense><LeadsPagination page={result.page} pages={result.pages} total={result.total} /></Suspense>
    </div>
  )
}
