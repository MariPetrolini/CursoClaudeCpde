import React from 'react'
import { render, screen } from '@testing-library/react'

const mockGetLeadById = jest.fn()
const mockNotFound    = jest.fn()

jest.mock('@/app/admin/_data-access/get-lead-by-id', () => ({
  getLeadById: (id: string) => mockGetLeadById(id),
}))
jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
  useRouter:       () => ({ refresh: jest.fn(), push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('@/app/admin/leads/_actions/update-lead-status', () => ({
  updateLeadStatus: jest.fn(),
}))
jest.mock('sonner', () => ({
  toast:   { success: jest.fn(), error: jest.fn() },
  Toaster: () => null,
}))

const mockLead = {
  id:             '123e4567-e89b-12d3-a456-426614174000',
  name:           'Fernanda Castro',
  phone:          '11988776655',
  email:          'fernanda@email.com',
  service:        'hotelaria' as const,
  preferred_date: '2026-08-10',
  message:        null,
  status:         'pendente' as const,
  source:         'website',
  created_at:     '2026-06-30T14:00:00Z',
  updated_at:     '2026-06-30T14:00:00Z',
}

describe('Lead Detail page', () => {
  beforeEach(() => {
    mockGetLeadById.mockReset()
    mockNotFound.mockReset()
  })

  it('renders lead detail when found', async () => {
    mockGetLeadById.mockResolvedValue(mockLead)
    const LeadDetailPage = (await import('@/app/admin/leads/[id]/page')).default
    const jsx = await LeadDetailPage({ params: Promise.resolve({ id: mockLead.id }) })
    render(jsx as React.ReactElement)
    expect(screen.getAllByText('Fernanda Castro').length).toBeGreaterThanOrEqual(1)
  })

  it('calls notFound when lead does not exist', async () => {
    mockGetLeadById.mockResolvedValue(null)
    const LeadDetailPage = (await import('@/app/admin/leads/[id]/page')).default
    try {
      await LeadDetailPage({ params: Promise.resolve({ id: 'nonexistent' }) })
    } catch {
      // notFound() throws in Next.js
    }
    expect(mockNotFound).toHaveBeenCalled()
  })
})
