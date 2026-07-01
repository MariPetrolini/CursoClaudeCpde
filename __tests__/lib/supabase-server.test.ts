const mockGetAll = jest.fn(() => [{ name: 'sb-token', value: 'abc', options: {} }])
const mockSet = jest.fn()
const mockCookieStore = { getAll: mockGetAll, set: mockSet }

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
}))

type CookieEntry = { name: string; value: string; options: Record<string, unknown> }
type CookieHandlers = { getAll: () => CookieEntry[]; setAll: (cookies: CookieEntry[]) => void }

const capturedHandlers: { current: CookieHandlers | null } = { current: null }

jest.mock('@supabase/ssr', () => ({
  createServerClient: (url: string, key: string, opts: { cookies: CookieHandlers }) => {
    capturedHandlers.current = opts.cookies
    return { auth: {}, _url: url, _key: key }
  },
}))

describe('createClient (supabase server)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedHandlers.current = null
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('creates a Supabase server client', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const client = await createClient()
    expect(client).toBeDefined()
    expect(capturedHandlers.current).not.toBeNull()
  })

  it('cookies.getAll delegates to cookieStore.getAll', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    await createClient()
    capturedHandlers.current!.getAll()
    expect(mockGetAll).toHaveBeenCalled()
  })

  it('cookies.setAll calls cookieStore.set for each cookie', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    await createClient()
    capturedHandlers.current!.setAll([{ name: 'token', value: 'xyz', options: {} }])
    expect(mockSet).toHaveBeenCalledWith('token', 'xyz', {})
  })

  it('cookies.setAll swallows errors from Server Components', async () => {
    mockSet.mockImplementationOnce(() => { throw new Error('Read-only') })
    const { createClient } = await import('@/lib/supabase/server')
    await createClient()
    expect(() =>
      capturedHandlers.current!.setAll([{ name: 'x', value: 'y', options: {} }])
    ).not.toThrow()
  })
})
