import { render, screen } from '@testing-library/react'
import { BookingModal } from '@/app/(public)/_components/booking-modal'

jest.mock('@/app/(public)/_actions/create-lead', () => ({
  createLead: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

describe('BookingModal', () => {
  it('renders nothing when closed', () => {
    render(<BookingModal open={false} onOpenChange={jest.fn()} />)
    expect(screen.queryByText('Agendar atendimento')).not.toBeInTheDocument()
  })

  it('renders dialog title when open', () => {
    render(<BookingModal open={true} onOpenChange={jest.fn()} />)
    expect(screen.getByText('Agendar atendimento')).toBeInTheDocument()
  })

  it('renders dialog description when open', () => {
    render(<BookingModal open={true} onOpenChange={jest.fn()} />)
    expect(screen.getByText(/equipe entrará em contato/i)).toBeInTheDocument()
  })

  it('renders BookingForm inside modal when open', () => {
    render(<BookingModal open={true} onOpenChange={jest.fn()} />)
    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument()
  })

  it('passes defaultService to BookingForm', () => {
    render(<BookingModal open={true} onOpenChange={jest.fn()} defaultService="spa" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
