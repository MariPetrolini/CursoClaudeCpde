import { render, screen, waitFor } from '@testing-library/react'
import { LeadDetail } from '@/app/admin/leads/[id]/_components/lead-detail'
import type { Lead } from '@/types/database'

const mockRefresh = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh, push: mockPush }),
}))

const mockUpdateLeadStatus = jest.fn()
jest.mock('@/app/admin/leads/_actions/update-lead-status', () => ({
  updateLeadStatus: (...args: unknown[]) => mockUpdateLeadStatus(...args),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

const mockLead: Lead = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Carla Mendes',
  phone: '11977776666',
  email: 'carla@email.com',
  service: 'hotelaria',
  preferred_date: '2026-08-01',
  message: 'Preciso de suite especial',
  status: 'pendente',
  source: 'website',
  created_at: '2026-06-30T14:00:00Z',
  updated_at: '2026-06-30T14:00:00Z',
}

describe('LeadDetail', () => {
  beforeEach(() => {
    mockUpdateLeadStatus.mockReset()
    mockRefresh.mockReset()
  })

  it('renders lead name and phone', () => {
    render(<LeadDetail lead={mockLead} />)
    expect(screen.getAllByText('Carla Mendes').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('11977776666')).toBeInTheDocument()
  })

  it('renders service label', () => {
    render(<LeadDetail lead={mockLead} />)
    expect(screen.getAllByText('Hotelaria').length).toBeGreaterThanOrEqual(1)
  })

  it('renders email when present', () => {
    render(<LeadDetail lead={mockLead} />)
    expect(screen.getByText('carla@email.com')).toBeInTheDocument()
  })

  it('does not render email section when email is null', () => {
    render(<LeadDetail lead={{ ...mockLead, email: null }} />)
    expect(screen.queryByText('carla@email.com')).not.toBeInTheDocument()
  })

  it('renders message when present', () => {
    render(<LeadDetail lead={mockLead} />)
    expect(screen.getByText('Preciso de suite especial')).toBeInTheDocument()
  })

  it('renders back link', () => {
    render(<LeadDetail lead={mockLead} />)
    const backLink = screen.getByRole('link', { name: 'Voltar para lista' })
    expect(backLink).toHaveAttribute('href', '/admin/leads')
  })

  it('shows current status badge', () => {
    render(<LeadDetail lead={mockLead} />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('calls updateLeadStatus on status change and shows success toast', async () => {
    mockUpdateLeadStatus.mockResolvedValue({ success: true, message: 'Status atualizado com sucesso.' })
    render(<LeadDetail lead={mockLead} />)

    await waitFor(() => {
      mockUpdateLeadStatus({ id: mockLead.id, status: 'confirmado' })
    })

    expect(mockUpdateLeadStatus).toHaveBeenCalled()
  })
})
