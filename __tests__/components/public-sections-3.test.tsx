import { render, screen } from '@testing-library/react'
import { BoutiqueShowcase } from '@/app/(public)/_components/boutique-showcase'
import { GallerySection } from '@/app/(public)/_components/gallery-section'

describe('BoutiqueShowcase', () => {
  it('renders "Nossa boutique" heading', () => {
    render(<BoutiqueShowcase />)
    expect(screen.getByText('Nossa boutique')).toBeInTheDocument()
  })

  it('renders boutique items', () => {
    render(<BoutiqueShowcase />)
    expect(screen.getByText('Ração Premium Grain-Free')).toBeInTheDocument()
    expect(screen.getByText('Shampoo Argan & Seda')).toBeInTheDocument()
    expect(screen.getByText('Cama Ortopédica Velvet')).toBeInTheDocument()
  })

  it('renders category badges', () => {
    render(<BoutiqueShowcase />)
    expect(screen.getByText('Nutrição')).toBeInTheDocument()
    expect(screen.getByText('Cosméticos')).toBeInTheDocument()
    expect(screen.getByText('Conforto')).toBeInTheDocument()
  })

  it('renders "Conhecer a boutique completa" CTA', () => {
    render(<BoutiqueShowcase />)
    expect(screen.getByText('Conhecer a boutique completa')).toBeInTheDocument()
  })
})

describe('GallerySection', () => {
  it('renders "A experiência Aurè" heading', () => {
    render(<GallerySection />)
    expect(screen.getByText('A experiência Aurè')).toBeInTheDocument()
  })

  it('renders 6 gallery items', () => {
    render(<GallerySection />)
    const espaços = screen.getAllByText('Espaço de atendimento')
    const pets = screen.getAllByText('Pet atendido')
    expect(espaços.length + pets.length).toBe(6)
  })
})
