import { render, screen, fireEvent } from '@testing-library/react'
import { LeadsPagination } from '@/app/admin/leads/_components/leads-pagination'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('LeadsPagination', () => {
  beforeEach(() => mockPush.mockReset())

  it('renders nothing when pages <= 1', () => {
    const { container } = render(<LeadsPagination page={1} pages={1} total={15} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when pages is 0', () => {
    const { container } = render(<LeadsPagination page={1} pages={0} total={0} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows total leads count', () => {
    render(<LeadsPagination page={1} pages={3} total={50} />)
    expect(screen.getByText('50 leads no total')).toBeInTheDocument()
  })

  it('shows current page / total pages', () => {
    render(<LeadsPagination page={2} pages={5} total={100} />)
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('prev button is disabled on first page', () => {
    render(<LeadsPagination page={1} pages={3} total={60} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('next button is disabled on last page', () => {
    render(<LeadsPagination page={3} pages={3} total={60} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })

  it('both buttons enabled on middle page', () => {
    render(<LeadsPagination page={2} pages={3} total={60} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).not.toBeDisabled()
    expect(buttons[1]).not.toBeDisabled()
  })

  it('navigates to previous page on prev click', () => {
    render(<LeadsPagination page={3} pages={5} total={100} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'))
  })

  it('navigates to next page on next click', () => {
    render(<LeadsPagination page={2} pages={5} total={100} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=3'))
  })
})
