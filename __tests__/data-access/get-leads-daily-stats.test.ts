import { getLeadsDailyStats } from '@/app/admin/_data-access/get-leads-daily-stats'

const mockOrder = jest.fn()
const mockSelect = jest.fn(() => ({ order: mockOrder }))
const mockFrom = jest.fn(() => ({ select: mockSelect }))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFrom })),
}))

describe('getLeadsDailyStats', () => {
  beforeEach(() => {
    mockOrder.mockReset()
    mockFrom.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ order: mockOrder })
  })

  it('returns stats array on success', async () => {
    const stats = [{ day: '2026-06-30', total: 5 }]
    mockOrder.mockResolvedValue({ data: stats, error: null })
    const result = await getLeadsDailyStats()
    expect(result).toEqual(stats)
  })

  it('returns empty array on error', async () => {
    mockOrder.mockResolvedValue({ data: null, error: new Error('DB error') })
    const result = await getLeadsDailyStats()
    expect(result).toEqual([])
  })

  it('returns empty array when data is null', async () => {
    mockOrder.mockResolvedValue({ data: null, error: null })
    const result = await getLeadsDailyStats()
    expect(result).toEqual([])
  })

  it('queries leads_daily_stats view', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null })
    await getLeadsDailyStats()
    expect(mockFrom).toHaveBeenCalledWith('leads_daily_stats')
  })
})
