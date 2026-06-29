'use client'

import { Scissors, Sparkles, Hotel, Baby, Car, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/lib/content/services'
import { ServiceType } from '@/types/database'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Sparkles, Hotel, Baby, Car, ShoppingBag,
}

type ServicesSectionProps = { onBookingClick: (serviceId: ServiceType) => void }

export function ServicesSection({ onBookingClick }: ServicesSectionProps) {
  return (
    <section id="servicos" className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-brand-accent">O que oferecemos</span>
          <h2 className="font-display text-4xl font-semibold text-ink">Nossos serviços</h2>
          <p className="font-sans text-ink-muted max-w-xl mx-auto">
            Cada serviço foi desenvolvido para oferecer o máximo de conforto e cuidado ao seu companheiro.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.iconName]
            return (
              <Card key={service.id} className="border-line bg-bg-base hover:bg-bg-warm transition-colors group">
                <CardHeader className="pb-3">
                  {Icon && <Icon className="h-7 w-7 text-brand-accent mb-3" strokeWidth={1.5} />}
                  <h3 className="font-display text-lg font-semibold text-ink">{service.title}</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{service.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBookingClick(service.id)}
                    className="border-line text-ink hover:bg-surface transition-colors text-xs"
                  >
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
