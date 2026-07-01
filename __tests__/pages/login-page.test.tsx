import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/app/login/_actions/auth', () => ({
  signIn: jest.fn(),
}))

describe('Login page', () => {
  it('renders login form', async () => {
    const LoginPage = (await import('@/app/login/page')).default
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('admin@aure.com.br')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('renders brand name', async () => {
    const LoginPage = (await import('@/app/login/page')).default
    render(<LoginPage />)
    expect(screen.getByText('Aurè')).toBeInTheDocument()
  })
})
