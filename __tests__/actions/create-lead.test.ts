import { createLead } from '@/app/(public)/_actions/create-lead'

const mockInsert = jest.fn()
const mockFrom = jest.fn(() => ({ insert: mockInsert }))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFrom })),
}))

const validInput = {
  name: 'Maria Silva',
  phone: '11988775522',
  email: 'maria@email.com',
  service: 'banho_tosa' as const,
  preferred_date: '2026-07-15',
  message: 'Tenho um golden retriever',
  consent: true as const,
}

describe('createLead', () => {
  beforeEach(() => {
    mockInsert.mockReset()
  })

  it('returns validation error when name is too short', async () => {
    const result = await createLead({ ...validInput, name: 'Jo' })
    expect(result.success).toBe(false)
    expect(result.errors?.name).toBeDefined()
  })

  it('returns validation error for invalid phone', async () => {
    const result = await createLead({ ...validInput, phone: '123' })
    expect(result.success).toBe(false)
    expect(result.errors?.phone).toBeDefined()
  })

  it('returns validation error for invalid email', async () => {
    const result = await createLead({ ...validInput, email: 'not-an-email' })
    expect(result.success).toBe(false)
    expect(result.errors?.email).toBeDefined()
  })

  it('accepts empty email as optional', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const result = await createLead({ ...validInput, email: '' })
    expect(result.success).toBe(true)
  })

  it('returns validation error when consent is not true', async () => {
    const result = await createLead({ ...validInput, consent: undefined as unknown as true })
    expect(result.success).toBe(false)
    expect(result.errors?.consent).toBeDefined()
  })

  it('returns success on valid input with Supabase insert ok', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const result = await createLead(validInput)
    expect(result.success).toBe(true)
    expect(result.message).toContain('Agendamento')
  })

  it('returns fallback message on Supabase error', async () => {
    mockInsert.mockResolvedValue({ error: new Error('DB error') })
    const result = await createLead(validInput)
    expect(result.success).toBe(false)
    expect(result.message).toContain('WhatsApp')
  })

  it('accepts all valid service types', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const services = ['banho_tosa', 'spa', 'hotelaria', 'day_care', 'taxi_dog', 'boutique'] as const
    for (const service of services) {
      const result = await createLead({ ...validInput, service })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid service type', async () => {
    const result = await createLead({ ...validInput, service: 'invalid' as 'banho_tosa' })
    expect(result.success).toBe(false)
  })

  it('accepts phone with 10 digits', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const result = await createLead({ ...validInput, phone: '1188775522' })
    expect(result.success).toBe(true)
  })

  it('rejects phone with 12 digits', async () => {
    const result = await createLead({ ...validInput, phone: '119887755221' })
    expect(result.success).toBe(false)
    expect(result.errors?.phone).toBeDefined()
  })
})
