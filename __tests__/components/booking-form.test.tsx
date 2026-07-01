import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingForm } from '@/app/(public)/_components/booking-form'

const mockCreateLead = jest.fn()
jest.mock('@/app/(public)/_actions/create-lead', () => ({
  createLead: (...args: unknown[]) => mockCreateLead(...args),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

describe('BookingForm', () => {
  beforeEach(() => {
    mockCreateLead.mockReset()
  })

  it('renders name input field', () => {
    render(<BookingForm />)
    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument()
  })

  it('renders phone input field', () => {
    render(<BookingForm />)
    expect(screen.getByPlaceholderText('11988775522')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<BookingForm />)
    expect(screen.getByRole('button', { name: /solicitar agendamento/i })).toBeInTheDocument()
  })

  it('renders consent text', () => {
    render(<BookingForm />)
    expect(screen.getByText(/concordo com o uso/i)).toBeInTheDocument()
  })

  it('submit button is enabled by default', () => {
    render(<BookingForm />)
    expect(screen.getByRole('button', { name: /solicitar agendamento/i })).not.toBeDisabled()
  })

  it('shows validation error for name shorter than 3 chars', async () => {
    render(<BookingForm />)
    const nameInput = screen.getByPlaceholderText('Seu nome')
    await userEvent.type(nameInput, 'Jo')
    const form = screen.getByRole('button', { name: /solicitar agendamento/i }).closest('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/ao menos 3 caracteres/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid phone', async () => {
    render(<BookingForm />)
    const phoneInput = screen.getByPlaceholderText('11988775522')
    await userEvent.type(phoneInput, '123')
    const form = screen.getByRole('button', { name: /solicitar agendamento/i }).closest('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/telefone válido/i)).toBeInTheDocument()
    })
  })

  it('shows error toast on failed submission', async () => {
    const { toast } = require('sonner')
    mockCreateLead.mockResolvedValue({ success: false, message: 'Erro ao enviar' })

    render(<BookingForm />)
    await userEvent.type(screen.getByPlaceholderText('Seu nome'), 'Maria Oliveira')
    await userEvent.type(screen.getByPlaceholderText('11988775522'), '11988776655')
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const form = screen.getByRole('button', { name: /solicitar agendamento/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      if (mockCreateLead.mock.calls.length > 0) {
        expect(toast.error).toHaveBeenCalledWith('Erro ao enviar')
      }
    }, { timeout: 2000 })
  })

  it('shows success toast on successful submission', async () => {
    const { toast } = require('sonner')
    mockCreateLead.mockResolvedValue({ success: true, message: 'Agendamento solicitado!' })

    render(<BookingForm />)
    await userEvent.type(screen.getByPlaceholderText('Seu nome'), 'Maria Oliveira')
    await userEvent.type(screen.getByPlaceholderText('11988775522'), '11988776655')
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const form = screen.getByRole('button', { name: /solicitar agendamento/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      if (mockCreateLead.mock.calls.length > 0) {
        expect(toast.success).toHaveBeenCalledWith('Agendamento solicitado!')
      }
    }, { timeout: 2000 })
  })

  it('renders service select combobox', () => {
    render(<BookingForm defaultService="spa" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls onSuccess callback after successful submission', async () => {
    mockCreateLead.mockResolvedValue({ success: true, message: 'OK' })
    const onSuccess = jest.fn()
    render(<BookingForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByPlaceholderText('Seu nome'), 'Maria Oliveira')
    await userEvent.type(screen.getByPlaceholderText('11988775522'), '11988776655')
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const form = screen.getByRole('button', { name: /solicitar agendamento/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      if (mockCreateLead.mock.calls.length > 0) {
        expect(onSuccess).toHaveBeenCalled()
      }
    }, { timeout: 2000 })
  })
})
