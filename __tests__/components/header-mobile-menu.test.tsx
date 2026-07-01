import { render, screen, fireEvent } from '@testing-library/react'
import { HeaderMobileMenu } from '@/app/(public)/_components/header-mobile-menu'

const NAV_LINKS = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Boutique', href: '#boutique' },
]

describe('HeaderMobileMenu', () => {
  it('renders menu trigger button', () => {
    render(<HeaderMobileMenu navLinks={NAV_LINKS} onBookingClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
  })

  it('does not show nav links when closed', () => {
    render(<HeaderMobileMenu navLinks={NAV_LINKS} onBookingClick={jest.fn()} />)
    expect(screen.queryByText('Serviços')).not.toBeInTheDocument()
  })

  it('shows nav links when menu is opened', () => {
    render(<HeaderMobileMenu navLinks={NAV_LINKS} onBookingClick={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Boutique')).toBeInTheDocument()
  })

  it('calls onBookingClick when Agendar button is clicked in open menu', () => {
    const handler = jest.fn()
    render(<HeaderMobileMenu navLinks={NAV_LINKS} onBookingClick={handler} />)
    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /agendar atendimento/i }))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
