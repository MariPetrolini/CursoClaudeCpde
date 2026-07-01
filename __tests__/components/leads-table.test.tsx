import { render, screen } from '@testing-library/react'
import { LeadsTable } from '@/app/admin/leads/_components/leads-table'
import type { Lead } from '@/types/database'

const mockLead: Lead = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Ana Costa',
  phone: '11987654321',
  email: 'ana@email.com',
  service: 'spa',
  preferred_date: '2026-07-20',
  message: null,
  status: 'pendente',
  source: 'website',
  created_at: '2026-06-30T10:00:00Z',
  updated_at: '2026-06-30T10:00:00Z',
}

describe('LeadsTable', () => {
  it('shows empty state message when no leads', () => {
    render(<LeadsTable leads={[]} />)
    expect(screen.getByText('Nenhum lead encontrado com esses filtros.')).toBeInTheDocument()
  })

  it('renders table with lead data', () => {
    render(<LeadsTable leads={[mockLead]} />)
    expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    expect(screen.getByText('11987654321')).toBeInTheDocument()
    expect(screen.getByText('Spa & Estética')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('renders Ver link for each lead', () => {
    render(<LeadsTable leads={[mockLead]} />)
    const link = screen.getByRole('link', { name: 'Ver' })
    expect(link).toHaveAttribute('href', `/admin/leads/${mockLead.id}`)
  })

  it('shows dash when preferred_date is null', () => {
    render(<LeadsTable leads={[{ ...mockLead, preferred_date: null }]} />)
    const cells = screen.getAllByText('—')
    expect(cells.length).toBeGreaterThanOrEqual(1)
  })

  it('renders multiple leads', () => {
    const leads: Lead[] = [
      mockLead,
      { ...mockLead, id: 'aabbccdd-e89b-12d3-a456-426614174001', name: 'Bruno Lima', status: 'confirmado' },
    ]
    render(<LeadsTable leads={leads} />)
    expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    expect(screen.getByText('Bruno Lima')).toBeInTheDocument()
    expect(screen.getByText('Confirmado')).toBeInTheDocument()
  })

  it('renders table headers', () => {
    render(<LeadsTable leads={[mockLead]} />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Telefone')).toBeInTheDocument()
    expect(screen.getByText('Serviço')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })
})
