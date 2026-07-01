import { getDashboardMetrics } from '@/app/admin/_data-access/get-dashboard-metrics'

const mockRpc = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ rpc: mockRpc })),
}))

describe('getDashboardMetrics', () => {
  beforeEach(() => mockRpc.mockReset())

  it('returns metrics data on success', async () => {
    const mockData = { total_leads: 10, leads_today: 2, confirmation_rate: 50, top_service: 'spa', by_service: [], by_status: [] }
    mockRpc.mockResolvedValue({ data: mockData, error: null })
    const result = await getDashboardMetrics()
    expect(result).toEqual(mockData)
  })

  it('returns null on Supabase error', async () => {
    mockRpc.mockResolvedValue({ data: null, error: new Error('DB error') })
    const result = await getDashboardMetrics()
    expect(result).toBeNull()
  })

  it('calls get_dashboard_metrics rpc', async () => {
    mockRpc.mockResolvedValue({ data: {}, error: null })
    await getDashboardMetrics()
    expect(mockRpc).toHaveBeenCalledWith('get_dashboard_metrics')
  })
})
