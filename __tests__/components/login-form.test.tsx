import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/app/login/_components/login-form'

const mockSignIn = jest.fn()
jest.mock('@/app/login/_actions/auth', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}))

describe('LoginForm', () => {
  beforeEach(() => mockSignIn.mockReset())

  it('renders email and password inputs', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText('admin@aure.com.br')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('submit button is enabled by default', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled()
  })

  it('shows validation error for invalid email format', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('admin@aure.com.br'), 'notanemail')
    const form = screen.getByRole('button', { name: /entrar/i }).closest('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('admin@aure.com.br'), 'admin@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123')
    const form = screen.getByRole('button', { name: /entrar/i }).closest('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/ao menos 6 caracteres/i)).toBeInTheDocument()
    })
  })

  it('displays server error on failed signin', async () => {
    mockSignIn.mockResolvedValue({ success: false, message: 'E-mail ou senha incorretos.' })
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('admin@aure.com.br'), 'admin@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    const form = screen.getByRole('button', { name: /entrar/i }).closest('form')!
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos.')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('does not display error initially', () => {
    render(<LoginForm />)
    expect(screen.queryByText(/incorretos/i)).not.toBeInTheDocument()
  })
})
