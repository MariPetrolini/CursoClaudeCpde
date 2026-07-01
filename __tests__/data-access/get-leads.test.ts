import { getLeads } from '@/app/admin/_data-access/get-leads'

const mockRange = jest.fn()
const mockOrder = jest.fn()
const mockSelect = jest.fn()
const mockFrom = jest.fn()
const mockEqStatus = jest.fn()
const mockEqService = jest.fn()
const mockGte = jest.fn()
const mockLte = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFrom })),
}))

describe('getLeads', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns empty page on Supabase error', async () => {
    mockRange.mockResolvedValue({ data: null, error: new Error('DB error'), count: null })
    mockOrder.mockReturnValue({ range: mockRange })
    mockSelect.mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await getLeads()
    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
  })

  it('defaults to page 1 and per_page 20', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 })
    mockOrder.mockReturnValue({ range: mockRange })
    mockSelect.mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await getLeads()
    expect(result.page).toBe(1)
    expect(mockRange).toHaveBeenCalledWith(0, 19)
  })

  it('calculates correct offset for page 2', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 })
    mockOrder.mockReturnValue({ range: mockRange })
    mockSelect.mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    await getLeads({ page: 2, per_page: 20 })
    expect(mockRange).toHaveBeenCalledWith(20, 39)
  })

  it('calculates total pages correctly', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 45 })
    mockOrder.mockReturnValue({ range: mockRange })
    mockSelect.mockReturnValue({ order: mockOrder })
    mockFrom.mockReturnValue({ select: mockSelect })

    const result = await getLeads({ per_page: 20 })
    expect(result.pages).toBe(3)
  })
})
