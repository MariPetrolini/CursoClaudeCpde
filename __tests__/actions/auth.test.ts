import { signIn, signOut } from '@/app/login/_actions/auth'

const mockSignInWithPassword = jest.fn()
const mockSignOut = jest.fn()
const mockGetUser = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
        getUser: mockGetUser,
      },
    })
  ),
}))

const mockRedirect = jest.fn()
jest.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

describe('signIn', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    mockRedirect.mockReset()
  })

  it('returns error for invalid email', async () => {
    const result = await signIn({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
    expect(result.message).toBeTruthy()
  })

  it('returns error for short password', async () => {
    const result = await signIn({ email: 'admin@example.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.message).toBeTruthy()
  })

  it('returns error on wrong credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    const result = await signIn({ email: 'admin@example.com', password: 'wrongpass' })
    expect(result.success).toBe(false)
    expect(result.message).toContain('senha')
  })

  it('redirects to /admin on successful sign in', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    await signIn({ email: 'admin@example.com', password: 'correct123' }).catch(() => {})
    expect(mockRedirect).toHaveBeenCalledWith('/admin')
  })
})

describe('signOut', () => {
  beforeEach(() => {
    mockSignOut.mockReset()
    mockRedirect.mockReset()
  })

  it('calls supabase signOut and redirects to /login', async () => {
    mockSignOut.mockResolvedValue({})
    await signOut().catch(() => {})
    expect(mockSignOut).toHaveBeenCalled()
    expect(mockRedirect).toHaveBeenCalledWith('/login')
  })
})
