import { SERVICES } from '@/lib/content/services'
import { TESTIMONIALS } from '@/lib/content/testimonials'
import { FAQ_ITEMS } from '@/lib/content/faq'
import { BOUTIQUE_ITEMS } from '@/lib/content/boutique'

describe('SERVICES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SERVICES)).toBe(true)
    expect(SERVICES.length).toBeGreaterThan(0)
  })

  it('each item has required fields', () => {
    for (const s of SERVICES) {
      expect(s.id).toBeTruthy()
      expect(s.title).toBeTruthy()
      expect(s.description).toBeTruthy()
    }
  })
})

describe('TESTIMONIALS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(TESTIMONIALS)).toBe(true)
    expect(TESTIMONIALS.length).toBeGreaterThan(0)
  })

  it('each item has id, name, pet and text', () => {
    for (const t of TESTIMONIALS) {
      expect(t.id).toBeDefined()
      expect(t.name).toBeTruthy()
      expect(t.text).toBeTruthy()
    }
  })
})

describe('FAQ_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(FAQ_ITEMS)).toBe(true)
    expect(FAQ_ITEMS.length).toBeGreaterThan(0)
  })

  it('each item has question and answer', () => {
    for (const item of FAQ_ITEMS) {
      expect(item.question).toBeTruthy()
      expect(item.answer).toBeTruthy()
    }
  })
})

describe('BOUTIQUE_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(BOUTIQUE_ITEMS)).toBe(true)
    expect(BOUTIQUE_ITEMS.length).toBeGreaterThan(0)
  })
})
