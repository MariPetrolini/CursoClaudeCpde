import { LoginForm } from './_components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg-warm flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-semibold text-ink">Aurè</h1>
          <p className="font-sans text-sm text-ink-muted">Painel administrativo</p>
        </div>
        <div className="bg-bg-base rounded-2xl border border-line p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
