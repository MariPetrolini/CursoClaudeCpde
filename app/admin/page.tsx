import { getDashboardMetrics } from './_data-access/get-dashboard-metrics'
import { getLeadsDailyStats } from './_data-access/get-leads-daily-stats'
import { MetricsCards } from './_components/metrics-cards'
import { LeadsAreaChart } from './_components/leads-area-chart'
import { LeadsBarChart } from './_components/leads-bar-chart'
import { LeadsDonutChart } from './_components/leads-donut-chart'

export default async function AdminDashboardPage() {
  const [metrics, dailyStats] = await Promise.all([
    getDashboardMetrics(),
    getLeadsDailyStats(),
  ])

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="font-sans text-sm text-ink-muted mt-1">Visão geral dos agendamentos</p>
      </div>
      <MetricsCards metrics={metrics} />
      <div className="grid lg:grid-cols-2 gap-6">
        <LeadsAreaChart data={dailyStats} />
        <LeadsDonutChart data={metrics?.by_status ?? []} />
      </div>
      <LeadsBarChart data={metrics?.by_service ?? []} />
    </div>
  )
}
