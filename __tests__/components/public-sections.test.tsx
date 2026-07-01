import { render, screen, fireEvent } from '@testing-library/react'
import { Hero } from '@/app/(public)/_components/hero'
import { ServicesSection } from '@/app/(public)/_components/services-section'
import { SiteFooter } from '@/app/(public)/_components/site-footer'
import { Testimonials } from '@/app/(public)/_components/testimonials'
import { FAQSection } from '@/app/(public)/_components/faq-section'

describe('Hero', () => {
  it('renders main headline', () => {
    render(<Hero onBookingClick={jest.fn()} />)
    expect(screen.getByText(/melhor amigo/i)).toBeInTheDocument()
  })

  it('renders "Agendar atendimento" button', () => {
    render(<Hero onBookingClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /agendar atendimento/i })).toBeInTheDocument()
  })

  it('calls onBookingClick when button is clicked', () => {
    const handler = jest.fn()
    render(<Hero onBookingClick={handler} />)
    fireEvent.click(screen.getByRole('button', { name: /agendar atendimento/i }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('renders WhatsApp link', () => {
    render(<Hero onBookingClick={jest.fn()} />)
    expect(screen.getByText(/falar no whatsapp/i)).toBeInTheDocument()
  })
})

describe('ServicesSection', () => {
  it('renders "Nossos serviços" heading', () => {
    render(<ServicesSection onBookingClick={jest.fn()} />)
    expect(screen.getByText('Nossos serviços')).toBeInTheDocument()
  })

  it('renders all 6 service cards', () => {
    render(<ServicesSection onBookingClick={jest.fn()} />)
    expect(screen.getAllByRole('button', { name: /agendar/i })).toHaveLength(6)
  })

  it('calls onBookingClick with service id when Agendar is clicked', () => {
    const handler = jest.fn()
    render(<ServicesSection onBookingClick={handler} />)
    const buttons = screen.getAllByRole('button', { name: /agendar/i })
    fireEvent.click(buttons[0])
    expect(handler).toHaveBeenCalledWith('banho_tosa')
  })

  it('renders service descriptions', () => {
    render(<ServicesSection onBookingClick={jest.fn()} />)
    expect(screen.getByText(/produtos importados/i)).toBeInTheDocument()
  })
})

describe('SiteFooter', () => {
  it('renders brand name Aurè', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Aurè')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/98877-5522/)).toBeInTheDocument()
    expect(screen.getByText(/São Paulo/)).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/2026 Aurè Pet Atelier/)).toBeInTheDocument()
  })

  it('renders LGPD notice', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/LGPD/)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getAllByText('Contato').length).toBeGreaterThanOrEqual(1)
  })
})

describe('Testimonials', () => {
  it('renders "Depoimentos" heading', () => {
    render(<Testimonials />)
    expect(screen.getByText('Depoimentos')).toBeInTheDocument()
  })

  it('renders testimonial texts', () => {
    render(<Testimonials />)
    expect(screen.getByText(/Ana Carolina/)).toBeInTheDocument()
    expect(screen.getByText(/Ricardo Fontes/)).toBeInTheDocument()
  })

  it('renders 3 testimonial cards', () => {
    render(<Testimonials />)
    const stars = screen.getAllByText('★')
    expect(stars.length).toBeGreaterThanOrEqual(15) // 3 cards × 5 stars
  })
})

describe('FAQSection', () => {
  it('renders "Perguntas frequentes" heading', () => {
    render(<FAQSection />)
    expect(screen.getByText('Perguntas frequentes')).toBeInTheDocument()
  })

  it('renders FAQ questions', () => {
    render(<FAQSection />)
    expect(screen.getByText(/Como funciona o agendamento/)).toBeInTheDocument()
  })
})
