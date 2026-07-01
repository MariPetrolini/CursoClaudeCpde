import { Card, CardContent } from '@/components/ui/card'
import { DashboardMetrics, SERVICE_LABELS } from '@/types/database'
import { Users, TrendingUp, CalendarCheck, Star } from 'lucide-react'

type MetricsCardsProps = { metrics: DashboardMetrics | null }

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    { label: 'Total de leads',          value: metrics?.total_leads?.toString() ?? '—',    icon: Users,         sub: 'Desde o início' },
    { label: 'Leads hoje',              value: metrics?.leads_today?.toString() ?? '—',    icon: CalendarCheck, sub: 'Agendamentos do dia' },
    { label: 'Taxa de confirmação',     value: metrics?.confirmation_rate != null ? `${metrics.confirmation_rate}%` : '—', icon: TrendingUp, sub: 'Confirmados / total' },
    { label: 'Serviço mais solicitado', value: metrics?.top_service ? SERVICE_LABELS[metrics.top_service] : '—', icon: Star, sub: 'Ranking geral' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, sub }) => (
        <Card key={label} className="border-line bg-bg-base">
          <CardContent className="pt-5 pb-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-sans text-ink-muted">{label}</p>
              <div className="p-1.5 bg-brand-primary-soft rounded-md">
                <Icon className="h-3.5 w-3.5 text-brand-primary-deep" strokeWidth={2} />
              </div>
            </div>
            <p className="font-display text-2xl font-semibold text-ink leading-none">{value}</p>
            <p className="text-xs font-sans text-ink-muted">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
