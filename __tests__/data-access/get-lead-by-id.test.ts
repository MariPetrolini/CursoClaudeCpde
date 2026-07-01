import { getLeadById } from '@/app/admin/_data-access/get-lead-by-id'

const mockSingle = jest.fn()
const mockEq = jest.fn(() => ({ single: mockSingle }))
const mockSelect = jest.fn(() => ({ eq: mockEq }))
const mockFrom = jest.fn(() => ({ select: mockSelect }))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFrom })),
}))

const VALID_ID = '123e4567-e89b-12d3-a456-426614174000'

describe('getLeadById', () => {
  beforeEach(() => {
    mockSingle.mockReset()
    mockFrom.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockEq.mockReturnValue({ single: mockSingle })
  })

  it('returns lead when found', async () => {
    const lead = { id: VALID_ID, name: 'Test', status: 'pendente' }
    mockSingle.mockResolvedValue({ data: lead, error: null })
    const result = await getLeadById(VALID_ID)
    expect(result).toEqual(lead)
  })

  it('returns null on not found', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('Not found') })
    const result = await getLeadById('nonexistent')
    expect(result).toBeNull()
  })

  it('queries the leads table with the given id', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('Not found') })
    await getLeadById(VALID_ID)
    expect(mockFrom).toHaveBeenCalledWith('leads')
    expect(mockEq).toHaveBeenCalledWith('id', VALID_ID)
  })
})
