import { render, screen } from '@testing-library/react'
import { MetricsCards } from '@/app/admin/_components/metrics-cards'
import type { DashboardMetrics } from '@/types/database'

const mockMetrics: DashboardMetrics = {
  total_leads: 142,
  leads_today: 7,
  confirmation_rate: 68,
  top_service: 'spa',
  by_service: [{ service: 'spa', total: 40 }],
  by_status: [{ status: 'confirmado', total: 96 }],
}

describe('MetricsCards', () => {
  it('renders four metric cards', () => {
    render(<MetricsCards metrics={mockMetrics} />)
    expect(screen.getByText('Total de leads')).toBeInTheDocument()
    expect(screen.getByText('Leads hoje')).toBeInTheDocument()
    expect(screen.getByText('Taxa de confirmação')).toBeInTheDocument()
    expect(screen.getByText('Serviço mais solicitado')).toBeInTheDocument()
  })

  it('displays metric values', () => {
    render(<MetricsCards metrics={mockMetrics} />)
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('68%')).toBeInTheDocument()
    expect(screen.getByText('Spa & Estética')).toBeInTheDocument()
  })

  it('renders dashes when metrics are null', () => {
    render(<MetricsCards metrics={null} />)
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(4)
  })

  it('renders dash for null confirmation_rate', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, confirmation_rate: undefined as unknown as number }} />)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1)
  })

  it('renders dash for null top_service', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, top_service: null }} />)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1)
  })
})
