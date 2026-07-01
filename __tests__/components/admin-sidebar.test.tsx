import { render, screen } from '@testing-library/react'
import { AdminSidebar } from '@/app/admin/_components/admin-sidebar'

jest.mock('@/app/login/_actions/auth', () => ({
  signOut: jest.fn(),
}))

describe('AdminSidebar', () => {
  it('renders brand name', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Aurè')).toBeInTheDocument()
  })

  it('renders Admin label', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders Dashboard navigation link', () => {
    render(<AdminSidebar />)
    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link).toHaveAttribute('href', '/admin')
  })

  it('renders Leads navigation link', () => {
    render(<AdminSidebar />)
    const link = screen.getByRole('link', { name: /leads/i })
    expect(link).toHaveAttribute('href', '/admin/leads')
  })

  it('renders logout button', () => {
    render(<AdminSidebar />)
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('renders 2 navigation items', () => {
    render(<AdminSidebar />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })
})
