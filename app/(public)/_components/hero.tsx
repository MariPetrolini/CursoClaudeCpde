'use client'

import { Button } from '@/components/ui/button'

type HeroProps = { onBookingClick: () => void }

export function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="min-h-[85vh] flex items-center bg-bg-base py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-block text-xs font-sans uppercase tracking-widest text-brand-accent font-medium">
              Pet Shop de Luxo
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-ink leading-[1.05] -tracking-wide">
              Cuidado que seu melhor amigo merece.
            </h1>
            <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-lg">
              Serviços premium, produtos importados e atenção individualizada para cada pet. Porque eles merecem o melhor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-brand-primary-deep text-white hover:bg-brand-primary transition-colors px-8"
              >
                Agendar atendimento
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-line text-ink hover:bg-surface transition-colors px-8"
                render={<a href="https://wa.me/5511988775522" target="_blank" rel="noopener noreferrer" />}
              >
                Falar no WhatsApp
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full aspect-[4/3] bg-surface rounded-2xl flex items-center justify-center">
              <span className="text-ink-muted font-sans text-sm">Foto do espaço</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
