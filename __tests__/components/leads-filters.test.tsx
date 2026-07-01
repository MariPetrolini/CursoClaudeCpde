import { render, screen, fireEvent } from '@testing-library/react'
import { LeadsFilters } from '@/app/admin/leads/_components/leads-filters'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('LeadsFilters', () => {
  beforeEach(() => mockPush.mockReset())

  it('renders clear filters button', () => {
    render(<LeadsFilters />)
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument()
  })

  it('navigates to /admin/leads on clear filters click', () => {
    render(<LeadsFilters />)
    fireEvent.click(screen.getByRole('button', { name: /limpar filtros/i }))
    expect(mockPush).toHaveBeenCalledWith('/admin/leads')
  })

  it('renders date range inputs', () => {
    render(<LeadsFilters />)
    const dateInputs = screen.getAllByDisplayValue('')
    expect(dateInputs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders with existing search params', () => {
    jest.resetModules()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      useSearchParams: () => new URLSearchParams('status=pendente&service=spa'),
    }))
    render(<LeadsFilters />)
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument()
  })

  it('renders two select comboboxes (status and service)', () => {
    render(<LeadsFilters />)
    const combos = screen.getAllByRole('combobox')
    expect(combos.length).toBeGreaterThanOrEqual(2)
  })

  it('renders date separator text "até"', () => {
    render(<LeadsFilters />)
    expect(screen.getByText('até')).toBeInTheDocument()
  })
})
