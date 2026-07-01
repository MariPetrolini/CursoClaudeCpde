import { render, screen, fireEvent } from '@testing-library/react'
import { HowItWorks } from '@/app/(public)/_components/how-it-works'
import { PremiumDifferentials } from '@/app/(public)/_components/premium-differentials'
import { ClosingCTA } from '@/app/(public)/_components/closing-cta'
import { TrustBar } from '@/app/(public)/_components/trust-bar'
import { SiteHeader } from '@/app/(public)/_components/site-header'

jest.mock('next/link', () => {
  const React = require('react')
  return function MockLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return React.createElement('a', { href, className }, children)
  }
})

describe('HowItWorks', () => {
  it('renders "Como funciona" heading', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Como funciona')).toBeInTheDocument()
  })

  it('renders all 4 steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Agende')).toBeInTheDocument()
    expect(screen.getByText('Confirmamos')).toBeInTheDocument()
    expect(screen.getByText('Cuidamos')).toBeInTheDocument()
    expect(screen.getByText('Felicidade')).toBeInTheDocument()
  })

  it('renders step numbers 01–04', () => {
    render(<HowItWorks />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
  })
})

describe('PremiumDifferentials', () => {
  it('renders "O padrão que faz a diferença" heading', () => {
    render(<PremiumDifferentials />)
    expect(screen.getByText('O padrão que faz a diferença')).toBeInTheDocument()
  })

  it('renders all 3 differentials', () => {
    render(<PremiumDifferentials />)
    expect(screen.getByText('Profissionais certificados')).toBeInTheDocument()
    expect(screen.getByText('Câmeras 24h na hotelaria')).toBeInTheDocument()
    expect(screen.getByText('Produtos importados')).toBeInTheDocument()
  })
})

describe('ClosingCTA', () => {
  it('renders main headline', () => {
    render(<ClosingCTA onBookingClick={jest.fn()} />)
    expect(screen.getByText(/merece o melhor/i)).toBeInTheDocument()
  })

  it('renders the Agendar button', () => {
    render(<ClosingCTA onBookingClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /agendar atendimento/i })).toBeInTheDocument()
  })

  it('calls onBookingClick on button click', () => {
    const handler = jest.fn()
    render(<ClosingCTA onBookingClick={handler} />)
    fireEvent.click(screen.getByRole('button', { name: /agendar atendimento/i }))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('TrustBar', () => {
  it('renders trust metrics', () => {
    render(<TrustBar />)
    expect(screen.getByText('10+')).toBeInTheDocument()
    expect(screen.getByText('+2.000')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<TrustBar />)
    expect(screen.getByText('anos de experiência')).toBeInTheDocument()
    expect(screen.getByText('pets atendidos')).toBeInTheDocument()
  })
})

describe('SiteHeader', () => {
  it('renders brand name', () => {
    render(<SiteHeader onBookingClick={jest.fn()} />)
    expect(screen.getByText('Aurè')).toBeInTheDocument()
  })

  it('renders "Agendar atendimento" button on desktop', () => {
    render(<SiteHeader onBookingClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /agendar atendimento/i })).toBeInTheDocument()
  })

  it('calls onBookingClick on button click', () => {
    const handler = jest.fn()
    render(<SiteHeader onBookingClick={handler} />)
    fireEvent.click(screen.getByRole('button', { name: /agendar atendimento/i }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('renders logo link to homepage', () => {
    render(<SiteHeader onBookingClick={jest.fn()} />)
    const logoLink = screen.getByRole('link', { name: /aurè/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })
})
