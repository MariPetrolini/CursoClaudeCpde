import { render, screen } from '@testing-library/react'

// ─── Admin Dashboard ────────────────────────────────────────────────────────
const mockGetDashboardMetrics = jest.fn()
const mockGetLeadsDailyStats  = jest.fn()

jest.mock('@/app/admin/_data-access/get-dashboard-metrics', () => ({
  getDashboardMetrics: () => mockGetDashboardMetrics(),
}))
jest.mock('@/app/admin/_data-access/get-leads-daily-stats', () => ({
  getLeadsDailyStats: () => mockGetLeadsDailyStats(),
}))
jest.mock('recharts', () => {
  const React = require('react')
  const stub = ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children)
  return { AreaChart: stub, Area: stub, XAxis: stub, YAxis: stub, CartesianGrid: stub, Tooltip: stub, ResponsiveContainer: stub, BarChart: stub, Bar: stub, Cell: stub, PieChart: stub, Pie: stub, Legend: stub }
})

describe('Admin Dashboard page', () => {
  beforeEach(() => {
    mockGetDashboardMetrics.mockResolvedValue(null)
    mockGetLeadsDailyStats.mockResolvedValue([])
  })

  it('renders metrics and chart headings with null data', async () => {
    const AdminPage = (await import('@/app/admin/page')).default
    const jsx = await AdminPage()
    render(jsx as React.ReactElement)
    expect(screen.getByText('Total de leads')).toBeInTheDocument()
  })

  it('renders with real metrics data', async () => {
    mockGetDashboardMetrics.mockResolvedValue({
      total_leads: 25, leads_today: 3, confirmation_rate: 72, top_service: 'spa',
      by_service: [{ service: 'spa', total: 10 }],
      by_status: [{ status: 'pendente', total: 5 }],
    })
    mockGetLeadsDailyStats.mockResolvedValue([{ day: '2026-06-30', total: 3 }])
    const AdminPage = (await import('@/app/admin/page')).default
    const jsx = await AdminPage()
    render(jsx as React.ReactElement)
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
