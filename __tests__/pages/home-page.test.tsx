import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from '@/app/(public)/page'

jest.mock('@/app/(public)/_actions/create-lead', () => ({
  createLead: jest.fn(),
}))
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  Toaster: () => null,
}))

// Minimal mocks for heavy sections to keep test fast
jest.mock('@/app/(public)/_components/gallery-section', () => ({
  GallerySection: () => null,
}))
jest.mock('@/app/(public)/_components/boutique-showcase', () => ({
  BoutiqueShowcase: () => null,
}))
jest.mock('@/app/(public)/_components/faq-section', () => ({
  FAQSection: () => null,
}))

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Aurè').length).toBeGreaterThanOrEqual(1)
  })

  it('opens booking modal when header button is clicked', () => {
    render(<HomePage />)
    const headerBtn = screen.getAllByRole('button', { name: /agendar atendimento/i })[0]
    fireEvent.click(headerBtn)
    expect(screen.getByText(/nossa equipe entrará em contato/i)).toBeInTheDocument()
  })

  it('opens booking modal with service when services section button is clicked', () => {
    render(<HomePage />)
    const serviceButtons = screen.getAllByRole('button', { name: /^agendar$/i })
    fireEvent.click(serviceButtons[0])
    expect(screen.getByText(/nossa equipe entrará em contato/i)).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<HomePage />)
    expect(screen.getByText('Nossos serviços')).toBeInTheDocument()
    expect(screen.getAllByText('Depoimentos').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Como funciona')).toBeInTheDocument()
  })
})
