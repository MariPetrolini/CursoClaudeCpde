import React from 'react'
import { render, screen } from '@testing-library/react'

const mockGetLeads = jest.fn()

jest.mock('@/app/admin/_data-access/get-leads', () => ({
  getLeads: () => mockGetLeads(),
}))

jest.mock('next/navigation', () => ({
  useRouter:      () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Admin Leads page', () => {
  beforeEach(() => {
    mockGetLeads.mockResolvedValue({ data: [], total: 0, page: 1, pages: 0 })
  })

  it('renders leads heading with empty data', async () => {
    const LeadsPage = (await import('@/app/admin/leads/page')).default
    const jsx = await LeadsPage({ searchParams: Promise.resolve({}) })
    render(jsx as React.ReactElement)
    expect(screen.getByText('Leads')).toBeInTheDocument()
  })

  it('renders leads table with data', async () => {
    mockGetLeads.mockResolvedValue({
      data: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        phone: '11999887766',
        email: null,
        service: 'spa',
        preferred_date: null,
        message: null,
        status: 'pendente',
        source: 'website',
        created_at: '2026-06-30T10:00:00Z',
        updated_at: '2026-06-30T10:00:00Z',
      }],
      total: 1, page: 1, pages: 1,
    })
    const LeadsPage = (await import('@/app/admin/leads/page')).default
    const jsx = await LeadsPage({ searchParams: Promise.resolve({ page: '1' }) })
    render(jsx as React.ReactElement)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })
})
