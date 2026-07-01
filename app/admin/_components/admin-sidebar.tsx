'use client'

import { LayoutDashboard, Users, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/login/_actions/auth'

const NAV = [
  { href: '/admin',       label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads',     icon: Users },
]

export function AdminSidebar() {
  return (
    <aside className="w-56 min-h-screen bg-ink flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-lg font-semibold text-white">Aurè</p>
        <p className="text-xs text-white/40 tracking-widest uppercase">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {label}
          </a>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <form action={signOut}>
          <Button type="submit" variant="ghost"
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/10 text-sm">
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  )
}
