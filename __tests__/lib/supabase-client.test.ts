const mockCreateBrowserClient = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: (url: string, key: string) => {
    mockCreateBrowserClient(url, key)
    return { auth: {} }
  },
}))

describe('createClient (supabase browser)', () => {
  beforeEach(() => {
    mockCreateBrowserClient.mockClear()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('creates a Supabase browser client', () => {
    jest.resetModules()
    jest.mock('@supabase/ssr', () => ({
      createBrowserClient: (url: string, key: string) => {
        mockCreateBrowserClient(url, key)
        return { auth: {} }
      },
    }))
    const { createClient } = require('@/lib/supabase/client')
    const client = createClient()
    expect(client).toBeDefined()
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })

  it('uses environment variables for URL and key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://other.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'other-anon-key'
    jest.resetModules()
    jest.mock('@supabase/ssr', () => ({
      createBrowserClient: (url: string, key: string) => {
        mockCreateBrowserClient(url, key)
        return { auth: {} }
      },
    }))
    const { createClient } = require('@/lib/supabase/client')
    createClient()
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://other.supabase.co',
      'other-anon-key'
    )
  })
})
