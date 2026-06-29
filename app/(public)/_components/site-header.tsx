'use client'

import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { HeaderMobileMenu } from './header-mobile-menu'

const NAV_LINKS = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Boutique', href: '#boutique' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
]

type SiteHeaderProps = { onBookingClick: () => void }

export function SiteHeader({ onBookingClick }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg-base/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold text-ink">Aurè</span>
          <span className="text-xs font-sans text-ink-muted tracking-widest uppercase">Pet Atelier</span>
        </a>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  href={link.href}
                  className="px-3 py-2 text-sm font-sans text-ink-muted hover:text-ink transition-colors"
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button
            onClick={onBookingClick}
            className="hidden md:inline-flex bg-brand-primary-deep text-white hover:bg-brand-primary transition-colors text-sm"
          >
            Agendar atendimento
          </Button>
          <HeaderMobileMenu navLinks={NAV_LINKS} onBookingClick={onBookingClick} />
        </div>
      </div>
    </header>
  )
}
