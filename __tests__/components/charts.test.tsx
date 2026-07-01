import { render, screen } from '@testing-library/react'
import { LeadsAreaChart } from '@/app/admin/_components/leads-area-chart'
import { LeadsBarChart } from '@/app/admin/_components/leads-bar-chart'
import { LeadsDonutChart } from '@/app/admin/_components/leads-donut-chart'

// Recharts relies on browser APIs unavailable in jsdom; render as null in tests.
jest.mock('recharts', () => {
  const React = require('react')
  return {
    AreaChart: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'area-chart' }, children),
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    BarChart: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'bar-chart' }, children),
    Bar: () => null,
    Cell: () => null,
    XAxisBar: () => null,
    PieChart: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'pie-chart' }, children),
    Pie: () => null,
    Legend: () => null,
  }
})

describe('LeadsAreaChart', () => {
  it('renders "Leads por dia" heading', () => {
    render(<LeadsAreaChart data={[]} />)
    expect(screen.getByText('Leads por dia')).toBeInTheDocument()
  })

  it('renders with data points', () => {
    render(<LeadsAreaChart data={[{ day: '2026-06-30', total: 5 }, { day: '2026-06-29', total: 3 }]} />)
    expect(screen.getByText('Leads por dia')).toBeInTheDocument()
  })

  it('renders empty data without crashing', () => {
    const { container } = render(<LeadsAreaChart data={[]} />)
    expect(container.firstChild).not.toBeNull()
  })
})

describe('LeadsBarChart', () => {
  it('renders "Leads por serviço" heading', () => {
    render(<LeadsBarChart data={[]} />)
    expect(screen.getByText('Leads por serviço')).toBeInTheDocument()
  })

  it('renders with service data', () => {
    render(<LeadsBarChart data={[{ service: 'spa', total: 10 }]} />)
    expect(screen.getByText('Leads por serviço')).toBeInTheDocument()
  })
})

describe('LeadsDonutChart', () => {
  it('renders "Leads por status" heading', () => {
    render(<LeadsDonutChart data={[]} />)
    expect(screen.getByText('Leads por status')).toBeInTheDocument()
  })

  it('renders with status data', () => {
    render(<LeadsDonutChart data={[{ status: 'pendente', total: 5 }]} />)
    expect(screen.getByText('Leads por status')).toBeInTheDocument()
  })
})
