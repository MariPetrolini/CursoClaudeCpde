'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

type NavLink = { label: string; href: string }

type HeaderMobileMenuProps = {
  navLinks: NavLink[]
  onBookingClick: () => void
}

export function HeaderMobileMenu({ navLinks, onBookingClick }: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden text-ink" />}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-bg-base">
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-ink text-left">Aurè</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-base font-sans text-ink-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={() => { setOpen(false); onBookingClick() }}
            className="mt-4 bg-brand-primary-deep text-white hover:bg-brand-primary transition-colors"
          >
            Agendar atendimento
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
