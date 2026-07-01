import { updateLeadStatus } from '@/app/admin/leads/_actions/update-lead-status'

const mockUpdate = jest.fn()
const mockEq = jest.fn()
const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFrom })),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'

describe('updateLeadStatus', () => {
  beforeEach(() => {
    mockEq.mockReset()
    mockUpdate.mockReset()
    mockFrom.mockReset()
    mockFrom.mockReturnValue({ update: mockUpdate })
    mockUpdate.mockReturnValue({ eq: mockEq })
  })

  it('returns error for invalid UUID', async () => {
    const result = await updateLeadStatus({ id: 'not-a-uuid', status: 'confirmado' })
    expect(result.success).toBe(false)
    expect(result.message).toBe('Dados inválidos.')
  })

  it('returns error for invalid status', async () => {
    const result = await updateLeadStatus({ id: VALID_UUID, status: 'desconhecido' })
    expect(result.success).toBe(false)
    expect(result.message).toBe('Dados inválidos.')
  })

  it('returns success on valid update', async () => {
    mockEq.mockResolvedValue({ error: null })
    const result = await updateLeadStatus({ id: VALID_UUID, status: 'confirmado' })
    expect(result.success).toBe(true)
    expect(result.message).toContain('sucesso')
  })

  it('returns error on Supabase failure', async () => {
    mockEq.mockResolvedValue({ error: new Error('DB error') })
    const result = await updateLeadStatus({ id: VALID_UUID, status: 'concluido' })
    expect(result.success).toBe(false)
    expect(result.message).toContain('Erro')
  })

  it('accepts all valid status values', async () => {
    mockEq.mockResolvedValue({ error: null })
    const statuses = ['pendente', 'confirmado', 'concluido', 'cancelado']
    for (const status of statuses) {
      const result = await updateLeadStatus({ id: VALID_UUID, status })
      expect(result.success).toBe(true)
    }
  })

  it('calls revalidatePath for admin paths on success', async () => {
    const { revalidatePath } = require('next/cache')
    mockEq.mockResolvedValue({ error: null })
    await updateLeadStatus({ id: VALID_UUID, status: 'confirmado' })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/leads')
    expect(revalidatePath).toHaveBeenCalledWith(`/admin/leads/${VALID_UUID}`)
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
  })
})
