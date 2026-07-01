import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('removes duplicate Tailwind classes (last wins)', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'skipped', 'included')).toBe('base included')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })

  it('merges conflicting Tailwind utilities', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})
