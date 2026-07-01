import { SERVICE_LABELS, STATUS_LABELS } from '@/types/database'
import type { ServiceType, LeadStatus } from '@/types/database'

describe('SERVICE_LABELS', () => {
  it('has a label for every ServiceType', () => {
    const services: ServiceType[] = ['banho_tosa', 'spa', 'hotelaria', 'day_care', 'taxi_dog', 'boutique']
    for (const s of services) {
      expect(SERVICE_LABELS[s]).toBeTruthy()
    }
  })

  it('has exactly 6 entries', () => {
    expect(Object.keys(SERVICE_LABELS)).toHaveLength(6)
  })
})

describe('STATUS_LABELS', () => {
  it('has a label for every LeadStatus', () => {
    const statuses: LeadStatus[] = ['pendente', 'confirmado', 'concluido', 'cancelado']
    for (const s of statuses) {
      expect(STATUS_LABELS[s]).toBeTruthy()
    }
  })

  it('has exactly 4 entries', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(4)
  })
})
